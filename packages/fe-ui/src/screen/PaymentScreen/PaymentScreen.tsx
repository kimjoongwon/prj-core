"use client";

import type { DataGridColumnConfig, DataGridState } from "@cocrepo/type";
import { RefreshCw } from "lucide-react";
import { observer } from "mobx-react-lite";
import { Chip, type ChipProps } from "../../data-display/Chip/Chip";
import { DataGrid, DataGridColumnsState } from "../../data-grid";
import { Button } from "../../input/Button/Button";
import { Section } from "../../layout";
import { VStack } from "../../rhythm";
import { SectionSurface } from "../../surface";
import { PageTitleBar } from "../../widget/PageTitleBar";

export interface PaymentQueryState {
	isLoading: boolean;
	isFetching: boolean;
	isError: boolean;
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

export interface PaymentScreenProps {
	payments: PaymentRow[];
	summary: PaymentSummary;
	queryState: PaymentQueryState;
	onClickRefresh?: () => void;
}

interface PaymentMetricRow {
	id: string;
	label: string;
	value: string;
	description: string;
}

const readonlyGridState: DataGridState = {
	columns: new DataGridColumnsState(),
	query: {
		values: { skip: 0, take: 100 },
		setValues: async () => new URLSearchParams(),
	},
};

const paymentMetricColumns: DataGridColumnConfig<PaymentMetricRow>[] = [
	{ field: "label", label: "항목" },
	{ field: "value", label: "값" },
	{ field: "description", label: "설명" },
];

const paymentColumns: DataGridColumnConfig<PaymentRow>[] = [
	{
		field: "title",
		label: "결제",
		isRequired: true,
		cell: ({ row }) => (
			<div className="min-w-0">
				<div className="truncate font-medium text-foreground">
					{row.original.title}
				</div>
				<div className="truncate text-muted text-xs">
					{row.original.providerLabel} / {row.original.methodLabel}
				</div>
			</div>
		),
	},
	{ field: "spaceLabel", label: "Space" },
	{ field: "payerLabel", label: "결제자" },
	{ field: "subjectLabel", label: "대상" },
	{ field: "referenceLabel", label: "참조" },
	{ field: "amountLabel", label: "금액", align: "right" },
	{
		field: "statusLabel",
		label: "상태",
		cell: ({ row }) => (
			<Chip size="sm" variant="flat" color={row.original.statusTone}>
				{row.original.statusLabel}
			</Chip>
		),
	},
	{ field: "approvedAtLabel", label: "승인일" },
];

const getPaymentMetricRows = (summary: PaymentSummary): PaymentMetricRow[] => [
	{
		id: "total",
		label: "결제 원장",
		value: `${summary.totalPaymentCount}건`,
		description: `${summary.spaceCount}개 Space 범위`,
	},
	{
		id: "paid",
		label: "결제 완료액",
		value: summary.paidAmountLabel,
		description: "PAID 상태 합계",
	},
	{
		id: "pending",
		label: "결제 대기",
		value: `${summary.pendingPaymentCount}건`,
		description: "승인 전 확인 대상",
	},
	{
		id: "service",
		label: "연결 서비스",
		value: `${summary.serviceCount}개`,
		description: "Course/Product 확장 대상",
	},
];

export const PaymentScreen = observer(
	({ payments, summary, queryState, onClickRefresh }: PaymentScreenProps) => {
		const metricRows = getPaymentMetricRows(summary);
		return (
			<VStack fullWidth>
				<PageTitleBar
					title="결제 관리"
					description="Space별 결제 원장을 Course와 앞으로 추가될 Product까지 같은 구조로 추적합니다."
					actions={
						onClickRefresh ? (
							<Button
								variant="flat"
								color="primary"
								startContent={<RefreshCw className="size-4" />}
								onPress={onClickRefresh}
							>
								새로고침
							</Button>
						) : null
					}
				/>
				<SectionSurface>
					<Section>
						<Section.Body>
							<VStack>
								<DataGrid
									config={{
										entity: "PaymentMetric",
										columns: paymentMetricColumns,
										emptyMessage: "표시할 결제 지표가 없습니다.",
									}}
									rows={metricRows}
									totalCount={metricRows.length}
									state={readonlyGridState}
								/>
								{queryState.isError ? (
									<p className="rounded-lg border border-danger/30 bg-danger/10 p-4 text-danger text-sm">
										결제 원장을 불러오지 못했습니다. 잠시 후 다시 조회하거나 API
										연결 상태를 확인해 주세요.
									</p>
								) : (
									<DataGrid
										config={{
											entity: "Payment",
											columns: paymentColumns,
											emptyMessage: "표시할 Payment 항목이 없습니다.",
										}}
										rows={payments}
										totalCount={payments.length}
										state={readonlyGridState}
										isLoading={queryState.isLoading}
									/>
								)}
								{queryState.isFetching && !queryState.isLoading ? (
									<p className="text-muted text-sm">
										결제 원장을 최신 상태로 맞추고 있습니다.
									</p>
								) : null}
							</VStack>
						</Section.Body>
					</Section>
				</SectionSurface>
			</VStack>
		);
	},
);
PaymentScreen.displayName = "PaymentScreen";
