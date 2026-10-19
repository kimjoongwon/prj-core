import { NextResponse } from "next/server";
import { signJwt } from "@/lib/jwt";
import type { DemoUser } from "@/lib/types";

/**
 * 카카오 로그인 목업.
 * 실제 서비스에서는 이 경로가 카카오 OAuth 2.0 코드 흐름을 대신한다:
 *   1) 카카오 동의 화면(authorize) 리다이렉트 — 여기서는 동의 화면 모달이 이미 대신함
 *   2) 카카오 token 교환 — 데모에서는 생략
 *   3) 카카오 userinfo 조회 후 서비스 회원 매칭/가입
 *   4) 서비스 JWT 발급 (아래 signJwt 지점)
 */
export async function POST(request: Request) {
	const body = (await request.json().catch(() => ({}))) as {
		nickname?: string;
	};
	const nickname = body.nickname?.trim() || "김라이브";

	const mockKakaoUser: DemoUser = {
		id: "1001",
		nickname: nickname.slice(0, 12),
	};

	const token = signJwt(
		{
			sub: mockKakaoUser.id,
			nickname: mockKakaoUser.nickname,
			scope: "session",
		},
		60 * 60 * 12,
	);

	const response = NextResponse.json({ user: mockKakaoUser });
	response.cookies.set("live_demo_jwt", token, {
		httpOnly: true,
		sameSite: "lax",
		path: "/",
		maxAge: 60 * 60 * 12,
	});
	return response;
}

export async function DELETE() {
	const response = NextResponse.json({ ok: true });
	response.cookies.delete("live_demo_jwt");
	return response;
}
