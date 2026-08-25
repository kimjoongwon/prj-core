"use client";

import { makeAutoObservable } from "mobx";
import { observer, useLocalObservable } from "mobx-react-lite";
import { useEffect } from "react";
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

class SwitchCellState {
	optimisticSelected: boolean;
	isLoading = false;

	constructor(isSelected: boolean) {
		this.optimisticSelected = isSelected;
		makeAutoObservable(this, {}, { autoBind: true });
	}

	syncSelection(isSelected: boolean) {
		this.optimisticSelected = isSelected;
	}

	async toggle(nextSelected: boolean, onToggle: SwitchCellProps["onToggle"]) {
		const previousSelected = this.optimisticSelected;
		this.optimisticSelected = nextSelected;
		this.isLoading = true;

		try {
			await onToggle(nextSelected);
		} catch {
			this.optimisticSelected = previousSelected;
		} finally {
			this.isLoading = false;
		}
	}
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
	const state = useLocalObservable(() => new SwitchCellState(isSelected));

	useEffect(() => {
		state.syncSelection(isSelected);
	}, [isSelected, state]);

	const handleToggle = async (nextSelected: boolean) => {
		if (isDisabled || state.isLoading) return;
		await state.toggle(nextSelected, onToggle);
	};

	return (
		<div className={`flex w-full ${ALIGN_CLASS_NAME[align]}`}>
			<Switch
				{...switchProps}
				size={size}
				isSelected={state.optimisticSelected}
				isDisabled={isDisabled || state.isLoading}
				onValueChange={handleToggle}
				aria-label={state.optimisticSelected ? selectedLabel : unselectedLabel}
			/>
		</div>
	);
});
