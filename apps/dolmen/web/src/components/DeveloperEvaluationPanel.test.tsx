import "@testing-library/jest-dom/vitest";
import { cleanup, fireEvent, render, screen } from "@testing-library/react";
import { afterEach, expect, it, vi } from "vitest";
import { parseDolmenContextSnapshot } from "../data/dolmenContext";
import {
	parseDolmenJudgeEvaluation,
	parseDolmenRuleEvaluation,
} from "../data/dolmenEvaluationClient";
import {
	activityFixture,
	contextWireFixture,
	judgeWireFixture,
	ruleWireFixture,
	TEST_REQUEST_ID,
} from "../test/dolmenFixtures";
import { DeveloperContextPanel } from "./DeveloperContextPanel";
import { DeveloperEvaluationPanel } from "./DeveloperEvaluationPanel";
import { DeveloperRequestCard } from "./DeveloperRequestCard";
import { DeveloperSampleQuestions } from "./DeveloperSampleQuestions";

afterEach(cleanup);
it("규칙 검사와 모델 의견을 분리하고 명시 버튼만 평가를 실행한다", () => {
	const activity = activityFixture();
	activity.debugEvents = [
		{
			event: "answer_evaluated",
			elapsedMs: 1,
			requestId: TEST_REQUEST_ID,
			details: {},
			evaluation: parseDolmenRuleEvaluation(ruleWireFixture()),
		},
	];
	activity.judgeEvaluation =
		parseDolmenJudgeEvaluation(judgeWireFixture()) ?? null;
	const onJudge = vi.fn();
	render(
		<DeveloperEvaluationPanel activity={activity} onJudgeActivity={onJudge} />,
	);
	expect(onJudge).not.toHaveBeenCalled();
	fireEvent.click(screen.getByText("규칙 검사 (정답률 아님)"));
	expect(screen.getByText("출처 일치 · 실패")).toBeVisible();
	fireEvent.click(screen.getByText("LLM 평가 · 평가모델의 의견"));
	expect(screen.getByText("근거 충실도: 4 / 5")).toBeVisible();
	expect(screen.getByText("평가 모델: test-judge")).toBeVisible();
	fireEvent.click(screen.getByRole("button", { name: "LLM 평가 실행" }));
	expect(onJudge).toHaveBeenCalledExactlyOnceWith(activity.activityId);
});
it("GSSC는 제외 사유와 추정/실사용을 구분하고 모든 packet을 펼친다", () => {
	render(
		<DeveloperContextPanel
			context={parseDolmenContextSnapshot({
				...contextWireFixture(),
				status: "budget_exceeded",
			})}
		/>,
	);
	fireEvent.click(screen.getByText("GSSC 컨텍스트"));
	expect(screen.getByText(/예산 초과 · 모델 호출 차단/)).toBeVisible();
	expect(
		screen.getByText("실제 토큰 사용량").nextElementSibling,
	).toHaveTextContent("미수집");
	fireEvent.click(screen.getByText("선택·제외 packet 전체 (3)"));
	expect(screen.getByText("중복 대화 제외 (duplicate_history)")).toBeVisible();
	expect(screen.getByText(/정제 발췌 \(앞 220자\)/)).toBeVisible();
});
it("미지원 평가와 샘플은 비활성으로 표시하고 실제 실행과 혼동하지 않는다", () => {
	const activity = activityFixture();
	activity.judgeUnavailableReason =
		"컨텍스트 미수신 · 개발 수집 꺼짐 또는 API 미지원";
	render(
		<DeveloperEvaluationPanel activity={activity} onJudgeActivity={vi.fn()} />,
	);
	fireEvent.click(screen.getByText("LLM 평가 · 평가모델의 의견"));
	expect(screen.getByRole("button", { name: "LLM 평가 실행" })).toBeDisabled();
	render(
		<DeveloperSampleQuestions
			isAvailable={false}
			isChatPending={false}
			onRunSampleQuestion={vi.fn()}
		/>,
	);
	fireEvent.click(screen.getByText("회귀 샘플 질문"));
	expect(
		screen.getByRole("button", { name: "연락처를 알려 주세요." }),
	).toBeDisabled();
	expect(screen.getByText(/실제 회귀 평가 결과가 아닙니다/)).toBeVisible();
});

it.each([
	["generating", "정상 완료 전 · 규칙 검사 대기"],
	["error", "오류·취소된 답변은 규칙 검사 대상이 아닙니다."],
	["cancelled", "오류·취소된 답변은 규칙 검사 대상이 아닙니다."],
] as const)("%s일 때 검사를 미지원으로 오해하지 않는다", (phase, expectedMessage) => {
	const activity = activityFixture();
	activity.phase = phase;
	render(<DeveloperEvaluationPanel activity={activity} />);
	fireEvent.click(screen.getByText("규칙 검사 (정답률 아님)"));
	expect(screen.getByText(expectedMessage)).toBeVisible();
});

it("불완전 종료를 설명하고 시도별 제공자 보고 0과 미수집을 구분한다", () => {
	const activity = activityFixture();
	activity.phase = "error";
	activity.debugEvents = [
		{
			event: "reply_metrics",
			requestId: TEST_REQUEST_ID,
			elapsedMs: 2,
			details: {
				attempt: 1,
				run_status: "output_limit",
				stop_reason: "length",
				prompt_tokens: 0,
				completion_tokens: 80,
			},
		},
		{
			event: "reply_metrics",
			requestId: TEST_REQUEST_ID,
			elapsedMs: 3,
			details: { attempt: 2, run_status: "failed" },
		},
		{
			event: "reply_failed",
			requestId: TEST_REQUEST_ID,
			elapsedMs: 4,
			details: { reason: "output_limit" },
		},
	];
	render(<DeveloperRequestCard activity={activity} isLatest />);
	expect(
		screen.getByText("출력 한도에 도달해 불완전 답변으로 종료되었습니다."),
	).toBeVisible();
	fireEvent.click(screen.getByText("GSSC 컨텍스트"));
	expect(screen.getByText("시도 1 · 출력 한도 · 불완전 답변")).toBeVisible();
	expect(
		screen.getAllByText("입력 (제공자 보고값)")[0]?.nextElementSibling,
	).toHaveTextContent("0");
	expect(
		screen.getAllByText("입력 (제공자 보고값)")[1]?.nextElementSibling,
	).toHaveTextContent("미수집");
	expect(
		screen.getByText(/추정 예산과 다르며 시도 간 합산하지 않습니다/),
	).toBeVisible();
});
