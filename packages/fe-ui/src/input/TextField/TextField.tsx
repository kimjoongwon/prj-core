import { useInputStateInspection } from "@cocrepo/hook";
import {
	cn,
	Description,
	FieldError,
	Input as HeroInput,
	TextField as HeroTextField,
	InputGroup,
	Label,
} from "@heroui/react";
import { makeAutoObservable } from "mobx";
import { observer, useLocalObservable } from "mobx-react-lite";
import type {
	ChangeEventHandler,
	ComponentProps,
	FocusEventHandler,
} from "react";
import { useCallback, useEffect, useId } from "react";
import { translateNode, useT } from "../../i18n";
import type { TextFieldProps } from "./TextField.props";
import { resolveTextFieldValue } from "./text-field-value.resolver";

export function createTextFieldState(initialValue: string | number = "") {
	return makeAutoObservable(
		{
			value: initialValue,
			setValue(nextValue: string | number) {
				this.value = nextValue;
			},
		},
		{},
		{ autoBind: true, name: "TextFieldState" },
	);
}
export type TextFieldState = ReturnType<typeof createTextFieldState>;

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
	const inputDefaultValue =
		defaultValue === undefined ? undefined : String(defaultValue);
	const textFieldProps = rest as ComponentProps<typeof HeroTextField>;
	const internalState = useLocalObservable(() =>
		createTextFieldState(defaultValue ?? ""),
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

	const handleChange: ChangeEventHandler<HTMLInputElement> = (event) => {
		const nextValue = event.target.value;
		if (!isControlled)
			internalState.setValue(resolveTextFieldValue(nextValue, fieldType));

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
						defaultValue={isControlled ? undefined : inputDefaultValue}
						placeholder={translatedPlaceholder}
						type={fieldType}
						value={String(selectedValue)}
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
					defaultValue={isControlled ? undefined : inputDefaultValue}
					placeholder={translatedPlaceholder}
					type={fieldType}
					value={String(selectedValue)}
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
});
