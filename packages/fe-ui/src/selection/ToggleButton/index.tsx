"use client";

import { useFormField } from "@cocrepo/hook";
import { tools } from "@cocrepo/toolkit";
import type { MobxProps } from "@cocrepo/type";
import { observer } from "mobx-react-lite";
import type { ReactElement } from "react";
import {
	ToggleButton as BaseToggleButton,
	type ToggleButtonProps as BaseToggleButtonProps,
} from "./ToggleButton";

export interface ToggleButtonProps<
	TState extends object = Record<string, unknown>,
> extends MobxProps<TState>,
		Omit<BaseToggleButtonProps, "isSelected" | "onChange"> {}

type ToggleButtonComponent = <TState extends object = Record<string, unknown>>(
	props: ToggleButtonProps<TState>,
) => ReactElement | null;

export const ToggleButton = Object.assign(
	observer(<TState extends object>(props: ToggleButtonProps<TState>) => {
		const { path, state, ...rest } = props;
		const field = useFormField<TState, boolean>({
			path,
			state,
			value: Boolean(tools.get(state, path)),
		});

		return (
			<BaseToggleButton
				{...rest}
				isSelected={Boolean(field.state.value)}
				onChange={field.setValue as BaseToggleButtonProps["onChange"]}
			/>
		);
	}),
	BaseToggleButton,
) as ToggleButtonComponent & typeof BaseToggleButton;

export type { BaseToggleButtonProps as PureToggleButtonProps };
