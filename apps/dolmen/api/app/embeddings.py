"""FastEmbed의 문서·질문 전처리를 LangChain Embeddings 계약에 연결한다."""

import math
from numbers import Real
from typing import Literal

from langchain_core.embeddings import Embeddings


class ResumeFastEmbedEmbeddings(Embeddings):
    """기존 passage/query 경로와 모델 출력을 보존하며 잘못된 벡터를 차단한다.

    공식 FastEmbedEmbeddings의 분기와 같은 연결이며, community 패키지가
    요구하는 langchain-classic 전체 의존을 피하기 위해 필요한 계약만 구현한다.
    """

    def __init__(
        self,
        model_name: str,
        dimension: int,
        cache_dir: str | None = None,
        *,
        doc_embed_type: Literal["default", "passage"] = "passage",
    ) -> None:
        if (
            not model_name.strip()
            or type(dimension) is not int
            or dimension <= 0
            or doc_embed_type not in ("default", "passage")
        ):
            raise ValueError("지원하지 않는 이력서 임베딩 설정입니다.")
        self.model_name = model_name
        self.dimension = dimension
        self.cache_dir = cache_dir
        self.doc_embed_type = doc_embed_type
        self._model = None

    def _load_model(self):
        if self._model is None:
            from fastembed import TextEmbedding

            self._model = TextEmbedding(model_name=self.model_name, cache_dir=self.cache_dir)
        return self._model

    def _validated_vectors(self, model_vectors, count: int) -> list[list[float]]:
        vectors = [list(vector) for vector in model_vectors]
        if len(vectors) != count or any(
            len(vector) != self.dimension
            or not all(
                not isinstance(coordinate, bool)
                and isinstance(coordinate, Real)
                and math.isfinite(coordinate)
                for coordinate in vector
            )
            or not any(vector)
            for vector in vectors
        ):
            raise ValueError("이력서 임베딩 벡터가 모델의 차원·유한수 계약과 다릅니다.")
        # COSINE collection이 정규화하므로 여기서 모델 벡터를 재가공하지 않는다.
        return [[float(coordinate) for coordinate in vector] for vector in vectors]

    def embed_documents(self, texts: list[str]) -> list[list[float]]:
        if not texts:
            return []
        model = self._load_model()
        document_vectors = (
            model.passage_embed(texts) if self.doc_embed_type == "passage" else model.embed(texts)
        )
        return self._validated_vectors(document_vectors, len(texts))

    def embed_query(self, text: str) -> list[float]:
        return self._validated_vectors(self._load_model().query_embed(text), 1)[0]
