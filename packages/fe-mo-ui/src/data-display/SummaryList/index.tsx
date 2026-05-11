import { type ReactNode } from "react";
import { Text, View, type ViewProps } from "react-native";
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
  return <Text className={className}>{node}</Text>;
};
const getDisplayedValue = (item: SummaryListItem) =>
  item.value ?? item.placeholder ?? "Not selected";
const hasSummaryValue = (item: SummaryListItem) =>
  item.value !== undefined && item.value !== null && item.value !== false;
const SummaryItem = ({
  index,
  item,
}: {
  index: number;
  item: SummaryListItem;
}) => {
  const state = item.state ?? (hasSummaryValue(item) ? "complete" : "missing");
  return (
    <View
      accessibilityState={{
        disabled: state === "missing",
      }}
      key={`summary-item-${index}`}
      className={classNames.item()}
    >
      <View className={classNames.itemRow()}>
        <Text className={classNames.itemLabel()} key="label">
          {item.label}
        </Text>
        <Text
          className={summaryListClassNames({
            state,
          }).itemValue()}
          key="value"
        >
          {getDisplayedValue(item)}
        </Text>
      </View>
      <OptionalText
        className={classNames.helperText()}
        node={item.helperText}
      />
    </View>
  );
};
const SummaryItems = ({ items }: { items: readonly SummaryListItem[] }) => (
  <>
    {items.map((item, index) => (
      <SummaryItem item={item} index={index} key={`summary-item-${index}`} />
    ))}
  </>
);
const SummaryListComponent = observer((props: SummaryListProps) => {
  const { description, footer, items = [], style, title, ...rest } = props;
  return (
    <View {...rest} className={classNames.root()} style={style}>
      {title || description ? (
        <View className={classNames.heading()}>
          <OptionalText className={classNames.title()} node={title} />
          <OptionalText
            className={classNames.description()}
            node={description}
          />
        </View>
      ) : null}
      <View className={classNames.items()}>
        <SummaryItems items={items} />
      </View>
      {footer ? <View className={classNames.footer()}>{footer}</View> : null}
    </View>
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
