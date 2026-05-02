import { Avatar, Chip } from "@cocrepo/ui/heroui";
import { User } from "lucide-react";

interface InquiryAssigneeCellProps {
	/** 담당자 이름 */
	name?: string | null;
	/** 담당자 프로필 이미지 URL */
	avatarUrl?: string | null;
	/** 온라인 참여자 수 (채팅 채널인 경우) */
	onlineCount?: number | null;
}

/**
 * 문의 담당자를 표시하는 Cell 컴포넌트
 *
 * @example
 * ```tsx
 * <InquiryAssigneeCell name="김상담" />
 * <InquiryAssigneeCell name="박상담" onlineCount={2} />
 * <InquiryAssigneeCell /> // 미배정
 * ```
 */
export const InquiryAssigneeCell = ({
	name,
	avatarUrl,
	onlineCount,
}: InquiryAssigneeCellProps) => {
	// 미배정 상태
	if (!name) {
		return (
			<div className="flex w-full justify-center">
				<Chip size="sm" variant="flat" color="default">
					미배정
				</Chip>
			</div>
		);
	}

	return (
		<div className="flex w-full items-center justify-center gap-2">
			<Avatar
				name={name}
				src={avatarUrl ?? undefined}
				size="sm"
				classNames={{
					base: "bg-primary/10",
					icon: "text-primary",
				}}
				showFallback
				fallback={<User className="h-3 w-3" />}
			/>
			<span className="text-sm">{name}</span>
			{onlineCount !== null && onlineCount !== undefined && onlineCount > 0 && (
				<Chip size="sm" variant="flat" color="success" className="text-xs">
					{onlineCount}
				</Chip>
			)}
		</div>
	);
};
