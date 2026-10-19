import { NextResponse } from "next/server";
import { verifyJwt } from "@/lib/jwt";
import { getLiveDemoStore, placeDemoOrder } from "@/lib/mock-store";
import type { PaymentMethod } from "@/lib/types";

export const dynamic = "force-dynamic";

/**
 * 주문 생성(결제 승인 목업 포함).
 * 실시간 재고 제어 시연: 재고가 부족하면 409로 거절한다.
 * 실제 서비스에서는 PG 승인 → 재고 차감(트랜잭션/락) → 주문 확정 → 알림 큐 적재 순서로
 * 진행되며, 이 핸들러가 그 흐름을 한 번에 흉내낸다.
 */
export async function POST(request: Request) {
	const body = (await request.json().catch(() => ({}))) as {
		productId?: string;
		quantity?: number;
		nickname?: string;
		paymentMethod?: PaymentMethod;
	};
	if (!body.productId || !body.quantity || body.quantity < 1) {
		return NextResponse.json({ error: "INVALID_REQUEST" }, { status: 400 });
	}

	// 로그인 세션이 있으면 세션 닉네임을 구매자로 사용한다.
	const token = request.headers
		.get("cookie")
		?.split(";")
		.map((part) => part.trim())
		.find((part) => part.startsWith("live_demo_jwt="))
		?.slice("live_demo_jwt=".length);
	const sessionPayload = token ? verifyJwt(token) : null;
	const buyerNickname =
		sessionPayload?.nickname ?? body.nickname?.trim() ?? "게스트";

	const result = placeDemoOrder({
		productId: body.productId,
		quantity: body.quantity,
		buyerNickname: buyerNickname.slice(0, 12),
		paymentMethod: body.paymentMethod === "CARD" ? "CARD" : "KAKAOPAY",
	});

	if (!result.ok) {
		return NextResponse.json(
			{ error: result.reason, remainingStock: result.remainingStock },
			{ status: 409 },
		);
	}
	return NextResponse.json({ order: result.order, product: result.product });
}

export async function GET() {
	const store = getLiveDemoStore();
	return NextResponse.json({ orders: store.orders });
}
