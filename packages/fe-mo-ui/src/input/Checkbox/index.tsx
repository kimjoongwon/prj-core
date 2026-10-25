"use client";

import { useFormField } from "@cocrepo/hook/useFormField";
import type { MobxProps, Paths } from "@cocrepo/type";
import { makeAutoObservable } from "mobx";
import { observer, useLocalObservable } from "mobx-react-lite";
import {
	checkboxClassNames,
	Checkbox as PureCheckbox,
	type PureCheckboxProps,
	useCheckbox,
} from "./Checkbox";
import { useRegisterInputState } from "../input-state-inspection";

type BoundCheckboxProps<TState extends object> = MobxProps<TState> &
	(Omit<PureCheckboxProps, "isSelected" | "onChange"> & {
		isSelected?: never;
		defaultValue?: boolean;
		onChange?: PureCheckboxProps["onChange"];
	});
type UnboundCheckboxProps = Omit<
	PureCheckboxProps,
	"isSelected" | "onChange"
> & {
	state?: never;
	path?: never;
	isSelected?: boolean;
	defaultValue?: boolean;
	onChange?: PureCheckboxProps["onChange"];
};
export type CheckboxProps<TState extends object = Record<string, unknown>> =
	| BoundCheckboxProps<TState>
	| UnboundCheckboxProps;

export function createCheckboxState(value = false) {
	const state = {
		value,
		setValue(nextValue: boolean) {
			state.value = nextValue;
		},
	};
	return makeAutoObservable(
		state,
		{},
		{ autoBind: true, name: "CheckboxState" },
	);
}
export type CheckboxState = ReturnType<typeof createCheckboxState>;

const Checkbox = observer(
	<TState extends object>(props: CheckboxProps<TState>) => {
		const {
			defaultValue,
			isSelected: controlledValue,
			onChange,
			path,
			state,
			...rest
		} = props;
		const localState = useLocalObservable(() =>
			createCheckboxState(defaultValue ?? false),
		);
		const field = useFormField<TState, boolean>({
			path: (state && path ? path : "value") as Paths<TState, 4>,
			state: (state ?? localState) as TState,
			defaultValue: defaultValue ?? false,
		});
		const isBound = state !== undefined && path !== undefined;
		const isControlled = !isBound && controlledValue !== undefined;
		const isSelected = isControlled
			? controlledValue
			: Boolean(field.state.value);
		useRegisterInputState(
			() => (isControlled ? controlledValue : field.state.value),
			isControlled ? controlledValue : field.state.value,
		);

		return (
			<PureCheckbox
				{...rest}
				isSelected={isSelected}
				onChange={(nextValue) => {
					if (!isControlled) field.setValue(nextValue);
					onChange?.(nextValue);
				}}
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
