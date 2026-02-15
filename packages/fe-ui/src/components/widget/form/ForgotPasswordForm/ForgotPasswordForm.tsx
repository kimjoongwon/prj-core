"use client";

import { Button, Input, Link } from "@heroui/react";
import { observer } from "mobx-react-lite";
import { useState } from "react";
import { AlertBanner } from "../../../ui/feedback/AlertBanner/AlertBanner";
import {
	AuthCard,
} from "../../../ui/surfaces/AuthCard/AuthCard";
import {
	AuthCardHeader,
} from "../../../ui/surfaces/AuthCard/AuthCardHeader";

export interface ForgotPasswordFormProps {
	/** 이메일 제출 핸들러. 에러 메시지 반환 시 에러 표시, null이면 성공 */
	onSubmit: (email: string) => Promise<string | null>;
}

/**
 * 비밀번호 찾기 폼 Widget
 *
 * 이메일 입력 → 발송 완료 2단계 UI를 포함합니다.
 */
export const ForgotPasswordForm = observer(
	({ onSubmit }: ForgotPasswordFormProps) => {
		const [email, setEmail] = useState("");
		const [isSubmitting, setIsSubmitting] = useState(false);
		const [isSubmitted, setIsSubmitted] = useState(false);
		const [error, setError] = useState<string | null>(null);

		const handleSubmit = async () => {
			setError(null);
			setIsSubmitting(true);

			try {
				const err = await onSubmit(email);
				if (err) {
					setError(err);
				} else {
					setIsSubmitted(true);
				}
			} finally {
				setIsSubmitting(false);
			}
		};

		const handleResend = () => {
			setIsSubmitted(false);
			handleSubmit();
		};

		return (
			<AuthCard>
				<AuthCardHeader
					iconPath="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z"
					title="비밀번호 찾기"
					subtitle="가입한 이메일 주소를 입력하세요"
				/>

				{isSubmitted ? (
					/* 발송 완료 화면 */
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
							이메일을 확인하세요
						</h2>
						<p className="text-default-500 text-sm mb-6">
							<span className="font-medium text-foreground">
								{email}
							</span>
							으로 비밀번호 재설정 링크를 발송했습니다.
							<br />
							이메일이 도착하지 않았다면 스팸 폴더를 확인해주세요.
						</p>

						<Button
							variant="flat"
							className="w-full mb-3"
							onPress={handleResend}
							isLoading={isSubmitting}
						>
							다시 보내기
						</Button>
					</div>
				) : (
					/* 이메일 입력 폼 */
					<>
						{error && (
							<AlertBanner type="danger" message={error} />
						)}

						<form
							className="space-y-5"
							onSubmit={(e) => {
								e.preventDefault();
								handleSubmit();
							}}
						>
							<Input
								type="email"
								label="이메일"
								placeholder="your@email.com"
								value={email}
								onValueChange={setEmail}
								isRequired
								autoComplete="email"
								variant="bordered"
								autoFocus
							/>

							<Button
								type="submit"
								color="primary"
								className="w-full font-semibold"
								size="lg"
								isLoading={isSubmitting}
								isDisabled={!email}
							>
								재설정 링크 보내기
							</Button>
						</form>
					</>
				)}

				{/* 로그인으로 돌아가기 */}
				<div className="mt-6 text-center">
					<Link
						href="/"
						className="text-default-400 hover:text-default-300 text-sm"
					>
						로그인으로 돌아가기
					</Link>
				</div>
			</AuthCard>
		);
	},
);

ForgotPasswordForm.displayName = "ForgotPasswordForm";
