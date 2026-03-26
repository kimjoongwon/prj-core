import {
	type InquiryStatus as InquiryStatusType,
	InquiryStatusOptions,
	getAllowedStatusOptions,
} from "@cocrepo/enum";
import type { Option } from "@cocrepo/type";
import { Select, type SelectProps } from "../Select/Select";

export interface InquiryStatusSelectProps
	extends Omit<SelectProps, "options" | "value" | "onChange"> {
	/** 선택된 상태 값 */
	value?: InquiryStatusType;
	/** 값 변경 핸들러 */
	onChange?: (value: InquiryStatusType) => void;
	/** 현재 상태 (상태 전환 규칙 적용 시 사용) */
	currentStatus?: InquiryStatusType;
	/** 상태 전환 규칙 적용 여부 */
	applyTransitionRules?: boolean;
	/** 커스텀 옵션 (전체 옵션을 덮어씌움) */
	customOptions?: Option[];
}

/**
 * 문의 상태 선택 컴포넌트
 * 문의의 처리 상태를 선택하는 드롭다운입니다.
 * 상태 전환 규칙을 적용하여 허용된 상태만 선택할 수 있습니다.
 *
 * @example
 * ```tsx
 * // 기본 사용 (모든 상태 표시)
 * <InquiryStatusSelect
 *   label="상태"
 *   value={status}
 *   onChange={setStatus}
 * />
 *
 * // 상태 전환 규칙 적용
 * <InquiryStatusSelect
 *   label="상태"
 *   value={status}
 *   onChange={setStatus}
 *   currentStatus="IN_PROGRESS"
 *   applyTransitionRules
 * />
 * ```
 */
export const InquiryStatusSelect = (props: InquiryStatusSelectProps) => {
	const {
		value,
		onChange,
		currentStatus,
		applyTransitionRules = false,
		customOptions,
		...rest
	} = props;

	// 상태 전환 규칙 적용 시 허용된 상태만 표시
	const options =
		customOptions ??
		(applyTransitionRules && currentStatus
			? getAllowedStatusOptions(currentStatus)
			: InquiryStatusOptions);

	const handleChange = (selectedValue: string) => {
		onChange?.(selectedValue as InquiryStatusType);
	};

	return (
		<Select
			label="상태"
			placeholder="상태를 선택하세요"
			options={options}
			value={value}
			onChange={handleChange}
			{...rest}
		/>
	);
};
