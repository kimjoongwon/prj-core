import { useFormField } from "@shared/hooks";
import { MobxProps } from "@shared/types";
import { tools } from "@shared/utils";
import { action } from "mobx";
import { observer } from "mobx-react-lite";
import { useMemo } from "react";
import {
	ChipSelect as BaseChipSelect,
	type ChipSelectProps as BaseChipSelectProps,
} from "./ChipSelect";

export interface ChipSelectProps<T>
	extends MobxProps<T>,
		Omit<BaseChipSelectProps, "value" | "onSelectionChange"> {}

export const ChipSelect = observer(
	<T extends object>(props: ChipSelectProps<T>) => {
		const { state, path, options = [], selectionMode = "multiple" } = props;

		const initialValue = useMemo(() => {
			const currentValue = tools.get(state, path);
			if (selectionMode === "single") {
				return currentValue;
			}
			return Array.isArray(currentValue) ? currentValue : [];
		}, [state, path, selectionMode]);

		const { localState } = useFormField({ initialValue, state, path });

		const handleSelectionChange = action((value: string | string[] | null) => {
			localState.value = value;
		});

		return (
			<BaseChipSelect
				options={options}
				selectionMode={selectionMode}
				value={localState.value}
				onSelectionChange={handleSelectionChange}
			/>
		);
	},
);

// Re-export types for backwards compatibility
export type { BaseChipSelectProps as PureChipSelectProps };
