"use client";

import {
	type InquiryDto,
	type InquiryStatus,
	useGetInquiriesSuspense,
	useGetInquiryStatsSuspense,
} from "@cocrepo/api/core/inquiries";
import type { InputConfig } from "@cocrepo/type";
import {
	buildInquiryTableColumns,
	type InquiryStats,
	InquiryStatsCards,
	MetaDataGrid,
	PageTitleBar,
	type SLAStatus,
	Surface,
	useMetaDataGridQueryStates,
	VStack,
} from "@cocrepo/ui";
import { Button } from "@heroui/react";
import { Plus } from "lucide-react";
import { observer } from "mobx-react-lite";
import { useRouter } from "next/navigation";
import { Suspense } from "react";
import { useHandlers } from "./hooks/useHandlers";

const FILTERABLE_INQUIRY_STATUSES: InquiryStatus[] = ["NEW", "IN_PROGRESS"];

const leftInputs: InputConfig[] = [
	{
		type: "search",
		id: "search",
		placeholder: "제목 또는 고객 ID로 검색",
		props: {
			debounceMs: 300,
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

const getNumberQueryValue = (value: unknown, fallback: number): number => {
	return typeof value === "number" ? value : fallback;
};

const getSearchQueryValue = (value: unknown): string | undefined => {
	if (typeof value !== "string") {
		return undefined;
	}

	const trimmed = value.trim();
	return trimmed.length > 0 ? trimmed : undefined;
};

const getInquiryStatusFilter = (value: unknown): InquiryStatus | undefined => {
	if (typeof value !== "string") {
		return undefined;
	}

	return FILTERABLE_INQUIRY_STATUSES.includes(value as InquiryStatus)
		? (value as InquiryStatus)
		: undefined;
};

const getSlaStatus = (inquiry: InquiryDto): SLAStatus | undefined => {
	if (inquiry.isSlaResponseBreached || inquiry.isSlaResolveBreached) {
		return "breach";
	}

	if (!inquiry.slaResponseDue) {
		return undefined;
	}

	const remainingMinutes = Math.floor(
		(new Date(inquiry.slaResponseDue).getTime() - Date.now()) / 60000,
	);

	if (remainingMinutes <= 60) {
		return "warning";
	}

	return "ok";
};

const getSlaRemainingMinutes = (inquiry: InquiryDto): number | undefined => {
	if (!inquiry.slaResponseDue) {
		return undefined;
	}

	return Math.floor(
		(new Date(inquiry.slaResponseDue).getTime() - Date.now()) / 60000,
	);
};

const mapInquiryRow = (inquiry: InquiryDto) => {
	return {
		id: inquiry.id,
		title: inquiry.title,
		customerId: inquiry.customerId ?? "-",
		customerName: inquiry.customerId ?? "고객",
		status: inquiry.status,
		category: inquiry.category,
		channel: inquiry.channel,
		priority: inquiry.priority,
		assigneeId: inquiry.assigneeId,
		assigneeName: inquiry.assigneeId,
		sentiment: inquiry.sentiment ?? undefined,
		slaStatus: getSlaStatus(inquiry),
		slaRemainingMinutes: getSlaRemainingMinutes(inquiry),
		unreadCount: inquiry.unreadCount ?? 0,
		createdAt: inquiry.createdAt,
		updatedAt: inquiry.updatedAt,
	};
};

const inquiryTableColumns =
	buildInquiryTableColumns<ReturnType<typeof mapInquiryRow>>();

const InquiriesPageContent = observer(function InquiriesPageContent({
	queryStates,
	setQueryStates,
	activeStatus,
	onClickInquiryRow,
	onClickStatusFilter,
}: {
	queryStates: ReturnType<typeof useMetaDataGridQueryStates>[0];
	setQueryStates: ReturnType<typeof useMetaDataGridQueryStates>[1];
	activeStatus?: string;
	onClickInquiryRow: (inquiryId: string) => void;
	onClickStatusFilter: (status: string | undefined) => void;
}) {
	const take = getNumberQueryValue(queryStates.take, 20);
	const skip = getNumberQueryValue(queryStates.skip, 0);
	const search = getSearchQueryValue(queryStates.search);
	const inquiryStatus = getInquiryStatusFilter(queryStates.inquiryStatus);

	const { data: inquiriesResponse } = useGetInquiriesSuspense({
		take,
		skip,
		search,
		inquiryStatus,
	});
	const { data: statsResponse } = useGetInquiryStatsSuspense();

	const inquiries = (inquiriesResponse?.data ?? []).map(mapInquiryRow);
	const stats: InquiryStats = {
		total: statsResponse?.data?.total ?? 0,
		newCount: statsResponse?.data?.new ?? 0,
		inProgress: statsResponse?.data?.inProgress ?? 0,
		resolved: statsResponse?.data?.resolved ?? 0,
		slaBreached: statsResponse?.data?.slaBreached ?? 0,
	};
	const totalCount = inquiriesResponse?.meta?.total ?? 0;

	const onClickInquiryGridRow = (inquiry: ReturnType<typeof mapInquiryRow>) => {
		onClickInquiryRow(inquiry.id);
	};

	return (
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
						data: inquiries,
						totalCount,
						isLoading: false,
						queryStates,
						setQueryStates,
						columns: inquiryTableColumns,
						leftInputs,
						onRowClick: onClickInquiryGridRow,
						emptyMessage: "표시할 문의가 없습니다.",
					}}
				/>
			</Surface>
		</VStack>
	);
});

function InquiriesPageShellFallback() {
	return (
		<div className="space-y-5">
			<Surface className="h-32 rounded-2xl border-divider/80 bg-content1/70">
				{null}
			</Surface>
		</div>
	);
}

const InquiriesContentFallback = observer(function InquiriesContentFallback({
	queryStates,
	setQueryStates,
	activeStatus,
	onClickStatusFilter,
}: {
	queryStates: ReturnType<typeof useMetaDataGridQueryStates>[0];
	setQueryStates: ReturnType<typeof useMetaDataGridQueryStates>[1];
	activeStatus?: string;
	onClickStatusFilter: (status: string | undefined) => void;
}) {
	return (
		<VStack gap={4}>
			<Surface className="rounded-2xl border-divider/80 bg-content1/70">
				<div className="mb-4 border-b border-divider/80 pb-4">
					<PageTitleBar level={2} title="문의 현황" />
				</div>
				<InquiryStatsCards
					stats={{
						total: 0,
						newCount: 0,
						inProgress: 0,
						resolved: 0,
						slaBreached: 0,
					}}
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
						data: [],
						totalCount: 0,
						isLoading: true,
						queryStates,
						setQueryStates,
						columns: inquiryTableColumns,
						leftInputs,
						emptyMessage: "표시할 문의가 없습니다.",
					}}
				/>
			</Surface>
		</VStack>
	);
});

const InquiriesPageInner = observer(function InquiriesPageInner() {
	const router = useRouter();
	const [queryStates, setQueryStates] = useMetaDataGridQueryStates(leftInputs);
	const handlers = useHandlers({ router, setQueryStates });
	const activeStatus =
		typeof queryStates.inquiryStatus === "string"
			? queryStates.inquiryStatus
			: undefined;

	return (
		<div className="space-y-5">
			<PageTitleBar
				title="문의 관리"
				description="고객 문의를 접수/처리/해결합니다."
				actions={
					<Button
						color="primary"
						startContent={<Plus className="size-4" />}
						onPress={handlers.onClickNewInquiry}
					>
						문의 접수
					</Button>
				}
			/>
			<Suspense
				fallback={
					<InquiriesContentFallback
						queryStates={queryStates}
						setQueryStates={setQueryStates}
						activeStatus={activeStatus}
						onClickStatusFilter={handlers.onClickStatusFilter}
					/>
				}
			>
				<InquiriesPageContent
					queryStates={queryStates}
					setQueryStates={setQueryStates}
					activeStatus={activeStatus}
					onClickInquiryRow={handlers.onClickInquiryRow}
					onClickStatusFilter={handlers.onClickStatusFilter}
				/>
			</Suspense>
		</div>
	);
});

export const AdminInquiriesPage = observer(function InquiriesPage() {
	return (
		<Suspense fallback={<InquiriesPageShellFallback />}>
			<InquiriesPageInner />
		</Suspense>
	);
});

export default AdminInquiriesPage;
