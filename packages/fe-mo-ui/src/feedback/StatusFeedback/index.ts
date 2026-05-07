import { createElement, type ReactNode } from "react";
import {
	Pressable,
	StyleSheet,
	Text,
	View,
	type PressableProps,
	type ViewProps,
} from "react-native";
import { observer } from "mobx-react-lite";

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

const renderDescription = (description: ReactNode) => {
	if (!description) {
		return null;
	}

	return createElement(Text, { style: styles.description }, description);
};

const renderAction = (
	label: string | undefined,
	onPress: (() => void) | undefined,
	variant: "primary" | "secondary",
) => {
	if (!label) {
		return null;
	}

	return createElement(
		Pressable,
		{
			accessibilityLabel: label,
			accessibilityRole: "button",
			disabled: !onPress,
			key: variant,
			onPress: onPress as PressableProps["onPress"],
			style: [
				styles.action,
				variant === "primary" ? styles.primaryAction : styles.secondaryAction,
				!onPress ? styles.actionDisabled : null,
			],
		},
		createElement(
			Text,
			{
				style:
					variant === "primary"
						? styles.primaryActionText
						: styles.secondaryActionText,
			},
			label,
		),
	);
};

const renderActions = (props: StatusFeedbackProps) => {
	const primaryAction = renderAction(
		props.primaryActionLabel,
		props.onPressPrimaryAction,
		"primary",
	);
	const secondaryAction = renderAction(
		props.secondaryActionLabel,
		props.onPressSecondaryAction,
		"secondary",
	);
	const actions = [primaryAction, secondaryAction].filter(Boolean);

	if (!actions.length) {
		return null;
	}

	return createElement(View, { style: styles.actions }, actions);
};

const getRootStatusStyle = (status: StatusFeedbackStatus) => {
	switch (status) {
		case "empty":
			return styles.emptyRoot;
		case "error":
			return styles.errorRoot;
		case "loading":
			return styles.loadingRoot;
		case "submitting":
			return styles.submittingRoot;
		case "success":
			return styles.successRoot;
		default:
			return styles.idleRoot;
	}
};

const getBadgeStatusStyle = (status: StatusFeedbackStatus) => {
	switch (status) {
		case "empty":
			return styles.emptyBadge;
		case "error":
			return styles.errorBadge;
		case "loading":
			return styles.loadingBadge;
		case "submitting":
			return styles.submittingBadge;
		case "success":
			return styles.successBadge;
		default:
			return styles.idleBadge;
	}
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
	const actionProps: StatusFeedbackProps = {
		description,
		primaryActionLabel,
		onPressPrimaryAction,
		secondaryActionLabel,
		onPressSecondaryAction,
		status,
		title,
	};

	return createElement(
		View,
		{
			...rest,
			accessibilityRole: status === "error" ? "alert" : "summary",
			accessibilityState: {
				busy: isBusy,
			},
			style: [styles.root, getRootStatusStyle(status), style],
		},
		createElement(View, { style: styles.header }, [
			createElement(
				View,
				{
					key: "badge",
					style: [styles.badge, getBadgeStatusStyle(status)],
				},
				createElement(Text, { style: styles.badgeText }, STATUS_LABELS[status]),
			),
			createElement(Text, { key: "title", style: styles.title }, title),
		]),
		renderDescription(description),
		renderActions(actionProps),
	);
});

StatusFeedbackComponent.displayName = "StatusFeedback";

export const StatusFeedback = StatusFeedbackComponent;

const styles = StyleSheet.create({
	action: {
		alignItems: "center",
		borderRadius: 999,
		minHeight: 42,
		paddingHorizontal: 16,
		paddingVertical: 10,
	},
	actionDisabled: {
		opacity: 0.45,
	},
	actions: {
		flexDirection: "row",
		flexWrap: "wrap",
		gap: 10,
	},
	badge: {
		alignSelf: "flex-start",
		borderRadius: 999,
		paddingHorizontal: 10,
		paddingVertical: 5,
	},
	badgeText: {
		color: "#f5f8f1",
		fontSize: 12,
		fontWeight: "700",
		lineHeight: 16,
	},
	description: {
		color: "#c5cec4",
		fontSize: 14,
		lineHeight: 20,
	},
	emptyBadge: {
		backgroundColor: "#374151",
	},
	emptyRoot: {
		borderColor: "#374151",
	},
	errorBadge: {
		backgroundColor: "#8f2923",
	},
	errorRoot: {
		borderColor: "#8f2923",
	},
	header: {
		gap: 10,
	},
	idleBadge: {
		backgroundColor: "#263026",
	},
	idleRoot: {
		borderColor: "#2b342c",
	},
	loadingBadge: {
		backgroundColor: "#2f5f98",
	},
	loadingRoot: {
		borderColor: "#2f5f98",
	},
	primaryAction: {
		backgroundColor: "#9ad66d",
	},
	primaryActionText: {
		color: "#10200d",
		fontSize: 14,
		fontWeight: "800",
		lineHeight: 18,
	},
	root: {
		backgroundColor: "#151915",
		borderRadius: 12,
		borderWidth: 1,
		gap: 12,
		padding: 16,
	},
	secondaryAction: {
		backgroundColor: "#263026",
	},
	secondaryActionText: {
		color: "#f5f8f1",
		fontSize: 14,
		fontWeight: "700",
		lineHeight: 18,
	},
	submittingBadge: {
		backgroundColor: "#6b5d1f",
	},
	submittingRoot: {
		borderColor: "#6b5d1f",
	},
	successBadge: {
		backgroundColor: "#386626",
	},
	successRoot: {
		borderColor: "#386626",
	},
	title: {
		color: "#f5f8f1",
		fontSize: 17,
		fontWeight: "800",
		lineHeight: 23,
	},
});
