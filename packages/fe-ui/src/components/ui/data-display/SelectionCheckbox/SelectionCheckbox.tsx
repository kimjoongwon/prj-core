"use client";

import { Checkbox } from "@heroui/react";
import { observer } from "mobx-react-lite";

export interface SelectionCheckboxProps {
	/** 체크 여부 */
	checked: boolean;
	/** 체크 변경 핸들러 */
	onChange: (checked: boolean) => void;
	/** 일부 선택 상태 (indeterminate) */
	indeterminate?: boolean;
	/** 비활성화 여부 */
	isDisabled?: boolean;
	/** 추가 클래스명 */
	className?: string;
}

/**
 * 선택용 체크박스 컴포넌트
 * 목록에서 행 선택 시 사용
 */
export const SelectionCheckbox = observer(
	({
		checked,
		onChange,
		indeterminate = false,
		isDisabled = false,
		className,
	}: SelectionCheckboxProps) => {
		return (
			<Checkbox
				isSelected={checked}
				isIndeterminate={indeterminate}
				isDisabled={isDisabled}
				onValueChange={onChange}
				className={className}
				classNames={{
					wrapper: "mr-0",
				}}
			/>
		);
	},
);
