import {
  forwardRef,
  type ComponentPropsWithoutRef,
  type ComponentRef,
  type ReactNode,
} from "react";
import {
  Alert as HeroAlert,
  alertClassNames,
  useAlert,
} from "heroui-native/alert";
import { Text, type TextProps } from "../../data-display/Text";
type HeroAlertProps = ComponentPropsWithoutRef<typeof HeroAlert>;
type HeroAlertDescriptionProps = ComponentPropsWithoutRef<
  typeof HeroAlert.Description
>;
type HeroAlertTitleProps = ComponentPropsWithoutRef<typeof HeroAlert.Title>;
export interface AlertProps extends HeroAlertProps {
  description?: ReactNode;
  hideIndicator?: boolean;
  title?: ReactNode;
}
export type AlertTitleProps = HeroAlertTitleProps & {};
export type AlertDescriptionProps = HeroAlertDescriptionProps & {};
const AlertComponent = forwardRef<ComponentRef<typeof HeroAlert>, AlertProps>(
  ({ children, description, hideIndicator = false, title, ...props }, ref) => {
    const hasScaffold = title || description;

    return (
      <HeroAlert {...props} ref={ref}>
        {hasScaffold ? (
          <>
            {!hideIndicator && <HeroAlert.Indicator />}
            <HeroAlert.Content>
              {title && <AlertTitle>{title}</AlertTitle>}
              {description && (
                <AlertDescription>{description}</AlertDescription>
              )}
              {children}
            </HeroAlert.Content>
          </>
        ) : (
          children
        )}
      </HeroAlert>
    );
  },
);
AlertComponent.displayName = "Alert";
const toneByStatus: Record<string, TextProps["tone"]> = {
  accent: "accent",
  danger: "danger",
  success: "success",
  warning: "warning",
};
const AlertTitle = forwardRef<ComponentRef<typeof Text>, AlertTitleProps>(
  ({ children, className, ...props }, ref) => {
    const { status } = useAlert();
    return (
      <Text
        {...props}
        ref={ref}
        className={className}
        tone={toneByStatus[status] ?? "foreground"}
        variant="label"
      >
        {children}
      </Text>
    );
  },
);
AlertTitle.displayName = "Alert.Title";
const AlertDescription = forwardRef<
  ComponentRef<typeof Text>,
  AlertDescriptionProps
>(({ children, className, ...props }, ref) => (
  <Text {...props} ref={ref} className={className} tone="muted" variant="body">
    {children}
  </Text>
));
AlertDescription.displayName = "Alert.Description";
export const Alert = Object.assign(AlertComponent, {
  Content: HeroAlert.Content,
  Description: AlertDescription,
  Indicator: HeroAlert.Indicator,
  Title: AlertTitle,
}) as typeof AlertComponent &
  Pick<typeof HeroAlert, "Content" | "Indicator"> & {
    Description: typeof AlertDescription;
    Title: typeof AlertTitle;
  };
export { alertClassNames, useAlert };
