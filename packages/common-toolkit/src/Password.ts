/**
 * 비밀번호 정책 검증 유틸리티
 *
 * 프론트엔드(PasswordStrengthIndicator)와 백엔드(PasswordResetService, AuthApplicationService)에서 공용으로 사용합니다.
 */

/** 개별 규칙 검증 결과 */
export interface PasswordPolicyRule {
	rule: string;
	label: string;
	passed: boolean;
}

/** 비밀번호 정책 검증 결과 */
export interface PasswordPolicyResult {
	isValid: boolean;
	rules: PasswordPolicyRule[];
}

/** 비밀번호 정책 규칙 정의 */
const PASSWORD_RULES = [
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
		test: (pw: string) => /[!@#$%^&*()_+\-=\[\]{}|;:,.<>?/~`"']/.test(pw),
	},
] as const;

/**
 * 비밀번호 정책을 검증합니다.
 *
 * @param password - 검증할 비밀번호
 * @returns 전체 유효 여부 + 각 규칙별 통과/미달 상태
 */
export function validatePasswordPolicy(
	password: string,
): PasswordPolicyResult {
	const rules: PasswordPolicyRule[] = PASSWORD_RULES.map((r) => ({
		rule: r.rule,
		label: r.label,
		passed: r.test(password),
	}));

	return {
		isValid: rules.every((r) => r.passed),
		rules,
	};
}
