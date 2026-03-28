import { Chip } from "@heroui/react";

export interface LockStatusCellProps {
	/** 영구 잠금 여부 */
	isPermanentlyLocked: boolean;
	/** 일시 잠금 종료 시각 */
	lockedUntil?: string | null;
}

/**
 * 계정 잠금 상태를 Chip으로 표시하는 셀
 */
export const LockStatusCell = ({
	isPermanentlyLocked,
	lockedUntil,
}: LockStatusCellProps) => {
	if (isPermanentlyLocked) {
		return (
			<div className="flex w-full justify-center">
				<Chip size="sm" color="danger" variant="flat">
					영구잠금
				</Chip>
			</div>
		);
	}

	if (lockedUntil) {
		return (
			<div className="flex w-full justify-center">
				<Chip size="sm" color="warning" variant="flat">
					일시잠금
				</Chip>
			</div>
		);
	}

	return (
		<div className="flex w-full justify-center">
			<Chip size="sm" color="success" variant="flat">
				정상
			</Chip>
		</div>
	);
};
