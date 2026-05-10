import { createElement, type ReactNode } from "react";
import {
	Text,
	View,
	type ViewProps,
} from "react-native";
import { observer } from "mobx-react-lite";
import { tv } from "tailwind-variants";

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
	className: string,
) => {
	if (node === undefined || node === null || node === false) {
		return null;
	}

	return createElement(Text, { className, key }, node);
};

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
			className: classNames.item(),
		},
		createElement(View, { className: classNames.itemRow() }, [
			createElement(
				Text,
				{ className: classNames.itemLabel(), key: "label" },
				item.label,
			),
			createElement(
				Text,
				{
					className: summaryListClassNames({ state }).itemValue(),
					key: "value",
				},
				getDisplayedValue(item),
			),
		]),
		renderOptionalText(item.helperText, "helper", classNames.helperText()),
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
			className: classNames.root(),
			style,
		},
		title || description
			? createElement(View, { className: classNames.heading() }, [
					renderOptionalText(title, "title", classNames.title()),
					renderOptionalText(
						description,
						"description",
						classNames.description(),
					),
				])
			: null,
		createElement(View, { className: classNames.items() }, renderItems(items)),
		footer ? createElement(View, { className: classNames.footer() }, footer) : null,
	);
});

SummaryListComponent.displayName = "SummaryList";

export const SummaryList = SummaryListComponent;

const summaryListClassNames = tv({
	slots: {
		description: "text-sm leading-5 text-muted",
		footer: "pt-1",
		heading: "gap-1.5",
		helperText: "text-xs leading-4 text-muted",
		item: "gap-1.5 py-3",
		itemLabel: "flex-1 text-[13px] leading-[18px] text-muted",
		itemRow: "flex-row items-start justify-between gap-3",
		itemValue:
			"flex-[1.2] text-right text-sm font-bold leading-5 text-foreground",
		items: "rounded-xl border border-border bg-surface px-4",
		root: "gap-3",
		title: "text-lg font-extrabold leading-6 text-foreground",
	},
	variants: {
		state: {
			complete: {},
			missing: {
				itemValue: "font-medium text-muted",
			},
			warning: {
				itemValue: "text-warning",
			},
		},
	},
});

const classNames = summaryListClassNames();
