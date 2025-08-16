import { get } from "lodash-es";
import { action } from "mobx";
import { observer } from "mobx-react-lite";
import { useFormField } from "@shared/hooks";
import { MobxProps } from "../../../types";
import {
	AutoComplete as BaseAutoComplete,
	type AutoCompleteProps as BaseAutoCompleteProps,
} from "./AutoComplete";

export interface AutoCompleteProps<T>
	extends MobxProps<T>,
		Omit<BaseAutoCompleteProps, "onSelectionChange"> {}

export const AutoComplete = observer(
	<T extends object>(props: AutoCompleteProps<T>) => {
		const { defaultItems = [], state = {}, path = "", ...rest } = props;

		const initialValue = defaultItems
			? [...defaultItems]?.find((item) => item.key === get(state, path))
			: "";

		const { localState } = useFormField({ initialValue, state, path });

		const handleSelectionChange = action((key: string | number | null) => {
			localState.value = key;
		});

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
