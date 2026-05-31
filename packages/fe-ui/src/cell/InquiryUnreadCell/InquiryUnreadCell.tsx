import { MessageCircle } from "lucide-react";
import { Chip } from "../../design-system/primitives";

interface InquiryUnreadCellProps {
	/** 읽지 않은 메시지 수 */
	count?: number | null;
}

/**
 * 읽지 않은 메시지 수를 표시하는 Cell 컴포넌트
 * 채팅 채널 문의에서 새 메시지가 있을 때만 표시
 *
 * @example
 * ```tsx
 * <InquiryUnreadCell count={3} />
 * <InquiryUnreadCell count={0} /> // 표시 안 됨
 * ```
 */
export const InquiryUnreadCell = ({ count }: InquiryUnreadCellProps) => {
	// 0이거나 null/undefined면 표시하지 않음
	if (!count || count <= 0) {
		return <span className="text-default-400">-</span>;
	}

	return (
		<div className="flex w-full justify-center">
			<Chip
				size="sm"
				variant="solid"
				color="primary"
				startContent={<MessageCircle className="h-3 w-3" />}
			>
				{count}
			</Chip>
		</div>
	);
};
