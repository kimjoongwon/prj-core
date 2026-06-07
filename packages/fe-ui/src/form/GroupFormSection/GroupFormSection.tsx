"use client";

import { observer } from "mobx-react-lite";
import { Input } from "../../input/Input/Input";

export interface GroupFormValues {
	name: string;
	label: string;
}

export interface GroupFormErrors {
	name?: string;
	label?: string;
}

export interface GroupFormSectionProps {
	/** 폼 모드 */
	mode: "create" | "edit";
	/** 폼 값 */
	values: GroupFormValues;
	/** 유효성 에러 */
	errors?: GroupFormErrors;
	/** 값 변경 핸들러 */
	onChangeField: (field: keyof GroupFormValues, value: string) => void;
}

/**
 * GroupFormSection 컴포넌트
 * 그룹 등록/수정 폼 섹션입니다.
 * - 등록 시: name, label 입력 가능
 * - 수정 시: name은 읽기 전용, label만 수정 가능
 */
export const GroupFormSection = observer(
	({ mode, values, errors, onChangeField }: GroupFormSectionProps) => {
		const handleChangeName = (value: string) => {
			onChangeField("name", value);
		};

		const handleChangeLabel = (value: string) => {
			onChangeField("label", value);
		};

		return (
			<div className="flex flex-col gap-4">
				<Input
					label="이름"
					placeholder="ROLE_GROUP_NAME"
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
				<Input
					label="라벨"
					placeholder="한글 표시명을 입력하세요"
					value={values.label}
					onValueChange={handleChangeLabel}
					isInvalid={!!errors?.label}
					errorMessage={errors?.label}
					description="선택 사항입니다"
				/>
			</div>
		);
	},
);
