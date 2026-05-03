import {
	createElement,
	forwardRef,
	type ComponentPropsWithoutRef,
	type ElementRef,
} from "react";
import {
	Toast as HeroToast,
	ToastProvider,
	toastClassNames,
	useToast,
} from "heroui-native/toast";

type HeroToastProps = ComponentPropsWithoutRef<typeof HeroToast>;

export type ToastProps = HeroToastProps & {};

const ToastComponent = forwardRef<ElementRef<typeof HeroToast>, ToastProps>(
	(props, ref) => createElement(HeroToast, { ...props, ref }),
);

ToastComponent.displayName = "Toast";

export const Toast = Object.assign(ToastComponent, HeroToast) as typeof HeroToast;

export { toastClassNames, useToast, ToastProvider };
