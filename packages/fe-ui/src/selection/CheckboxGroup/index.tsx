import { useFormField } from "@cocrepo/hook";
import { tools } from "@cocrepo/toolkit";
import type { MobxProps } from "@cocrepo/type";
import { observer } from "mobx-react-lite";
import type { ReactElement } from "react";
import {
	CheckboxGroup as BaseCheckboxGroup,
	type CheckboxGroupProps as BaseCheckboxGroupProps,
} from "./CheckboxGroup";

export interface CheckboxGroupProps<TState extends object = Record<string, unknown>>
	extends MobxProps<TState>,
		Omit<BaseCheckboxGroupProps, "onChange" | "value"> {}

type CheckboxGroupComponent = <
	TState extends object = Record<string, unknown>,
>(
	props: CheckboxGroupProps<TState>,
) => ReactElement | null;

export const CheckboxGroup = Object.assign(
	observer(<TState extends object>(props: CheckboxGroupProps<TState>) => {
		const { path, state, ...rest } = props;
		const field = useFormField<TState, string[]>({
			path,
			state,
			value: (tools.get(state, path) ?? []) as string[],
		});

		return (
			<BaseCheckboxGroup
				{...rest}
				onChange={field.setValue as BaseCheckboxGroupProps["onChange"]}
				value={field.state.value}
			/>
		);
	}),
	BaseCheckboxGroup,
) as CheckboxGroupComponent & typeof BaseCheckboxGroup;

export type { BaseCheckboxGroupProps as PureCheckboxGroupProps };
