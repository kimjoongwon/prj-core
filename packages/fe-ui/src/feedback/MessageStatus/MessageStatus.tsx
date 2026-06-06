import { cva, type VariantProps } from "class-variance-authority";

const messageStatusVariants = cva("inline-flex items-center text-[10px]", {
	variants: {
		status: {
			sent: "text-muted",
			delivered: "text-muted",
			read: "text-accent",
		},
	},
	defaultVariants: {
		status: "sent",
	},
});

export type MessageStatusValue = "sent" | "delivered" | "read";

export interface MessageStatusProps
	extends VariantProps<typeof messageStatusVariants> {
	/** 메시지 전달 시간 */
	deliveredAt?: Date | string | null;
	/** 메시지 읽음 시간 */
	readAt?: Date | string | null;
	/** 추가 클래스명 */
	className?: string;
}

/**
 * 메시지 전달/읽음 상태를 표시하는 컴포넌트
 *
 * @example
 * ```tsx
 * <MessageStatus /> // 전달됨
 * <MessageStatus deliveredAt={new Date()} /> // 전달됨
 * <MessageStatus readAt={new Date()} /> // 읽음
 * ```
 */
export const MessageStatus = ({
	deliveredAt,
	readAt,
	className,
}: MessageStatusProps) => {
	const status: MessageStatusValue = readAt
		? "read"
		: deliveredAt
			? "delivered"
			: "sent";

	return (
		<span className={messageStatusVariants({ status, className })}>
			{status === "read" ? (
				<span
					title={`읽음: ${readAt ? new Date(readAt).toLocaleTimeString() : ""}`}
				>
					<span role="img" aria-label="읽음">
						&#10003;&#10003;
					</span>
				</span>
			) : status === "delivered" ? (
				<span
					title={`전달됨: ${deliveredAt ? new Date(deliveredAt).toLocaleTimeString() : ""}`}
				>
					<span role="img" aria-label="전달됨">
						&#10003;
					</span>
				</span>
			) : (
				<span title="전송 중...">
					<span role="img" aria-label="전송 중">
						&#10003;
					</span>
				</span>
			)}
		</span>
	);
};
