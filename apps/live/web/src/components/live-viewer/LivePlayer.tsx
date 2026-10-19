"use client";

import {
	Radio,
	ShoppingBag,
	Users,
	Volume2,
	VolumeX,
	Wifi,
	WifiOff,
} from "lucide-react";
import { observer } from "mobx-react-lite";
import { useEffect, useRef, useState } from "react";
import type {
	LiveViewerState,
	StreamTransport,
} from "@/components/live-viewer/createLiveViewerState";
import { PurchaseOverlay } from "@/components/live-viewer/PurchaseOverlay";
import { liveVideoSrc } from "@/lib/api-client";

type MpegtsModule = typeof import("mpegts.js");
type MpegtsPlayer = ReturnType<MpegtsModule["default"]["createPlayer"]>;

// 이 시간 안에 첫 프레임이 오지 않으면 로컬 영상으로 폴백해 시연이 멈추지 않게 한다
const STREAM_CONNECT_TIMEOUT_MS = 8000;

function formatCountdown(seconds: number): string {
	const minutes = Math.floor(seconds / 60);
	const rest = seconds % 60;
	return `${minutes}:${rest.toString().padStart(2, "0")}`;
}

/**
 * 라이브 플레이어.
 * 영상 소스는 클러스터에 배포된 오픈소스 미디어 서버 SRS가 송출하는 실스트림이다.
 *  - 데스크톱·안드로이드: HTTP-FLV를 mpegts.js(MSE)로 재생 — 1~3초 지연
 *  - iOS Safari: 네이티브 HLS
 *  - 스트림에 닿지 못하면 로컬 루프 영상으로 폴백
 * 관리형(Amazon IVS Player SDK)으로 바꿀 때도 아래 attach 로직만 교체하면 된다.
 */
export const LivePlayer = observer(function LivePlayer({
	state,
}: {
	state: LiveViewerState;
}) {
	const videoRef = useRef<HTMLVideoElement>(null);
	const [isMuted, setIsMuted] = useState(true);
	const flvUrl = state.broadcast?.playbackUrl ?? null;
	const hlsUrl = state.broadcast?.playbackHlsUrl ?? null;

	const couponVisible =
		state.latestCouponText !== null &&
		Date.now() - state.latestCouponShownAt < 6000;

	useEffect(() => {
		const video = videoRef.current;
		if (video) {
			video.muted = isMuted;
		}
	}, [isMuted]);

	useEffect(() => {
		const video = videoRef.current;
		if (!video || !flvUrl) {
			return;
		}
		let isDisposed = false;
		let player: MpegtsPlayer | null = null;
		let connectTimeout: ReturnType<typeof setTimeout> | null = null;

		const clearConnectTimeout = () => {
			if (connectTimeout) {
				clearTimeout(connectTimeout);
				connectTimeout = null;
			}
		};

		const playFallbackLoop = () => {
			if (isDisposed) {
				return;
			}
			clearConnectTimeout();
			if (player) {
				player.destroy();
				player = null;
			}
			video.loop = true;
			video.src = liveVideoSrc;
			void video.play().catch(() => {});
			state.setStreamStatus("fallback");
		};

		const markLive = (transport: StreamTransport) => {
			if (isDisposed) {
				return;
			}
			clearConnectTimeout();
			state.setStreamStatus("live", transport);
		};

		state.setStreamStatus("connecting");
		connectTimeout = setTimeout(() => {
			if (state.streamStatus !== "live") {
				playFallbackLoop();
			}
		}, STREAM_CONNECT_TIMEOUT_MS);

		// iOS/macOS Safari는 HLS를 네이티브로 재생한다
		const canPlayNativeHls =
			video.canPlayType("application/vnd.apple.mpegurl") !== "";
		if (canPlayNativeHls && hlsUrl) {
			const onPlaying = () => markLive("hls");
			video.loop = false;
			video.src = hlsUrl;
			video.addEventListener("playing", onPlaying, { once: true });
			video.addEventListener("error", playFallbackLoop, { once: true });
			void video.play().catch(() => {});
			return () => {
				isDisposed = true;
				clearConnectTimeout();
				video.removeEventListener("playing", onPlaying);
				video.removeEventListener("error", playFallbackLoop);
			};
		}

		// 그 외 브라우저: HTTP-FLV → mpegts.js(MSE)
		void import("mpegts.js")
			.then(({ default: mpegts }) => {
				if (isDisposed) {
					return;
				}
				if (!mpegts.isSupported()) {
					playFallbackLoop();
					return;
				}
				video.loop = false;
				player = mpegts.createPlayer(
					{ type: "flv", isLive: true, url: flvUrl },
					{
						enableWorker: false,
						lazyLoad: false,
						autoCleanupSourceBuffer: true,
						liveBufferLatencyChasing: true,
						liveBufferLatencyMaxLatency: 3,
						liveBufferLatencyMinRemain: 0.5,
					},
				);
				player.attachMediaElement(video);
				player.on(mpegts.Events.ERROR, () => playFallbackLoop());
				player.on(mpegts.Events.MEDIA_INFO, () => markLive("flv"));
				player.load();
				const playResult = player.play();
				if (playResult) {
					playResult.catch(() => {});
				}
			})
			.catch(() => playFallbackLoop());

		return () => {
			isDisposed = true;
			clearConnectTimeout();
			if (player) {
				player.destroy();
				player = null;
			}
		};
	}, [flvUrl, hlsUrl, state]);

	return (
		<div className="relative aspect-video w-full overflow-hidden rounded-2xl bg-black shadow-xl shadow-black/40 ring-1 ring-white/10">
			<video
				ref={videoRef}
				autoPlay
				muted
				playsInline
				className="h-full w-full object-cover"
			/>

			{/* 상단 오버레이: LIVE 배지 · 시청자 수 · 스트림 상태 · 재생 토큰 */}
			<div className="pointer-events-none absolute inset-x-0 top-0 flex items-start justify-between p-3">
				<div className="flex flex-wrap items-center gap-2">
					<span className="flex items-center gap-1.5 rounded-md bg-red-600/90 px-2 py-1 text-xs font-bold tracking-wide text-white">
						<span className="live-dot inline-block h-2 w-2 rounded-full bg-white" />
						LIVE
					</span>
					<span className="flex items-center gap-1 rounded-md bg-black/60 px-2 py-1 text-xs font-medium text-white backdrop-blur">
						<Users className="h-3.5 w-3.5" />
						{state.viewerCount.toLocaleString("ko-KR")}명 시청 중
					</span>
					<StreamStatusChip state={state} />
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

const StreamStatusChip = observer(function StreamStatusChip({
	state,
}: {
	state: LiveViewerState;
}) {
	if (state.streamStatus === "live") {
		return (
			<span className="flex items-center gap-1 rounded-md bg-sky-500/80 px-2 py-1 text-[11px] font-semibold text-white backdrop-blur">
				<Wifi className="h-3.5 w-3.5" />
				SRS 실시간 · {state.streamTransport === "hls" ? "HLS" : "HTTP-FLV"}
			</span>
		);
	}
	if (state.streamStatus === "fallback") {
		return (
			<span className="flex items-center gap-1 rounded-md bg-zinc-700/80 px-2 py-1 text-[11px] font-semibold text-zinc-200 backdrop-blur">
				<WifiOff className="h-3.5 w-3.5" />
				데모 영상 (스트림 미연결)
			</span>
		);
	}
	return (
		<span className="flex items-center gap-1 rounded-md bg-black/60 px-2 py-1 text-[11px] font-medium text-zinc-300 backdrop-blur">
			<Wifi className="live-dot h-3.5 w-3.5" />
			스트림 연결 중…
		</span>
	);
});
