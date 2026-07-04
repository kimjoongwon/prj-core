"use client";

import { useFormField } from "@cocrepo/hook/useFormField";
import { tools } from "@cocrepo/toolkit";
import type { MobxProps } from "@cocrepo/type";
import { observer } from "mobx-react-lite";
import {
	controlFieldClassNames,
	PureControlField,
	type PureControlFieldProps,
	useControlField,
} from "./ControlField";

export interface ControlFieldProps<
	TState extends object = Record<string, unknown>,
> extends MobxProps<TState>,
		Omit<PureControlFieldProps, "isSelected" | "onSelectedChange"> {}

const ControlField = observer(
	<TState extends object>(props: ControlFieldProps<TState>) => {
		const { path, state, ...rest } = props;
		const field = useFormField<TState, boolean>({
			path,
			state,
			value: (tools.get(state, path) ?? false) as boolean,
		});

		return (
			<PureControlField
				{...rest}
				isSelected={Boolean(field.state.value)}
				onSelectedChange={field.setValue}
			/>
		);
	},
);

ControlField.displayName = "ControlField";
const ControlFieldWithStatics = Object.assign(
	ControlField,
	PureControlField,
) as typeof ControlField & typeof PureControlField;
export { ControlFieldWithStatics as ControlField };
export { controlFieldClassNames, PureControlField, useControlField };
export type { PureControlFieldProps };
export type * from "heroui-native/control-field";
