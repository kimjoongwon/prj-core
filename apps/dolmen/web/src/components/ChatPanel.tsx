"use client";

import { Button, ScrollShadow, TextArea, Typography } from "@cocrepo/ui";
import { Send, TriangleAlert } from "lucide-react";
import { makeAutoObservable } from "mobx";
import { observer, useLocalObservable } from "mobx-react-lite";
import { type KeyboardEvent, type UIEvent, useEffect, useRef } from "react";
import {
	type DolmenAgentActivity,
	type DolmenChatEvidence,
	type DolmenChatMessage,
	issueAgentActivityId,
	issueChatSessionId,
	streamDolmenChatReply,
} from "../data/dolmenChatClient";
import type {
	DolmenClientObservation,
	DolmenDebugEvent,
} from "../data/dolmenDebug";
import { getJudgeUnavailableReason } from "../data/dolmenDiagnostics";
import {
	type DolmenJudgeEvaluation,
	DolmenJudgeRequestError,
	judgeDolmenAnswer,
} from "../data/dolmenEvaluationClient";
import { ChatMessageItem } from "./ChatMessageItem";
import { DeveloperDebugPanel } from "./DeveloperDebugPanel";
import { MomoAvatarPanel } from "./MomoAvatarPanel";
import { MOMO_ONE_SHOT_TIMEOUT_MS, type MomoMotion } from "./momoAvatar";

export function createChatPanelState({ sessionId }: { sessionId: string }) {
	let requestController: AbortController | undefined;
	let momoOneShotTimer: ReturnType<typeof setTimeout> | undefined;
	let isDisposed = false;
	const judgeControllers = new Map<string, AbortController>();
	const judgeTimers = new Map<string, ReturnType<typeof setTimeout>>();
	return makeAutoObservable(
		{
			chatMessages: [] as DolmenChatMessage[],
			agentActivities: [] as DolmenAgentActivity[],
			draftMessage: "",
			isAssistantResponding: false,
			isFollowingLatestMessage: true,
			streamErrorMessage: "",
			assistantReplyChatMessageId: "",
			currentAgentActivityId: "",
			isDraftInputFocused: false,
			hasMomoGreetingBeenConsumed: false,
			momoOneShotMotion: null as "hello" | "happy" | null,
			momoPlaybackId: 0,
			get momoMotion(): MomoMotion {
				if (this.isAssistantResponding) {
					return (this.currentAgentActivity?.replyCharacterCount ?? 0) > 0
						? "speak"
						: "think";
				}
				return this.isDraftInputFocused
					? "listen"
					: (this.momoOneShotMotion ?? "idle");
			},
			activate() {
				isDisposed = false;
			},
			dispose() {
				isDisposed = true;
				for (const timer of judgeTimers.values()) clearTimeout(timer);
				judgeTimers.clear();
				for (const [activityId, controller] of judgeControllers) {
					controller.abort();
					this.finishActivityJudge(activityId, null, "평가가 중단되었습니다.");
				}
				judgeControllers.clear();
				requestController?.abort();
				requestController = undefined;
				this.cancelAssistantReply();
			},
			clearMomoOneShot() {
				clearTimeout(momoOneShotTimer);
				momoOneShotTimer = undefined;
				this.momoOneShotMotion = null;
			},
			beginMomoOneShot(motion: "hello" | "happy") {
				this.clearMomoOneShot();
				this.momoOneShotMotion = motion;
				this.momoPlaybackId += 1;
				const playbackId = this.momoPlaybackId;
				momoOneShotTimer = setTimeout(
					() => this.finishMomoOneShot(playbackId),
					MOMO_ONE_SHOT_TIMEOUT_MS,
				);
			},
			finishMomoOneShot(playbackId: number) {
				if (playbackId === this.momoPlaybackId) {
					this.clearMomoOneShot();
				}
			},
			greetMomoIfIdle() {
				if (isDisposed || this.hasMomoGreetingBeenConsumed) {
					return;
				}
				this.hasMomoGreetingBeenConsumed = true;
				if (
					!this.isAssistantResponding &&
					!this.isDraftInputFocused &&
					this.draftMessage.trim().length === 0 &&
					this.chatMessages.length === 0
				) {
					this.beginMomoOneShot("hello");
				}
			},
			focusDraftInput() {
				this.clearMomoOneShot();
				this.isDraftInputFocused = true;
			},
			blurDraftInput() {
				this.isDraftInputFocused = false;
			},
			observeChatScroll(event: UIEvent<HTMLDivElement>) {
				const viewport = event.currentTarget;
				this.isFollowingLatestMessage =
					viewport.scrollHeight - viewport.clientHeight - viewport.scrollTop <=
					32;
			},
			submitDraftOnEnter(event: KeyboardEvent<HTMLTextAreaElement>) {
				if (
					event.key === "Enter" &&
					!event.shiftKey &&
					!event.nativeEvent.isComposing
				) {
					event.preventDefault();
					void this.submitDraftMessage();
				}
			},
			get currentAgentActivity(): DolmenAgentActivity | undefined {
				return this.agentActivities.find(
					(agentActivity) =>
						agentActivity.activityId === this.currentAgentActivityId,
				);
			},
			get assistantReplyMessage(): DolmenChatMessage | undefined {
				return this.chatMessages.find(
					(chatMessage) =>
						chatMessage.chatMessageId === this.assistantReplyChatMessageId,
				);
			},
			setDraftMessage(draft: string) {
				this.clearMomoOneShot();
				this.draftMessage = draft;
			},
			appendUserMessage(messageText: string) {
				this.chatMessages.push({
					chatMessageId: `chat-message-${crypto.randomUUID()}`,
					role: "user",
					text: messageText,
					evidence: [],
				});
			},
			beginAssistantReply() {
				this.assistantReplyChatMessageId = `chat-message-${crypto.randomUUID()}`;
				this.chatMessages.push({
					chatMessageId: this.assistantReplyChatMessageId,
					role: "assistant",
					text: "",
					evidence: [],
				});
			},
			beginAgentActivity(questionText: string) {
				this.currentAgentActivityId = issueAgentActivityId();
				this.agentActivities.push({
					activityId: this.currentAgentActivityId,
					questionText,
					assistantMessageId: this.assistantReplyChatMessageId,
					isJudgePending: false,
					judgeEvaluation: null,
					judgeError: "",
					judgeUnavailableReason: "정상 완료된 답변에서만 평가할 수 있습니다.",
					phase: "searching",
					startedAtMs: Date.now(),
					searchFinishedAtMs: 0,
					finishedAtMs: 0,
					retrievedEvidence: [],
					replyCharacterCount: 0,
					statusText: "",
					errorText: "",
					debugEvents: [],
					clientObservations: [{ event: "request_sent", elapsedMs: 0 }],
				});
			},
			recordClientObservation(event: DolmenClientObservation["event"]) {
				const activity = this.currentAgentActivity;
				if (activity)
					activity.clientObservations.push({
						event,
						elapsedMs: Math.max(0, Date.now() - activity.startedAtMs),
					});
			},
			recordServerDebugEvent(debugEvent: DolmenDebugEvent) {
				const activity = this.currentAgentActivity;
				if (
					!activity ||
					(activity.debugEvents[0] &&
						activity.debugEvents[0].requestId !== debugEvent.requestId)
				)
					return;
				activity.debugEvents.push(debugEvent);
			},
			noteAgentActivityStatus(statusText: string) {
				this.recordClientObservation("status_received");
				const currentAgentActivity = this.currentAgentActivity;
				if (currentAgentActivity) {
					currentAgentActivity.statusText = statusText;
				}
			},
			attachReplyEvidence(retrievedEvidence: DolmenChatEvidence[]) {
				this.recordClientObservation("sources_received");
				const assistantReplyMessage = this.assistantReplyMessage;
				if (assistantReplyMessage) {
					assistantReplyMessage.evidence = retrievedEvidence;
				}
				const currentAgentActivity = this.currentAgentActivity;
				if (currentAgentActivity) {
					currentAgentActivity.retrievedEvidence = retrievedEvidence;
					currentAgentActivity.searchFinishedAtMs = Date.now();
					currentAgentActivity.phase = "generating";
				}
			},
			appendAssistantReplyChunk(chunkText: string) {
				if ((this.currentAgentActivity?.replyCharacterCount ?? 0) === 0)
					this.recordClientObservation("first_chunk_received");
				const assistantReplyMessage = this.assistantReplyMessage;
				if (assistantReplyMessage) {
					assistantReplyMessage.text += chunkText;
				}
				const currentAgentActivity = this.currentAgentActivity;
				if (currentAgentActivity) {
					currentAgentActivity.phase = "generating";
					currentAgentActivity.statusText = "";
					currentAgentActivity.replyCharacterCount += chunkText.length;
				}
			},
			completeAssistantReply() {
				this.recordClientObservation("done_received");
				const answer = this.assistantReplyMessage?.text ?? "";
				const hasReplyText = answer.length > 0;
				this.isAssistantResponding = false;
				this.assistantReplyChatMessageId = "";
				const currentAgentActivity = this.currentAgentActivity;
				if (currentAgentActivity) {
					currentAgentActivity.phase = "done";
					currentAgentActivity.judgeUnavailableReason =
						getJudgeUnavailableReason(currentAgentActivity, answer);
					currentAgentActivity.finishedAtMs = Date.now();
				}
				this.currentAgentActivityId = "";
				if (hasReplyText && !this.isDraftInputFocused) {
					this.beginMomoOneShot("happy");
				}
			},
			failAssistantReply(errorMessage: string) {
				this.recordClientObservation("error_received");
				this.clearMomoOneShot();
				this.isAssistantResponding = false;
				this.assistantReplyChatMessageId = "";
				this.streamErrorMessage =
					"답변을 마치지 못했어요. 잠시 후 다시 질문해 주세요.";
				const currentAgentActivity = this.currentAgentActivity;
				if (currentAgentActivity) {
					currentAgentActivity.phase = "error";
					currentAgentActivity.judgeUnavailableReason =
						getJudgeUnavailableReason(currentAgentActivity, "");
					currentAgentActivity.errorText = errorMessage;
					currentAgentActivity.finishedAtMs = Date.now();
				}
				this.currentAgentActivityId = "";
			},
			cancelAssistantReply() {
				this.clearMomoOneShot();
				this.recordClientObservation("cancelled");
				if (this.currentAgentActivity) {
					this.currentAgentActivity.phase = "cancelled";
					this.currentAgentActivity.judgeUnavailableReason =
						getJudgeUnavailableReason(this.currentAgentActivity, "");
					this.currentAgentActivity.finishedAtMs = Date.now();
				}
				this.chatMessages = this.chatMessages.filter(
					(message) =>
						message.chatMessageId !== this.assistantReplyChatMessageId ||
						message.text.length > 0,
				);
				this.isAssistantResponding = false;
				this.assistantReplyChatMessageId = "";
				this.currentAgentActivityId = "";
			},
			submitSampleQuestion(question: string) {
				if (isDisposed || this.isAssistantResponding) return;
				this.setDraftMessage(question);
				void this.submitDraftMessage();
			},
			finishActivityJudge(
				activityId: string,
				evaluation: DolmenJudgeEvaluation | null,
				error: string,
			) {
				const activity = this.agentActivities.find(
					(candidate) => candidate.activityId === activityId,
				);
				if (!activity) return;
				activity.isJudgePending = false;
				activity.judgeEvaluation = evaluation;
				activity.judgeError = error;
			},
			cancelActivityJudge(
				activityId: string,
				message = "평가를 취소했습니다.",
			) {
				const controller = judgeControllers.get(activityId);
				if (!controller) return;
				judgeControllers.delete(activityId);
				clearTimeout(judgeTimers.get(activityId));
				judgeTimers.delete(activityId);
				controller.abort();
				this.finishActivityJudge(activityId, null, message);
			},
			async judgeActivity(activityId: string) {
				const activity = this.agentActivities.find(
					(candidate) => candidate.activityId === activityId,
				);
				if (isDisposed || !activity || activity.isJudgePending) return;
				const answer =
					this.chatMessages.find(
						(message) => message.chatMessageId === activity.assistantMessageId,
					)?.text ?? "";
				activity.judgeUnavailableReason = getJudgeUnavailableReason(
					activity,
					answer,
				);
				if (activity.judgeUnavailableReason) return;
				const context = activity.debugEvents.findLast(
					(event) => event.context,
				)?.context;
				if (!context) return;
				const controller = new AbortController();
				judgeControllers.set(activityId, controller);
				activity.isJudgePending = true;
				activity.judgeError = "";
				activity.judgeEvaluation = null;
				const timeout = setTimeout(
					() =>
						this.cancelActivityJudge(
							activityId,
							"평가 대기 시간이 초과되었습니다. 다시 실행해 주세요.",
						),
					45_000,
				);
				judgeTimers.set(activityId, timeout);
				const canApplyEvaluation = () =>
					!isDisposed &&
					!controller.signal.aborted &&
					judgeControllers.get(activityId) === controller;
				try {
					const evaluation = await judgeDolmenAnswer(
						{
							question: activity.questionText,
							answer,
							status: "completed",
							resumeRevision: context.revision,
							groundChunkIds: activity.retrievedEvidence.map(
								(ground) => ground.chunkId,
							),
						},
						controller.signal,
					);
					if (canApplyEvaluation())
						this.finishActivityJudge(activityId, evaluation, "");
				} catch (error) {
					if (canApplyEvaluation())
						this.finishActivityJudge(
							activityId,
							null,
							error instanceof DolmenJudgeRequestError
								? error.message
								: "평가 연결을 완료하지 못했습니다. 다시 실행해 주세요.",
						);
				} finally {
					clearTimeout(timeout);
					if (judgeControllers.get(activityId) === controller) {
						judgeControllers.delete(activityId);
						judgeTimers.delete(activityId);
					}
				}
			},
			async submitDraftMessage() {
				const messageText = this.draftMessage.trim();
				if (
					isDisposed ||
					messageText.length === 0 ||
					this.isAssistantResponding
				) {
					return;
				}
				this.draftMessage = "";
				this.clearMomoOneShot();
				this.isDraftInputFocused = false;
				this.streamErrorMessage = "";
				this.isAssistantResponding = true;
				this.isFollowingLatestMessage = true;
				this.appendUserMessage(messageText);
				this.beginAssistantReply();
				this.beginAgentActivity(messageText);

				const replyController = new AbortController();
				requestController = replyController;
				const canAcceptReply = () =>
					!isDisposed &&
					requestController === replyController &&
					this.isAssistantResponding;
				try {
					await streamDolmenChatReply({
						messageText,
						sessionId,
						signal: replyController.signal,
						onDebugEvent: (debugEvent) => {
							if (canAcceptReply()) this.recordServerDebugEvent(debugEvent);
						},
						onRetrievedEvidence: (retrievedEvidence) => {
							if (canAcceptReply()) this.attachReplyEvidence(retrievedEvidence);
						},
						onReplyStatus: (statusMessage) => {
							if (canAcceptReply()) this.noteAgentActivityStatus(statusMessage);
						},
						onAssistantChunk: (chunkText) => {
							if (canAcceptReply()) this.appendAssistantReplyChunk(chunkText);
						},
						onReplyDone: () => {
							if (canAcceptReply()) this.completeAssistantReply();
						},
						onReplyError: (errorMessage) => {
							if (canAcceptReply()) this.failAssistantReply(errorMessage);
						},
						onReplyCancelled: () => {
							if (canAcceptReply()) this.cancelAssistantReply();
						},
					});
				} catch {
					if (canAcceptReply()) {
						this.failAssistantReply("응답 수신 중 연결이 중단되었어요.");
					}
				} finally {
					if (requestController === replyController)
						requestController = undefined;
				}
			},
		},
		{},
		{ autoBind: true, name: "ChatPanelState" },
	);
}

export type ChatPanelState = ReturnType<typeof createChatPanelState>;

const SAMPLE_QUESTIONS = [
	"어떤 경력과 역할을 경험했나요?",
	"주요 프로젝트와 맡은 역할을 소개해 주세요.",
	"어떤 기술을 사용했고 어떻게 활용했나요?",
	"협업 경험과 일하는 방식을 알려 주세요.",
	"AI를 업무에 활용한 경험이 있나요?",
];

export const ChatPanel = observer(function ChatPanel() {
	const sessionIdRef = useRef(issueChatSessionId());
	const chatPanelState = useLocalObservable(() =>
		createChatPanelState({ sessionId: sessionIdRef.current }),
	);
	const chatViewportRef = useRef<HTMLDivElement>(null);
	const chatMessageCount = chatPanelState.chatMessages.length;
	const latestMessageTextLength =
		chatPanelState.chatMessages.at(-1)?.text.length ?? 0;
	const isFollowingLatestMessage = chatPanelState.isFollowingLatestMessage;
	const isAssistantResponding = chatPanelState.isAssistantResponding;
	const streamErrorMessage = chatPanelState.streamErrorMessage;

	useEffect(() => {
		chatPanelState.activate();
		return chatPanelState.dispose;
	}, [chatPanelState]);

	useEffect(() => {
		const chatViewport = chatViewportRef.current;
		if (chatViewport && isFollowingLatestMessage && chatMessageCount > 0) {
			// 대화 영역만 이동해 작성창과 개발 패널의 스크롤을 유지한다.
			chatViewport.scrollTop = chatViewport.scrollHeight;
		}
	}, [
		chatMessageCount,
		latestMessageTextLength,
		isFollowingLatestMessage,
		isAssistantResponding,
		streamErrorMessage,
	]);

	return (
		<div className="flex flex-col gap-4 lg:flex-row lg:items-start">
			<section
				aria-label="채팅"
				className="flex h-[calc(100dvh-220px)] min-h-[360px] min-w-0 flex-none flex-col gap-3 rounded-2xl border border-border bg-surface/40 p-4 lg:h-[calc(100dvh-250px)] lg:min-h-[540px] lg:flex-1"
			>
				<header className="shrink-0 border-b border-border pb-3">
					<MomoAvatarPanel
						presentation="compact"
						motion={chatPanelState.momoMotion}
						playbackId={chatPanelState.momoPlaybackId}
						onReady={chatPanelState.greetMomoIfIdle}
						onOneShotFinished={chatPanelState.finishMomoOneShot}
					/>
				</header>
				<ScrollShadow
					ref={chatViewportRef}
					role="log"
					aria-label="대화 내역"
					aria-busy={chatPanelState.isAssistantResponding}
					tabIndex={0}
					onScroll={chatPanelState.observeChatScroll}
					className="min-h-0 flex-1 overflow-y-auto"
				>
					{chatPanelState.chatMessages.length === 0 ? (
						<div className="flex h-full flex-col items-center justify-center gap-3 py-16 text-center">
							<Typography.Paragraph color="muted">
								면접관님, 경력·프로젝트·기술·협업에 대해 질문해 주세요. MOMO가
								등록된 이력서를 바탕으로 설명합니다.
							</Typography.Paragraph>
							<div className="flex flex-wrap justify-center gap-2">
								{SAMPLE_QUESTIONS.map((sampleQuestion) => (
									<button
										key={sampleQuestion}
										type="button"
										className="rounded-full border border-border px-3 py-1 text-xs text-foreground/70 transition-colors hover:bg-default"
										onClick={() =>
											chatPanelState.setDraftMessage(sampleQuestion)
										}
									>
										{sampleQuestion}
									</button>
								))}
							</div>
						</div>
					) : (
						<div className="flex flex-col gap-4 py-2">
							{chatPanelState.chatMessages.map((chatMessage) => (
								<ChatMessageItem
									key={chatMessage.chatMessageId}
									chatMessage={chatMessage}
									isStreaming={
										chatMessage.chatMessageId ===
										chatPanelState.assistantReplyChatMessageId
									}
								/>
							))}
						</div>
					)}
				</ScrollShadow>

				{chatPanelState.streamErrorMessage.length > 0 ? (
					<div
						role="alert"
						className="flex items-center gap-2 rounded-xl border border-danger/30 bg-danger/10 px-3 py-2 text-sm text-danger"
					>
						<TriangleAlert className="h-4 w-4 shrink-0" />
						<span>{chatPanelState.streamErrorMessage}</span>
					</div>
				) : null}

				<div className="flex items-end gap-2">
					<div className="min-w-0 flex-1 [&>*]:w-full">
						<TextArea
							aria-label="질문 입력"
							className="min-w-0 w-full"
							variant="bordered"
							placeholder="면접 질문을 입력하세요 (Enter 전송, Shift+Enter 줄바꿈)"
							value={chatPanelState.draftMessage}
							onChange={chatPanelState.setDraftMessage}
							onFocus={chatPanelState.focusDraftInput}
							onBlur={chatPanelState.blurDraftInput}
							onKeyDown={chatPanelState.submitDraftOnEnter}
							isDisabled={chatPanelState.isAssistantResponding}
						/>
					</div>
					<Button
						variant="primary"
						isDisabled={
							chatPanelState.draftMessage.trim().length === 0 ||
							chatPanelState.isAssistantResponding
						}
						isLoading={chatPanelState.isAssistantResponding}
						onPress={chatPanelState.submitDraftMessage}
					>
						<Send className="h-4 w-4" />
						전송
					</Button>
				</div>
			</section>

			<DeveloperDebugPanel
				agentActivities={chatPanelState.agentActivities}
				isChatPending={chatPanelState.isAssistantResponding}
				onRunSampleQuestion={chatPanelState.submitSampleQuestion}
				onJudgeActivity={chatPanelState.judgeActivity}
				onCancelJudge={chatPanelState.cancelActivityJudge}
			/>
		</div>
	);
});
