"use client";

import { Button, ScrollShadow, TextArea, Typography } from "@cocrepo/ui";
import { Send, TriangleAlert } from "lucide-react";
import { makeAutoObservable } from "mobx";
import { observer, useLocalObservable } from "mobx-react-lite";
import { useRef } from "react";
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

function createChatPanelState({ sessionId }: { sessionId: string }) {
	return makeAutoObservable(
		{
			chatMessages: [] as DolmenChatMessage[],
			agentActivities: [] as DolmenAgentActivity[],
			draftMessage: "",
			isAssistantResponding: false,
			streamErrorMessage: "",
			assistantReplyChatMessageId: "",
			currentAgentActivityId: "",
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
					errorText: "",
				});
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
					currentAgentActivity.replyCharacterCount += chunkText.length;
				}
			},
			completeAssistantReply() {
				this.isAssistantResponding = false;
				this.assistantReplyChatMessageId = "";
				const currentAgentActivity = this.currentAgentActivity;
				if (currentAgentActivity) {
					currentAgentActivity.phase = "done";
					currentAgentActivity.finishedAtMs = Date.now();
				}
				this.currentAgentActivityId = "";
			},
			failAssistantReply(errorMessage: string) {
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
			async submitDraftMessage() {
				const messageText = this.draftMessage.trim();
				if (messageText.length === 0 || this.isAssistantResponding) {
					return;
				}
				this.draftMessage = "";
				this.streamErrorMessage = "";
				this.isAssistantResponding = true;
				this.appendUserMessage(messageText);
				this.beginAssistantReply();
				this.beginAgentActivity(messageText);

				await streamDolmenChatReply({
					messageText,
					sessionId,
					onRetrievedEvidence: (retrievedEvidence) =>
						this.attachReplyEvidence(retrievedEvidence),
					onAssistantChunk: (chunkText) =>
						this.appendAssistantReplyChunk(chunkText),
					onReplyDone: () => this.completeAssistantReply(),
					onReplyError: (errorMessage) => this.failAssistantReply(errorMessage),
				});
			},
		},
		{},
		{ autoBind: true, name: "ChatPanelState" },
	);
}

export type ChatPanelState = ReturnType<typeof createChatPanelState>;

const SAMPLE_QUESTIONS = [
	"연차는 며칠 제공되나요?",
	"헬스 클래스는 몇 시간 전까지 무료로 취소할 수 있나요?",
	"노트북 지급 기준이 궁금해요.",
	"생일에 반차를 쓸 수 있나요?",
];

export const ChatPanel = observer(function ChatPanel() {
	const sessionIdRef = useRef(issueChatSessionId());
	const chatPanelState = useLocalObservable(() =>
		createChatPanelState({ sessionId: sessionIdRef.current }),
	);

	const handleDraftKeyDown = (
		event: React.KeyboardEvent<HTMLTextAreaElement>,
	) => {
		if (event.key === "Enter" && !event.shiftKey) {
			event.preventDefault();
			void chatPanelState.submitDraftMessage();
		}
	};

	return (
		<div className="flex flex-col gap-4 lg:flex-row lg:items-start">
			<section className="flex min-w-0 flex-1 flex-col gap-3 rounded-2xl border border-border bg-surface/40 p-4">
				<ScrollShadow className="min-h-[50vh] flex-1">
					{chatPanelState.chatMessages.length === 0 ? (
						<div className="flex h-full flex-col items-center justify-center gap-3 py-16 text-center">
							<Typography.Paragraph color="muted">
								온보딩 위키에 궁금한 점을 물어보세요. 에이전트가 위키를 검색해
								근거와 함께 답합니다.
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
					<TextArea
						aria-label="질문 입력"
						className="flex-1"
						variant="bordered"
						placeholder="질문을 입력하세요 (Enter 전송, Shift+Enter 줄바꿈)"
						value={chatPanelState.draftMessage}
						onChange={chatPanelState.setDraftMessage}
						onKeyDown={handleDraftKeyDown}
						isDisabled={chatPanelState.isAssistantResponding}
					/>
					<Button
						variant="primary"
						isDisabled={
							chatPanelState.draftMessage.trim().length === 0 ||
							chatPanelState.isAssistantResponding
						}
						isLoading={chatPanelState.isAssistantResponding}
						onPress={() => void chatPanelState.submitDraftMessage()}
					>
						<Send className="h-4 w-4" />
						전송
					</Button>
				</div>
			</section>

			<AgentActivityPanel agentActivities={chatPanelState.agentActivities} />
		</div>
	);
});
