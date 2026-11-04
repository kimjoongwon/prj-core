"""등록 이력서만 검색하는 로컬 색인. 기존 .rag 위키 저장소와 분리한다."""

import hashlib
import math
import os
import re
import threading
from dataclasses import dataclass
from pathlib import Path

from app.embeddings import ResumeFastEmbedEmbeddings
from app.resume import (
    SANITIZER_VERSION,
    ResumePage,
    ResumeUnavailableError,
    extract_sanitized_resume_pages,
    read_resume_pdf_bytes,
    split_resume_page_sections,
)
from app.resume_index import ResumeVectorIndex
from app.resume_store import ResumeDocumentStore
from app.settings import (
    DOLMEN_API_DIR,
    MAX_CHAT_HISTORY_TURNS,
    MAX_CHAT_SESSIONS,
    RESUME_CONTEXT_POLICY,
    RETRIEVED_GROUNDS_LIMIT,
    ResumeSettings,
    is_debug_enabled,
    read_debug_model_id,
    read_resume_settings,
)

DOLMEN_RAG_DIR = DOLMEN_API_DIR / ".rag" / "resume"
DOLMEN_EMBEDDING_CACHE_DIR = os.getenv("DOLMEN_EMBEDDING_CACHE_DIR") or None
DOLMEN_EMBEDDING_MODEL_NAME = "sentence-transformers/paraphrase-multilingual-MiniLM-L12-v2"
DOLMEN_EMBEDDING_DIMENSION = 384
RESUME_INDEX_VERSION = "resume-langchain-passage-query-v1"


@dataclass(frozen=True)
class RetrievedGround:
    chunk_id: str
    source: str
    version: str
    score: float
    snippet: str
    content: str

    @property
    def page_number(self) -> int:
        match = re.search(r"등록 이력서 · (\d{1,4})쪽", self.source)
        return int(match.group(1)) if match else 0


@dataclass(frozen=True)
class ResumeReplyContext:
    grounds: list[RetrievedGround]
    revision: int
    resume_settings: ResumeSettings
    resume_pages: list[ResumePage]


class DolmenRagService:
    """공개 문서 쓰기 없이 서버에 등록된 PDF의 정제본만 색인한다."""

    def __init__(
        self,
        resume_settings: ResumeSettings | None = None,
        rag_dir: Path = DOLMEN_RAG_DIR,
    ) -> None:
        self.resume_settings = resume_settings or read_resume_settings()
        self._rag_dir = rag_dir
        self._lock = threading.RLock()
        self._active_fingerprint: str | None = None
        self._section_count = 0
        self._resume_pages: list[ResumePage] = []
        self.store = ResumeDocumentStore(rag_dir / "resume-documents.sqlite3")
        self.search_backend: ResumeVectorIndex | None = None

    def _create_search_backend(self) -> ResumeVectorIndex:
        return ResumeVectorIndex(
            path=self._rag_dir / "qdrant-langchain-v1",
            embedding=ResumeFastEmbedEmbeddings(
                model_name=DOLMEN_EMBEDDING_MODEL_NAME,
                dimension=DOLMEN_EMBEDDING_DIMENSION,
                cache_dir=DOLMEN_EMBEDDING_CACHE_DIR,
            ),
            dimension=DOLMEN_EMBEDDING_DIMENSION,
        )

    def _invalidate_ready_state(self) -> None:
        self._active_fingerprint = None
        self._section_count = 0
        self._resume_pages = []
        if self.search_backend is not None:
            self.search_backend.invalidate()
        self.store.invalidate()

    def ensure_resume_ingested(self) -> None:
        """내용·정제 정책·작성 기준일이 바뀌면 이전 절을 철회한 뒤 새 색인으로 교체한다."""
        with self._lock:
            try:
                pdf_bytes = read_resume_pdf_bytes(self.resume_settings)
                fingerprint = hashlib.sha256(
                    pdf_bytes
                    + SANITIZER_VERSION.encode()
                    + RESUME_INDEX_VERSION.encode()
                    + self.resume_settings.candidate_name.encode()
                    + self.resume_settings.updated_at.encode()
                ).hexdigest()
                if fingerprint == self._active_fingerprint:
                    return
                resume_pages = extract_sanitized_resume_pages(pdf_bytes)
                expected_sections: dict[str, tuple[str, str]] = {}
                for resume_page in resume_pages:
                    for section_number, section_text in enumerate(
                        split_resume_page_sections(resume_page), start=1
                    ):
                        document_id = (
                            f"resume-page-{resume_page.page_number}-section-{section_number}"
                        )
                        source = f"등록 이력서 · {resume_page.page_number}쪽 · {section_number}절"
                        expected_sections[document_id] = (source, section_text)
                if not expected_sections:
                    raise ValueError
                snapshot = self.store.read_active_snapshot()
                if snapshot is None or not snapshot.matches_sections(
                    fingerprint, expected_sections
                ):
                    # 전체 절을 단일 revision으로 준비하고 색인이 성공할 때만 활성화한다.
                    # A→B→A도 새로운 revision/point id를 발급해 철회본을 재사용하지 않는다.
                    snapshot = self.store.stage_snapshot(fingerprint, expected_sections)
                if self.search_backend is None:
                    self.search_backend = self._create_search_backend()
                self.search_backend.sync(snapshot)
                self.store.activate_snapshot(snapshot)
                self._active_fingerprint = fingerprint
                self._section_count = len(expected_sections)
                self._resume_pages = resume_pages
            except ResumeUnavailableError:
                self._invalidate_ready_state()
                raise
            except Exception:
                self._invalidate_ready_state()
                raise ResumeUnavailableError(
                    "resume_not_ready",
                    "등록 이력서 색인을 준비하지 못했습니다. 서버의 색인 상태를 확인해 주세요.",
                ) from None

    def read_document_status(self) -> dict:
        with self._lock:
            self.ensure_resume_ingested()
            snapshot = self.store.read_active_snapshot()
            if snapshot is None:
                raise ResumeUnavailableError(
                    "resume_not_ready", "등록 이력서가 준비되지 않았습니다."
                )
            document_status = {
                "revision": snapshot.revision,
                "sources": sorted({document.source for document in snapshot.documents}),
                "resume_configured": True,
                "resume_ready": True,
                "section_count": self._section_count,
                "candidate_name": self.resume_settings.candidate_name,
                "resume_updated_at": self.resume_settings.updated_at,
            }
            try:
                if is_debug_enabled():
                    # 같은 잠금·활성 snapshot의 정제 절만 읽고 전체 본문은 반환하지 않는다.
                    active_documents = snapshot.documents
                    document_status["debug"] = {
                        "page_count": len(self._resume_pages),
                        "sanitized_character_count": sum(
                            len(page.text) for page in self._resume_pages
                        ),
                        "embedding_model": DOLMEN_EMBEDDING_MODEL_NAME,
                        "retrieval_limit": RETRIEVED_GROUNDS_LIMIT,
                        "context_policy": RESUME_CONTEXT_POLICY,
                        "privacy_filter_version": SANITIZER_VERSION,
                        "index_version": RESUME_INDEX_VERSION,
                        "model_id": read_debug_model_id(),
                        "history_turn_limit": MAX_CHAT_HISTORY_TURNS,
                        "session_limit": MAX_CHAT_SESSIONS,
                        "sections": [
                            {
                                "document_id": document.document_id,
                                "source": document.source,
                                "version": document.version,
                                "character_count": len(document.content),
                                "snippet": document.content.strip()[:220],
                            }
                            for document in active_documents
                        ],
                    }
            except Exception:
                # 개발 관측 실패가 등록 상태나 본래 응답을 바꾸지 않는다.
                pass
            return document_status

    def search_grounds(self, query: str, limit: int = 5) -> list[RetrievedGround]:
        with self._lock:
            self.ensure_resume_ingested()
            try:
                if self.search_backend is None:
                    raise ValueError
                retrieval_results = self.search_backend.search(query=query, limit=limit)
                if any(not math.isfinite(score) for _, score in retrieval_results):
                    raise ValueError
                return [
                    RetrievedGround(
                        chunk_id=ground.chunk_id,
                        source=ground.source,
                        version=ground.version,
                        score=round(max(-1.0, min(1.0, cosine_score)), 4),
                        snippet=ground.content.strip()[:220],
                        content=ground.content.strip(),
                    )
                    for ground, cosine_score in retrieval_results
                ]
            except Exception:
                self._invalidate_ready_state()
                raise ResumeUnavailableError(
                    "resume_not_ready",
                    "등록 이력서 검색에 실패했습니다. 잠시 후 다시 질문해 주세요.",
                ) from None

    def retrieve_reply_context(self, query: str, limit: int = 5) -> ResumeReplyContext:
        """검색 결과와 revision을 같은 잠금 안에서 읽어 문서 교체 중 혼합을 막는다."""
        with self._lock:
            return ResumeReplyContext(
                grounds=self.search_grounds(query, limit),
                revision=self.store.revision,
                resume_settings=self.resume_settings,
                resume_pages=list(self._resume_pages),
            )

    def close(self) -> None:
        with self._lock:
            if self.search_backend is not None:
                self.search_backend.close()
            self.store.close()


_dolmen_rag_service: DolmenRagService | None = None
_dolmen_rag_service_lock = threading.Lock()


def dolmen_rag_service() -> DolmenRagService:
    global _dolmen_rag_service
    with _dolmen_rag_service_lock:
        if _dolmen_rag_service is None:
            try:
                _dolmen_rag_service = DolmenRagService()
            except Exception:
                raise ResumeUnavailableError(
                    "resume_not_ready",
                    "이력서 저장소를 열지 못했습니다. 서버 상태를 확인해 주세요.",
                ) from None
        return _dolmen_rag_service
