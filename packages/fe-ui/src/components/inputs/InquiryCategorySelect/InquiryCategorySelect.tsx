import {
	InquiryCategory,
	InquiryCategoryOptions,
	type InquiryCategory as InquiryCategoryType,
} from "@cocrepo/enum";
import type { Option } from "@cocrepo/type";
import { Select, type SelectProps } from "../Select/Select";

export interface InquiryCategorySelectProps
	extends Omit<SelectProps, "options" | "value" | "onChange"> {
	/** 선택된 카테고리 값 */
	value?: InquiryCategoryType;
	/** 값 변경 핸들러 */
	onChange?: (value: InquiryCategoryType) => void;
	/** 커스텀 옵션 (전체 옵션을 덮어씌움) */
	customOptions?: Option[];
}

/**
 * 문의 카테고리 선택 컴포넌트
 * 문의의 카테고리를 선택하는 드롭다운입니다.
 *
 * @example
 * ```tsx
 * <InquiryCategorySelect
 *   label="카테고리"
 *   value={category}
 *   onChange={setCategory}
 *   isRequired
 * />
 * ```
 */
export const InquiryCategorySelect = (props: InquiryCategorySelectProps) => {
	const { value, onChange, customOptions, ...rest } = props;

	const options = customOptions ?? InquiryCategoryOptions;

	const handleChange = (selectedValue: string) => {
		onChange?.(selectedValue as InquiryCategoryType);
	};

	return (
		<Select
			label="카테고리"
			placeholder="카테고리를 선택하세요"
			options={options}
			value={value}
			onChange={handleChange}
			{...rest}
		/>
	);
};
