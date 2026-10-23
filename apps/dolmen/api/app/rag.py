"""등록 이력서만 검색하는 로컬 색인. 기존 .rag 위키 저장소와 분리한다."""

import hashlib
import os
import re
import threading
from dataclasses import dataclass
from pathlib import Path

from hello_agents.retrieval import FastEmbedProvider, QdrantSearch, RAGStore

from app.resume import (
    SANITIZER_VERSION,
    ResumePage,
    ResumeUnavailableError,
    extract_sanitized_resume_pages,
    read_resume_pdf_bytes,
    split_resume_page_sections,
)
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
RESUME_INDEX_VERSION = "resume-page-context-v2"


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
        self.store = RAGStore(path=str(rag_dir / "documents.db"))
        self.search_backend: QdrantSearch | None = None

    def _create_search_backend(self) -> QdrantSearch:
        return QdrantSearch(
            store=self.store,
            embedding=FastEmbedProvider(
                model_name=DOLMEN_EMBEDDING_MODEL_NAME,
                dimension=DOLMEN_EMBEDDING_DIMENSION,
                cache_dir=DOLMEN_EMBEDDING_CACHE_DIR,
            ),
            path=str(self._rag_dir / "qdrant"),
            collection="dolmen_resume",
        )

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
                _, active_chunks = self.store.snapshot()
                active_document_ids = {chunk.document_id for chunk in active_chunks}
                can_reuse_documents = active_document_ids == set(expected_sections) and all(
                    chunk.version.startswith(f"{fingerprint}:") for chunk in active_chunks
                )
                if can_reuse_documents:
                    can_reuse_documents = all(
                        (stored_document.source, stored_document.content)
                        == expected_sections[document_id]
                        for document_id in active_document_ids
                        for stored_document in [self.store.read_document(document_id)]
                    )
                if not can_reuse_documents:
                    # RAGStore는 같은 id의 새 버전을 교체하고, 줄어든 절은 명시적으로 철회한다.
                    # revision 접미사는 A→B→A로 되돌려도 철회된 과거 버전을 재사용하지 않게 한다.
                    version = f"{fingerprint}:{self.store.revision + 1}"
                    for document_id, (source, section_text) in expected_sections.items():
                        self.store.add_document(
                            text=section_text,
                            source=source,
                            version=version,
                            document_id=document_id,
                            chunk_size=max(len(section_text), 1),
                            overlap=0,
                        )
                    for document_id in active_document_ids - set(expected_sections):
                        self.store.deactivate_document(document_id)
                if self.search_backend is None:
                    self.search_backend = self._create_search_backend()
                self.search_backend.sync()
                self._active_fingerprint = fingerprint
                self._section_count = len(expected_sections)
                self._resume_pages = resume_pages
            except ResumeUnavailableError:
                self._active_fingerprint = None
                self._resume_pages = []
                raise
            except Exception:
                self._active_fingerprint = None
                self._resume_pages = []
                raise ResumeUnavailableError(
                    "resume_not_ready",
                    "등록 이력서 색인을 준비하지 못했습니다. 서버의 색인 상태를 확인해 주세요.",
                ) from None

    def read_document_status(self) -> dict:
        with self._lock:
            self.ensure_resume_ingested()
            _, active_chunks = self.store.snapshot()
            document_status = {
                "revision": self.store.revision,
                "sources": sorted({chunk.source for chunk in active_chunks}),
                "resume_configured": True,
                "resume_ready": True,
                "section_count": self._section_count,
                "candidate_name": self.resume_settings.candidate_name,
                "resume_updated_at": self.resume_settings.updated_at,
            }
            try:
                if is_debug_enabled():
                    # 같은 잠금·활성 snapshot의 정제 절만 읽고 전체 본문은 반환하지 않는다.
                    active_documents = [
                        self.store.read_document(document_id)
                        for document_id in sorted({chunk.document_id for chunk in active_chunks})
                    ]
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
                return [
                    RetrievedGround(
                        chunk_id=ground.chunk_id,
                        source=ground.source,
                        version=ground.version,
                        score=round(ground.score, 4),
                        snippet=ground.content.strip()[:220],
                        content=ground.content.strip(),
                    )
                    for ground in retrieval_results
                ]
            except Exception:
                self._active_fingerprint = None
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
