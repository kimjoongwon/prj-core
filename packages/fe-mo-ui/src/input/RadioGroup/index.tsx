"use client";

import { useFormField } from "@cocrepo/hook/useFormField";
import { tools } from "@cocrepo/toolkit";
import type { MobxProps } from "@cocrepo/type";
import { observer } from "mobx-react-lite";
import {
	PureRadioGroup,
	type PureRadioGroupProps,
	type RadioOption,
	radioGroupClassNames,
	useRadioGroup,
	useRadioGroupItem,
} from "./RadioGroup";

export interface RadioGroupProps<
	TState extends object = Record<string, unknown>,
> extends MobxProps<TState>,
		Omit<PureRadioGroupProps, "onValueChange" | "value"> {}

const RadioGroup = observer(
	<TState extends object>(props: RadioGroupProps<TState>) => {
		const { options = [], path, state, ...rest } = props;
		const fallback = options[0]?.value ?? "";
		const field = useFormField<TState, string>({
			path,
			state,
			value: (tools.get(state, path) ?? fallback) as string,
		});

		return (
			<PureRadioGroup
				{...rest}
				onValueChange={field.setValue}
				options={options}
				value={field.state.value}
			/>
		);
	},
);
RadioGroup.displayName = "RadioGroup";

const RadioGroupWithStatics = Object.assign(RadioGroup, {
	Item: PureRadioGroup.Item,
}) as typeof RadioGroup & {
	Item: typeof PureRadioGroup.Item;
};
export { RadioGroupWithStatics as RadioGroup };
export { radioGroupClassNames, useRadioGroup, useRadioGroupItem };
export type { PureRadioGroupProps, RadioOption };
