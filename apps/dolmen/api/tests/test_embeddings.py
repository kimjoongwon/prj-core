"""모델 다운로드 없이 문서·질문 전처리와 벡터 계약을 검증한다."""

import unittest
from unittest.mock import Mock, patch

from app.embeddings import ResumeFastEmbedEmbeddings


class ResumeFastEmbedEmbeddingsTests(unittest.TestCase):
    def setUp(self):
        self.embeddings = ResumeFastEmbedEmbeddings("synthetic/model", 3, "/synthetic/cache")
        self.model = Mock()
        self.model.passage_embed.return_value = iter([[3.0, 4.0, 0.0]])
        self.model.embed.return_value = iter([[4.0, 3.0, 0.0]])
        self.model.query_embed.return_value = iter([[0.0, 3.0, 4.0]])
        self.embeddings._model = self.model

    def test_documents_use_existing_passage_path_without_adding_prefix_or_normalization(self):
        self.assertEqual(self.embeddings.embed_documents(["가상회사 서버 개발"]), [[3.0, 4.0, 0.0]])
        self.model.passage_embed.assert_called_once_with(["가상회사 서버 개발"])
        self.model.embed.assert_not_called()
        self.model.query_embed.assert_not_called()

    def test_query_uses_model_query_path_without_adding_prefix(self):
        self.assertEqual(self.embeddings.embed_query("서버 개발 경력"), [0.0, 3.0, 4.0])
        self.model.query_embed.assert_called_once_with("서버 개발 경력")
        self.model.passage_embed.assert_not_called()

    def test_default_document_mode_uses_official_embed_path(self):
        embeddings = ResumeFastEmbedEmbeddings("synthetic/model", 3, doc_embed_type="default")
        embeddings._model = self.model
        self.assertEqual(embeddings.embed_documents(["가상회사"]), [[4.0, 3.0, 0.0]])
        self.model.embed.assert_called_once_with(["가상회사"])
        self.model.passage_embed.assert_not_called()

    def test_empty_documents_do_not_load_model(self):
        embeddings = ResumeFastEmbedEmbeddings("synthetic/model", 3)
        with patch.object(embeddings, "_load_model") as load_model:
            self.assertEqual(embeddings.embed_documents([]), [])
        load_model.assert_not_called()

    def test_rejects_wrong_dimension_zero_nonfinite_and_wrong_count(self):
        for model_vectors in (
            [[1.0, 2.0]],
            [[True, 1.0, 0.0]],
            [["1.0", 1.0, 0.0]],
            [[0.0, 0.0, 0.0]],
            [[1.0, float("nan"), 0.0]],
            [[float("inf"), 1.0, 0.0]],
            [],
        ):
            with self.subTest(model_vectors=model_vectors):
                self.model.passage_embed.return_value = iter(model_vectors)
                with self.assertRaises(ValueError):
                    self.embeddings.embed_documents(["합성 이력서"])


if __name__ == "__main__":
    unittest.main()
