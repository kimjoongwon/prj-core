"use client";

import {
	Button,
	Modal,
	ModalBody,
	ModalContent,
	ModalFooter,
	ModalHeader,
	Textarea,
} from "@heroui/react";
import { observer } from "mobx-react-lite";
import { useEffect, useState } from "react";
import { Input } from "../../../inputs/Input/Input";
import { HStack } from "../../../layouts/HStack/HStack";
import { VStack } from "../../../layouts/VStack/VStack";

/**
 * 역할 폼 데이터 타입
 */
export interface RoleFormData {
	/** 역할 식별자 (영문 대문자, 언더스코어만 허용) */
	name: string;
	/** 표시명 */
	displayName: string;
	/** 설명 (선택) */
	description?: string;
}

/**
 * RoleFormModal Props
 */
export interface RoleFormModalProps {
	/** 모달 열림 상태 */
	isOpen: boolean;
	/** 모달 닫기 핸들러 */
	onClose: () => void;
	/** 폼 제출 핸들러 */
	onSubmit: (data: RoleFormData) => void;
	/** 수정 모드 시 초기 데이터 */
	initialData?: Partial<RoleFormData>;
	/** 로딩 상태 */
	loading?: boolean;
	/** 모드 (생성/수정) */
	mode: "create" | "edit";
}

/**
 * 기본 폼 데이터
 */
const DEFAULT_FORM_DATA: RoleFormData = {
	name: "",
	displayName: "",
	description: "",
};

/**
 * 역할 식별자 패턴 (영문 대문자로 시작, 영문 대문자/숫자/언더스코어만 허용)
 */
const NAME_PATTERN = /^[A-Z][A-Z0-9_]*$/;

/**
 * RoleFormModal Widget 컴포넌트
 *
 * 역할을 추가/수정하는 모달 폼 위젯입니다.
 * - 생성 모드: name, displayName, description 모두 입력 가능
 * - 수정 모드: displayName, description만 입력 가능 (name은 읽기 전용)
 *
 * **이 컴포넌트는 Store에 접근하지 않습니다.**
 * 모든 데이터와 핸들러는 props로 전달받습니다.
 *
 * @example
 * ```tsx
 * <RoleFormModal
 *   isOpen={isModalOpen}
 *   onClose={handleCloseModal}
 *   onSubmit={handleSubmit}
 *   mode="create"
 * />
 * ```
 */
export const RoleFormModal = observer(
	({
		isOpen,
		onClose,
		onSubmit,
		initialData,
		loading = false,
		mode,
	}: RoleFormModalProps) => {
		// 폼 상태
		const [formData, setFormData] = useState<RoleFormData>(() => ({
			...DEFAULT_FORM_DATA,
			...initialData,
		}));

		// 에러 상태
		const [errors, setErrors] = useState<Record<string, string>>({});

		/**
		 * 초기 데이터로 폼 초기화
		 */
		useEffect(() => {
			if (isOpen) {
				setFormData({
					...DEFAULT_FORM_DATA,
					...initialData,
				});
				setErrors({});
			}
		}, [isOpen, initialData]);

		/**
		 * 폼 유효성 검사
		 */
		const validateForm = (): boolean => {
			const newErrors: Record<string, string> = {};

			// 생성 모드에서만 name 검증
			if (mode === "create") {
				if (!formData.name.trim()) {
					newErrors.name = "역할 식별자를 입력해주세요";
				} else if (!NAME_PATTERN.test(formData.name)) {
					newErrors.name =
						"영문 대문자로 시작하며, 영문 대문자, 숫자, 언더스코어만 사용 가능합니다";
				} else if (formData.name.length > 50) {
					newErrors.name = "역할 식별자는 50자 이하여야 합니다";
				}
			}

			if (!formData.displayName.trim()) {
				newErrors.displayName = "표시명을 입력해주세요";
			} else if (formData.displayName.length > 50) {
				newErrors.displayName = "표시명은 50자 이하여야 합니다";
			}

			if (formData.description && formData.description.length > 200) {
				newErrors.description = "설명은 200자 이하여야 합니다";
			}

			setErrors(newErrors);
			return Object.keys(newErrors).length === 0;
		};

		/**
		 * 폼 제출 핸들러
		 */
		const handleSubmit = () => {
			if (!validateForm()) return;
			onSubmit(formData);
		};

		/**
		 * name 입력 핸들러 (자동 대문자 변환)
		 */
		const handleNameChange = (value: string | number) => {
			const upperValue = String(value).toUpperCase();
			setFormData((prev) => ({
				...prev,
				name: upperValue,
			}));
			// 에러 제거
			if (errors.name) {
				setErrors((prev) => ({ ...prev, name: "" }));
			}
		};

		/**
		 * displayName 입력 핸들러
		 */
		const handleDisplayNameChange = (value: string | number) => {
			setFormData((prev) => ({
				...prev,
				displayName: String(value),
			}));
			// 에러 제거
			if (errors.displayName) {
				setErrors((prev) => ({ ...prev, displayName: "" }));
			}
		};

		/**
		 * description 입력 핸들러
		 */
		const handleDescriptionChange = (
			e: React.ChangeEvent<HTMLInputElement>,
		) => {
			setFormData((prev) => ({
				...prev,
				description: e.target.value,
			}));
			// 에러 제거
			if (errors.description) {
				setErrors((prev) => ({ ...prev, description: "" }));
			}
		};

		/**
		 * 모달 제목
		 */
		const modalTitle = mode === "create" ? "역할 추가" : "역할 수정";

		/**
		 * 제출 버튼 텍스트
		 */
		const submitButtonText = mode === "create" ? "저장" : "수정";

		return (
			<Modal
				isOpen={isOpen}
				onClose={onClose}
				size="md"
				scrollBehavior="inside"
			>
				<ModalContent>
					<ModalHeader>{modalTitle}</ModalHeader>
					<ModalBody>
						<VStack gap={4}>
							{/* 역할 식별자 */}
							<Input
								label="역할 식별자"
								placeholder="MANAGER"
								value={formData.name}
								onChange={handleNameChange}
								isDisabled={loading || mode === "edit"}
								isRequired={mode === "create"}
								isInvalid={!!errors.name}
								errorMessage={errors.name}
								description={
									mode === "create"
										? "영문 대문자와 언더스코어만 사용 (예: TEAM_LEADER)"
										: undefined
								}
							/>

							{/* 표시명 */}
							<Input
								label="표시명"
								placeholder="매니저"
								value={formData.displayName}
								onChange={handleDisplayNameChange}
								isDisabled={loading}
								isRequired
								isInvalid={!!errors.displayName}
								errorMessage={errors.displayName}
							/>

							{/* 설명 */}
							<Textarea
								label="설명"
								placeholder="역할에 대한 설명을 입력하세요"
								value={formData.description || ""}
								onChange={handleDescriptionChange}
								isDisabled={loading}
								isInvalid={!!errors.description}
								errorMessage={errors.description}
								minRows={2}
								maxRows={4}
							/>
						</VStack>
					</ModalBody>
					<ModalFooter>
						<HStack gap={8} justifyContent="end">
							<Button variant="flat" onPress={onClose} isDisabled={loading}>
								취소
							</Button>
							<Button
								color="primary"
								onPress={handleSubmit}
								isLoading={loading}
							>
								{submitButtonText}
							</Button>
						</HStack>
					</ModalFooter>
				</ModalContent>
			</Modal>
		);
	},
);

RoleFormModal.displayName = "RoleFormModal";
