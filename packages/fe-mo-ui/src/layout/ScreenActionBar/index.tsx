import { forwardRef, type ReactNode } from "react";
import { View, type ViewProps } from "react-native";
import { tv } from "tailwind-variants";
import { Button } from "../../input/Button";
import { Text } from "../../data-display/Text";

export type ScreenActionBarOrientation = "horizontal" | "vertical";

export interface ScreenActionBarProps extends Omit<ViewProps, "children"> {
	children?: ReactNode;
	description?: ReactNode;
	isPrimaryActionDisabled?: boolean;
	isPrimaryActionLoading?: boolean;
	isSecondaryActionDisabled?: boolean;
	onPressPrimaryAction?: () => void;
	onPressSecondaryAction?: () => void;
	orientation?: ScreenActionBarOrientation;
	primaryActionLabel?: string;
	primaryActionLoadingLabel?: string;
	secondaryActionLabel?: string;
}

const ScreenActionBarComponent = forwardRef<View, ScreenActionBarProps>(
	(
		{
			children,
			className,
			description,
			isPrimaryActionDisabled = false,
			isPrimaryActionLoading = false,
			isSecondaryActionDisabled = false,
			onPressPrimaryAction,
			onPressSecondaryAction,
			orientation = "vertical",
			primaryActionLabel,
			primaryActionLoadingLabel,
			secondaryActionLabel,
			...rest
		},
		ref,
	) => {
		const slotClassNames = screenActionBarClassNames({
			orientation,
		});
		const primaryLabel =
			isPrimaryActionLoading && primaryActionLoadingLabel
				? primaryActionLoadingLabel
				: primaryActionLabel;
		const primaryAction = primaryLabel ? (
			<Button
				accessibilityLabel={primaryLabel}
				className={slotClassNames.action()}
				isDisabled={
					isPrimaryActionDisabled ||
					isPrimaryActionLoading ||
					!onPressPrimaryAction
				}
				key="primary-action"
				onPress={onPressPrimaryAction}
				variant="primary"
			>
				{primaryLabel}
			</Button>
		) : null;
		const secondaryAction = secondaryActionLabel ? (
			<Button
				accessibilityLabel={secondaryActionLabel}
				className={slotClassNames.action()}
				isDisabled={isSecondaryActionDisabled || !onPressSecondaryAction}
				key="secondary-action"
				onPress={onPressSecondaryAction}
				variant="secondary"
			>
				{secondaryActionLabel}
			</Button>
		) : null;
		const actions =
			orientation === "horizontal"
				? [secondaryAction, primaryAction]
				: [primaryAction, secondaryAction];
		const hasCustomActions = children !== undefined && children !== null;
		const hasGeneratedActions = actions.some(Boolean);

		return (
			<View
				{...rest}
				className={slotClassNames.root({
					className,
				})}
				ref={ref}
			>
				{description ? (
					<Text className={classNames.description()}>{description}</Text>
				) : null}
				{hasCustomActions || hasGeneratedActions ? (
					<View className={slotClassNames.actions()}>
						{hasCustomActions ? children : actions}
					</View>
				) : null}
			</View>
		);
	},
);
ScreenActionBarComponent.displayName = "ScreenActionBar";

export const ScreenActionBar = ScreenActionBarComponent;

const screenActionBarClassNames = tv({
	slots: {
		action: "min-h-11 rounded-lg",
		actions: "gap-2",
		description: "text-center text-xs leading-4 text-muted",
		root: "gap-2 border-t border-border bg-surface px-4 pb-3 pt-3",
	},
	variants: {
		orientation: {
			horizontal: {
				action: "flex-1",
				actions: "flex-row",
			},
			vertical: {
				action: "w-full",
				actions: "flex-col",
			},
		},
	},
	defaultVariants: {
		orientation: "vertical",
	},
});

const classNames = screenActionBarClassNames();
