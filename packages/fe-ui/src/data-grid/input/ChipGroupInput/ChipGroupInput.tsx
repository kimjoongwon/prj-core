"use client";

import type { DataGridQueryState, InputConfig } from "@cocrepo/type";
import { observer } from "mobx-react-lite";
import { useT } from "../../../i18n";
import { Button } from "../../../input/Button/Button";
import { useHandlers } from "./useHandlers";

export interface ChipGroupInputProps {
	config: InputConfig;
	queryValues: DataGridQueryState;
	onQueryChange: (values: Record<string, unknown | null>) => void;
}

export const ChipGroupInput = observer((state: ChipGroupInputProps) => {
	const { config } = state;
	const t = useT();
	const handlers = useHandlers(state);
	const { selectedSet } = handlers;
	const options = config.props?.options ?? [];

	return (
		<div className="flex flex-wrap items-center gap-2">
			{options.map((option) => {
				const isSelected = selectedSet.has(option.value);

				return (
					<Button
						key={option.value}
						size="sm"
						variant={isSelected ? "primary" : "outline"}
						onPress={() => handlers.toggleSelection(option.value)}
					>
						{t(option.label)}
					</Button>
				);
			})}
		</div>
	);
});
