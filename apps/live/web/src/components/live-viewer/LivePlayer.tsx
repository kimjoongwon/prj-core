"use client";

import { Radio, ShoppingBag, Users, Volume2, VolumeX } from "lucide-react";
import { observer } from "mobx-react-lite";
import { useEffect, useRef, useState } from "react";
import type { LiveViewerState } from "@/components/live-viewer/createLiveViewerState";
import { PurchaseOverlay } from "@/components/live-viewer/PurchaseOverlay";
import { liveVideoSrc } from "@/lib/api-client";

function formatCountdown(seconds: number): string {
	const minutes = Math.floor(seconds / 60);
	const rest = seconds % 60;
	return `${minutes}:${rest.toString().padStart(2, "0")}`;
}

/**
 * 라이브 플레이어.
 * 실제 서비스에서는 이 <video> 자리를 Amazon IVS Player Web SDK(또는
 * 자체 호스팅 미디어 서버의 WebRTC/저지연 HLS 재생)로 교체하고,
 * 재생 전에 playback-token API가 발급한 토큰을 플레이어에 전달한다.
 */
export const LivePlayer = observer(function LivePlayer({
	state,
}: {
	state: LiveViewerState;
}) {
	const videoRef = useRef<HTMLVideoElement>(null);
	const [isMuted, setIsMuted] = useState(true);

	const couponVisible =
		state.latestCouponText !== null &&
		Date.now() - state.latestCouponShownAt < 6000;

	useEffect(() => {
		const video = videoRef.current;
		if (video) {
			video.muted = isMuted;
		}
	}, [isMuted]);

	return (
		<div className="relative aspect-video w-full overflow-hidden rounded-2xl bg-black shadow-xl shadow-black/40 ring-1 ring-white/10">
			<video
				ref={videoRef}
				src={liveVideoSrc}
				autoPlay
				loop
				muted
				playsInline
				className="h-full w-full object-cover"
			/>

			{/* 상단 오버레이: LIVE 배지 · 시청자 수 · 재생 토큰 */}
			<div className="pointer-events-none absolute inset-x-0 top-0 flex items-start justify-between p-3">
				<div className="flex items-center gap-2">
					<span className="flex items-center gap-1.5 rounded-md bg-red-600/90 px-2 py-1 text-xs font-bold tracking-wide text-white">
						<span className="live-dot inline-block h-2 w-2 rounded-full bg-white" />
						LIVE
					</span>
					<span className="flex items-center gap-1 rounded-md bg-black/60 px-2 py-1 text-xs font-medium text-white backdrop-blur">
						<Users className="h-3.5 w-3.5" />
						{state.viewerCount.toLocaleString("ko-KR")}명 시청 중
					</span>
				</div>
				<span className="flex items-center gap-1.5 rounded-md bg-black/60 px-2 py-1 text-[11px] font-medium text-emerald-300 backdrop-blur">
					<Radio className="h-3.5 w-3.5" />
					재생보안 토큰{" "}
					{state.isPlaybackTokenIssued
						? formatCountdown(state.playbackRemainingSeconds)
						: "발급 중…"}
				</span>
			</div>

			{/* 쿠폰 드롭 배너 */}
			{couponVisible && state.latestCouponText ? (
				<div className="coupon-drop pointer-events-none absolute inset-x-0 top-14 flex justify-center">
					<span className="rounded-full border border-violet-400/40 bg-violet-500/90 px-4 py-1.5 text-sm font-semibold text-white shadow-lg">
						{state.latestCouponText}
					</span>
				</div>
			) : null}

			{/* 하단 정보 그라디언트 */}
			<div className="pointer-events-none absolute inset-x-0 bottom-0 bg-gradient-to-t from-black/80 via-black/30 to-transparent px-4 pb-3 pt-10">
				<p className="font-display text-sm font-semibold text-white sm:text-base">
					{state.broadcast?.title ?? "라이브 커머스 방송"}
				</p>
				<p className="text-xs text-zinc-300">
					{state.broadcast?.hostName ?? "호스트"} · 채널{" "}
					{state.broadcast?.channelName ?? "-"}
				</p>
			</div>

			{/* 음소거 해제 (자동재생은 음소거로 시작) */}
			<button
				type="button"
				onClick={() => setIsMuted((muted) => !muted)}
				className="absolute bottom-3 right-3 flex items-center gap-1.5 rounded-full bg-black/60 px-3 py-1.5 text-xs font-medium text-white backdrop-blur transition hover:bg-black/80"
				aria-label={isMuted ? "소리 켜기" : "소리 끄기"}
			>
				{isMuted ? (
					<VolumeX className="h-4 w-4" />
				) : (
					<Volume2 className="h-4 w-4" />
				)}
				{isMuted ? "소리 켜기" : "소리 끄기"}
			</button>

			{/* 무중단 오버레이 결제 — 영상 위에 떠 있고 재생은 계속된다 */}
			<PurchaseOverlay state={state} />

			{/* 구매 유도 플로팅 버튼 (모바일) */}
			{!state.purchase ? (
				<button
					type="button"
					onClick={() =>
						state.requestPurchaseOrLogin(state.products[0]?.id ?? "")
					}
					className="absolute right-3 top-14 flex items-center gap-1.5 rounded-full bg-amber-500 px-3 py-2 text-xs font-bold text-zinc-950 shadow-lg transition hover:bg-amber-400 sm:hidden"
				>
					<ShoppingBag className="h-4 w-4" />
					지금 방송 상품 구매
				</button>
			) : null}
		</div>
	);
});
