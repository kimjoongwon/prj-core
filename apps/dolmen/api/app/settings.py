"""Dolmen API 설정.

apps/dolmen/api/.env 를 로드해 hello-agents가 읽는 LLM_* 환경변수를 제공한다.
실제 키는 절대 커밋하지 않는다(.gitignore 참고).
"""

import os
from dataclasses import dataclass
from pathlib import Path

from dotenv import load_dotenv

DOLMEN_API_DIR = Path(__file__).resolve().parent.parent

load_dotenv(DOLMEN_API_DIR / ".env")

REQUIRED_LLM_ENV_NAMES = ("LLM_API_KEY", "LLM_MODEL_ID", "LLM_BASE_URL")


def missing_llm_env_names() -> list[str]:
    return [env_name for env_name in REQUIRED_LLM_ENV_NAMES if not os.getenv(env_name)]


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
