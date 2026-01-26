import { promises as fs } from "node:fs";
import path from "node:path";

import { NextRequest, NextResponse } from "next/server";

const DATA_PATH = path.join(
	process.cwd(),
	"data/requirements/sample-project.json",
);

export interface RequirementsNode {
	id: string;
	name: string;
	description: string;
	type: string;
	level: number;
	path?: string;
	fields?: Array<{ name: string; type: string; description: string }>;
	// 화면 설계 메타데이터 (screen 타입 노드 전용)
	screenDesign?: {
		markdown: string;
		figmaUrl: string;
		updatedAt: string | null;
	};
}

export interface RequirementsEdge {
	source: string;
	target: string;
	type: string;
}

export interface RequirementsGraph {
	version: string;
	name: string;
	description: string;
	nodes: RequirementsNode[];
	edges: RequirementsEdge[];
}

/**
 * GET /api/requirements
 * 요구사항 그래프 데이터 조회 (원천 데이터)
 */
export async function GET() {
	try {
		const data = await fs.readFile(DATA_PATH, "utf-8");
		const graph: RequirementsGraph = JSON.parse(data);

		return NextResponse.json(graph);
	} catch (error) {
		console.error("요구사항 데이터 읽기 실패:", error);
		return NextResponse.json(
			{ error: "요구사항 데이터를 불러올 수 없습니다" },
			{ status: 500 },
		);
	}
}

/**
 * PUT /api/requirements
 * 요구사항 그래프 데이터 저장 (전체 업데이트)
 */
export async function PUT(request: NextRequest) {
	try {
		const body: RequirementsGraph = await request.json();

		// 데이터 검증
		if (!body.nodes || !body.edges) {
			return NextResponse.json(
				{ error: "nodes와 edges가 필요합니다" },
				{ status: 400 },
			);
		}

		await fs.writeFile(DATA_PATH, JSON.stringify(body, null, "\t"), "utf-8");

		return NextResponse.json({ success: true });
	} catch (error) {
		console.error("요구사항 데이터 저장 실패:", error);
		return NextResponse.json(
			{ error: "요구사항 데이터 저장에 실패했습니다" },
			{ status: 500 },
		);
	}
}
