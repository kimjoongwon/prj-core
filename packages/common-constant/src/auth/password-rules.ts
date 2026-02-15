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

/** 비밀번호 정책 규칙 목록 */
export const PASSWORD_RULES: PasswordRule[] = [
	{
		rule: "minLength",
		label: "8자 이상",
		test: (pw: string) => pw.length >= 8,
	},
	{
		rule: "maxLength",
		label: "128자 이하",
		test: (pw: string) => pw.length <= 128,
	},
	{
		rule: "uppercase",
		label: "영문 대문자 포함",
		test: (pw: string) => /[A-Z]/.test(pw),
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
		test: (pw: string) =>
			/[!@#$%^&*()_+\-=\[\]{}|;:,.<>?/~`"']/.test(pw),
	},
];
