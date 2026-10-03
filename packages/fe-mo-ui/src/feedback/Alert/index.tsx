import { alertClassNames, Alert as HeroAlert, useAlert } from "heroui-native";
import {
	type ComponentPropsWithoutRef,
	type ComponentRef,
	forwardRef,
	type ReactNode,
} from "react";
import { Typography } from "../../data-display/Typography";
import { joinClassNames } from "../../rhythm/class-name";

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
const statusTextClassNames: Record<string, string> = {
	accent: "text-accent",
	danger: "text-danger",
	success: "text-success",
	warning: "text-warning",
};
const AlertTitle = forwardRef<ComponentRef<typeof Typography>, AlertTitleProps>(
	({ children, className, ...props }, ref) => {
		const { status } = useAlert();
		return (
			<Typography
				{...props}
				ref={ref}
				className={joinClassNames(className, statusTextClassNames[status])}
				type="body-sm"
				weight="semibold"
			>
				{children}
			</Typography>
		);
	},
);
AlertTitle.displayName = "Alert.Title";
const AlertDescription = forwardRef<
	ComponentRef<typeof Typography>,
	AlertDescriptionProps
>(({ children, className, ...props }, ref) => (
	<Typography {...props} ref={ref} className={className} color="muted" type="body-sm">
		{children}
	</Typography>
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
