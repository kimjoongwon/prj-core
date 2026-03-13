import { Chip } from "@heroui/react";

interface ActiveStatusCellProps {
	/** 활성 여부 */
	isActive: boolean;
}

/**
 * 활성/비활성 상태를 Chip으로 표시하는 Cell 컴포넌트
 */
export const ActiveStatusCell = ({ isActive }: ActiveStatusCellProps) => {
	return (
		<div className="flex w-full justify-center">
			<Chip size="sm" color={isActive ? "success" : "default"} variant="flat">
				{isActive ? "활성" : "비활성"}
			</Chip>
		</div>
	);
};
