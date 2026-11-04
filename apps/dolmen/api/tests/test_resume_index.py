"""실제 Qdrant local과 결정적 벡터로 snapshot 검색 계약을 검증한다."""

import tempfile
import unittest
from pathlib import Path
from unittest.mock import Mock, patch

from langchain_core.embeddings import Embeddings
from qdrant_client import models

from app.resume_index import RESUME_COLLECTION_NAME, ResumeVectorIndex
from app.resume_store import ResumeDocumentStore


class CosineTestEmbeddings(Embeddings):
    def embed_documents(self, texts):
        return [self.embed_query(text) for text in texts]

    def embed_query(self, text):
        return {"일치": [3.0, 0.0, 0.0], "직교": [0.0, 5.0, 0.0], "반대": [-2.0, 0.0, 0.0]}.get(
            text, [1.0, 1.0, 1.0]
        )


class ResumeVectorIndexTests(unittest.TestCase):
    def setUp(self):
        temporary_directory = tempfile.TemporaryDirectory()
        self.addCleanup(temporary_directory.cleanup)
        self.rag_dir = Path(temporary_directory.name)
        self.store = ResumeDocumentStore(self.rag_dir / "resume-documents.sqlite3")
        self.addCleanup(self.store.close)
        self.index = ResumeVectorIndex(self.rag_dir / "qdrant", CosineTestEmbeddings(), 3)
        self.addCleanup(self.index.close)
        self.sections = {
            f"section-{index}": (f"등록 이력서 · {index}쪽 · 1절", content)
            for index, content in enumerate(("일치", "직교", "반대"), start=1)
        }
        self.snapshot = self.store.stage_snapshot("synthetic-a", self.sections)
        self.index.sync(self.snapshot)
        self.store.activate_snapshot(self.snapshot)

    def test_cosine_scores_are_normalized_by_qdrant_with_higher_similarity_first(self):
        search_hits = self.index.search("일치")
        self.assertEqual(
            [document.content for document, _ in search_hits], ["일치", "직교", "반대"]
        )
        for (_, cosine_score), expected_score in zip(search_hits, (1.0, 0.0, -1.0), strict=True):
            self.assertAlmostEqual(cosine_score, expected_score, places=6)
        self.assertEqual(search_hits[0][0].source, "등록 이력서 · 1쪽 · 1절")
        self.assertEqual(search_hits[0][0].version, "synthetic-a:1")

    def test_matching_restart_does_not_reembed_but_rebuilds_missing_point(self):
        with patch.object(
            self.index.vector_store, "add_documents", wraps=self.index.vector_store.add_documents
        ) as add_documents:
            self.index.sync(self.snapshot)
            add_documents.assert_not_called()
            self.index.client.delete(
                RESUME_COLLECTION_NAME,
                models.PointIdsList(points=[self.snapshot.documents[0].chunk_id]),
            )
            self.index.sync(self.snapshot)
            add_documents.assert_called_once()
        self.assertEqual(len(self.index.search("일치")), 3)

    def test_replacement_purges_retired_points_and_uses_only_new_revision(self):
        next_snapshot = self.store.stage_snapshot(
            "synthetic-b",
            {
                "section-1": ("등록 이력서 · 1쪽 · 1절", "직교"),
            },
        )
        self.index.sync(next_snapshot)
        self.store.activate_snapshot(next_snapshot)
        self.assertEqual(self.index.client.count(RESUME_COLLECTION_NAME, exact=True).count, 1)
        search_hits = self.index.search("일치")
        self.assertEqual([document.content for document, _ in search_hits], ["직교"])
        self.assertTrue(all(document.version == "synthetic-b:2" for document, _ in search_hits))

    def test_tampered_content_source_or_version_is_rejected(self):
        for payload_key, bad_value in (
            ("page_content", "altered content"),
            ("metadata.source", "wrong source"),
            ("metadata.version", "wrong version"),
            ("metadata._id", "wrong point id"),
        ):
            with self.subTest(payload_key=payload_key):
                self.index.sync(self.snapshot)
                original_search = self.index.vector_store.similarity_search_with_score
                hit_document, cosine_score = original_search("일치", k=1)[0]
                if payload_key == "page_content":
                    hit_document.page_content = bad_value
                else:
                    hit_document.metadata[payload_key.split(".")[1]] = bad_value
                with patch.object(
                    self.index.vector_store,
                    "similarity_search_with_score",
                    return_value=[(hit_document, cosine_score)],
                ):
                    with self.assertRaises(ValueError):
                        self.index.search("일치", limit=1)

    def test_partial_upload_failure_never_publishes_searchable_snapshot(self):
        next_snapshot = self.store.stage_snapshot(
            "synthetic-b",
            {
                "section-1": ("등록 이력서 · 1쪽 · 1절", "직교"),
            },
        )
        with patch.object(self.index.vector_store, "add_documents", side_effect=RuntimeError):
            with self.assertRaises(RuntimeError):
                self.index.sync(next_snapshot)
        with self.assertRaises(ValueError):
            self.index.search("일치")
        self.assertIsNone(self.store.read_active_snapshot())

    def test_uses_qdrant_query_api_through_langchain(self):
        original_query_points = self.index.client.query_points
        with patch.object(
            self.index.client, "query_points", Mock(wraps=original_query_points)
        ) as query:
            self.index.search("일치", limit=1)
        query.assert_called_once()
        self.assertEqual(
            query.call_args.kwargs["query_filter"],
            self.index._revision_filter(self.snapshot.revision),
        )


if __name__ == "__main__":
    unittest.main()
