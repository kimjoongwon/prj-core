import { useFormField } from "@cocrepo/hook";
import { tools } from "@cocrepo/toolkit";
import type { MobxProps } from "@cocrepo/type";
import { observer } from "mobx-react-lite";
import type { ReactElement } from "react";
import type { Key } from "react-aria-components";
import {
	ComboBox as BaseComboBox,
	type ComboBoxProps as BaseComboBoxProps,
} from "./ComboBox";

export interface ComboBoxProps<TState extends object = Record<string, unknown>>
	extends MobxProps<TState>,
		Omit<BaseComboBoxProps, "onSelectionChange" | "selectedKey"> {}

type ComboBoxComponent = <TState extends object = Record<string, unknown>>(
	props: ComboBoxProps<TState>,
) => ReactElement | null;

export const ComboBox = Object.assign(
	observer(<TState extends object>(props: ComboBoxProps<TState>) => {
		const { path, state, ...rest } = props;
		const currentValue = tools.get(state, path);
		const field = useFormField<TState, Key | null>({
			path,
			state,
			value:
				currentValue === undefined || currentValue === null || currentValue === ""
					? null
					: (String(currentValue) as Key),
		});

		const handleSelectionChange = (key: Key | null) => {
			field.setValue(key == null ? null : String(key));
		};

		return (
			<BaseComboBox
				{...rest}
				onSelectionChange={handleSelectionChange}
				selectedKey={field.state.value}
			/>
		);
	}),
	BaseComboBox,
) as ComboBoxComponent & typeof BaseComboBox;

export type { BaseComboBoxProps as PureComboBoxProps };
