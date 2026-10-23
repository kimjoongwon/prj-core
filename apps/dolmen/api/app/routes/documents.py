"""등록 이력서의 준비 상태만 공개한다. 원문 쓰기·다운로드 API는 제공하지 않는다."""

from fastapi import APIRouter, HTTPException

from app.rag import dolmen_rag_service
from app.resume import ResumeUnavailableError

router = APIRouter(tags=["documents"])


@router.get("/documents")
def read_document_store_status() -> dict:
    try:
        return dolmen_rag_service().read_document_status()
    except ResumeUnavailableError as error:
        raise HTTPException(
            status_code=503, detail={"code": error.code, "message": error.message}
        ) from None
