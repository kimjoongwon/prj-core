import { chipClassNames, Chip as HeroChip, useChip } from "heroui-native";
import {
	type ComponentPropsWithoutRef,
	type ComponentRef,
	forwardRef,
} from "react";
import { Typography } from "../Typography";
import { getTextContent } from "../text-content";

type HeroChipProps = ComponentPropsWithoutRef<typeof HeroChip>;
export type ChipProps = HeroChipProps & {};
const ChipComponent = forwardRef<ComponentRef<typeof HeroChip>, ChipProps>(
	(
		{ children, color = "accent", size = "md", variant = "primary", ...props },
		ref,
	) => {
		const label = getTextContent(children);

		return (
			<HeroChip
				{...props}
				color={color}
				ref={ref}
				size={size}
				variant={variant}
			>
				{label === null ? (
					children
				) : (
					<Typography
						className={chipClassNames.label({ color, size, variant })}
						type="body-sm"
					>
						{label}
					</Typography>
				)}
			</HeroChip>
		);
	},
);
ChipComponent.displayName = "Chip";
export const Chip = Object.assign(ChipComponent, HeroChip) as typeof HeroChip;
export { chipClassNames, useChip };
