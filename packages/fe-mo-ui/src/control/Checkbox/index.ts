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
import {
	type FieldChromeProps,
	renderControlFieldChrome,
	resolveFieldInvalid,
} from "../../internal/fieldChrome";
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
		...(rest as HeroCheckboxProps),
		onSelectedChange: onChange,
		ref,
	}),
);

PureCheckboxComponent.displayName = "PureCheckbox";

export interface CheckboxProps<TState extends object = Record<string, unknown>>
	extends MobxProps<TState>,
		FieldChromeProps,
		Omit<PureCheckboxProps, "isSelected" | "onChange"> {}

const CheckboxComponent = observer(<TState extends object>(props: CheckboxProps<TState>) => {
	const {
		description,
		descriptionProps,
		error,
		fieldErrorProps,
		isDisabled,
		isInvalid,
		isRequired,
		label,
		labelProps,
		path,
		state,
		...rest
	} = props;
	const field = useMobxField({ fallback: false, path, state });
	const fieldChrome = {
		description,
		descriptionProps,
		error,
		fieldErrorProps,
		isDisabled,
		isInvalid,
		isRequired,
		label,
		labelProps,
	};
	const resolvedInvalid = resolveFieldInvalid(fieldChrome);
	const isSelected = Boolean(field.value);

	const control = createElement(PureCheckboxComponent, {
		...rest,
		isDisabled,
		isInvalid: resolvedInvalid,
		isSelected,
		onChange: field.setValue,
	});

	return renderControlFieldChrome({
		...fieldChrome,
		control,
		controlFieldProps: {
			isDisabled,
			isInvalid: resolvedInvalid,
			isRequired,
			isSelected,
			onSelectedChange: field.setValue,
		},
		indicatorVariant: "checkbox",
		isInvalid: resolvedInvalid,
	});
});

CheckboxComponent.displayName = "Checkbox";

export const Checkbox = Object.assign(CheckboxComponent, {
	Indicator: HeroCheckbox.Indicator,
}) as typeof CheckboxComponent & Pick<typeof HeroCheckbox, "Indicator">;

export { checkboxClassNames, useCheckbox };
