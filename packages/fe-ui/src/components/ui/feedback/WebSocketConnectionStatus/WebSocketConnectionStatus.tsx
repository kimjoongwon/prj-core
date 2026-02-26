import { Button } from "@heroui/react";
import { cva, type VariantProps } from "class-variance-authority";

const connectionStatusVariants = cva(
	"inline-flex items-center gap-2 rounded-full px-3 py-1 text-xs font-medium",
	{
		variants: {
			status: {
				connected: "bg-success-100 text-success-700 dark:bg-success-900/30 dark:text-success-400",
				connecting: "bg-warning-100 text-warning-700 dark:bg-warning-900/30 dark:text-warning-400",
				disconnected: "bg-danger-100 text-danger-700 dark:bg-danger-900/30 dark:text-danger-400",
			},
		},
		defaultVariants: {
			status: "disconnected",
		},
	},
);

export type WebSocketConnectionStatusValue = "connected" | "connecting" | "disconnected";

export interface WebSocketConnectionStatusProps extends VariantProps<typeof connectionStatusVariants> {
	/** 연결 상태 */
	status: WebSocketConnectionStatusValue;
	/** 연결 끊김 시 재연결 버튼 클릭 핸들러 */
	onReconnect?: () => void;
	/** 추가 클래스명 */
	className?: string;
}

const STATUS_INDICATOR: Record<WebSocketConnectionStatusValue, { dot: string; label: string }> = {
	connected: { dot: "🟢", label: "연결됨" },
	connecting: { dot: "🟡", label: "연결 중..." },
	disconnected: { dot: "🔴", label: "연결 끊김" },
};

/**
 * WebSocket 연결 상태를 표시하는 컴포넌트
 *
 * @example
 * ```tsx
 * <WebSocketConnectionStatus status="connected" />
 * <WebSocketConnectionStatus status="disconnected" onReconnect={handleReconnect} />
 * ```
 */
export const WebSocketConnectionStatus = ({
	status,
	onReconnect,
	className,
}: WebSocketConnectionStatusProps) => {
	const { dot, label } = STATUS_INDICATOR[status] ?? STATUS_INDICATOR.disconnected;

	return (
		<div className={connectionStatusVariants({ status, className })}>
			<span>{dot}</span>
			<span>{label}</span>
			{status === "disconnected" && onReconnect && (
				<Button
					size="sm"
					variant="flat"
					color="danger"
					onPress={onReconnect}
					className="h-5 min-w-fit px-2 text-[10px]"
				>
					재연결
				</Button>
			)}
		</div>
	);
};
