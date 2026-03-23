"use client";

import type { PasswordRule } from "@cocrepo/constant";
import { Button, Input, Link } from "@heroui/react";
import { observer } from "mobx-react-lite";
import { useState } from "react";
import { AlertBanner } from "../../../primitive/feedback/AlertBanner/AlertBanner";
import { PasswordStrengthIndicator } from "../../../primitive/feedback/PasswordStrengthIndicator/PasswordStrengthIndicator";
import { AuthCard } from "../../../widget/AuthCard/AuthCard";
import { AuthCardHeader } from "../../../widget/AuthCard/AuthCardHeader";

export type ResetPasswordStep = "validating" | "invalid" | "form" | "complete";

export interface ResetPasswordFormProps {
	/** 현재 단계 */
	step: ResetPasswordStep;
	/** 토큰 에러 메시지 (invalid 단계) */
	tokenError?: string | null;
	/** 토큰에 연결된 이메일 */
	tokenEmail?: string;
	/** 비밀번호 정책 규칙 (API에서 동적으로 제공) */
	passwordRules: PasswordRule[];
	/** 비밀번호 변경 제출 핸들러. 에러 메시지 반환 시 에러 표시 */
	onSubmit: (data: {
		password: string;
		confirmPassword: string;
	}) => Promise<string | null>;
	/** 토큰 만료 시 에러 콜백 */
	onTokenExpired?: () => void;
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
		passwordRules,
		onSubmit,
	}: ResetPasswordFormProps) => {
		const [password, setPassword] = useState("");
		const [confirmPassword, setConfirmPassword] = useState("");
		const [isSubmitting, setIsSubmitting] = useState(false);
		const [submitError, setSubmitError] = useState<string | null>(null);
		const [isComplete, setIsComplete] = useState(false);

		const isPasswordValid = passwordRules.every((r) => r.test(password));
		const isPasswordMatch =
			password === confirmPassword && confirmPassword.length > 0;

		const handleSubmit = async () => {
			setSubmitError(null);
			setIsSubmitting(true);

			try {
				const err = await onSubmit({ password, confirmPassword });
				if (err) {
					setSubmitError(err);
				} else {
					setIsComplete(true);
				}
			} finally {
				setIsSubmitting(false);
			}
		};

		return (
			<AuthCard>
				{/* 로딩 중 */}
				{step === "validating" && (
					<div className="text-center py-8">
						<div className="w-8 h-8 border-2 border-primary border-t-transparent rounded-full animate-spin mx-auto mb-4" />
						<p className="text-default-500">링크를 확인하고 있습니다...</p>
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
							{tokenError || "링크가 만료되었습니다"}
						</h2>
						<p className="text-default-500 text-sm mb-6">
							비밀번호 재설정 링크는 30분간 유효하며, 1회만 사용할 수 있습니다.
						</p>
						<Link href="/forgot-password">
							<Button
								color="primary"
								className="w-full font-semibold"
								size="lg"
							>
								다시 요청하기
							</Button>
						</Link>
					</div>
				)}

				{/* 재설정 완료 */}
				{step === "form" && isComplete && (
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
							비밀번호가 변경되었습니다
						</h2>
						<p className="text-default-500 text-sm mb-6">
							보안을 위해 모든 기기에서 로그아웃되었습니다.
							<br />새 비밀번호로 다시 로그인해주세요.
						</p>
						<Link href="/auth/login">
							<Button
								color="primary"
								className="w-full font-semibold"
								size="lg"
							>
								로그인하기
							</Button>
						</Link>
					</div>
				)}

				{/* 비밀번호 입력 폼 */}
				{step === "form" && !isComplete && (
					<>
						<AuthCardHeader
							iconPath="M15 7a2 2 0 012 2m4 0a6 6 0 01-7.743 5.743L11 17H9v2H7v2H4a1 1 0 01-1-1v-2.586a1 1 0 01.293-.707l5.964-5.964A6 6 0 1121 9z"
							title="새 비밀번호 설정"
							subtitle={tokenEmail || undefined}
						/>

						{submitError && <AlertBanner type="danger" message={submitError} />}

						<form
							className="space-y-5"
							onSubmit={(e) => {
								e.preventDefault();
								handleSubmit();
							}}
						>
							<div>
								<Input
									type="password"
									label="새 비밀번호"
									placeholder="********"
									value={password}
									onValueChange={setPassword}
									isRequired
									autoComplete="new-password"
									variant="bordered"
									autoFocus
								/>
								<PasswordStrengthIndicator
									password={password}
									rules={passwordRules}
								/>
							</div>

							<Input
								type="password"
								label="비밀번호 확인"
								placeholder="********"
								value={confirmPassword}
								onValueChange={setConfirmPassword}
								isRequired
								autoComplete="new-password"
								variant="bordered"
								isInvalid={confirmPassword.length > 0 && !isPasswordMatch}
								errorMessage={
									confirmPassword.length > 0 && !isPasswordMatch
										? "비밀번호가 일치하지 않습니다"
										: undefined
								}
							/>

							<Button
								type="submit"
								color="primary"
								className="w-full font-semibold"
								size="lg"
								isLoading={isSubmitting}
								isDisabled={!isPasswordValid || !isPasswordMatch}
							>
								비밀번호 변경
							</Button>
						</form>
					</>
				)}

				{/* 로그인으로 돌아가기 */}
				{!isComplete && (
					<div className="mt-6 text-center">
						<Link
							href="/auth/login"
							className="text-default-400 hover:text-default-500 text-sm"
						>
							로그인으로 돌아가기
						</Link>
					</div>
				)}
			</AuthCard>
		);
	},
);

ResetPasswordForm.displayName = "ResetPasswordForm";
