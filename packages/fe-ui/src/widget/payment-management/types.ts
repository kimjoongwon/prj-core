import type { ChipProps } from "@cocrepo/ui/heroui";

export interface PaymentManagementQueryState {
	isLoading: boolean;
	isFetching: boolean;
	isError: boolean;
}

export interface PaymentManagementMetric {
	label: string;
	value: string;
	description: string;
	icon: "payment" | "paid" | "pending" | "service";
	tone: ChipProps["color"];
}

export interface PaymentManagementSummary {
	totalPaymentCount: number;
	paidAmountLabel: string;
	pendingPaymentCount: number;
	serviceCount: number;
	spaceCount: number;
}

export interface PaymentManagementPayment {
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
