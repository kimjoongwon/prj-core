"use client";

import { useFormField } from "@cocrepo/hook";
import { tools } from "@cocrepo/toolkit";
import type { MobxProps } from "@cocrepo/type";
import { observer } from "mobx-react-lite";
import {
	AutoComplete as BaseAutoComplete,
	type AutoCompleteProps as BaseAutoCompleteProps,
} from "./AutoComplete";

type AutoCompleteItem = NonNullable<BaseAutoCompleteProps["defaultItems"]>[number];
type AutoCompleteFieldValue = AutoCompleteItem | string | number | null;

export interface AutoCompleteProps<T>
	extends MobxProps<T>,
		Omit<BaseAutoCompleteProps, "onSelectionChange"> {}

export const AutoComplete = observer(
	<T extends object>(props: AutoCompleteProps<T>) => {
		const { defaultItems = [], state, path, ...rest } = props;

		const value: AutoCompleteFieldValue = defaultItems
			? ([...defaultItems].find((item) => item.key === tools.get(state, path)) ??
				"")
			: "";

		const formField = useFormField<T, AutoCompleteFieldValue>({
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
