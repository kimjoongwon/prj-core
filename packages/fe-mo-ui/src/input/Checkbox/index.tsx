"use client";

import { useFormField } from "@cocrepo/hook/useFormField";
import { tools } from "@cocrepo/toolkit";
import type { MobxProps } from "@cocrepo/type";
import { observer } from "mobx-react-lite";
import {
	checkboxClassNames,
	Checkbox as PureCheckbox,
	type PureCheckboxProps,
	useCheckbox,
} from "./Checkbox";

export interface CheckboxProps<TState extends object = Record<string, unknown>>
	extends MobxProps<TState>,
		Omit<PureCheckboxProps, "isSelected" | "onChange"> {}

const Checkbox = observer(
	<TState extends object>(props: CheckboxProps<TState>) => {
		const { path, state, ...rest } = props;
		const field = useFormField<TState, boolean>({
			path,
			state,
			value: (tools.get(state, path) ?? false) as boolean,
		});
		const isSelected = Boolean(field.state.value);

		return (
			<PureCheckbox
				{...rest}
				isSelected={isSelected}
				onChange={field.setValue}
			/>
		);
	},
);
Checkbox.displayName = "Checkbox";

const CheckboxWithStatics = Object.assign(Checkbox, {
	Indicator: PureCheckbox.Indicator,
}) as typeof Checkbox & Pick<typeof PureCheckbox, "Indicator">;
export { CheckboxWithStatics as Checkbox };
export { checkboxClassNames, useCheckbox };
export type { PureCheckboxProps };
