import {
  forwardRef,
  type ComponentPropsWithoutRef,
  type ComponentRef,
  type ReactNode,
} from "react";
import {
  Toast as HeroToast,
  ToastProvider,
  toastClassNames,
  useToast,
} from "heroui-native";
import { Text } from "../../data-display/Text";
type HeroToastProps = ComponentPropsWithoutRef<typeof HeroToast>;
type HeroToastDescriptionProps = ComponentPropsWithoutRef<
  typeof HeroToast.Description
>;
type HeroToastTitleProps = ComponentPropsWithoutRef<typeof HeroToast.Title>;
export interface ToastProps extends HeroToastProps {
  action?: ReactNode;
  description?: ReactNode;
  icon?: ReactNode;
  title?: ReactNode;
}
export type ToastTitleProps = HeroToastTitleProps & {};
export type ToastDescriptionProps = HeroToastDescriptionProps & {};
const ToastComponent = forwardRef<ComponentRef<typeof HeroToast>, ToastProps>(
  ({ action, children, description, icon, title, ...props }, ref) => {
    const hasScaffold = title || description || action || icon;

    return (
      <HeroToast {...props} ref={ref}>
        {hasScaffold ? (
          <>
            {icon}
            {title && <ToastTitle>{title}</ToastTitle>}
            {description && <ToastDescription>{description}</ToastDescription>}
            {children}
            {action}
          </>
        ) : (
          children
        )}
      </HeroToast>
    );
  },
);
ToastComponent.displayName = "Toast";
const ToastTitle = forwardRef<ComponentRef<typeof Text>, ToastTitleProps>(
  ({ children, className, ...props }, ref) => (
    <Text {...props} ref={ref} className={className} variant="label">
      {children}
    </Text>
  ),
);
ToastTitle.displayName = "Toast.Title";
const ToastDescription = forwardRef<
  ComponentRef<typeof Text>,
  ToastDescriptionProps
>(({ children, className, ...props }, ref) => (
  <Text {...props} ref={ref} className={className} tone="muted" variant="body">
    {children}
  </Text>
));
ToastDescription.displayName = "Toast.Description";
export const Toast = Object.assign(ToastComponent, {
  Action: HeroToast.Action,
  Close: HeroToast.Close,
  Description: ToastDescription,
  Title: ToastTitle,
}) as typeof ToastComponent &
  Pick<typeof HeroToast, "Action" | "Close"> & {
    Description: typeof ToastDescription;
    Title: typeof ToastTitle;
  };
export { toastClassNames, useToast, ToastProvider };
