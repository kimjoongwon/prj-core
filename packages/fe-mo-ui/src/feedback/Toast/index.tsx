import {
  forwardRef,
  type ComponentPropsWithoutRef,
  type ComponentRef,
} from "react";
import {
  Toast as HeroToast,
  ToastProvider,
  toastClassNames,
  useToast,
} from "heroui-native/toast";
type HeroToastProps = ComponentPropsWithoutRef<typeof HeroToast>;
export type ToastProps = HeroToastProps & {};
const ToastComponent = forwardRef<ComponentRef<typeof HeroToast>, ToastProps>(
  (props, ref) => <HeroToast {...props} ref={ref} />,
);
ToastComponent.displayName = "Toast";
export const Toast = Object.assign(
  ToastComponent,
  HeroToast,
) as typeof HeroToast;
export { toastClassNames, useToast, ToastProvider };
