import {
	InquiryPriorityOptions,
	type InquiryPriority as InquiryPriorityType,
} from "@cocrepo/enum";
import type { Option } from "@cocrepo/type";
import { Select, type SelectProps } from "../Select/Select";

export interface InquiryPrioritySelectProps
	extends Omit<SelectProps, "options" | "value" | "onChange"> {
	/** 선택된 우선순위 값 */
	value?: InquiryPriorityType;
	/** 값 변경 핸들러 */
	onChange?: (value: InquiryPriorityType) => void;
	/** 커스텀 옵션 (전체 옵션을 덮어씌움) */
	customOptions?: Option[];
}

/**
 * 문의 우선순위 선택 컴포넌트
 * 문의의 우선순위를 선택하는 드롭다운입니다.
 *
 * @example
 * ```tsx
 * <InquiryPrioritySelect
 *   label="우선순위"
 *   value={priority}
 *   onChange={setPriority}
 *   isRequired
 * />
 * ```
 */
export const InquiryPrioritySelect = (props: InquiryPrioritySelectProps) => {
	const { value, onChange, customOptions, ...rest } = props;

	const options = customOptions ?? InquiryPriorityOptions;

	const handleChange = (selectedValue: string) => {
		onChange?.(selectedValue as InquiryPriorityType);
	};

	return (
		<Select
			label="우선순위"
			placeholder="우선순위를 선택하세요"
			options={options}
			value={value}
			onChange={handleChange}
			{...rest}
		/>
	);
};
