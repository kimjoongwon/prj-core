import { PASSWORD_RULES } from "@cocrepo/constant";

/**
 * 비밀번호 정책 검증 유틸리티
 *
 * 프론트엔드 비밀번호 폼과 백엔드(PasswordResetService, Auth use cases)에서 공용으로 사용합니다.
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

/**
 * 비밀번호 정책을 검증합니다.
 *
 * @param password - 검증할 비밀번호
 * @returns 전체 유효 여부 + 각 규칙별 통과/미달 상태
 */
export function validatePasswordPolicy(password: string): PasswordPolicyResult {
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
