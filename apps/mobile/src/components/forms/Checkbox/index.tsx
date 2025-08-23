import { useFormField } from "@shared/hooks";
import { MobxProps } from "@shared/types";
import { get } from "lodash-es";
import { action } from "mobx";
import { observer } from "mobx-react-lite";
import React, { useCallback } from "react";
import {
	CheckboxProps as BaseCheckboxProps,
	Checkbox as CheckboxComponent,
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

		const initialValue = get(state, path || "", defaultSelected) as boolean;

		const { localState } = useFormField<any, boolean>({
			initialValue,
			state,
			path,
		});

		const handleValueChange = useCallback(
			action((newValue: boolean) => {
				localState.value = newValue;
			}),
			[localState],
		);

		return (
			<CheckboxComponent
				{...rest}
				onValueChange={handleValueChange}
				isSelected={!!localState.value}
			/>
		);
	},
);

Checkbox.displayName = "MobxCheckbox";

export { Checkbox as default } from "./Checkbox";
