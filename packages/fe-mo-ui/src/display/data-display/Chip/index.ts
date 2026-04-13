import {
	createElement,
	forwardRef,
	type ComponentPropsWithoutRef,
	type ElementRef,
} from "react";
import { Chip as HeroChip, chipClassNames, useChip } from "heroui-native/chip";

type HeroChipProps = ComponentPropsWithoutRef<typeof HeroChip>;

export type ChipProps = HeroChipProps & {};

const ChipComponent = forwardRef<ElementRef<typeof HeroChip>, ChipProps>(
	(props, ref) => createElement(HeroChip, { ...props, ref }),
);

ChipComponent.displayName = "Chip";

export const Chip = Object.assign(ChipComponent, HeroChip) as typeof HeroChip;

export { chipClassNames, useChip };
