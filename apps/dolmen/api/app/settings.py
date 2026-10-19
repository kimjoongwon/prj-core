"""Dolmen API 설정.

apps/dolmen/api/.env 를 로드해 hello-agents가 읽는 LLM_* 환경변수를 제공한다.
실제 키는 절대 커밋하지 않는다(.gitignore 참고).
"""

import os
from pathlib import Path

from dotenv import load_dotenv

DOLMEN_API_DIR = Path(__file__).resolve().parent.parent

load_dotenv(DOLMEN_API_DIR / ".env")

REQUIRED_LLM_ENV_NAMES = ("LLM_API_KEY", "LLM_MODEL_ID", "LLM_BASE_URL")


def missing_llm_env_names() -> list[str]:
    return [env_name for env_name in REQUIRED_LLM_ENV_NAMES if not os.getenv(env_name)]
