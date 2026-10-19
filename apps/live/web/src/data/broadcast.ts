import type { DemoBroadcast } from "@/lib/types";

/**
 * 시연용 방송(채널) 시드.
 * 영상은 클러스터에 배포된 오픈소스 미디어 서버 SRS(prj-devops helm/applications/srs-server)가
 * 실제로 송출한다 — 송출(RTMP)은 클러스터 내부 주소, 재생은 공개 경로(/live-stream)다.
 * 재생 URL은 LIVE_STREAM_FLV_URL / LIVE_STREAM_HLS_URL 환경변수로 런타임에 바꿀 수 있다.
 */
export const broadcastSeed: DemoBroadcast = {
	id: "broadcast-demo-01",
	title: "가을 시즌 오프 ✂️ 오늘만 방송가!",
	hostName: "오늘only 쇼핑",
	channelName: "live/livedemo",
	ingestEndpoint:
		"rtmp://srs-server-prod.plate-prod.svc.cluster.local:1935/live",
	streamKey: "livedemo",
	playbackUrl: "https://onjitda.com/live-stream/live/livedemo.flv",
	playbackHlsUrl: "https://onjitda.com/live-stream/live/livedemo.m3u8",
	streamEngine: "SRS v6.0 (오픈소스) · HTTP-FLV 1~3초 지연 · HLS 폴백",
	isPrivateChannel: true,
	playbackTokenTtlSeconds: 300,
	startedAt: "2026-10-18T20:00:00+09:00",
};
