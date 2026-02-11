import { Transform } from "class-transformer";
import { IsNotEmpty, IsOptional, Matches } from "class-validator";
import { VALIDATION_MESSAGES } from "../constants/validation-messages";
import { applyDecorators } from "./apply";

export interface PhoneDecoratorOptions {
	/** 필수 여부 (기본값: true) */
	required?: boolean;
}

/**
 * 한국 전화번호 정규식
 * 010-1234-5678, 01012345678, 02-123-4567 등 허용
 */
const KOREA_PHONE_REGEX = /^(01[016789]|02|0[3-9]\d)-?\d{3,4}-?\d{4}$/;

/**
 * 전화번호 필드 데코레이터 (순수 class-validator)
 *
 * 자동으로 하이픈 제거
 *
 * @example
 * ```typescript
 * class UserSchema {
 *   @Phone()
 *   phone: string;
 * }
 * ```
 */
export function Phone(options: PhoneDecoratorOptions = {}): PropertyDecorator {
	const { required = true } = options;

	const decorators: PropertyDecorator[] = [
		Matches(KOREA_PHONE_REGEX, {
			message: VALIDATION_MESSAGES.PHONE_FORMAT,
		}),
		// 하이픈 제거 변환
		Transform(({ value }) =>
			typeof value === "string" ? value.replace(/-/g, "") : value,
		),
	];

	if (required) {
		decorators.push(IsNotEmpty({ message: VALIDATION_MESSAGES.REQUIRED }));
	} else {
		decorators.push(IsOptional());
	}

	return applyDecorators(...decorators);
}

/**
 * 선택적 전화번호 필드 데코레이터
 */
export function PhoneOptional(): PropertyDecorator {
	return Phone({ required: false });
}
