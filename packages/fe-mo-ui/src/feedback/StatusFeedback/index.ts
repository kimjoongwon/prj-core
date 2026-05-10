import { createElement, type ReactNode } from "react";
import {
	Pressable,
	Text,
	View,
	type PressableProps,
	type ViewProps,
} from "react-native";
import { observer } from "mobx-react-lite";
import { tv } from "tailwind-variants";

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

	return createElement(Text, { className: classNames.description() }, description);
};

const renderAction = (
	label: string | undefined,
	onPress: (() => void) | undefined,
	variant: "primary" | "secondary",
) => {
	if (!label) {
		return null;
	}
	const actionClassNames = statusFeedbackClassNames({
		actionVariant: variant,
		disabled: !onPress,
	});

	return createElement(
		Pressable,
		{
			accessibilityLabel: label,
			accessibilityRole: "button",
			disabled: !onPress,
			key: variant,
			onPress: onPress as PressableProps["onPress"],
			className: actionClassNames.action(),
		},
		createElement(
			Text,
			{
				className: actionClassNames.actionText(),
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

	return createElement(View, { className: classNames.actions() }, actions);
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
	const slotClassNames = statusFeedbackClassNames({ status });

	return createElement(
		View,
		{
			...rest,
			accessibilityRole: status === "error" ? "alert" : "summary",
			accessibilityState: {
				busy: isBusy,
			},
			className: slotClassNames.root(),
			style,
		},
		createElement(View, { className: slotClassNames.header() }, [
			createElement(
				View,
				{
					className: slotClassNames.badge(),
					key: "badge",
				},
				createElement(
					Text,
					{ className: slotClassNames.badgeText() },
					STATUS_LABELS[status],
				),
			),
			createElement(Text, { className: slotClassNames.title(), key: "title" }, title),
		]),
		renderDescription(description),
		renderActions(actionProps),
	);
});

StatusFeedbackComponent.displayName = "StatusFeedback";

export const StatusFeedback = StatusFeedbackComponent;

const statusFeedbackClassNames = tv({
	slots: {
		action: "min-h-[42px] items-center rounded-full px-4 py-2.5",
		actionText: "text-sm leading-[18px]",
		actions: "flex-row flex-wrap gap-2.5",
		badge: "self-start rounded-full px-2.5 py-[5px]",
		badgeText: "text-xs font-bold leading-4 text-foreground",
		description: "text-sm leading-5 text-muted",
		header: "gap-2.5",
		root: "gap-3 rounded-xl border bg-surface p-4 shadow-surface",
		title: "text-[17px] font-extrabold leading-[23px] text-foreground",
	},
	variants: {
		actionVariant: {
			primary: {
				action: "bg-accent",
				actionText: "font-extrabold text-accent-foreground",
			},
			secondary: {
				action: "bg-surface-secondary",
				actionText: "font-bold text-surface-secondary-foreground",
			},
		},
		disabled: {
			false: {},
			true: {
				action: "opacity-[0.45]",
			},
		},
		status: {
			empty: {
				badge: "bg-default",
				root: "border-border",
			},
			error: {
				badge: "bg-danger",
				badgeText: "text-danger-foreground",
				root: "border-danger",
			},
			idle: {
				badge: "bg-surface-secondary",
				root: "border-border",
			},
			loading: {
				badge: "bg-accent",
				badgeText: "text-accent-foreground",
				root: "border-accent",
			},
			submitting: {
				badge: "bg-warning",
				badgeText: "text-warning-foreground",
				root: "border-warning",
			},
			success: {
				badge: "bg-success",
				badgeText: "text-success-foreground",
				root: "border-success",
			},
		},
	},
	defaultVariants: {
		actionVariant: "primary",
		disabled: false,
		status: "idle",
	},
});

const classNames = statusFeedbackClassNames();
