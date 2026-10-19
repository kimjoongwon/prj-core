"""hello-agents 에이전트 조립.

주차별 확장 계획:
- 1주차: SimpleAgent + LLM 스트리밍 대화
- 2주차: RAGTool 연결(문서 검색 근거 답변) — 현재
- 3주차: MemoryTool 연결(세션 간 기억)
"""

from collections.abc import Iterator

from hello_agents import HelloAgentsLLM, SimpleAgent, ToolRegistry
from hello_agents.tools import RAGTool

from app.rag import dolmen_rag_service
from app.settings import missing_llm_env_names

DOLMEN_SYSTEM_PROMPT = """당신은 Dolmen입니다.
피트니스 예약 스타트업의 온보딩 위키를 돕는 질문 어시스턴트입니다.
사용자는 신규 입사자이며, 인사 정책과 서비스 운영 정책에 대해 질문합니다.

답변 규칙:
1. 위키 관련 질문은 반드시 rag 도구(rag_search)로 근거를 먼저 검색하고, 검색된
   내용에 근거해서만 답합니다. 근거에서 찾을 수 없으면 "위키에서 근거를 찾지
   못했다"고 솔직히 말하고 추측하지 않습니다.
2. 숫자·날짜·조건은 근거 원문에 있는 값 그대로 인용합니다.
3. 한국어로 간결하게 답합니다."""


class DolmenConfigError(RuntimeError):
    """LLM 접속에 필요한 환경변수가 비어 있을 때 발생한다."""


class DolmenAgentService:
    """세션별 SimpleAgent를 유지하며 스트리밍 답변을 제공한다."""

    def __init__(self, llm: HelloAgentsLLM, rag_tool: RAGTool | None):
        self._llm = llm
        self._rag_tool = rag_tool
        self._agents_by_session_id: dict[str, SimpleAgent] = {}

    def _create_session_agent(self) -> SimpleAgent:
        tool_registry = None
        enable_tool_calling = False
        if self._rag_tool is not None:
            tool_registry = ToolRegistry()
            tool_registry.register_tool(self._rag_tool)
            enable_tool_calling = True
        return SimpleAgent(
            name="dolmen-assistant",
            llm=self._llm,
            system_prompt=DOLMEN_SYSTEM_PROMPT,
            tool_registry=tool_registry,
            enable_tool_calling=enable_tool_calling,
        )

    def stream_assistant_reply(self, session_id: str, message_text: str) -> Iterator[str]:
        session_agent = self._agents_by_session_id.get(session_id)
        if session_agent is None:
            session_agent = self._create_session_agent()
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
        rag_tool = None
        try:
            rag_tool = dolmen_rag_service().rag_tool
        except Exception:  # noqa: BLE001 — RAG 초기화 실패는 채팅 기능 자체는 유지한다
            rag_tool = None
        _dolmen_agent_service = DolmenAgentService(HelloAgentsLLM(), rag_tool)
    return _dolmen_agent_service
