import {
  forwardRef,
  type ComponentPropsWithoutRef,
  type ComponentRef,
} from "react";
import {
  Spinner as HeroSpinner,
  spinnerClassNames,
} from "heroui-native/spinner";
type HeroSpinnerProps = ComponentPropsWithoutRef<typeof HeroSpinner>;
export type SpinnerProps = HeroSpinnerProps & {};
const SpinnerComponent = forwardRef<
  ComponentRef<typeof HeroSpinner>,
  SpinnerProps
>((props, ref) => <HeroSpinner {...props} ref={ref} />);
SpinnerComponent.displayName = "Spinner";
export const Spinner = Object.assign(
  SpinnerComponent,
  HeroSpinner,
) as typeof HeroSpinner;
export { spinnerClassNames };
