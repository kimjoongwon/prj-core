"use client";

import { useFormField } from "@cocrepo/hook/useFormField";
import type { MobxProps, Paths } from "@cocrepo/type";
import { makeAutoObservable } from "mobx";
import { observer, useLocalObservable } from "mobx-react-lite";
import {
	PureSelect,
	type PureSelectProps,
	type SelectOption,
	selectClassNames,
	useSelect,
	useSelectAnimation,
	useSelectItem,
} from "./Select";
import { useRegisterInputState } from "../input-state-inspection";

type BoundSelectProps<TState extends object> = MobxProps<TState> &
	(Omit<PureSelectProps, "onChange" | "value" | "defaultValue"> & {
		value?: never;
		defaultValue?: string;
		onChange?: PureSelectProps["onChange"];
	});
type UnboundSelectProps = Omit<
	PureSelectProps,
	"onChange" | "value" | "defaultValue"
> & {
	state?: never;
	path?: never;
	value?: string;
	defaultValue?: string;
	onChange?: PureSelectProps["onChange"];
};
export type SelectProps<TState extends object = Record<string, unknown>> =
	| BoundSelectProps<TState>
	| UnboundSelectProps;
export function createSelectState(value = "") {
	const state = {
		value,
		setValue(nextValue: string) {
			state.value = nextValue;
		},
	};
	return makeAutoObservable(state, {}, { autoBind: true, name: "SelectState" });
}
export type SelectState = ReturnType<typeof createSelectState>;

const Select = observer(<TState extends object>(props: SelectProps<TState>) => {
	const {
		defaultValue,
		onChange,
		options = [],
		path,
		state,
		value: controlledValue,
		...rest
	} = props;
	const fallback = defaultValue ?? options[0]?.value ?? "";
	const localState = useLocalObservable(() => createSelectState(fallback));
	const field = useFormField<TState, string>({
		path: (state && path ? path : "value") as Paths<TState, 4>,
		state: (state ?? localState) as TState,
		defaultValue: fallback,
	});
	const isBound = state !== undefined && path !== undefined;
	const isControlled = !isBound && controlledValue !== undefined;
	const value = isControlled ? controlledValue : field.state.value;
	useRegisterInputState(
		() => (isControlled ? controlledValue : field.state.value),
		isControlled ? controlledValue : field.state.value,
	);

	return (
		<PureSelect
			{...rest}
			onChange={(nextValue) => {
				if (!isControlled) field.setValue(nextValue);
				onChange?.(nextValue);
			}}
			options={options}
			value={value}
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
