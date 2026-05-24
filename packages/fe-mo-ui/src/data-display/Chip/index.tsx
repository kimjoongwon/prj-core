import {
  forwardRef,
  type ComponentPropsWithoutRef,
  type ComponentRef,
} from "react";
import { Chip as HeroChip, chipClassNames, useChip } from "heroui-native/chip";
import { getTextContent, Text } from "../Text";
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
          <Text className={chipClassNames.label({ color, size, variant })}>
            {label}
          </Text>
        )}
      </HeroChip>
    );
  },
);
ChipComponent.displayName = "Chip";
export const Chip = Object.assign(ChipComponent, HeroChip) as typeof HeroChip;
export { chipClassNames, useChip };
