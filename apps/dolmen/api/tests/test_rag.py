"""실제 SQLite 저장소와 합성 PDF 추출 결과로 등록본 교체를 검증한다."""

import json
import sqlite3
import tempfile
import threading
import unittest
from pathlib import Path
from unittest.mock import Mock, patch

from langchain_core.embeddings import Embeddings

from app.rag import DOLMEN_RAG_DIR, DolmenRagService
from app.resume import ResumeUnavailableError
from app.resume_index import ResumeVectorIndex
from app.settings import ResumeSettings


class SyntheticResumeEmbeddings(Embeddings):
    """검색 품질과 분리해 revision·메타데이터를 검증하는 결정적 벡터."""

    def embed_documents(self, texts):
        return [self.embed_query(text) for text in texts]

    def embed_query(self, text):
        return [
            float(keyword.lower() in text.lower())
            for keyword in ("Python", "Rust", "Java", "Flutter", "Kotlin")
        ] + [0.1]


class ResumeRagTests(unittest.TestCase):
    def setUp(self):
        debug_env = patch.dict("os.environ", {"DOLMEN_DEBUG_ENABLED": "false"})
        debug_env.start()
        self.addCleanup(debug_env.stop)
        self.temp_dir = tempfile.TemporaryDirectory()
        self.addCleanup(self.temp_dir.cleanup)
        self.api_dir = Path(self.temp_dir.name)
        self.resume_path = self.api_dir / "private.pdf"
        self.resume_path.write_bytes(b"synthetic-version-one")
        self.settings = ResumeSettings(self.resume_path, "가상지원자", "2026-09-27")
        self.rag_dir = self.api_dir / ".rag" / "resume"
        self.service = DolmenRagService(self.settings, self.rag_dir)
        self.addCleanup(self.service.close)
        self.backend = ResumeVectorIndex(
            self.rag_dir / "qdrant-langchain-v1", SyntheticResumeEmbeddings(), 6
        )
        self.backend.sync = Mock(wraps=self.backend.sync)
        self.backend_patch = patch.object(
            self.service, "_create_search_backend", return_value=self.backend
        )
        self.backend_patch.start()
        self.addCleanup(self.backend_patch.stop)
        self.pdf_reader_patch = patch("app.resume.PdfReader")
        self.reader_factory = self.pdf_reader_patch.start()
        self.addCleanup(self.pdf_reader_patch.stop)
        self.set_pages("경력사항\n가상회사 Python 2020.01 ~ 2022.12\n8,765만원연봉")

    def set_pages(self, *page_texts):
        pdf_pages = []
        for page_text in page_texts:
            pdf_page = Mock()
            pdf_page.extract_text.return_value = page_text
            pdf_pages.append(pdf_page)
        self.reader_factory.return_value = Mock(is_encrypted=False, pages=pdf_pages)

    def test_status_contract_and_sanitized_search_evidence(self):
        resume_status = self.service.read_document_status()
        self.assertEqual(
            set(resume_status),
            {
                "revision",
                "sources",
                "resume_configured",
                "resume_ready",
                "section_count",
                "candidate_name",
                "resume_updated_at",
            },
        )
        self.assertTrue(resume_status["resume_configured"])
        self.assertTrue(resume_status["resume_ready"])
        self.assertEqual(resume_status["candidate_name"], "가상지원자")
        self.assertEqual(resume_status["resume_updated_at"], "2026-09-27")
        self.assertEqual(resume_status["sources"], ["등록 이력서 · 1쪽 · 1절"])
        reply_context = self.service.retrieve_reply_context("Python")
        self.assertEqual(reply_context.revision, resume_status["revision"])
        self.assertIn("2020.01 ~ 2022.12", reply_context.grounds[0].content)
        self.assertNotIn("8,765", reply_context.grounds[0].content)
        self.assertNotIn("연봉", reply_context.grounds[0].snippet)
        self.assertEqual(len(reply_context.resume_pages), 1)
        self.assertNotIn("8,765", reply_context.resume_pages[0].text)
        self.backend.sync.assert_called_once()

    def test_old_wiki_store_is_not_opened_or_searched(self):
        self.assertEqual(DOLMEN_RAG_DIR.parts[-2:], (".rag", "resume"))
        wiki_path = self.api_dir / ".rag" / "documents.db"
        with sqlite3.connect(wiki_path) as wiki_store:
            wiki_store.execute("CREATE TABLE old_wiki (content TEXT)")
            wiki_store.execute("INSERT INTO old_wiki VALUES ('Python 위키 휴가 15일')")
        old_wiki_bytes = wiki_path.read_bytes()
        self.service.ensure_resume_ingested()
        resume_snapshot = self.service.store.read_active_snapshot()
        self.assertTrue(
            all("위키" not in document.content for document in resume_snapshot.documents)
        )
        self.assertEqual(wiki_path.read_bytes(), old_wiki_bytes)

    def test_replacement_removes_previous_extra_pages_and_reverting_is_supported(self):
        self.set_pages("첫회사 Python", "삭제할회사 Java")
        first_status = self.service.read_document_status()
        self.assertEqual(first_status["section_count"], 2)
        self.resume_path.write_bytes(b"synthetic-version-two")
        self.set_pages("새회사 Rust 2025.01 ~ 2026.09")
        second_status = self.service.read_document_status()
        self.assertGreater(second_status["revision"], first_status["revision"])
        self.assertEqual(second_status["section_count"], 1)
        active_chunks = self.service.store.read_active_snapshot().documents
        self.assertEqual(len(active_chunks), 1)
        self.assertNotIn("삭제할회사", active_chunks[0].content)
        self.assertNotIn("첫회사", active_chunks[0].content)
        self.assertTrue(
            all(
                "삭제할회사" not in ground.content
                for ground in self.service.search_grounds("삭제할회사")
            )
        )
        replacement_context = self.service.retrieve_reply_context("Rust")
        self.assertEqual(len(replacement_context.resume_pages), 1)
        self.assertNotIn("첫회사", replacement_context.resume_pages[0].text)
        self.assertIn("새회사 Rust", replacement_context.resume_pages[0].text)
        self.resume_path.write_bytes(b"synthetic-version-one")
        self.set_pages("첫회사 Python", "삭제할회사 Java")
        third_status = self.service.read_document_status()
        self.assertGreater(third_status["revision"], second_status["revision"])
        self.assertEqual(third_status["section_count"], 2)
        self.assertIn("Python", self.service.search_grounds("Python")[0].content)

    def test_restart_reuses_only_matching_complete_sanitized_documents(self):
        first_status = self.service.read_document_status()
        self.service.close()
        restarted_service = DolmenRagService(self.settings, self.rag_dir)
        self.addCleanup(restarted_service.close)
        restarted_backend = ResumeVectorIndex(
            self.rag_dir / "qdrant-langchain-v1", SyntheticResumeEmbeddings(), 6
        )
        with patch.object(
            restarted_service, "_create_search_backend", return_value=restarted_backend
        ):
            restarted_status = restarted_service.read_document_status()
        self.assertEqual(restarted_status, first_status)

    def test_restart_rebuilds_same_fingerprint_when_stored_content_differs(self):
        first_status = self.service.read_document_status()
        self.service.close()
        with sqlite3.connect(self.rag_dir / "resume-documents.sqlite3") as connection:
            connection.execute("UPDATE resume_documents SET content = 'wrong synthetic content'")
        restarted_service = DolmenRagService(self.settings, self.rag_dir)
        self.addCleanup(restarted_service.close)
        restarted_backend = ResumeVectorIndex(
            self.rag_dir / "qdrant-langchain-v1", SyntheticResumeEmbeddings(), 6
        )
        with patch.object(
            restarted_service, "_create_search_backend", return_value=restarted_backend
        ):
            restarted_status = restarted_service.read_document_status()
            grounds = restarted_service.search_grounds("Python")
        self.assertGreater(restarted_status["revision"], first_status["revision"])
        self.assertNotIn("wrong synthetic", grounds[0].content)
        self.assertIn("Python", grounds[0].content)

    def test_missing_resume_does_not_use_previous_registered_data(self):
        self.service.ensure_resume_ingested()
        self.resume_path.unlink()
        with self.assertRaises(ResumeUnavailableError) as raised:
            self.service.search_grounds("Python")
        self.assertEqual(raised.exception.code, "resume_not_configured")
        self.assertIsNone(self.service.store.read_active_snapshot())
        with self.assertRaises(ValueError):
            self.backend.search("Python")

    def test_failed_replacement_is_not_reported_as_ready(self):
        self.service.ensure_resume_ingested()
        self.resume_path.write_bytes(b"new-invalid-pdf")
        self.reader_factory.side_effect = ValueError("PRIVATE_SOURCE")
        with self.assertRaises(ResumeUnavailableError) as raised:
            self.service.read_document_status()
        self.assertEqual(raised.exception.code, "resume_not_ready")
        self.assertNotIn("PRIVATE_SOURCE", str(raised.exception))
        self.assertEqual(self.service._resume_pages, [])
        self.assertIsNone(self.service.store.read_active_snapshot())
        with self.assertRaises(ValueError):
            self.backend.search("Python")

    def test_full_page_context_includes_company_boundaries_missing_from_top_hit(self):
        self.set_pages(
            "가상알파 2025.01 ~ 작성 당시 재직 중\n서버 개발\nKotlin PostgreSQL",
            "가상베타 2022.10 ~ 2024.12\n앱 개발\nFlutter Dart\n8,765만원연봉",
        )
        reply_context = self.service.retrieve_reply_context("Flutter", limit=1)
        self.assertEqual(len(reply_context.grounds), 1)
        self.assertIn("2쪽", reply_context.grounds[0].source)
        self.assertEqual([page.page_number for page in reply_context.resume_pages], [1, 2])
        self.assertIn("가상알파", reply_context.resume_pages[0].text)
        self.assertIn("Kotlin", reply_context.resume_pages[0].text)
        self.assertIn("가상베타", reply_context.resume_pages[1].text)
        self.assertNotIn("8,765", reply_context.resume_pages[1].text)

    def test_index_failure_blocks_search_until_successful_sync(self):
        self.backend.sync.side_effect = RuntimeError("PRIVATE_INDEX_EXCEPTION")
        with self.assertRaises(ResumeUnavailableError) as raised:
            self.service.search_grounds("Python")
        self.assertEqual(raised.exception.code, "resume_not_ready")
        self.assertNotIn("PRIVATE_INDEX_EXCEPTION", str(raised.exception))
        self.assertIsNone(self.service.store.read_active_snapshot())
        self.backend.sync.side_effect = None
        self.assertEqual(len(self.service.search_grounds("Python")), 1)

    def test_search_failure_is_explicit_and_does_not_return_empty_success(self):
        self.backend.search = Mock(side_effect=RuntimeError("PRIVATE_SEARCH_EXCEPTION"))
        with self.assertRaises(ResumeUnavailableError) as raised:
            self.service.search_grounds("Python")
        self.assertEqual(raised.exception.code, "resume_not_ready")
        self.assertNotIn("PRIVATE_SEARCH_EXCEPTION", str(raised.exception))
        self.assertIsNone(self.service.store.read_active_snapshot())

    def test_failed_new_snapshot_never_serves_old_vectors_and_can_retry(self):
        first_context = self.service.retrieve_reply_context("Python")
        self.resume_path.write_bytes(b"synthetic-new-snapshot")
        self.set_pages("가상새회사 Rust")
        original_add_documents = self.backend.vector_store.add_documents
        with patch.object(
            self.backend.vector_store,
            "add_documents",
            side_effect=RuntimeError("PRIVATE_VECTOR_FAILURE"),
        ):
            with self.assertRaises(ResumeUnavailableError):
                self.service.retrieve_reply_context("Python")
        self.assertIsNone(self.service.store.read_active_snapshot())
        self.assertEqual(self.service._resume_pages, [])
        with self.assertRaises(ValueError):
            self.backend.search("Python")
        self.assertEqual(self.backend.vector_store.add_documents, original_add_documents)
        new_context = self.service.retrieve_reply_context("Rust")
        self.assertGreater(new_context.revision, first_context.revision)
        self.assertTrue(all("Python" not in ground.content for ground in new_context.grounds))

    def test_reply_context_holds_same_snapshot_revision_during_replacement(self):
        initial_context = self.service.retrieve_reply_context("Python")
        search_started = threading.Event()
        release_search = threading.Event()
        replacement_started = threading.Event()
        replacement_completed = threading.Event()
        reply_contexts = []
        thread_errors = []
        original_search = self.backend.search

        def blocking_search(query, limit=5):
            search_started.set()
            if not release_search.wait(timeout=5):
                raise TimeoutError("synthetic search release timeout")
            return original_search(query, limit)

        def retrieve_context():
            try:
                reply_contexts.append(self.service.retrieve_reply_context("Python"))
            except Exception as error:
                thread_errors.append(error)

        def replace_resume():
            try:
                self.resume_path.write_bytes(b"synthetic-concurrent-replacement")
                self.set_pages("가상새회사 Rust")
                replacement_started.set()
                self.service.ensure_resume_ingested()
                replacement_completed.set()
            except Exception as error:
                thread_errors.append(error)

        with patch.object(self.backend, "search", side_effect=blocking_search):
            search_thread = threading.Thread(target=retrieve_context)
            replacement_thread = threading.Thread(target=replace_resume)
            search_thread.start()
            try:
                self.assertTrue(search_started.wait(timeout=5))
                replacement_thread.start()
                self.assertTrue(replacement_started.wait(timeout=5))
                self.assertFalse(replacement_completed.is_set())
                self.assertEqual(self.service.store.revision, initial_context.revision)
            finally:
                release_search.set()
                search_thread.join(timeout=5)
                if replacement_thread.ident is not None:
                    replacement_thread.join(timeout=5)
        self.assertFalse(search_thread.is_alive())
        self.assertFalse(replacement_thread.is_alive())
        self.assertEqual(thread_errors, [])
        self.assertEqual(reply_contexts[0].revision, initial_context.revision)
        self.assertEqual(reply_contexts[0].resume_pages, initial_context.resume_pages)
        self.assertIn("Python", reply_contexts[0].grounds[0].content)
        self.assertGreater(self.service.store.revision, initial_context.revision)
        self.assertIn("Rust", self.service.retrieve_reply_context("Rust").grounds[0].content)

    def test_ground_contract_keeps_raw_cosine_direction_and_four_decimal_precision(self):
        self.service.ensure_resume_ingested()
        document = self.service.store.read_active_snapshot().documents[0]
        with patch.object(self.backend, "search", return_value=[(document, 0.123456)]):
            ground = self.service.search_grounds("Python")[0]
        self.assertEqual(ground.score, 0.1235)
        self.assertEqual(ground.chunk_id, document.chunk_id)
        self.assertEqual(ground.source, document.source)
        self.assertEqual(ground.version, document.version)
        with patch.object(self.backend, "search", return_value=[(document, -0.5)]):
            self.assertEqual(self.service.search_grounds("Python")[0].score, -0.5)

    def test_nonfinite_score_is_explicit_failure_and_invalidates_snapshot(self):
        self.service.ensure_resume_ingested()
        document = self.service.store.read_active_snapshot().documents[0]
        with patch.object(self.backend, "search", return_value=[(document, float("nan"))]):
            with self.assertRaises(ResumeUnavailableError):
                self.service.search_grounds("Python")
        self.assertIsNone(self.service.store.read_active_snapshot())

    def test_debug_snapshot_exposes_only_current_sanitized_sections_and_safe_config(self):
        self.set_pages(
            "이메일 synthetic@example.test\n010-1234-5678 휴대폰\n"
            "경력사항\n가상알파 Kotlin 2024.01 ~ 2026.09\n" + "가상 업무\n" * 80,
        )
        with patch.dict(
            "os.environ",
            {
                "DOLMEN_DEBUG_ENABLED": "true",
                "LLM_MODEL_ID": "synthetic-model/v1",
                "LLM_API_KEY": "PRIVATE_KEY_MARKER",
                "LLM_BASE_URL": "https://private.invalid/v1",
            },
        ):
            document_status = self.service.read_document_status()
        debug = document_status["debug"]
        self.assertEqual(
            set(debug),
            {
                "page_count",
                "sanitized_character_count",
                "embedding_model",
                "retrieval_limit",
                "context_policy",
                "privacy_filter_version",
                "index_version",
                "model_id",
                "history_turn_limit",
                "session_limit",
                "sections",
            },
        )
        self.assertEqual(debug["page_count"], 1)
        self.assertEqual(debug["model_id"], "synthetic-model/v1")
        self.assertEqual(debug["context_policy"], "full_sanitized_resume")
        self.assertEqual(debug["retrieval_limit"], 5)
        self.assertEqual(debug["history_turn_limit"], 2)
        self.assertEqual(debug["session_limit"], 50)
        self.assertEqual(
            debug["sanitized_character_count"],
            sum(len(page.text) for page in self.service._resume_pages),
        )
        self.assertEqual(len(debug["sections"]), document_status["section_count"])
        for section in debug["sections"]:
            self.assertEqual(
                set(section), {"document_id", "source", "version", "character_count", "snippet"}
            )
            stored_document = next(
                document
                for document in self.service.store.read_active_snapshot().documents
                if document.document_id == section["document_id"]
            )
            self.assertEqual(section["character_count"], len(stored_document.content))
            self.assertEqual(section["snippet"], stored_document.content.strip()[:220])
            self.assertLessEqual(len(section["snippet"]), 220)
        serialized_status = json.dumps(document_status)
        for private_marker in (
            "synthetic@example",
            "010-1234",
            "PRIVATE_KEY_MARKER",
            "private.invalid",
            self.temp_dir.name,
            "private.pdf",
        ):
            self.assertNotIn(private_marker, serialized_status)

    def test_debug_snapshot_replaces_old_pages_and_never_includes_whole_section(self):
        with patch.dict("os.environ", {"DOLMEN_DEBUG_ENABLED": "true"}):
            self.set_pages("이전회사 Python", "제거할회사 Java")
            old_status = self.service.read_document_status()
            self.resume_path.write_bytes(b"new-debug-resume")
            self.set_pages("새회사 Kotlin\n" + "가상 업무\n" * 80 + "SECTION_END_MARKER")
            new_status = self.service.read_document_status()
        self.assertGreater(new_status["revision"], old_status["revision"])
        self.assertEqual(new_status["debug"]["page_count"], 1)
        serialized_status = json.dumps(new_status, ensure_ascii=False)
        self.assertNotIn("제거할회사", serialized_status)
        self.assertNotIn("SECTION_END_MARKER", serialized_status)

    def test_debug_metadata_failure_keeps_original_ready_status(self):
        with patch.dict("os.environ", {"DOLMEN_DEBUG_ENABLED": "true"}):
            with patch("app.rag.read_debug_model_id", side_effect=RuntimeError("PRIVATE_DEBUG")):
                document_status = self.service.read_document_status()
        self.assertTrue(document_status["resume_ready"])
        self.assertNotIn("debug", document_status)


if __name__ == "__main__":
    unittest.main()
