"use client";

import type { DataGridQueryState, InputConfig } from "@cocrepo/type";
import { Popover } from "@heroui/react";
import { ChevronDown } from "lucide-react";
import { observer } from "mobx-react-lite";
import { useT } from "../../../i18n";
import { Button } from "../../../input/Button/Button";
import { Checkbox } from "../../../input/Checkbox/Checkbox";
import { useHandlers } from "./useHandlers";

export interface MultiSelectInputProps {
	config: InputConfig;
	queryValues: DataGridQueryState;
	onQueryChange: (values: Record<string, unknown | null>) => void;
}

export const MultiSelectInput = observer((state: MultiSelectInputProps) => {
	const { config } = state;
	const t = useT();
	const handlers = useHandlers(state);
	const { selectedValues, selectedSet } = handlers;
	const options = config.props?.options ?? [];
	const label = config.label ?? config.placeholder ?? config.id;

	return (
		<Popover>
			<Popover.Trigger>
				<Button size="sm" variant="outline">
					{selectedValues.length > 0
						? `${t(label)} ${selectedValues.length}`
						: t(label)}
					<ChevronDown className="size-4" aria-hidden />
				</Button>
			</Popover.Trigger>
			<Popover.Content placement="bottom start">
				<div className="flex min-w-48 flex-col gap-2 p-3">
					{options.map((option) => (
						<Checkbox
							key={option.value}
							isSelected={selectedSet.has(option.value)}
							onChange={(isSelected) =>
								handlers.toggleSelection(option.value, isSelected)
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
});
