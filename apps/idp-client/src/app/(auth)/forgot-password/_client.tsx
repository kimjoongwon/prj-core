"use client";

import { Button, Input, Link } from "@heroui/react";
import { useState } from "react";

/**
 * 비밀번호 찾기 클라이언트 컴포넌트
 *
 * 이메일을 입력받아 비밀번호 재설정 링크를 발송 요청합니다.
 * 보안: 이메일 존재 여부와 관계없이 항상 동일한 메시지를 표시합니다.
 */
export function ForgotPasswordClient() {
	const [email, setEmail] = useState("");
	const [isSubmitting, setIsSubmitting] = useState(false);
	const [isSubmitted, setIsSubmitted] = useState(false);
	const [error, setError] = useState<string | null>(null);

	const handleSubmit = async () => {
		setError(null);
		setIsSubmitting(true);

		try {
			const response = await fetch("/api/forgot-password", {
				method: "POST",
				headers: { "Content-Type": "application/json" },
				body: JSON.stringify({ email }),
			});

			if (!response.ok) {
				setError("요청 처리 중 오류가 발생했습니다.");
				return;
			}

			setIsSubmitted(true);
		} catch {
			setError("서버와 통신할 수 없습니다.");
		} finally {
			setIsSubmitting(false);
		}
	};

	const handleResend = () => {
		setIsSubmitted(false);
		handleSubmit();
	};

	return (
		<div className="min-h-screen flex items-center justify-center relative">
			{/* 배경 블러 오브 */}
			<div className="fixed bottom-0 left-0 w-[500px] h-[500px] bg-primary/30 rounded-full blur-3xl -translate-x-1/2 translate-y-1/2" />
			<div className="fixed top-0 right-0 w-[400px] h-[400px] bg-secondary/20 rounded-full blur-3xl translate-x-1/2 -translate-y-1/2 opacity-70" />

			<div className="relative z-10 w-full max-w-md px-6">
				<div className="bg-content1 p-8 rounded-2xl shadow-xl border border-divider">
					{/* 아이콘/타이틀 */}
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
									d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z"
								/>
							</svg>
						</div>
						<h1 className="text-2xl font-bold">비밀번호 찾기</h1>
						<p className="text-default-500 mt-2">
							가입한 이메일 주소를 입력하세요
						</p>
					</div>

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
								<span className="font-medium text-foreground">{email}</span>
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
									{error}
								</div>
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
				</div>

				{/* 푸터 */}
				<p className="text-center text-default-400 text-sm mt-6">
					Powered by OIDC Identity Provider
				</p>
			</div>
		</div>
	);
}
