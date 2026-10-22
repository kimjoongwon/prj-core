"""hello-agents 에이전트 조립.

검색은 API 라우트가 먼저 수행해(근거를 화면에 먼저 보내기 위해) 근거를 프롬프트에 넣어 넘긴다.
에이전트 쪽 도구 호출(RAGTool)을 끈 이유: 도구 호출 라운드가 있으면 질문 하나에 LLM을
두 번 부르게 되어 무료 티어 분당 제한에 두 배로 걸리고, 2차 호출이 제한에 막히면
"검색하겠습니다"까지만 답하고 끝나는 현상이 실측됐다(2026-10-19).

주차별 확장 계획:
- 1~2주차: 검색→근거 주입→단일 LLM 호출 스트리밍 — 현재
- 3주차: MemoryTool 연결(세션 간 기억)
"""

from collections.abc import Iterator

from hello_agents import HelloAgentsLLM, SimpleAgent

from app.rag import RetrievedGround
from app.settings import missing_llm_env_names

DOLMEN_SYSTEM_PROMPT = """당신은 Dolmen입니다.
피트니스 예약 스타트업의 온보딩 위키를 돕는 질문 어시스턴트입니다.
사용자는 신규 입사자이며, 인사 정책과 서비스 운영 정책에 대해 질문합니다.

답변 규칙:
1. 사용자 메시지에 함께 전달되는 [위키 근거]에 근거해서만 답합니다. 근거에 없는 내용은
   추측하지 말고 "위키에서 근거를 찾지 못했다"고 솔직히 말합니다.
2. 숫자·날짜·조건은 근거 원문에 있는 값 그대로 인용하고, 어느 절(§)에서 나온 내용인지
   한 번 언급합니다.
3. 한국어로 간결하게 답합니다. 답변 앞에 "검색하겠습니다" 같은 예고 문장은 쓰지 않습니다."""

GROUNDED_PROMPT_TEMPLATE = """[위키 근거]
{grounds_block}

[질문]
{question}"""


class DolmenConfigError(RuntimeError):
    """LLM 접속에 필요한 환경변수가 비어 있을 때 발생한다."""


def extract_section_label(ground_source: str) -> str:
    """'wiki.md § 4. 휴가 정책' 형태의 source에서 절 라벨만 뽑는다."""
    _, delimiter, section_label = ground_source.partition(" § ")
    return section_label if delimiter else ground_source


def compose_grounded_question(question: str, grounds: list[RetrievedGround]) -> str:
    """검색된 근거를 번호·절 라벨과 함께 질문 앞에 붙인다. 근거가 없으면 그 사실도 명시한다."""
    if not grounds:
        grounds_block = "(검색된 근거 없음 — 위키에서 관련 내용을 찾지 못했다고 답하세요)"
    else:
        grounds_block = "\n\n".join(
            f"{index}. (§ {extract_section_label(ground.source)})\n{ground.content}"
            for index, ground in enumerate(grounds, start=1)
        )
    return GROUNDED_PROMPT_TEMPLATE.format(grounds_block=grounds_block, question=question)


class DolmenAgentService:
    """세션별 SimpleAgent를 유지하며 스트리밍 답변을 제공한다."""

    def __init__(self, llm: HelloAgentsLLM):
        self._llm = llm
        self._agents_by_session_id: dict[str, SimpleAgent] = {}

    def _create_session_agent(self) -> SimpleAgent:
        return SimpleAgent(
            name="dolmen-assistant",
            llm=self._llm,
            system_prompt=DOLMEN_SYSTEM_PROMPT,
            enable_tool_calling=False,
        )

    def stream_assistant_reply(
        self,
        session_id: str,
        question: str,
        grounds: list[RetrievedGround],
    ) -> Iterator[str]:
        session_agent = self._agents_by_session_id.get(session_id)
        if session_agent is None:
            session_agent = self._create_session_agent()
            self._agents_by_session_id[session_id] = session_agent
        yield from session_agent.stream_run(compose_grounded_question(question, grounds))


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
