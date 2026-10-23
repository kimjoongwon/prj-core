import type { DolmenAgentActivity } from "../data/dolmenChatClient";
export function contextWireFixture() {
	return {
		version: "gssc-v1",
		status: "ready",
		revision: 7,
		policy: "selected_resume_groups",
		estimator: "utf8_bytes_upper_bound_v1",
		budget: {
			input_limit: 1000,
			output_reserve: 200,
			estimated_input_tokens: 700,
			remaining_input_tokens: 300,
		},
		stages: ["gather", "select", "structure", "compress"].map((stage) => ({
			stage,
			input_count: 3,
			output_count: 2,
		})),
		packets: [
			{
				packet_id: "system",
				kind: "system",
				source: "시스템 정책",
				selected: true,
				reason: "required_system",
				estimated_tokens: 100,
				character_count: 100,
			},
			{
				packet_id: "resume-group-1",
				kind: "resume",
				source: "등록 이력서 · 1쪽",
				selected: true,
				reason: "selected_resume_group",
				estimated_tokens: 400,
				character_count: 200,
				snippet: "합성 테스트의 정제 발췌",
			},
			{
				packet_id: "history-turn-1",
				kind: "history",
				source: "최근 대화",
				selected: false,
				reason: "duplicate_history",
				estimated_tokens: 20,
				character_count: 20,
			},
		],
		history: {
			available_turns: 2,
			selected_turns: 1,
			dropped_turns: 1,
			deduplicated_turns: 1,
		},
	};
}
export function ruleWireFixture() {
	return {
		kind: "deterministic_checks",
		status: "completed",
		checks: [
			{ name: "non_empty", status: "passed", reason: "본문이 있습니다." },
			{
				name: "citations_match",
				status: "failed",
				reason: "출처 표기를 확인해 주세요.",
			},
		],
		disclaimer: "규칙 검사는 정답률이 아닙니다.",
	};
}
export function judgeWireFixture() {
	return {
		kind: "llm_judge",
		status: "completed",
		scores: { groundedness: 4, relevance: 3, completeness: 2 },
		reasons: {
			groundedness: "근거 범위 안의 표현입니다.",
			relevance: "질문과 관련이 있습니다.",
			completeness: "설명이 더 필요할 수 있습니다.",
		},
		reason: "completed",
		disclaimer: "평가모델의 의견이며 정답률이 아닙니다.",
		model_id: "test-judge",
	};
}
export function activityFixture(): DolmenAgentActivity {
	return {
		activityId: "test-activity",
		assistantMessageId: "test-message",
		questionText: "내보내지 않는 질문 원문",
		phase: "done",
		startedAtMs: 100,
		searchFinishedAtMs: 110,
		finishedAtMs: 140,
		retrievedEvidence: [],
		replyCharacterCount: 20,
		statusText: "내보내지 않는 상태",
		errorText: "내보내지 않는 오류",
		debugEvents: [],
		clientObservations: [],
		isJudgePending: false,
		judgeEvaluation: null,
		judgeError: "",
		judgeUnavailableReason: "",
	};
}
export const TEST_REQUEST_ID = "12345678-1234-1234-1234-123456789abc";
