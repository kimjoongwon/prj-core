"use client";

import {
	cn,
	Description,
	FieldError,
	Input as HeroInput,
	Label,
	TextField,
} from "@heroui/react";
import { observer } from "mobx-react-lite";
import type { ChangeEventHandler, ComponentProps, ReactNode } from "react";
import { useT } from "../../i18n";

export interface InputProps
	extends Omit<
		ComponentProps<typeof HeroInput>,
		"children" | "onChange" | "onBlur" | "size" | "value" | "variant"
	> {
	/** 입력값 */
	value?: string | number;
	/** 값 변경 핸들러 (type="number"일 때 number 반환) */
	onChange?: (value: string | number) => void;
	/** HeroUI v2 스타일 값 변경 핸들러 */
	onValueChange?: (value: string) => void;
	/** blur 핸들러 (type="number"일 때 number 반환) */
	onBlur?: (value: string | number) => void;
	label?: ReactNode;
	labelPlacement?: string;
	description?: ReactNode;
	errorMessage?: ReactNode;
	isInvalid?: boolean;
	isDisabled?: boolean;
	isReadOnly?: boolean;
	isRequired?: boolean;
	size?: "sm" | "md" | "lg";
	startContent?: ReactNode;
	endContent?: ReactNode;
	classNames?: Record<string, string>;
	isClearable?: boolean;
	onClear?: () => void;
	variant?:
		| "flat"
		| "bordered"
		| "underlined"
		| "faded"
		| "primary"
		| "secondary";
}

/**
 * Input 컴포넌트
 * HeroUI Input의 래퍼로, 간소화된 값 핸들링을 제공합니다.
 */
export const Input = observer((props: InputProps) => {
	const t = useT();
	const {
		classNames,
		description,
		endContent,
		errorMessage = " ",
		isClearable: _isClearable,
		isDisabled,
		isInvalid,
		isReadOnly,
		isRequired,
		label,
		labelPlacement: _labelPlacement,
		onBlur,
		onChange,
		onClear: _onClear,
		onValueChange,
		size: _size = "sm",
		startContent,
		type,
		value = "",
		variant,
		...rest
	} = props;

	const handleChange: ChangeEventHandler<HTMLInputElement> = (event) => {
		if (type === "number" && typeof Number(event.target.value) === "number") {
			onChange?.(Number(event.target.value));
			onValueChange?.(event.target.value);
			return;
		}

		onChange?.(event.target.value);
		onValueChange?.(event.target.value);
	};

	const handleOnBlur: ChangeEventHandler<HTMLInputElement> = (event) => {
		if (type === "number" && typeof Number(event.target.value) === "number") {
			onBlur?.(Number(event.target.value));
			return;
		}

		onBlur?.(event.target.value);
	};

	const translatedError =
		typeof errorMessage === "string" ? t(errorMessage) : errorMessage;

	return (
		<TextField
			isDisabled={isDisabled}
			isInvalid={isInvalid}
			isReadOnly={isReadOnly}
			isRequired={isRequired}
			variant={
				variant === "primary" || variant === "secondary" ? variant : undefined
			}
		>
			{label ? (
				<Label>{typeof label === "string" ? t(label) : label}</Label>
			) : null}
			<div className={cn("flex items-center gap-2", classNames?.inputWrapper)}>
				{startContent}
				<HeroInput
					{...rest}
					className={cn(rest.className, classNames?.input)}
					placeholder={
						typeof rest.placeholder === "string"
							? t(rest.placeholder)
							: rest.placeholder
					}
					type={type}
					onChange={handleChange}
					onBlur={handleOnBlur}
					value={String(value)}
					variant={
						variant === "primary" || variant === "secondary"
							? variant
							: undefined
					}
				/>
				{endContent}
			</div>
			{description ? (
				<Description>
					{typeof description === "string" ? t(description) : description}
				</Description>
			) : null}
			{translatedError ? <FieldError>{translatedError}</FieldError> : null}
		</TextField>
	);
});
