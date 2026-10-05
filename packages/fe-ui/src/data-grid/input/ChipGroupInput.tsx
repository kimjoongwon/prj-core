"use client";

import type { DataGridQueryStates, InputConfig } from "@cocrepo/type";
import { observer } from "mobx-react-lite";
import { useT } from "../../i18n";
import { Button } from "../../input/Button/Button";

interface ChipGroupInputProps {
	config: InputConfig;
	queryValues: DataGridQueryStates;
	onQueryChange: (values: Record<string, unknown | null>) => void;
}

function getSelectedValues(value: unknown) {
	if (Array.isArray(value)) {
		return value.filter((item): item is string => typeof item === "string");
	}
	if (typeof value === "string" && value.length > 0) {
		return [value];
	}
	return [];
}

export const ChipGroupInput = observer(
	({ config, queryValues, onQueryChange }: ChipGroupInputProps) => {
		const t = useT();
		const queryKey = config.props?.queryKey ?? config.id;
		const selectedValues = getSelectedValues(queryValues[queryKey]);
		const selectedSet = new Set(selectedValues);
		const options = config.props?.options ?? [];
		const isMultiple = Array.isArray(config.props?.defaultValue);

		const handleSelect = (value: string) => {
			if (!isMultiple) {
				void onQueryChange({
					[queryKey]: selectedSet.has(value) ? null : value,
					skip: 0,
				});
				return;
			}

			const nextSelected = new Set(selectedSet);
			if (nextSelected.has(value)) {
				nextSelected.delete(value);
			} else {
				nextSelected.add(value);
			}

			const nextValues = Array.from(nextSelected);
			void onQueryChange({
				[queryKey]: nextValues.length > 0 ? nextValues : null,
				skip: 0,
			});
		};

		return (
			<div className="flex flex-wrap items-center gap-2">
				{options.map((option) => {
					const isSelected = selectedSet.has(option.value);

					return (
						<Button
							key={option.value}
							size="sm"
							variant={isSelected ? "primary" : "outline"}
							onPress={() => handleSelect(option.value)}
						>
							{t(option.label)}
						</Button>
					);
				})}
			</div>
		);
	},
);
