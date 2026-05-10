import { createElement, type ReactNode } from "react";
import { Text, View, type ViewProps } from "react-native";
import { observer } from "mobx-react-lite";
import { tv } from "tailwind-variants";

export interface ReservationCheckoutSummaryItem {
	label: ReactNode;
	value: ReactNode;
}

export interface ReservationCheckoutSummaryProps
	extends Omit<ViewProps, "children"> {
	amountLabel?: ReactNode;
	currencyLabel?: ReactNode;
	items: readonly ReservationCheckoutSummaryItem[];
	title: ReactNode;
}

const renderSummaryItem = (
	item: ReservationCheckoutSummaryItem,
	index: number,
) =>
	createElement(
		View,
		{
			className: classNames.item(),
			key: `reservation-checkout-summary-${index}`,
		},
		[
			createElement(
				Text,
				{ className: classNames.itemLabel(), key: "label" },
				item.label,
			),
			createElement(
				Text,
				{ className: classNames.itemValue(), key: "value" },
				item.value,
			),
		],
	);

const renderSummaryItems = (items: readonly ReservationCheckoutSummaryItem[]) =>
	items.map(renderSummaryItem);

const renderAmount = (
	amountLabel: ReactNode | undefined,
	currencyLabel: ReactNode | undefined,
) => {
	if (!amountLabel) {
		return null;
	}

	return createElement(View, { className: classNames.amountRow(), key: "amount" }, [
		createElement(
			Text,
			{ className: classNames.amountLabel(), key: "label" },
			"결제 금액",
		),
		createElement(View, { className: classNames.amountValueBlock(), key: "value" }, [
			createElement(
				Text,
				{ className: classNames.amountValue(), key: "amount" },
				amountLabel,
			),
			currencyLabel
				? createElement(
						Text,
						{ className: classNames.currency(), key: "currency" },
						currencyLabel,
					)
				: null,
		]),
	]);
};

const ReservationCheckoutSummaryComponent = observer(
	(props: ReservationCheckoutSummaryProps) => {
		const { amountLabel, currencyLabel, items, style, title, ...rest } = props;

		return createElement(
			View,
			{
				...rest,
				className: classNames.root(),
				style,
			},
			[
				createElement(Text, { className: classNames.title(), key: "title" }, title),
				createElement(
					View,
					{ className: classNames.items(), key: "items" },
					renderSummaryItems(items),
				),
				renderAmount(amountLabel, currencyLabel),
			],
		);
	},
);

ReservationCheckoutSummaryComponent.displayName = "ReservationCheckoutSummary";

export const ReservationCheckoutSummary = ReservationCheckoutSummaryComponent;

const reservationCheckoutSummaryClassNames = tv({
	slots: {
		amountLabel: "text-sm font-bold text-[#d6d3c7]",
		amountRow:
			"flex-row items-center justify-between rounded-xl bg-[#20301d] px-4 py-3",
		amountValue: "text-[22px] font-extrabold leading-7 text-[#b9f68b]",
		amountValueBlock: "items-end",
		currency: "text-xs font-bold text-[#d6d3c7]",
		item: "gap-1 border-b border-[#293229] py-3 last:border-b-0",
		itemLabel: "text-xs font-bold uppercase tracking-[0px] text-[#aeb7ac]",
		itemValue: "text-[15px] font-bold leading-5 text-[#fffaf0]",
		items: "rounded-xl border border-[#2b342c] bg-[#151915] px-4",
		root: "gap-4 rounded-2xl border border-[#2e382f] bg-[#121711] p-4",
		title: "text-lg font-extrabold leading-6 text-[#fffaf0]",
	},
});

const classNames = reservationCheckoutSummaryClassNames();
