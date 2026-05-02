"use client";

import {
	Checkbox as NextUICheckbox,
	type CheckboxProps as NextUICheckboxProps,
} from "@cocrepo/ui/heroui";
import { observer } from "mobx-react-lite";
import type React from "react";
import { translateNode, useT } from "../../i18n";

export interface CheckboxProps extends Omit<NextUICheckboxProps, "onChange"> {
	/** 체크 상태 변경 핸들러 */
	onChange?: (checked: boolean) => void;
}

/**
 * Checkbox 컴포넌트
 * HeroUI Checkbox의 래퍼로, boolean 값 핸들링을 제공합니다.
 *
 * @example
 * ```tsx
 * <Checkbox
 *   isSelected={agreed}
 *   onChange={setAgreed}
 * >
 *   이용약관에 동의합니다
 * </Checkbox>
 *
 * // 비활성화
 * <Checkbox isDisabled>비활성화됨</Checkbox>
 * ```
 */
export const Checkbox = observer(function Checkbox(props: CheckboxProps) {
	const t = useT();
	const { onChange, size = "lg", ...rest } = props;

	const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
		onChange?.(e.target.checked);
	};

	return (
		<NextUICheckbox {...rest} onChange={handleChange} size={size}>
			<span className="font-bold">{translateNode(props.children, t)}</span>
		</NextUICheckbox>
	);
});
