import { Chip, Typography } from "@cocrepo/ui";
import { BookOpenText } from "lucide-react";
import type {
	DolmenChatEvidence,
	DolmenChatMessage,
} from "../data/dolmenChatClient";

/** source("wiki.md § 4. 휴가 정책")에서 절 라벨만 뽑는다. 구분자가 없으면 원본을 그대로 쓴다. */
function extractEvidenceSectionLabel(evidenceSource: string): string {
	const sectionDelimiterIndex = evidenceSource.indexOf(" § ");
	if (sectionDelimiterIndex < 0) {
		return evidenceSource;
	}
	return evidenceSource.slice(sectionDelimiterIndex + 3);
}

function EvidenceList({
	evidenceItems,
}: {
	evidenceItems: DolmenChatEvidence[];
}) {
	return (
		<details className="group w-full">
			<summary className="flex cursor-pointer list-none items-center gap-1.5 text-xs text-foreground/60 transition-colors hover:text-foreground">
				<BookOpenText className="h-3.5 w-3.5" />
				근거 {evidenceItems.length}개 보기
			</summary>
			<ol className="mt-2 flex flex-col gap-1.5">
				{evidenceItems.map((evidenceItem, evidenceIndex) => (
					<li
						key={evidenceItem.chunkId}
						className="rounded-lg border border-border bg-background/60 px-3 py-2 text-xs"
					>
						<div className="mb-1 flex items-center gap-2">
							<Chip size="sm" variant="soft" color="accent">
								{extractEvidenceSectionLabel(evidenceItem.source)}
							</Chip>
							<span className="text-foreground/50">
								유사도 {evidenceItem.score.toFixed(2)}
							</span>
						</div>
						<p className="line-clamp-3 whitespace-pre-wrap text-foreground/70">
							{evidenceItem.snippet}
						</p>
					</li>
				))}
			</ol>
		</details>
	);
}

/**
 * 단일 채팅 메시지 버블. 사용자 메시지는 오른쪽, 어시스턴트 답변은 왼쪽에 띄운다.
 * 스트리밍 시작 직후 빈 답변은 줄임표로 표시해 응답 중임을 나타내고,
 * 근거가 붙은 답변은 접이식 근거 목록을 함께 보여준다.
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
				className={`flex w-full max-w-[85%] flex-col gap-2 rounded-2xl px-4 py-3 ${
					isUserMessage ? "bg-default" : "border border-border bg-surface"
				}`}
			>
				<Typography.Paragraph className="whitespace-pre-wrap break-words text-sm">
					{chatMessage.text.length > 0 ? chatMessage.text : "…"}
				</Typography.Paragraph>
				{!isUserMessage && chatMessage.evidence.length > 0 ? (
					<EvidenceList evidenceItems={chatMessage.evidence} />
				) : null}
			</div>
		</div>
	);
}
