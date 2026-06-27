/**
 * 비밀번호 정책 규칙
 *
 * 비밀번호 재설정, 비밀번호 변경 등에서 공통으로 사용하는 비밀번호 검증 규칙입니다.
 */

export interface PasswordRule {
	/** 규칙 식별자 */
	rule: string;
	/** 사용자에게 보여줄 레이블 */
	label: string;
	/** 비밀번호 검증 함수 */
	test: (password: string) => boolean;
}

/** 새 비밀번호에 적용하는 기본 최소 길이 */
export const DEFAULT_PASSWORD_MIN_LENGTH = 10;

/** bcrypt 기반 해시에서 안전하게 처리하는 최대 길이 */
export const DEFAULT_PASSWORD_MAX_LENGTH = 72;

/** 새 비밀번호에서 대문자 필수 여부 */
export const DEFAULT_PASSWORD_REQUIRE_UPPERCASE = false;

/** 새 비밀번호에서 소문자 필수 여부 */
export const DEFAULT_PASSWORD_REQUIRE_LOWERCASE = true;

/** 새 비밀번호에서 숫자 필수 여부 */
export const DEFAULT_PASSWORD_REQUIRE_NUMBER = true;

/** 새 비밀번호에서 특수문자 필수 여부 */
export const DEFAULT_PASSWORD_REQUIRE_SPECIAL = true;

/** 최근 비밀번호 재사용 제한 개수 */
export const DEFAULT_PASSWORD_REUSE_LIMIT = 3;

/** 운영 초기 단계에서 차단할 기본 common password 목록 */
export const COMMON_PASSWORD_BLOCKLIST = [
	"password",
	"password1",
	"password123",
	"admin",
	"admin123",
	"admin1234",
	"qwerty",
	"qwerty123",
	"12345678",
	"123456789",
	"11111111",
	"00000000",
	"plate1234",
] as const;

/** 비밀번호 정책 규칙 목록 */
export const PASSWORD_RULES: PasswordRule[] = [
	{
		rule: "minLength",
		label: `${DEFAULT_PASSWORD_MIN_LENGTH}자 이상`,
		test: (pw: string) => pw.length >= DEFAULT_PASSWORD_MIN_LENGTH,
	},
	{
		rule: "maxLength",
		label: `${DEFAULT_PASSWORD_MAX_LENGTH}자 이하`,
		test: (pw: string) => pw.length <= DEFAULT_PASSWORD_MAX_LENGTH,
	},
	{
		rule: "lowercase",
		label: "영문 소문자 포함",
		test: (pw: string) => /[a-z]/.test(pw),
	},
	{
		rule: "number",
		label: "숫자 포함",
		test: (pw: string) => /[0-9]/.test(pw),
	},
	{
		rule: "special",
		label: "특수문자 포함",
		test: (pw: string) => /[!@#$%^&*()_+\-=[\]{}|;:,.<>?/~`"']/.test(pw),
	},
	{
		rule: "notCommon",
		label: "흔한 비밀번호 사용 금지",
		test: (pw: string) => !isCommonPassword(pw),
	},
];

/**
 * common password 목록과 비교하기 위해 대소문자와 기호 차이를 줄입니다.
 */
export function normalizePasswordForBlocklist(password: string): string {
	return password.toLowerCase().replace(/[^a-z0-9]/g, "");
}

/**
 * 운영 초기 단계에서 차단할 정도로 흔한 비밀번호인지 확인합니다.
 */
export function isCommonPassword(password: string): boolean {
	const normalizedPassword = normalizePasswordForBlocklist(password);
	return COMMON_PASSWORD_BLOCKLIST.some(
		(blockedPassword) =>
			normalizePasswordForBlocklist(blockedPassword) === normalizedPassword,
	);
}
