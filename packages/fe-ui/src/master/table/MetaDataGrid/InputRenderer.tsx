"use client";

import type {
	InputConfig,
	MetaDataGridState,
} from "@cocrepo/type";
import { observer } from "mobx-react-lite";
import { ButtonInput } from "./ButtonInput";
import { DropdownInput } from "./DropdownInput";
import { SearchInput } from "./SearchInput";
import { SelectInput } from "./SelectInput";

interface InputRendererProps {
	config: InputConfig;
	state: MetaDataGridState;
}

/**
 * InputConfig에 따라 적절한 입력 컴포넌트를 렌더링
 */
export const InputRenderer = observer(({
	config,
	state,
}: InputRendererProps) => {
	switch (config.type) {
		case "search":
			return (
				<SearchInput
					config={config}
					state={state}
				/>
			);
		case "select":
			return (
				<SelectInput
					config={config}
					state={state}
				/>
			);
		case "button":
			return <ButtonInput config={config} />;
		case "dropdown":
			return <DropdownInput config={config} />;
		case "multi-select":
			// TODO: 구현 예정
			return null;
		case "date-range":
			// TODO: 구현 예정
			return null;
		case "chip-group":
			// TODO: 구현 예정
			return null;
		case "custom":
			if (config.props?.component) {
				const CustomComponent = config.props.component;
				return <CustomComponent {...config.props.componentProps} />;
			}
			return null;
		default:
			return null;
	}
});
