import { observer } from "mobx-react-lite";
import { type ReactNode } from "react";
import { View, type ViewProps } from "react-native";
import { tv } from "tailwind-variants";
import { Chip, chipClassNames, type ChipProps } from "../../data-display/Chip";
import { Typography } from "../../data-display/Typography";
import { Icon, type IconTone, type MobileIconName } from "../../icon";
import { Button } from "../../input/Button";
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
const STATUS_CHIP_COLORS: Record<
	StatusFeedbackStatus,
	NonNullable<ChipProps["color"]>
> = {
	empty: "default",
	error: "danger",
	idle: "default",
	loading: "accent",
	submitting: "warning",
	success: "success",
};
const FeedbackDescription = ({ description }: { description?: ReactNode }) => {
	if (!description) {
		return null;
	}
	return (
		<Typography className={classNames.description()} type="body-sm">
			{description}
		</Typography>
	);
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
	const statusChipColor = STATUS_CHIP_COLORS[status];
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
				<Chip color={statusChipColor} key="badge" size="sm" variant="soft">
					<Icon
						name={STATUS_ICONS[status]}
						size="xs"
						tone={STATUS_ICON_TONES[status]}
					/>
					<Typography
						className={chipClassNames.label({
							color: statusChipColor,
							size: "sm",
							variant: "soft",
						})}
						type="body-sm"
					>
						{STATUS_LABELS[status]}
					</Typography>
				</Chip>
				<Typography className={slotClassNames.title()} key="title" type="body-sm">
					{title}
				</Typography>
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
				root: "border-border",
			},
			error: {
				root: "border-danger bg-surface",
			},
			idle: {
				root: "border-border",
			},
			loading: {
				root: "border-accent",
			},
			submitting: {
				root: "border-warning",
			},
			success: {
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
