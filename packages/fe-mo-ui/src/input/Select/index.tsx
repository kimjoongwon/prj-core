"use client";

import { useFormField } from "@cocrepo/hook/useFormField";
import { tools } from "@cocrepo/toolkit";
import type { MobxProps } from "@cocrepo/type";
import { observer } from "mobx-react-lite";
import {
	PureSelect,
	type PureSelectProps,
	type SelectOption,
	selectClassNames,
	useSelect,
	useSelectAnimation,
	useSelectItem,
} from "./Select";

export interface SelectProps<TState extends object = Record<string, unknown>>
	extends MobxProps<TState>,
		Omit<PureSelectProps, "onChange" | "value"> {}

const Select = observer(<TState extends object>(props: SelectProps<TState>) => {
	const { options = [], path, state, ...rest } = props;
	const fallback = options[0]?.value ?? "";
	const field = useFormField<TState, string>({
		path,
		state,
		value: (tools.get(state, path) ?? fallback) as string,
	});

	return (
		<PureSelect
			{...rest}
			onChange={field.setValue}
			options={options}
			value={field.state.value}
		/>
	);
});
Select.displayName = "Select";

const SelectWithStatics = Object.assign(Select, {
	Close: PureSelect.Close,
	Content: PureSelect.Content,
	Item: PureSelect.Item,
	ItemDescription: PureSelect.ItemDescription,
	ItemIndicator: PureSelect.ItemIndicator,
	ItemLabel: PureSelect.ItemLabel,
	ListLabel: PureSelect.ListLabel,
	Overlay: PureSelect.Overlay,
	Portal: PureSelect.Portal,
	Trigger: PureSelect.Trigger,
	TriggerIndicator: PureSelect.TriggerIndicator,
	Value: PureSelect.Value,
}) as typeof Select &
	Pick<
		typeof PureSelect,
		| "Close"
		| "Content"
		| "Item"
		| "ItemIndicator"
		| "Overlay"
		| "Portal"
		| "Trigger"
		| "TriggerIndicator"
		| "Value"
	> & {
		ItemDescription: typeof PureSelect.ItemDescription;
		ItemLabel: typeof PureSelect.ItemLabel;
		ListLabel: typeof PureSelect.ListLabel;
	};
export { SelectWithStatics as Select };
export { selectClassNames, useSelect, useSelectAnimation, useSelectItem };
export type { PureSelectProps, SelectOption };
