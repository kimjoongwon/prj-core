import { NextResponse } from "next/server";
import { getLiveDemoStore } from "@/lib/mock-store";

export const dynamic = "force-dynamic";

export async function GET() {
	const store = getLiveDemoStore();
	return NextResponse.json({ notifications: store.notifications });
}
