import { get } from "lodash-es";
import { observer } from "mobx-react-lite";
import { useMemo } from "react";
import { v4 } from "uuid";
import { useFormField } from "@shared/hooks";
import type { MobxProps } from "../../../types";
import { Chip } from "../../ui/Chip/Chip";

type SelectionMode = "single" | "multiple" | "none";

export interface ChipSelectProps<T> extends MobxProps<T> {
	options: string[];
	selectionMode?: SelectionMode;
}

export const ChipSelect = observer(
	<T extends object>(props: ChipSelectProps<T>) => {
		const { state, path, options = [], selectionMode = "multiple" } = props;

		const initialValue = useMemo(() => {
			const currentValue = get(state, path);
			if (selectionMode === "single") {
				return currentValue;
			}
			return Array.isArray(currentValue) ? currentValue : [];
		}, [state, path, selectionMode]);

		const { localState } = useFormField({ initialValue, state, path });

		const handleChipPress = (value: string) => {
			if (selectionMode === "none") return;

			if (selectionMode === "single") {
				localState.value = localState.value === value ? null : value;
			} else if (selectionMode === "multiple") {
				const currentValues = Array.isArray(localState.value)
					? localState.value
					: [];
				if (currentValues.includes(value)) {
					localState.value = currentValues.filter((v) => v !== value);
				} else {
					localState.value = [...currentValues, value];
				}
			}
		};

		const isSelected = (value: string): boolean => {
			if (selectionMode === "single") {
				return localState.value === value;
			}
			if (selectionMode === "multiple") {
				return (
					Array.isArray(localState.value) && localState.value.includes(value)
				);
			}
			return false;
		};

		const getChipColor = (value: string) => {
			if (selectionMode === "none") return "default";
			return isSelected(value) ? "primary" : "default";
		};

		const getChipVariant = (value: string) => {
			if (selectionMode === "none") return "flat";
			return isSelected(value) ? "solid" : "flat";
		};

		return (
			<div className="flex flex-wrap gap-2">
				{options.map((option) => (
					<Chip
						key={v4()}
						variant={getChipVariant(option)}
						color={getChipColor(option)}
						className={selectionMode !== "none" ? "cursor-pointer" : ""}
						onClick={
							selectionMode !== "none"
								? () => handleChipPress(option)
								: undefined
						}
					>
						{option}
					</Chip>
				))}
			</div>
		);
	},
);
