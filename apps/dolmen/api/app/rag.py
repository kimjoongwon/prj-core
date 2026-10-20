"""로컬 RAG 파이프라인.

RAGStore(SQLite + 내장 청킹) → FastEmbed 로컬 임베딩 → QdrantSearch(path 모드)로
Qdrant 서버 없이 로컬 파일 인덱스(.rag/)에서 동작한다. 클러스터 배포 시 url 모드로 전환한다.

마크다운 문서는 H2(##) 절 단위로 잘라 절별 문서로 저장한다(구조 인식 청킹).
절 제목이 source에 붙어 근거 표시에 "4. 휴가 정책" 같은 출처 라벨이 함께 보인다.
"""

import hashlib
import os
import re
from dataclasses import dataclass

from hello_agents.retrieval import FastEmbedProvider, QdrantSearch, RAGStore
from hello_agents.tools import RAGTool

from app.settings import DOLMEN_API_DIR

DOLMEN_RAG_DIR = DOLMEN_API_DIR / ".rag"
DEMO_DOC_SOURCE = "moafit-onboarding-wiki.md"
DEMO_DOC_PATH = DOLMEN_API_DIR.parent / "demo-doc" / "onboarding-wiki.md"

# 임베딩 모델 캐시 경로(컨테이너 이미지에 모델을 구울 때 지정). 미지정 시 fastembed 기본 캐시.
DOLMEN_EMBEDDING_CACHE_DIR = os.getenv("DOLMEN_EMBEDDING_CACHE_DIR") or None

# 한국어 문장 유사도가 되는 다국어 모델. fastembed가 ONNX로 로컬 실행한다.
# 참고: intfloat/multilingual-e5-large가 품질은 더 좋지만 외부 데이터 파일(model.onnx_data)을
# 쓰는지라 fastembed 캐시 레이아웃에서 onnxruntime 경로 검증이 실패해 단일 ONNX 모델로 선택했다.
DOLMEN_EMBEDDING_MODEL_NAME = "sentence-transformers/paraphrase-multilingual-MiniLM-L12-v2"
DOLMEN_EMBEDDING_DIMENSION = 384

SECTION_HEADING_PATTERN = re.compile(r"^##\s+")


def compute_document_id(source: str) -> str:
    """RAGStore 기본 규칙과 동일한 source SHA-256 앞 24자 식별자."""
    return hashlib.sha256(source.encode()).hexdigest()[:24]


def split_markdown_into_sections(markdown_text: str) -> list[tuple[str, str]]:
    """H2(##) 제목 기준으로 (절 제목, 절 본문) 목록을 만든다. 제목 줄은 본문에 포함된다."""
    sections: list[tuple[str, str]] = []
    current_title = "머리말"
    current_lines: list[str] = []

    def flush_section() -> None:
        section_text = "\n".join(current_lines).strip()
        if section_text:
            sections.append((current_title, section_text))

    for markdown_line in markdown_text.splitlines():
        if SECTION_HEADING_PATTERN.match(markdown_line):
            flush_section()
            current_title = markdown_line.lstrip("#").strip()
            current_lines = [markdown_line]
        else:
            current_lines.append(markdown_line)
    flush_section()
    return sections


@dataclass
class IngestedDocumentSummary:
    document_id: str
    source: str
    version: str
    is_new_ingestion: bool


@dataclass
class RetrievedGround:
    chunk_id: str
    source: str
    version: str
    score: float
    # 화면 표시용 앞부분 발췌
    snippet: str
    # LLM 프롬프트에 넣는 청크 원문 전체
    content: str


class DolmenRagService:
    """문서 저장·청킹·임베딩·검색과 에이전트용 RAGTool를 제공한다."""

    def __init__(self) -> None:
        DOLMEN_RAG_DIR.mkdir(parents=True, exist_ok=True)
        self.store = RAGStore(path=str(DOLMEN_RAG_DIR / "documents.db"))
        # cache_dir 미지정 시 fastembed 기본 캐시(각 OS 임시 디렉터리)를 쓴다.
        # 컨테이너에서는 DOLMEN_EMBEDDING_CACHE_DIR로 이미지에 구운 모델 경로를 가리킨다.
        self.embedding = FastEmbedProvider(
            model_name=DOLMEN_EMBEDDING_MODEL_NAME,
            dimension=DOLMEN_EMBEDDING_DIMENSION,
            cache_dir=DOLMEN_EMBEDDING_CACHE_DIR,
        )
        self.search_backend = QdrantSearch(
            store=self.store,
            embedding=self.embedding,
            path=str(DOLMEN_RAG_DIR / "qdrant"),
            collection="dolmen",
        )
        self.rag_tool = RAGTool(store=self.store, search_backend=self.search_backend)

    def ingest_document(
        self, text: str, source: str, version: str = "1", *, sync_index: bool = True
    ) -> IngestedDocumentSummary:
        document_id = self.store.add_document(text=text, source=source, version=version)
        if sync_index:
            self.search_backend.sync()
        return IngestedDocumentSummary(
            document_id=document_id,
            source=source,
            version=version,
            is_new_ingestion=True,
        )

    def ingest_markdown_document(
        self, markdown_text: str, source: str, version: str = "1"
    ) -> list[IngestedDocumentSummary]:
        """마크다운 원문을 H2 절 단위 문서로 나눠 저장하고 마지막에 인덱스를 한 번 동기화한다."""
        section_summaries: list[IngestedDocumentSummary] = []
        for section_title, section_text in split_markdown_into_sections(markdown_text):
            section_summaries.append(
                self.ingest_document(
                    text=section_text,
                    source=f"{source} § {section_title}",
                    version=version,
                    sync_index=False,
                )
            )
        self.search_backend.sync()
        return section_summaries

    def search_grounds(self, query: str, limit: int = 5) -> list[RetrievedGround]:
        retrieval_results = self.search_backend.search(query=query, limit=limit)
        return [
            RetrievedGround(
                chunk_id=result.chunk_id,
                source=result.source,
                version=result.version,
                score=round(result.score, 4),
                snippet=result.content.strip()[:220],
                content=result.content.strip(),
            )
            for result in retrieval_results
        ]

    def list_document_sources(self) -> list[str]:
        """저장소에 활성 문서가 있는 고유 source 목록(절 단위)."""
        _, chunk_items = self.store.snapshot()
        return sorted({chunk_item.source for chunk_item in chunk_items})

    def has_document(self, source: str) -> bool:
        return any(
            stored_source == source or stored_source.startswith(f"{source} § ")
            for stored_source in self.list_document_sources()
        )

    def ensure_demo_document_ingested(self) -> list[IngestedDocumentSummary] | None:
        """데모 온보딩 위키가 저장소에 없으면 넣고, 인덱스를 최신으로 맞춘다.

        문서는 이미 있어도 이전 sync가 실패했을 수 있으므로 sync()는 항상 호출한다
        (sync는 변경이 없으면 인코딩 없이 0을 반환하는 증분 동작).
        """
        if self.has_document(DEMO_DOC_SOURCE):
            self.search_backend.sync()
            return None
        demo_doc_text = DEMO_DOC_PATH.read_text(encoding="utf-8")
        return self.ingest_markdown_document(
            markdown_text=demo_doc_text, source=DEMO_DOC_SOURCE, version="1"
        )


_dolmen_rag_service: DolmenRagService | None = None


def dolmen_rag_service() -> DolmenRagService:
    """앱 생애주기에 하나만 만드는 싱글턴(모델 로드가 무겁다)."""
    global _dolmen_rag_service
    if _dolmen_rag_service is None:
        _dolmen_rag_service = DolmenRagService()
    return _dolmen_rag_service
