import { useInputStateInspection } from "@cocrepo/hook";
import { cloneDeep } from "@cocrepo/toolkit";
import {
	Description,
	FieldError,
	Select as HeroSelect,
	Label,
	ListBox,
} from "@heroui/react";
import { makeAutoObservable } from "mobx";
import { observer, useLocalObservable } from "mobx-react-lite";
import type { ComponentProps, ReactNode } from "react";
import { useCallback, useEffect, useId } from "react";
import type { Key } from "react-aria-components";
import { useT } from "../../i18n";

type SelectOption = {
	value: unknown;
	text?: string;
	label?: string;
};

export interface SelectProps<T extends object = object>
	extends Omit<
		ComponentProps<typeof HeroSelect<T>>,
		| "children"
		| "defaultItems"
		| "items"
		| "onChange"
		| "placeholder"
		| "value"
		| "variant"
	> {
	/** 선택 옵션 목록 */
	options?: SelectOption[];
	/** 선택된 값 */
	value?: Key | null;
	/** 값 변경 핸들러 */
	onChange?: (value: Key | null) => void;
	onValueChange?: (value: string) => void;
	/** 크기 */
	size?: "sm" | "md" | "lg";
	/** 변형 */
	variant?:
		| "flat"
		| "bordered"
		| "underlined"
		| "faded"
		| "primary"
		| "secondary";
	/** 라벨 */
	label?: ReactNode;
	labelPlacement?: string;
	/** 플레이스홀더 */
	placeholder?: ReactNode;
	/** 에러 메시지 */
	errorMessage?: ReactNode;
	/** 설명 */
	description?: ReactNode;
	defaultItems?: Iterable<T>;
	items?: Iterable<T>;
	children?: ReactNode | ((item: T) => ReactNode);
	classNames?: Record<string, string>;
	isClearable?: boolean;
	onClear?: () => void;
}

/**
 * Select 컴포넌트
 * HeroUI Select의 래퍼로, Option 배열 기반으로 동작합니다.
 */
export function createSelectState(initialValue: Key | null = null) {
	return makeAutoObservable(
		{
			value: initialValue,
			setValue(nextValue: Key | null) {
				this.value = nextValue;
			},
		},
		{},
		{ autoBind: true, name: "SelectState" },
	);
}
export type SelectState = ReturnType<typeof createSelectState>;

export const Select = observer(function Select<T extends object = object>(
	props: SelectProps<T>,
) {
	const t = useT();
	const {
		children,
		classNames,
		defaultItems,
		defaultSelectedKey,
		defaultValue,
		description,
		errorMessage,
		isClearable: _isClearable,
		items,
		label,
		labelPlacement: _labelPlacement,
		onChange,
		onClear: _onClear,
		onValueChange,
		options = [],
		placeholder,
		size: _size,
		value,
		variant = "bordered",
		"aria-label": ariaLabelProp,
		...rest
	} = props;
	const internalState = useLocalObservable(() =>
		createSelectState(
			(defaultValue as Key | null | undefined) ??
			(defaultSelectedKey as Key | null | undefined) ?? null,
		),
	);
	const inputStateId = useId();
	const inspection = useInputStateInspection();
	const isControlled = value !== undefined;
	const selectedValue = isControlled ? value : internalState.value;
	// ListBox item ids are serialized strings; normalize numeric keys for HeroUI
	// while retaining the public numeric value in the selected-state reader.
	const heroSelectedValue =
		typeof selectedValue === "number" ? String(selectedValue) : selectedValue;
	const reader = useCallback(
		() => (isControlled ? value : internalState.value),
		[internalState, isControlled, value],
	);
	useEffect(
		() => inspection?.registerInputState(inputStateId, reader),
		[inspection, inputStateId, reader, selectedValue],
	);

	const _options = cloneDeep(options);
	const ariaLabel =
		typeof ariaLabelProp === "string"
			? t(ariaLabelProp)
			: typeof label === "string"
				? t(label)
				: typeof placeholder === "string"
					? t(placeholder)
					: t("선택");

	const handleChange = (key: Key | null) => {
		const stringValue = key == null ? "" : String(key);
		if (!isControlled) internalState.setValue(key);
		onValueChange?.(stringValue);
		onChange?.(key);
	};

	return (
		<HeroSelect<T>
			{...rest}
			className={classNames?.base ?? rest.className}
			items={items ?? defaultItems}
			value={heroSelectedValue as Key | null | undefined}
			onChange={handleChange}
			aria-label={ariaLabel}
			variant={
				variant === "primary" || variant === "secondary" ? variant : undefined
			}
		>
			{label ? (
				<Label>{typeof label === "string" ? t(label) : label}</Label>
			) : null}
			<HeroSelect.Trigger className={classNames?.trigger}>
				<HeroSelect.Value className={classNames?.value}>
					{({ defaultChildren, isPlaceholder }) =>
						isPlaceholder
							? typeof placeholder === "string"
								? t(placeholder)
								: placeholder
							: defaultChildren}
				</HeroSelect.Value>
				<HeroSelect.Indicator className={classNames?.indicator} />
			</HeroSelect.Trigger>
			<HeroSelect.Popover className={classNames?.popover}>
				<ListBox<T> className={classNames?.listbox}>
					{children
						? (children as ReactNode)
						: _options.map((option) => (
								<ListBox.Item
									key={String(option.value)}
									id={String(option.value)}
									textValue={String(
										option.text ?? option.label ?? option.value,
									)}
								>
									{typeof (option.text ?? option.label) === "string"
										? t((option.text ?? option.label) as string)
										: String(option.value)}
									<ListBox.ItemIndicator />
								</ListBox.Item>
							))}
				</ListBox>
			</HeroSelect.Popover>
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
		</HeroSelect>
	);
});
