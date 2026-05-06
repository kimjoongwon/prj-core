import { createElement, type ReactNode } from "react";
import {
	StyleSheet,
	Text,
	View,
	type StyleProp,
	type TextStyle,
	type ViewProps,
} from "react-native";
import { observer } from "mobx-react-lite";

export type SummaryListItemState = "complete" | "missing" | "warning";

export interface SummaryListItem {
	helperText?: ReactNode;
	label: ReactNode;
	placeholder?: ReactNode;
	state?: SummaryListItemState;
	value?: ReactNode;
}

export interface SummaryListProps extends Omit<ViewProps, "children"> {
	description?: ReactNode;
	footer?: ReactNode;
	items?: readonly SummaryListItem[];
	title?: ReactNode;
}

const renderOptionalText = (
	node: ReactNode,
	key: string,
	style: StyleProp<TextStyle>,
) => {
	if (node === undefined || node === null || node === false) {
		return null;
	}

	return createElement(Text, { key, style }, node);
};

const getValueTextStyle = (item: SummaryListItem) => [
	styles.itemValue,
	item.state === "missing" ? styles.itemValueMissing : null,
	item.state === "warning" ? styles.itemValueWarning : null,
];

const getDisplayedValue = (item: SummaryListItem) =>
	item.value ?? item.placeholder ?? "Not selected";

const hasSummaryValue = (item: SummaryListItem) =>
	item.value !== undefined && item.value !== null && item.value !== false;

const renderSummaryItem = (item: SummaryListItem, index: number) => {
	const state = item.state ?? (hasSummaryValue(item) ? "complete" : "missing");

	return createElement(
		View,
		{
			accessibilityState: {
				disabled: state === "missing",
			},
			key: `summary-item-${index}`,
			style: styles.item,
		},
		createElement(View, { style: styles.itemRow }, [
			createElement(Text, { key: "label", style: styles.itemLabel }, item.label),
			createElement(
				Text,
				{
					key: "value",
					style: getValueTextStyle({ ...item, state }),
				},
				getDisplayedValue(item),
			),
		]),
		renderOptionalText(item.helperText, "helper", styles.helperText),
	);
};

const renderItems = (items: readonly SummaryListItem[]) =>
	items.map(renderSummaryItem);

const SummaryListComponent = observer((props: SummaryListProps) => {
	const { description, footer, items = [], style, title, ...rest } = props;

	return createElement(
		View,
		{
			...rest,
			style: [styles.root, style],
		},
		title || description
			? createElement(View, { style: styles.heading }, [
					renderOptionalText(title, "title", styles.title),
					renderOptionalText(description, "description", styles.description),
				])
			: null,
		createElement(View, { style: styles.items }, renderItems(items)),
		footer ? createElement(View, { style: styles.footer }, footer) : null,
	);
});

SummaryListComponent.displayName = "SummaryList";

export const SummaryList = SummaryListComponent;

const styles = StyleSheet.create({
	description: {
		color: "#aeb7ac",
		fontSize: 14,
		lineHeight: 20,
	},
	footer: {
		paddingTop: 4,
	},
	heading: {
		gap: 6,
	},
	helperText: {
		color: "#aeb7ac",
		fontSize: 12,
		lineHeight: 16,
	},
	item: {
		gap: 6,
		paddingVertical: 12,
	},
	itemLabel: {
		color: "#aeb7ac",
		flex: 1,
		fontSize: 13,
		lineHeight: 18,
	},
	itemRow: {
		alignItems: "flex-start",
		flexDirection: "row",
		gap: 12,
		justifyContent: "space-between",
	},
	itemValue: {
		color: "#f5f8f1",
		flex: 1.2,
		fontSize: 14,
		fontWeight: "700",
		lineHeight: 20,
		textAlign: "right",
	},
	itemValueMissing: {
		color: "#7f897d",
		fontWeight: "500",
	},
	itemValueWarning: {
		color: "#e6b36a",
	},
	items: {
		backgroundColor: "#151915",
		borderColor: "#2b342c",
		borderRadius: 12,
		borderWidth: 1,
		paddingHorizontal: 16,
	},
	root: {
		gap: 12,
	},
	title: {
		color: "#f5f8f1",
		fontSize: 18,
		fontWeight: "800",
		lineHeight: 24,
	},
});
