import { NextResponse } from "next/server";
import { parsePlansTree } from "../../../lib/plans/plans-parser";

/**
 * 기획서 트리 구조 조회 API
 * GET /api/plans
 */
export async function GET() {
	try {
		const tree = parsePlansTree();
		return NextResponse.json(tree);
	} catch (error) {
		console.error("기획서 트리 파싱 실패:", error);
		return NextResponse.json(
			{ error: "기획서 트리를 불러올 수 없습니다" },
			{ status: 500 },
		);
	}
}
