import {
  forwardRef,
  type ComponentPropsWithoutRef,
  type ComponentRef,
} from "react";
import {
  Alert as HeroAlert,
  alertClassNames,
  useAlert,
} from "heroui-native/alert";
type HeroAlertProps = ComponentPropsWithoutRef<typeof HeroAlert>;
export type AlertProps = HeroAlertProps & {};
const AlertComponent = forwardRef<ComponentRef<typeof HeroAlert>, AlertProps>(
  (props, ref) => <HeroAlert {...props} ref={ref} />,
);
AlertComponent.displayName = "Alert";
export const Alert = Object.assign(
  AlertComponent,
  HeroAlert,
) as typeof HeroAlert;
export { alertClassNames, useAlert };
