import {
	dialogClassNames,
	Dialog as HeroDialog,
	useDialog,
	useDialogAnimation,
} from "heroui-native";
import {
	type ComponentPropsWithoutRef,
	type ComponentRef,
	forwardRef,
	type ReactNode,
} from "react";
import { View } from "react-native";
import { Text } from "../../data-display/Text";

type HeroDialogProps = ComponentPropsWithoutRef<typeof HeroDialog>;
type HeroDialogContentProps = ComponentPropsWithoutRef<
	typeof HeroDialog.Content
>;
type HeroDialogDescriptionProps = ComponentPropsWithoutRef<
	typeof HeroDialog.Description
>;
type HeroDialogOverlayProps = ComponentPropsWithoutRef<
	typeof HeroDialog.Overlay
>;
type HeroDialogPortalProps = ComponentPropsWithoutRef<typeof HeroDialog.Portal>;
type HeroDialogTitleProps = ComponentPropsWithoutRef<typeof HeroDialog.Title>;
export interface DialogProps extends HeroDialogProps {
	actions?: ReactNode;
	contentProps?: HeroDialogContentProps;
	description?: ReactNode;
	overlayProps?: HeroDialogOverlayProps;
	portalProps?: HeroDialogPortalProps;
	showClose?: boolean;
	title?: ReactNode;
	trigger?: ReactNode;
}
export type DialogTitleProps = HeroDialogTitleProps & {};
export type DialogDescriptionProps = HeroDialogDescriptionProps & {};
const DialogComponent = forwardRef<
	ComponentRef<typeof HeroDialog>,
	DialogProps
>(
	(
		{
			actions,
			children,
			contentProps,
			description,
			overlayProps,
			portalProps,
			showClose = true,
			title,
			trigger,
			...props
		},
		ref,
	) => {
		const hasScaffold =
			trigger ||
			title ||
			description ||
			actions ||
			contentProps ||
			overlayProps ||
			portalProps;

		return (
			<HeroDialog {...props} ref={ref}>
				{hasScaffold ? (
					<>
						{trigger && <HeroDialog.Trigger>{trigger}</HeroDialog.Trigger>}
						<HeroDialog.Portal {...portalProps}>
							<HeroDialog.Overlay {...overlayProps} />
							<HeroDialog.Content {...contentProps}>
								{/* 저수준 layout 예외: heroui-native Dialog.Content slot에 끼워 넣는 헤더/액션 행이라 raw gap을 유지합니다. */}
								{(title || description || showClose) && (
									<View className="flex-row items-start justify-between gap-3">
										<View className="flex-1 gap-1">
											{title && <DialogTitle>{title}</DialogTitle>}
											{description && (
												<DialogDescription>{description}</DialogDescription>
											)}
										</View>
										{showClose && <HeroDialog.Close />}
									</View>
								)}
								{children}
								{actions && <View className="flex-row gap-2">{actions}</View>}
							</HeroDialog.Content>
						</HeroDialog.Portal>
					</>
				) : (
					children
				)}
			</HeroDialog>
		);
	},
);
DialogComponent.displayName = "Dialog";
const DialogTitle = forwardRef<ComponentRef<typeof Text>, DialogTitleProps>(
	({ children, className, ...props }, ref) => {
		const { nativeID } = useDialog();
		return (
			<Text
				{...props}
				ref={ref}
				accessibilityRole="text"
				className={className}
				nativeID={`${nativeID}_title`}
				variant="title"
			>
				{children}
			</Text>
		);
	},
);
DialogTitle.displayName = "Dialog.Title";
const DialogDescription = forwardRef<
	ComponentRef<typeof Text>,
	DialogDescriptionProps
>(({ children, className, ...props }, ref) => {
	const { nativeID } = useDialog();
	return (
		<Text
			{...props}
			ref={ref}
			accessibilityRole="text"
			className={className}
			nativeID={`${nativeID}_desc`}
			tone="muted"
			variant="body"
		>
			{children}
		</Text>
	);
});
DialogDescription.displayName = "Dialog.Description";
export const Dialog = Object.assign(DialogComponent, {
	Close: HeroDialog.Close,
	Content: HeroDialog.Content,
	Description: DialogDescription,
	Overlay: HeroDialog.Overlay,
	Portal: HeroDialog.Portal,
	Title: DialogTitle,
	Trigger: HeroDialog.Trigger,
}) as typeof DialogComponent &
	Pick<
		typeof HeroDialog,
		"Close" | "Content" | "Overlay" | "Portal" | "Trigger"
	> & {
		Description: typeof DialogDescription;
		Title: typeof DialogTitle;
	};
export { dialogClassNames, useDialog, useDialogAnimation };
