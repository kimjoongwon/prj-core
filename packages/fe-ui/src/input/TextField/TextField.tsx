"use client";

import {
	cn,
	Description,
	FieldError,
	Input as HeroInput,
	TextField as HeroTextField,
	InputGroup,
	Label,
} from "@heroui/react";
import { observer } from "mobx-react-lite";
import type { ChangeEventHandler } from "react";
import { translateNode, useT } from "../../i18n";
import type { TextFieldProps } from "./TextField.props";
import { resolveTextFieldValue } from "./text-field-value.resolver";

export const TextField = observer((props: TextFieldProps) => {
	const t = useT();
	const {
		className,
		classNames,
		defaultValue,
		description,
		endContent,
		errorMessage,
		helperText,
		inputGroupProps,
		inputProps,
		isDisabled,
		isInvalid,
		isReadOnly,
		isRequired,
		label,
		onBlur,
		onChange,
		onValueChange,
		placeholder,
		startContent,
		type,
		value,
		variant,
		...rest
	} = props;
	const {
		className: inputClassName,
		placeholder: inputPlaceholder,
		type: inputType,
		...restInputProps
	} = inputProps ?? {};
	const translatedDescription = description ?? helperText;
	const hasInputGroup = Boolean(startContent || endContent);
	const fieldType = type ?? inputType;
	const fieldPlaceholder = placeholder ?? inputPlaceholder;
	const translatedPlaceholder =
		typeof fieldPlaceholder === "string"
			? t(fieldPlaceholder)
			: fieldPlaceholder;
	const inputValue = value === undefined ? undefined : String(value);
	const inputDefaultValue =
		defaultValue === undefined ? undefined : String(defaultValue);

	const handleChange: ChangeEventHandler<HTMLInputElement> = (event) => {
		const nextValue = event.target.value;

		onChange?.(resolveTextFieldValue(nextValue, fieldType));
		onValueChange?.(nextValue);
	};

	const handleBlur: ChangeEventHandler<HTMLInputElement> = (event) => {
		onBlur?.(resolveTextFieldValue(event.target.value, fieldType));
	};

	return (
		<HeroTextField
			{...rest}
			className={cn(className, classNames?.base)}
			isDisabled={isDisabled}
			isInvalid={isInvalid}
			isReadOnly={isReadOnly}
			isRequired={isRequired}
			variant={variant}
		>
			{label ? (
				<Label className={classNames?.label}>{translateNode(label, t)}</Label>
			) : null}
			{hasInputGroup ? (
				<InputGroup
					{...inputGroupProps}
					className={cn(inputGroupProps?.className, classNames?.inputGroup)}
					variant={variant}
				>
					{startContent ? (
						<InputGroup.Prefix className={classNames?.prefix}>
							{translateNode(startContent, t)}
						</InputGroup.Prefix>
					) : null}
					<InputGroup.Input
						{...restInputProps}
						className={cn(inputClassName, classNames?.input)}
						defaultValue={inputDefaultValue}
						placeholder={translatedPlaceholder}
						type={fieldType}
						value={inputValue}
						onBlur={handleBlur}
						onChange={handleChange}
					/>
					{endContent ? (
						<InputGroup.Suffix className={classNames?.suffix}>
							{translateNode(endContent, t)}
						</InputGroup.Suffix>
					) : null}
				</InputGroup>
			) : (
				<HeroInput
					{...restInputProps}
					className={cn(inputClassName, classNames?.input)}
					defaultValue={inputDefaultValue}
					placeholder={translatedPlaceholder}
					type={fieldType}
					value={inputValue}
					variant={variant}
					onBlur={handleBlur}
					onChange={handleChange}
				/>
			)}
			{translatedDescription ? (
				<Description className={classNames?.description}>
					{translateNode(translatedDescription, t)}
				</Description>
			) : null}
			{isInvalid || errorMessage ? (
				<FieldError className={classNames?.error}>
					{errorMessage ? translateNode(errorMessage, t) : undefined}
				</FieldError>
			) : null}
		</HeroTextField>
	);
});
