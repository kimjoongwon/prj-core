import { type ReactNode } from "react";
import {
	Pressable,
	type PressableProps,
	ScrollView,
	type StyleProp,
	View,
	type ViewProps,
	type ViewStyle,
} from "react-native";
import { tv } from "tailwind-variants";
import { Text } from "../../data-display/Text";
export interface DateStripOption {
	badge?: ReactNode;
	count?: number;
	dateLabel: ReactNode;
	dayLabel: ReactNode;
	isDisabled?: boolean;
	value: string;
}
export interface PureDateStripProps extends Omit<ViewProps, "children"> {
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
	[toText(option.dayLabel), toText(option.dateLabel)].filter(Boolean).join(" ");
const createSelectHandler = (
	option: DateStripOption,
	disabled: boolean,
	onSelect: PureDateStripProps["onSelect"],
) => {
	if (disabled || option.isDisabled) {
		return undefined;
	}
	return () => {
		onSelect?.(option.value, option);
	};
};
const DateBadge = ({
	isSelected,
	option,
}: {
	isSelected: boolean;
	option: DateStripOption;
}) => {
	const badge = option.badge ?? option.count;
	const slotClassNames = dateStripClassNames({
		selected: isSelected,
	});
	if (badge === undefined || badge === null || badge === false) {
		return null;
	}
	return (
		<View className={slotClassNames.badge()}>
			<Text className={slotClassNames.badgeText()}>{badge}</Text>
		</View>
	);
};
const DateOption = ({
	disabled,
	index,
	onSelect,
	option,
	selectedValue,
}: Pick<PureDateStripProps, "disabled" | "onSelect" | "selectedValue"> & {
	index: number;
	option: DateStripOption;
}) => {
	const isSelected = selectedValue === option.value;
	const isDisabled = Boolean(disabled || option.isDisabled);
	const slotClassNames = dateStripClassNames({
		disabled: isDisabled,
		selected: isSelected,
	});
	return (
		<Pressable
			accessibilityLabel={getAccessibilityLabel(option)}
			accessibilityRole="button"
			accessibilityState={{
				disabled: isDisabled,
				selected: isSelected,
			}}
			disabled={isDisabled}
			key={option.value || `date-strip-option-${index}`}
			onPress={
				createSelectHandler(
					option,
					Boolean(disabled),
					onSelect,
				) as PressableProps["onPress"]
			}
			className={slotClassNames.option()}
		>
			<Text className={slotClassNames.dayLabel()}>{option.dayLabel}</Text>
			<Text className={slotClassNames.dateLabel()}>{option.dateLabel}</Text>
			<DateBadge isSelected={isSelected} option={option} />
		</Pressable>
	);
};
const DateOptions = ({
	disabled,
	onSelect,
	options = [],
	selectedValue,
}: Pick<
	PureDateStripProps,
	"disabled" | "onSelect" | "options" | "selectedValue"
>) => (
	<>
		{options.map((option, index) => (
			<DateOption
				disabled={disabled}
				index={index}
				key={option.value || `date-strip-option-${index}`}
				onSelect={onSelect}
				option={option}
				selectedValue={selectedValue}
			/>
		))}
	</>
);
const PureDateStripComponent = (props: PureDateStripProps) => {
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
		return (
			<View
				{...rest}
				accessibilityRole="summary"
				className={classNames.empty()}
				style={style}
			>
				<Text className={classNames.emptyText()}>
					{emptyLabel ?? "No dates"}
				</Text>
			</View>
		);
	}
	return (
		<View {...rest} className={className} style={style}>
			<ScrollView
				horizontal
				showsHorizontalScrollIndicator={false}
				contentContainerClassName={classNames.content({
					className: contentContainerClassName,
				})}
				contentContainerStyle={contentContainerStyle}
			>
				<DateOptions
					disabled={disabled}
					onSelect={onSelect}
					options={options}
					selectedValue={selectedValue}
				/>
			</ScrollView>
		</View>
	);
};
PureDateStripComponent.displayName = "PureDateStrip";
export const PureDateStrip = PureDateStripComponent;
export const DateStrip = PureDateStrip;
export type DateStripProps = PureDateStripProps;
const dateStripClassNames = tv({
	slots: {
		badge:
			"min-w-6 items-center rounded-full bg-surface-secondary px-1.5 py-0.5",
		badgeText:
			"text-[11px] font-bold leading-[14px] text-surface-secondary-foreground",
		content: "gap-2 px-0.5 py-0.5",
		dateLabel: "text-[15px] font-bold leading-6 text-foreground",
		dayLabel: "text-xs font-semibold uppercase leading-4 text-muted",
		empty: "rounded-lg border border-border bg-surface-secondary p-4",
		emptyText: "text-sm leading-5 text-muted",
		option:
			"min-h-[72px] min-w-[58px] items-center justify-center gap-1.5 rounded-lg border border-border bg-surface px-2 py-2",
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
				badge: "border-accent-foreground bg-accent-foreground",
				badgeText: "text-accent",
				dateLabel: "text-accent-foreground",
				dayLabel: "text-accent-foreground",
				option: "border-accent bg-accent",
			},
		},
	},
	defaultVariants: {
		disabled: false,
		selected: false,
	},
});
const classNames = dateStripClassNames();
