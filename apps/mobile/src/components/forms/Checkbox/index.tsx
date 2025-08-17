import React, { useCallback } from "react";
import { useFormField } from "@shared/hooks";
import { get } from "lodash-es";
import { action } from "mobx";
import { observer } from "mobx-react-lite";
import { MobxProps } from "@shared/types";
import {
	Checkbox as CheckboxComponent,
	CheckboxProps as BaseCheckboxProps,
	CheckboxRef,
} from "./Checkbox";

export interface CheckboxProps<T>
	extends MobxProps<T>,
		Omit<BaseCheckboxProps, "isSelected" | "onValueChange"> {}

export const Checkbox = observer(
	<T extends object>(
		props: CheckboxProps<T> & { ref?: React.Ref<CheckboxRef> },
	) => {
		const { state, path, defaultSelected = false, ...rest } = props;

		const initialValue = get(state, path || "", defaultSelected);

		const { localState } = useFormField({
			initialValue,
			state,
			path,
		});

		const isSelected = localState.value;

		const handleValueChange = useCallback(
			action((newValue: boolean) => {
				localState.value = newValue;
			}),
			[localState],
		);

		return <CheckboxComponent {...rest} onValueChange={handleValueChange} />;
	},
);

Checkbox.displayName = "MobxCheckbox";

export { Checkbox as default } from "./Checkbox";
