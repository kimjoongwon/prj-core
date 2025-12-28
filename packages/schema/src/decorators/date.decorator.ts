import { Type } from "class-transformer";
import { IsDate, IsNotEmpty, IsOptional, MaxDate, MinDate } from "class-validator";
import { VALIDATION_MESSAGES } from "../constants/validation-messages";
import { applyDecorators } from "./apply";

export interface DateDecoratorOptions {
	/** 필수 여부 (기본값: true) */
	required?: boolean;
	/** 최소 날짜 */
	minDate?: Date | (() => Date);
	/** 최대 날짜 */
	maxDate?: Date | (() => Date);
}

/**
 * 날짜 필드 데코레이터 (순수 class-validator)
 *
 * 문자열/숫자를 Date 객체로 자동 변환
 *
 * @example
 * ```typescript
 * class EventSchema {
 *   @DateField()
 *   startDate: Date;
 *
 *   @DateField({ minDate: () => new Date() })
 *   futureDate: Date;
 * }
 * ```
 */
export function DateField(
	options: DateDecoratorOptions = {},
): PropertyDecorator {
	const { required = true, minDate, maxDate } = options;

	const decorators: PropertyDecorator[] = [
		Type(() => Date),
		IsDate({ message: VALIDATION_MESSAGES.DATE_TYPE }),
	];

	if (required) {
		decorators.push(IsNotEmpty({ message: VALIDATION_MESSAGES.REQUIRED }));
	} else {
		decorators.push(IsOptional());
	}

	if (minDate) {
		const date = typeof minDate === "function" ? minDate() : minDate;
		decorators.push(MinDate(date));
	}

	if (maxDate) {
		const date = typeof maxDate === "function" ? maxDate() : maxDate;
		decorators.push(MaxDate(date));
	}

	return applyDecorators(...decorators);
}

/**
 * 선택적 날짜 필드 데코레이터
 */
export function DateFieldOptional(
	options: Omit<DateDecoratorOptions, "required"> = {},
): PropertyDecorator {
	return DateField({ ...options, required: false });
}
