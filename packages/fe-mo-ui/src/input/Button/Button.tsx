import {
	buttonClassNames,
	Button as HeroButton,
	useButton,
} from "heroui-native";
import {
	type ComponentPropsWithoutRef,
	type ComponentRef,
	forwardRef,
} from "react";
import { getTextContent, Text } from "../../data-display/Text";

type HeroButtonProps = ComponentPropsWithoutRef<typeof HeroButton>;
export type ButtonProps = HeroButtonProps & {};
const ButtonComponent = forwardRef<
	ComponentRef<typeof HeroButton>,
	ButtonProps
>(({ children, size = "md", variant = "primary", ...props }, ref) => {
	const label = getTextContent(children);

	return (
		<HeroButton {...props} ref={ref} size={size} variant={variant}>
			{label === null ? (
				children
			) : (
				<Text className={buttonClassNames.label({ size, variant })}>
					{label}
				</Text>
			)}
		</HeroButton>
	);
});
ButtonComponent.displayName = "Button";
export const Button = Object.assign(
	ButtonComponent,
	HeroButton,
) as typeof HeroButton;
export { buttonClassNames, useButton };
