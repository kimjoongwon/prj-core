/**
 * 검증 메시지 상수
 *
 * 프론트엔드/백엔드 공유 검증 메시지
 * 향후 i18n 지원을 위해 메시지를 중앙 집중화
 */
export const VALIDATION_MESSAGES = {
	// 필수 값
	REQUIRED: "필수 입력 항목입니다.",

	// 타입 검증
	STRING_TYPE: "문자열 형식이 아닙니다.",
	NUMBER_TYPE: "숫자 형식이 아닙니다.",
	BOOLEAN_TYPE: "불리언 형식이 아닙니다.",
	DATE_TYPE: "날짜 형식이 아닙니다.",
	ARRAY_TYPE: "배열 형식이 아닙니다.",

	// 문자열 길이
	MIN_LENGTH: (min: number) => `최소 ${min}자 이상 입력해주세요.`,
	MAX_LENGTH: (max: number) => `최대 ${max}자까지 입력 가능합니다.`,
	LENGTH_RANGE: (min: number, max: number) =>
		`${min}자 이상 ${max}자 이하로 입력해주세요.`,

	// 숫자 범위
	MIN_VALUE: (min: number) => `${min} 이상의 값을 입력해주세요.`,
	MAX_VALUE: (max: number) => `${max} 이하의 값을 입력해주세요.`,
	VALUE_RANGE: (min: number, max: number) =>
		`${min} 이상 ${max} 이하의 값을 입력해주세요.`,

	// 포맷 검증
	INVALID_FORMAT: (pattern: string) => `형식이 올바르지 않습니다. (${pattern})`,
	EMAIL_FORMAT: "유효한 이메일 주소를 입력해주세요.",
	PHONE_FORMAT: "유효한 전화번호를 입력해주세요.",
	URL_FORMAT: "유효한 URL을 입력해주세요.",
	UUID_FORMAT: "유효한 UUID 형식이 아닙니다.",

	// 비밀번호
	PASSWORD_MIN_LENGTH: (min: number) =>
		`비밀번호는 최소 ${min}자 이상이어야 합니다.`,
	PASSWORD_WEAK:
		"비밀번호는 영문 대/소문자, 숫자, 특수문자 중 3가지 이상을 포함해야 합니다.",
	PASSWORD_MISMATCH: "비밀번호가 일치하지 않습니다.",

	// 열거형
	INVALID_ENUM: (values: string[]) =>
		`다음 중 하나를 선택해주세요: ${values.join(", ")}`,

	// 배열
	ARRAY_MIN_SIZE: (min: number) => `최소 ${min}개 이상 선택해주세요.`,
	ARRAY_MAX_SIZE: (max: number) => `최대 ${max}개까지 선택 가능합니다.`,
	ARRAY_UNIQUE: "중복된 값이 있습니다.",
} as const;

export type ValidationMessageKey = keyof typeof VALIDATION_MESSAGES;
