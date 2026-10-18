import { Chip, Typography } from "@cocrepo/ui";
import type { DolmenChatMessage } from "../data/dolmenChatClient";

/**
 * 단일 채팅 메시지 버블. 사용자 메시지는 오른쪽, 어시스턴트 답변은 왼쪽에 띄운다.
 * 스트리밍 시작 직후 빈 답변은 줄임표로 표시해 응답 중임을 나타낸다.
 */
export function ChatMessageItem({
	chatMessage,
}: {
	chatMessage: DolmenChatMessage;
}) {
	const isUserMessage = chatMessage.role === "user";

	return (
		<div
			className={
				isUserMessage
					? "flex flex-col items-end gap-1"
					: "flex flex-col items-start gap-1"
			}
		>
			<Chip
				size="sm"
				variant="soft"
				color={isUserMessage ? "default" : "accent"}
			>
				{isUserMessage ? "나" : "Dolmen"}
			</Chip>
			<div
				className={`max-w-[85%] rounded-2xl px-4 py-3 ${
					isUserMessage ? "bg-default" : "border border-border bg-surface"
				}`}
			>
				<Typography.Paragraph className="whitespace-pre-wrap break-words text-sm">
					{chatMessage.text.length > 0 ? chatMessage.text : "…"}
				</Typography.Paragraph>
			</div>
		</div>
	);
}
