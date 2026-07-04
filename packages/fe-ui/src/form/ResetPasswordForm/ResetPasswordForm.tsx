"use client";

import type { PasswordRule } from "@cocrepo/constant";
import { observer } from "mobx-react-lite";
import { AlertBanner } from "../../feedback/AlertBanner/AlertBanner";
import { PasswordStrengthIndicator } from "../../feedback/PasswordStrengthIndicator/PasswordStrengthIndicator";
import { useT } from "../../i18n";
import { Button, Link, TextField } from "../../input";
import { AuthCard } from "../../widget/AuthCard/AuthCard";
import { AuthCardHeader } from "../../widget/AuthCard/AuthCardHeader";

export type ResetPasswordStep = "validating" | "invalid" | "form" | "complete";

export interface ResetPasswordFormState {
	password: string;
	confirmPassword: string;
	submitError: string | null;
	isSubmitting: boolean;
	isComplete: boolean;
}

export interface ResetPasswordFormProps {
	/** 현재 단계 */
	step: ResetPasswordStep;
	/** 토큰 에러 메시지 (invalid 단계) */
	tokenError?: string | null;
	/** 토큰에 연결된 이메일 */
	tokenEmail?: string;
	/** page/feature/route가 소유하는 form state */
	state: ResetPasswordFormState;
	/** 비밀번호 정책 규칙 (API에서 동적으로 제공) */
	passwordRules: PasswordRule[];
	forgotPasswordHref?: string;
	loginHref?: string;
}

/**
 * 비밀번호 재설정 폼 Widget
 *
 * 토큰검증 → 폼 → 완료 단계를 포함하는 비밀번호 재설정 UI입니다.
 */
export const ResetPasswordForm = observer(
	({
		step,
		tokenError,
		tokenEmail,
		state,
		passwordRules,
		forgotPasswordHref = "/forgot-password",
		loginHref = "/auth/login",
	}: ResetPasswordFormProps) => {
		const t = useT();
		const isPasswordValid = passwordRules.every((r) => r.test(state.password));
		const isPasswordMatch =
			state.password === state.confirmPassword &&
			state.confirmPassword.length > 0;

		return (
			<AuthCard>
				{/* 로딩 중 */}
				{step === "validating" && (
					<div className="text-center py-8">
						<div className="w-8 h-8 border-2 border-accent border-t-transparent rounded-full animate-spin mx-auto mb-4" />
						<p className="text-muted">{t("링크를 확인하고 있습니다...")}</p>
					</div>
				)}

				{/* 토큰 만료/무효 */}
				{step === "invalid" && (
					<div className="text-center">
						<div className="w-16 h-16 bg-danger/20 rounded-full mx-auto mb-4 flex items-center justify-center">
							<svg
								className="w-8 h-8 text-danger"
								fill="none"
								stroke="currentColor"
								viewBox="0 0 24 24"
							>
								<path
									strokeLinecap="round"
									strokeLinejoin="round"
									strokeWidth={2}
									d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
								/>
							</svg>
						</div>
						<h2 className="text-lg font-semibold mb-2">
							{tokenError ? t(tokenError) : t("링크가 만료되었습니다")}
						</h2>
						<p className="text-muted text-sm mb-6">
							{t(
								"비밀번호 재설정 링크는 30분간 유효하며, 1회만 사용할 수 있습니다.",
							)}
						</p>
						<Link href={forgotPasswordHref}>
							<Button
								color="primary"
								className="w-full font-semibold"
								size="lg"
							>
								{t("다시 요청하기")}
							</Button>
						</Link>
					</div>
				)}

				{/* 재설정 완료 */}
				{step === "form" && state.isComplete && (
					<div className="text-center">
						<div className="w-16 h-16 bg-success/20 rounded-full mx-auto mb-4 flex items-center justify-center">
							<svg
								className="w-8 h-8 text-success"
								fill="none"
								stroke="currentColor"
								viewBox="0 0 24 24"
							>
								<path
									strokeLinecap="round"
									strokeLinejoin="round"
									strokeWidth={2}
									d="M5 13l4 4L19 7"
								/>
							</svg>
						</div>
						<h2 className="text-lg font-semibold mb-2">
							{t("비밀번호가 변경되었습니다")}
						</h2>
						<p className="text-muted text-sm mb-6">
							{t("보안을 위해 모든 기기에서 로그아웃되었습니다.")}
							<br />
							{t("새 비밀번호로 다시 로그인해주세요.")}
						</p>
						<Link href={loginHref}>
							<Button
								color="primary"
								className="w-full font-semibold"
								size="lg"
							>
								{t("로그인하기")}
							</Button>
						</Link>
					</div>
				)}

				{/* 비밀번호 입력 폼 */}
				{step === "form" && !state.isComplete && (
					<>
						<AuthCardHeader
							iconPath="M15 7a2 2 0 012 2m4 0a6 6 0 01-7.743 5.743L11 17H9v2H7v2H4a1 1 0 01-1-1v-2.586a1 1 0 01.293-.707l5.964-5.964A6 6 0 1121 9z"
							title="새 비밀번호 설정"
							subtitle={tokenEmail || undefined}
						/>

						{state.submitError && (
							<AlertBanner type="danger" message={t(state.submitError)} />
						)}

						<form className="space-y-5">
							<div>
								<TextField
									path="password"
									state={state}
									label="새 비밀번호"
									placeholder="********"
									isRequired
									autoComplete="new-password"
									variant="bordered"
									autoFocus
								/>
								<PasswordStrengthIndicator
									password={state.password}
									rules={passwordRules}
								/>
							</div>

							<TextField
								path="confirmPassword"
								state={state}
								label="비밀번호 확인"
								placeholder="********"
								isRequired
								autoComplete="new-password"
								variant="bordered"
								isInvalid={state.confirmPassword.length > 0 && !isPasswordMatch}
								errorMessage={
									state.confirmPassword.length > 0 && !isPasswordMatch
										? "비밀번호가 일치하지 않습니다"
										: undefined
								}
							/>

							<Button
								type="submit"
								color="primary"
								className="w-full font-semibold"
								size="lg"
								isLoading={state.isSubmitting}
								isDisabled={!isPasswordValid || !isPasswordMatch}
							>
								{t("비밀번호 변경")}
							</Button>
						</form>
					</>
				)}

				{/* 로그인으로 돌아가기 */}
				{!state.isComplete && (
					<div className="mt-6 text-center">
						<Link
							href={loginHref}
							className="text-muted hover:text-muted text-sm"
						>
							{t("로그인으로 돌아가기")}
						</Link>
					</div>
				)}
			</AuthCard>
		);
	},
);

ResetPasswordForm.displayName = "ResetPasswordForm";
