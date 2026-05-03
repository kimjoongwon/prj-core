import {
	createElement,
	forwardRef,
	type ComponentPropsWithoutRef,
	type ElementRef,
} from "react";
import { useFormField } from "@cocrepo/hook";
import { tools } from "@cocrepo/toolkit";
import type { MobxProps } from "@cocrepo/type";
import { observer } from "mobx-react-lite";
import {
	Checkbox as HeroCheckbox,
	checkboxClassNames,
	useCheckbox,
} from "heroui-native/checkbox";

type HeroCheckboxProps = ComponentPropsWithoutRef<typeof HeroCheckbox>;

export interface PureCheckboxProps
	extends Omit<HeroCheckboxProps, "onSelectedChange"> {
	onChange?: (checked: boolean) => void;
}

const PureCheckboxComponent = forwardRef<
	ElementRef<typeof HeroCheckbox>,
	PureCheckboxProps
>(({ onChange, ...rest }, ref) =>
	createElement(HeroCheckbox, {
		...(rest as HeroCheckboxProps),
		onSelectedChange: onChange,
		ref,
	}),
);

PureCheckboxComponent.displayName = "PureCheckbox";

export interface CheckboxProps<TState extends object = Record<string, unknown>>
	extends MobxProps<TState>,
		Omit<PureCheckboxProps, "isSelected" | "onChange"> {}

const CheckboxComponent = observer(<TState extends object>(props: CheckboxProps<TState>) => {
	const { path, state, ...rest } = props;
	const field = useFormField<TState, boolean>({
		path,
		state,
		value: (tools.get(state, path) ?? false) as boolean,
	});
	const isSelected = Boolean(field.state.value);

	return createElement(PureCheckboxComponent, {
		...rest,
		isSelected,
		onChange: field.setValue,
	});
});

CheckboxComponent.displayName = "Checkbox";

export const Checkbox = Object.assign(CheckboxComponent, {
	Indicator: HeroCheckbox.Indicator,
}) as typeof CheckboxComponent & Pick<typeof HeroCheckbox, "Indicator">;

export { checkboxClassNames, useCheckbox };
