import type { ChipProps } from "../data-display/Chip/Chip";

export interface PaymentQueryState {
	isLoading: boolean;
	isFetching: boolean;
	isError: boolean;
}

export interface PaymentMetric {
	label: string;
	value: string;
	description: string;
	icon: "payment" | "paid" | "pending" | "service";
	tone: ChipProps["color"];
}

export interface PaymentSummary {
	totalPaymentCount: number;
	paidAmountLabel: string;
	pendingPaymentCount: number;
	serviceCount: number;
	spaceCount: number;
}

export interface PaymentRow {
	id: string;
	title: string;
	spaceLabel: string;
	payerLabel: string;
	subjectLabel: string;
	referenceLabel: string;
	amountLabel: string;
	providerLabel: string;
	methodLabel: string;
	requestedAtLabel: string;
	approvedAtLabel: string;
	statusLabel: string;
	statusTone: ChipProps["color"];
}
