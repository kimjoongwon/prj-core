import { NextResponse } from "next/server";
import { signJwt } from "@/lib/jwt";
import { getPublicBroadcast } from "@/lib/mock-store";

/**
 * 재생 보안 시연: 짧은 유효기간의 서명 재생 토큰 발급.
 * 실제 서비스에서는 Amazon IVS 비공개 채널의 playback token 발급 API 또는
 * 자체 CDN 서명 URL/쿠키 발급으로 이 지점을 교체한다.
 */
export async function POST() {
	const broadcast = getPublicBroadcast();
	const token = signJwt(
		{ scope: "playback", channelId: broadcast.id },
		broadcast.playbackTokenTtlSeconds,
	);
	return NextResponse.json({
		token,
		playbackUrl: broadcast.playbackUrl,
		expiresInSeconds: broadcast.playbackTokenTtlSeconds,
		issuedAt: new Date().toISOString(),
	});
}
