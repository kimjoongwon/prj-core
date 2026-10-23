import type { DolmenContextSnapshot } from "../data/dolmenContext";
import type { DolmenReplyMetrics } from "../data/dolmenDebug";

const STAGE_LABELS = {
	gather: "Gather · 수집",
	select: "Select · 선택",
	structure: "Structure · 구성",
	compress: "Compress · 압축",
};
const REASON_LABELS: Record<
	DolmenContextSnapshot["packets"][number]["reason"],
	string
> = {
	required_system: "필수 시스템 정책",
	required_query: "필수 현재 질문",
	full_resume_retained: "정제 이력서 전체 유지",
	selected_resume_group: "선택된 이력서 묶음",
	resume_group_budget: "이력서 묶음 예산 제외",
	recent_history: "최근 대화 선택",
	history_turn_limit: "대화 턴 상한 제외",
	history_budget: "대화 예산 제외",
	duplicate_history: "중복 대화 제외",
	duplicate_resume_ground: "이력서와 중복된 검색 근거 제외",
};
const RUN_STATUS_LABELS: Record<DolmenReplyMetrics["runStatus"], string> = {
	completed: "정상 실행 완료",
	output_limit: "출력 한도 · 불완전 답변",
	max_iterations: "반복 상한 · 불완전 답변",
	cancelled: "실행 취소",
	budget_exhausted: "실행 예산 소진",
	failed: "실행 실패",
	running: "실행 중",
	unknown: "실행 상태 미확인",
};
export function DeveloperContextPanel({
	context,
	answerPath,
	replyMetrics = [],
}: {
	context?: DolmenContextSnapshot;
	replyMetrics?: DolmenReplyMetrics[];
	answerPath?: string | number | boolean;
}) {
	return (
		<details className="min-w-0">
			<summary className="cursor-pointer font-medium">GSSC 컨텍스트</summary>
			{!context ? (
				<p className="mt-2 text-foreground/60">
					{answerPath === "private_refusal" || answerPath === "no_evidence"
						? "보호·근거 없음 응답은 모델 컨텍스트 구성을 건너뜁니다."
						: "컨텍스트 미수신 · 개발 수집 꺼짐 또는 API 미지원"}
				</p>
			) : (
				<div className="mt-2 min-w-0 space-y-3">
					<p>
						Revision {context.revision} ·{" "}
						{context.status === "ready"
							? "구성 준비됨"
							: "예산 초과 · 모델 호출 차단"}
					</p>
					<p className="break-words">정책: {context.policy}</p>
					<dl className="grid grid-cols-[minmax(0,1fr)_auto] gap-1">
						<dt>앱 추정 입력 예산</dt>
						<dd>{context.budget.inputLimit}</dd>
						<dt>추정 입력 토큰 상한</dt>
						<dd>{context.budget.estimatedInputTokens}</dd>
						<dt>남은 추정 입력 예산</dt>
						<dd>{context.budget.remainingInputTokens}</dd>
						<dt>출력 예약 (max_tokens)</dt>
						<dd>{context.budget.outputReserve}</dd>
					</dl>
					<p className="break-words text-foreground/60">
						입력 예산은 출력 예약을 이미 제외한 앱 설정이며 공급자 한도가
						아닙니다. 추정 방법: {context.estimator}. 실제 사용량과 다릅니다.
					</p>
					<ol className="space-y-1">
						{context.stages.map((stage) => (
							<li key={stage.stage}>
								{STAGE_LABELS[stage.stage]}: packet {stage.inputCount} →{" "}
								{stage.outputCount}
							</li>
						))}
					</ol>
					<p>
						이전 대화: 전체 {context.history.availableTurns}턴 · 선택{" "}
						{context.history.selectedTurns}턴 · 제외{" "}
						{context.history.droppedTurns}턴 · 중복 제거{" "}
						{context.history.deduplicatedTurns}턴
					</p>
					<details>
						<summary className="cursor-pointer">
							선택·제외 packet 전체 ({context.packets.length})
						</summary>
						<ol className="mt-2 space-y-2">
							{context.packets.map((packet) => (
								<li
									key={packet.packetId}
									className="min-w-0 space-y-1 rounded-lg bg-background/60 p-2 break-words [overflow-wrap:anywhere]"
								>
									<p className="font-medium">
										{packet.selected ? "선택" : "제외"} · {packet.source}
									</p>
									<p>
										{packet.packetId} · {packet.kind}
									</p>
									<p>
										{REASON_LABELS[packet.reason]} ({packet.reason})
									</p>
									<p>
										{packet.characterCount}자 · 추정 {packet.estimatedTokens}
									</p>
									{packet.snippet ? (
										<p className="whitespace-pre-wrap text-foreground/70">
											정제 발췌 (앞 220자): {packet.snippet}
										</p>
									) : (
										<p className="text-foreground/60">본문 비공개</p>
									)}
								</li>
							))}
						</ol>
					</details>
				</div>
			)}
			<div className="mt-3 space-y-2">
				<h4 className="font-medium">제공자 보고 토큰 · 시도별</h4>
				<p className="text-foreground/60">
					각 시도의 마지막 보고값입니다. 추정 예산과 다르며 시도 간 합산하지
					않습니다.
				</p>
				{replyMetrics.length === 0 ? (
					<dl>
						<dt>실제 토큰 사용량</dt>
						<dd>미수집</dd>
					</dl>
				) : (
					<ol className="space-y-2">
						{replyMetrics.map((metrics) => (
							<li
								key={metrics.attempt}
								className="rounded-lg bg-background/60 p-2"
							>
								<p className="font-medium">
									시도 {metrics.attempt} ·{" "}
									{RUN_STATUS_LABELS[metrics.runStatus]}
								</p>
								<p className="text-foreground/60">
									run_status: {metrics.runStatus} · stop_reason:{" "}
									{metrics.stopReason ?? "미수집"}
								</p>
								<dl className="mt-1 grid grid-cols-[minmax(0,1fr)_auto] gap-1">
									<dt>입력 (제공자 보고값)</dt>
									<dd>{metrics.promptTokens ?? "미수집"}</dd>
									<dt>출력 (제공자 보고값)</dt>
									<dd>{metrics.completionTokens ?? "미수집"}</dd>
									<dt>전체 (해당 시도 보고값)</dt>
									<dd>{metrics.totalTokens ?? "미수집"}</dd>
								</dl>
							</li>
						))}
					</ol>
				)}
			</div>
		</details>
	);
}
