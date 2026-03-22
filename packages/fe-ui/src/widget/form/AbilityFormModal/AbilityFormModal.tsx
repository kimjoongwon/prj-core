"use client";

import {
	Button,
	Checkbox as HeroCheckbox,
	CheckboxGroup,
	Modal,
	ModalBody,
	ModalContent,
	ModalFooter,
	ModalHeader,
	Select as HeroSelect,
	SelectItem,
	SelectSection,
} from "@heroui/react";
import { observer } from "mobx-react-lite";
import { useEffect, useState } from "react";
import { Input } from "../../../input/Input/Input";
import { RadioGroup } from "../../../input/RadioGroup/RadioGroup";
import { Checkbox } from "../../../input/Checkbox/Checkbox";
import { HStack } from "../../../layout/HStack/HStack";
import { VStack } from "../../../layout/VStack/VStack";
import { ConditionEditor } from "../../ability/ConditionEditor";

/**
 * Subject 정보
 */
export interface Subject {
	/** Subject ID */
	id: string;
	/** Subject 식별자 */
	name: string;
	/** Subject 표시명 */
	displayName?: string;
	/** 그룹 (entity, menu 등) */
	group?: string;
}

/**
 * Action 정보
 */
export interface Action {
	/** Action ID */
	id: string;
	/** Action 식별자 */
	name: string;
	/** Action 표시명 */
	displayName?: string;
	/** 그룹 (crud, visibility, workflow) */
	group?: string;
}

/**
 * 폼 데이터 타입
 */
export interface AbilityFormData {
	/** 규칙 이름 */
	name?: string;
	/** Subject ID */
	subjectId?: string;
	/** Subject 식별자 */
	subjectName?: string;
	/** Action ID */
	actionId?: string;
	/** Action 식별자 */
	actionName?: string;
	/** 대상 필드 목록 */
	fields: string[];
	/** 조건 */
	conditions?: Record<string, unknown> | null;
	/** 허용(false) / 거부(true) 여부 */
	inverted: boolean;
	/** 거부 사유 (inverted가 true일 때) */
	reason?: string;
	/** 활성화 상태 */
	isActive: boolean;
	/** 우선순위 */
	priority: number;
}

export interface AbilityFormModalProps {
	/** 모달 열림 상태 */
	isOpen: boolean;
	/** 모달 닫기 핸들러 */
	onClose: () => void;
	/** 폼 제출 핸들러 */
	onSubmit: (data: AbilityFormData) => void;
	/** 수정 모드 시 초기 데이터 */
	initialData?: Partial<AbilityFormData>;
	/** Subject 목록 */
	subjects: Subject[];
	/** Action 목록 */
	actions: Action[];
	/** 선택된 Subject의 필드 목록 (체크박스/조건 편집기용) */
	subjectFields?: string[];
	/** 로딩 상태 */
	loading?: boolean;
	/** 모드 (생성/수정) */
	mode: "create" | "edit";
}

/**
 * 기본 폼 데이터
 */
const DEFAULT_FORM_DATA: AbilityFormData = {
	name: "",
	subjectId: "",
	subjectName: "",
	actionId: "",
	actionName: "",
	fields: [],
	conditions: null,
	inverted: false,
	reason: "",
	isActive: true,
	priority: 0,
};

/**
 * Action 그룹 라벨
 */
const ACTION_GROUP_LABELS: Record<string, string> = {
	crud: "CRUD",
	visibility: "가시성",
	workflow: "워크플로우",
	other: "기타",
};

/**
 * AbilityFormModal Widget 컴포넌트
 *
 * Ability 규칙을 추가/수정하는 모달 폼 위젯입니다.
 * Subject 선택, Action 선택 (그룹별 분류), 필드 선택, 조건 편집,
 * 허용/거부 설정 기능을 제공합니다.
 *
 * **이 컴포넌트는 Store에 접근하지 않습니다.**
 * 모든 데이터와 핸들러는 props로 전달받습니다.
 *
 * @example
 * ```tsx
 * <AbilityFormModal
 *   isOpen={isModalOpen}
 *   onClose={handleCloseModal}
 *   onSubmit={handleSubmit}
 *   subjects={subjects}
 *   actions={actions}
 *   subjectFields={selectedSubjectFields}
 *   mode="create"
 * />
 * ```
 */
export const AbilityFormModal = observer(
	({
		isOpen,
		onClose,
		onSubmit,
		initialData,
		subjects,
		actions,
		subjectFields = [],
		loading = false,
		mode,
	}: AbilityFormModalProps) => {
		// 폼 상태
		const [formData, setFormData] = useState<AbilityFormData>(() => ({
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
		 * Subject를 그룹별로 분류
		 */
		const groupedSubjects = subjects.reduce(
			(acc, subject) => {
				const group = subject.group || "other";
				if (!acc[group]) {
					acc[group] = [];
				}
				acc[group].push(subject);
				return acc;
			},
			{} as Record<string, Subject[]>,
		);

		/**
		 * Action을 그룹별로 분류
		 */
		const groupedActions = actions.reduce(
			(acc, action) => {
				const group = action.group || "other";
				if (!acc[group]) {
					acc[group] = [];
				}
				acc[group].push(action);
				return acc;
			},
			{} as Record<string, Action[]>,
		);

		/**
		 * Subject 변경 핸들러
		 */
		const handleSubjectChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
			const subjectId = e.target.value;
			const selected = subjects.find((s) => s.id === subjectId);
			setFormData((prev) => ({
				...prev,
				subjectId,
				subjectName: selected?.name || "",
				// Subject가 변경되면 필드 초기화
				fields: [],
			}));
			// 에러 제거
			if (errors.subjectId) {
				setErrors((prev) => ({ ...prev, subjectId: "" }));
			}
		};

		/**
		 * Action 변경 핸들러
		 */
		const handleActionChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
			const actionId = e.target.value;
			const selected = actions.find((a) => a.id === actionId);
			setFormData((prev) => ({
				...prev,
				actionId,
				actionName: selected?.name || "",
			}));
			// 에러 제거
			if (errors.actionId) {
				setErrors((prev) => ({ ...prev, actionId: "" }));
			}
		};

		/**
		 * 타입 변경 핸들러 (허용/거부)
		 */
		const handleTypeChange = (value: string) => {
			const inverted = value === "cannot";
			setFormData((prev) => ({
				...prev,
				inverted,
				// 허용으로 변경하면 reason 초기화
				reason: inverted ? prev.reason : "",
			}));
		};

		/**
		 * 필드 변경 핸들러
		 */
		const handleFieldsChange = (fields: string[]) => {
			setFormData((prev) => ({
				...prev,
				fields,
			}));
		};

		/**
		 * 조건 변경 핸들러
		 */
		const handleConditionsChange = (
			conditions: Record<string, unknown> | null,
		) => {
			setFormData((prev) => ({
				...prev,
				conditions,
			}));
		};

		/**
		 * 폼 유효성 검사
		 */
		const validateForm = (): boolean => {
			const newErrors: Record<string, string> = {};

			if (!formData.subjectId) {
				newErrors.subjectId = "Subject를 선택해주세요";
			}
			if (!formData.actionId) {
				newErrors.actionId = "Action을 선택해주세요";
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
		 * 모달 제목
		 */
		const modalTitle = mode === "create" ? "권한 추가" : "권한 수정";

		/**
		 * 제출 버튼 텍스트
		 */
		const submitButtonText = mode === "create" ? "저장" : "수정";

		return (
			<Modal
				isOpen={isOpen}
				onClose={onClose}
				size="2xl"
				scrollBehavior="inside"
			>
				<ModalContent>
					<ModalHeader>{modalTitle}</ModalHeader>
					<ModalBody>
						<VStack gap={4}>
							{/* 규칙 이름 */}
							<Input
								label="규칙 이름"
								placeholder="규칙을 식별할 수 있는 이름을 입력하세요"
								value={formData.name || ""}
								onChange={(value) =>
									setFormData((prev) => ({
										...prev,
										name: String(value),
									}))
								}
								isDisabled={loading}
							/>

							{/* Subject 선택 (그룹별 분류) */}
							<HeroSelect
								label="Subject"
								placeholder="Subject를 선택하세요"
								selectedKeys={formData.subjectId ? [formData.subjectId] : []}
								onChange={handleSubjectChange}
								isDisabled={loading}
								isRequired
								isInvalid={!!errors.subjectId}
								errorMessage={errors.subjectId}
								variant="bordered"
							>
								{Object.entries(groupedSubjects).map(([group, items]) => (
									<SelectSection
										key={group}
										title={group}
										classNames={{
											heading:
												"text-xs font-semibold text-default-500 uppercase",
										}}
									>
										{items.map((subject) => (
											<SelectItem
												key={subject.id}
												textValue={subject.displayName || subject.name}
											>
												{subject.displayName || subject.name}
											</SelectItem>
										))}
									</SelectSection>
								))}
							</HeroSelect>

							{/* Action 선택 (그룹별 분류) */}
							<HeroSelect
								label="Action"
								placeholder="Action을 선택하세요"
								selectedKeys={formData.actionId ? [formData.actionId] : []}
								onChange={handleActionChange}
								isDisabled={loading}
								isRequired
								isInvalid={!!errors.actionId}
								errorMessage={errors.actionId}
								variant="bordered"
							>
								{Object.entries(groupedActions).map(([group, items]) => (
									<SelectSection
										key={group}
										title={ACTION_GROUP_LABELS[group] || group}
										classNames={{
											heading:
												"text-xs font-semibold text-default-500 uppercase",
										}}
									>
										{items.map((action) => (
											<SelectItem
												key={action.id}
												textValue={action.displayName || action.name}
											>
												{action.displayName || action.name}
											</SelectItem>
										))}
									</SelectSection>
								))}
							</HeroSelect>

							{/* Type 선택 (허용/거부) */}
							<RadioGroup
								label="Type"
								orientation="horizontal"
								value={formData.inverted ? "cannot" : "can"}
								onValueChange={handleTypeChange}
								isDisabled={loading}
								options={[
									{ text: "허용 (can)", value: "can" },
									{ text: "거부 (cannot)", value: "cannot" },
								]}
							/>

							{/* 거부 사유 (inverted가 true일 때만 표시) */}
							{formData.inverted && (
								<Input
									label="거부 사유"
									placeholder="거부 사유를 입력하세요"
									value={formData.reason || ""}
									onChange={(value) =>
										setFormData((prev) => ({
											...prev,
											reason: String(value),
										}))
									}
									isDisabled={loading}
								/>
							)}

							{/* 대상 필드 선택 (subjectFields가 있을 때만 표시) */}
							{subjectFields.length > 0 && (
								<VStack gap={2}>
									<span className="text-sm font-medium text-foreground">
										대상 필드
									</span>
									<CheckboxGroup
										value={formData.fields}
										onValueChange={handleFieldsChange}
										isDisabled={loading}
										orientation="horizontal"
										classNames={{
											wrapper: "flex-wrap gap-3",
										}}
									>
										{subjectFields.map((field) => (
											<HeroCheckbox key={field} value={field}>
												{field}
											</HeroCheckbox>
										))}
									</CheckboxGroup>
								</VStack>
							)}

							{/* 조건 편집기 */}
							<ConditionEditor
								value={formData.conditions || null}
								onChange={handleConditionsChange}
								subjectFields={subjectFields}
								isDisabled={loading}
							/>

							{/* 우선순위 */}
							<Input
								type="number"
								label="우선순위"
								placeholder="우선순위 (숫자가 높을수록 먼저 평가)"
								value={formData.priority}
								onChange={(value) =>
									setFormData((prev) => ({
										...prev,
										priority: Number(value),
									}))
								}
								isDisabled={loading}
							/>

							{/* 활성화 상태 */}
							<HStack gap={4}>
								<Checkbox
									isSelected={formData.isActive}
									onChange={(checked) =>
										setFormData((prev) => ({
											...prev,
											isActive: checked,
										}))
									}
									isDisabled={loading}
								>
									활성화
								</Checkbox>
							</HStack>
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

AbilityFormModal.displayName = "AbilityFormModal";
