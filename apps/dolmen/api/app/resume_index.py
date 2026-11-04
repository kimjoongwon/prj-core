"""LangChain Document와 Qdrant의 단일 정제 이력서 snapshot 색인."""

from pathlib import Path

from langchain_core.documents import Document
from langchain_core.embeddings import Embeddings
from langchain_qdrant import QdrantVectorStore, RetrievalMode
from qdrant_client import QdrantClient, models

from app.resume_store import ResumeDocument, ResumeSnapshot

RESUME_COLLECTION_NAME = "dolmen_resume_langchain_v1"


class ResumeVectorIndex:
    """새 payload/point id 공간을 사용하며 활성 revision만 검색한다."""

    def __init__(self, path: Path, embedding: Embeddings, dimension: int) -> None:
        self.client = QdrantClient(path=str(path))
        self._snapshot: ResumeSnapshot | None = None
        try:
            if not self.client.collection_exists(RESUME_COLLECTION_NAME):
                self.client.create_collection(
                    RESUME_COLLECTION_NAME,
                    vectors_config=models.VectorParams(
                        size=dimension, distance=models.Distance.COSINE
                    ),
                )
            self.vector_store = QdrantVectorStore(
                client=self.client,
                collection_name=RESUME_COLLECTION_NAME,
                embedding=embedding,
                retrieval_mode=RetrievalMode.DENSE,
                distance=models.Distance.COSINE,
            )
        except Exception:
            self.client.close()
            raise

    @staticmethod
    def _langchain_document(document: ResumeDocument, revision: int) -> Document:
        return Document(
            id=document.chunk_id,
            page_content=document.content,
            metadata={
                "document_id": document.document_id,
                "chunk_id": document.chunk_id,
                "source": document.source,
                "version": document.version,
                "revision": revision,
            },
        )

    @staticmethod
    def _revision_filter(revision: int) -> models.Filter:
        return models.Filter(
            must=[
                models.FieldCondition(
                    key="metadata.revision", match=models.MatchValue(value=revision)
                )
            ]
        )

    def sync(self, snapshot: ResumeSnapshot) -> None:
        self._snapshot = None
        expected_payloads = {
            document.chunk_id: {
                "page_content": document.content,
                "metadata": self._langchain_document(document, snapshot.revision).metadata,
            }
            for document in snapshot.documents
        }
        stored_points = []
        next_offset = None
        while True:
            points, next_offset = self.client.scroll(
                RESUME_COLLECTION_NAME,
                scroll_filter=self._revision_filter(snapshot.revision),
                offset=next_offset,
                limit=128,
                with_payload=True,
                with_vectors=False,
            )
            stored_points.extend(points)
            if next_offset is None:
                break
        stored_payloads = {str(point.id): point.payload for point in stored_points}
        if stored_payloads != expected_payloads:
            # 중단된 동일 revision의 부분 업로드도 완전한 집합으로 다시 만든다.
            self.client.delete(
                RESUME_COLLECTION_NAME,
                points_selector=models.FilterSelector(
                    filter=self._revision_filter(snapshot.revision)
                ),
                wait=True,
            )
            self.vector_store.add_documents(
                [
                    self._langchain_document(document, snapshot.revision)
                    for document in snapshot.documents
                ],
                ids=[document.chunk_id for document in snapshot.documents],
            )
            uploaded_points = self.client.retrieve(
                RESUME_COLLECTION_NAME,
                ids=list(expected_payloads),
                with_payload=True,
                with_vectors=False,
            )
            if {str(point.id): point.payload for point in uploaded_points} != expected_payloads:
                raise ValueError("이력서 벡터 색인의 원문·메타데이터가 일치하지 않습니다.")
        self.client.delete(
            RESUME_COLLECTION_NAME,
            points_selector=models.FilterSelector(
                filter=models.Filter(
                    must_not=[
                        models.FieldCondition(
                            key="metadata.revision",
                            match=models.MatchValue(value=snapshot.revision),
                        )
                    ]
                )
            ),
            wait=True,
        )
        self._snapshot = snapshot

    def search(self, query: str, limit: int = 5) -> list[tuple[ResumeDocument, float]]:
        if self._snapshot is None or not query.strip() or not 1 <= limit <= 100:
            raise ValueError("활성 이력서 색인과 올바른 검색 조건이 필요합니다.")
        snapshot = self._snapshot
        active_documents = {document.chunk_id: document for document in snapshot.documents}
        search_hits = self.vector_store.similarity_search_with_score(
            query, k=limit, filter=self._revision_filter(snapshot.revision)
        )
        grounded_hits = []
        for hit_document, cosine_score in search_hits:
            stored_document = active_documents.get(hit_document.metadata.get("chunk_id"))
            if (
                stored_document is None
                or str(hit_document.metadata.get("_id")) != stored_document.chunk_id
            ):
                raise ValueError("검색 결과가 활성 이력서에 속하지 않습니다.")
            expected_document = self._langchain_document(stored_document, snapshot.revision)
            if hit_document.page_content != expected_document.page_content or any(
                hit_document.metadata.get(key) != expected_value
                for key, expected_value in expected_document.metadata.items()
            ):
                raise ValueError("검색 결과의 원문·출처·버전이 활성 이력서와 다릅니다.")
            # relevance API의 거리 변환을 적용하지 않고 기존 raw COSINE 방향을 유지한다.
            grounded_hits.append((stored_document, float(cosine_score)))
        return grounded_hits

    def close(self) -> None:
        self.client.close()

    def invalidate(self) -> None:
        self._snapshot = None
