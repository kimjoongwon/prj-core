"use client";

import { Button } from "@heroui/react";
import { useState } from "react";

interface ConsentFormProps {
	uid: string;
	client: {
		clientId: string;
		clientName: string;
		logoUri?: string;
	} | null;
	prompt: {
		name: string;
		details?: {
			missingOIDCScope?: string[];
			missingResourceScopes?: Record<string, string[]>;
		};
	};
}

const SCOPE_LABELS: Record<string, string> = {
	openid: "기본 프로필 정보",
	email: "이메일 주소",
	profile: "프로필 정보 (이름)",
	phone: "전화번호",
	roles: "역할 정보",
	permissions: "권한 정보",
};

const SCOPE_ICONS: Record<string, string> = {
	openid:
		"M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z",
	email:
		"M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z",
	profile:
		"M5.121 17.804A13.937 13.937 0 0112 16c2.5 0 4.847.655 6.879 1.804M15 10a3 3 0 11-6 0 3 3 0 016 0zm6 2a9 9 0 11-18 0 9 9 0 0118 0z",
	phone:
		"M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z",
};

const DEFAULT_SCOPE_ICON =
	"M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z";

/**
 * OIDC 동의(Consent) 폼
 *
 * 클라이언트가 요청하는 권한 목록을 표시하고,
 * 사용자가 허용/거부를 선택할 수 있습니다.
 */
export function ConsentForm({ uid, client, prompt }: ConsentFormProps) {
	const [error, setError] = useState<string | null>(null);
	const [isSubmitting, setIsSubmitting] = useState(false);

	const missingScopes = prompt.details?.missingOIDCScope || [];

	const handleConfirm = async () => {
		setError(null);
		setIsSubmitting(true);

		try {
			const response = await fetch(`/api/interaction/${uid}/confirm`, {
				method: "POST",
				headers: { "Content-Type": "application/json" },
				credentials: "include",
			});

			const data = await response.json();

			if (!response.ok) {
				setError(data.error || "동의 처리에 실패했습니다.");
				return;
			}

			window.location.href = data.redirectTo;
		} catch {
			setError("서버와 통신할 수 없습니다.");
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
			setError("요청 처리 중 오류가 발생했습니다.");
		}
	};

	return (
		<div className="min-h-screen flex items-center justify-center relative">
			{/* 배경 블러 오브 */}
			<div className="fixed bottom-0 left-0 w-[500px] h-[500px] bg-primary/30 rounded-full blur-3xl -translate-x-1/2 translate-y-1/2" />
			<div className="fixed top-0 right-0 w-[400px] h-[400px] bg-secondary/20 rounded-full blur-3xl translate-x-1/2 -translate-y-1/2 opacity-70" />

			<div className="relative z-10 w-full max-w-md px-6">
				<div className="bg-content1 p-8 rounded-2xl shadow-xl border border-divider">
					{/* 클라이언트 정보 */}
					<div className="text-center mb-8">
						{client?.logoUri ? (
							<img
								src={client.logoUri}
								alt={client.clientName}
								className="w-16 h-16 rounded-2xl mx-auto mb-4"
							/>
						) : (
							<div className="w-16 h-16 bg-gradient-to-br from-success to-secondary rounded-2xl mx-auto mb-4 flex items-center justify-center">
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
										d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z"
									/>
								</svg>
							</div>
						)}
						<h1 className="text-2xl font-bold">
							{client?.clientName || "애플리케이션"}
						</h1>
						<p className="text-default-500 mt-2">
							이 애플리케이션이 다음 권한을 요청합니다
						</p>
					</div>

					{/* 에러 메시지 */}
					{error && (
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
							{error}
						</div>
					)}

					{/* 요청된 권한 목록 */}
					<div className="bg-default-100 rounded-xl p-4 mb-6">
						<h3 className="text-sm font-medium text-default-600 mb-3">
							요청된 권한
						</h3>
						<ul className="space-y-3">
							{missingScopes.map((scope) => (
								<li key={scope} className="flex items-center">
									<div className="w-8 h-8 rounded-lg bg-primary/20 flex items-center justify-center mr-3">
										<svg
											className="w-4 h-4 text-primary"
											fill="none"
											stroke="currentColor"
											viewBox="0 0 24 24"
										>
											<path
												strokeLinecap="round"
												strokeLinejoin="round"
												strokeWidth={2}
												d={SCOPE_ICONS[scope] || DEFAULT_SCOPE_ICON}
											/>
										</svg>
									</div>
									<p className="text-foreground font-medium">
										{SCOPE_LABELS[scope] || scope}
									</p>
								</li>
							))}
						</ul>
					</div>

					{/* 액션 버튼 */}
					<div className="flex gap-4">
						<Button
							color="success"
							className="flex-1 font-semibold"
							size="lg"
							isLoading={isSubmitting}
							onPress={handleConfirm}
						>
							허용
						</Button>
						<Button
							variant="flat"
							className="flex-1 font-semibold"
							size="lg"
							onPress={handleAbort}
						>
							거부
						</Button>
					</div>

					{/* 개인정보 안내 */}
					<p className="text-center text-default-400 text-xs mt-6">
						허용하면 위 정보가 {client?.clientName || "애플리케이션"}
						과(와) 공유됩니다.
					</p>
				</div>
			</div>
		</div>
	);
}
