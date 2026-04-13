import {
	createElement,
	forwardRef,
	type ComponentPropsWithoutRef,
	type ElementRef,
} from "react";
import { Alert as HeroAlert, alertClassNames, useAlert } from "heroui-native/alert";

type HeroAlertProps = ComponentPropsWithoutRef<typeof HeroAlert>;

export type AlertProps = HeroAlertProps & {};

const AlertComponent = forwardRef<ElementRef<typeof HeroAlert>, AlertProps>(
	(props, ref) => createElement(HeroAlert, { ...props, ref }),
);

AlertComponent.displayName = "Alert";

export const Alert = Object.assign(AlertComponent, HeroAlert) as typeof HeroAlert;

export { alertClassNames, useAlert };
