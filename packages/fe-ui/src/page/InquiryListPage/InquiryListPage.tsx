"use client";

import type { InquiryDto } from "@cocrepo/api/core/inquiries";
import type {
	DataGridQueryStates,
	DataGridSetQueryStates,
	InputConfig,
} from "@cocrepo/type";
import {
	buildInquiryTableColumns,
	DataGrid,
	DataGridStateModel,
	type InquiryStats,
	InquiryStatsCards,
	PageTitleBar,
	Surface,
	VStack,
} from "@cocrepo/ui";
import { Button } from "@heroui/react";
import { Plus } from "lucide-react";
import { observer, useLocalObservable } from "mobx-react-lite";
import { useEffect } from "react";

const leftInputs: InputConfig[] = [
	{
		type: "search",
		id: "search",
		placeholder: "제목 또는 고객 ID로 검색",
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

export interface InquiryListPageQueryStates extends DataGridQueryStates {
	take: number;
	skip: number;
	search: string;
	inquiryStatus: string;
}
export type InquiryListPageSetQueryStates = DataGridSetQueryStates;

export interface InquiryListPageProps {
	inquiries?: InquiryDto[];
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

export const InquiryListPage = observer(
	({
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
			() => new DataGridStateModel({ queryStates, setQueryStates }),
		);

		useEffect(() => {
			gridState.syncQuery(queryStates, setQueryStates);
		}, [gridState, queryStates, setQueryStates]);
		const inquiryRows = inquiries ?? [];
		const columns = buildInquiryTableColumns<InquiryDto>();

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
						<DataGrid
							config={{
								entity: "Inquiry",
								columns,
								leftInputs,
								onRowClick: (inquiry) => {
									onClickInquiryRow(inquiry.id);
								},
								emptyMessage: "표시할 문의가 없습니다.",
							}}
							rows={inquiryRows}
							totalCount={totalCount}
							isLoading={false}
							state={gridState}
						/>
					</Surface>
				</VStack>
			</div>
		);
	},
);
