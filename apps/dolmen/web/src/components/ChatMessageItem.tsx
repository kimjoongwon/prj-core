import { Chip, Typography } from "@cocrepo/ui";
import { BookOpenText, Loader2 } from "lucide-react";
import type {
	DolmenChatEvidence,
	DolmenChatMessage,
} from "../data/dolmenChatClient";

function EvidenceList({
	evidenceItems,
}: {
	evidenceItems: DolmenChatEvidence[];
}) {
	return (
		<details className="group w-full">
			<summary className="flex cursor-pointer list-none items-center gap-1.5 text-xs text-foreground/60 transition-colors hover:text-foreground">
				<BookOpenText className="h-3.5 w-3.5" />
				이력서 근거 {evidenceItems.length}개 보기
			</summary>
			<ol className="mt-2 flex flex-col gap-1.5">
				{evidenceItems.map((evidenceItem, evidenceIndex) => {
					const scorePercent = Math.max(
						0,
						Math.min(100, Math.round(evidenceItem.score * 100)),
					);
					return (
						<li
							key={evidenceItem.chunkId}
							className="rounded-lg border border-border bg-background/60 px-3 py-2 text-xs"
						>
							<div className="mb-1.5 flex items-center gap-2">
								<span className="w-4 shrink-0 text-foreground/40 tabular-nums">
									{evidenceIndex + 1}
								</span>
								<Chip size="sm" variant="soft" color="accent">
									{evidenceItem.source}
								</Chip>
								<span className="ml-auto shrink-0 tabular-nums text-foreground/50">
									질문 관련도 {evidenceItem.score.toFixed(2)}
								</span>
							</div>
							<div className="mb-2 h-1 w-full overflow-hidden rounded-full bg-default">
								<div
									className="h-full rounded-full bg-accent"
									style={{ width: `${scorePercent}%` }}
								/>
							</div>
							<p className="line-clamp-3 whitespace-pre-wrap text-foreground/70">
								{evidenceItem.snippet}
							</p>
						</li>
					);
				})}
			</ol>
		</details>
	);
}

/**
 * 단일 채팅 메시지 버블. 사용자 메시지는 오른쪽, 어시스턴트 답변은 왼쪽에 띄운다.
 * 스트리밍 중 빈 답변은 처리 단계 안내로 대신하고,
 * 근거가 붙은 답변은 이력서 쪽 출처·질문 관련도·발췌문을 함께 보여준다.
 */
export function ChatMessageItem({
	chatMessage,
	isStreaming = false,
	streamingStatusText = "",
}: {
	chatMessage: DolmenChatMessage;
	isStreaming?: boolean;
	/** 재시도 등 진행 상태 안내 — 첫 답변 조각 전에만 보인다 */
	streamingStatusText?: string;
}) {
	const isUserMessage = chatMessage.role === "user";
	const isAwaitingFirstChunk = isStreaming && chatMessage.text.length === 0;
	const awaitingMessage =
		streamingStatusText.length > 0
			? streamingStatusText
			: chatMessage.evidence.length > 0
				? `이력서 근거 ${chatMessage.evidence.length}개를 바탕으로 답변을 작성하고 있어요…`
				: "이력서에서 질문과 관련된 근거를 찾고 있어요…";

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
				{isUserMessage ? "면접관" : "MOMO"}
			</Chip>
			<div
				className={`flex w-full max-w-[85%] flex-col gap-2 rounded-2xl px-4 py-3 ${
					isUserMessage ? "bg-default" : "border border-border bg-surface"
				}`}
			>
				{isAwaitingFirstChunk ? (
					<div className="flex items-center gap-2 text-sm text-foreground/60">
						<Loader2 className="h-4 w-4 animate-spin text-accent" />
						{awaitingMessage}
					</div>
				) : (
					<Typography.Paragraph className="whitespace-pre-wrap break-words text-sm">
						{chatMessage.text}
						{isStreaming ? (
							<span className="ml-0.5 inline-block h-4 w-1.5 animate-pulse rounded-sm bg-accent align-middle" />
						) : null}
					</Typography.Paragraph>
				)}
				{!isUserMessage && chatMessage.evidence.length > 0 ? (
					<EvidenceList evidenceItems={chatMessage.evidence} />
				) : null}
			</div>
		</div>
	);
}
