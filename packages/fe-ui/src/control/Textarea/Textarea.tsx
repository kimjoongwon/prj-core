"use client";

import { observer } from "mobx-react-lite";
import type React from "react";
import type { TextAreaProps } from "../../design-system/primitives";
import { Textarea as BaseTextarea } from "../../design-system/primitives";
import { useT } from "../../i18n";

export interface TextareaProps
	extends Omit<TextAreaProps, "onChange" | "value"> {
	/** 입력값 */
	value?: string;
	/** 값 변경 핸들러 */
	onChange?: (value: string) => void;
}

/**
 * Textarea 컴포넌트
 * 여러 줄 텍스트 입력 컴포넌트입니다.
 *
 * @example
 * ```tsx
 * <Textarea
 *   label="메모"
 *   value={memo}
 *   onChange={setMemo}
 *   placeholder="내용을 입력하세요"
 *   minRows={3}
 *   maxRows={6}
 * />
 * ```
 */
export const Textarea = observer((props: TextareaProps) => {
	const t = useT();
	const { onChange, value, ...rest } = props;

	const handleOnChange = (e: React.ChangeEvent<HTMLInputElement>) => {
		onChange?.(e.target.value);
	};

	return (
		<BaseTextarea
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
			errorMessage={
				typeof rest.errorMessage === "string"
					? t(rest.errorMessage)
					: rest.errorMessage
			}
			value={value}
			onChange={handleOnChange}
		/>
	);
});
