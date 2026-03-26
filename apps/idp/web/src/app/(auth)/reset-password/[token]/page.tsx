"use client";

import {
	type PasswordPolicyDto,
	type ResetPasswordErrorDto,
	useExecutePasswordReset,
	useGetPasswordPolicy,
	useValidateResetToken,
} from "@cocrepo/api/idp/password-reset";
import { PASSWORD_RULES, type PasswordRule } from "@cocrepo/constant";
import { IdpResetPasswordPage } from "@cocrepo/ui";
import type { AxiosError } from "axios";
import { observer } from "mobx-react-lite";
import { useParams } from "next/navigation";
import { useEffect, useState } from "react";

type ResetPasswordPageParams = {
	token: string;
};

function buildPasswordRules(policy: PasswordPolicyDto): PasswordRule[] {
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
			test: (pw: string) => /[!@#$%^&*()_+\-=[\]{}|;:,.<>?/~`"']/.test(pw),
		});
	}

	return rules;
}

const ResetPasswordPage = observer(function ResetPasswordPage() {
	const { token } = useParams<ResetPasswordPageParams>();
	const [step, setStep] = useState<"validating" | "invalid" | "form">(
		"validating",
	);
	const [tokenError, setTokenError] = useState<string | null>(null);
	const [tokenEmail, setTokenEmail] = useState("");
	const [passwordRules, setPasswordRules] =
		useState<PasswordRule[]>(PASSWORD_RULES);

	const { data: tokenData, isError: isTokenError } =
		useValidateResetToken(token);
	const { data: policyData } = useGetPasswordPolicy();
	const resetMutation = useExecutePasswordReset();

	useEffect(() => {
		if (isTokenError) {
			setTokenError("서버와 통신할 수 없습니다.");
			setStep("invalid");
			return;
		}

		if (!tokenData) {
			return;
		}

		if (tokenData.valid) {
			setStep("form");
			setTokenEmail(tokenData.email || "");
			return;
		}

		setTokenError(
			tokenData.reason === "TOKEN_EXPIRED"
				? "링크가 만료되었습니다."
				: "유효하지 않은 링크입니다.",
		);
		setStep("invalid");
	}, [isTokenError, tokenData]);

	useEffect(() => {
		if (policyData) {
			setPasswordRules(buildPasswordRules(policyData));
		}
	}, [policyData]);

	const onSubmitResetPasswordForm = async (data: {
		password: string;
		confirmPassword: string;
	}) => {
		try {
			await resetMutation.mutateAsync({ token, data });
			return null;
		} catch (err) {
			const axiosError = err as AxiosError<ResetPasswordErrorDto>;
			const errorCode = axiosError.response?.data?.error || "";

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
			return errorCode || "비밀번호 재설정에 실패했습니다.";
		}
	};

	const onTokenExpiredResetPasswordPage = () => {
		setStep("invalid");
	};

	return (
		<IdpResetPasswordPage
			step={step}
			tokenError={tokenError}
			tokenEmail={tokenEmail}
			passwordRules={passwordRules}
			onSubmit={onSubmitResetPasswordForm}
			onTokenExpired={onTokenExpiredResetPasswordPage}
		/>
	);
});

export default ResetPasswordPage;
