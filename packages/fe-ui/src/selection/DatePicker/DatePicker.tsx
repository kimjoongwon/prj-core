import { DatePicker as HeroUiDatePicker } from "@heroui/react";
import type {
	CalendarDate,
	CalendarDateTime,
	ZonedDateTime,
} from "@internationalized/date";

export interface DatePickerProps {
	/** 선택된 날짜 값 */
	value?: CalendarDate | CalendarDateTime | ZonedDateTime;
	/** 날짜 변경 핸들러 (ISO 문자열 반환) */
	onChange?: (value: string) => void;
	[key: string]: unknown;
}

/**
 * DatePicker 컴포넌트
 * 날짜 선택 컴포넌트입니다. 변경 시 ISO 문자열을 반환합니다.
 *
 * @example
 * ```tsx
 * import { parseAbsoluteToLocal } from "@internationalized/date";
 *
 * <DatePicker
 *   label="생년월일"
 *   value={birthDate ? parseAbsoluteToLocal(birthDate) : undefined}
 *   onChange={setBirthDate}
 * />
 * ```
 */
export const DatePicker = (props: DatePickerProps) => {
	const { value, onChange, ...rest } = props;

	const handleDateChange = (
		dateValue: CalendarDate | CalendarDateTime | ZonedDateTime | null,
	) => {
		if (!onChange || !dateValue) {
			return;
		}

		if (
			"toAbsoluteString" in dateValue &&
			typeof dateValue.toAbsoluteString === "function"
		) {
			onChange(dateValue.toAbsoluteString());
			return;
		}

		onChange(dateValue.toString());
	};

	return (
		<HeroUiDatePicker
			{...(rest as object)}
			hideTimeZone
			value={value as never}
			onChange={handleDateChange as never}
		/>
	);
};
