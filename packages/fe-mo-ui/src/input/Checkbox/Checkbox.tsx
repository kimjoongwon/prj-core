import {
	checkboxClassNames,
	Checkbox as HeroCheckbox,
	useCheckbox,
} from "heroui-native";
import {
	type ComponentPropsWithoutRef,
	type ComponentRef,
	forwardRef,
} from "react";
import { View } from "react-native";
import { getTextContent, Text } from "../../data-display/Text";
import { joinClassNames } from "../../rhythm/class-name";

type HeroCheckboxProps = ComponentPropsWithoutRef<typeof HeroCheckbox>;
export interface PureCheckboxProps
	extends Omit<HeroCheckboxProps, "onSelectedChange"> {
	onChange?: (checked: boolean) => void;
}
const PureCheckboxComponent = forwardRef<
	ComponentRef<typeof HeroCheckbox>,
	PureCheckboxProps
>(({ children, className, onChange, ...rest }, ref) => {
	const label =
		typeof children === "function" ? null : getTextContent(children);

	if (label === null) {
		return (
			<HeroCheckbox
				{...(rest as HeroCheckboxProps)}
				className={className}
				onSelectedChange={onChange}
				ref={ref}
			>
				{children}
			</HeroCheckbox>
		);
	}

	return (
		<HeroCheckbox
			{...(rest as HeroCheckboxProps)}
			className={joinClassNames(
				// 저수준 layout 예외: heroui-native Checkbox label 행 계약을 그대로 노출하는 래퍼라 raw gap을 유지합니다.
				"h-auto w-full flex-row items-center gap-3 overflow-visible rounded-none bg-transparent shadow-none",
				className,
			)}
			onSelectedChange={onChange}
			ref={ref}
		>
			<View className="relative size-6 overflow-hidden rounded-lg bg-field shadow-field">
				<HeroCheckbox.Indicator />
			</View>
			<Text className="flex-1" variant="label">
				{label}
			</Text>
		</HeroCheckbox>
	);
});
PureCheckboxComponent.displayName = "PureCheckbox";
export const PureCheckbox = Object.assign(PureCheckboxComponent, {
	Indicator: HeroCheckbox.Indicator,
}) as typeof PureCheckboxComponent & Pick<typeof HeroCheckbox, "Indicator">;
export const Checkbox = PureCheckbox;
export type CheckboxProps = PureCheckboxProps;
export { checkboxClassNames, useCheckbox };
