"use client";

import {
	Button,
	Input,
	Modal,
	ModalBody,
	ModalContent,
	ModalFooter,
	ModalHeader,
	Select,
	SelectItem,
	Textarea,
} from "@heroui/react";
import { observer, useLocalObservable } from "mobx-react-lite";
import { useEffect } from "react";

/**
 * Subject 폼 데이터
 */
export interface SubjectFormData {
	/** 그룹 */
	group: string;
	/** Subject 이름 (접두어 제외) */
	name: string;
	/** 표시명 */
	displayName: string;
	/** 설명 */
	description?: string;
}

interface SubjectFormModalProps {
	/** 모달 열림 상태 */
	isOpen: boolean;
	/** 모달 닫기 핸들러 */
	onClose: () => void;
	/** 폼 제출 핸들러 */
	onSubmit: (data: SubjectFormData) => void;
	/** 수정 모드 초기 데이터 */
	initialData?: Partial<SubjectFormData>;
	/** 모드 (create: 생성, edit: 수정) */
	mode: "create" | "edit";
	/** 로딩 상태 */
	isLoading?: boolean;
}

/**
 * Subject 그룹 옵션 (entity 제외 - 자동 생성됨)
 */
const GROUP_OPTIONS = [
	{ key: "menu", label: "메뉴", prefix: "menu:" },
	{ key: "feature", label: "기능", prefix: "feature:" },
	{ key: "ui", label: "UI 요소", prefix: "ui:" },
] as const;

/**
 * Subject 폼 모달 컴포넌트
 *
 * Subject 추가/수정을 위한 폼 모달입니다.
 * entity 그룹은 Prisma에서 자동 생성되므로 선택할 수 없습니다.
 */
export const SubjectFormModal = observer(
	({
		isOpen,
		onClose,
		onSubmit,
		initialData,
		mode,
		isLoading = false,
	}: SubjectFormModalProps) => {
		const state = useLocalObservable(() => ({
			group: initialData?.group ?? "ui",
			name: initialData?.name ?? "",
			displayName: initialData?.displayName ?? "",
			description: initialData?.description ?? "",
			errors: {
				name: "",
				displayName: "",
			},
		}));

		/**
		 * 초기 데이터 설정
		 */
		useEffect(() => {
			if (isOpen && initialData) {
				// 기존 Subject 이름에서 접두어 제거
				let nameWithoutPrefix = initialData.name ?? "";
				for (const opt of GROUP_OPTIONS) {
					if (nameWithoutPrefix.startsWith(opt.prefix)) {
						nameWithoutPrefix = nameWithoutPrefix.slice(opt.prefix.length);
						break;
					}
				}

				state.group = initialData.group ?? "ui";
				state.name = nameWithoutPrefix;
				state.displayName = initialData.displayName ?? "";
				state.description = initialData.description ?? "";
				state.errors = { name: "", displayName: "" };
			} else if (isOpen && !initialData) {
				// 생성 모드 초기화
				state.group = "ui";
				state.name = "";
				state.displayName = "";
				state.description = "";
				state.errors = { name: "", displayName: "" };
			}
		}, [isOpen, initialData]);

		/**
		 * 현재 선택된 그룹의 접두어 가져오기
		 */
		const getPrefix = () => {
			const found = GROUP_OPTIONS.find((opt) => opt.key === state.group);
			return found?.prefix ?? "";
		};

		/**
		 * 전체 Subject 이름 미리보기
		 */
		const getFullName = () => {
			return `${getPrefix()}${state.name}`;
		};

		/**
		 * 폼 유효성 검사
		 */
		const validate = (): boolean => {
			let isValid = true;

			// 이름 검사
			if (!state.name.trim()) {
				state.errors.name = "이름을 입력해주세요.";
				isValid = false;
			} else if (!/^[a-z][a-z0-9-]*$/.test(state.name)) {
				state.errors.name =
					"소문자, 숫자, 하이픈만 사용 가능합니다. (예: main-banner)";
				isValid = false;
			} else {
				state.errors.name = "";
			}

			// 표시명 검사
			if (!state.displayName.trim()) {
				state.errors.displayName = "표시명을 입력해주세요.";
				isValid = false;
			} else {
				state.errors.displayName = "";
			}

			return isValid;
		};

		/**
		 * 폼 제출 핸들러
		 */
		const handleSubmit = () => {
			if (!validate()) {
				return;
			}

			onSubmit({
				group: state.group,
				name: getFullName(),
				displayName: state.displayName,
				description: state.description || undefined,
			});
		};

		/**
		 * 그룹 변경 핸들러
		 */
		const handleGroupChange = (keys: Set<string> | "all") => {
			if (keys === "all") return;
			const selected = Array.from(keys)[0];
			if (selected) {
				state.group = selected;
			}
		};

		return (
			<Modal isOpen={isOpen} onClose={onClose} size="md">
				<ModalContent>
					<ModalHeader>
						{mode === "create" ? "Subject 추가" : "Subject 수정"}
					</ModalHeader>
					<ModalBody>
						<div className="space-y-4">
							{/* 그룹 선택 */}
							<Select
								label="그룹"
								placeholder="그룹을 선택하세요"
								selectedKeys={new Set([state.group])}
								onSelectionChange={(keys) =>
									handleGroupChange(keys as Set<string>)
								}
								isDisabled={mode === "edit"}
								description="entity 그룹은 Prisma에서 자동 생성됩니다."
							>
								{GROUP_OPTIONS.map((opt) => (
									<SelectItem key={opt.key}>{opt.label}</SelectItem>
								))}
							</Select>

							{/* 이름 입력 */}
							<Input
								label="이름"
								placeholder="main-banner"
								value={state.name}
								onValueChange={(value) => {
									state.name = value;
								}}
								isInvalid={!!state.errors.name}
								errorMessage={state.errors.name}
								isDisabled={mode === "edit"}
								startContent={
									<span className="text-default-400 text-sm">
										{getPrefix()}
									</span>
								}
								description={`전체 이름: ${getFullName()}`}
							/>

							{/* 표시명 입력 */}
							<Input
								label="표시명"
								placeholder="메인 배너"
								value={state.displayName}
								onValueChange={(value) => {
									state.displayName = value;
								}}
								isInvalid={!!state.errors.displayName}
								errorMessage={state.errors.displayName}
								isRequired
							/>

							{/* 설명 입력 */}
							<Textarea
								label="설명"
								placeholder="Subject에 대한 설명을 입력하세요."
								value={state.description}
								onValueChange={(value) => {
									state.description = value;
								}}
								minRows={2}
							/>
						</div>
					</ModalBody>
					<ModalFooter>
						<Button variant="flat" onPress={onClose} isDisabled={isLoading}>
							취소
						</Button>
						<Button
							color="primary"
							onPress={handleSubmit}
							isLoading={isLoading}
						>
							{mode === "create" ? "추가" : "수정"}
						</Button>
					</ModalFooter>
				</ModalContent>
			</Modal>
		);
	},
);

SubjectFormModal.displayName = "SubjectFormModal";
