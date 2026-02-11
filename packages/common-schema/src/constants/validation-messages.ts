/**
 * 검증 메시지 번역 키 상수
 *
 * i18n 시스템 통합: 실제 메시지는 JSON 파일에서 번역됨
 * DTO에서 nestjs-i18n의 i18nValidationMessage를 사용하여 변수 치환 지원
 *
 * @example
 * import { i18nValidationMessage } from 'nestjs-i18n';
 *
 * @IsEmail({}, { message: i18nValidationMessage(VALIDATION_MESSAGES.EMAIL_FORMAT) })
 * email: string;
 *
 * @MinLength(8, { message: i18nValidationMessage(VALIDATION_MESSAGES.MIN_LENGTH, { min: 8 }) })
 * password: string;
 */
export const VALIDATION_MESSAGES = {
	// 필수 값
	REQUIRED: "validation.required",

	// 타입 검증
	STRING_TYPE: "validation.stringType",
	NUMBER_TYPE: "validation.numberType",
	BOOLEAN_TYPE: "validation.booleanType",
	DATE_TYPE: "validation.date",
	ARRAY_TYPE: "validation.arrayType",

	// 문자열 길이 (변수: {{min}}, {{max}})
	MIN_LENGTH: "validation.minLength",
	MAX_LENGTH: "validation.maxLength",

	// 숫자 범위 (변수: {{min}}, {{max}})
	MIN_VALUE: "validation.min",
	MAX_VALUE: "validation.max",

	// 포맷 검증
	INVALID_FORMAT: "validation.pattern",
	EMAIL_FORMAT: "validation.emailFormat",
	PHONE_FORMAT: "validation.pattern",
	URL_FORMAT: "validation.url",
	UUID_FORMAT: "validation.uuid",

	// 비밀번호
	PASSWORD_MIN_LENGTH: "validation.minLength",
	PASSWORD_WEAK: "validation.pattern",
	PASSWORD_MISMATCH: "validation.pattern",

	// 열거형
	INVALID_ENUM: "validation.enum",

	// 배열
	ARRAY_MIN_SIZE: "validation.minLength",
	ARRAY_MAX_SIZE: "validation.maxLength",
	ARRAY_UNIQUE: "validation.unique",
} as const;

export type ValidationMessageKey = keyof typeof VALIDATION_MESSAGES;
