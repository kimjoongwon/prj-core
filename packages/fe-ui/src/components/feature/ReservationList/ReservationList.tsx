"use client";

import { useReservationStore, type ReservationFilters } from "@cocrepo/store";
import { Button, cn, Spinner, Chip } from "@heroui/react";
import { observer } from "mobx-react-lite";
import { useState, useEffect } from "react";
import { RefreshCw, Search, ChevronLeft, ChevronRight } from "lucide-react";
import { VStack } from "../../ui/surfaces/VStack/VStack";
import { HStack } from "../../ui/surfaces/HStack/HStack";
import { Input } from "../../inputs/Input/Input";
import { Select } from "../../inputs/Select/Select";

/** 예약 타입 */
export interface Reservation {
	id: string;
	status: string;
	programId: string;
	userId: string;
	createdAt: string;
	updatedAt: string;
}

export interface ReservationListProps {
	/** 스페이스 ID */
	spaceId: string;
	/** 초기 페이지 크기 */
	initialPageSize?: number;
	/** 예약 목록 데이터 */
	reservations?: Reservation[];
	/** 로딩 상태 */
	isLoading?: boolean;
	/** 총 항목 수 */
	totalCount?: number;
	/** 행 선택 핸들러 */
	onSelect?: (reservationId: string) => void;
	/** 새로고침 핸들러 */
	onRefresh?: () => void;
	/** 필터 변경 핸들러 */
	onFilterChange?: (filters: ReservationFilters) => void;
	/** 페이지 변경 핸들러 */
	onPageChange?: (page: number) => void;
	/** 추가 CSS 클래스 */
	className?: string;
}

/** 예약 상태 옵션 */
const STATUS_OPTIONS = [
	{ value: "", text: "전체" },
	{ value: "PENDING", text: "대기중" },
	{ value: "CONFIRMED", text: "확정" },
	{ value: "CANCELLED", text: "취소" },
];

/** 상태별 칩 색상 */
const getStatusColor = (status: string): "warning" | "success" | "danger" | "default" => {
	switch (status) {
		case "PENDING":
			return "warning";
		case "CONFIRMED":
			return "success";
		case "CANCELLED":
			return "danger";
		default:
			return "default";
	}
};

/** 상태별 텍스트 */
const getStatusText = (status: string): string => {
	switch (status) {
		case "PENDING":
			return "대기중";
		case "CONFIRMED":
			return "확정";
		case "CANCELLED":
			return "취소";
		default:
			return status;
	}
};

/**
 * ReservationList Feature 컴포넌트
 *
 * 예약 목록 데이터를 조회하고 표시하는 비즈니스 로직 담당
 *
 * **컴포넌트 계층:**
 * - UI: Input, Select, Button, Chip
 * - Feature: ReservationList (Store 연결, 필터/페이지네이션)
 *
 * @example
 * ```tsx
 * <ReservationList
 *   spaceId="space-1"
 *   reservations={reservationData}
 *   onSelect={handleSelect}
 *   onRefresh={handleRefresh}
 * />
 * ```
 */
export const ReservationList = observer(
	({
		spaceId,
		initialPageSize = 10,
		reservations = [],
		isLoading = false,
		totalCount = 0,
		onSelect,
		onRefresh,
		onFilterChange,
		onPageChange,
		className,
	}: ReservationListProps) => {
		const reservationStore = useReservationStore();

		// 로컬 상태
		const [page, setPage] = useState(1);
		const [searchKeyword, setSearchKeyword] = useState("");
		const [statusFilter, setStatusFilter] = useState("");
		const pageSize = initialPageSize;

		// Store 상태
		const { filters, selectedId } = reservationStore;

		// 총 페이지 수
		const totalPages = Math.ceil(totalCount / pageSize);

		/**
		 * 상태 필터 변경
		 */
		const handleStatusChange = (value: string | number) => {
			const stringValue = String(value);
			setStatusFilter(stringValue);
			const newFilters: ReservationFilters = { ...filters, status: stringValue || undefined };
			reservationStore.setFilters(newFilters);
			onFilterChange?.(newFilters);
			setPage(1);
		};

		/**
		 * 검색어 변경
		 */
		const handleSearchChange = (value: string | number) => {
			setSearchKeyword(String(value));
		};

		/**
		 * 검색 실행
		 */
		const handleSearch = () => {
			const newFilters: ReservationFilters = { ...filters };
			if (searchKeyword) {
				newFilters.userId = searchKeyword;
			} else {
				delete newFilters.userId;
			}
			reservationStore.setFilters(newFilters);
			onFilterChange?.(newFilters);
			setPage(1);
		};

		/**
		 * 새로고침
		 */
		const handleRefresh = () => {
			onRefresh?.();
		};

		/**
		 * 행 선택
		 */
		const handleRowClick = (reservation: Reservation) => {
			reservationStore.setSelectedId(reservation.id);
			onSelect?.(reservation.id);
		};

		/**
		 * 이전 페이지
		 */
		const handlePrevPage = () => {
			if (page > 1) {
				const newPage = page - 1;
				setPage(newPage);
				onPageChange?.(newPage);
			}
		};

		/**
		 * 다음 페이지
		 */
		const handleNextPage = () => {
			if (page < totalPages) {
				const newPage = page + 1;
				setPage(newPage);
				onPageChange?.(newPage);
			}
		};

		return (
			<VStack className={cn("h-full", className)} gap={4}>
				{/* 필터 영역 */}
				<HStack className="gap-4" fullWidth alignItems="end">
					<div className="w-40">
						<Select
							label="상태"
							placeholder="상태 선택"
							value={statusFilter}
							onChange={handleStatusChange}
							options={STATUS_OPTIONS}
						/>
					</div>
					<div className="flex-1">
						<Input
							placeholder="검색어 입력"
							value={searchKeyword}
							onChange={handleSearchChange}
							onKeyDown={(e) => e.key === "Enter" && handleSearch()}
							endContent={
								<button type="button" onClick={handleSearch}>
									<Search className="size-4 text-foreground/50" />
								</button>
							}
						/>
					</div>
				</HStack>

				{/* 테이블 영역 */}
				<div className="flex-1 overflow-auto rounded-xl border border-divider bg-content1">
					<table className="w-full">
						<thead>
							<tr className="border-b border-divider bg-content2">
								<th className="px-4 py-3 text-left text-sm font-medium">예약번호</th>
								<th className="px-4 py-3 text-left text-sm font-medium">예약자</th>
								<th className="px-4 py-3 text-left text-sm font-medium">날짜/시간</th>
								<th className="px-4 py-3 text-left text-sm font-medium">상태</th>
								<th className="px-4 py-3 text-center text-sm font-medium">액션</th>
							</tr>
						</thead>
						<tbody>
							{isLoading ? (
								<tr>
									<td colSpan={5} className="px-4 py-12 text-center">
										<VStack alignItems="center" gap={2}>
											<Spinner size="lg" />
											<span className="text-sm text-foreground/60">불러오는 중...</span>
										</VStack>
									</td>
								</tr>
							) : reservations.length === 0 ? (
								<tr>
									<td colSpan={5} className="px-4 py-12 text-center">
										<span className="text-foreground/60">예약 내역이 없습니다.</span>
									</td>
								</tr>
							) : (
								reservations.map((reservation) => (
									<tr
										key={reservation.id}
										onClick={() => handleRowClick(reservation)}
										className={cn(
											"cursor-pointer border-b border-divider transition-colors hover:bg-content2",
											selectedId === reservation.id && "bg-primary/10",
										)}
									>
										<td className="px-4 py-3 text-sm">#{reservation.id.slice(-6)}</td>
										<td className="px-4 py-3 text-sm">{reservation.userId}</td>
										<td className="px-4 py-3 text-sm">
											{new Date(reservation.createdAt).toLocaleDateString("ko-KR")}
										</td>
										<td className="px-4 py-3">
											<Chip size="sm" color={getStatusColor(reservation.status)} variant="flat">
												{getStatusText(reservation.status)}
											</Chip>
										</td>
										<td className="px-4 py-3 text-center">
											<Button size="sm" variant="flat" onPress={() => handleRowClick(reservation)}>
												보기
											</Button>
										</td>
									</tr>
								))
							)}
						</tbody>
					</table>
				</div>

				{/* 페이지네이션 & 새로고침 */}
				<HStack fullWidth justifyContent="between" alignItems="center">
					<HStack gap={2}>
						<Button
							isIconOnly
							size="sm"
							variant="flat"
							isDisabled={page <= 1}
							onPress={handlePrevPage}
						>
							<ChevronLeft className="size-4" />
						</Button>
						<span className="text-sm">
							{page} / {totalPages || 1}
						</span>
						<Button
							isIconOnly
							size="sm"
							variant="flat"
							isDisabled={page >= totalPages}
							onPress={handleNextPage}
						>
							<ChevronRight className="size-4" />
						</Button>
						<span className="text-sm text-foreground/60">(총 {totalCount}개)</span>
					</HStack>

					<Button
						size="sm"
						variant="flat"
						startContent={<RefreshCw className="size-4" />}
						onPress={handleRefresh}
					>
						새로고침
					</Button>
				</HStack>
			</VStack>
		);
	},
);

ReservationList.displayName = "ReservationList";
