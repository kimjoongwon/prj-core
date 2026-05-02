"use client";

import {
	Input as HeroUiInput,
	type InputProps as HeroUiInputProps,
} from "@cocrepo/ui/heroui";
import { observer } from "mobx-react-lite";
import type { ChangeEventHandler } from "react";
import { translateNode, useT } from "../../i18n";

export interface InputProps
	extends Omit<HeroUiInputProps, "onChange" | "onBlur" | "value"> {
	/** 입력값 */
	value?: string | number;
	/** 값 변경 핸들러 (type="number"일 때 number 반환) */
	onChange?: (value: string | number) => void;
	/** blur 핸들러 (type="number"일 때 number 반환) */
	onBlur?: (value: string | number) => void;
}

function translateInputErrorMessage(
	errorMessage: HeroUiInputProps["errorMessage"],
	t: ReturnType<typeof useT>,
): HeroUiInputProps["errorMessage"] {
	if (typeof errorMessage === "function") {
		return errorMessage;
	}

	return translateNode(errorMessage, t);
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
export const Input = observer(function Input(props: InputProps) {
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
	const ariaLabel =
		typeof rest["aria-label"] === "string"
			? t(rest["aria-label"])
			: rest["aria-label"];

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
			aria-label={ariaLabel}
			label={translateNode(rest.label, t)}
			placeholder={rest.placeholder ? t(rest.placeholder) : undefined}
			description={translateNode(rest.description, t)}
			type={type}
			size={size}
			onChange={handleChange}
			onBlur={handleOnBlur}
			errorMessage={translateInputErrorMessage(errorMessage, t)}
			value={String(value)}
		/>
	);
});
