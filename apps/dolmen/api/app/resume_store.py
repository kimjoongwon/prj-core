"""정제된 이력서의 revision과 활성 문서 집합을 원자적으로 보관한다."""

import sqlite3
import threading
import uuid
from dataclasses import dataclass
from pathlib import Path


@dataclass(frozen=True)
class ResumeDocument:
    document_id: str
    chunk_id: str
    source: str
    version: str
    content: str


@dataclass(frozen=True)
class ResumeSnapshot:
    revision: int
    fingerprint: str
    documents: tuple[ResumeDocument, ...]

    def matches_sections(self, fingerprint: str, sections: dict[str, tuple[str, str]]) -> bool:
        return (
            self.fingerprint == fingerprint
            and len(self.documents) == len(sections)
            and all(
                document.version == f"{fingerprint}:{self.revision}" for document in self.documents
            )
            and {
                document.document_id: (document.source, document.content)
                for document in self.documents
            }
            == sections
        )


class ResumeDocumentStore:
    """활성화 전의 교체본은 검색에 공개하지 않는 프레임워크 독립 SQLite 저장소."""

    def __init__(self, path: Path) -> None:
        path.parent.mkdir(parents=True, exist_ok=True)
        self._lock = threading.RLock()
        self._connection = sqlite3.connect(path, check_same_thread=False)
        self._connection.row_factory = sqlite3.Row
        self._connection.execute("PRAGMA foreign_keys = ON")
        self._connection.executescript("""
            CREATE TABLE IF NOT EXISTS resume_state (
                singleton INTEGER PRIMARY KEY CHECK (singleton = 1),
                revision INTEGER NOT NULL,
                active_revision INTEGER
            );
            INSERT OR IGNORE INTO resume_state VALUES (1, 0, NULL);
            CREATE TABLE IF NOT EXISTS resume_snapshots (
                revision INTEGER PRIMARY KEY,
                fingerprint TEXT NOT NULL
            );
            CREATE TABLE IF NOT EXISTS resume_documents (
                revision INTEGER NOT NULL REFERENCES resume_snapshots(revision),
                document_id TEXT NOT NULL,
                chunk_id TEXT NOT NULL UNIQUE,
                source TEXT NOT NULL,
                version TEXT NOT NULL,
                content TEXT NOT NULL,
                PRIMARY KEY (revision, document_id)
            );
        """)

    @property
    def revision(self) -> int:
        with self._lock:
            return self._connection.execute(
                "SELECT revision FROM resume_state WHERE singleton = 1"
            ).fetchone()[0]

    def _read_snapshot(self, revision: int) -> ResumeSnapshot:
        fingerprint = self._connection.execute(
            "SELECT fingerprint FROM resume_snapshots WHERE revision = ?", (revision,)
        ).fetchone()[0]
        document_rows = self._connection.execute(
            """SELECT document_id, chunk_id, source, version, content
               FROM resume_documents WHERE revision = ? ORDER BY document_id""",
            (revision,),
        ).fetchall()
        return ResumeSnapshot(
            revision, fingerprint, tuple(ResumeDocument(**dict(row)) for row in document_rows)
        )

    def read_active_snapshot(self) -> ResumeSnapshot | None:
        with self._lock:
            # 한 SQL read transaction에서 활성 포인터와 원문을 함께 읽는다.
            with self._connection:
                self._connection.execute("BEGIN")
                active_revision = self._connection.execute(
                    "SELECT active_revision FROM resume_state WHERE singleton = 1"
                ).fetchone()[0]
                return None if active_revision is None else self._read_snapshot(active_revision)

    def stage_snapshot(
        self, fingerprint: str, sections: dict[str, tuple[str, str]]
    ) -> ResumeSnapshot:
        if (
            not fingerprint
            or not sections
            or any(not content.strip() for _, content in sections.values())
        ):
            raise ValueError("색인할 정제 이력서 절이 필요합니다.")
        with self._lock, self._connection:
            self._connection.execute("BEGIN IMMEDIATE")
            revision = self.revision + 1
            version = f"{fingerprint}:{revision}"
            self._connection.execute(
                "INSERT INTO resume_snapshots VALUES (?, ?)", (revision, fingerprint)
            )
            for document_id, (source, content) in sorted(sections.items()):
                chunk_id = str(
                    uuid.uuid5(
                        uuid.NAMESPACE_URL, f"dolmen-resume:{revision}:{version}:{document_id}"
                    )
                )
                self._connection.execute(
                    "INSERT INTO resume_documents VALUES (?, ?, ?, ?, ?, ?)",
                    (revision, document_id, chunk_id, source, version, content),
                )
            self._connection.execute(
                "UPDATE resume_state SET revision = ?, active_revision = NULL WHERE singleton = 1",
                (revision,),
            )
            return self._read_snapshot(revision)

    def activate_snapshot(self, snapshot: ResumeSnapshot) -> None:
        with self._lock, self._connection:
            self._connection.execute("BEGIN IMMEDIATE")
            if (
                self.revision != snapshot.revision
                or self._read_snapshot(snapshot.revision) != snapshot
            ):
                raise ValueError("색인 중 이력서 revision이 바뀌었습니다.")
            self._connection.execute(
                "UPDATE resume_state SET active_revision = ? WHERE singleton = 1",
                (snapshot.revision,),
            )

    def invalidate(self) -> None:
        with self._lock, self._connection:
            self._connection.execute(
                "UPDATE resume_state SET active_revision = NULL WHERE singleton = 1"
            )

    def close(self) -> None:
        with self._lock:
            self._connection.close()
