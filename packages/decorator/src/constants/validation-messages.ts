/**
 * 검증 메시지 상수
 *
 * 향후 i18n 지원을 위해 메시지를 중앙 집중화
 */
export const VALIDATION_MESSAGES = {
	// 타입 검증
	STRING_TYPE: "문자열 형식이 아닙니다.",
	NUMBER_TYPE: "숫자 형식이 아닙니다.",
	BOOLEAN_TYPE: "불리언 형식이 아닙니다.",
	DATE_TYPE: "날짜 형식이 아닙니다.",

	// 포맷 검증
	INVALID_FORMAT: (pattern: string) => `형식이 올바르지 않습니다. (${pattern})`,
	EMAIL_FORMAT: "이메일 형식이 아닙니다.",
	PHONE_FORMAT: "전화번호 형식이 아닙니다.",
	URL_FORMAT: "URL 형식이 아닙니다.",
	UUID_FORMAT: "UUID 형식이 아닙니다.",

	// 비밀번호
	PASSWORD_WEAK:
		"비밀번호는 최소 6자 이상이며, 영문, 숫자, 특수문자를 포함해야 합니다.",
} as const;
