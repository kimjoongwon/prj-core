import { createElement, type ReactNode } from "react";
import {
	Pressable,
	StyleSheet,
	Text,
	View,
	type PressableProps,
	type StyleProp,
	type TextStyle,
	type ViewProps,
	type ViewStyle,
} from "react-native";
import { observer } from "mobx-react-lite";

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
	style: StyleProp<TextStyle> | undefined,
) => {
	if (node === undefined || node === null || node === false) {
		return null;
	}

	return createElement(Text, { key, style }, node);
};

const renderTag = (tag: ReactNode, index: number) =>
	createElement(
		View,
		{
			key: `tag-${index}`,
			style: styles.tag,
		},
		createElement(Text, { style: styles.tagText }, tag),
	);

const renderMeta = (meta: ReactNode, index: number) =>
	createElement(
		Text,
		{
			key: `meta-${index}`,
			style: styles.metaText,
		},
		meta,
	);

const renderTags = (item: SelectableCardItem) => {
	if (!item.tags?.length) {
		return null;
	}

	return createElement(View, { style: styles.tags }, item.tags.map(renderTag));
};

const renderMetaList = (item: SelectableCardItem) => {
	if (!item.meta?.length) {
		return null;
	}

	return createElement(View, { style: styles.meta }, item.meta.map(renderMeta));
};

const renderDisabledReason = (item: SelectableCardItem) => {
	if (!item.isDisabled || !item.disabledReason) {
		return null;
	}

	return createElement(Text, { style: styles.disabledReason }, item.disabledReason);
};

const renderSelectionIndicator = (
	isSelected: boolean,
	isDisabled: boolean,
	config: RenderSelectableCardConfig,
) =>
	createElement(
		View,
		{
			style: [
				styles.indicator,
				isSelected ? styles.indicatorSelected : null,
				isDisabled ? styles.indicatorDisabled : null,
			],
		},
		createElement(
			Text,
			{ style: styles.indicatorText },
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
			style: [
				styles.card,
				isSelected ? styles.cardSelected : null,
				isDisabled ? styles.cardDisabled : null,
				config.cardStyle,
				isSelected ? config.selectedCardStyle : null,
			],
		},
		createElement(View, { style: styles.cardHeader }, [
			createElement(View, { key: "title", style: styles.titleStack }, [
				renderNodeText(item.eyebrow, "eyebrow", styles.eyebrow),
				renderNodeText(item.title, "title", styles.cardTitle),
			]),
			createElement(
				View,
				{ key: "indicator" },
				renderSelectionIndicator(isSelected, isDisabled, config),
			),
		]),
		renderNodeText(item.description, "description", styles.cardDescription),
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
			style: styles.empty,
		},
		createElement(
			Text,
			{ style: styles.emptyTitle },
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
			style: [styles.root, style],
		},
		title || description
			? createElement(View, { style: styles.heading }, [
					renderNodeText(title, "title", styles.title),
					renderNodeText(description, "description", styles.description),
				])
			: null,
		items.length > 0
			? createElement(View, { style: styles.list }, renderCards(items, config))
			: renderEmptyContent(emptyContent, emptyLabel),
	);
});

SelectableCardListComponent.displayName = "SelectableCardList";

export const SelectableCardList = SelectableCardListComponent;

const styles = StyleSheet.create({
	card: {
		backgroundColor: "#151915",
		borderColor: "#2b342c",
		borderRadius: 12,
		borderWidth: 1,
		gap: 10,
		padding: 16,
	},
	cardDescription: {
		color: "#c5cec4",
		fontSize: 14,
		lineHeight: 20,
	},
	cardDisabled: {
		opacity: 0.55,
	},
	cardHeader: {
		alignItems: "flex-start",
		flexDirection: "row",
		gap: 12,
		justifyContent: "space-between",
	},
	cardSelected: {
		borderColor: "#9ad66d",
		borderWidth: 2,
	},
	cardTitle: {
		color: "#f5f8f1",
		fontSize: 16,
		fontWeight: "700",
		lineHeight: 22,
	},
	description: {
		color: "#aeb7ac",
		fontSize: 14,
		lineHeight: 20,
	},
	disabledReason: {
		color: "#e6b36a",
		fontSize: 13,
		lineHeight: 18,
	},
	empty: {
		backgroundColor: "#111511",
		borderColor: "#263026",
		borderRadius: 12,
		borderWidth: 1,
		padding: 16,
	},
	emptyTitle: {
		color: "#c5cec4",
		fontSize: 14,
		lineHeight: 20,
	},
	eyebrow: {
		color: "#9ad66d",
		fontSize: 12,
		fontWeight: "700",
		lineHeight: 16,
		textTransform: "uppercase",
	},
	heading: {
		gap: 6,
	},
	indicator: {
		alignItems: "center",
		backgroundColor: "#263026",
		borderRadius: 999,
		minWidth: 64,
		paddingHorizontal: 10,
		paddingVertical: 5,
	},
	indicatorDisabled: {
		backgroundColor: "#222822",
	},
	indicatorSelected: {
		backgroundColor: "#386626",
	},
	indicatorText: {
		color: "#f5f8f1",
		fontSize: 12,
		fontWeight: "700",
		lineHeight: 16,
	},
	list: {
		gap: 10,
	},
	meta: {
		flexDirection: "row",
		flexWrap: "wrap",
		gap: 8,
	},
	metaText: {
		color: "#dbe5d7",
		fontSize: 13,
		lineHeight: 18,
	},
	root: {
		gap: 12,
	},
	tag: {
		backgroundColor: "#263026",
		borderRadius: 999,
		paddingHorizontal: 10,
		paddingVertical: 5,
	},
	tagText: {
		color: "#dbe5d7",
		fontSize: 12,
		fontWeight: "600",
		lineHeight: 16,
	},
	tags: {
		flexDirection: "row",
		flexWrap: "wrap",
		gap: 8,
	},
	title: {
		color: "#f5f8f1",
		fontSize: 18,
		fontWeight: "800",
		lineHeight: 24,
	},
	titleStack: {
		flex: 1,
		gap: 4,
	},
});
