import { createElement, type ReactNode } from "react";
import {
	Pressable,
	Text,
	View,
	type PressableProps,
	type StyleProp,
	type ViewProps,
	type ViewStyle,
} from "react-native";
import { observer } from "mobx-react-lite";
import { tv } from "tailwind-variants";

export interface SelectableCardItem {
	description?: ReactNode;
	disabledReason?: ReactNode;
	eyebrow?: ReactNode;
	isDisabled?: boolean;
	meta?: readonly ReactNode[];
	tags?: readonly ReactNode[];
	title: ReactNode;
	value: string;
}

export interface SelectableCardListProps extends Omit<ViewProps, "children"> {
	cardStyle?: StyleProp<ViewStyle>;
	description?: ReactNode;
	disabled?: boolean;
	emptyContent?: ReactNode;
	emptyLabel?: ReactNode;
	items?: readonly SelectableCardItem[];
	onSelect?: (value: string) => void;
	selectLabel?: ReactNode;
	selectedCardStyle?: StyleProp<ViewStyle>;
	selectedLabel?: ReactNode;
	selectedValue?: string | null;
	title?: ReactNode;
}

interface RenderSelectableCardConfig {
	cardStyle?: StyleProp<ViewStyle>;
	disabled?: boolean;
	onSelect?: (value: string) => void;
	selectLabel?: ReactNode;
	selectedCardStyle?: StyleProp<ViewStyle>;
	selectedLabel?: ReactNode;
	selectedValue?: string | null;
}

const toAccessibleText = (value: ReactNode) => {
	if (typeof value === "string" || typeof value === "number") {
		return String(value);
	}

	return undefined;
};

const createSelectHandler = (
	item: SelectableCardItem,
	config: RenderSelectableCardConfig,
) => {
	if (config.disabled || item.isDisabled) {
		return undefined;
	}

	return () => {
		config.onSelect?.(item.value);
	};
};

const renderNodeText = (
	node: ReactNode,
	key: string,
	className: string | undefined,
) => {
	if (node === undefined || node === null || node === false) {
		return null;
	}

	return createElement(Text, { className, key }, node);
};

const renderTag = (tag: ReactNode, index: number) =>
	createElement(
		View,
		{
			key: `tag-${index}`,
			className: classNames.tag(),
		},
		createElement(Text, { className: classNames.tagText() }, tag),
	);

const renderMeta = (meta: ReactNode, index: number) =>
	createElement(
		Text,
		{
			className: classNames.metaText(),
			key: `meta-${index}`,
		},
		meta,
	);

const renderTags = (item: SelectableCardItem) => {
	if (!item.tags?.length) {
		return null;
	}

	return createElement(View, { className: classNames.tags() }, item.tags.map(renderTag));
};

const renderMetaList = (item: SelectableCardItem) => {
	if (!item.meta?.length) {
		return null;
	}

	return createElement(View, { className: classNames.meta() }, item.meta.map(renderMeta));
};

const renderDisabledReason = (item: SelectableCardItem) => {
	if (!item.isDisabled || !item.disabledReason) {
		return null;
	}

	return createElement(
		Text,
		{ className: classNames.disabledReason() },
		item.disabledReason,
	);
};

const renderSelectionIndicator = (
	isSelected: boolean,
	isDisabled: boolean,
	config: RenderSelectableCardConfig,
) =>
	createElement(
		View,
		{
			className: selectableCardListClassNames({
				disabled: isDisabled,
				selected: isSelected,
			}).indicator(),
		},
		createElement(
			Text,
			{ className: classNames.indicatorText() },
			isSelected
				? (config.selectedLabel ?? "Selected")
				: (config.selectLabel ?? "Select"),
		),
	);

const renderSelectableCard = (
	item: SelectableCardItem,
	index: number,
	config: RenderSelectableCardConfig,
) => {
	const isSelected = config.selectedValue === item.value;
	const isDisabled = Boolean(config.disabled || item.isDisabled);
	const slotClassNames = selectableCardListClassNames({
		disabled: isDisabled,
		selected: isSelected,
	});

	return createElement(
		Pressable,
		{
			accessibilityLabel: toAccessibleText(item.title),
			accessibilityRole: "button",
			accessibilityState: {
				disabled: isDisabled,
				selected: isSelected,
			},
			disabled: isDisabled,
			key: item.value || `selectable-card-${index}`,
			onPress: createSelectHandler(item, config) as PressableProps["onPress"],
			className: slotClassNames.card(),
			style: [config.cardStyle, isSelected ? config.selectedCardStyle : null],
		},
		createElement(View, { className: slotClassNames.cardHeader() }, [
			createElement(View, { className: slotClassNames.titleStack(), key: "title" }, [
				renderNodeText(item.eyebrow, "eyebrow", slotClassNames.eyebrow()),
				renderNodeText(item.title, "title", slotClassNames.cardTitle()),
			]),
			createElement(
				View,
				{ key: "indicator" },
				renderSelectionIndicator(isSelected, isDisabled, config),
			),
		]),
		renderNodeText(
			item.description,
			"description",
			slotClassNames.cardDescription(),
		),
		renderMetaList(item),
		renderTags(item),
		renderDisabledReason(item),
	);
};

const renderCards = (
	items: readonly SelectableCardItem[],
	config: RenderSelectableCardConfig,
) => items.map((item, index) => renderSelectableCard(item, index, config));

const renderEmptyContent = (emptyContent: ReactNode, emptyLabel: ReactNode) => {
	if (emptyContent) {
		return emptyContent;
	}

	return createElement(
		View,
		{
			accessibilityRole: "summary",
			className: classNames.empty(),
		},
		createElement(
			Text,
			{ className: classNames.emptyTitle() },
			emptyLabel ?? "No options available",
		),
	);
};

const SelectableCardListComponent = observer((props: SelectableCardListProps) => {
	const {
		cardStyle,
		description,
		disabled = false,
		emptyContent,
		emptyLabel,
		items = [],
		onSelect,
		selectLabel,
		selectedCardStyle,
		selectedLabel,
		selectedValue,
		style,
		title,
		...rest
	} = props;

	const config: RenderSelectableCardConfig = {
		cardStyle,
		disabled,
		onSelect,
		selectLabel,
		selectedCardStyle,
		selectedLabel,
		selectedValue,
	};

	return createElement(
		View,
		{
			...rest,
			className: classNames.root(),
			style,
		},
		title || description
			? createElement(View, { className: classNames.heading() }, [
					renderNodeText(title, "title", classNames.title()),
					renderNodeText(
						description,
						"description",
						classNames.description(),
					),
				])
			: null,
		items.length > 0
			? createElement(View, { className: classNames.list() }, renderCards(items, config))
			: renderEmptyContent(emptyContent, emptyLabel),
	);
});

SelectableCardListComponent.displayName = "SelectableCardList";

export const SelectableCardList = SelectableCardListComponent;

const selectableCardListClassNames = tv({
	slots: {
		card: "gap-2.5 rounded-xl border border-[#2b342c] bg-[#151915] p-4",
		cardDescription: "text-sm leading-5 text-[#c5cec4]",
		cardHeader: "flex-row items-start justify-between gap-3",
		cardTitle: "text-base font-bold leading-[22px] text-[#f5f8f1]",
		description: "text-sm leading-5 text-[#aeb7ac]",
		disabledReason: "text-[13px] leading-[18px] text-[#e6b36a]",
		empty: "rounded-xl border border-[#263026] bg-[#111511] p-4",
		emptyTitle: "text-sm leading-5 text-[#c5cec4]",
		eyebrow: "text-xs font-bold uppercase leading-4 text-[#9ad66d]",
		heading: "gap-1.5",
		indicator:
			"min-w-16 items-center rounded-full bg-[#263026] px-2.5 py-[5px]",
		indicatorText: "text-xs font-bold leading-4 text-[#f5f8f1]",
		list: "gap-2.5",
		meta: "flex-row flex-wrap gap-2",
		metaText: "text-[13px] leading-[18px] text-[#dbe5d7]",
		root: "gap-3",
		tag: "rounded-full bg-[#263026] px-2.5 py-[5px]",
		tagText: "text-xs font-semibold leading-4 text-[#dbe5d7]",
		tags: "flex-row flex-wrap gap-2",
		title: "text-lg font-extrabold leading-6 text-[#f5f8f1]",
		titleStack: "flex-1 gap-1",
	},
	variants: {
		disabled: {
			false: {},
			true: {
				card: "opacity-[0.55]",
				indicator: "bg-[#222822]",
			},
		},
		selected: {
			false: {},
			true: {
				card: "border-2 border-[#9ad66d]",
				indicator: "bg-[#386626]",
			},
		},
	},
	defaultVariants: {
		disabled: false,
		selected: false,
	},
});

const classNames = selectableCardListClassNames();
