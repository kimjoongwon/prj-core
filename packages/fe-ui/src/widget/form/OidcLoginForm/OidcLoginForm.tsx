"use client";

import { Button, Checkbox, Input, Link } from "@heroui/react";
import { observer } from "mobx-react-lite";
import { useState } from "react";
import { AlertBanner } from "../../../primitive/feedback/AlertBanner/AlertBanner";
import { AuthCard } from "../../../widget/AuthCard/AuthCard";
import { AuthCardHeader } from "../../../widget/AuthCard/AuthCardHeader";

/** 로그인 API 에러 응답 */
export interface LoginErrorResponse {
	error: string;
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

/** 에러 코드를 사용자 메시지로 변환 */
function getErrorMessage(data: LoginErrorResponse): string {
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

/**
 * OIDC 로그인 폼 Widget
 *
 * 이메일/비밀번호 입력, 잠금 배너, DEV 뱃지를 포함하는 로그인 폼입니다.
 * API 호출은 콜백(onSubmit, onAbort)으로 위임합니다.
 */
export const OidcLoginForm = observer(
	({ onSubmit, onAbort, client, isDev = false }: OidcLoginFormProps) => {
		const [email, setEmail] = useState(isDev ? "admin@plate.com" : "");
		const [password, setPassword] = useState(isDev ? "rkdmf12!@" : "");
		const [remember, setRemember] = useState(false);
		const [error, setError] = useState<LoginErrorResponse | null>(null);
		const [isSubmitting, setIsSubmitting] = useState(false);
		const [isLocked, setIsLocked] = useState(false);

		const handleSubmitLogin = async () => {
			setError(null);
			setIsSubmitting(true);

			try {
				const result = await onSubmit({ email, password, remember });
				if (result) {
					setError(result);
					if (
						result.error === "ACCOUNT_LOCKED_TEMPORARY" ||
						result.error === "ACCOUNT_LOCKED_PERMANENT"
					) {
						setIsLocked(true);
					}
				}
			} finally {
				setIsSubmitting(false);
			}
		};

		const isTemporaryLock = error?.error === "ACCOUNT_LOCKED_TEMPORARY";
		const isPermanentLock = error?.error === "ACCOUNT_LOCKED_PERMANENT";

		return (
			<AuthCard>
				<AuthCardHeader
					iconPath="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z"
					title="로그인"
					subtitle={client ? `${client.clientName}에 로그인` : undefined}
				/>

				{/* DEV 모드 뱃지 */}
				{isDev && (
					<AlertBanner
						type="warning"
						message="DEV MODE - Super Admin 계정이 자동 입력되었습니다"
						className="text-center text-sm"
					/>
				)}

				{/* 임시 잠금 배너 */}
				{isTemporaryLock && (
					<AlertBanner
						type="warning"
						title="계정 일시 잠금"
						message={`로그인 실패 횟수 초과로 계정이 일시 잠겼습니다. ${error?.temporaryLockDurationMin ?? 15}분 후 다시 시도하거나, 비밀번호를 재설정하세요.`}
						actions={
							<Link href="/forgot-password" className="text-sm text-primary">
								비밀번호 재설정하기
							</Link>
						}
					/>
				)}

				{/* 영구 잠금 배너 */}
				{isPermanentLock && (
					<AlertBanner
						type="danger"
						title="계정 잠금"
						message="보안을 위해 계정이 잠겼습니다. 비밀번호를 재설정하거나 관리자에게 문의하세요."
						actions={
							<Link href="/forgot-password" className="text-sm text-primary">
								비밀번호 재설정
							</Link>
						}
					/>
				)}

				{/* 일반 에러 메시지 */}
				{error && !isTemporaryLock && !isPermanentLock && (
					<AlertBanner type="danger" message={getErrorMessage(error)} />
				)}

				{/* 로그인 폼 */}
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
						onValueChange={setEmail}
						isRequired
						isDisabled={isLocked}
						autoComplete="email"
						variant="bordered"
					/>

					<Input
						type="password"
						label="비밀번호"
						placeholder="********"
						value={password}
						onValueChange={setPassword}
						isRequired
						isDisabled={isLocked}
						autoComplete="current-password"
						variant="bordered"
					/>

					<div className="flex items-center justify-between">
						<Checkbox
							isSelected={remember}
							onValueChange={setRemember}
							size="sm"
							isDisabled={isLocked}
						>
							로그인 상태 유지
						</Checkbox>

						<Link
							href="/forgot-password"
							className="text-sm text-default-400 hover:text-primary"
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
						isDisabled={isLocked}
					>
						로그인
					</Button>
				</form>

				{/* 취소 링크 */}
				<div className="mt-6 text-center">
					<button
						type="button"
						className="text-default-400 hover:text-default-300 text-sm transition-colors"
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
