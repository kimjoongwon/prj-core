import { promises as fs } from "node:fs";
import path from "node:path";

import { NextResponse } from "next/server";

const DATA_DIR = path.join(process.cwd(), "data/requirements");

/**
 * GET /api/requirements/list
 * 사용 가능한 프로젝트 목록 조회
 */
export async function GET() {
	try {
		const files = await fs.readdir(DATA_DIR);
		const projects = files
			.filter((f) => f.endsWith(".json"))
			.map((f) => f.replace(".json", ""));

		return NextResponse.json({ projects });
	} catch (error) {
		console.error("프로젝트 목록 읽기 실패:", error);
		return NextResponse.json(
			{ error: "프로젝트 목록을 불러올 수 없습니다" },
			{ status: 500 },
		);
	}
}
