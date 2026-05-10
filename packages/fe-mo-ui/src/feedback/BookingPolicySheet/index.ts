import { createElement, type ReactNode } from "react";
import {
	Pressable,
	Text,
	TextInput,
	View,
	type PressableProps,
	type ViewProps,
} from "react-native";
import { observer } from "mobx-react-lite";
import { tv } from "tailwind-variants";
import type { BookingClassFeedItem } from "../../data-display/BookingClassCard";

export interface BookingPolicySheetProps extends Omit<ViewProps, "children"> {
	cancelLabel?: ReactNode;
	cancellationPolicy?: ReactNode;
	confirmLabel?: ReactNode;
	isLoading?: boolean;
	item?: BookingClassFeedItem | null;
	memoLabel?: string;
	memoPlaceholder?: string;
	memoValue?: string;
	onCancel?: () => void;
	onChangeMemo?: (value: string) => void;
	onConfirm?: (item: BookingClassFeedItem, memo: string) => void;
	title?: ReactNode;
}

const renderOptionalText = (value: ReactNode, key: string, className: string) => {
	if (value === undefined || value === null || value === false) {
		return null;
	}

	return createElement(Text, { className, key }, value);
};

const renderClassTitle = (item: BookingClassFeedItem) =>
	createElement(
		Text,
		{ className: classNames.classTitle(), key: "class" },
		item.timeLabel,
		" · ",
		item.programName,
	);

const createConfirmHandler = (props: BookingPolicySheetProps) => {
	if (!props.item || props.isLoading || !props.onConfirm) {
		return undefined;
	}

	return () => {
		props.onConfirm?.(props.item as BookingClassFeedItem, props.memoValue ?? "");
	};
};

const renderAction = (
	label: ReactNode,
	onPress: (() => void) | undefined,
	variant: "cancel" | "confirm",
	disabled: boolean,
) => {
	const actionClassNames = bookingPolicySheetClassNames({
		actionVariant: variant,
		disabled,
	});

	return createElement(
		Pressable,
		{
			accessibilityLabel: typeof label === "string" ? label : variant,
			accessibilityRole: "button",
			accessibilityState: {
				disabled,
				busy: variant === "confirm" && disabled,
			},
			disabled,
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

const BookingPolicySheetComponent = observer((props: BookingPolicySheetProps) => {
	const {
		cancelLabel = "Cancel",
		cancellationPolicy,
		confirmLabel = "Confirm booking",
		isLoading = false,
		item,
		memoLabel = "Memo",
		memoPlaceholder = "Add a note for the coach",
		memoValue = "",
		onCancel,
		onChangeMemo,
		onConfirm,
		style,
		title = "Confirm reservation",
		...rest
	} = props;

	if (!item) {
		return null;
	}

	const confirmDisabled = isLoading || !onConfirm;

	return createElement(
		View,
		{
			...rest,
			accessibilityRole: "summary",
			accessibilityState: {
				busy: isLoading,
			},
			className: classNames.root(),
			style,
		},
		createElement(View, { className: classNames.handle() }),
		createElement(View, { className: classNames.header() }, [
			createElement(Text, { className: classNames.title(), key: "title" }, title),
			renderClassTitle(item),
			renderOptionalText(item.sessionName, "session", classNames.classMeta()),
		]),
		cancellationPolicy
			? createElement(View, { className: classNames.policy() }, [
					createElement(
						Text,
						{ className: classNames.policyLabel(), key: "policy-label" },
						"Cancellation policy",
					),
					createElement(
						Text,
						{ className: classNames.policyText(), key: "policy-value" },
						cancellationPolicy,
					),
				])
			: null,
		createElement(View, { className: classNames.memo() }, [
			createElement(
				Text,
				{ className: classNames.memoLabel(), key: "memo-label" },
				memoLabel,
			),
			createElement(TextInput, {
				key: "memo-input",
				accessibilityLabel: memoLabel,
				className: classNames.memoInput(),
				multiline: true,
				onChangeText: onChangeMemo,
				placeholder: memoPlaceholder,
				placeholderTextColorClassName: "text-muted",
				style: { textAlignVertical: "top" },
				value: memoValue,
			}),
		]),
		createElement(View, { className: classNames.actions() }, [
			renderAction(cancelLabel, onCancel, "cancel", isLoading || !onCancel),
			renderAction(
				isLoading ? "Booking..." : confirmLabel,
				createConfirmHandler({
					isLoading,
					item,
					memoValue,
					onConfirm,
				}),
				"confirm",
				confirmDisabled,
			),
		]),
	);
});

BookingPolicySheetComponent.displayName = "BookingPolicySheet";

export const BookingPolicySheet = BookingPolicySheetComponent;

const bookingPolicySheetClassNames = tv({
	slots: {
		action: "min-h-[46px] flex-1 items-center justify-center rounded-xl px-[14px] py-3",
		actionText: "text-sm leading-[18px]",
		actions: "flex-row gap-2.5",
		classMeta: "text-[13px] leading-[18px] text-muted",
		classTitle: "text-[15px] font-extrabold leading-5 text-surface-foreground",
		handle: "h-1 w-11 self-center rounded-full bg-surface-tertiary",
		header: "gap-1.5",
		memo: "gap-2",
		memoInput:
			"min-h-[90px] rounded-xl border border-border bg-surface-secondary p-3 text-sm leading-5 text-foreground",
		memoLabel: "text-[13px] font-extrabold leading-[18px] text-surface-foreground",
		policy: "gap-1.5 rounded-xl border border-border bg-surface-secondary p-3",
		policyLabel:
			"text-xs font-extrabold uppercase leading-4 text-accent",
		policyText: "text-[13px] leading-[18px] text-surface-foreground",
		root: "gap-4 rounded-[18px] border border-border bg-surface p-4 shadow-surface",
		title: "text-lg font-black leading-6 text-foreground",
	},
	variants: {
		actionVariant: {
			cancel: {
				action: "bg-surface-secondary",
				actionText: "font-extrabold text-surface-secondary-foreground",
			},
			confirm: {
				action: "bg-accent",
				actionText: "font-black text-accent-foreground",
			},
		},
		disabled: {
			false: {},
			true: {
				action: "opacity-[0.55]",
			},
		},
	},
	defaultVariants: {
		actionVariant: "confirm",
		disabled: false,
	},
});

const classNames = bookingPolicySheetClassNames();
