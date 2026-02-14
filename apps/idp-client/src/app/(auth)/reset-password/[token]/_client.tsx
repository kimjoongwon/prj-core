"use client";

import { Button, Input, Link } from "@heroui/react";
import { useEffect, useState } from "react";

/** 비밀번호 정책 규칙 */
const PASSWORD_RULES = [
	{ rule: "minLength", label: "8자 이상", test: (pw: string) => pw.length >= 8 },
	{ rule: "maxLength", label: "128자 이하", test: (pw: string) => pw.length <= 128 },
	{ rule: "uppercase", label: "영문 대문자 포함", test: (pw: string) => /[A-Z]/.test(pw) },
	{ rule: "lowercase", label: "영문 소문자 포함", test: (pw: string) => /[a-z]/.test(pw) },
	{ rule: "number", label: "숫자 포함", test: (pw: string) => /[0-9]/.test(pw) },
	{ rule: "special", label: "특수문자 포함", test: (pw: string) => /[!@#$%^&*()_+\-=\[\]{}|;:,.<>?/~`"']/.test(pw) },
];

/** PasswordStrengthIndicator 인라인 컴포넌트 */
function PasswordStrengthIndicator({ password }: { password: string }) {
	const results = PASSWORD_RULES.map((r) => ({
		...r,
		passed: password.length > 0 ? r.test(password) : false,
	}));

	if (!password) return null;

	return (
		<div className="space-y-1.5 mt-2">
			{results.map((r) => (
				<div key={r.rule} className="flex items-center gap-2 text-sm">
					{r.passed ? (
						<svg className="w-4 h-4 text-success shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
							<path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
						</svg>
					) : (
						<svg className="w-4 h-4 text-default-400 shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
							<path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
						</svg>
					)}
					<span className={r.passed ? "text-success" : "text-default-400"}>
						{r.label}
					</span>
				</div>
			))}
		</div>
	);
}

interface ResetPasswordClientProps {
	token: string;
}

/**
 * 비밀번호 재설정 클라이언트 컴포넌트
 *
 * 1. 페이지 로드 시 토큰 유효성 검증
 * 2. 유효하면 새 비밀번호 입력 폼 표시
 * 3. 실시간 비밀번호 정책 검증 (PasswordStrengthIndicator)
 */
export function ResetPasswordClient({ token }: ResetPasswordClientProps) {
	const [isValidating, setIsValidating] = useState(true);
	const [isTokenValid, setIsTokenValid] = useState(false);
	const [tokenEmail, setTokenEmail] = useState("");
	const [tokenError, setTokenError] = useState<string | null>(null);

	const [password, setPassword] = useState("");
	const [confirmPassword, setConfirmPassword] = useState("");
	const [isSubmitting, setIsSubmitting] = useState(false);
	const [isComplete, setIsComplete] = useState(false);
	const [submitError, setSubmitError] = useState<string | null>(null);

	// 토큰 검증
	useEffect(() => {
		const validateToken = async () => {
			try {
				const response = await fetch(`/api/reset-password/${token}`);
				const data = await response.json();

				if (data.valid) {
					setIsTokenValid(true);
					setTokenEmail(data.email || "");
				} else {
					setTokenError(
						data.reason === "TOKEN_EXPIRED"
							? "링크가 만료되었습니다."
							: "유효하지 않은 링크입니다.",
					);
				}
			} catch {
				setTokenError("서버와 통신할 수 없습니다.");
			} finally {
				setIsValidating(false);
			}
		};

		validateToken();
	}, [token]);

	const isPasswordValid = PASSWORD_RULES.every((r) => r.test(password));
	const isPasswordMatch = password === confirmPassword && confirmPassword.length > 0;

	const handleSubmit = async () => {
		setSubmitError(null);
		setIsSubmitting(true);

		try {
			const response = await fetch(`/api/reset-password/${token}`, {
				method: "POST",
				headers: { "Content-Type": "application/json" },
				body: JSON.stringify({ password, confirmPassword }),
			});

			const data = await response.json();

			if (!response.ok) {
				const errorCode = data.error || "";
				if (errorCode === "PASSWORD_REUSE") {
					setSubmitError("최근 사용한 비밀번호는 다시 사용할 수 없습니다.");
				} else if (errorCode.startsWith("PASSWORD_POLICY_VIOLATION")) {
					setSubmitError("비밀번호가 정책 조건을 충족하지 않습니다.");
				} else if (errorCode === "TOKEN_EXPIRED") {
					setTokenError("링크가 만료되었습니다.");
					setIsTokenValid(false);
				} else if (errorCode === "PASSWORD_MISMATCH") {
					setSubmitError("비밀번호가 일치하지 않습니다.");
				} else {
					setSubmitError(data.error || "비밀번호 재설정에 실패했습니다.");
				}
				return;
			}

			setIsComplete(true);
		} catch {
			setSubmitError("서버와 통신할 수 없습니다.");
		} finally {
			setIsSubmitting(false);
		}
	};

	return (
		<div className="min-h-screen flex items-center justify-center relative">
			{/* 배경 블러 오브 */}
			<div className="fixed bottom-0 left-0 w-[500px] h-[500px] bg-primary/30 rounded-full blur-3xl -translate-x-1/2 translate-y-1/2" />
			<div className="fixed top-0 right-0 w-[400px] h-[400px] bg-secondary/20 rounded-full blur-3xl translate-x-1/2 -translate-y-1/2 opacity-70" />

			<div className="relative z-10 w-full max-w-md px-6">
				<div className="bg-content1 p-8 rounded-2xl shadow-xl border border-divider">
					{/* 로딩 중 */}
					{isValidating && (
						<div className="text-center py-8">
							<div className="w-8 h-8 border-2 border-primary border-t-transparent rounded-full animate-spin mx-auto mb-4" />
							<p className="text-default-500">링크를 확인하고 있습니다...</p>
						</div>
					)}

					{/* 토큰 만료/무효 */}
					{!isValidating && !isTokenValid && (
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
								<Button color="primary" className="w-full font-semibold" size="lg">
									다시 요청하기
								</Button>
							</Link>
						</div>
					)}

					{/* 재설정 완료 */}
					{!isValidating && isComplete && (
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
								<br />
								새 비밀번호로 다시 로그인해주세요.
							</p>
							<Link href="/">
								<Button color="primary" className="w-full font-semibold" size="lg">
									로그인하기
								</Button>
							</Link>
						</div>
					)}

					{/* 비밀번호 입력 폼 */}
					{!isValidating && isTokenValid && !isComplete && (
						<>
							{/* 타이틀 */}
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
											d="M15 7a2 2 0 012 2m4 0a6 6 0 01-7.743 5.743L11 17H9v2H7v2H4a1 1 0 01-1-1v-2.586a1 1 0 01.293-.707l5.964-5.964A6 6 0 1121 9z"
										/>
									</svg>
								</div>
								<h1 className="text-2xl font-bold">새 비밀번호 설정</h1>
								{tokenEmail && (
									<p className="text-default-500 mt-2 text-sm">
										{tokenEmail}
									</p>
								)}
							</div>

							{/* 에러 메시지 */}
							{submitError && (
								<div className="bg-danger/20 border border-danger/50 text-danger p-4 rounded-lg mb-6 flex items-center gap-2 text-sm">
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
									{submitError}
								</div>
							)}

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
									<PasswordStrengthIndicator password={password} />
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
								href="/"
								className="text-default-400 hover:text-default-300 text-sm"
							>
								로그인으로 돌아가기
							</Link>
						</div>
					)}
				</div>

				{/* 푸터 */}
				<p className="text-center text-default-400 text-sm mt-6">
					Powered by OIDC Identity Provider
				</p>
			</div>
		</div>
	);
}
