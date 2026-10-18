"""hello-agents 에이전트 조립.

주차별 확장 계획:
- 1주차: SimpleAgent + LLM 스트리밍 대화
- 2주차: RAGTool 연결(문서 검색 근거 답변)
- 3주차: MemoryTool 연결(세션 간 기억)
"""

from collections.abc import Iterator

from hello_agents import HelloAgentsLLM, SimpleAgent

from app.settings import missing_llm_env_names

DOLMEN_SYSTEM_PROMPT = """당신은 Dolmen입니다.
피트니스 예약 스타트업의 온보딩 위키를 돕는 질문 어시스턴트입니다.
사용자는 신규 입사자이며, 인사 정책과 서비스 운영 정책에 대해 질문합니다.
한국어로 간결하고 정확하게 답하세요. 문서 검색 도구가 아직 연결되지 않은 질문에서는
추측하지 말고, 위키 근거가 확보되면 답하겠다고 안내하세요."""


class DolmenConfigError(RuntimeError):
    """LLM 접속에 필요한 환경변수가 비어 있을 때 발생한다."""


class DolmenAgentService:
    """세션별 SimpleAgent를 유지하며 스트리밍 답변을 제공한다."""

    def __init__(self, llm: HelloAgentsLLM):
        self._llm = llm
        self._agents_by_session_id: dict[str, SimpleAgent] = {}

    def stream_assistant_reply(self, session_id: str, message_text: str) -> Iterator[str]:
        session_agent = self._agents_by_session_id.get(session_id)
        if session_agent is None:
            session_agent = SimpleAgent(
                name="dolmen-assistant",
                llm=self._llm,
                system_prompt=DOLMEN_SYSTEM_PROMPT,
                enable_tool_calling=False,
            )
            self._agents_by_session_id[session_id] = session_agent
        yield from session_agent.stream_run(message_text)


_dolmen_agent_service: DolmenAgentService | None = None


def dolmen_agent_service() -> DolmenAgentService:
    """앱 생애주기에 하나만 만드는 싱글턴. 설정이 비어 있으면 DolmenConfigError."""
    global _dolmen_agent_service
    if _dolmen_agent_service is None:
        missing_env_names = missing_llm_env_names()
        if missing_env_names:
            missing_env_summary = ", ".join(missing_env_names)
            raise DolmenConfigError(
                f"LLM 설정이 비어 있습니다: {missing_env_summary}. "
                "apps/dolmen/api/.env.example 을 .env 로 복사해 채워주세요."
            )
        _dolmen_agent_service = DolmenAgentService(HelloAgentsLLM())
    return _dolmen_agent_service
