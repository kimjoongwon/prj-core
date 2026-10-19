"use client";

import { observer } from "mobx-react-lite";
import { useState } from "react";
import type { LiveViewerState } from "@/components/live-viewer/createLiveViewerState";

/**
 * 카카오 로그인 목업 모달.
 * 1단계: 카카오 로그인 버튼 → 2단계: 카카오 동의 화면 흉내(프로필·닉네임·동의 항목).
 * 실제 서비스에서는 이 모달 자리를 카카오 OAuth authorize 리다이렉트로 바꾸고,
 * 서버가 카카오 token/userinfo를 조회한 뒤 서비스 JWT를 발급한다(→ /api/auth/kakao).
 */
export const KakaoLoginModal = observer(function KakaoLoginModal({
	state,
}: {
	state: LiveViewerState;
}) {
	const [screen, setScreen] = useState<"entry" | "consent">("entry");
	const [nickname, setNickname] = useState("김라이브");
	const [isSubmitting, setIsSubmitting] = useState(false);

	if (!state.isLoginModalOpen) {
		return null;
	}

	const handleSubmitConsent = async () => {
		setIsSubmitting(true);
		try {
			await state.login(nickname);
			setScreen("entry");
		} catch {
			setIsSubmitting(false);
		}
	};

	return (
		<div
			className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 p-4 backdrop-blur-sm"
			role="dialog"
			aria-modal="true"
			aria-label="카카오 로그인"
		>
			{screen === "entry" ? (
				<div className="w-full max-w-xs rounded-3xl bg-zinc-900 p-6 text-center ring-1 ring-white/10">
					<div className="mx-auto mb-4 flex h-12 w-12 items-center justify-center rounded-2xl bg-[#FEE500] text-2xl">
						💬
					</div>
					<h2 className="font-display text-lg font-bold text-white">
						간편 로그인
					</h2>
					<p className="mt-1 mb-5 text-xs leading-relaxed text-zinc-400">
						카카오 계정으로 로그인하고
						<br />
						구매와 채팅을 시작해 보세요
					</p>
					<button
						type="button"
						onClick={() => setScreen("consent")}
						className="flex w-full items-center justify-center gap-2 rounded-xl bg-[#FEE500] py-3 text-sm font-bold text-zinc-900 transition hover:brightness-95"
					>
						<span aria-hidden>💬</span> 카카오로 로그인하기
					</button>
					<button
						type="button"
						onClick={state.closeLoginModal}
						className="mt-3 text-xs text-zinc-500 transition hover:text-zinc-300"
					>
						나중에 하기
					</button>
					<p className="mt-4 text-[10px] text-zinc-600">
						시연용 목업 로그인입니다 — 실제 카카오 인증이 진행되지 않아요
					</p>
				</div>
			) : (
				<div className="w-full max-w-xs overflow-hidden rounded-3xl bg-white text-zinc-900 shadow-2xl">
					<div className="flex items-center justify-center gap-1.5 bg-[#FEE500] py-3">
						<span aria-hidden>💬</span>
						<span className="text-xs font-bold">카카오 로그인</span>
					</div>
					<div className="p-5">
						<div className="flex flex-col items-center gap-2">
							<div className="flex h-16 w-16 items-center justify-center rounded-full bg-[#FEE500] text-2xl font-bold text-zinc-800">
								{nickname.slice(0, 1) || "카"}
							</div>
							<p className="text-sm font-semibold">{nickname}</p>
						</div>

						<label className="mt-4 block text-xs font-semibold text-zinc-500">
							닉네임 (채팅·주문에 표시돼요)
							<input
								value={nickname}
								onChange={(event) => setNickname(event.target.value)}
								maxLength={12}
								className="mt-1 w-full rounded-lg border border-zinc-300 px-3 py-2 text-sm text-zinc-900 focus:border-yellow-400 focus:outline-none"
							/>
						</label>

						<div className="mt-4 space-y-2 text-xs text-zinc-600">
							<p className="font-semibold text-zinc-800">동의 항목</p>
							<ConsentItem label="프로필 이름·사진" required />
							<ConsentItem label="카카오계정 (이메일)" required />
							<ConsentItem label="구매 내역 알림톡 수신" />
						</div>

						<button
							type="button"
							disabled={isSubmitting || nickname.trim().length === 0}
							onClick={() => void handleSubmitConsent()}
							className="mt-5 w-full rounded-xl bg-[#FEE500] py-3 text-sm font-bold text-zinc-900 transition hover:brightness-95 disabled:opacity-50"
						>
							{isSubmitting ? "로그인 중…" : "동의하고 계속하기"}
						</button>
						<button
							type="button"
							onClick={() => setScreen("entry")}
							className="mt-2 w-full py-1 text-center text-xs text-zinc-400 transition hover:text-zinc-600"
						>
							취소
						</button>
					</div>
				</div>
			)}
		</div>
	);
});

function ConsentItem({
	label,
	required = false,
}: {
	label: string;
	required?: boolean;
}) {
	return (
		<div className="flex items-center justify-between rounded-lg bg-zinc-100 px-3 py-2">
			<span>{label}</span>
			<span className="text-[10px] font-semibold text-zinc-400">
				{required ? "필수" : "선택"} ✓
			</span>
		</div>
	);
}
