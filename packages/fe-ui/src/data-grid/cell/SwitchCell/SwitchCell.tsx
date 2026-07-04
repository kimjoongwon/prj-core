"use client";

import { observer } from "mobx-react-lite";
import { useEffect, useState } from "react";
import { Switch } from "../../../input/Switch/Switch";
import type { SwitchProps } from "../../../input/Switch/Switch.props";

export interface SwitchCellProps
	extends Omit<
		SwitchProps,
		"isSelected" | "value" | "onValueChange" | "onChange"
	> {
	/** 선택 여부 */
	isSelected: boolean;
	/** 변경 시 호출되는 콜백 */
	onToggle: (nextSelected: boolean) => void | Promise<void>;
	/** 셀 안 정렬 */
	align?: "center" | "start" | "end";
	/** 선택 상태에서 사용할 aria-label */
	selectedLabel?: string;
	/** 미선택 상태에서 사용할 aria-label */
	unselectedLabel?: string;
}

const ALIGN_CLASS_NAME: Record<
	NonNullable<SwitchCellProps["align"]>,
	string
> = {
	center: "justify-center",
	start: "justify-start",
	end: "justify-end",
};

/**
 * 테이블 셀 안에서 boolean 값을 Switch로 토글하는 범용 셀
 */
export const SwitchCell = observer(function SwitchCell({
	isSelected,
	onToggle,
	align = "center",
	size = "sm",
	isDisabled,
	selectedLabel = "비활성화",
	unselectedLabel = "활성화",
	...switchProps
}: SwitchCellProps) {
	const [optimisticSelected, setOptimisticSelected] = useState(isSelected);
	const [isLoading, setIsLoading] = useState(false);

	useEffect(() => {
		setOptimisticSelected(isSelected);
	}, [isSelected]);

	const handleToggle = async (nextSelected: boolean) => {
		if (isDisabled || isLoading) return;

		const previousSelected = optimisticSelected;
		setOptimisticSelected(nextSelected);
		setIsLoading(true);

		try {
			await onToggle(nextSelected);
		} catch {
			setOptimisticSelected(previousSelected);
		} finally {
			setIsLoading(false);
		}
	};

	return (
		<div className={`flex w-full ${ALIGN_CLASS_NAME[align]}`}>
			<Switch
				{...switchProps}
				size={size}
				isSelected={optimisticSelected}
				isDisabled={isDisabled || isLoading}
				onValueChange={handleToggle}
				aria-label={optimisticSelected ? selectedLabel : unselectedLabel}
			/>
		</div>
	);
});
