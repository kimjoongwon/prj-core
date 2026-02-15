"use client";

import { PASSWORD_RULES, type PasswordRule } from "@cocrepo/constant";
import { observer } from "mobx-react-lite";
import { useEffect, useState } from "react";
import {
	ResetPasswordForm,
	type ResetPasswordStep,
} from "../../../widget/form/ResetPasswordForm/ResetPasswordForm";

/** API 응답으로부터 PasswordRule[] 생성 */
function buildPasswordRules(policy: {
	minLength: number;
	maxLength: number;
	requireUppercase: boolean;
	requireLowercase: boolean;
	requireNumber: boolean;
	requireSpecial: boolean;
}): PasswordRule[] {
	const rules: PasswordRule[] = [
		{
			rule: "minLength",
			label: `${policy.minLength}자 이상`,
			test: (pw: string) => pw.length >= policy.minLength,
		},
		{
			rule: "maxLength",
			label: `${policy.maxLength}자 이하`,
			test: (pw: string) => pw.length <= policy.maxLength,
		},
	];

	if (policy.requireUppercase) {
		rules.push({
			rule: "uppercase",
			label: "영문 대문자 포함",
			test: (pw: string) => /[A-Z]/.test(pw),
		});
	}
	if (policy.requireLowercase) {
		rules.push({
			rule: "lowercase",
			label: "영문 소문자 포함",
			test: (pw: string) => /[a-z]/.test(pw),
		});
	}
	if (policy.requireNumber) {
		rules.push({
			rule: "number",
			label: "숫자 포함",
			test: (pw: string) => /[0-9]/.test(pw),
		});
	}
	if (policy.requireSpecial) {
		rules.push({
			rule: "special",
			label: "특수문자 포함",
			test: (pw: string) =>
				/[!@#$%^&*()_+\-=\[\]{}|;:,.<>?/~`"']/.test(pw),
		});
	}

	return rules;
}

export interface IdpResetPasswordProps {
	/** 비밀번호 재설정 토큰 */
	token: string;
}

/**
 * IDP 비밀번호 재설정 Feature
 *
 * ResetPasswordForm Widget에 토큰 검증 및 비밀번호 변경 API를 연결합니다.
 * 비밀번호 정책을 DB에서 조회하여 동적으로 규칙을 생성합니다.
 */
export const IdpResetPassword = observer(
	({ token }: IdpResetPasswordProps) => {
		const [step, setStep] = useState<ResetPasswordStep>("validating");
		const [tokenError, setTokenError] = useState<string | null>(null);
		const [tokenEmail, setTokenEmail] = useState("");
		const [passwordRules, setPasswordRules] = useState<PasswordRule[]>(PASSWORD_RULES);

		// 토큰 검증 + 비밀번호 정책 조회
		useEffect(() => {
			const initialize = async () => {
				try {
					// 토큰 검증과 비밀번호 정책을 병렬 조회
					const [tokenRes, policyRes] = await Promise.all([
						fetch(`/api/reset-password/${token}`),
						fetch("/api/password-policy"),
					]);

					const tokenData = await tokenRes.json();

					if (tokenData.valid) {
						setStep("form");
						setTokenEmail(tokenData.email || "");
					} else {
						setTokenError(
							tokenData.reason === "TOKEN_EXPIRED"
								? "링크가 만료되었습니다."
								: "유효하지 않은 링크입니다.",
						);
						setStep("invalid");
					}

					// 비밀번호 정책 설정
					if (policyRes.ok) {
						const policyData = await policyRes.json();
						setPasswordRules(buildPasswordRules(policyData));
					}
				} catch {
					setTokenError("서버와 통신할 수 없습니다.");
					setStep("invalid");
				}
			};

			initialize();
		}, [token]);

		const handleSubmit = async (data: {
			password: string;
			confirmPassword: string;
		}): Promise<string | null> => {
			try {
				const response = await fetch(
					`/api/reset-password/${token}`,
					{
						method: "POST",
						headers: { "Content-Type": "application/json" },
						body: JSON.stringify(data),
					},
				);

				const result = await response.json();

				if (!response.ok) {
					const errorCode = result.error || "";
					if (errorCode === "PASSWORD_REUSE") {
						return "최근 사용한 비밀번호는 다시 사용할 수 없습니다.";
					}
					if (errorCode.startsWith("PASSWORD_POLICY_VIOLATION")) {
						return "비밀번호가 정책 조건을 충족하지 않습니다.";
					}
					if (errorCode === "TOKEN_EXPIRED") {
						setTokenError("링크가 만료되었습니다.");
						setStep("invalid");
						return null;
					}
					if (errorCode === "PASSWORD_MISMATCH") {
						return "비밀번호가 일치하지 않습니다.";
					}
					return (
						result.error ||
						"비밀번호 재설정에 실패했습니다."
					);
				}

				return null;
			} catch {
				return "서버와 통신할 수 없습니다.";
			}
		};

		const handleTokenExpired = () => {
			setStep("invalid");
		};

		return (
			<ResetPasswordForm
				step={step}
				tokenError={tokenError}
				tokenEmail={tokenEmail}
				passwordRules={passwordRules}
				onSubmit={handleSubmit}
				onTokenExpired={handleTokenExpired}
			/>
		);
	},
);

IdpResetPassword.displayName = "IdpResetPassword";
