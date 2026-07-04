/**
 * 검증 메시지 번역 키 상수
 *
 * i18n 시스템 통합: 한국어 문장을 translation key로 사용하고, 실제 표시 문구는
 * seed translation에서 언어별로 변환됩니다.
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
	REQUIRED: "필수 입력 항목입니다",

	// 타입 검증
	STRING_TYPE: "문자열 형식이 아닙니다",
	NUMBER_TYPE: "숫자 형식이 아닙니다",
	BOOLEAN_TYPE: "논리값 형식이 아닙니다",
	DATE_TYPE: "날짜 형식이 아닙니다",
	ARRAY_TYPE: "배열 형식이 아닙니다",

	// 문자열 길이 (변수: {{min}}, {{max}})
	MIN_LENGTH: "최소 {{min}}자 이상 입력해주세요",
	MAX_LENGTH: "최대 {{max}}자까지 입력 가능합니다",

	// 숫자 범위 (변수: {{min}}, {{max}})
	MIN_VALUE: "최소 {{min}} 이상이어야 합니다",
	MAX_VALUE: "최대 {{max}} 이하여야 합니다",

	// 날짜 범위 (변수: {{min}}, {{max}})
	MIN_DATE: "최소 날짜 이후로 입력해주세요",
	MAX_DATE: "최대 날짜 이전으로 입력해주세요",

	// 포맷 검증
	INVALID_FORMAT: "올바른 형식이 아닙니다",
	EMAIL_FORMAT: "유효한 이메일 주소를 입력해주세요",
	PHONE_FORMAT: "올바른 형식이 아닙니다",
	URL_FORMAT: "유효한 URL을 입력해주세요",
	UUID_FORMAT: "유효한 UUID를 입력해주세요",

	// 비밀번호
	PASSWORD_MIN_LENGTH: "최소 {{min}}자 이상 입력해주세요",
	PASSWORD_WEAK: "올바른 형식이 아닙니다",
	PASSWORD_MISMATCH: "올바른 형식이 아닙니다",

	// 열거형
	INVALID_ENUM: "허용된 값이 아닙니다",

	// 배열
	ARRAY_MIN_SIZE: "최소 {{min}}자 이상 입력해주세요",
	ARRAY_MAX_SIZE: "최대 {{max}}자까지 입력 가능합니다",
	ARRAY_UNIQUE: "중복 없이 입력해주세요",
} as const;

export type ValidationMessageKey = keyof typeof VALIDATION_MESSAGES;
