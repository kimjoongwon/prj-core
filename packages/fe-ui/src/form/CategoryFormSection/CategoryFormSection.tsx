"use client";

import {
	Input,
	Select,
	SelectItem,
	type SharedSelection,
} from "@cocrepo/ui/heroui";
import { observer } from "mobx-react-lite";

export interface CategoryOption {
	id: string;
	name: string;
}

export interface CategoryFormValues {
	name: string;
	parentId: string;
}

export interface CategoryFormErrors {
	name?: string;
	parentId?: string;
}

export interface CategoryFormSectionProps {
	/** 폼 모드 */
	mode: "create" | "edit";
	/** 폼 값 */
	values: CategoryFormValues;
	/** 유효성 에러 */
	errors?: CategoryFormErrors;
	/** 상위 카테고리 선택 옵션 (자기 자신 및 하위 카테고리 제외) */
	categoryOptions: CategoryOption[];
	/** 값 변경 핸들러 */
	onChangeField: (field: keyof CategoryFormValues, value: string) => void;
}

/**
 * CategoryFormSection 컴포넌트
 * 카테고리 등록/수정 폼 섹션입니다.
 * - 등록 시: name, parentId 입력 가능
 * - 수정 시: name은 읽기 전용, parentId만 수정 가능
 */
export const CategoryFormSection = observer(
	({
		mode,
		values,
		errors,
		categoryOptions,
		onChangeField,
	}: CategoryFormSectionProps) => {
		const handleChangeName = (value: string) => {
			onChangeField("name", value);
		};

		const handleChangeParentId = (keys: SharedSelection) => {
			if (keys === "all") return;
			const selectedKey = String(Array.from(keys)[0] ?? "");
			onChangeField("parentId", selectedKey);
		};

		return (
			<div className="flex flex-col gap-4">
				<Input
					label="이름"
					placeholder="CATEGORY_NAME"
					value={values.name}
					onValueChange={handleChangeName}
					isReadOnly={mode === "edit"}
					isRequired
					isInvalid={!!errors?.name}
					errorMessage={errors?.name}
					description={
						mode === "create"
							? "영문 대문자와 언더스코어(_)만 허용됩니다"
							: "식별자는 수정할 수 없습니다"
					}
				/>
				<Select
					label="상위 카테고리"
					placeholder="상위 카테고리 선택"
					selectedKeys={
						values.parentId ? new Set([values.parentId]) : new Set()
					}
					onSelectionChange={handleChangeParentId}
					isInvalid={!!errors?.parentId}
					errorMessage={errors?.parentId}
					description="선택하지 않으면 최상위 카테고리로 생성됩니다"
				>
					{categoryOptions.map((option) => (
						<SelectItem key={option.id}>{option.name}</SelectItem>
					))}
				</Select>
			</div>
		);
	},
);
