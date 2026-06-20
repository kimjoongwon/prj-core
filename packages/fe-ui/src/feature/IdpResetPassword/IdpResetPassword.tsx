"use client";
import {
	type PasswordPolicyDto,
	type ResetPasswordErrorDto,
	useExecutePasswordReset,
	useGetPasswordPolicy,
	useValidateResetToken,
} from "@cocrepo/api/idp/password-reset";

import { PASSWORD_RULES, type PasswordRule } from "@cocrepo/constant";
import type { AxiosError } from "axios";
import { type IReactionDisposer, makeAutoObservable, reaction } from "mobx";
import { observer, useLocalObservable } from "mobx-react-lite";
import type { FormEvent } from "react";
import { useEffect } from "react";
import {
	ResetPasswordForm,
	type ResetPasswordFormState,
	type ResetPasswordStep,
} from "../../form/ResetPasswordForm/ResetPasswordForm";

/** API 응답으로부터 PasswordRule[] 생성 */
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

export interface IdpResetPasswordProps {
	/** 비밀번호 재설정 토큰 */
	token: string;
}

type ExecutePasswordResetFn = (payload: {
	token: string;
	data: {
		password: string;
		confirmPassword: string;
	};
}) => Promise<unknown>;

type ResetTokenValidationResult = {
	valid: boolean;
	email?: string | null;
	reason?: string | null;
};

class IdpResetPasswordFeatureState {
	resetPasswordForm: ResetPasswordFormState = {
		password: "",
		confirmPassword: "",
		submitError: null,
		isSubmitting: false,
		isComplete: false,
	};

	resetPasswordStep: ResetPasswordStep = "validating";
	tokenError: string | null = null;
	tokenEmail = "";
	passwordRules: PasswordRule[] = PASSWORD_RULES;

	private readonly clearSubmitErrorDisposer: IReactionDisposer;

	constructor() {
		makeAutoObservable<
			IdpResetPasswordFeatureState,
			"clearSubmitErrorDisposer"
		>(this, { clearSubmitErrorDisposer: false }, { autoBind: true });
		this.clearSubmitErrorDisposer = reaction(
			() =>
				`${this.resetPasswordForm.password}|${this.resetPasswordForm.confirmPassword}`,
			() => {
				if (this.resetPasswordForm.submitError) {
					this.resetPasswordForm.submitError = null;
				}
			},
		);
	}

	syncTokenValidation(
		tokenData: ResetTokenValidationResult | null | undefined,
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
			this.tokenError = null;
			this.resetPasswordForm.isComplete = false;
			return;
		}

		this.tokenEmail = "";
		this.resetPasswordForm.isComplete = false;
		this.tokenError =
			tokenData.reason === "TOKEN_EXPIRED"
				? "링크가 만료되었습니다."
				: "유효하지 않은 링크입니다.";
		this.resetPasswordStep = "invalid";
	}

	syncPasswordPolicy(policyData: PasswordPolicyDto | undefined) {
		if (policyData) {
			this.passwordRules = buildPasswordRules(policyData);
		}
	}

	async submitResetPassword(
		token: string,
		executePasswordReset: ExecutePasswordResetFn,
	) {
		this.resetPasswordForm.submitError = null;
		this.resetPasswordForm.isSubmitting = true;

		try {
			await executePasswordReset({
				token,
				data: {
					password: this.resetPasswordForm.password,
					confirmPassword: this.resetPasswordForm.confirmPassword,
				},
			});
			this.resetPasswordForm.isComplete = true;
		} catch (err) {
			const axiosError = err as AxiosError<ResetPasswordErrorDto>;
			const errorCode = axiosError.response?.data?.error || "";

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
		} finally {
			this.resetPasswordForm.isSubmitting = false;
		}
	}

	destroy() {
		this.clearSubmitErrorDisposer();
	}
}

/**
 * IDP 비밀번호 재설정 Feature
 *
 * ResetPasswordForm Widget에 토큰 검증 및 비밀번호 변경 API를 연결합니다.
 * 비밀번호 정책을 DB에서 조회하여 동적으로 규칙을 생성합니다.
 */
export const IdpResetPassword = observer(({ token }: IdpResetPasswordProps) => {
	const state = useLocalObservable(() => new IdpResetPasswordFeatureState());

	// 토큰 검증
	const { data: tokenData, isError: isTokenError } =
		useValidateResetToken(token);

	// 비밀번호 정책 조회
	const { data: policyData } = useGetPasswordPolicy();

	const resetMutation = useExecutePasswordReset();

	// 토큰 검증 결과 처리
	useEffect(() => {
		state.syncTokenValidation(tokenData, isTokenError);
	}, [isTokenError, state, tokenData]);

	// 비밀번호 정책 결과 처리
	useEffect(() => {
		state.syncPasswordPolicy(policyData);
	}, [policyData, state]);

	useEffect(() => {
		return () => {
			state.destroy();
		};
	}, [state]);

	const onSubmitResetPasswordForm = async () => {
		await state.submitResetPassword(token, resetMutation.mutateAsync);
	};

	const onSubmitIdpResetPassword = (event: FormEvent<HTMLDivElement>) => {
		event.preventDefault();
		void onSubmitResetPasswordForm();
	};

	return (
		<div onSubmit={onSubmitIdpResetPassword}>
			<ResetPasswordForm
				step={state.resetPasswordStep}
				tokenError={state.tokenError}
				tokenEmail={state.tokenEmail}
				state={state.resetPasswordForm}
				passwordRules={state.passwordRules}
			/>
		</div>
	);
});

IdpResetPassword.displayName = "IdpResetPassword";
