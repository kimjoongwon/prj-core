"""OpenAI 호환 접속 설정과 LangChain 모델 생성의 단일 경계."""

import math
import os
from dataclasses import dataclass, field

from langchain_openai import ChatOpenAI

from app.settings import missing_llm_env_names


class DolmenConfigError(RuntimeError):
    """LLM 접속에 필요한 환경변수가 비어 있을 때 발생한다."""


@dataclass(frozen=True)
class LLMConfig:
    # 객체 repr에도 키와 서버 주소를 남기지 않는다.
    api_key: str = field(repr=False)
    model: str
    base_url: str = field(repr=False)
    request_timeout: float = 60.0
    provider: str = field(default="openai", init=False)


def read_llm_config() -> LLMConfig:
    missing_env_names = missing_llm_env_names()
    if missing_env_names:
        raise DolmenConfigError(f"LLM 설정이 비어 있습니다: {', '.join(missing_env_names)}.")
    try:
        request_timeout = float(os.getenv("LLM_TIMEOUT", "60"))
        if not math.isfinite(request_timeout) or request_timeout <= 0:
            raise ValueError
    except ValueError:
        raise ValueError("LLM_TIMEOUT은 유한한 양수여야 합니다.") from None
    return LLMConfig(
        api_key=os.environ["LLM_API_KEY"],
        model=os.environ["LLM_MODEL_ID"],
        base_url=os.environ["LLM_BASE_URL"],
        request_timeout=request_timeout,
    )


def create_chat_model(config: LLMConfig) -> ChatOpenAI:
    """호스트를 판별하지 않고 항상 OpenAI Chat Completions 프로토콜로 연결한다."""
    return ChatOpenAI(
        api_key=config.api_key,
        model=config.model,
        base_url=config.base_url,
        timeout=config.request_timeout,
        temperature=0.7,
        max_retries=0,
        stream_usage=True,
        use_responses_api=False,
    )
