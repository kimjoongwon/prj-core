import {
	Popover as HeroPopover,
	popoverClassNames,
	usePopover,
	usePopoverAnimation,
} from "heroui-native";
import {
	type ComponentPropsWithoutRef,
	type ComponentRef,
	forwardRef,
	type ReactNode,
} from "react";
import { View } from "react-native";
import { Text } from "../../data-display/Text";

type HeroPopoverProps = ComponentPropsWithoutRef<typeof HeroPopover>;
type HeroPopoverContentProps = ComponentPropsWithoutRef<
	typeof HeroPopover.Content
>;
type HeroPopoverDescriptionProps = ComponentPropsWithoutRef<
	typeof HeroPopover.Description
>;
type HeroPopoverOverlayProps = ComponentPropsWithoutRef<
	typeof HeroPopover.Overlay
>;
type HeroPopoverPortalProps = ComponentPropsWithoutRef<
	typeof HeroPopover.Portal
>;
type HeroPopoverTitleProps = ComponentPropsWithoutRef<typeof HeroPopover.Title>;
export interface PopoverProps extends HeroPopoverProps {
	contentProps?: HeroPopoverContentProps;
	description?: ReactNode;
	overlayProps?: HeroPopoverOverlayProps;
	portalProps?: HeroPopoverPortalProps;
	showArrow?: boolean;
	showClose?: boolean;
	title?: ReactNode;
	trigger?: ReactNode;
}
export type PopoverTitleProps = HeroPopoverTitleProps & {};
export type PopoverDescriptionProps = HeroPopoverDescriptionProps & {};
const PopoverComponent = forwardRef<
	ComponentRef<typeof HeroPopover>,
	PopoverProps
>(
	(
		{
			children,
			contentProps,
			description,
			overlayProps,
			portalProps,
			presentation = "popover",
			showArrow = true,
			showClose = false,
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
			contentProps ||
			overlayProps ||
			portalProps ||
			showClose;

		return (
			<HeroPopover {...props} presentation={presentation} ref={ref}>
				{hasScaffold ? (
					<>
						{trigger && <HeroPopover.Trigger>{trigger}</HeroPopover.Trigger>}
						<HeroPopover.Portal {...portalProps}>
							<HeroPopover.Overlay
								className="bg-transparent"
								{...overlayProps}
							/>
							<HeroPopover.Content
								presentation={contentProps?.presentation ?? presentation}
								{...contentProps}
							>
								{showArrow && <HeroPopover.Arrow />}
								{(title || description || showClose) && (
									// 저수준 layout 예외: heroui-native Popover.Content slot에 끼워 넣는 헤더라 raw gap을 유지합니다.
									<View className="flex-row items-start justify-between gap-3">
										<View className="flex-1 gap-1">
											{title && <PopoverTitle>{title}</PopoverTitle>}
											{description && (
												<PopoverDescription>{description}</PopoverDescription>
											)}
										</View>
										{showClose && <HeroPopover.Close />}
									</View>
								)}
								{children}
							</HeroPopover.Content>
						</HeroPopover.Portal>
					</>
				) : (
					children
				)}
			</HeroPopover>
		);
	},
);
PopoverComponent.displayName = "Popover";
const PopoverTitle = forwardRef<ComponentRef<typeof Text>, PopoverTitleProps>(
	({ children, className, ...props }, ref) => (
		<Text {...props} ref={ref} className={className} variant="label">
			{children}
		</Text>
	),
);
PopoverTitle.displayName = "Popover.Title";
const PopoverDescription = forwardRef<
	ComponentRef<typeof Text>,
	PopoverDescriptionProps
>(({ children, className, ...props }, ref) => (
	<Text {...props} ref={ref} className={className} tone="muted" variant="body">
		{children}
	</Text>
));
PopoverDescription.displayName = "Popover.Description";
export const Popover = Object.assign(PopoverComponent, {
	Arrow: HeroPopover.Arrow,
	Close: HeroPopover.Close,
	Content: HeroPopover.Content,
	Description: PopoverDescription,
	Overlay: HeroPopover.Overlay,
	Portal: HeroPopover.Portal,
	Title: PopoverTitle,
	Trigger: HeroPopover.Trigger,
}) as typeof PopoverComponent &
	Pick<
		typeof HeroPopover,
		"Arrow" | "Close" | "Content" | "Overlay" | "Portal" | "Trigger"
	> & {
		Description: typeof PopoverDescription;
		Title: typeof PopoverTitle;
	};
export { popoverClassNames, usePopover, usePopoverAnimation };
