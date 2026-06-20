import { observer } from "mobx-react-lite";
import { type ReactNode } from "react";
import { View, type ViewProps } from "react-native";
import { tv } from "tailwind-variants";
import { Button } from "../../action/Button";
import { Text } from "../../data-display/Text";
import { Icon, type IconTone, type MobileIconName } from "../../icon";
import { Card } from "../../layout/Card";
export type StatusFeedbackStatus =
	| "idle"
	| "loading"
	| "empty"
	| "error"
	| "submitting"
	| "success";
export interface StatusFeedbackProps extends Omit<ViewProps, "children"> {
	description?: ReactNode;
	primaryActionLabel?: string;
	onPressPrimaryAction?: () => void;
	secondaryActionLabel?: string;
	onPressSecondaryAction?: () => void;
	status?: StatusFeedbackStatus;
	title: ReactNode;
}
const STATUS_LABELS: Record<StatusFeedbackStatus, string> = {
	empty: "Empty",
	error: "Needs attention",
	idle: "Status",
	loading: "Loading",
	submitting: "Submitting",
	success: "Success",
};
const STATUS_ICONS: Record<StatusFeedbackStatus, MobileIconName> = {
	empty: "circleDashed",
	error: "circleAlert",
	idle: "info",
	loading: "loaderCircle",
	submitting: "hourglass",
	success: "circleCheck",
};
const STATUS_ICON_TONES: Record<StatusFeedbackStatus, IconTone> = {
	empty: "muted",
	error: "danger",
	idle: "muted",
	loading: "accent",
	submitting: "warning",
	success: "success",
};
const FeedbackDescription = ({ description }: { description?: ReactNode }) => {
	if (!description) {
		return null;
	}
	return <Text className={classNames.description()}>{description}</Text>;
};
const FeedbackAction = ({
	label,
	onPress,
	variant,
}: {
	label?: string;
	onPress?: () => void;
	variant: "primary" | "secondary";
}) => {
	if (!label) {
		return null;
	}
	const actionClassNames = statusFeedbackClassNames({
		actionVariant: variant,
	});
	return (
		<Button
			accessibilityLabel={label}
			className={actionClassNames.action()}
			isDisabled={!onPress}
			onPress={onPress}
			size="sm"
			variant={variant === "primary" ? "primary" : "secondary"}
		>
			{label}
		</Button>
	);
};
const FeedbackActions = ({
	onPressPrimaryAction,
	onPressSecondaryAction,
	primaryActionLabel,
	secondaryActionLabel,
}: Pick<
	StatusFeedbackProps,
	| "onPressPrimaryAction"
	| "onPressSecondaryAction"
	| "primaryActionLabel"
	| "secondaryActionLabel"
>) => {
	if (!primaryActionLabel && !secondaryActionLabel) {
		return null;
	}
	return (
		<View className={classNames.actions()}>
			<FeedbackAction
				label={primaryActionLabel}
				onPress={onPressPrimaryAction}
				variant="primary"
			/>
			<FeedbackAction
				label={secondaryActionLabel}
				onPress={onPressSecondaryAction}
				variant="secondary"
			/>
		</View>
	);
};
const StatusFeedbackComponent = observer((props: StatusFeedbackProps) => {
	const {
		description,
		primaryActionLabel,
		onPressPrimaryAction,
		secondaryActionLabel,
		onPressSecondaryAction,
		status = "idle",
		style,
		title,
		...rest
	} = props;
	const isBusy = status === "loading" || status === "submitting";
	const slotClassNames = statusFeedbackClassNames({
		status,
	});
	return (
		<Card
			{...rest}
			accessibilityRole={status === "error" ? "alert" : "summary"}
			accessibilityState={{
				busy: isBusy,
			}}
			className={slotClassNames.root()}
			style={style}
		>
			<View className={slotClassNames.header()}>
				<View className={slotClassNames.badge()} key="badge">
					<Icon
						name={STATUS_ICONS[status]}
						size="xs"
						tone={STATUS_ICON_TONES[status]}
					/>
					<Text className={slotClassNames.badgeText()}>
						{STATUS_LABELS[status]}
					</Text>
				</View>
				<Text className={slotClassNames.title()} key="title">
					{title}
				</Text>
			</View>
			<FeedbackDescription description={description} />
			<FeedbackActions
				onPressPrimaryAction={onPressPrimaryAction}
				onPressSecondaryAction={onPressSecondaryAction}
				primaryActionLabel={primaryActionLabel}
				secondaryActionLabel={secondaryActionLabel}
			/>
		</Card>
	);
});
StatusFeedbackComponent.displayName = "StatusFeedback";
export const StatusFeedback = StatusFeedbackComponent;
const statusFeedbackClassNames = tv({
	slots: {
		action: "rounded-lg",
		actions: "flex-row flex-wrap gap-2",
		badge:
			"self-start flex-row items-center gap-1.5 rounded-full border border-border px-2 py-0.5",
		badgeText: "text-xs font-semibold leading-4 text-foreground",
		description: "text-[13px] leading-5 text-muted",
		header: "gap-2",
		root: "gap-3 rounded-lg border border-border bg-surface px-4 py-3",
		title: "text-[15px] font-bold leading-6 text-foreground",
	},
	variants: {
		actionVariant: {
			primary: {},
			secondary: {},
		},
		status: {
			empty: {
				badge: "bg-default",
				root: "border-border",
			},
			error: {
				badge: "border-danger bg-danger-soft",
				badgeText: "text-danger-soft-foreground",
				root: "border-danger bg-surface",
			},
			idle: {
				badge: "bg-surface-secondary",
				root: "border-border",
			},
			loading: {
				badge: "border-accent bg-accent-soft",
				badgeText: "text-accent-soft-foreground",
				root: "border-accent",
			},
			submitting: {
				badge: "border-warning bg-warning-soft",
				badgeText: "text-warning-soft-foreground",
				root: "border-warning",
			},
			success: {
				badge: "border-success bg-success-soft",
				badgeText: "text-success-soft-foreground",
				root: "border-success",
			},
		},
	},
	defaultVariants: {
		actionVariant: "primary",
		status: "idle",
	},
});
const classNames = statusFeedbackClassNames();
