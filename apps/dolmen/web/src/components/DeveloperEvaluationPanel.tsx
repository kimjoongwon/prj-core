import { observer } from "mobx-react-lite";
import type { DolmenAgentActivity } from "../data/dolmenChatClient";
import { getActivityRuleEvaluation } from "../data/dolmenDiagnostics";
import {
	type DolmenJudgeEvaluation,
	type DolmenRuleEvaluation,
	JUDGE_DIMENSIONS,
} from "../data/dolmenEvaluationClient";

const CHECK_LABELS: Record<
	DolmenRuleEvaluation["checks"][number]["name"],
	string
> = {
	non_empty: "빈 답변 여부",
	citations_present: "출처 표기",
	citations_match: "출처 일치",
	third_person: "3인칭 표현",
	no_private_information: "개인정보 패턴",
};
const CHECK_STATUS = { passed: "통과", failed: "실패", skipped: "건너뜀" };
const JUDGE_LABELS = {
	groundedness: "근거 충실도",
	relevance: "질문 관련성",
	completeness: "답변 충족도",
};
const JUDGE_REASON_LABELS: Record<DolmenJudgeEvaluation["reason"], string> = {
	completed: "평가 완료",
	evaluation_unavailable: "평가를 사용할 수 없음",
	non_completed_answer: "정상 완료된 답변이 아님",
	private_question: "개인정보 질문은 평가 제외",
	no_evidence: "평가 근거 없음",
	context_mismatch: "현재 이력서와 요청 근거가 달라 평가 제외",
	invalid_judge_output: "평가 응답 형식 오류",
	provider_error: "평가 모델 요청 오류",
	timeout: "평가 시간 초과",
	unsupported_provider: "평가 지원 공급자가 아님",
	sanitized_empty: "정제 후 평가 내용 없음",
	content_too_long: "평가 입력 길이 초과",
	input_budget_exceeded: "평가 입력 추정 예산 초과",
	context_budget_exceeded: "평가 근거 구성 예산 초과",
};
export const DeveloperEvaluationPanel = observer(
	function DeveloperEvaluationPanel({
		activity,
		onJudgeActivity,
		onCancelJudge,
	}: {
		activity: DolmenAgentActivity;
		onJudgeActivity?: (activityId: string) => void;
		onCancelJudge?: (activityId: string) => void;
	}) {
		const ruleEvaluation = getActivityRuleEvaluation(activity);
		const judge = activity.judgeEvaluation;
		const missingRuleMessage =
			activity.phase === "done"
				? "규칙 검사 미수신 · 개발 수집 꺼짐 또는 API 미지원"
				: activity.phase === "error" || activity.phase === "cancelled"
					? "오류·취소된 답변은 규칙 검사 대상이 아닙니다."
					: "정상 완료 전 · 규칙 검사 대기";
		return (
			<div className="space-y-3">
				<details>
					<summary className="cursor-pointer font-medium">
						규칙 검사 (정답률 아님)
					</summary>
					<div className="mt-2 space-y-2">
						{!ruleEvaluation ? (
							<p className="text-foreground/60">{missingRuleMessage}</p>
						) : (
							<>
								<p>
									{ruleEvaluation.status === "completed"
										? "검사 완료"
										: "검사 건너뜀"}
								</p>
								<p className="text-foreground/60">
									{ruleEvaluation.disclaimer}
								</p>
								<ul className="space-y-2">
									{ruleEvaluation.checks.map((check) => (
										<li key={check.name}>
											<p>
												{CHECK_LABELS[check.name]} ·{" "}
												{CHECK_STATUS[check.status]}
											</p>
											<p className="text-foreground/60">{check.reason}</p>
										</li>
									))}
								</ul>
							</>
						)}
					</div>
				</details>
				<details>
					<summary className="cursor-pointer font-medium">
						LLM 평가 · 평가모델의 의견
					</summary>
					<div className="mt-2 space-y-2">
						<p className="text-foreground/60">
							버튼을 눌렀을 때만 별도 모델 호출을 실행합니다. 점수는 정답률이
							아니며 평가모델의 의견입니다.
						</p>
						<p className="text-foreground/60">
							평가 기준: 현재 등록본에서 선택한 정제 이력서 쪽
						</p>
						<button
							type="button"
							className="rounded-lg border border-border px-3 py-1.5 disabled:opacity-50"
							disabled={
								!onJudgeActivity ||
								activity.isJudgePending ||
								!!activity.judgeUnavailableReason
							}
							onClick={() => onJudgeActivity?.(activity.activityId)}
						>
							LLM 평가 실행
						</button>
						{activity.judgeUnavailableReason ? (
							<p className="text-foreground/60">
								{activity.judgeUnavailableReason}
							</p>
						) : null}
						{activity.isJudgePending ? (
							<div>
								<output>평가 진행 중…</output>
								{onCancelJudge ? (
									<button
										type="button"
										className="ml-2 underline"
										onClick={() => onCancelJudge(activity.activityId)}
									>
										평가 취소
									</button>
								) : null}
							</div>
						) : null}
						{activity.judgeError ? (
							<p role="alert" className="text-danger">
								{activity.judgeError}
							</p>
						) : null}
						{judge ? (
							<div className="space-y-2">
								<p>
									{judge.status === "completed"
										? "평가 완료"
										: judge.status === "skipped"
											? "평가 건너뜀"
											: "평가 실패"}{" "}
									· {JUDGE_REASON_LABELS[judge.reason]}
								</p>
								<p className="break-words">
									평가 모델: {judge.modelId || "미확인"}
								</p>
								<p className="text-foreground/60">{judge.disclaimer}</p>
								{judge.scores && judge.reasons ? (
									<ul className="space-y-2">
										{JUDGE_DIMENSIONS.map((dimension) => (
											<li key={dimension}>
												<p>
													{JUDGE_LABELS[dimension]}: {judge.scores?.[dimension]}{" "}
													/ 5
												</p>
												<p className="whitespace-pre-wrap break-words text-foreground/70">
													{judge.reasons?.[dimension]}
												</p>
											</li>
										))}
									</ul>
								) : null}
							</div>
						) : null}
					</div>
				</details>
			</div>
		);
	},
);
DeveloperEvaluationPanel.displayName = "DeveloperEvaluationPanel";
