import {
	InquirySourceOptions,
	type InquirySource as InquirySourceType,
} from "@cocrepo/enum";
import type { Option } from "@cocrepo/type";
import { Select, type SelectProps } from "../Select/Select";

export interface InquirySourceSelectProps
	extends Omit<SelectProps, "options" | "value" | "onChange"> {
	/** 선택된 접수 유형 값 */
	value?: InquirySourceType;
	/** 값 변경 핸들러 */
	onChange?: (value: InquirySourceType) => void;
	/** 커스텀 옵션 (전체 옵션을 덮어씌움) */
	customOptions?: Option[];
}

/**
 * 문의 접수 유형 선택 컴포넌트
 * 문의의 접수 유형(온라인/오프라인)을 선택하는 드롭다운입니다.
 *
 * @example
 * ```tsx
 * <InquirySourceSelect
 *   label="접수 유형"
 *   value={source}
 *   onChange={setSource}
 *   isRequired
 * />
 * ```
 */
export const InquirySourceSelect = (props: InquirySourceSelectProps) => {
	const { value, onChange, customOptions, ...rest } = props;

	const options = customOptions ?? InquirySourceOptions;

	const handleChange = (selectedValue: string) => {
		onChange?.(selectedValue as InquirySourceType);
	};

	return (
		<Select
			label="접수 유형"
			placeholder="접수 유형을 선택하세요"
			options={options}
			value={value}
			onChange={handleChange}
			{...rest}
		/>
	);
};
