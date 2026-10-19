import { NextResponse } from "next/server";
import { adjustDemoProductStock, getLiveDemoStore } from "@/lib/mock-store";

export const dynamic = "force-dynamic";

export async function GET() {
	const store = getLiveDemoStore();
	return NextResponse.json({ products: store.products });
}

/**
 * 관리자 상품 재고 조정 (시연 편의상 무인증).
 */
export async function PATCH(request: Request) {
	const body = (await request.json().catch(() => ({}))) as {
		productId?: string;
		stockDelta?: number;
	};
	if (!body.productId || typeof body.stockDelta !== "number") {
		return NextResponse.json({ error: "INVALID_REQUEST" }, { status: 400 });
	}
	const product = adjustDemoProductStock(body.productId, body.stockDelta);
	if (!product) {
		return NextResponse.json({ error: "PRODUCT_NOT_FOUND" }, { status: 404 });
	}
	return NextResponse.json({ product });
}
