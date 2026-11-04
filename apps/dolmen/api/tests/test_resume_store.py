"""SQLite 활성 snapshot의 원자 교체와 재시작 계약."""

import sqlite3
import tempfile
import unittest
from pathlib import Path

from app.resume_store import ResumeDocumentStore


class ResumeDocumentStoreTests(unittest.TestCase):
    def setUp(self):
        temporary_directory = tempfile.TemporaryDirectory()
        self.addCleanup(temporary_directory.cleanup)
        self.store_path = Path(temporary_directory.name) / "resume-documents.sqlite3"
        self.store = ResumeDocumentStore(self.store_path)
        self.addCleanup(self.store.close)
        self.first_sections = {
            "resume-page-1-section-1": ("등록 이력서 · 1쪽 · 1절", "가상알파 Python"),
            "resume-page-2-section-1": ("등록 이력서 · 2쪽 · 1절", "가상베타 Flutter"),
        }

    def test_staging_is_invisible_until_full_snapshot_is_activated(self):
        first_snapshot = self.store.stage_snapshot("fingerprint-a", self.first_sections)
        self.assertIsNone(self.store.read_active_snapshot())
        self.store.activate_snapshot(first_snapshot)
        self.assertEqual(self.store.read_active_snapshot(), first_snapshot)
        self.assertTrue(first_snapshot.matches_sections("fingerprint-a", self.first_sections))
        new_sections = {"resume-page-1-section-1": ("등록 이력서 · 1쪽 · 1절", "가상새회사 Rust")}
        next_snapshot = self.store.stage_snapshot("fingerprint-b", new_sections)
        self.assertIsNone(self.store.read_active_snapshot())
        with self.assertRaises(ValueError):
            self.store.activate_snapshot(first_snapshot)
        self.store.activate_snapshot(next_snapshot)
        self.assertEqual(len(self.store.read_active_snapshot().documents), 1)
        self.assertGreater(next_snapshot.revision, first_snapshot.revision)

    def test_reverting_assigns_new_revision_version_and_chunk_ids(self):
        first_snapshot = self.store.stage_snapshot("fingerprint-a", self.first_sections)
        self.store.activate_snapshot(first_snapshot)
        middle_snapshot = self.store.stage_snapshot(
            "fingerprint-b",
            {
                "resume-page-1-section-1": ("등록 이력서 · 1쪽 · 1절", "가상새회사 Rust"),
            },
        )
        self.store.activate_snapshot(middle_snapshot)
        reverted_snapshot = self.store.stage_snapshot("fingerprint-a", self.first_sections)
        self.store.activate_snapshot(reverted_snapshot)
        self.assertGreater(reverted_snapshot.revision, middle_snapshot.revision)
        self.assertTrue(
            {document.chunk_id for document in first_snapshot.documents}.isdisjoint(
                {document.chunk_id for document in reverted_snapshot.documents}
            )
        )
        self.assertTrue(
            all(document.version == "fingerprint-a:3" for document in reverted_snapshot.documents)
        )

    def test_transaction_failure_keeps_previous_complete_snapshot(self):
        first_snapshot = self.store.stage_snapshot("fingerprint-a", self.first_sections)
        self.store.activate_snapshot(first_snapshot)
        with sqlite3.connect(self.store_path) as connection:
            connection.executescript("""
                CREATE TRIGGER reject_synthetic_document BEFORE INSERT ON resume_documents
                WHEN NEW.document_id = 'rejected-section'
                BEGIN SELECT RAISE(ABORT, 'synthetic transaction failure'); END;
            """)
        with self.assertRaises(sqlite3.IntegrityError):
            self.store.stage_snapshot(
                "fingerprint-b",
                {
                    "first-section": ("등록 이력서 · 1쪽 · 1절", "가상 중간절"),
                    "rejected-section": ("등록 이력서 · 2쪽 · 1절", "가상 거절절"),
                },
            )
        self.assertEqual(self.store.read_active_snapshot(), first_snapshot)
        self.assertEqual(self.store.revision, first_snapshot.revision)

    def test_invalidation_survives_restart(self):
        first_snapshot = self.store.stage_snapshot("fingerprint-a", self.first_sections)
        self.store.activate_snapshot(first_snapshot)
        self.store.invalidate()
        restarted_store = ResumeDocumentStore(self.store_path)
        self.addCleanup(restarted_store.close)
        self.assertIsNone(restarted_store.read_active_snapshot())
        self.assertEqual(restarted_store.revision, first_snapshot.revision)

    def test_reuse_requires_exact_source_content_document_ids_and_fingerprint(self):
        snapshot = self.store.stage_snapshot("fingerprint-a", self.first_sections)
        self.assertFalse(snapshot.matches_sections("fingerprint-b", self.first_sections))
        changed_sections = dict(self.first_sections)
        changed_sections["resume-page-1-section-1"] = ("다른 출처", "가상알파 Python")
        self.assertFalse(snapshot.matches_sections("fingerprint-a", changed_sections))
        changed_sections["resume-page-1-section-1"] = ("등록 이력서 · 1쪽 · 1절", "다른 내용")
        self.assertFalse(snapshot.matches_sections("fingerprint-a", changed_sections))
        self.assertFalse(
            snapshot.matches_sections(
                "fingerprint-a",
                {
                    "other-document": self.first_sections["resume-page-1-section-1"],
                },
            )
        )


if __name__ == "__main__":
    unittest.main()
