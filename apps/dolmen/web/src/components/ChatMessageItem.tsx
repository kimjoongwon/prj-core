import { Typography } from "@cocrepo/ui";
import { Loader2 } from "lucide-react";
import { observer } from "mobx-react-lite";
import type { DolmenChatMessage } from "../data/dolmenChatClient";

/** 대화 본문과 작성 중 표시만 소유한다. 개발 근거는 오른쪽 패널에서 확인한다. */
export const ChatMessageItem = observer(function ChatMessageItem({
	chatMessage,
	isStreaming = false,
}: {
	chatMessage: DolmenChatMessage;
	isStreaming?: boolean;
}) {
	const isUserMessage = chatMessage.role === "user";
	return (
		<div
			className={
				isUserMessage
					? "flex min-w-0 flex-col items-end gap-1"
					: "flex min-w-0 flex-col items-start gap-1"
			}
		>
			<span className="px-1 text-xs text-foreground/60">
				{isUserMessage ? "면접관" : "MOMO"}
			</span>
			<div
				className={`flex max-w-[90%] min-w-0 flex-col gap-2 rounded-2xl px-4 py-3 ${isUserMessage ? "bg-default" : "border border-border bg-surface"}`}
			>
				{isStreaming && chatMessage.text.length === 0 ? (
					<output className="flex items-center gap-2 text-sm text-foreground/60">
						<Loader2 className="h-4 w-4 shrink-0 animate-spin text-accent" />
						답변을 작성하고 있어요…
					</output>
				) : chatMessage.text.length > 0 ? (
					<Typography.Paragraph className="whitespace-pre-wrap break-words text-sm [overflow-wrap:anywhere]">
						{chatMessage.text}
						{isStreaming ? (
							<span className="ml-0.5 inline-block h-4 w-1.5 animate-pulse rounded-sm bg-accent align-middle" />
						) : null}
					</Typography.Paragraph>
				) : (
					<p className="text-sm text-foreground/60">
						답변을 완료하지 못했어요.
					</p>
				)}
			</div>
		</div>
	);
});

ChatMessageItem.displayName = "ChatMessageItem";
