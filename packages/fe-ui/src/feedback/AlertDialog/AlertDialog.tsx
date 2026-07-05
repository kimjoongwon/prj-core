"use client";

import { AlertDialog as HeroAlertDialog } from "@heroui/react";
import type { ComponentProps } from "react";
import { translateNode, useT } from "../../i18n";

export type AlertDialogProps = ComponentProps<typeof HeroAlertDialog>;
export type AlertDialogRootProps = ComponentProps<typeof HeroAlertDialog.Root>;
export type AlertDialogTriggerProps = ComponentProps<
	typeof HeroAlertDialog.Trigger
>;
export type AlertDialogBackdropProps = ComponentProps<
	typeof HeroAlertDialog.Backdrop
>;
export type AlertDialogContainerProps = ComponentProps<
	typeof HeroAlertDialog.Container
>;
export type AlertDialogDialogProps = ComponentProps<
	typeof HeroAlertDialog.Dialog
>;
export type AlertDialogHeaderProps = ComponentProps<
	typeof HeroAlertDialog.Header
>;
export type AlertDialogHeadingProps = ComponentProps<
	typeof HeroAlertDialog.Heading
>;
export type AlertDialogBodyProps = ComponentProps<typeof HeroAlertDialog.Body>;
export type AlertDialogFooterProps = ComponentProps<
	typeof HeroAlertDialog.Footer
>;
export type AlertDialogIconProps = ComponentProps<typeof HeroAlertDialog.Icon>;
export type AlertDialogCloseTriggerProps = ComponentProps<
	typeof HeroAlertDialog.CloseTrigger
>;
export type AlertDialogStatus = NonNullable<AlertDialogIconProps["status"]>;

const AlertDialogRoot = ({ children, ...props }: AlertDialogProps) => (
	<HeroAlertDialog {...props}>{children}</HeroAlertDialog>
);

const AlertDialogTrigger = ({
	children,
	...props
}: AlertDialogTriggerProps) => (
	<HeroAlertDialog.Trigger {...props}>{children}</HeroAlertDialog.Trigger>
);

const AlertDialogBackdrop = ({
	children,
	...props
}: AlertDialogBackdropProps) => (
	<HeroAlertDialog.Backdrop {...props}>{children}</HeroAlertDialog.Backdrop>
);

const AlertDialogContainer = ({
	children,
	...props
}: AlertDialogContainerProps) => (
	<HeroAlertDialog.Container {...props}>{children}</HeroAlertDialog.Container>
);

const AlertDialogDialog = ({ children, ...props }: AlertDialogDialogProps) => (
	<HeroAlertDialog.Dialog {...props}>{children}</HeroAlertDialog.Dialog>
);

const AlertDialogHeader = ({ children, ...props }: AlertDialogHeaderProps) => (
	<HeroAlertDialog.Header {...props}>{children}</HeroAlertDialog.Header>
);

const AlertDialogHeading = ({
	children,
	...props
}: AlertDialogHeadingProps) => {
	const t = useT();

	return (
		<HeroAlertDialog.Heading {...props}>
			{translateNode(children, t)}
		</HeroAlertDialog.Heading>
	);
};

const AlertDialogBody = ({ children, ...props }: AlertDialogBodyProps) => {
	const t = useT();

	return (
		<HeroAlertDialog.Body {...props}>
			{translateNode(children, t)}
		</HeroAlertDialog.Body>
	);
};

const AlertDialogFooter = ({ children, ...props }: AlertDialogFooterProps) => (
	<HeroAlertDialog.Footer {...props}>{children}</HeroAlertDialog.Footer>
);

const AlertDialogIcon = ({ children, ...props }: AlertDialogIconProps) => (
	<HeroAlertDialog.Icon {...props}>{children}</HeroAlertDialog.Icon>
);

const AlertDialogCloseTrigger = ({
	children,
	...props
}: AlertDialogCloseTriggerProps) => (
	<HeroAlertDialog.CloseTrigger {...props}>
		{children}
	</HeroAlertDialog.CloseTrigger>
);

/**
 * HeroUI AlertDialog 래퍼입니다.
 *
 * compound slot API는 HeroUI와 동일하게 유지하고, 제목/본문 문구 번역만 보강합니다.
 */
export const AlertDialog = Object.assign(AlertDialogRoot, {
	Root: AlertDialogRoot,
	Trigger: AlertDialogTrigger,
	Backdrop: AlertDialogBackdrop,
	Container: AlertDialogContainer,
	Dialog: AlertDialogDialog,
	Header: AlertDialogHeader,
	Heading: AlertDialogHeading,
	Body: AlertDialogBody,
	Footer: AlertDialogFooter,
	Icon: AlertDialogIcon,
	CloseTrigger: AlertDialogCloseTrigger,
});
