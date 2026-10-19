import { NextResponse } from "next/server";
import { getLiveDemoStore, summarizeLiveDemoStore } from "@/lib/mock-store";

export const dynamic = "force-dynamic";

export async function GET() {
	const store = getLiveDemoStore();
	return NextResponse.json({
		broadcast: store.broadcast,
		summary: summarizeLiveDemoStore(),
	});
}
