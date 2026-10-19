import { NextResponse } from "next/server";
import { getPublicBroadcast, summarizeLiveDemoStore } from "@/lib/mock-store";

export const dynamic = "force-dynamic";

export async function GET() {
	return NextResponse.json({
		broadcast: getPublicBroadcast(),
		summary: summarizeLiveDemoStore(),
	});
}
