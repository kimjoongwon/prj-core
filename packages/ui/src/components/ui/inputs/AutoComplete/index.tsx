import { useFormField } from "@cocrepo/hook";
import { MobxProps } from "@cocrepo/type";
import { tools } from "@cocrepo/toolkit";
import { observer } from "mobx-react-lite";
import {
	AutoComplete as BaseAutoComplete,
	type AutoCompleteProps as BaseAutoCompleteProps,
} from "./AutoComplete";

export interface AutoCompleteProps<T>
	extends MobxProps<T>,
		Omit<BaseAutoCompleteProps, "onSelectionChange"> {}

export const AutoComplete = observer(
	<T extends object>(props: AutoCompleteProps<T>) => {
		const { defaultItems = [], state, path, ...rest } = props;

		const value = defaultItems
			? [...defaultItems]?.find((item) => item.key === tools.get(state, path))
			: "";

		const formField = useFormField<any, any>({
			value,
			state,
			path,
		});

		const handleSelectionChange: BaseAutoCompleteProps["onSelectionChange"] = (
			value,
		) => {
			formField.setValue(value);
		};

		return (
			<BaseAutoComplete
				{...rest}
				defaultItems={defaultItems}
				onSelectionChange={handleSelectionChange}
			/>
		);
	},
);

// Re-export types for backwards compatibility
export type { BaseAutoCompleteProps as PureAutoCompleteProps };
