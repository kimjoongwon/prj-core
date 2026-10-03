import { Radio as HeroRadio, radioClassNames, useRadio } from "heroui-native";
import {
	type ComponentPropsWithoutRef,
	type ComponentRef,
	forwardRef,
} from "react";
import { View } from "react-native";
import { Typography } from "../../data-display/Typography";
import { getTextContent } from "../../data-display/text-content";

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
		// 저수준 layout 예외: heroui-native Radio label 행 계약을 그대로 노출하는 래퍼라 raw gap을 유지합니다.
		<View className="w-full flex-row items-center gap-3">
			<HeroRadio {...props} ref={ref} />
			<Typography className="flex-1" type="body-sm" weight="semibold">
				{label}
			</Typography>
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
