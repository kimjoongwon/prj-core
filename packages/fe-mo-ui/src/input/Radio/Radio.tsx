import { Radio as HeroRadio, radioClassNames, useRadio } from "heroui-native";
import {
	type ComponentPropsWithoutRef,
	type ComponentRef,
	forwardRef,
} from "react";
import { View } from "react-native";
import { getTextContent, Text } from "../../data-display/Text";

type HeroRadioProps = ComponentPropsWithoutRef<typeof HeroRadio>;
export type PureRadioProps = HeroRadioProps & {};
const PureRadioComponent = forwardRef<
	ComponentRef<typeof HeroRadio>,
	PureRadioProps
>(({ children, ...props }, ref) => {
	const label =
		typeof children === "function" ? null : getTextContent(children);

	if (label === null) {
		return (
			<HeroRadio {...props} ref={ref}>
				{children}
			</HeroRadio>
		);
	}

	return (
		<View className="w-full flex-row items-center gap-3">
			<HeroRadio {...props} ref={ref} />
			<Text className="flex-1" variant="label">
				{label}
			</Text>
		</View>
	);
});
PureRadioComponent.displayName = "PureRadio";
export const PureRadio = Object.assign(
	PureRadioComponent,
	HeroRadio,
) as typeof HeroRadio;
export const Radio = PureRadio;
export type RadioProps = PureRadioProps;
export { radioClassNames, useRadio };
