"use client";

import { observable } from "mobx";
import { observer } from "mobx-react-lite";
import { useEffect, useState } from "react";
import { Switch } from "../../../input/Switch/Switch";
import type { SwitchProps } from "../../../input/Switch/Switch.props";
import { useHandlers } from "./useHandlers";

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

/** SwitchCell이 보유하는 낙관적 선택값과 저장 진행 상태입니다. */
export interface SwitchCellState {
	optimisticSelected: boolean;
	isLoading: boolean;
}

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
	const [state] = useState(() =>
		observable<SwitchCellState>(
			{ optimisticSelected: isSelected, isLoading: false },
			undefined,
			{ name: "SwitchCellState" },
		),
	);
	const handlers = useHandlers(state);

	useEffect(() => {
		handlers.syncSelection(isSelected);
	}, [isSelected, handlers.syncSelection]);

	return (
		<div className={`flex w-full ${ALIGN_CLASS_NAME[align]}`}>
			<Switch
				{...switchProps}
				size={size}
				isSelected={state.optimisticSelected}
				isDisabled={isDisabled || state.isLoading}
				onValueChange={handlers.getToggleHandler(onToggle, isDisabled)}
				aria-label={state.optimisticSelected ? selectedLabel : unselectedLabel}
			/>
		</div>
	);
});
