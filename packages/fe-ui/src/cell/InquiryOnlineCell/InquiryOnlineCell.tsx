import { Chip } from "../../data-display/Chip/Chip";

interface InquiryOnlineCellProps {
	/** 온라인 참여자 수 */
	count?: number | null;
}

/**
 * 온라인 참여자 수를 표시하는 Cell 컴포넌트
 * 실시간 채팅 채널에서 현재 온라인 사용자 수 표시
 *
 * @example
 * ```tsx
 * <InquiryOnlineCell count={2} />
 * <InquiryOnlineCell count={0} /> // 오프라인
 * ```
 */
export const InquiryOnlineCell = ({ count }: InquiryOnlineCellProps) => {
	const hasOnline = count !== null && count !== undefined && count > 0;

	return (
		<div className="flex w-full items-center justify-center gap-1.5">
			<span
				className={`h-2 w-2 rounded-full ${hasOnline ? "bg-success" : "bg-default"}`}
			/>
			{hasOnline ? (
				<Chip size="sm" variant="flat" color="success" className="text-xs">
					{count}
				</Chip>
			) : (
				<span className="text-xs text-muted">0</span>
			)}
		</div>
	);
};
