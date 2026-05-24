import { type ReactNode } from "react";
import { View, type ViewProps } from "react-native";
import { observer } from "mobx-react-lite";
import { tv } from "tailwind-variants";
import { Icon } from "../../icon";
import { Card } from "../../layout/Card";
import { Text } from "../Text";
export interface ReservationCheckoutSummaryItem {
  label: ReactNode;
  value: ReactNode;
}
export interface ReservationCheckoutSummaryProps extends Omit<
  ViewProps,
  "children"
> {
  amountLabel?: ReactNode;
  currencyLabel?: ReactNode;
  items: readonly ReservationCheckoutSummaryItem[];
  title: ReactNode;
}
const SummaryItem = ({ item }: { item: ReservationCheckoutSummaryItem }) => (
  <View className={classNames.item()}>
    <Text className={classNames.itemLabel()} key="label">
      {item.label}
    </Text>
    <Text className={classNames.itemValue()} key="value">
      {item.value}
    </Text>
  </View>
);
const SummaryItems = ({
  items,
}: {
  items: readonly ReservationCheckoutSummaryItem[];
}) => (
  <>
    {items.map((item, index) => (
      <SummaryItem item={item} key={`reservation-checkout-summary-${index}`} />
    ))}
  </>
);
const AmountRow = ({
  amountLabel,
  currencyLabel,
}: {
  amountLabel?: ReactNode;
  currencyLabel?: ReactNode;
}) => {
  if (!amountLabel) {
    return null;
  }
  return (
    <View className={classNames.amountRow()} key="amount">
      <Text className={classNames.amountLabel()} key="label">
        결제 금액
      </Text>
      <View className={classNames.amountValueBlock()} key="value">
        <Text className={classNames.amountValue()} key="amount">
          {amountLabel}
        </Text>
        {currencyLabel ? (
          <Text className={classNames.currency()} key="currency">
            {currencyLabel}
          </Text>
        ) : null}
      </View>
    </View>
  );
};
const ReservationCheckoutSummaryComponent = observer(
  (props: ReservationCheckoutSummaryProps) => {
    const { amountLabel, currencyLabel, items, style, title, ...rest } = props;
    return (
      <Card {...rest} className={classNames.root()} style={style}>
        <View className={classNames.titleRow()} key="title">
          <Icon name="receipt" size="sm" tone="accent" />
          <Card.Title className={classNames.title()}>{title}</Card.Title>
        </View>
        <View className={classNames.items()} key="items">
          <SummaryItems items={items} />
        </View>
        <AmountRow amountLabel={amountLabel} currencyLabel={currencyLabel} />
      </Card>
    );
  },
);
ReservationCheckoutSummaryComponent.displayName = "ReservationCheckoutSummary";
export const ReservationCheckoutSummary = ReservationCheckoutSummaryComponent;
const reservationCheckoutSummaryClassNames = tv({
  slots: {
    amountLabel: "text-[13px] font-bold leading-5 text-surface-foreground",
    amountRow:
      "flex-row items-center justify-between rounded-lg border border-success bg-success-soft px-3 py-2",
    amountValue:
      "text-xl font-extrabold leading-7 text-success-soft-foreground",
    amountValueBlock: "items-end",
    currency: "text-xs font-bold text-surface-foreground",
    item: "gap-1 border-b border-border py-3 last:border-b-0",
    itemLabel: "text-xs font-bold uppercase tracking-[0px] text-muted",
    itemValue: "text-[15px] font-bold leading-5 text-foreground",
    items: "rounded-lg border border-border bg-surface px-3",
    root: "gap-4 rounded-lg border border-border bg-surface p-4",
    title: "text-base font-extrabold leading-6 text-foreground",
    titleRow: "flex-row items-center gap-2",
  },
});
const classNames = reservationCheckoutSummaryClassNames();
