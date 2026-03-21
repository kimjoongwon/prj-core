"use client";

import {
	type InquiryDto,
	type InquiryStatus,
	useGetInquiriesSuspense,
	useGetInquiryStatsSuspense,
} from "@cocrepo/api/core/inquiries";
import type { InputConfig, MetaDataGridColumnConfig } from "@cocrepo/type";
import {
	DateTimeCell,
	InquiryAssigneeCell,
	InquiryCategoryCell,
	type InquiryCategoryCode,
	InquiryChannelCell,
	type InquiryChannelCode,
	InquiryPriorityCell,
	type InquiryPriorityCode,
	InquirySentimentCell,
	InquirySLACell,
	type InquiryStats,
	InquiryStatsCards,
	InquiryStatusCell,
	type InquiryStatusCode,
	InquiryUnreadCell,
	MetaDataGrid,
	PageTitleBar,
	ProfileAvatarCell,
	type SentimentTypeCode,
	type SLAStatus,
	useMetaDataGridQueryStates,
	VStack,
} from "@cocrepo/ui";
import { Button } from "@heroui/react";
import { Plus } from "lucide-react";
import { observer } from "mobx-react-lite";
import { useRouter } from "next/navigation";
import { Suspense } from "react";
import { useHandlers } from "./hooks/useHandlers";

interface InquiryRow {
	id: string;
	title: string;
	customerId: string;
	customerName: string;
	status: InquiryStatusCode;
	category: InquiryCategoryCode;
	channel: InquiryChannelCode;
	priority: InquiryPriorityCode;
	assigneeId?: string;
	assigneeName?: string;
	sentiment?: SentimentTypeCode;
	slaStatus?: SLAStatus;
	slaRemainingMinutes?: number;
	unreadCount: number;
	createdAt: string;
	updatedAt: string;
}

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

const columns: MetaDataGridColumnConfig<InquiryRow>[] = [
	{
		field: "customerName",
		label: "고객",
		size: 180,
		isRequired: true,
		cell: ({ row }) => (
			<ProfileAvatarCell
				name={row.original.customerName}
				subtitle={row.original.customerId}
			/>
		),
	},
	{
		field: "title",
		label: "제목",
		size: 260,
		isRequired: true,
		cell: ({ getValue }) => (
			<span className="line-clamp-2">{getValue() as string}</span>
		),
	},
	{
		field: "status",
		label: "상태",
		size: 130,
		align: "center",
		cell: ({ getValue }) => (
			<InquiryStatusCell value={getValue() as InquiryStatusCode} />
		),
	},
	{
		field: "category",
		label: "카테고리",
		size: 140,
		align: "center",
		cell: ({ getValue }) => (
			<InquiryCategoryCell value={getValue() as InquiryCategoryCode} />
		),
	},
	{
		field: "channel",
		label: "채널",
		size: 120,
		align: "center",
		cell: ({ getValue }) => (
			<InquiryChannelCell value={getValue() as InquiryChannelCode} />
		),
	},
	{
		field: "priority",
		label: "우선순위",
		size: 130,
		align: "center",
		cell: ({ getValue }) => (
			<InquiryPriorityCell value={getValue() as InquiryPriorityCode} />
		),
	},
	{
		field: "assigneeName",
		label: "담당자",
		size: 150,
		align: "center",
		cell: ({ row }) => <InquiryAssigneeCell name={row.original.assigneeName} />,
	},
	{
		field: "sentiment",
		label: "감성",
		size: 100,
		align: "center",
		cell: ({ getValue }) => (
			<InquirySentimentCell
				value={getValue() as SentimentTypeCode | undefined}
			/>
		),
	},
	{
		field: "slaStatus",
		label: "SLA",
		size: 120,
		align: "center",
		cell: ({ row }) => {
			const status = row.original.slaStatus;
			const remainingMinutes = row.original.slaRemainingMinutes;

			if (!status || remainingMinutes === undefined) {
				return <span className="text-default-400">-</span>;
			}

			return (
				<InquirySLACell status={status} remainingMinutes={remainingMinutes} />
			);
		},
	},
	{
		field: "unreadCount",
		label: "미확인",
		size: 100,
		align: "center",
		cell: ({ getValue }) => <InquiryUnreadCell count={getValue() as number} />,
	},
	{
		field: "createdAt",
		label: "접수일",
		size: 160,
		cell: ({ getValue }) => <DateTimeCell value={getValue() as string} />,
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

const mapInquiryRow = (inquiry: InquiryDto): InquiryRow => {
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

	const onClickInquiryGridRow = (inquiry: InquiryRow) => {
		onClickInquiryRow(inquiry.id);
	};

	return (
		<VStack gap={4}>
			<div className="rounded-2xl border border-divider/80 bg-content1/70 p-6">
				<div className="mb-4 border-b border-divider/80 pb-4">
					<PageTitleBar level={2} title="문의 현황" />
				</div>
				<InquiryStatsCards
					stats={stats}
					activeStatus={activeStatus}
					onStatusClick={onClickStatusFilter}
				/>
			</div>
			<div className="rounded-2xl border border-divider/80 bg-content1/70 p-6">
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
						columns,
						leftInputs,
						onRowClick: onClickInquiryGridRow,
						emptyMessage: "표시할 문의가 없습니다.",
					}}
				/>
			</div>
		</VStack>
	);
});

function InquiriesPageShellFallback() {
	return (
		<div className="space-y-5">
			<PageTitleBar
				title="문의 관리"
				description="고객 문의를 접수/처리/해결합니다."
			/>
			<div className="h-32 rounded-2xl border border-divider/80 bg-content1/70" />
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
			<div className="rounded-2xl border border-divider/80 bg-content1/70 p-6">
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
			</div>
			<div className="rounded-2xl border border-divider/80 bg-content1/70 p-6">
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
						columns,
						leftInputs,
						emptyMessage: "표시할 문의가 없습니다.",
					}}
				/>
			</div>
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

export default observer(function InquiriesPage() {
	return (
		<Suspense fallback={<InquiriesPageShellFallback />}>
			<InquiriesPageInner />
		</Suspense>
	);
});
