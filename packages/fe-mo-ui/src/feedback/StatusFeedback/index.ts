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
		badgeText: "text-xs font-bold leading-4 text-[#f5f8f1]",
		description: "text-sm leading-5 text-[#c5cec4]",
		header: "gap-2.5",
		root: "gap-3 rounded-xl border bg-[#151915] p-4",
		title: "text-[17px] font-extrabold leading-[23px] text-[#f5f8f1]",
	},
	variants: {
		actionVariant: {
			primary: {
				action: "bg-[#9ad66d]",
				actionText: "font-extrabold text-[#10200d]",
			},
			secondary: {
				action: "bg-[#263026]",
				actionText: "font-bold text-[#f5f8f1]",
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
				badge: "bg-gray-700",
				root: "border-gray-700",
			},
			error: {
				badge: "bg-[#8f2923]",
				root: "border-[#8f2923]",
			},
			idle: {
				badge: "bg-[#263026]",
				root: "border-[#2b342c]",
			},
			loading: {
				badge: "bg-[#2f5f98]",
				root: "border-[#2f5f98]",
			},
			submitting: {
				badge: "bg-[#6b5d1f]",
				root: "border-[#6b5d1f]",
			},
			success: {
				badge: "bg-[#386626]",
				root: "border-[#386626]",
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
