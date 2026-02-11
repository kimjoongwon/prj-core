import { cloneDeep } from "@cocrepo/toolkit";
import type { Option } from "@cocrepo/type";
import {
	Select as NextSelect,
	type SelectProps as NextUISelectProps,
	SelectItem,
} from "@heroui/react";
import type React from "react";

export interface SelectProps
	extends Omit<NextUISelectProps, "children" | "onChange" | "selectedKeys"> {
	/** 선택 옵션 목록 */
	options?: Option[];
	/** 선택된 값 */
	value?: string;
	/** 값 변경 핸들러 */
	onChange?: (value: string) => void;
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
	const { options = [], value, onChange, ...rest } = props;

	const _options = cloneDeep(options);

	const handleChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
		onChange?.(e.target.value);
	};

	return (
		<NextSelect
			variant="bordered"
			{...rest}
			onChange={handleChange}
			selectedKeys={value ? [value] : undefined}
		>
			{_options.map((option) => {
				return (
					<SelectItem key={option.value} textValue={option.value}>
						{option.text}
					</SelectItem>
				);
			})}
		</NextSelect>
	);
};
