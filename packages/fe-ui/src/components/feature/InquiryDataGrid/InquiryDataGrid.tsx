"use client";

import { Table, TableHeader, TableBody, TableColumn, TableRow, TableCell, SortDescriptor, Card, CardBody, Spinner } from "@heroui/react";
import { observer } from "mobx-react-lite";
import { useRouter } from "next/navigation";
import { useInquiryStore } from "@cocrepo/store";
import { ADMIN_PATHS } from "@cocrepo/constant";
import type { InquiryCategory, InquiryChannel, InquiryPriority } from "@cocrepo/enum";
import {
	InquiryStatusCell,
	InquiryCategoryCell,
	InquiryChannelCell,
	InquiryPriorityCell,
	InquiryAssigneeCell,
	InquirySentimentCell,
	InquirySLACell,
	InquiryUnreadCell,
	DateTimeCell,
	ProfileAvatarCell,
	type SLAStatus,
	type InquiryStatusCode,
	type InquiryCategoryCode,
	type InquiryChannelCode,
	type InquiryPriorityCode,
	type SentimentTypeCode,
} from "../../ui/data-display/cells";
import { Pagination } from "../../inputs/Pagination/Pagination";

export interface InquiryRow {
	/** 문의 ID */
	id: string;
	/** 제목 */
	title: string;
	/** 고객 ID */
	customerId: string;
	/** 고객명 */
	customerName: string;
	/** 고객 프로필 이미지 */
	customerAvatarUrl?: string;
	/** 상태 */
	status: InquiryStatusCode;
	/** 카테고리 */
	category: InquiryCategoryCode;
	/** 채널 */
	channel: InquiryChannelCode;
	/** 우선순위 */
	priority: InquiryPriorityCode;
	/** 담당자 ID */
	assigneeId?: string;
	/** 담당자명 */
	assigneeName?: string;
	/** 담당자 프로필 이미지 */
	assigneeAvatarUrl?: string;
	/** 감성 분석 결과 */
	sentiment?: SentimentTypeCode;
	/** SLA 상태 */
	slaStatus?: SLAStatus;
	/** SLA 남은 시간 (분) */
	slaRemainingMinutes?: number;
	/** 읽지 않은 메시지 수 */
	unreadCount: number;
	/** 생성일 */
	createdAt: string;
	/** 수정일 */
	updatedAt: string;
}

export interface InquiryDataGridProps {
	/** 문의 목록 데이터 */
	data: InquiryRow[];
	/** 로딩 상태 */
	isLoading?: boolean;
	/** 전체 개수 */
	total: number;
	/** 현재 페이지 (1부터 시작) */
	page?: number;
	/** 페이지당 항목 수 */
	pageSize?: number;
	/** 정렬 필드 */
	sortField?: string;
	/** 정렬 방향 */
	sortDirection?: "asc" | "desc";
	/** 행 클릭 핸들러 */
	onRowClick?: (inquiry: InquiryRow) => void;
	/** 페이지 변경 핸들러 */
	onPageChange?: (page: number) => void;
	/** 정렬 변경 핸들러 */
	onSort?: (field: string, direction: "asc" | "desc") => void;
	/** 상세 경로 템플릿 */
	detailPathTemplate?: string;
	/** 추가 CSS 클래스 */
	className?: string;
}

const COLUMNS = [
	{ key: "customer", label: "고객", width: 150 },
	{ key: "title", label: "제목", width: 200 },
	{ key: "status", label: "상태", width: 100 },
	{ key: "category", label: "카테고리", width: 100 },
	{ key: "channel", label: "채널", width: 80 },
	{ key: "priority", label: "우선순위", width: 90 },
	{ key: "assignee", label: "담당자", width: 120 },
	{ key: "sentiment", label: "감성", width: 70 },
	{ key: "sla", label: "SLA", width: 100 },
	{ key: "unread", label: "미확인", width: 70 },
	{ key: "createdAt", label: "접수일", width: 140 },
];

/**
 * InquiryDataGrid 컴포넌트
 * 문의 목록을 표시하는 DataGrid로 정렬, 필터, 행 클릭 시 상세 이동 기능을 제공합니다.
 *
 * @example
 * ```tsx
 * <InquiryDataGrid
 *   data={inquiries}
 *   total={100}
 *   page={1}
 *   pageSize={20}
 *   isLoading={isLoading}
 *   onRowClick={(inquiry) => router.push(`/inquiries/${inquiry.id}`)}
 *   onPageChange={handlePageChange}
 * />
 * ```
 */
export const InquiryDataGrid = observer(
	({
		data,
		isLoading = false,
		total,
		page = 1,
		pageSize = 20,
		sortField,
		sortDirection = "desc",
		onRowClick,
		onPageChange,
		onSort,
		detailPathTemplate,
		className = "",
	}: InquiryDataGridProps) => {
		const router = useRouter();
		const store = useInquiryStore();

		// 정렬 가능한 컬럼
		const sortableColumns = ["status", "priority", "createdAt", "updatedAt"];

		const handleSort = (columnKey: string) => {
			if (!sortableColumns.includes(columnKey)) return;

			const newDirection =
				sortField === columnKey && sortDirection === "asc" ? "desc" : "asc";
			onSort?.(columnKey, newDirection);
		};

		const handleRowClick = (inquiry: InquiryRow) => {
			// Store에 선택된 문의 설정
			store.selectInquiry(inquiry.id);

			if (onRowClick) {
				onRowClick(inquiry);
			} else if (detailPathTemplate) {
				const path = detailPathTemplate.replace("[inquiryId]", inquiry.id);
				router.push(path);
			} else {
				// 기본 경로 사용
				router.push(ADMIN_PATHS.INQUIRIES_DETAIL.replace("[inquiryId]", inquiry.id));
			}
		};

		// SortDescriptor 생성
		const sortDescriptor: SortDescriptor | undefined = sortField
			? {
					column: sortField,
					direction: sortDirection === "asc" ? "ascending" : "descending",
				}
			: undefined;

		return (
			<Card className={className} shadow="sm">
				<CardBody className="p-0">
					<Table
						aria-label="문의 목록"
						removeWrapper
						selectionMode="none"
						sortDescriptor={sortDescriptor}
						onSortChange={(descriptor) => {
							if (descriptor.column) {
								const direction = descriptor.direction === "ascending" ? "asc" : "desc";
								onSort?.(descriptor.column as string, direction);
							}
						}}
						classNames={{
							th: "bg-content1 text-default-500",
							tr: "cursor-pointer hover:bg-content2",
						}}
					>
						<TableHeader>
							{COLUMNS.map((column) => (
								<TableColumn
									key={column.key}
									allowsSorting={sortableColumns.includes(column.key)}
									width={column.width}
								>
									{column.label}
								</TableColumn>
							))}
						</TableHeader>
						<TableBody
							items={data}
							isLoading={isLoading}
							loadingContent={
								<div className="flex items-center justify-center py-8">
									<Spinner size="lg" />
								</div>
							}
							emptyContent={
								<div className="py-8 text-center text-default-500">
									표시할 문의가 없습니다
								</div>
							}
						>
							{(item) => (
								<TableRow key={item.id} onClick={() => handleRowClick(item)}>
									<TableCell>
										<ProfileAvatarCell
											name={item.customerName}
											src={item.customerAvatarUrl}
											subtitle={item.customerId}
										/>
									</TableCell>
									<TableCell>
										<span className="line-clamp-2 text-sm">{item.title}</span>
									</TableCell>
									<TableCell>
										<InquiryStatusCell value={item.status} />
									</TableCell>
									<TableCell>
										<InquiryCategoryCell value={item.category} />
									</TableCell>
									<TableCell>
										<InquiryChannelCell value={item.channel} />
									</TableCell>
									<TableCell>
										<InquiryPriorityCell value={item.priority} />
									</TableCell>
									<TableCell>
										{item.assigneeName ? (
											<ProfileAvatarCell
												name={item.assigneeName}
												src={item.assigneeAvatarUrl}
											/>
										) : (
											<span className="text-xs text-default-400">미배정</span>
										)}
									</TableCell>
									<TableCell>
										{item.sentiment && (
											<InquirySentimentCell value={item.sentiment} />
										)}
									</TableCell>
									<TableCell>
										{item.slaStatus && item.slaRemainingMinutes !== undefined && (
											<InquirySLACell
												status={item.slaStatus}
												remainingMinutes={item.slaRemainingMinutes}
											/>
										)}
									</TableCell>
									<TableCell>
										<InquiryUnreadCell count={item.unreadCount} />
									</TableCell>
									<TableCell>
										<DateTimeCell value={item.createdAt} />
									</TableCell>
								</TableRow>
							)}
						</TableBody>
					</Table>

					{/* 페이지네이션 */}
					{total > pageSize && (
						<div className="flex justify-center py-4">
							<Pagination
								totalCount={total}
								limit={pageSize}
								page={page}
								onChange={onPageChange}
							/>
						</div>
					)}
				</CardBody>
			</Card>
		);
	},
);

InquiryDataGrid.displayName = "InquiryDataGrid";
