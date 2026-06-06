"use client";

import type { InquiryDto } from "@cocrepo/api/core/inquiries";
import type {
	DataGridQueryStates,
	DataGridSetQueryStates,
	InputConfig,
	SelectOption,
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
import { Plus } from "lucide-react";
import { observer, useLocalObservable } from "mobx-react-lite";
import { useEffect } from "react";
import { Button } from "../../control/Button/Button";

const searchInput: InputConfig = {
	type: "search",
	id: "search",
	placeholder: "제목 또는 고객 ID로 검색",
};

const statusInput: InputConfig = {
	type: "select",
	id: "inquiryStatus",
	label: "상태",
	placeholder: "전체 상태",
	props: {
		options: [],
	},
};

export const adminInquiriesPageQueryInputs = [searchInput, statusInput];

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
	statusOptions: SelectOption[];
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
			<Surface className="h-32 rounded-2xl border-border/80 bg-surface/70">
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
		statusOptions,
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
		const leftInputs: InputConfig[] = [
			searchInput,
			{
				...statusInput,
				props: {
					...statusInput.props,
					options: statusOptions,
				},
			},
		];

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
					<Surface className="rounded-2xl border-border/80 bg-surface/70">
						<div className="mb-4 border-b border-border/80 pb-4">
							<PageTitleBar level={2} title="문의 현황" />
						</div>
						<InquiryStatsCards
							stats={stats}
							activeStatus={activeStatus}
							onStatusClick={onClickStatusFilter}
						/>
					</Surface>
					<Surface className="rounded-2xl border-border/80 bg-surface/70">
						<div className="mb-4 border-b border-border/80 pb-4">
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
							state={gridState}
						/>
					</Surface>
				</VStack>
			</div>
		);
	},
);
