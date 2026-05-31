"use client";

import { observer } from "mobx-react-lite";
import { Chip } from "../../design-system/primitives";
import { useT } from "../../i18n";

interface ActiveStatusCellProps {
	/** 활성 여부 */
	isActive: boolean;
}

/**
 * 활성/비활성 상태를 Chip으로 표시하는 Cell 컴포넌트
 */
export const ActiveStatusCell = observer(function ActiveStatusCell({
	isActive,
}: ActiveStatusCellProps) {
	const t = useT();

	return (
		<div className="flex w-full justify-center">
			<Chip size="sm" color={isActive ? "success" : "default"} variant="flat">
				{isActive ? t("활성") : t("비활성")}
			</Chip>
		</div>
	);
});
