import {
	Toast as HeroToast,
	ToastProvider,
	toastClassNames,
	useToast,
} from "heroui-native";
import {
	type ComponentPropsWithoutRef,
	type ComponentRef,
	forwardRef,
	type ReactNode,
} from "react";
import { Typography } from "../../data-display/Typography";

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
const ToastTitle = forwardRef<ComponentRef<typeof Typography>, ToastTitleProps>(
	({ children, className, ...props }, ref) => (
		<Typography
			{...props}
			ref={ref}
			className={className}
			type="body-sm"
			weight="semibold"
		>
			{children}
		</Typography>
	),
);
ToastTitle.displayName = "Toast.Title";
const ToastDescription = forwardRef<
	ComponentRef<typeof Typography>,
	ToastDescriptionProps
>(({ children, className, ...props }, ref) => (
	<Typography {...props} ref={ref} className={className} color="muted" type="body-sm">
		{children}
	</Typography>
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
