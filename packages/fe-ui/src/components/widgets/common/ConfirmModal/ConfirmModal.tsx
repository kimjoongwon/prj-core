"use client";

import {
	Button,
	Modal,
	ModalBody,
	ModalContent,
	ModalFooter,
	ModalHeader,
} from "@heroui/react";
import { AlertTriangle, Info, Trash2 } from "lucide-react";
import { observer } from "mobx-react-lite";
import type { ReactNode } from "react";
import { HStack } from "../../../layouts/HStack/HStack";
import { VStack } from "../../../layouts/VStack/VStack";

/**
 * ConfirmModal Props
 */
export interface ConfirmModalProps {
	/** 모달 열림 상태 */
	isOpen: boolean;
	/** 모달 닫기 핸들러 */
	onClose: () => void;
	/** 확인 버튼 클릭 핸들러 */
	onConfirm: () => void;
	/** 모달 제목 */
	title: string;
	/** 모달 메시지 (텍스트 또는 JSX) */
	message: ReactNode;
	/** 확인 버튼 텍스트 */
	confirmText?: string;
	/** 취소 버튼 텍스트 */
	cancelText?: string;
	/** 확인 버튼 색상 */
	confirmColor?: "primary" | "danger" | "warning" | "success";
	/** 로딩 상태 */
	loading?: boolean;
	/** 아이콘 타입 */
	iconType?: "delete" | "warning" | "info" | "none";
}

/**
 * 아이콘 타입에 따른 아이콘 렌더링
 */
const renderIcon = (iconType: ConfirmModalProps["iconType"]) => {
	switch (iconType) {
		case "delete":
			return (
				<div className="flex h-12 w-12 items-center justify-center rounded-full bg-danger/10">
					<Trash2 className="h-6 w-6 text-danger" />
				</div>
			);
		case "warning":
			return (
				<div className="flex h-12 w-12 items-center justify-center rounded-full bg-warning/10">
					<AlertTriangle className="h-6 w-6 text-warning" />
				</div>
			);
		case "info":
			return (
				<div className="flex h-12 w-12 items-center justify-center rounded-full bg-primary/10">
					<Info className="h-6 w-6 text-primary" />
				</div>
			);
		default:
			return null;
	}
};

/**
 * ConfirmModal Widget 컴포넌트
 *
 * 사용자에게 확인을 요청하는 범용 모달 위젯입니다.
 * 삭제 확인, 경고, 정보 등 다양한 상황에서 사용할 수 있습니다.
 *
 * **이 컴포넌트는 Store에 접근하지 않습니다.**
 * 모든 데이터와 핸들러는 props로 전달받습니다.
 *
 * @example
 * ```tsx
 * // 삭제 확인
 * <ConfirmModal
 *   isOpen={isDeleteModalOpen}
 *   onClose={handleCloseDeleteModal}
 *   onConfirm={handleDelete}
 *   title="역할 삭제"
 *   message="이 역할을 삭제하시겠습니까? 이 작업은 취소할 수 없습니다."
 *   confirmText="삭제"
 *   confirmColor="danger"
 *   iconType="delete"
 * />
 *
 * // 경고
 * <ConfirmModal
 *   isOpen={isWarningModalOpen}
 *   onClose={handleCloseWarningModal}
 *   onConfirm={handleConfirm}
 *   title="주의"
 *   message="변경사항이 저장되지 않았습니다. 계속하시겠습니까?"
 *   confirmText="계속"
 *   confirmColor="warning"
 *   iconType="warning"
 * />
 * ```
 */
export const ConfirmModal = observer(
	({
		isOpen,
		onClose,
		onConfirm,
		title,
		message,
		confirmText = "확인",
		cancelText = "취소",
		confirmColor = "primary",
		loading = false,
		iconType = "none",
	}: ConfirmModalProps) => {
		const icon = renderIcon(iconType);

		return (
			<Modal isOpen={isOpen} onClose={onClose} size="sm">
				<ModalContent>
					<ModalHeader className="flex flex-col gap-1">{title}</ModalHeader>
					<ModalBody>
						<VStack gap={4} alignItems="center">
							{icon}
							<div className="text-center text-default-600">{message}</div>
						</VStack>
					</ModalBody>
					<ModalFooter>
						<HStack gap={8} justifyContent="end" fullWidth>
							<Button variant="flat" onPress={onClose} isDisabled={loading}>
								{cancelText}
							</Button>
							<Button
								color={confirmColor}
								onPress={onConfirm}
								isLoading={loading}
							>
								{confirmText}
							</Button>
						</HStack>
					</ModalFooter>
				</ModalContent>
			</Modal>
		);
	},
);

ConfirmModal.displayName = "ConfirmModal";
