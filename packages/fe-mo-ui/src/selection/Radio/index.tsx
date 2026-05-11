import {
  forwardRef,
  type ComponentPropsWithoutRef,
  type ComponentRef,
} from "react";
import {
  Radio as HeroRadio,
  radioClassNames,
  useRadio,
} from "heroui-native/radio";
type HeroRadioProps = ComponentPropsWithoutRef<typeof HeroRadio>;
export type RadioProps = HeroRadioProps & {};
const RadioComponent = forwardRef<ComponentRef<typeof HeroRadio>, RadioProps>(
  (props, ref) => <HeroRadio {...props} ref={ref} />,
);
RadioComponent.displayName = "Radio";
export const Radio = Object.assign(
  RadioComponent,
  HeroRadio,
) as typeof HeroRadio;
export { radioClassNames, useRadio };
