"use client";

import type { TextAreaProps } from "@cocrepo/ui/heroui";
import { Textarea as BaseTextarea } from "@cocrepo/ui/heroui";
import { observer } from "mobx-react-lite";
import type React from "react";
import { translateNode, useT } from "../../i18n";

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
export const Textarea = observer(function Textarea(props: TextareaProps) {
	const t = useT();
	const { onChange, value, ...rest } = props;
	const ariaLabel =
		typeof rest["aria-label"] === "string"
			? t(rest["aria-label"])
			: rest["aria-label"];
	const errorMessage =
		typeof rest.errorMessage === "function"
			? rest.errorMessage
			: translateNode(rest.errorMessage, t);

	const handleOnChange = (e: React.ChangeEvent<HTMLInputElement>) => {
		onChange?.(e.target.value);
	};

	return (
		<BaseTextarea
			{...rest}
			aria-label={ariaLabel}
			label={translateNode(rest.label, t)}
			placeholder={rest.placeholder ? t(rest.placeholder) : undefined}
			description={translateNode(rest.description, t)}
			errorMessage={errorMessage}
			value={value}
			onChange={handleOnChange}
		/>
	);
});
