"""합성 한글 자료로 실제 FastEmbed 모델과 Qdrant local 검색을 검증한다.

기본 단위 테스트와 구분해 DOLMEN_TEST_REAL_EMBEDDINGS=true일 때만 실행한다.
모델 캐시 경로는 DOLMEN_EMBEDDING_CACHE_DIR로 지정할 수 있다.
"""

import math
import os
import tempfile
import unittest
from pathlib import Path

from app.embeddings import ResumeFastEmbedEmbeddings
from app.rag import DOLMEN_EMBEDDING_DIMENSION, DOLMEN_EMBEDDING_MODEL_NAME
from app.resume import ResumePage, sanitize_resume_text, split_resume_page_sections
from app.resume_index import ResumeVectorIndex
from app.resume_store import ResumeDocumentStore


@unittest.skipUnless(
    os.getenv("DOLMEN_TEST_REAL_EMBEDDINGS") == "true",
    "실제 모델 다운로드/인코딩은 명시적 통합 검증에서 실행합니다.",
)
class RealResumeEmbeddingTests(unittest.TestCase):
    @classmethod
    def setUpClass(cls):
        cls.embeddings = ResumeFastEmbedEmbeddings(
            DOLMEN_EMBEDDING_MODEL_NAME,
            DOLMEN_EMBEDDING_DIMENSION,
            os.getenv("DOLMEN_EMBEDDING_CACHE_DIR"),
        )

    def test_korean_semantic_search_preserves_sanitized_company_page_evidence(self):
        with tempfile.TemporaryDirectory() as temporary_directory:
            rag_dir = Path(temporary_directory)
            store = ResumeDocumentStore(rag_dir / "resume-documents.sqlite3")
            index = ResumeVectorIndex(
                rag_dir / "qdrant", self.embeddings, DOLMEN_EMBEDDING_DIMENSION
            )
            try:
                page_texts = [
                    "가상알파 2024.01 ~ 2026.09\nPython과 PostgreSQL로 서버 API를 개발했습니다.\n"
                    "데이터베이스 쿼리를 최적화하고 백엔드 서비스의 응답 속도를 개선했습니다.\n"
                    "010-1234-5678 휴대폰\n8,765만원연봉",
                    "가상베타 2022.01 ~ 2023.12\nFlutter와 Dart로 모바일 앱을 개발했습니다.\n"
                    "아이폰과 안드로이드 앱의 독서 화면과 터치 인터페이스를 구현했습니다.",
                    "가상감마 2020.01 ~ 2021.12\n"
                    "Figma를 사용해 브랜드 로고와 포스터를 디자인했습니다.\n"
                    "인쇄물의 색상과 글꼴을 조정하고 홍보용 그래픽을 제작했습니다.",
                ]
                sections = {}
                for page_number, raw_text in enumerate(page_texts, start=1):
                    page = ResumePage(page_number, sanitize_resume_text(raw_text))
                    for section_number, content in enumerate(
                        split_resume_page_sections(page), start=1
                    ):
                        sections[f"resume-page-{page_number}-section-{section_number}"] = (
                            f"등록 이력서 · {page_number}쪽 · {section_number}절",
                            content,
                        )
                snapshot = store.stage_snapshot("synthetic-korean-resume", sections)
                index.sync(snapshot)
                store.activate_snapshot(snapshot)
                for query, expected_company, expected_page in (
                    ("백엔드 데이터베이스 성능 개선 경험", "가상알파", 1),
                    ("스마트폰 모바일 애플리케이션 개발", "가상베타", 2),
                    ("시각 디자인과 인쇄 홍보물 제작", "가상감마", 3),
                ):
                    with self.subTest(query=query):
                        hits = index.search(query, limit=3)
                        top_document, top_score = hits[0]
                        self.assertIn(expected_company, top_document.content)
                        self.assertIn(f"{expected_page}쪽", top_document.source)
                        self.assertEqual(top_document.version, "synthetic-korean-resume:1")
                        self.assertTrue(math.isfinite(top_score))
                        self.assertTrue(
                            all(
                                hits[position][1] >= hits[position + 1][1]
                                for position in range(len(hits) - 1)
                            )
                        )
                        self.assertTrue(
                            all(
                                "8,765" not in document.content
                                and "010-1234" not in document.content
                                for document, _ in hits
                            )
                        )
            finally:
                index.close()
                store.close()

    def test_adapter_preserves_real_model_passage_query_outputs_and_384_dimensions(self):
        text = "가상회사의 서버와 데이터베이스 개발 경험"
        document_vector = self.embeddings.embed_documents([text])[0]
        query_vector = self.embeddings.embed_query(text)
        model = self.embeddings._load_model()
        self.assertEqual(len(document_vector), DOLMEN_EMBEDDING_DIMENSION)
        self.assertEqual(len(query_vector), DOLMEN_EMBEDDING_DIMENSION)
        self.assertEqual(document_vector, next(model.passage_embed([text])).tolist())
        self.assertEqual(query_vector, next(model.query_embed(text)).tolist())


if __name__ == "__main__":
    unittest.main()
