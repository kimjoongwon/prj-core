"""GSSC: 자료 수집·전체 그룹 선택·구조화·중복/이력 압축과 실제 입력 추정 예산."""

import hashlib
import json
import re
from dataclasses import dataclass

from app.rag import RetrievedGround
from app.resume import ResumePage
from app.settings import (
    MAX_CHAT_HISTORY_TURNS,
    ContextSettings,
    ResumeSettings,
    read_context_settings,
)

CONTEXT_VERSION = "gssc-v1"
CONTEXT_ESTIMATOR = "utf8_bytes_upper_bound_v1"
PACKET_REASONS = {
    "required_system",
    "required_query",
    "full_resume_retained",
    "selected_resume_group",
    "resume_group_budget",
    "recent_history",
    "history_turn_limit",
    "history_budget",
    "duplicate_history",
    "duplicate_resume_ground",
}


@dataclass(frozen=True)
class BuiltContext:
    status: str
    system_prompt: str
    user_prompt: str
    history_messages: list[dict[str, str]]
    resume_pages: list[ResumePage]
    grounds: list[RetrievedGround]
    diagnostic: dict
    output_token_reserve: int


class ContextBudgetExceeded(RuntimeError):
    """필수 질문/정책 또는 온전한 이력서 그룹을 입력 예산에 넣을 수 없는 경우."""


def estimate_input_tokens(messages: list[dict[str, str]]) -> int:
    """의존성 없는 보수적 추정. UTF-8 바이트 상한이며 실제 사용량/토크나이저 수가 아니다."""
    return len(json.dumps(messages, ensure_ascii=False, separators=(",", ":")).encode("utf-8"))


def _history_turns(history_messages) -> list[list[dict[str, str]]]:
    turns: list[list[dict[str, str]]] = []
    for message in history_messages:
        role = getattr(message, "role", "")
        content = getattr(message, "content", "")
        if not isinstance(content, str):
            continue
        if role == "user":
            # 예전 턴에 반복 저장된 전체 이력서는 제거하고 질문만 데이터로 남긴다.
            try:
                historical_payload = json.loads(content)
                historical_question = historical_payload.get("untrusted_interviewer_question")
                if isinstance(historical_question, str):
                    content = historical_question
            except (ValueError, AttributeError):
                pass
            turns.append(
                [
                    {
                        "role": "user",
                        "content": json.dumps(
                            {"untrusted_interviewer_question": content}, ensure_ascii=False
                        ),
                    }
                ]
            )
        elif role == "assistant" and turns:
            turns[-1].append({"role": "assistant", "content": content})
    # 도구·요약·미완료 user-only 기록은 모델에 재주입하지 않는다.
    return [turn for turn in turns if any(message["role"] == "assistant" for message in turn)]


def compact_history_messages(history_messages, turn_limit: int = MAX_CHAT_HISTORY_TURNS):
    """공개 SDK Message 타입에 의존하지 않는 전체 턴 단위 보관 계약."""
    turns = _history_turns(history_messages)
    return [message for turn in turns[-turn_limit:] for message in turn]


def _included_grounds(grounds, resume_pages):
    """같은 쪽의 다른 회사 조각을 선택한 그룹의 근거로 취급하지 않는다."""
    page_texts = {page.page_number: page.text for page in resume_pages}
    return [
        ground
        for ground in grounds
        if ground.content and ground.content in page_texts.get(ground.page_number, "")
    ]


def _resume_groups(resume_pages: list[ResumePage]) -> list[list[ResumePage]]:
    """명시적 회사 헤더만 경계로 인정한다. 모호한 자료는 전체를 한 그룹으로 보존한다."""
    groups: list[list[ResumePage]] = []
    current_group: list[ResumePage] = []
    for page in resume_pages:
        current_lines: list[str] = []
        for line in page.text.splitlines():
            if re.match(r"^(?:회사명|회사|근무처)\s*[:：]\s*\S", line):
                if current_lines:
                    current_group.append(ResumePage(page.page_number, "\n".join(current_lines)))
                    current_lines = []
                if current_group:
                    groups.append(current_group)
                    current_group = []
            current_lines.append(line)
        if current_lines:
            current_group.append(ResumePage(page.page_number, "\n".join(current_lines)))
    if current_group:
        groups.append(current_group)
    return groups


def _merge_pages(groups: list[list[ResumePage]]) -> list[ResumePage]:
    page_fragments: dict[int, list[str]] = {}
    for group in groups:
        for page in group:
            page_fragments.setdefault(page.page_number, []).append(page.text)
    return [
        ResumePage(page_number, "\n".join(fragments))
        for page_number, fragments in sorted(page_fragments.items())
    ]


def _prompt(question, resume_pages, grounds, resume_settings):
    return json.dumps(
        {
            "candidate_name": resume_settings.candidate_name,
            "resume_updated_at": resume_settings.updated_at,
            "untrusted_resume_pages": [
                {
                    "page_number": page.page_number,
                    "source": f"등록 이력서 · {page.page_number}쪽",
                    "content": page.text,
                }
                for page in resume_pages
            ],
            # 본문은 위 쪽 문맥에 한 번만 넣고 근거 ID/출처/쪽 매핑은 별도로 유지한다.
            "untrusted_resume_evidence": [
                {
                    "chunk_id": ground.chunk_id,
                    "source": f"등록 이력서 · {ground.page_number}쪽",
                    "version": ground.version,
                    "page_number": ground.page_number,
                }
                for ground in _included_grounds(grounds, resume_pages)
            ],
            "untrusted_interviewer_question": question,
        },
        ensure_ascii=False,
    )


def build_context(
    system_prompt: str,
    question: str,
    grounds: list[RetrievedGround],
    resume_pages: list[ResumePage],
    resume_settings: ResumeSettings,
    history_messages=(),
    revision: int = 0,
    context_settings: ContextSettings | None = None,
) -> BuiltContext:
    settings = context_settings or read_context_settings()
    groups = _resume_groups(resume_pages)
    turns = _history_turns(history_messages)
    packets = [
        {
            "packet_id": "system",
            "kind": "system",
            "source": "시스템 정책",
            "selected": True,
            "reason": "required_system",
            "estimated_tokens": len(system_prompt.encode("utf-8")),
            "character_count": len(system_prompt),
        },
        {
            "packet_id": "query",
            "kind": "query",
            "source": "현재 질문",
            "selected": True,
            "reason": "required_query",
            "estimated_tokens": len(question.encode("utf-8")),
            "character_count": len(question),
        },
    ]
    resume_packets = []
    for index, group in enumerate(groups):
        group_text = "\n".join(page.text for page in group)
        packet = {
            "packet_id": f"resume-group-{index + 1}",
            "kind": "resume",
            "source": f"등록 이력서 · {group[0].page_number}쪽",
            "selected": True,
            "reason": "full_resume_retained",
            "estimated_tokens": len(group_text.encode("utf-8")),
            "character_count": len(group_text),
            "snippet": group_text[:220],
        }
        resume_packets.append(packet)
        packets.append(packet)
    history_packets = []
    selected_turn_indices: list[int] = []
    seen_turns = set()
    duplicate_turn_count = 0
    for index in range(len(turns) - 1, -1, -1):
        turn_text = json.dumps(turns[index], ensure_ascii=False)
        turn_digest = hashlib.sha256(turn_text.encode()).hexdigest()
        selected = False
        reason = "history_turn_limit"
        if turn_digest in seen_turns:
            reason = "duplicate_history"
            duplicate_turn_count += 1
        elif len(selected_turn_indices) < MAX_CHAT_HISTORY_TURNS:
            selected = True
            reason = "recent_history"
            selected_turn_indices.insert(0, index)
        seen_turns.add(turn_digest)
        packet = {
            "packet_id": f"history-turn-{index + 1}",
            "kind": "history",
            "source": "최근 대화",
            "selected": selected,
            "reason": reason,
            "estimated_tokens": len(turn_text.encode("utf-8")),
            "character_count": len(turn_text),
        }
        history_packets.append((index, packet))
    packets.extend(packet for _, packet in sorted(history_packets))
    for index, ground in enumerate(grounds):
        packets.append(
            {
                "packet_id": f"retrieval-{index + 1}",
                "kind": "retrieval",
                "source": "검색 근거",
                "selected": False,
                "reason": "duplicate_resume_ground",
                "estimated_tokens": len(ground.content.encode("utf-8")),
                "character_count": len(ground.content),
            }
        )

    def render(selected_group_indices, selected_history_indices):
        selected_pages = _merge_pages([groups[index] for index in selected_group_indices])
        user_prompt = _prompt(question, selected_pages, grounds, resume_settings)
        selected_history = [
            message for index in selected_history_indices for message in turns[index]
        ]
        messages = [
            {"role": "system", "content": system_prompt},
            *selected_history,
            {"role": "user", "content": user_prompt},
        ]
        return selected_pages, selected_history, user_prompt, estimate_input_tokens(messages)

    selected_group_indices = list(range(len(groups)))
    selected_pages, selected_history, user_prompt, estimate = render(
        selected_group_indices, selected_turn_indices
    )
    while estimate > settings.input_token_limit and selected_turn_indices:
        dropped_index = selected_turn_indices.pop(0)
        for index, packet in history_packets:
            if index == dropped_index:
                packet.update(selected=False, reason="history_budget")
        selected_pages, selected_history, user_prompt, estimate = render(
            selected_group_indices, selected_turn_indices
        )
    policy = "full_sanitized_resume"
    status = "ready"
    if estimate > settings.input_token_limit:
        policy = "selected_resume_groups"
        selected_group_indices = []
        query_terms = set(re.findall(r"[A-Za-z0-9가-힣]{2,}", question.lower()))

        def group_score(index):
            group_text = "\n".join(page.text for page in groups[index]).lower()
            lexical_score = sum(term in group_text for term in query_terms)
            retrieval_score = sum(
                max(ground.score, 0) for ground in _included_grounds(grounds, groups[index])
            )
            return lexical_score + retrieval_score

        for index in sorted(range(len(groups)), key=lambda item: (-group_score(item), item)):
            _, _, _, candidate_estimate = render(sorted([*selected_group_indices, index]), [])
            if candidate_estimate <= settings.input_token_limit:
                selected_group_indices.append(index)
        selected_group_indices.sort()
        selected_pages, selected_history, user_prompt, estimate = render(selected_group_indices, [])
        for index, packet in enumerate(resume_packets):
            packet.update(
                selected=index in selected_group_indices,
                reason="selected_resume_group"
                if index in selected_group_indices
                else "resume_group_budget",
            )
        if not selected_group_indices or estimate > settings.input_token_limit:
            status = "budget_exceeded"
    selected_grounds = _included_grounds(grounds, selected_pages)
    selected_ground_ids = {ground.chunk_id for ground in selected_grounds}
    for packet, ground in zip(packets[-len(grounds) :] if grounds else [], grounds, strict=True):
        if ground.chunk_id not in selected_ground_ids:
            packet["reason"] = "resume_group_budget"
    selected_count = sum(packet["selected"] for packet in packets)
    # selection은 예산/최근턴 정책, compression은 반복 본문/동일 턴 제거를 뜻한다.
    # 구조화 자체는 packet 수를 바꾸지 않는다. 압축이 삭제한 packet도 원인과 함께 남긴다.
    before_compression_count = selected_count + len(selected_grounds) + duplicate_turn_count
    diagnostic = {
        "version": CONTEXT_VERSION,
        "revision": revision,
        "status": status,
        "policy": policy,
        "estimator": CONTEXT_ESTIMATOR,
        "budget": {
            "input_limit": settings.input_token_limit,
            "output_reserve": settings.output_token_reserve,
            "estimated_input_tokens": estimate,
            "remaining_input_tokens": max(0, settings.input_token_limit - estimate),
        },
        "stages": [
            {"stage": "gather", "input_count": len(packets), "output_count": len(packets)},
            {
                "stage": "select",
                "input_count": len(packets),
                "output_count": before_compression_count,
            },
            {
                "stage": "structure",
                "input_count": before_compression_count,
                "output_count": before_compression_count,
            },
            {
                "stage": "compress",
                "input_count": before_compression_count,
                "output_count": selected_count,
            },
        ],
        "packets": packets,
        "history": {
            "available_turns": len(turns),
            "selected_turns": len(selected_turn_indices),
            "dropped_turns": len(turns) - len(selected_turn_indices),
            "deduplicated_turns": duplicate_turn_count,
        },
    }
    return BuiltContext(
        status,
        system_prompt,
        user_prompt,
        selected_history,
        selected_pages,
        selected_grounds,
        diagnostic,
        settings.output_token_reserve,
    )
