import {
	buttonClassNames,
	LinkButton as HeroLinkButton,
	linkButtonClassNames,
} from "heroui-native";
import {
	type ComponentPropsWithoutRef,
	type ComponentRef,
	forwardRef,
} from "react";
import { Typography } from "../../data-display/Typography";
import { getTextContent } from "../../data-display/text-content";

type HeroLinkButtonProps = ComponentPropsWithoutRef<typeof HeroLinkButton>;
export type LinkButtonProps = HeroLinkButtonProps & {};

// 링크는 텍스트 높이로만 렌더링되므로 hit slop으로 44px 터치 영역을 보장합니다.
const LINK_BUTTON_HIT_SLOP = { bottom: 12, left: 8, right: 8, top: 12 };

const LinkButtonComponent = forwardRef<
	ComponentRef<typeof HeroLinkButton>,
	LinkButtonProps
>(({ children, hitSlop, size = "md", ...props }, ref) => {
	const label = getTextContent(children);

	return (
		<HeroLinkButton
			{...props}
			hitSlop={hitSlop ?? LINK_BUTTON_HIT_SLOP}
			ref={ref}
			size={size}
		>
			{label === null ? (
				children
			) : (
				<Typography
					className={buttonClassNames.label({ size, variant: "ghost" })}
					type="body-sm"
				>
					{label}
				</Typography>
			)}
		</HeroLinkButton>
	);
});
LinkButtonComponent.displayName = "LinkButton";
export const LinkButton = Object.assign(
	LinkButtonComponent,
	HeroLinkButton,
) as typeof HeroLinkButton;
export { linkButtonClassNames };
