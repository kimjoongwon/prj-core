"use client";

import { Button, Checkbox, Input, Link } from "@heroui/react";
import { useState } from "react";

interface LoginFormProps {
	uid: string;
	client: {
		clientId: string;
		clientName: string;
		logoUri?: string;
	} | null;
	isDev: boolean;
}

/** 로그인 API 에러 응답 */
interface LoginErrorResponse {
	error: string;
	remainingAttempts?: number;
	lockedUntil?: string;
}

/**
 * 에러 코드를 사용자 메시지로 변환합니다
 */
function getErrorMessage(data: LoginErrorResponse): string {
	switch (data.error) {
		case "INVALID_CREDENTIALS":
			if (data.remainingAttempts !== undefined && data.remainingAttempts > 0) {
				return `이메일 또는 비밀번호가 올바르지 않습니다. (남은 시도: ${data.remainingAttempts}/5)`;
			}
			return "이메일 또는 비밀번호가 올바르지 않습니다.";

		case "ACCOUNT_LOCKED_TEMPORARY":
			return "계정이 일시 잠겼습니다. 15분 후 다시 시도하세요.";

		case "ACCOUNT_LOCKED_PERMANENT":
			return "계정이 잠겼습니다. 비밀번호를 재설정하거나 관리자에게 문의하세요.";

		default:
			return data.error || "로그인에 실패했습니다.";
	}
}

/**
 * OIDC 로그인 폼
 *
 * 이메일/비밀번호를 입력받아 idp-server에 인증 요청을 보냅니다.
 * 성공 시 redirectTo URL로 이동합니다.
 *
 * 강화 기능:
 * - 로그인 실패 시 남은 시도 횟수 표시
 * - 계정 잠금 시 잠금 유형별 메시지 표시
 * - "비밀번호를 잊으셨나요?" 링크
 */
export function LoginForm({ uid, client, isDev }: LoginFormProps) {
	const [email, setEmail] = useState(isDev ? "ceo@f45training.co.kr" : "");
	const [password, setPassword] = useState(isDev ? "SuperAdmin123!@#" : "");
	const [remember, setRemember] = useState(false);
	const [error, setError] = useState<LoginErrorResponse | null>(null);
	const [isSubmitting, setIsSubmitting] = useState(false);
	const [isLocked, setIsLocked] = useState(false);

	const handleSubmitLogin = async () => {
		setError(null);
		setIsSubmitting(true);

		try {
			const response = await fetch(`/api/interaction/${uid}/login`, {
				method: "POST",
				headers: { "Content-Type": "application/json" },
				credentials: "include",
				body: JSON.stringify({ email, password, remember }),
			});

			const data = await response.json();

			if (!response.ok) {
				const errorData = data as LoginErrorResponse;
				setError(errorData);

				// 잠금 상태면 폼 비활성화
				if (
					errorData.error === "ACCOUNT_LOCKED_TEMPORARY" ||
					errorData.error === "ACCOUNT_LOCKED_PERMANENT"
				) {
					setIsLocked(true);
				}
				return;
			}

			window.location.href = data.redirectTo;
		} catch {
			setError({ error: "서버와 통신할 수 없습니다." });
		} finally {
			setIsSubmitting(false);
		}
	};

	const handleAbort = async () => {
		try {
			const response = await fetch(`/api/interaction/${uid}/abort`, {
				method: "POST",
				headers: { "Content-Type": "application/json" },
				credentials: "include",
			});

			const data = await response.json();

			if (data.redirectTo) {
				window.location.href = data.redirectTo;
			}
		} catch {
			setError({ error: "요청 처리 중 오류가 발생했습니다." });
		}
	};

	const isTemporaryLock = error?.error === "ACCOUNT_LOCKED_TEMPORARY";
	const isPermanentLock = error?.error === "ACCOUNT_LOCKED_PERMANENT";

	return (
		<div className="min-h-screen flex items-center justify-center relative">
			{/* 배경 블러 오브 */}
			<div className="fixed bottom-0 left-0 w-[500px] h-[500px] bg-primary/30 rounded-full blur-3xl -translate-x-1/2 translate-y-1/2" />
			<div className="fixed top-0 right-0 w-[400px] h-[400px] bg-secondary/20 rounded-full blur-3xl translate-x-1/2 -translate-y-1/2 opacity-70" />

			<div className="relative z-10 w-full max-w-md px-6">
				<div className="bg-content1 p-8 rounded-2xl shadow-xl border border-divider">
					{/* 로고/타이틀 */}
					<div className="text-center mb-8">
						<div className="w-16 h-16 bg-gradient-to-br from-primary to-secondary rounded-2xl mx-auto mb-4 flex items-center justify-center">
							<svg
								className="w-8 h-8 text-white"
								fill="none"
								stroke="currentColor"
								viewBox="0 0 24 24"
							>
								<path
									strokeLinecap="round"
									strokeLinejoin="round"
									strokeWidth={2}
									d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z"
								/>
							</svg>
						</div>
						<h1 className="text-2xl font-bold">로그인</h1>
						{client && (
							<p className="text-default-500 mt-2">
								{client.clientName}에 로그인
							</p>
						)}
					</div>

					{/* DEV 모드 뱃지 */}
					{isDev && (
						<div className="bg-warning/20 border border-warning/50 text-warning p-3 rounded-lg mb-6 text-center text-sm">
							DEV MODE - Super Admin 계정이 자동 입력되었습니다
						</div>
					)}

					{/* 잠금 경고 배너 */}
					{isTemporaryLock && (
						<div className="bg-warning/20 border border-warning/50 text-warning p-4 rounded-lg mb-6">
							<div className="flex items-center gap-2 font-semibold mb-1">
								<svg
									className="w-5 h-5 shrink-0"
									fill="none"
									stroke="currentColor"
									viewBox="0 0 24 24"
								>
									<path
										strokeLinecap="round"
										strokeLinejoin="round"
										strokeWidth={2}
										d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z"
									/>
								</svg>
								계정 일시 잠금
							</div>
							<p className="text-sm">
								로그인 실패 횟수 초과로 계정이 일시 잠겼습니다.
								15분 후 다시 시도하거나, 비밀번호를 재설정하세요.
							</p>
							<Link
								href="/forgot-password"
								className="text-sm mt-2 inline-block text-primary"
							>
								비밀번호 재설정하기
							</Link>
						</div>
					)}

					{isPermanentLock && (
						<div className="bg-danger/20 border border-danger/50 text-danger p-4 rounded-lg mb-6">
							<div className="flex items-center gap-2 font-semibold mb-1">
								<svg
									className="w-5 h-5 shrink-0"
									fill="none"
									stroke="currentColor"
									viewBox="0 0 24 24"
								>
									<path
										strokeLinecap="round"
										strokeLinejoin="round"
										strokeWidth={2}
										d="M18.364 18.364A9 9 0 005.636 5.636m12.728 12.728A9 9 0 015.636 5.636m12.728 12.728L5.636 5.636"
									/>
								</svg>
								계정 잠금
							</div>
							<p className="text-sm">
								보안을 위해 계정이 잠겼습니다.
								비밀번호를 재설정하거나 관리자에게 문의하세요.
							</p>
							<div className="flex gap-3 mt-2">
								<Link
									href="/forgot-password"
									className="text-sm text-primary"
								>
									비밀번호 재설정
								</Link>
							</div>
						</div>
					)}

					{/* 일반 에러 메시지 (잠금이 아닌 경우) */}
					{error && !isTemporaryLock && !isPermanentLock && (
						<div className="bg-danger/20 border border-danger/50 text-danger p-4 rounded-lg mb-6 flex items-center gap-2">
							<svg
								className="w-5 h-5 shrink-0"
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
							{getErrorMessage(error)}
						</div>
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
							onClick={handleAbort}
						>
							취소하고 돌아가기
						</button>
					</div>
				</div>

				{/* 푸터 */}
				<p className="text-center text-default-400 text-sm mt-6">
					Powered by OIDC Identity Provider
				</p>
			</div>
		</div>
	);
}
