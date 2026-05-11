import {
  forwardRef,
  type ComponentPropsWithoutRef,
  type ComponentRef,
} from "react";
import { Chip as HeroChip, chipClassNames, useChip } from "heroui-native/chip";
type HeroChipProps = ComponentPropsWithoutRef<typeof HeroChip>;
export type ChipProps = HeroChipProps & {};
const ChipComponent = forwardRef<ComponentRef<typeof HeroChip>, ChipProps>(
  (props, ref) => <HeroChip {...props} ref={ref} />,
);
ChipComponent.displayName = "Chip";
export const Chip = Object.assign(ChipComponent, HeroChip) as typeof HeroChip;
export { chipClassNames, useChip };
