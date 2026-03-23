"use client";

import { Button, Checkbox, Input, Link } from "@heroui/react";
import { observer } from "mobx-react-lite";
import { useState } from "react";
import { AlertBanner } from "../../../primitive/feedback/AlertBanner/AlertBanner";
import { AuthCard } from "../../../widget/AuthCard/AuthCard";
import { AuthCardHeader } from "../../../widget/AuthCard/AuthCardHeader";

export interface LoginRecoveryAction {
	type: string;
	label: string;
	href?: string;
}

/** 로그인 API 에러 응답 */
export interface LoginErrorResponse {
	error: string;
	displayMessage?: string;
	hint?: string;
	recoveryActions?: LoginRecoveryAction[];
	remainingAttempts?: number;
	lockedUntil?: string;
	/** 일시 잠금 임계값 (DB 정책 값) */
	temporaryLockThreshold?: number;
	/** 일시 잠금 지속시간 (분, DB 정책 값) */
	temporaryLockDurationMin?: number;
}

export interface OidcLoginFormProps {
	/** 로그인 제출 핸들러 */
	onSubmit: (data: {
		email: string;
		password: string;
		remember: boolean;
	}) => Promise<LoginErrorResponse | null>;
	/** 취소(Abort) 핸들러 */
	onAbort: () => void;
	/** 클라이언트 정보 */
	client?: {
		clientId: string;
		clientName: string;
		logoUri?: string;
	} | null;
	/** DEV 모드 여부 */
	isDev?: boolean;
}

/** 에러 응답이 표시 문구를 제공하지 않는 경우를 대비한 기본 메시지 */
function getFallbackErrorMessage(data: LoginErrorResponse): string {
	const threshold = data.temporaryLockThreshold ?? 5;
	const durationMin = data.temporaryLockDurationMin ?? 15;

	switch (data.error) {
		case "INVALID_CREDENTIALS":
			if (data.remainingAttempts !== undefined && data.remainingAttempts > 0) {
				return `이메일 또는 비밀번호가 올바르지 않습니다. (남은 시도: ${data.remainingAttempts}/${threshold})`;
			}
			return "이메일 또는 비밀번호가 올바르지 않습니다.";
		case "ACCOUNT_LOCKED_TEMPORARY":
			return `계정이 일시 잠겼습니다. ${durationMin}분 후 다시 시도하세요.`;
		case "ACCOUNT_LOCKED_PERMANENT":
			return "계정이 잠겼습니다. 비밀번호를 재설정하거나 관리자에게 문의하세요.";
		default:
			return data.error || "로그인에 실패했습니다.";
	}
}

function getErrorTitle(error: LoginErrorResponse): string {
	switch (error.error) {
		case "ACCOUNT_LOCKED_TEMPORARY":
			return "계정 일시 잠금";
		case "ACCOUNT_LOCKED_PERMANENT":
			return "계정 잠금";
		default:
			return "로그인 실패";
	}
}

function getErrorTone(error: LoginErrorResponse): "danger" | "warning" {
	return error.error === "ACCOUNT_LOCKED_TEMPORARY" ? "warning" : "danger";
}

/**
 * OIDC 로그인 폼 Widget
 *
 * 이메일/비밀번호 입력, 실패 상태, 복구 액션을 포함하는 로그인 폼입니다.
 * API 호출은 콜백(onSubmit, onAbort)으로 위임합니다.
 */
export const OidcLoginForm = observer(
	({ onSubmit, onAbort, client, isDev = false }: OidcLoginFormProps) => {
		const [email, setEmail] = useState(isDev ? "admin@plate.com" : "");
		const [password, setPassword] = useState(isDev ? "rkdmf12!@" : "");
		const [remember, setRemember] = useState(false);
		const [error, setError] = useState<LoginErrorResponse | null>(null);
		const [isSubmitting, setIsSubmitting] = useState(false);

		const handleSubmitLogin = async () => {
			setError(null);
			setIsSubmitting(true);

			try {
				const result = await onSubmit({ email, password, remember });
				if (result) {
					setError(result);
				}
			} finally {
				setIsSubmitting(false);
			}
		};

		const recoveryActions =
			error?.recoveryActions?.filter((action) => action.href || action.label) ??
			[];
		const fallbackRecoveryActions =
			error?.error === "ACCOUNT_LOCKED_TEMPORARY" ||
			error?.error === "ACCOUNT_LOCKED_PERMANENT"
				? [
						{
							type: "forgot-password",
							label: "비밀번호 재설정",
							href: "/forgot-password",
						},
					]
				: [];
		const actionsToRender =
			recoveryActions.length > 0 ? recoveryActions : fallbackRecoveryActions;

		return (
			<AuthCard>
				<AuthCardHeader
					iconPath="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z"
					title="로그인"
					subtitle={
						client
							? `${client.clientName} 서비스를 계속 이용하려면 계정으로 로그인하세요.`
							: "계속하려면 계정으로 로그인하세요."
					}
					logoUri={client?.logoUri}
					logoAlt={client?.clientName}
				/>

				{isDev && (
					<AlertBanner
						type="warning"
						message="DEV MODE - Super Admin 계정이 자동 입력되었습니다"
						className="text-center text-sm"
					/>
				)}

				{error && (
					<AlertBanner
						type={getErrorTone(error)}
						title={getErrorTitle(error)}
						message={
							<>
								{error.displayMessage || getFallbackErrorMessage(error)}
								{error.hint && (
									<span className="mt-2 block text-xs leading-5 opacity-80">
										{error.hint}
									</span>
								)}
							</>
						}
						actions={
							actionsToRender.length > 0 ? (
								<div className="flex flex-wrap gap-3 text-sm">
									{actionsToRender.map((action) =>
										action.href ? (
											<Link
												key={`${action.type}:${action.label}`}
												href={action.href}
												className="font-medium text-primary"
											>
												{action.label}
											</Link>
										) : (
											<span
												key={`${action.type}:${action.label}`}
												className="text-default-500"
											>
												{action.label}
											</span>
										),
									)}
								</div>
							) : undefined
						}
					/>
				)}

				<form
					className="space-y-5"
					onSubmit={(e) => {
						e.preventDefault();
						handleSubmitLogin();
					}}
				>
					<Input
						type="email"
						label="이메일"
						placeholder="your@email.com"
						value={email}
						onValueChange={(value) => {
							setEmail(value);
							if (error) {
								setError(null);
							}
						}}
						isRequired
						autoComplete="email"
						variant="bordered"
						autoFocus={!isDev}
					/>

					<Input
						type="password"
						label="비밀번호"
						placeholder="********"
						value={password}
						onValueChange={(value) => {
							setPassword(value);
							if (error) {
								setError(null);
							}
						}}
						isRequired
						autoComplete="current-password"
						variant="bordered"
					/>

					<div className="flex items-center justify-between gap-4">
						<Checkbox
							isSelected={remember}
							onValueChange={setRemember}
							size="sm"
						>
							로그인 상태 유지
						</Checkbox>

						<Link
							href="/forgot-password"
							className="text-sm text-default-500 hover:text-primary"
						>
							비밀번호를 잊으셨나요?
						</Link>
					</div>

					<Button
						type="submit"
						color="primary"
						className="w-full font-semibold"
						size="lg"
						isLoading={isSubmitting}
					>
						로그인
					</Button>
				</form>

				<div className="mt-6 text-center">
					<button
						type="button"
						className="text-sm text-default-400 transition-colors hover:text-default-500"
						onClick={onAbort}
					>
						취소하고 돌아가기
					</button>
				</div>
			</AuthCard>
		);
	},
);

OidcLoginForm.displayName = "OidcLoginForm";
