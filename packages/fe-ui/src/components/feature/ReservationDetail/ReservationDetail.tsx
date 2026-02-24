"use client";

import { useReservationStore } from "@cocrepo/store";
import { Button, cn, Spinner, Chip } from "@heroui/react";
import { observer } from "mobx-react-lite";
import { useState, useEffect } from "react";
import { ArrowLeft, Pencil, X, Check } from "lucide-react";
import { VStack } from "../../ui/surfaces/VStack/VStack";
import { HStack } from "../../ui/surfaces/HStack/HStack";

/** 예약 상세 타입 */
export interface ReservationDetail {
	id: string;
	status: string;
	programId: string;
	userId: string;
	createdAt: string;
	updatedAt: string;
	// 추가 필드들
	userName?: string;
	userPhone?: string;
	date?: string;
	time?: string;
	location?: string;
	memo?: string;
}

export interface ReservationDetailProps {
	/** 예약 ID */
	reservationId: string;
	/** 예약 상세 데이터 */
	reservation?: ReservationDetail | null;
	/** 로딩 상태 */
	isLoading?: boolean;
	/** 확정 핸들러 */
	onConfirm?: (reservationId: string) => void;
	/** 취소 핸들러 */
	onCancel?: (reservationId: string) => void;
	/** 수정 핸들러 */
	onEdit?: (reservationId: string) => void;
	/** 뒤로가기 핸들러 */
	onBack?: () => void;
	/** 추가 CSS 클래스 */
	className?: string;
}

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

/** 상태별 액션 버튼 노출 여부 */
const canShowActions = (status: string): { canConfirm: boolean; canCancel: boolean } => {
	switch (status) {
		case "PENDING":
			return { canConfirm: true, canCancel: true };
		case "CONFIRMED":
			return { canConfirm: false, canCancel: true };
		case "CANCELLED":
			return { canConfirm: false, canCancel: false };
		default:
			return { canConfirm: false, canCancel: false };
	}
};

/**
 * ReservationDetail Feature 컴포넌트
 *
 * 단일 예약 상세 정보를 조회하고 상태 변경/수정하는 비즈니스 로직 담당
 *
 * **컴포넌트 계층:**
 * - UI: Button, Chip, VStack, HStack
 * - Feature: ReservationDetail (Store 연결, 상태 변경)
 *
 * @example
 * ```tsx
 * <ReservationDetail
 *   reservationId="reservation-1"
 *   reservation={reservationData}
 *   onConfirm={handleConfirm}
 *   onCancel={handleCancel}
 *   onEdit={handleEdit}
 *   onBack={handleBack}
 * />
 * ```
 */
export const ReservationDetail = observer(
	({
		reservationId,
		reservation,
		isLoading = false,
		onConfirm,
		onCancel,
		onEdit,
		onBack,
		className,
	}: ReservationDetailProps) => {
		const reservationStore = useReservationStore();

		// 취소 확인 모달 상태
		const [showCancelConfirm, setShowCancelConfirm] = useState(false);

		/**
		 * 확정 처리
		 */
		const handleConfirm = () => {
			onConfirm?.(reservationId);
		};

		/**
		 * 취소 요청
		 */
		const handleCancelClick = () => {
			setShowCancelConfirm(true);
		};

		/**
		 * 취소 확인
		 */
		const handleCancelConfirm = () => {
			onCancel?.(reservationId);
			setShowCancelConfirm(false);
		};

		/**
		 * 취소 취소
		 */
		const handleCancelDismiss = () => {
			setShowCancelConfirm(false);
		};

		/**
		 * 수정 페이지 이동
		 */
		const handleEdit = () => {
			onEdit?.(reservationId);
		};

		/**
		 * 뒤로가기
		 */
		const handleBack = () => {
			reservationStore.clearSelection();
			onBack?.();
		};

		// 액션 버튼 노출 여부
		const { canConfirm, canCancel } = reservation
			? canShowActions(reservation.status)
			: { canConfirm: false, canCancel: false };

		return (
			<VStack className={cn("h-full", className)} gap={4}>
				{/* 뒤로가기 버튼 */}
				{onBack && (
					<Button
						variant="ghost"
						startContent={<ArrowLeft className="size-4" />}
						onPress={handleBack}
					>
						목록으로
					</Button>
				)}

				{isLoading ? (
					<VStack className="flex-1" alignItems="center" justifyContent="center" gap={2}>
						<Spinner size="lg" />
						<span className="text-sm text-foreground/60">불러오는 중...</span>
					</VStack>
				) : !reservation ? (
					<VStack className="flex-1" alignItems="center" justifyContent="center" gap={2}>
						<span className="text-foreground/60">예약 정보를 찾을 수 없습니다.</span>
					</VStack>
				) : (
					<>
						{/* 예약 정보 카드 */}
						<div className="rounded-xl border border-divider bg-content1 p-6">
							<VStack gap={4}>
								{/* 헤더: 예약번호 + 상태 */}
								<HStack fullWidth justifyContent="between" alignItems="center">
									<HStack gap={2} alignItems="center">
										<span className="text-sm text-foreground/60">예약번호:</span>
										<span className="font-semibold">#{reservation.id.slice(-6)}</span>
									</HStack>
									<Chip color={getStatusColor(reservation.status)} variant="flat">
										{getStatusText(reservation.status)}
									</Chip>
								</HStack>

								{/* 구분선 */}
								<div className="h-px w-full bg-divider" />

								{/* 상세 정보 */}
								<VStack gap={3}>
									<HStack gap={4}>
										<span className="w-20 text-sm text-foreground/60">예약자:</span>
										<span className="text-sm">{reservation.userName || reservation.userId}</span>
									</HStack>
									{reservation.userPhone && (
										<HStack gap={4}>
											<span className="w-20 text-sm text-foreground/60">연락처:</span>
											<span className="text-sm">{reservation.userPhone}</span>
										</HStack>
									)}
									{reservation.date && (
										<HStack gap={4}>
											<span className="w-20 text-sm text-foreground/60">날짜:</span>
											<span className="text-sm">{reservation.date}</span>
										</HStack>
									)}
									{reservation.time && (
										<HStack gap={4}>
											<span className="w-20 text-sm text-foreground/60">시간:</span>
											<span className="text-sm">{reservation.time}</span>
										</HStack>
									)}
									{reservation.location && (
										<HStack gap={4}>
											<span className="w-20 text-sm text-foreground/60">장소:</span>
											<span className="text-sm">{reservation.location}</span>
										</HStack>
									)}
									{reservation.memo && (
										<HStack gap={4} alignItems="start">
											<span className="w-20 text-sm text-foreground/60">메모:</span>
											<span className="text-sm">{reservation.memo}</span>
										</HStack>
									)}
								</VStack>

								{/* 생성/수정 일시 */}
								<div className="mt-2 flex gap-4 text-xs text-foreground/40">
									<span>생성: {new Date(reservation.createdAt).toLocaleString("ko-KR")}</span>
									<span>수정: {new Date(reservation.updatedAt).toLocaleString("ko-KR")}</span>
								</div>
							</VStack>
						</div>

						{/* 액션 버튼 */}
						<div className="rounded-xl border border-divider bg-content1 p-4">
							<HStack fullWidth justifyContent="center" gap={2}>
								{canCancel && (
									<Button
										color="danger"
										variant="flat"
										startContent={<X className="size-4" />}
										onPress={handleCancelClick}
									>
										취소하기
									</Button>
								)}
								{onEdit && reservation.status !== "CANCELLED" && (
									<Button
										variant="flat"
										startContent={<Pencil className="size-4" />}
										onPress={handleEdit}
									>
										수정
									</Button>
								)}
								{canConfirm && (
									<Button
										color="primary"
										startContent={<Check className="size-4" />}
										onPress={handleConfirm}
									>
										확정
									</Button>
								)}
							</HStack>
						</div>

						{/* 취소 확인 모달 */}
						{showCancelConfirm && (
							<div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50">
								<div className="w-full max-w-sm rounded-xl bg-content1 p-6 shadow-lg">
									<VStack gap={4}>
										<h3 className="text-lg font-semibold">예약 취소</h3>
										<p className="text-sm text-foreground/60">
											정말로 이 예약을 취소하시겠습니까?
										</p>
										<HStack fullWidth justifyContent="end" gap={2}>
											<Button variant="flat" onPress={handleCancelDismiss}>
												아니오
											</Button>
											<Button color="danger" onPress={handleCancelConfirm}>
												예, 취소합니다
											</Button>
										</HStack>
									</VStack>
								</div>
							</div>
						)}
					</>
				)}
			</VStack>
		);
	},
);

ReservationDetail.displayName = "ReservationDetail";
