import {
	createElement,
	forwardRef,
	type ComponentPropsWithoutRef,
	type ElementRef,
} from "react";
import { observer } from "mobx-react-lite";
import {
	Checkbox as HeroCheckbox,
	checkboxClassNames,
	useCheckbox,
} from "heroui-native/checkbox";
import { type MobxProps, useMobxField } from "../../internal/useMobxField";

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
		...rest,
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
	const field = useMobxField({ fallback: false, path, state });

	return createElement(PureCheckboxComponent, {
		...rest,
		isSelected: Boolean(field.value),
		onChange: field.setValue,
	});
});

CheckboxComponent.displayName = "Checkbox";

export const Checkbox = Object.assign(CheckboxComponent, {
	Indicator: HeroCheckbox.Indicator,
}) as typeof CheckboxComponent & Pick<typeof HeroCheckbox, "Indicator">;

export { checkboxClassNames, useCheckbox };
