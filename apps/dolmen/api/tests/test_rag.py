"""실제 SQLite 저장소와 합성 PDF 추출 결과로 등록본 교체를 검증한다."""

import tempfile
import unittest
from pathlib import Path
from unittest.mock import Mock, patch

from hello_agents.retrieval import RAGStore

from app.rag import DOLMEN_RAG_DIR, DolmenRagService
from app.resume import ResumeUnavailableError
from app.settings import ResumeSettings


class LocalSearchBackend:
    """외부 임베딩/모델 호출 없이 저장된 활성 문서만 조회하는 테스트 검색기."""

    def __init__(self, store):
        self.store = store
        self.sync = Mock()

    def search(self, query, limit=5):
        return self.store.search(query, limit)


class ResumeRagTests(unittest.TestCase):
    def setUp(self):
        self.temp_dir = tempfile.TemporaryDirectory()
        self.addCleanup(self.temp_dir.cleanup)
        self.api_dir = Path(self.temp_dir.name)
        self.resume_path = self.api_dir / "private.pdf"
        self.resume_path.write_bytes(b"synthetic-version-one")
        self.settings = ResumeSettings(self.resume_path, "가상지원자", "2026-09-27")
        self.rag_dir = self.api_dir / ".rag" / "resume"
        self.service = DolmenRagService(self.settings, self.rag_dir)
        self.backend = LocalSearchBackend(self.service.store)
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
        self.assertEqual(set(resume_status), {
            "revision", "sources", "resume_configured", "resume_ready", "section_count",
            "candidate_name", "resume_updated_at",
        })
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
        wiki_store = RAGStore(str(self.api_dir / ".rag" / "documents.db"))
        wiki_store.add_document("Python 위키 휴가 15일", "old-onboarding-wiki.md")
        self.service.ensure_resume_ingested()
        _, resume_chunks = self.service.store.snapshot()
        self.assertTrue(all("위키" not in chunk.content for chunk in resume_chunks))
        self.assertEqual(len(wiki_store.snapshot()[1]), 1)

    def test_replacement_removes_previous_extra_pages_and_reverting_is_supported(self):
        self.set_pages("첫회사 Python", "삭제할회사 Java")
        first_status = self.service.read_document_status()
        self.assertEqual(first_status["section_count"], 2)
        self.resume_path.write_bytes(b"synthetic-version-two")
        self.set_pages("새회사 Rust 2025.01 ~ 2026.09")
        second_status = self.service.read_document_status()
        self.assertGreater(second_status["revision"], first_status["revision"])
        self.assertEqual(second_status["section_count"], 1)
        _, active_chunks = self.service.store.snapshot()
        self.assertEqual(len(active_chunks), 1)
        self.assertNotIn("삭제할회사", active_chunks[0].content)
        self.assertNotIn("첫회사", active_chunks[0].content)
        self.assertEqual(self.service.search_grounds("삭제할회사"), [])
        replacement_context = self.service.retrieve_reply_context("Rust")
        self.assertEqual(len(replacement_context.resume_pages), 1)
        self.assertNotIn("첫회사", replacement_context.resume_pages[0].text)
        self.assertIn("새회사 Rust", replacement_context.resume_pages[0].text)
        self.resume_path.write_bytes(b"synthetic-version-one")
        self.set_pages("첫회사 Python", "삭제할회사 Java")
        third_status = self.service.read_document_status()
        self.assertGreater(third_status["revision"], second_status["revision"])
        self.assertEqual(third_status["section_count"], 2)
        self.assertEqual(len(self.service.search_grounds("Python")), 1)

    def test_restart_reuses_only_matching_complete_sanitized_documents(self):
        first_status = self.service.read_document_status()
        restarted_service = DolmenRagService(self.settings, self.rag_dir)
        restarted_backend = LocalSearchBackend(restarted_service.store)
        with patch.object(
            restarted_service, "_create_search_backend", return_value=restarted_backend
        ):
            restarted_status = restarted_service.read_document_status()
        self.assertEqual(restarted_status, first_status)

    def test_missing_resume_does_not_use_previous_registered_data(self):
        self.service.ensure_resume_ingested()
        self.resume_path.unlink()
        with self.assertRaises(ResumeUnavailableError) as raised:
            self.service.search_grounds("Python")
        self.assertEqual(raised.exception.code, "resume_not_configured")

    def test_failed_replacement_is_not_reported_as_ready(self):
        self.service.ensure_resume_ingested()
        self.resume_path.write_bytes(b"new-invalid-pdf")
        self.reader_factory.side_effect = ValueError("PRIVATE_SOURCE")
        with self.assertRaises(ResumeUnavailableError) as raised:
            self.service.read_document_status()
        self.assertEqual(raised.exception.code, "resume_not_ready")
        self.assertNotIn("PRIVATE_SOURCE", str(raised.exception))
        self.assertEqual(self.service._resume_pages, [])

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
        self.backend.sync.side_effect = None
        self.assertEqual(len(self.service.search_grounds("Python")), 1)

    def test_search_failure_is_explicit_and_does_not_return_empty_success(self):
        self.backend.search = Mock(side_effect=RuntimeError("PRIVATE_SEARCH_EXCEPTION"))
        with self.assertRaises(ResumeUnavailableError) as raised:
            self.service.search_grounds("Python")
        self.assertEqual(raised.exception.code, "resume_not_ready")
        self.assertNotIn("PRIVATE_SEARCH_EXCEPTION", str(raised.exception))


if __name__ == "__main__":
    unittest.main()
