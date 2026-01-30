import type { TextAreaProps } from "@heroui/react";
import { Textarea as BaseTextarea } from "@heroui/react";
import type React from "react";

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
export const Textarea = (props: TextareaProps) => {
	const { onChange, value, ...rest } = props;

	const handleOnChange = (e: React.ChangeEvent<HTMLInputElement>) => {
		onChange?.(e.target.value);
	};

	return <BaseTextarea {...rest} value={value} onChange={handleOnChange} />;
};
