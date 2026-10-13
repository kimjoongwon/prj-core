"use client";

import type { DataGridQueryState, InputConfig } from "@cocrepo/type";
import { observer } from "mobx-react-lite";
import { ButtonInput } from "./ButtonInput/ButtonInput";
import { ChipGroupInput } from "./ChipGroupInput/ChipGroupInput";
import { DateRangeInput } from "./DateRangeInput/DateRangeInput";
import { DropdownInput } from "./DropdownInput/DropdownInput";
import { MultiSelectInput } from "./MultiSelectInput/MultiSelectInput";
import { SearchInput } from "./SearchInput/SearchInput";
import { SelectInput } from "./SelectInput/SelectInput";

export interface InputRendererProps {
	config: InputConfig;
	queryValues: DataGridQueryState;
	onQueryChange: (values: Record<string, unknown | null>) => void;
}

/** InputConfig에 해당하는 DataGrid 입력 컴포넌트를 렌더링합니다. */
export const InputRenderer = observer(function InputRenderer({
	config,
	queryValues,
	onQueryChange,
}: InputRendererProps) {
	switch (config.type) {
		case "search":
			return (
				<SearchInput
					config={config}
					queryValues={queryValues}
					onQueryChange={onQueryChange}
				/>
			);
		case "select":
			return (
				<SelectInput
					config={config}
					queryValues={queryValues}
					onQueryChange={onQueryChange}
				/>
			);
		case "button":
			return <ButtonInput config={config} />;
		case "dropdown":
			return <DropdownInput config={config} />;
		case "multi-select":
			return (
				<MultiSelectInput
					config={config}
					queryValues={queryValues}
					onQueryChange={onQueryChange}
				/>
			);
		case "date-range":
			return (
				<DateRangeInput
					config={config}
					queryValues={queryValues}
					onQueryChange={onQueryChange}
				/>
			);
		case "chip-group":
			return (
				<ChipGroupInput
					config={config}
					queryValues={queryValues}
					onQueryChange={onQueryChange}
				/>
			);
		case "custom": {
			const CustomComponent = config.props?.component;
			return CustomComponent ? (
				<CustomComponent {...config.props?.componentProps} />
			) : null;
		}
		default:
			return null;
	}
});
