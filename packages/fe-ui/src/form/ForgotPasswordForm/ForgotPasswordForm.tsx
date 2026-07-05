"use client";

import { CheckCircle, Mail } from "lucide-react";
import { observer } from "mobx-react-lite";
import { Alert } from "../../feedback/Alert/Alert";
import { useT } from "../../i18n";
import { Button, Link, TextField } from "../../input";
import { Auth } from "../../layout/Auth";

export interface ForgotPasswordFormState {
	email: string;
	errorMessage: string | null;
	isSubmitted: boolean;
	isSubmitting: boolean;
}

export interface ForgotPasswordFormProps {
	/** 입력/상태를 포함한 page 소유 form state */
	state: ForgotPasswordFormState;
	loginHref?: string;
}

/**
 * 비밀번호 찾기 폼 Widget
 *
 * 이메일 입력 → 발송 완료 2단계 UI를 포함합니다.
 */
export const ForgotPasswordForm = observer(
	({ state, loginHref = "/auth/login" }: ForgotPasswordFormProps) => {
		const t = useT();

		return (
			<Auth.Panel>
				<Auth.PanelHeader
					icon={<Mail className="h-6 w-6 text-accent" />}
					title="비밀번호 찾기"
					subtitle="예약 계정에 등록한 이메일 주소를 입력하세요"
				/>

				{state.isSubmitted ? (
					/* 발송 완료 화면 */
					<form className="space-y-5">
						<div className="text-center">
							<div className="w-16 h-16 bg-success/20 rounded-full mx-auto mb-4 flex items-center justify-center">
								<CheckCircle className="h-8 w-8 text-success" />
							</div>
							<h2 className="text-lg font-semibold mb-2">
								{t("이메일을 확인하세요")}
							</h2>
							<p className="text-muted text-sm mb-6">
								<span className="font-medium text-foreground">
									{state.email}
								</span>
								{t("으로 예약 계정 비밀번호 재설정 링크를 발송했습니다.")}
								<br />
								{t("이메일이 도착하지 않았다면 스팸 폴더를 확인해주세요.")}
							</p>

							<Button
								type="submit"
								variant="flat"
								className="w-full mb-3"
								isLoading={state.isSubmitting}
							>
								{t("다시 보내기")}
							</Button>
						</div>
					</form>
				) : (
					/* 이메일 입력 폼 */
					<>
						{state.errorMessage && (
							<Alert status="danger" description={t(state.errorMessage)} />
						)}

						<form className="space-y-5">
							<TextField
								path="email"
								state={state}
								label="이메일"
								placeholder="your@email.com"
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
								isLoading={state.isSubmitting}
								isDisabled={!state.email}
							>
								{t("재설정 링크 보내기")}
							</Button>
						</form>
					</>
				)}

				{/* 로그인으로 돌아가기 */}
				<div className="mt-6 text-center">
					<Link
						href={loginHref}
						className="text-muted hover:text-muted text-sm"
					>
						{t("로그인으로 돌아가기")}
					</Link>
				</div>
			</Auth.Panel>
		);
	},
);

ForgotPasswordForm.displayName = "ForgotPasswordForm";
