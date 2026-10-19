"use client";

import {
	Layers,
	LogIn,
	LogOut,
	MessageCircle,
	ShoppingBag,
	Store,
	Users,
} from "lucide-react";
import { observer, useLocalObservable } from "mobx-react-lite";
import Link from "next/link";
import { useEffect } from "react";
import { ChatPanel } from "@/components/live-viewer/ChatPanel";
import {
	createLiveViewerState,
	type LiveViewerState,
} from "@/components/live-viewer/createLiveViewerState";
import { KakaoLoginModal } from "@/components/live-viewer/KakaoLoginModal";
import { LivePlayer } from "@/components/live-viewer/LivePlayer";
import { ProductRail } from "@/components/live-viewer/ProductRail";

/**
 * 시청자 화면: 반응형 시청 레이아웃(데스크톱 = 플레이어+상품 / 채팅 사이드바,
 * 모바일 = 세로 스택)과 무중단 오버레이 결제를 시연한다.
 */
const LiveViewerPage = observer(function LiveViewerPage() {
	const state = useLocalObservable<LiveViewerState>(() =>
		createLiveViewerState(),
	);

	useEffect(() => {
		void state.loadInitialData();
		void state.issuePlaybackToken();
		state.startSimulations();
		return () => state.disposeSimulations();
	}, [state]);

	return (
		<div className="flex min-h-dvh flex-col">
			<header className="sticky top-0 z-30 border-b border-white/10 bg-zinc-950/90 backdrop-blur">
				<div className="mx-auto flex h-14 w-full max-w-6xl items-center justify-between gap-3 px-3 lg:px-6">
					<div className="flex min-w-0 items-center gap-2.5">
						<span className="flex h-8 w-8 shrink-0 items-center justify-center rounded-xl bg-gradient-to-br from-amber-400 to-rose-500 text-sm">
							🛍️
						</span>
						<div className="min-w-0">
							<p className="font-display truncate text-sm font-bold text-white">
								{state.broadcast?.title ?? "라이브 커머스 데모"}
							</p>
							<p className="truncate text-[11px] text-zinc-400">
								{state.broadcast?.hostName ?? "호스트"} · 스트리밍 시연 목업
							</p>
						</div>
					</div>
					<div className="flex shrink-0 items-center gap-2">
						<span className="hidden items-center gap-1 rounded-md bg-white/5 px-2 py-1 text-xs text-zinc-300 sm:flex">
							<Users className="h-3.5 w-3.5" />
							{state.viewerCount.toLocaleString("ko-KR")}
						</span>
						{state.me ? (
							<div className="flex items-center gap-1.5">
								<span className="flex h-7 w-7 items-center justify-center rounded-full bg-amber-400/20 text-xs font-bold text-amber-300">
									{state.me.nickname.slice(0, 1)}
								</span>
								<span className="hidden text-xs font-medium text-zinc-200 sm:inline">
									{state.me.nickname}
								</span>
								<button
									type="button"
									onClick={() => void state.logout()}
									className="rounded-lg p-1.5 text-zinc-400 transition hover:bg-white/10 hover:text-white"
									aria-label="로그아웃"
								>
									<LogOut className="h-4 w-4" />
								</button>
							</div>
						) : (
							<button
								type="button"
								onClick={state.openLoginModal}
								className="flex items-center gap-1.5 rounded-xl bg-[#FEE500] px-3 py-2 text-xs font-bold text-zinc-900 transition hover:brightness-95"
							>
								<LogIn className="h-3.5 w-3.5" />
								카카오 로그인
							</button>
						)}
						<Link
							href="/stack"
							className="hidden items-center gap-1.5 rounded-xl border border-white/15 px-3 py-2 text-xs font-medium text-zinc-300 transition hover:bg-white/10 sm:flex"
						>
							<Layers className="h-3.5 w-3.5" />
							기술 스택
						</Link>
						<Link
							href="/admin"
							className="hidden items-center gap-1.5 rounded-xl border border-white/15 px-3 py-2 text-xs font-medium text-zinc-300 transition hover:bg-white/10 md:flex"
						>
							<Store className="h-3.5 w-3.5" />
							관리자 데모
						</Link>
					</div>
				</div>
			</header>

			<main className="mx-auto w-full max-w-6xl flex-1 px-3 py-4 lg:px-6">
				<div className="grid gap-4 lg:grid-cols-[minmax(0,1fr)_330px]">
					<section className="flex min-w-0 flex-col gap-4">
						<LivePlayer state={state} />
						{/* 모바일: 하단 탭으로 상품/채팅 전환, 데스크톱: 상품 띠 표시 */}
						<div className="lg:hidden">
							<div className="mb-2 grid grid-cols-2 gap-1 rounded-xl bg-white/5 p-1">
								<MobileTabButton
									isActive={state.mobilePanel === "products"}
									onClick={() => state.setMobilePanel("products")}
									icon={<ShoppingBag className="h-3.5 w-3.5" />}
									label="상품"
								/>
								<MobileTabButton
									isActive={state.mobilePanel === "chat"}
									onClick={() => state.setMobilePanel("chat")}
									icon={<MessageCircle className="h-3.5 w-3.5" />}
									label="채팅"
								/>
							</div>
							{state.mobilePanel === "products" ? (
								<ProductRail state={state} />
							) : (
								<div className="h-80">
									<ChatPanel state={state} />
								</div>
							)}
						</div>
						<div className="hidden lg:block">
							<ProductRail state={state} />
						</div>
					</section>

					<aside className="hidden h-[calc(100dvh-6rem)] lg:sticky lg:top-[4.5rem] lg:block">
						<ChatPanel state={state} />
					</aside>
				</div>
			</main>

			<KakaoLoginModal state={state} />
		</div>
	);
});

function MobileTabButton({
	isActive,
	onClick,
	icon,
	label,
}: {
	isActive: boolean;
	onClick: () => void;
	icon: React.ReactNode;
	label: string;
}) {
	return (
		<button
			type="button"
			onClick={onClick}
			className={`flex items-center justify-center gap-1.5 rounded-lg py-2 text-xs font-semibold transition ${
				isActive
					? "bg-white/15 text-white"
					: "text-zinc-400 hover:text-zinc-200"
			}`}
		>
			{icon}
			{label}
		</button>
	);
}

export default LiveViewerPage;
