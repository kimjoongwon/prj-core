import { NextResponse } from "next/server";
import { resetLiveDemoStore, summarizeLiveDemoStore } from "@/lib/mock-store";

/**
 * 시연 중 상태(주문·알림톡·재고)를 초기 시드로 되돌린다.
 */
export async function POST() {
	resetLiveDemoStore();
	return NextResponse.json({ ok: true, summary: summarizeLiveDemoStore() });
}
