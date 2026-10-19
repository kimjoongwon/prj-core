import { NextResponse } from "next/server";
import { advanceDemoOrderStatus, getLiveDemoStore } from "@/lib/mock-store";
import type { DemoOrderStatus } from "@/lib/types";

export const dynamic = "force-dynamic";

export async function GET() {
	const store = getLiveDemoStore();
	return NextResponse.json({ orders: store.orders });
}

export async function PATCH(request: Request) {
	const body = (await request.json().catch(() => ({}))) as {
		orderId?: string;
		status?: DemoOrderStatus;
	};
	if (
		!body.orderId ||
		(body.status !== "PAID" && body.status !== "PREPARING")
	) {
		return NextResponse.json({ error: "INVALID_REQUEST" }, { status: 400 });
	}
	const order = advanceDemoOrderStatus(body.orderId, body.status);
	if (!order) {
		return NextResponse.json({ error: "ORDER_NOT_FOUND" }, { status: 404 });
	}
	return NextResponse.json({ order });
}
