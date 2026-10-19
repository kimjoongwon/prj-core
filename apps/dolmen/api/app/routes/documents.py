"""문서 수집·검색 엔드포인트.

POST /api/documents — 위키 원문을 청킹·임베딩해 저장소에 넣는다.
GET  /api/documents — 저장소 상태(리비전·활성 문서 목록·데모 문서 시딩 여부).
POST /api/search — 질문으로 근거 청크를 직접 검색한다(평가·디버깅용).
POST /api/demo-doc/seed — 데모 온보딩 위키를 절 단위로 명시적으로 (재)수집한다.
"""

import dataclasses

from fastapi import APIRouter, HTTPException
from pydantic import BaseModel, Field

from app.rag import (
    DEMO_DOC_SOURCE,
    dolmen_rag_service,
)

router = APIRouter(tags=["documents"])


class IngestDocumentBody(BaseModel):
    source: str = Field(min_length=1, max_length=300)
    text: str = Field(min_length=1, max_length=2_000_000)
    version: str = Field(default="1", min_length=1, max_length=40)


class SearchBody(BaseModel):
    query: str = Field(min_length=1, max_length=1000)
    limit: int = Field(default=5, ge=1, le=20)


@router.get("/documents")
async def read_document_store_status() -> dict:
    rag_service = dolmen_rag_service()
    return {
        "revision": rag_service.store.revision,
        "sources": rag_service.list_document_sources(),
        "demo_seeded": rag_service.has_document(DEMO_DOC_SOURCE),
    }


@router.post("/documents")
async def ingest_document(ingest_document_body: IngestDocumentBody) -> dict:
    rag_service = dolmen_rag_service()
    try:
        ingested_summary = rag_service.ingest_document(
            text=ingest_document_body.text,
            source=ingest_document_body.source,
            version=ingest_document_body.version,
        )
    except ValueError as error:
        raise HTTPException(status_code=409, detail=str(error)) from error
    return dataclasses.asdict(ingested_summary)


@router.post("/search")
async def search_grounds(search_body: SearchBody) -> dict:
    rag_service = dolmen_rag_service()
    retrieved_grounds = rag_service.search_grounds(query=search_body.query, limit=search_body.limit)
    return {
        "query": search_body.query,
        "grounds": [dataclasses.asdict(ground) for ground in retrieved_grounds],
    }


@router.post("/demo-doc/seed")
async def seed_demo_document() -> dict:
    rag_service = dolmen_rag_service()
    ingested_section_summaries = rag_service.ensure_demo_document_ingested()
    if ingested_section_summaries is None:
        return {"status": "already-seeded", "source": DEMO_DOC_SOURCE}
    return {
        "status": "ingested",
        "source": DEMO_DOC_SOURCE,
        "sections": [dataclasses.asdict(summary) for summary in ingested_section_summaries],
    }
