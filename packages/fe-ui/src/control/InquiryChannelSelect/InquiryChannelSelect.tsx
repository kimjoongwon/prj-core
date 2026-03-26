import {
	InquiryChannel,
	InquiryChannelOptions,
	type InquiryChannel as InquiryChannelType,
} from "@cocrepo/enum";
import type { Option } from "@cocrepo/type";
import { Select, type SelectProps } from "../Select/Select";

export interface InquiryChannelSelectProps
	extends Omit<SelectProps, "options" | "value" | "onChange"> {
	/** 선택된 채널 값 */
	value?: InquiryChannelType;
	/** 값 변경 핸들러 */
	onChange?: (value: InquiryChannelType) => void;
	/** 커스텀 옵션 (전체 옵션을 덮어씌움) */
	customOptions?: Option[];
}

/**
 * 문의 접수 채널 선택 컴포넌트
 * 문의가 접수된 채널을 선택하는 드롭다운입니다.
 *
 * @example
 * ```tsx
 * <InquiryChannelSelect
 *   label="접수 채널"
 *   value={channel}
 *   onChange={setChannel}
 *   isRequired
 * />
 * ```
 */
export const InquiryChannelSelect = (props: InquiryChannelSelectProps) => {
	const { value, onChange, customOptions, ...rest } = props;

	const options = customOptions ?? InquiryChannelOptions;

	const handleChange = (selectedValue: string) => {
		onChange?.(selectedValue as InquiryChannelType);
	};

	return (
		<Select
			label="접수 채널"
			placeholder="채널을 선택하세요"
			options={options}
			value={value}
			onChange={handleChange}
			{...rest}
		/>
	);
};
