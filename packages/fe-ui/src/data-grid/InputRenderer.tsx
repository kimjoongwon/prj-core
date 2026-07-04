"use client";

import type { DataGridState, InputConfig } from "@cocrepo/type";
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
	state: DataGridState;
}

/**
 * InputConfig에 따라 적절한 입력 컴포넌트를 렌더링
 */
export const InputRenderer = observer(
	({ config, state }: InputRendererProps) => {
		switch (config.type) {
			case "search":
				return <SearchInput config={config} state={state} />;
			case "select":
				return <SelectInput config={config} state={state} />;
			case "button":
				return <ButtonInput config={config} />;
			case "dropdown":
				return <DropdownInput config={config} />;
			case "multi-select":
				return <MultiSelectInput config={config} state={state} />;
			case "date-range":
				return <DateRangeInput config={config} state={state} />;
			case "chip-group":
				return <ChipGroupInput config={config} state={state} />;
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
