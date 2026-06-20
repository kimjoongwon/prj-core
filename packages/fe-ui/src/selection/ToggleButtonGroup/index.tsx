import { useFormField } from "@cocrepo/hook";
import { tools } from "@cocrepo/toolkit";
import type { MobxProps } from "@cocrepo/type";
import { observer } from "mobx-react-lite";
import type { ReactElement } from "react";
import type { Key } from "react-aria-components";
import {
	ToggleButtonGroup as BaseToggleButtonGroup,
	type ToggleButtonGroupProps as BaseToggleButtonGroupProps,
} from "./ToggleButtonGroup";

type ToggleButtonGroupValue = string[];

const toKeyArray = (value: unknown): ToggleButtonGroupValue => {
	if (value === undefined || value === null) {
		return [];
	}

	if (value === "all") {
		return ["all"];
	}

	if (typeof value === "string" || typeof value === "number") {
		return [String(value)];
	}

	if (Array.isArray(value)) {
		return value.map(String);
	}

	if (value instanceof Set) {
		return Array.from(value).map(String);
	}

	if (typeof (value as Iterable<Key>)?.[Symbol.iterator] === "function") {
		return Array.from(value as Iterable<Key>).map(String);
	}

	return [];
};

export interface ToggleButtonGroupProps<
	TState extends object = Record<string, unknown>,
> extends MobxProps<TState>,
		Omit<BaseToggleButtonGroupProps, "onSelectionChange" | "selectedKeys"> {}

type ToggleButtonGroupComponent = <
	TState extends object = Record<string, unknown>,
>(
	props: ToggleButtonGroupProps<TState>,
) => ReactElement | null;

export const ToggleButtonGroup = Object.assign(
	observer(<TState extends object>(props: ToggleButtonGroupProps<TState>) => {
		const { path, state, ...rest } = props;
		const field = useFormField<TState, ToggleButtonGroupValue>({
			path,
			state,
			value: toKeyArray(
				tools.get(state, path) ?? rest.defaultSelectedKeys,
			),
		});

		const handleSelectionChange = (keys: unknown) => {
			field.setValue(toKeyArray(keys));
		};

		return (
			<BaseToggleButtonGroup
				{...rest}
				onSelectionChange={
					handleSelectionChange as BaseToggleButtonGroupProps["onSelectionChange"]
				}
				selectedKeys={field.state.value}
			/>
		);
	}),
	BaseToggleButtonGroup,
) as ToggleButtonGroupComponent & typeof BaseToggleButtonGroup;

export type { BaseToggleButtonGroupProps as PureToggleButtonGroupProps };
