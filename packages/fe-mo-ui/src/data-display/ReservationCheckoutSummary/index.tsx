import { type ReactNode } from "react";
import { Text, View, type ViewProps } from "react-native";
import { observer } from "mobx-react-lite";
import { tv } from "tailwind-variants";
import { Card } from "../../layout/Card";
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
        <Card.Title className={classNames.title()} key="title">
          {title}
        </Card.Title>
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
    amountLabel: "text-sm font-bold text-surface-foreground",
    amountRow:
      "flex-row items-center justify-between rounded-xl bg-success-soft px-4 py-3",
    amountValue:
      "text-[22px] font-extrabold leading-7 text-success-soft-foreground",
    amountValueBlock: "items-end",
    currency: "text-xs font-bold text-surface-foreground",
    item: "gap-1 border-b border-border py-3 last:border-b-0",
    itemLabel: "text-xs font-bold uppercase tracking-[0px] text-muted",
    itemValue: "text-[15px] font-bold leading-5 text-foreground",
    items: "rounded-xl border border-border bg-surface px-4",
    root: "gap-4 border border-border",
    title: "text-lg font-extrabold leading-6 text-foreground",
  },
});
const classNames = reservationCheckoutSummaryClassNames();
