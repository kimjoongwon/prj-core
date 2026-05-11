import {
  forwardRef,
  type ComponentPropsWithoutRef,
  type ComponentRef,
} from "react";
import {
  Separator as HeroSeparator,
  separatorClassNames,
} from "heroui-native/separator";
type HeroSeparatorProps = ComponentPropsWithoutRef<typeof HeroSeparator>;
export type SeparatorProps = HeroSeparatorProps & {};
const SeparatorComponent = forwardRef<
  ComponentRef<typeof HeroSeparator>,
  SeparatorProps
>((props, ref) => <HeroSeparator {...props} ref={ref} />);
SeparatorComponent.displayName = "Separator";
export const Separator = Object.assign(
  SeparatorComponent,
  HeroSeparator,
) as typeof HeroSeparator;
export { separatorClassNames };
