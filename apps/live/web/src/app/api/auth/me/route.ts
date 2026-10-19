import { NextResponse } from "next/server";
import { verifyJwt } from "@/lib/jwt";
import type { DemoUser } from "@/lib/types";

export const dynamic = "force-dynamic";

export async function GET(request: Request) {
	const token = request.headers
		.get("cookie")
		?.split(";")
		.map((part) => part.trim())
		.find((part) => part.startsWith("live_demo_jwt="))
		?.slice("live_demo_jwt=".length);
	const payload = token ? verifyJwt(token) : null;
	if (!payload?.sub || !payload.nickname) {
		return NextResponse.json({ user: null }, { status: 401 });
	}
	return NextResponse.json({
		user: { id: payload.sub, nickname: payload.nickname } satisfies DemoUser,
	});
}
