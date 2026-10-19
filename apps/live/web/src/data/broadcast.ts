import type { DemoBroadcast } from "@/lib/types";

/**
 * 시연용 방송(채널) 시드.
 * 실제 서비스에서는 채널 생성 API(Amazon IVS CreateChannel 또는
 * 자체 호스팅 미디어 서버 채널 생성)로 발급받은 값을 저장해 사용한다.
 */
export const broadcastSeed: DemoBroadcast = {
	id: "broadcast-demo-01",
	title: "가을 시즌 오프 ✂️ 오늘만 방송가!",
	hostName: "오늘only 쇼핑",
	channelName: "live-commerce-demo-01",
	ingestEndpoint: "rtmps://demo-ingest.live-commerce.example.com/app",
	streamKey: "sk_demo_5f3a9c2e7b1d48e0a6c3f19b2d74e808",
	playbackUrl:
		"https://demo-playback.live-commerce.example.com/app/live-commerce-demo-01/index.m3u8",
	isPrivateChannel: true,
	playbackTokenTtlSeconds: 300,
	startedAt: "2026-10-18T20:00:00+09:00",
};
