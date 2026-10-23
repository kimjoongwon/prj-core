"use client";

import { Button, ScrollShadow, TextArea, Typography } from "@cocrepo/ui";
import { Send, TriangleAlert } from "lucide-react";
import { makeAutoObservable } from "mobx";
import { observer, useLocalObservable } from "mobx-react-lite";
import { type KeyboardEvent, useEffect, useRef } from "react";
import {
	type DolmenAgentActivity,
	type DolmenChatEvidence,
	type DolmenChatMessage,
	issueAgentActivityId,
	issueChatSessionId,
	streamDolmenChatReply,
} from "../data/dolmenChatClient";
import { AgentActivityPanel } from "./AgentActivityPanel";
import { ChatMessageItem } from "./ChatMessageItem";
import { MomoAvatarPanel } from "./MomoAvatarPanel";
import { MOMO_ONE_SHOT_TIMEOUT_MS, type MomoMotion } from "./momoAvatar";

export function createChatPanelState({ sessionId }: { sessionId: string }) {
	let requestController: AbortController | undefined;
	let momoOneShotTimer: ReturnType<typeof setTimeout> | undefined;
	let isDisposed = false;
	return makeAutoObservable(
		{
			chatMessages: [] as DolmenChatMessage[],
			agentActivities: [] as DolmenAgentActivity[],
			draftMessage: "",
			isAssistantResponding: false,
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
					phase: "searching",
					startedAtMs: Date.now(),
					searchFinishedAtMs: 0,
					finishedAtMs: 0,
					retrievedEvidence: [],
					replyCharacterCount: 0,
					statusText: "",
					errorText: "",
				});
			},
			noteAgentActivityStatus(statusText: string) {
				const currentAgentActivity = this.currentAgentActivity;
				if (currentAgentActivity) {
					currentAgentActivity.statusText = statusText;
				}
			},
			attachReplyEvidence(retrievedEvidence: DolmenChatEvidence[]) {
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
				const hasReplyText = (this.assistantReplyMessage?.text.length ?? 0) > 0;
				this.isAssistantResponding = false;
				this.assistantReplyChatMessageId = "";
				const currentAgentActivity = this.currentAgentActivity;
				if (currentAgentActivity) {
					currentAgentActivity.phase = "done";
					currentAgentActivity.finishedAtMs = Date.now();
				}
				this.currentAgentActivityId = "";
				if (hasReplyText && !this.isDraftInputFocused) {
					this.beginMomoOneShot("happy");
				}
			},
			failAssistantReply(errorMessage: string) {
				this.clearMomoOneShot();
				this.isAssistantResponding = false;
				this.assistantReplyChatMessageId = "";
				this.streamErrorMessage = errorMessage;
				const currentAgentActivity = this.currentAgentActivity;
				if (currentAgentActivity) {
					currentAgentActivity.phase = "error";
					currentAgentActivity.errorText = errorMessage;
					currentAgentActivity.finishedAtMs = Date.now();
				}
				this.currentAgentActivityId = "";
			},
			cancelAssistantReply() {
				this.clearMomoOneShot();
				// 취소는 완료나 실패로 기록하지 않고 미완료 활동만 제거한다.
				this.agentActivities = this.agentActivities.filter(
					(activity) => activity.activityId !== this.currentAgentActivityId,
				);
				this.chatMessages = this.chatMessages.filter(
					(message) =>
						message.chatMessageId !== this.assistantReplyChatMessageId ||
						message.text.length > 0,
				);
				this.isAssistantResponding = false;
				this.assistantReplyChatMessageId = "";
				this.currentAgentActivityId = "";
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
				this.appendUserMessage(messageText);
				this.beginAssistantReply();
				this.beginAgentActivity(messageText);

				const replyController = new AbortController();
				requestController = replyController;
				const canAcceptReply = () =>
					!isDisposed && requestController === replyController;
				try {
					await streamDolmenChatReply({
						messageText,
						sessionId,
						signal: replyController.signal,
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

	useEffect(() => {
		chatPanelState.activate();
		return chatPanelState.dispose;
	}, [chatPanelState]);

	return (
		<div className="flex flex-col gap-4 lg:flex-row lg:items-start">
			<section className="flex min-w-0 flex-1 flex-col gap-3 rounded-2xl border border-border bg-surface/40 p-4">
				<ScrollShadow className="min-h-[50vh] flex-1">
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
									streamingStatusText={
										chatPanelState.currentAgentActivity?.statusText ?? ""
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

			<AgentActivityPanel
				agentActivities={chatPanelState.agentActivities}
				avatar={
					<MomoAvatarPanel
						motion={chatPanelState.momoMotion}
						playbackId={chatPanelState.momoPlaybackId}
						onReady={chatPanelState.greetMomoIfIdle}
						onOneShotFinished={chatPanelState.finishMomoOneShot}
					/>
				}
			/>
		</div>
	);
});
