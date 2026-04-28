import { cloneDeep } from "@cocrepo/toolkit";
import type { Option } from "@cocrepo/type";
import { Select as NextSelect, SelectItem } from "@heroui/react";
import type React from "react";

// SelectProps 인터페이스를 독립적으로 정의 (NextUI 제네릭 제거)
export interface SelectProps {
	/** 선택 옵션 목록 */
	options?: Option[];
	/** 선택된 값 */
	value?: string;
	/** 값 변경 핸들러 */
	onChange?: (value: string) => void;
	/** 크기 */
	size?: "sm" | "md" | "lg";
	/** 변형 */
	variant?: "flat" | "bordered" | "underlined" | "faded";
	/** 라벨 */
	label?: string;
	/** 플레이스홀더 */
	placeholder?: string;
	/** 비활성화 여부 */
	isDisabled?: boolean;
	/** 에러 여부 */
	isInvalid?: boolean;
	/** 에러 메시지 */
	errorMessage?: string;
	/** 추가 클래스 */
	className?: string;
	/** 필수 여부 */
	isRequired?: boolean;
	/** 읽기 전용 */
	isReadOnly?: boolean;
	/** 선택된 키 */
	selectedKeys?: string[];
	/** 기타 NextUI props */
	[key: string]: unknown;
}

/**
 * Select 컴포넌트
 * HeroUI Select의 래퍼로, Option 배열 기반으로 동작합니다.
 *
 * @example
 * ```tsx
 * const options = [
 *   { value: "male", text: "남성" },
 *   { value: "female", text: "여성" },
 * ];
 *
 * <Select
 *   label="성별"
 *   options={options}
 *   value={gender}
 *   onChange={setGender}
 * />
 * ```
 */
export const Select = (props: SelectProps) => {
	const {
		options = [],
		value,
		onChange,
		size,
		variant = "bordered",
		label,
		placeholder,
		isDisabled,
		isInvalid,
		errorMessage,
		className,
		isRequired,
		isReadOnly,
		...rest
	} = props;

	const _options = cloneDeep(options);
	const optionKeys = new Set(_options.map((option) => String(option.value)));
	const normalizedSelectedKeys = props.selectedKeys
		?.map((selectedKey) => String(selectedKey))
		.filter((selectedKey) => optionKeys.has(selectedKey));
	const selectedKeys =
		normalizedSelectedKeys && normalizedSelectedKeys.length > 0
			? normalizedSelectedKeys
			: value && optionKeys.has(String(value))
				? [String(value)]
				: undefined;
	const ariaLabel =
		typeof rest["aria-label"] === "string"
			? rest["aria-label"]
			: (label ?? placeholder ?? "선택");

	const handleChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
		onChange?.(e.target.value);
	};

	return (
		<NextSelect
			size={size}
			variant={variant}
			label={label}
			placeholder={placeholder}
			isDisabled={isDisabled}
			isInvalid={isInvalid}
			errorMessage={errorMessage}
			className={className}
			isRequired={isRequired}
			disallowEmptySelection={isReadOnly}
			onChange={handleChange}
			selectedKeys={selectedKeys}
			aria-label={ariaLabel}
			{...rest}
		>
			{_options.map((option) => {
				return (
					<SelectItem
						key={option.value}
						textValue={String(option.text ?? option.value)}
					>
						{option.text}
					</SelectItem>
				);
			})}
		</NextSelect>
	);
};
