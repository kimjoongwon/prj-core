"use client";

import {
	type InquiryDto,
	useGetInquiries,
	useGetInquiryStats,
} from "@cocrepo/api";
import { ADMIN_PATHS } from "@cocrepo/constant";
import { useInquiryStore } from "@cocrepo/store";
import type { SLAStatus } from "@cocrepo/ui";
import {
	InquiryDataGrid,
	type InquiryRow,
	type InquiryStats,
	InquiryStatsCards,
	PageSurface,
	SectionSurface,
	VStack,
} from "@cocrepo/ui";
import { Button } from "@heroui/react";
import { Plus } from "lucide-react";
import { observer, useLocalObservable } from "mobx-react-lite";
import { useRouter, useSearchParams } from "next/navigation";
import { useHandlers } from "./hooks/useHandlers";

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

function InquiriesPageClient() {
	const router = useRouter();
	const searchParams = useSearchParams();
	const inquiryStore = useInquiryStore();

	// 로컬 상태 관리
	const state = useLocalObservable(() => ({
		page: Number(searchParams.get("page")) || 1,
		pageSize: 20,
		sortField: "createdAt",
		sortDirection: "desc" as "asc" | "desc",
		isLoading: false,
	}));

	// 핸들러
	const handlers = useHandlers({ state, inquiryStore, router, searchParams });

	const { data: inquiriesResponse, isLoading } = useGetInquiries({
		take: state.pageSize,
		skip: (state.page - 1) * state.pageSize,
		inquiryStatus:
			inquiryStore.filterStatus === "PENDING_CUSTOMER"
				? "WAITING_CUSTOMER"
				: (inquiryStore.filterStatus ?? undefined),
		category: inquiryStore.filterCategory as
			| "GENERAL"
			| "DELIVERY"
			| "PAYMENT"
			| "REFUND"
			| "PRODUCT"
			| "ACCOUNT"
			| "TECHNICAL"
			| "COMPLAINT"
			| "OTHER"
			| undefined,
		channel: inquiryStore.filterChannel as
			| "WEB"
			| "EMAIL"
			| "CHAT"
			| "SMS"
			| "PHONE"
			| "WALK_IN"
			| undefined,
		priority:
			inquiryStore.filterPriority === "MEDIUM"
				? "NORMAL"
				: (inquiryStore.filterPriority ?? undefined),
		search: inquiryStore.searchKeyword || undefined,
	});
	const { data: statsResponse } = useGetInquiryStats();

	const inquiries = (inquiriesResponse?.data ?? []).map(mapInquiryRow);
	const stats: InquiryStats = {
		total: statsResponse?.data?.total ?? 0,
		newCount: statsResponse?.data?.new ?? 0,
		inProgress: statsResponse?.data?.inProgress ?? 0,
		resolved: statsResponse?.data?.resolved ?? 0,
		slaBreached: statsResponse?.data?.slaBreached ?? 0,
	};
	const total = inquiriesResponse?.meta?.total ?? 0;
	state.isLoading = isLoading;

	return (
		<PageSurface
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
		>
			<VStack gap={4}>
				{/* 통계 카드 */}
				<SectionSurface>
					<InquiryStatsCards
						stats={stats}
						activeStatus={inquiryStore.filterStatus ?? undefined}
						onStatusClick={handlers.onClickStatusFilter}
					/>
				</SectionSurface>

				{/* 문의 목록 DataGrid */}
				<SectionSurface>
					<InquiryDataGrid
						data={inquiries}
						total={total}
						page={state.page}
						pageSize={state.pageSize}
						sortField={state.sortField}
						sortDirection={state.sortDirection}
						isLoading={state.isLoading}
						onRowClick={handlers.onClickInquiryRow}
						onPageChange={handlers.onPageChange}
						onSort={handlers.onSort}
						detailPathTemplate={ADMIN_PATHS.INQUIRIES_DETAIL}
					/>
				</SectionSurface>
			</VStack>
		</PageSurface>
	);
}

export default observer(InquiriesPageClient);
