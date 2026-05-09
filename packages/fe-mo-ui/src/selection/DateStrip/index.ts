import { createElement, type ReactNode } from "react";
import {
	Pressable,
	ScrollView,
	Text,
	View,
	type PressableProps,
	type StyleProp,
	type ViewProps,
	type ViewStyle,
} from "react-native";
import { observer } from "mobx-react-lite";
import { tv } from "tailwind-variants";

export interface DateStripOption {
	badge?: ReactNode;
	count?: number;
	dateLabel: ReactNode;
	dayLabel: ReactNode;
	isDisabled?: boolean;
	value: string;
}

export interface DateStripProps extends Omit<ViewProps, "children"> {
	contentContainerClassName?: string;
	contentContainerStyle?: StyleProp<ViewStyle>;
	disabled?: boolean;
	emptyLabel?: ReactNode;
	onSelect?: (value: string, option: DateStripOption) => void;
	options?: readonly DateStripOption[];
	selectedValue?: string | null;
}

const toText = (value: ReactNode) => {
	if (typeof value === "string" || typeof value === "number") {
		return String(value);
	}

	return undefined;
};

const getAccessibilityLabel = (option: DateStripOption) =>
	[toText(option.dayLabel), toText(option.dateLabel)]
		.filter(Boolean)
		.join(" ");

const createSelectHandler = (
	option: DateStripOption,
	disabled: boolean,
	onSelect: DateStripProps["onSelect"],
) => {
	if (disabled || option.isDisabled) {
		return undefined;
	}

	return () => {
		onSelect?.(option.value, option);
	};
};

const renderBadge = (option: DateStripOption, isSelected: boolean) => {
	const badge = option.badge ?? option.count;

	if (badge === undefined || badge === null || badge === false) {
		return null;
	}

	return createElement(
		View,
		{
			className: dateStripClassNames({ selected: isSelected }).badge(),
		},
		createElement(Text, { className: classNames.badgeText() }, badge),
	);
};

const renderOption = (
	option: DateStripOption,
	index: number,
	props: Pick<DateStripProps, "disabled" | "onSelect" | "selectedValue">,
) => {
	const isSelected = props.selectedValue === option.value;
	const isDisabled = Boolean(props.disabled || option.isDisabled);

	return createElement(
		Pressable,
		{
			accessibilityLabel: getAccessibilityLabel(option),
			accessibilityRole: "button",
			accessibilityState: {
				disabled: isDisabled,
				selected: isSelected,
			},
			disabled: isDisabled,
			key: option.value || `date-strip-option-${index}`,
			onPress: createSelectHandler(
				option,
				Boolean(props.disabled),
				props.onSelect,
			) as PressableProps["onPress"],
			className: dateStripClassNames({
				disabled: isDisabled,
				selected: isSelected,
			}).option(),
		},
		createElement(Text, { className: classNames.dayLabel() }, option.dayLabel),
		createElement(Text, { className: classNames.dateLabel() }, option.dateLabel),
		renderBadge(option, isSelected),
	);
};

const renderOptions = (props: DateStripProps) =>
	(props.options ?? []).map((option, index) => renderOption(option, index, props));

const DateStripComponent = observer((props: DateStripProps) => {
	const {
		className,
		contentContainerClassName,
		contentContainerStyle,
		disabled = false,
		emptyLabel,
		options = [],
		onSelect,
		selectedValue,
		style,
		...rest
	} = props;

	if (!options.length) {
		return createElement(
			View,
			{
				...rest,
				accessibilityRole: "summary",
				className: classNames.empty(),
				style,
			},
			createElement(
				Text,
				{ className: classNames.emptyText() },
				emptyLabel ?? "No dates",
			),
		);
	}

	return createElement(
		View,
			{
				...rest,
				className,
				style,
			},
			createElement(
				ScrollView,
				{
					horizontal: true,
					showsHorizontalScrollIndicator: false,
					contentContainerClassName: classNames.content({
						className: contentContainerClassName,
					}),
					contentContainerStyle,
				},
				renderOptions({
				disabled,
				onSelect,
				options,
				selectedValue,
			}),
		),
	);
});

DateStripComponent.displayName = "DateStrip";

export const DateStrip = DateStripComponent;

const dateStripClassNames = tv({
	slots: {
		badge:
			"min-w-6 items-center rounded-full bg-[#263026] px-[7px] py-[3px]",
		badgeText: "text-[11px] font-extrabold leading-[14px] text-[#f5f8f1]",
		content: "gap-2 px-0.5 py-0.5",
		dateLabel: "text-lg font-extrabold leading-[22px] text-[#f5f8f1]",
		dayLabel: "text-xs font-bold uppercase leading-4 text-[#aeb7ac]",
		empty: "rounded-xl border border-[#263026] bg-[#111511] p-4",
		emptyText: "text-sm leading-5 text-[#c5cec4]",
		option:
			"min-h-[92px] min-w-[72px] items-center justify-center gap-1.5 rounded-xl border border-[#2b342c] bg-[#151915] px-2.5 py-3",
	},
	variants: {
		disabled: {
			false: {},
			true: {
				option: "opacity-[0.45]",
			},
		},
		selected: {
			false: {},
			true: {
				badge: "bg-[#386626]",
				option: "border-2 border-[#9ad66d]",
			},
		},
	},
	defaultVariants: {
		disabled: false,
		selected: false,
	},
});

const classNames = dateStripClassNames();
