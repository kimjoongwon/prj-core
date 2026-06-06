"use client";

import {
	type PasswordPolicyDto,
	type ResetPasswordErrorDto,
	useExecutePasswordReset,
	useGetPasswordPolicy,
	useValidateResetToken,
} from "@cocrepo/api/idp/password-reset";
import { PASSWORD_RULES, type PasswordRule } from "@cocrepo/constant";
import { ResetPasswordPage } from "@cocrepo/ui";
import type { AxiosError } from "axios";
import {
	type IReactionDisposer,
	makeAutoObservable,
	reaction,
	runInAction,
} from "mobx";
import { observer, useLocalObservable } from "mobx-react-lite";
import { useParams } from "next/navigation";
import { useEffect } from "react";

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

class ResetPasswordRoutePageState {
	resetPasswordForm = {
		password: "",
		confirmPassword: "",
		submitError: null as string | null,
		isSubmitting: false,
		isComplete: false,
	};

	resetPasswordStep: "validating" | "invalid" | "form" = "validating";
	tokenError: string | null = null;
	tokenEmail = "";
	passwordRules: PasswordRule[] = [...PASSWORD_RULES];

	private readonly disposePasswordReaction: IReactionDisposer;

	constructor() {
		makeAutoObservable<this, "disposePasswordReaction">(this, {
			disposePasswordReaction: false,
		});

		this.disposePasswordReaction = reaction(
			() => [
				this.resetPasswordForm.password,
				this.resetPasswordForm.confirmPassword,
			],
			() => {
				if (this.resetPasswordForm.submitError) {
					this.resetPasswordForm.submitError = null;
				}
			},
		);
	}

	syncTokenValidation(
		tokenData:
			| {
					valid: boolean;
					email?: string;
					reason?: string;
			  }
			| undefined,
		isTokenError: boolean,
	) {
		if (isTokenError) {
			this.tokenError = "서버와 통신할 수 없습니다.";
			this.resetPasswordStep = "invalid";
			return;
		}

		if (!tokenData) {
			return;
		}

		if (tokenData.valid) {
			this.resetPasswordStep = "form";
			this.tokenEmail = tokenData.email || "";
			this.resetPasswordForm.isComplete = false;
			return;
		}

		this.tokenError =
			tokenData.reason === "TOKEN_EXPIRED"
				? "링크가 만료되었습니다."
				: "유효하지 않은 링크입니다.";
		this.resetPasswordStep = "invalid";
	}

	setPasswordRules(passwordRules: PasswordRule[]) {
		this.passwordRules = passwordRules;
	}

	async submit(
		token: string,
		request: (input: {
			token: string;
			password: string;
			confirmPassword: string;
		}) => Promise<void>,
	) {
		this.resetPasswordForm.submitError = null;
		this.resetPasswordForm.isSubmitting = true;

		try {
			await request({
				token,
				password: this.resetPasswordForm.password,
				confirmPassword: this.resetPasswordForm.confirmPassword,
			});
			runInAction(() => {
				this.resetPasswordForm.isComplete = true;
			});
		} catch (err) {
			const axiosError = err as AxiosError<ResetPasswordErrorDto>;
			const errorCode = axiosError.response?.data?.error || "";

			runInAction(() => {
				if (errorCode === "PASSWORD_REUSE") {
					this.resetPasswordForm.submitError =
						"최근 사용한 비밀번호는 다시 사용할 수 없습니다.";
					return;
				}
				if (errorCode.startsWith("PASSWORD_POLICY_VIOLATION")) {
					this.resetPasswordForm.submitError =
						"비밀번호가 정책 조건을 충족하지 않습니다.";
					return;
				}
				if (errorCode === "TOKEN_EXPIRED") {
					this.tokenError = "링크가 만료되었습니다.";
					this.resetPasswordStep = "invalid";
					return;
				}
				if (errorCode === "PASSWORD_MISMATCH") {
					this.resetPasswordForm.submitError = "비밀번호가 일치하지 않습니다.";
					return;
				}
				this.resetPasswordForm.submitError =
					errorCode || "비밀번호 재설정에 실패했습니다.";
			});
		} finally {
			runInAction(() => {
				this.resetPasswordForm.isSubmitting = false;
			});
		}
	}

	destroy() {
		this.disposePasswordReaction();
	}
}

const ResetPasswordRoutePage = observer(function ResetPasswordRoutePage() {
	const { token } = useParams<ResetPasswordPageParams>();
	const resetPasswordPage = useLocalObservable(
		() => new ResetPasswordRoutePageState(),
	);

	const { data: tokenData, isError: isTokenError } =
		useValidateResetToken(token);
	const { data: policyData } = useGetPasswordPolicy();
	const resetMutation = useExecutePasswordReset();

	useEffect(() => {
		resetPasswordPage.syncTokenValidation(tokenData, isTokenError);
	}, [isTokenError, resetPasswordPage, tokenData]);

	useEffect(() => {
		if (policyData) {
			resetPasswordPage.setPasswordRules(buildPasswordRules(policyData));
		}
	}, [policyData, resetPasswordPage]);

	useEffect(() => {
		return () => {
			resetPasswordPage.destroy();
		};
	}, [resetPasswordPage]);

	const onSubmitResetPasswordForm = async () => {
		await resetPasswordPage.submit(token, async (input) => {
			await resetMutation.mutateAsync({
				token: input.token,
				data: {
					password: input.password,
					confirmPassword: input.confirmPassword,
				},
			});
		});
	};

	return (
		<ResetPasswordPage
			state={resetPasswordPage}
			onSubmitResetPasswordForm={onSubmitResetPasswordForm}
		/>
	);
});

export default ResetPasswordRoutePage;
