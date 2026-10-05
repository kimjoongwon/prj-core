import { RadioGroup as HeroRadioGroup } from "@heroui/react";
import type { ComponentProps, ReactNode } from "react";

export interface RadioOption {
	/** 표시 텍스트 */
	text: string;
	/** 옵션 값 */
	value: string | number;
}

export interface RadioGroupProps
	extends Omit<
		ComponentProps<typeof HeroRadioGroup>,
		"children" | "onChange" | "value"
	> {
	/** 라디오 옵션 목록 */
	options?: RadioOption[];
	children?: ReactNode;
	/** 선택된 값 */
	value?: string;
	/** 값 변경 핸들러 */
	onValueChange?: (value: string) => void;
	onChange?: (value: string) => void;
	label?: ReactNode;
	errorMessage?: ReactNode;
}
