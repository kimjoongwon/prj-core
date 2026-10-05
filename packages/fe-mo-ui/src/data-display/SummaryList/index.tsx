import { observer } from "mobx-react-lite";
import { type ReactNode } from "react";
import { View, type ViewProps } from "react-native";
import { tv } from "tailwind-variants";
import { HStack, VStack } from "../../rhythm";
import { Typography } from "../Typography";
export type SummaryListItemState = "complete" | "missing" | "warning";
export interface SummaryListItem {
	helperText?: ReactNode;
	id?: string;
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
const OptionalText = ({
	className,
	node,
}: {
	className: string;
	node: ReactNode;
}) => {
	if (node === undefined || node === null || node === false) {
		return null;
	}
	return <Typography className={className} type="body-sm">{node}</Typography>;
};
const getDisplayedValue = (item: SummaryListItem) =>
	item.value ?? item.placeholder ?? "Not selected";
const hasSummaryValue = (item: SummaryListItem) =>
	item.value !== undefined && item.value !== null && item.value !== false;
const toPrimitiveKeyPart = (node: ReactNode) => {
	if (typeof node === "string" || typeof node === "number") {
		return String(node);
	}
	return undefined;
};
const getSummaryItemKey = (item: SummaryListItem, position: number) => {
	const generatedKey = [
		"summary-item",
		toPrimitiveKeyPart(item.label),
		toPrimitiveKeyPart(getDisplayedValue(item)),
	]
		.filter(Boolean)
		.join(":");

	return item.id || generatedKey || `summary-item-position-${position}`;
};
const SummaryItem = ({ item }: { item: SummaryListItem }) => {
	const state = item.state ?? (hasSummaryValue(item) ? "complete" : "missing");
	return (
		<VStack
			accessibilityState={{
				disabled: state === "missing",
			}}
			className={classNames.item()}
			gap="dense"
		>
			<HStack
				alignItems="start"
				gap="block"
				justifyContent="between"
			>
				<Typography className={classNames.itemLabel()} key="label" type="body-sm">
					{item.label}
				</Typography>
				<Typography
					className={summaryListClassNames({
						state,
					}).itemValue()}
					key="value"
					type="body-sm"
				>
					{getDisplayedValue(item)}
				</Typography>
			</HStack>
			<OptionalText
				className={classNames.helperText()}
				node={item.helperText}
			/>
		</VStack>
	);
};
const SummaryItems = ({ items }: { items: readonly SummaryListItem[] }) => (
	<>
		{items.map((item, index) => {
			const itemKey = getSummaryItemKey(item, index);
			return <SummaryItem item={item} key={itemKey} />;
		})}
	</>
);
const SummaryListComponent = observer((props: SummaryListProps) => {
	const { description, footer, items = [], style, title, ...rest } = props;
	return (
		<VStack {...rest} gap="block" style={style}>
			{title || description ? (
				<VStack gap="dense">
					<OptionalText className={classNames.title()} node={title} />
					<OptionalText
						className={classNames.description()}
						node={description}
					/>
				</VStack>
			) : null}
			<View className={classNames.items()}>
				<SummaryItems items={items} />
			</View>
			{footer ? <View className={classNames.footer()}>{footer}</View> : null}
		</VStack>
	);
});
SummaryListComponent.displayName = "SummaryList";
export const SummaryList = SummaryListComponent;
const summaryListClassNames = tv({
	slots: {
		description: "text-[13px] leading-5 text-muted",
		footer: "pt-1",
		helperText: "text-xs leading-4 text-muted",
		item: "py-3",
		itemLabel: "flex-1 text-[13px] leading-[18px] text-muted",
		itemValue:
			"flex-[1.2] text-right text-sm font-bold leading-5 text-foreground",
		items: "rounded-lg border border-border bg-surface px-3",
		title: "text-base font-extrabold leading-6 text-foreground",
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
