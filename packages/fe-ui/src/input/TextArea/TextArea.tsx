import { useInputStateInspection } from "@cocrepo/hook";
import {
	cn,
	Description,
	FieldError,
	TextArea as HeroTextArea,
	Label,
	TextField,
} from "@heroui/react";
import { makeAutoObservable } from "mobx";
import { observer, useLocalObservable } from "mobx-react-lite";
import type React from "react";
import type { ComponentProps, ReactNode } from "react";
import { useCallback, useEffect, useId } from "react";
import { useT } from "../../i18n";

export interface TextAreaProps
	extends Omit<
		ComponentProps<typeof HeroTextArea>,
		"children" | "onChange" | "value" | "variant"
	> {
	/** 입력값 */
	value?: string;
	/** 값 변경 핸들러 */
	onChange?: (value: string) => void;
	onValueChange?: (value: string) => void;
	label?: ReactNode;
	labelPlacement?: string;
	description?: ReactNode;
	errorMessage?: ReactNode;
	isInvalid?: boolean;
	isDisabled?: boolean;
	isReadOnly?: boolean;
	isRequired?: boolean;
	size?: "sm" | "md" | "lg";
	minRows?: number;
	maxRows?: number;
	classNames?: Record<string, string>;
	variant?:
		| "flat"
		| "bordered"
		| "underlined"
		| "faded"
		| "primary"
		| "secondary";
}

/**
 * TextArea 컴포넌트
 * 여러 줄 텍스트 입력 컴포넌트입니다.
 */
export function createTextAreaState(initialValue = "") {
	return makeAutoObservable(
		{
			value: initialValue,
			setValue(nextValue: string) {
				this.value = nextValue;
			},
		},
		{},
		{ autoBind: true, name: "TextAreaState" },
	);
}
export type TextAreaState = ReturnType<typeof createTextAreaState>;

export const TextArea = observer((props: TextAreaProps) => {
	const t = useT();
	const {
		classNames,
		description,
		errorMessage,
		isDisabled,
		isInvalid,
		isReadOnly,
		isRequired,
		label,
		labelPlacement: _labelPlacement,
		maxRows: _maxRows,
		minRows: _minRows,
		onChange,
		onValueChange,
		size: _size,
		value,
		variant,
		...rest
	} = props;
	const internalState = useLocalObservable(() =>
		createTextAreaState(
			typeof rest.defaultValue === "string" ? rest.defaultValue : "",
		),
	);
	const inputStateId = useId();
	const inspection = useInputStateInspection();
	const isControlled = value !== undefined;
	const selectedValue = isControlled ? value : internalState.value;
	const reader = useCallback(
		() => (isControlled ? value : internalState.value),
		[internalState, isControlled, value],
	);
	useEffect(
		() => inspection?.registerInputState(inputStateId, reader),
		[inspection, inputStateId, reader, selectedValue],
	);

	const handleOnChange = (event: React.ChangeEvent<HTMLTextAreaElement>) => {
		const nextValue = event.target.value;
		if (!isControlled) internalState.setValue(nextValue);
		onChange?.(nextValue);
		onValueChange?.(event.target.value);
	};

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
			<HeroTextArea
				{...rest}
				className={cn(rest.className, classNames?.input)}
				placeholder={
					typeof rest.placeholder === "string"
						? t(rest.placeholder)
						: rest.placeholder
				}
				value={selectedValue}
				onChange={handleOnChange}
				variant={
					variant === "primary" || variant === "secondary" ? variant : undefined
				}
			/>
			{description ? (
				<Description>
					{typeof description === "string" ? t(description) : description}
				</Description>
			) : null}
			{errorMessage ? (
				<FieldError>
					{typeof errorMessage === "string" ? t(errorMessage) : errorMessage}
				</FieldError>
			) : null}
		</TextField>
	);
});
