"use client";

import { cn, Input, type InputRootProps } from "@heroui/react";
import type {
	ChangeEvent,
	KeyboardEvent,
	MouseEvent,
	PointerEvent,
} from "react";

export interface InputCellProps
	extends Omit<
		InputRootProps,
		| "aria-label"
		| "defaultValue"
		| "onBlur"
		| "onChange"
		| "onClick"
		| "onKeyDown"
		| "onPointerDown"
		| "value"
	> {
	value?: string | number | null;
	"aria-label": string;
	onValueChange: (value: string | number) => void;
	onFinish: () => void;
	onCancel: () => void;
}

/** DataGrid 셀 안에서 문자열 또는 숫자를 가볍게 편집합니다. */
export function InputCell({
	value,
	type = "text",
	autoFocus = true,
	className,
	onValueChange,
	onFinish,
	onCancel,
	...inputProps
}: InputCellProps) {
	const handleChange = (event: ChangeEvent<HTMLInputElement>) => {
		const nextValue = event.currentTarget.value;
		onValueChange(
			type === "number" && nextValue !== "" ? Number(nextValue) : nextValue,
		);
	};

	const handleKeyDown = (event: KeyboardEvent<HTMLInputElement>) => {
		event.stopPropagation();

		if (event.key === "Enter") {
			event.preventDefault();
			onFinish();
		}

		if (event.key === "Escape") {
			event.preventDefault();
			onCancel();
		}
	};

	const stopMousePropagation = (
		event: MouseEvent<HTMLInputElement> | PointerEvent<HTMLInputElement>,
	) => {
		event.stopPropagation();
	};

	return (
		<Input
			{...inputProps}
			autoFocus={autoFocus}
			className={cn("h-8 min-w-0 w-full px-2 text-sm", className)}
			fullWidth
			type={type}
			value={value == null ? "" : String(value)}
			onBlur={onFinish}
			onChange={handleChange}
			onClick={stopMousePropagation}
			onKeyDown={handleKeyDown}
			onPointerDown={stopMousePropagation}
		/>
	);
}
