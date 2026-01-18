import { Chip } from "@heroui/react";

interface StatusChipCellProps {
	/** 상태값 (active, inactive, pending 등) */
	status?: string;
	/** 삭제 예정 시간 (있으면 "탈퇴대기" 상태로 표시) */
	removedAt?: Date | string | null;
}

const STATUS_CONFIG: Record<
	string,
	{ label: string; color: "success" | "warning" | "danger" | "default" }
> = {
	active: { label: "활성", color: "success" },
	inactive: { label: "비활성", color: "default" },
	pending: { label: "대기", color: "warning" },
	removed: { label: "탈퇴대기", color: "danger" },
};

/**
 * 상태를 Chip으로 표시하는 Cell 컴포넌트
 */
export const StatusChipCell = ({ status, removedAt }: StatusChipCellProps) => {
	const effectiveStatus = removedAt ? "removed" : (status ?? "active");
	const config = STATUS_CONFIG[effectiveStatus] ?? {
		label: effectiveStatus,
		color: "default" as const,
	};

	return (
		<div className="flex justify-center">
			<Chip size="sm" color={config.color} variant="flat">
				{config.label}
			</Chip>
		</div>
	);
};
