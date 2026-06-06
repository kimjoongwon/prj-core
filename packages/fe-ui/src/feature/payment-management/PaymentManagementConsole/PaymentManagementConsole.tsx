"use client";

import { VStack } from "@cocrepo/ui";
import { observer } from "mobx-react-lite";
import { Separator } from "@heroui/react";
import type {
	PaymentManagementMetric,
	PaymentManagementPayment,
	PaymentManagementQueryState,
	PaymentManagementSummary,
} from "../../../widget/payment-management";
import {
	PaymentMetricGrid,
	PaymentScopeRail,
	PaymentTable,
	PaymentTableStatePanel,
	type PaymentTableStatePanelStatus,
} from "../../../widget/payment-management";

export interface PaymentManagementConsoleProps {
	payments: PaymentManagementPayment[];
	summary: PaymentManagementSummary;
	queryState: PaymentManagementQueryState;
}

const getPaymentMetrics = (
	summary: PaymentManagementSummary,
): PaymentManagementMetric[] => [
	{
		label: "결제 원장",
		value: `${summary.totalPaymentCount}건`,
		description: `${summary.spaceCount}개 Space 범위`,
		icon: "payment",
		tone: "primary",
	},
	{
		label: "결제 완료액",
		value: summary.paidAmountLabel,
		description: "PAID 상태 합계",
		icon: "paid",
		tone: "success",
	},
	{
		label: "결제 대기",
		value: `${summary.pendingPaymentCount}건`,
		description: "승인 전 확인 대상",
		icon: "pending",
		tone: "warning",
	},
	{
		label: "연결 서비스",
		value: `${summary.serviceCount}개`,
		description: "Course/Product 확장 대상",
		icon: "service",
		tone: "secondary",
	},
];

const getBlockingStateStatus = (
	queryState: PaymentManagementQueryState,
	paymentCount: number,
): PaymentTableStatePanelStatus | null => {
	if (queryState.isLoading) return "loading";
	if (queryState.isError) return "error";
	if (paymentCount === 0) return "empty";
	return null;
};

export const PaymentManagementConsole = observer(
	({ payments, summary, queryState }: PaymentManagementConsoleProps) => {
		const metrics = getPaymentMetrics(summary);
		const blockingStateStatus = getBlockingStateStatus(
			queryState,
			payments.length,
		);
		const isRefreshing =
			queryState.isFetching && !queryState.isLoading && !queryState.isError;
		const shouldShowTable = blockingStateStatus === null;

		return (
			<VStack gap="section" fullWidth>
				<PaymentScopeRail />
				<PaymentMetricGrid metrics={metrics} />
				<Separator className="bg-border/60" />
				{isRefreshing ? <PaymentTableStatePanel status="refreshing" /> : null}
				{blockingStateStatus ? (
					<PaymentTableStatePanel status={blockingStateStatus} />
				) : null}
				{shouldShowTable ? <PaymentTable payments={payments} /> : null}
			</VStack>
		);
	},
);

PaymentManagementConsole.displayName = "PaymentManagementConsole";

export type {
	PaymentManagementPayment,
	PaymentManagementQueryState,
	PaymentManagementSummary,
};
