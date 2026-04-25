"use client";

import type {
	InputConfig,
	MetaDataGridQueryStates,
	MetaDataGridSetQueryStates,
} from "@cocrepo/type";
import {
	buildInquiryTableColumns,
	type InquiryStats,
	InquiryStatsCards,
	MetaDataGrid,
	MetaDataGridStateModel,
	PageTitleBar,
	type SLAStatus,
	Surface,
	VStack,
} from "@cocrepo/ui";
import type {
	InquiryCategoryCell,
	InquiryChannelCell,
	InquiryPriorityCell,
	InquirySentimentCell,
	InquiryStatusCell,
} from "../../cell";
import { Button } from "@heroui/react";
import { Plus } from "lucide-react";
import { observer, useLocalObservable } from "mobx-react-lite";
import { useEffect } from "react";

const leftInputs: InputConfig[] = [
	{
		type: "search",
		id: "search",
		placeholder: "제목 또는 고객 ID로 검색",
		props: {
			placement: "column-header",
		},
	},
	{
		type: "select",
		id: "inquiryStatus",
		label: "상태",
		placeholder: "전체 상태",
		props: {
			options: [
				{ label: "신규", value: "NEW" },
				{ label: "처리 중", value: "IN_PROGRESS" },
				{ label: "고객 대기", value: "WAITING_CUSTOMER" },
				{ label: "해결됨", value: "RESOLVED" },
				{ label: "종료됨", value: "CLOSED" },
			],
		},
	},
];

export const adminInquiriesPageQueryInputs = [...leftInputs];

export interface InquiryListPageQueryStates extends MetaDataGridQueryStates {
	take: number;
	skip: number;
	search: string;
	inquiryStatus: string;
}
export type InquiryListPageSetQueryStates = MetaDataGridSetQueryStates;

export interface InquiryListPageInquiry {
	id: string;
	title: string;
	customerId: string;
	customerName: string;
	status: Parameters<typeof InquiryStatusCell>[0]["value"];
	category: Parameters<typeof InquiryCategoryCell>[0]["value"];
	channel: Parameters<typeof InquiryChannelCell>[0]["value"];
	priority: Parameters<typeof InquiryPriorityCell>[0]["value"];
	assigneeId?: string;
	assigneeName?: string;
	sentiment?: Parameters<typeof InquirySentimentCell>[0]["value"];
	slaStatus?: SLAStatus;
	slaRemainingMinutes?: number;
	unreadCount: number;
	createdAt: string;
	updatedAt: string;
}

export interface InquiryListPageProps {
	inquiries: InquiryListPageInquiry[];
	totalCount: number;
	stats: InquiryStats;
	activeStatus?: string;
	isLoading: boolean;
	queryStates: InquiryListPageQueryStates;
	setQueryStates: InquiryListPageSetQueryStates;
	onClickNewInquiry: () => void;
	onClickInquiryRow: (inquiryId: string) => void;
	onClickStatusFilter: (status: string | undefined) => void;
}

function InquiriesPageShellFallback() {
	return (
		<div className="space-y-5">
			<Surface className="h-32 rounded-2xl border-divider/80 bg-content1/70">
				{null}
			</Surface>
		</div>
	);
}

export const InquiryListPage = observer(({
	inquiries,
	totalCount,
	stats,
	activeStatus,
	isLoading,
	queryStates,
	setQueryStates,
	onClickNewInquiry,
	onClickInquiryRow,
	onClickStatusFilter,
}: InquiryListPageProps) => {
	const gridState = useLocalObservable(
		() => new MetaDataGridStateModel({ queryStates, setQueryStates }),
	);

	useEffect(() => {
		gridState.syncQuery(queryStates, setQueryStates);
	}, [gridState, queryStates, setQueryStates]);
	const columns = buildInquiryTableColumns<InquiryListPageInquiry>();

	if (isLoading) {
		return <InquiriesPageShellFallback />;
	}

	return (
		<div className="space-y-5">
			<PageTitleBar
				title="문의 관리"
				description="고객 문의를 접수/처리/해결합니다."
				actions={
					<Button
						color="primary"
						startContent={<Plus className="size-4" />}
						onPress={onClickNewInquiry}
					>
						문의 접수
					</Button>
				}
			/>
			<VStack gap={4}>
				<Surface className="rounded-2xl border-divider/80 bg-content1/70">
					<div className="mb-4 border-b border-divider/80 pb-4">
						<PageTitleBar level={2} title="문의 현황" />
					</div>
					<InquiryStatsCards
						stats={stats}
						activeStatus={activeStatus}
						onStatusClick={onClickStatusFilter}
					/>
				</Surface>
				<Surface className="rounded-2xl border-divider/80 bg-content1/70">
					<div className="mb-4 border-b border-divider/80 pb-4">
						<PageTitleBar level={2} title="문의 목록" />
					</div>
					<MetaDataGrid
						config={{
							entity: "Inquiry",
							columns,
							leftInputs,
							onRowClick: (inquiry) => {
								onClickInquiryRow(inquiry.id);
							},
							emptyMessage: "표시할 문의가 없습니다.",
						}}
	rows={inquiries}
	totalCount={totalCount}
	isLoading={false}
	state={gridState}
/>
				</Surface>
			</VStack>
		</div>
	);
});
