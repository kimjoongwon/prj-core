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
import { Typography } from "../../data-display/Typography";
import { getTextContent } from "../../data-display/text-content";

type HeroButtonProps = ComponentPropsWithoutRef<typeof HeroButton>;
export type ButtonProps = HeroButtonProps & {};

// sm button 시각 높이는 40px(h-10)라 hit slop으로 44px 터치 영역을 보장합니다.
const SMALL_BUTTON_HIT_SLOP = { bottom: 2, left: 2, right: 2, top: 2 };

const ButtonComponent = forwardRef<
	ComponentRef<typeof HeroButton>,
	ButtonProps
>(({ children, hitSlop, size = "md", variant = "primary", ...props }, ref) => {
	const label = getTextContent(children);

	return (
		<HeroButton
			{...props}
			hitSlop={hitSlop ?? (size === "sm" ? SMALL_BUTTON_HIT_SLOP : undefined)}
			ref={ref}
			size={size}
			variant={variant}
		>
			{label === null ? (
				children
			) : (
				<Typography
					className={buttonClassNames.label({ size, variant })}
					type="body-sm"
				>
					{label}
				</Typography>
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
