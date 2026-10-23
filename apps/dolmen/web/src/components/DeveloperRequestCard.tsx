import { observer } from "mobx-react-lite";
import type { DolmenAgentActivity } from "../data/dolmenChatClient";
import type {
	DolmenClientObservation,
	DolmenDebugEvent,
} from "../data/dolmenDebug";
import {
	getActivityContext,
	getActivityReplyMetrics,
} from "../data/dolmenDiagnostics";
import { DeveloperContextPanel } from "./DeveloperContextPanel";
import { DeveloperEvaluationPanel } from "./DeveloperEvaluationPanel";

const SERVER_EVENT_LABELS: Record<DolmenDebugEvent["event"], string> = {
	request_received: "요청 수신",
	retrieval_started: "검색 시작",
	context_ready: "컨텍스트 준비",
	reply_attempt: "답변 시도",
	retry_scheduled: "재시도 예약",
	first_chunk: "첫 답변 조각 생성",
	reply_completed: "답변 생성 종료",
	reply_failed: "답변 처리 실패",
	context_built: "GSSC 컨텍스트 구성",
	answer_evaluated: "답변 규칙 검사",
	reply_metrics: "모델 실행 상태·제공자 사용량",
};
const CLIENT_EVENT_LABELS: Record<DolmenClientObservation["event"], string> = {
	request_sent: "요청 전송",
	sources_received: "검색 근거 수신",
	status_received: "서버 상태 안내 수신",
	first_chunk_received: "첫 답변 조각 수신",
	done_received: "done 수신 · 정상 종료",
	error_received: "오류 또는 연결 단절 감지",
	cancelled: "브라우저 요청 취소",
};
const PHASE_LABELS: Record<DolmenAgentActivity["phase"], string> = {
	searching: "응답 대기",
	generating: "첫 답변 대기",
	done: "정상 종료",
	error: "오류 종료",
	cancelled: "취소됨",
};

export const DeveloperRequestCard = observer(function DeveloperRequestCard({
	activity,
	isLatest,
	onJudgeActivity,
	onCancelJudge,
}: {
	activity: DolmenAgentActivity;
	isLatest: boolean;
	onJudgeActivity?: (activityId: string) => void;
	onCancelJudge?: (activityId: string) => void;
}) {
	const requestId = activity.debugEvents[0]?.requestId;
	const phaseLabel =
		activity.phase === "generating" && activity.replyCharacterCount > 0
			? "답변 수신 중"
			: PHASE_LABELS[activity.phase];
	const failureReason = activity.debugEvents.findLast(
		(event) => event.event === "reply_failed",
	)?.details.reason;
	return (
		<details
			open={isLatest}
			className="min-w-0 rounded-xl border border-border p-3 text-xs"
		>
			<summary className="cursor-pointer break-words [overflow-wrap:anywhere]">
				<span className="font-semibold">
					{isLatest ? "최신 요청" : "이전 요청"} · {phaseLabel}
				</span>
				<span className="mt-1 block text-foreground/70">
					{activity.questionText}
				</span>
			</summary>
			<div className="mt-3 min-w-0 space-y-3">
				<p className="break-all text-foreground/60">
					Request ID: {requestId || "미확인 · 서버 이벤트 미수신"}
				</p>
				{failureReason === "output_limit" ? (
					<p className="text-danger">
						출력 한도에 도달해 불완전 답변으로 종료되었습니다.
					</p>
				) : failureReason === "incomplete_reply" ? (
					<p className="text-danger">
						모델 실행이 정상 완료되지 않아 불완전 답변으로 종료되었습니다.
					</p>
				) : null}
				<DeveloperContextPanel
					context={getActivityContext(activity)}
					replyMetrics={getActivityReplyMetrics(activity)}
					answerPath={
						activity.debugEvents.findLast(
							(event) => event.event === "reply_attempt",
						)?.details.answer_path
					}
				/>
				<DeveloperEvaluationPanel
					activity={activity}
					onJudgeActivity={onJudgeActivity}
					onCancelJudge={onCancelJudge}
				/>
				<details open>
					<summary className="cursor-pointer font-medium">처리 로그</summary>
					<div className="mt-2 space-y-2">
						<p className="font-medium">서버 이벤트 · 서버 요청 시작 기준</p>
						{activity.debugEvents.length === 0 ? (
							<p className="text-foreground/60">
								서버 이벤트 미수신 · 수집 꺼짐 또는 API 미지원
							</p>
						) : (
							<ol className="space-y-2">
								{activity.debugEvents.map((debugEvent, eventIndex) => (
									<li
										key={`${debugEvent.event}-${eventIndex}`}
										className="min-w-0 rounded-lg bg-background/60 p-2"
									>
										<p>
											<span className="tabular-nums">
												+{debugEvent.elapsedMs.toFixed(1)}ms
											</span>{" "}
											· {SERVER_EVENT_LABELS[debugEvent.event]}
										</p>
										<p className="text-foreground/50">{debugEvent.event}</p>
										<dl className="mt-1 space-y-1 break-words [overflow-wrap:anywhere]">
											{Object.entries(debugEvent.details).map(
												([detailKey, detailValue]) => (
													<div key={detailKey}>
														<dt className="inline text-foreground/60">
															{detailKey}:{" "}
														</dt>
														<dd className="inline">{String(detailValue)}</dd>
													</div>
												),
											)}
										</dl>
									</li>
								))}
							</ol>
						)}
						<p className="pt-1 font-medium">브라우저 관측 · 전송 시작 기준</p>
						<ol className="space-y-1 text-foreground/70">
							{activity.clientObservations.map(
								(observation, observationIndex) => (
									<li key={`${observation.event}-${observationIndex}`}>
										+{observation.elapsedMs.toFixed(1)}ms ·{" "}
										{CLIENT_EVENT_LABELS[observation.event]}
									</li>
								),
							)}
						</ol>
						{activity.statusText ? (
							<p className="break-words text-foreground/60">
								서버 상태 안내: {activity.statusText}
							</p>
						) : null}
						{activity.errorText ? (
							<p className="break-words text-danger">
								종료 안내: {activity.errorText}
							</p>
						) : null}
					</div>
				</details>
				<details>
					<summary className="cursor-pointer font-medium">
						검색 근거 ({activity.retrievedEvidence.length})
					</summary>
					<p className="mt-2 text-foreground/60">
						각 근거는 앞 220자의 정제 발췌입니다.
					</p>
					{activity.searchFinishedAtMs === 0 ? (
						<p className="mt-2 text-foreground/60">검색 근거 미수신</p>
					) : activity.retrievedEvidence.length === 0 ? (
						<p className="mt-2 text-foreground/60">수신된 검색 근거 없음</p>
					) : (
						<ol className="mt-2 space-y-2">
							{activity.retrievedEvidence.map((evidence) => (
								<li
									key={evidence.chunkId}
									className="min-w-0 space-y-1 rounded-lg bg-background/60 p-2 break-words [overflow-wrap:anywhere]"
								>
									<p className="font-medium">{evidence.source}</p>
									<p>ID: {evidence.chunkId}</p>
									<p>Version: {evidence.version}</p>
									<p>
										유사도:{" "}
										{Number.isFinite(evidence.score)
											? evidence.score.toFixed(4)
											: "미확인"}
									</p>
									<p className="whitespace-pre-wrap text-foreground/70">
										{evidence.snippet || "정제 발췌문 없음"}
									</p>
								</li>
							))}
						</ol>
					)}
				</details>
			</div>
		</details>
	);
});

DeveloperRequestCard.displayName = "DeveloperRequestCard";
