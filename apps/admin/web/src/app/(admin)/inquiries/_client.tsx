"use client";

import { observer, useLocalObservable } from "mobx-react-lite";
import { useRouter, useSearchParams } from "next/navigation";
import { useInquiryStore } from "@cocrepo/store";
import {
	PageSurface,
	SectionSurface,
	VStack,
	InquiryDataGrid,
	InquiryStatsCards,
	type InquiryRow,
	type InquiryStats,
} from "@cocrepo/ui";
import { Plus } from "lucide-react";
import { Button } from "@heroui/react";
import { ADMIN_PATHS } from "@cocrepo/constant";
import { useHandlers } from "./hooks/useHandlers";

// TODO: Orval 훅 생성 후 아래 import 추가
// import { useGetInquiries, useGetInquiryStats } from "@cocrepo/api";
// import type { InquiryDto, InquiryStatsDto } from "@cocrepo/api";

/**
 * Mock 데이터 (API 훅 생성 전까지 사용)
 *
 * @requires Orval API 훅 생성 후 제거 필요
 */
const mockInquiries: InquiryRow[] = [
	{
		id: "inq-001",
		title: "배송 문의 - 언제 도착하나요?",
		customerId: "user-001",
		customerName: "홍길동",
		status: "IN_PROGRESS",
		category: "DELIVERY",
		channel: "CHAT",
		priority: "HIGH",
		assigneeId: "agent-001",
		assigneeName: "김상담",
		sentiment: "NEGATIVE",
		slaStatus: "WARNING",
		slaRemainingMinutes: 30,
		unreadCount: 3,
		createdAt: "2026-02-26T14:30:00Z",
		updatedAt: "2026-02-26T15:00:00Z",
	},
	{
		id: "inq-002",
		title: "결제 오류 문의",
		customerId: "user-002",
		customerName: "이영희",
		status: "NEW",
		category: "PAYMENT",
		channel: "EMAIL",
		priority: "URGENT",
		sentiment: "NEGATIVE",
		slaStatus: "BREACH",
		slaRemainingMinutes: -10,
		unreadCount: 0,
		createdAt: "2026-02-26T13:15:00Z",
		updatedAt: "2026-02-26T13:15:00Z",
	},
	{
		id: "inq-003",
		title: "환불 요청",
		customerId: "user-003",
		customerName: "박철수",
		status: "NEW",
		category: "REFUND",
		channel: "WEB",
		priority: "MEDIUM",
		sentiment: "NEUTRAL",
		unreadCount: 0,
		createdAt: "2026-02-26T12:00:00Z",
		updatedAt: "2026-02-26T12:00:00Z",
	},
	{
		id: "inq-004",
		title: "이용 문의",
		customerId: "user-004",
		customerName: "최수진",
		status: "RESOLVED",
		category: "GENERAL",
		channel: "PHONE",
		priority: "LOW",
		assigneeId: "agent-002",
		assigneeName: "박상담",
		sentiment: "POSITIVE",
		unreadCount: 0,
		createdAt: "2026-02-24T18:45:00Z",
		updatedAt: "2026-02-25T10:00:00Z",
	},
];

const mockStats: InquiryStats = {
	total: 150,
	newCount: 12,
	inProgress: 45,
	resolved: 89,
	slaBreached: 4,
};

/**
 * 문의 목록 페이지 - 클라이언트 컴포넌트
 *
 * @requires Orval API 훅 생성 후 아래와 같이 변경:
 * 1. useGetInquiries 훅 호출
 * 2. useGetInquiryStats 훅 호출
 * 3. response?.data로 데이터 접근
 * 4. mock 데이터 제거
 */
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

	// TODO: Orval 훅 생성 후 아래 주석 해제 및 mock 데이터 제거
	// // 문의 목록 조회
	// const { data: inquiriesResponse, isLoading: isLoadingInquiries } = useGetInquiries({
	// 	take: state.pageSize,
	// 	skip: (state.page - 1) * state.pageSize,
	// 	status: inquiryStore.filterStatus || undefined,
	// 	category: inquiryStore.filterCategory || undefined,
	// 	channel: inquiryStore.filterChannel || undefined,
	// 	priority: inquiryStore.filterPriority || undefined,
	// 	search: inquiryStore.searchKeyword || undefined,
	// });
	//
	// // 문의 통계 조회
	// const { data: statsResponse } = useGetInquiryStats();
	//
	// // 데이터 추출
	// const inquiries: InquiryRow[] = inquiriesResponse?.data ?? [];
	// const stats: InquiryStats = statsResponse?.data ?? mockStats;
	// const total = inquiriesResponse?.meta?.total ?? 0;
	// state.isLoading = isLoadingInquiries;

	// Mock 데이터 사용 (API 훅 생성 전까지)
	const inquiries = mockInquiries;
	const stats = mockStats;
	const total = mockStats.total;

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
