"use client";

import {
	Input as HeroUiInput,
	type InputProps as HeroUiInputProps,
} from "@cocrepo/ui/heroui";
import { observer } from "mobx-react-lite";
import type { ChangeEventHandler } from "react";
import { useT } from "../../i18n";

export interface InputProps
	extends Omit<HeroUiInputProps, "onChange" | "onBlur" | "value"> {
	/** 입력값 */
	value?: string | number;
	/** 값 변경 핸들러 (type="number"일 때 number 반환) */
	onChange?: (value: string | number) => void;
	/** blur 핸들러 (type="number"일 때 number 반환) */
	onBlur?: (value: string | number) => void;
}

/**
 * Input 컴포넌트
 * HeroUI Input의 래퍼로, 간소화된 값 핸들링을 제공합니다.
 *
 * @example
 * ```tsx
 * // 기본 텍스트 입력
 * <Input
 *   label="이름"
 *   value={name}
 *   onChange={setName}
 *   placeholder="이름을 입력하세요"
 * />
 *
 * // 숫자 입력 (number 타입 반환)
 * <Input
 *   type="number"
 *   label="나이"
 *   value={age}
 *   onChange={(v) => setAge(v as number)}
 * />
 *
 * // 에러 표시
 * <Input
 *   label="이메일"
 *   isInvalid
 *   errorMessage="올바른 이메일을 입력하세요"
 * />
 * ```
 */
export const Input = observer((props: InputProps) => {
	const t = useT();
	const {
		onChange,
		onBlur,
		errorMessage = " ",
		type,
		size = "sm",
		value = "",
		...rest
	} = props;

	const handleChange: ChangeEventHandler<HTMLInputElement> = (e) => {
		if (type === "number" && typeof Number(e.target.value) === "number") {
			onChange?.(Number(e.target.value));
			return;
		}

		onChange?.(e.target.value);
	};

	const handleOnBlur: ChangeEventHandler<HTMLInputElement> = (e) => {
		if (type === "number" && typeof Number(e.target.value) === "number") {
			onBlur?.(Number(e.target.value));
		} else {
			onBlur?.(e.target.value);
		}
	};

	return (
		<HeroUiInput
			{...rest}
			label={typeof rest.label === "string" ? t(rest.label) : rest.label}
			placeholder={
				typeof rest.placeholder === "string"
					? t(rest.placeholder)
					: rest.placeholder
			}
			description={
				typeof rest.description === "string"
					? t(rest.description)
					: rest.description
			}
			type={type}
			size={size}
			onChange={handleChange}
			onBlur={handleOnBlur}
			errorMessage={
				typeof errorMessage === "string" ? t(errorMessage) : errorMessage
			}
			value={String(value)}
		/>
	);
});
