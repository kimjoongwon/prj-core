// @vitest-environment node
import { afterEach, expect, it, vi } from "vitest";
import { judgeWireFixture } from "../test/dolmenFixtures";
import {
	judgeDolmenAnswer,
	parseDolmenJudgeEvaluation,
} from "./dolmenEvaluationClient";

afterEach(() => vi.unstubAllGlobals());
it("명시한 답변과 revision/근거만 same-origin 평가 API로 보내고 signal을 전달한다", async () => {
	const fetchJudge = vi
		.fn()
		.mockResolvedValue(Response.json(judgeWireFixture()));
	vi.stubGlobal("fetch", fetchJudge);
	const signal = new AbortController().signal;
	const input = {
		question: "합성 질문",
		answer: "합성 답변",
		status: "completed" as const,
		resumeRevision: 7,
		groundChunkIds: ["test-ground"],
	};
	expect(await judgeDolmenAnswer(input, signal)).toMatchObject({
		scores: { groundedness: 4, relevance: 3, completeness: 2 },
		modelId: "test-judge",
	});
	expect(fetchJudge).toHaveBeenCalledWith(
		"/dolmen/api/evaluations/judge",
		expect.objectContaining({
			signal,
			body: JSON.stringify({
				question: "합성 질문",
				answer: "합성 답변",
				status: "completed",
				resume_revision: 7,
				ground_chunk_ids: ["test-ground"],
			}),
		}),
	);
});
it.each([
	{ scores: { groundedness: 6, relevance: 3, completeness: 2 } },
	{ reasons: { groundedness: "부분 결과" } },
	{ scores: null },
])("부분·범위 밖 평가를 완료된 점수로 보이지 않는다 %#", (invalid) => {
	expect(
		parseDolmenJudgeEvaluation({ ...judgeWireFixture(), ...invalid }),
	).toBeUndefined();
});
it("평가 미지원은 서버 원문 없이 안전한 오류로 알린다", async () => {
	vi.stubGlobal(
		"fetch",
		vi
			.fn()
			.mockResolvedValue(
				Response.json({ detail: "비공개 예외" }, { status: 404 }),
			),
	);
	await expect(
		judgeDolmenAnswer(
			{
				question: "질문",
				answer: "답",
				status: "completed",
				resumeRevision: 1,
				groundChunkIds: [],
			},
			new AbortController().signal,
		),
	).rejects.toThrow("평가를 사용할 수 없습니다.");
});
it("skipped와 실패를 점수 없이 구분한다", () => {
	expect(
		parseDolmenJudgeEvaluation({
			...judgeWireFixture(),
			status: "skipped",
			scores: null,
			reasons: null,
			reason: "context_mismatch",
		}),
	).toMatchObject({
		status: "skipped",
		scores: null,
		reason: "context_mismatch",
	});
});

it.each([
	"input_budget_exceeded",
	"context_budget_exceeded",
])("평가 %s는 건너뜀으로 보관한다", (reason) => {
	expect(
		parseDolmenJudgeEvaluation({
			...judgeWireFixture(),
			status: "skipped",
			scores: null,
			reasons: null,
			reason,
		}),
	).toMatchObject({ status: "skipped", reason });
});
