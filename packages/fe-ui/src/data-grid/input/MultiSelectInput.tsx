"use client";

import type { DataGridState, InputConfig } from "@cocrepo/type";
import { Popover } from "@heroui/react";
import { ChevronDown } from "lucide-react";
import { observer } from "mobx-react-lite";
import { useT } from "../../i18n";
import { Button } from "../../input/Button/Button";
import { Checkbox } from "../../input/Checkbox/Checkbox";

interface MultiSelectInputProps {
	config: InputConfig;
	state: DataGridState;
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

export const MultiSelectInput = observer(
	({ config, state }: MultiSelectInputProps) => {
		const t = useT();
		const queryKey = config.props?.queryKey ?? config.id;
		const selectedValues = getSelectedValues(state.query.values[queryKey]);
		const selectedSet = new Set(selectedValues);
		const options = config.props?.options ?? [];
		const label = config.label ?? config.placeholder ?? config.id;

		const handleToggle = (value: string, isSelected: boolean) => {
			const nextSelected = new Set(selectedSet);
			if (isSelected) {
				nextSelected.add(value);
			} else {
				nextSelected.delete(value);
			}

			const nextValues = Array.from(nextSelected);
			void state.query.setValues({
				[queryKey]: nextValues.length > 0 ? nextValues : null,
				skip: 0,
			});
		};

		return (
			<Popover>
				<Popover.Trigger>
					<Button
						size="sm"
						variant="bordered"
						endContent={<ChevronDown className="size-4" />}
					>
						{selectedValues.length > 0
							? `${t(label)} ${selectedValues.length}`
							: t(label)}
					</Button>
				</Popover.Trigger>
				<Popover.Content placement="bottom start">
					<div className="flex min-w-48 flex-col gap-2 p-3">
						{options.map((option) => (
							<Checkbox
								key={option.value}
								isSelected={selectedSet.has(option.value)}
								onChange={(isSelected) =>
									handleToggle(option.value, isSelected)
								}
								classNames={{
									content: "text-sm font-medium",
								}}
							>
								{option.label}
							</Checkbox>
						))}
					</div>
				</Popover.Content>
			</Popover>
		);
	},
);
