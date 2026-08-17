"use client";

import type { DataGridQueryStates, InputConfig } from "@cocrepo/type";
import { observer } from "mobx-react-lite";
import {
	ButtonInput,
	ChipGroupInput,
	DateRangeInput,
	DropdownInput,
	MultiSelectInput,
	SearchInput,
	SelectInput,
} from "./input";

interface InputRendererProps {
	config: InputConfig;
	queryValues: DataGridQueryStates;
	onQueryChange: (values: Record<string, unknown | null>) => void;
}

/**
 * InputConfig에 따라 적절한 입력 컴포넌트를 렌더링
 */
export const InputRenderer = observer(
	({ config, queryValues, onQueryChange }: InputRendererProps) => {
		switch (config.type) {
			case "search":
				return <SearchInput config={config} queryValues={queryValues} onQueryChange={onQueryChange} />;
			case "select":
				return <SelectInput config={config} queryValues={queryValues} onQueryChange={onQueryChange} />;
			case "button":
				return <ButtonInput config={config} />;
			case "dropdown":
				return <DropdownInput config={config} />;
			case "multi-select":
				return <MultiSelectInput config={config} queryValues={queryValues} onQueryChange={onQueryChange} />;
			case "date-range":
				return <DateRangeInput config={config} queryValues={queryValues} onQueryChange={onQueryChange} />;
			case "chip-group":
				return <ChipGroupInput config={config} queryValues={queryValues} onQueryChange={onQueryChange} />;
			case "custom":
				if (config.props?.component) {
					const CustomComponent = config.props.component;
					return <CustomComponent {...config.props.componentProps} />;
				}
				return null;
			default:
				return null;
		}
	},
);
