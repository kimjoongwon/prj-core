"""Dolmen API 설정.

apps/dolmen/api/.env 를 로드해 hello-agents가 읽는 LLM_* 환경변수를 제공한다.
실제 키는 절대 커밋하지 않는다(.gitignore 참고).
"""

import os
import re
from dataclasses import dataclass
from pathlib import Path

from dotenv import load_dotenv

DOLMEN_API_DIR = Path(__file__).resolve().parent.parent

load_dotenv(DOLMEN_API_DIR / ".env")

REQUIRED_LLM_ENV_NAMES = ("LLM_API_KEY", "LLM_MODEL_ID", "LLM_BASE_URL")
RETRIEVED_GROUNDS_LIMIT = 5
RESUME_CONTEXT_POLICY = "full_sanitized_resume"
MAX_CHAT_SESSIONS = 50
MAX_CHAT_HISTORY_TURNS = 2


def missing_llm_env_names() -> list[str]:
    return [env_name for env_name in REQUIRED_LLM_ENV_NAMES if not os.getenv(env_name)]


def is_debug_enabled() -> bool:
    return os.getenv("DOLMEN_DEBUG_ENABLED", "").strip().lower() == "true"


def read_debug_model_id() -> str:
    """모델명만 허용하며 URL·절대 경로·키처럼 보이는 설정값은 공개하지 않는다."""
    model_id = os.getenv("LLM_MODEL_ID", "")
    if (
        not re.fullmatch(r"[A-Za-z0-9][A-Za-z0-9._:/+\-]{0,159}", model_id)
        or "://" in model_id
        or re.match(r"^[A-Za-z]:[/\\]", model_id)
        or model_id.lower().startswith(("sk-", "key-", "api-key", "bearer"))
    ):
        return ""
    return model_id


@dataclass(frozen=True)
class ResumeSettings:
    path: Path
    candidate_name: str
    updated_at: str


def read_resume_settings() -> ResumeSettings:
    """비공개 서버 파일만 등록하며 상대 경로는 API 디렉터리를 기준으로 해석한다."""
    resume_path = Path(os.getenv("DOLMEN_RESUME_PATH", "private/resume.pdf"))
    if not resume_path.is_absolute():
        resume_path = DOLMEN_API_DIR / resume_path
    return ResumeSettings(
        path=resume_path,
        candidate_name=os.getenv("DOLMEN_CANDIDATE_NAME", "지원자").strip(),
        updated_at=os.getenv("DOLMEN_RESUME_UPDATED_AT", "").strip(),
    )
