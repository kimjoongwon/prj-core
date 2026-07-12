import {
	cn,
	Description,
	FieldError,
	Input as HeroInput,
	TextField as HeroTextField,
	InputGroup,
	Label,
} from "@heroui/react";
import type {
	ChangeEventHandler,
	ComponentProps,
	FocusEventHandler,
} from "react";
import { translateNode, useT } from "../../i18n";
import type { TextFieldProps } from "./TextField.props";
import { resolveTextFieldValue } from "./text-field-value.resolver";

export const TextField = (props: TextFieldProps) => {
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
		onFocus,
		onValueChange,
		placeholder,
		size: _size,
		startContent,
		type,
		value,
		variant,
		"aria-label": ariaLabelProp,
		...rest
	} = props;
	const {
		className: inputClassName,
		placeholder: inputPlaceholder,
		size: _inputSize,
		type: inputType,
		...restInputProps
	} = inputProps ?? {};
	const translatedDescription = description ?? helperText;
	const hasInputGroup = Boolean(startContent || endContent);
	const fieldType = type ?? inputType;
	const fieldPlaceholder = placeholder ?? inputPlaceholder;
	const fieldVariant =
		variant === "primary" || variant === "secondary" ? variant : undefined;
	const translatedPlaceholder =
		typeof fieldPlaceholder === "string"
			? t(fieldPlaceholder)
			: fieldPlaceholder;
	const ariaLabel =
		typeof ariaLabelProp === "string"
			? t(ariaLabelProp)
			: typeof label === "string"
				? t(label)
				: typeof fieldPlaceholder === "string"
					? t(fieldPlaceholder)
					: ariaLabelProp;
	const inputValue = value === undefined ? undefined : String(value);
	const inputDefaultValue =
		defaultValue === undefined ? undefined : String(defaultValue);
	const textFieldProps = rest as ComponentProps<typeof HeroTextField>;

	const handleChange: ChangeEventHandler<HTMLInputElement> = (event) => {
		const nextValue = event.target.value;

		onChange?.(resolveTextFieldValue(nextValue, fieldType));
		onValueChange?.(nextValue);
	};

	const handleBlur: ChangeEventHandler<HTMLInputElement> = (event) => {
		onBlur?.(resolveTextFieldValue(event.target.value, fieldType));
	};

	const handleFocus: FocusEventHandler<HTMLInputElement> = (event) => {
		onFocus?.(resolveTextFieldValue(event.target.value, fieldType));
	};

	return (
		<HeroTextField
			{...textFieldProps}
			aria-label={ariaLabel}
			className={cn(className, classNames?.base)}
			isDisabled={isDisabled}
			isInvalid={isInvalid}
			isReadOnly={isReadOnly}
			isRequired={isRequired}
			variant={fieldVariant}
		>
			{label ? (
				<Label className={classNames?.label}>{translateNode(label, t)}</Label>
			) : null}
			{hasInputGroup ? (
				<InputGroup
					{...inputGroupProps}
					className={cn(
						inputGroupProps?.className,
						classNames?.inputGroup,
						classNames?.inputWrapper,
					)}
					variant={fieldVariant}
				>
					{startContent ? (
						<InputGroup.Prefix className={classNames?.prefix}>
							{translateNode(startContent, t)}
						</InputGroup.Prefix>
					) : null}
					<InputGroup.Input
						{...restInputProps}
						aria-label={ariaLabel}
						className={cn(inputClassName, classNames?.input)}
						defaultValue={inputDefaultValue}
						placeholder={translatedPlaceholder}
						type={fieldType}
						value={inputValue}
						onBlur={handleBlur}
						onChange={handleChange}
						onFocus={handleFocus}
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
					aria-label={ariaLabel}
					className={cn(inputClassName, classNames?.input)}
					defaultValue={inputDefaultValue}
					placeholder={translatedPlaceholder}
					type={fieldType}
					value={inputValue}
					variant={fieldVariant}
					onBlur={handleBlur}
					onChange={handleChange}
					onFocus={handleFocus}
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
};
