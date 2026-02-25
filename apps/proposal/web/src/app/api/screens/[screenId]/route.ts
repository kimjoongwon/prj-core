import { promises as fs } from "node:fs";
import path from "node:path";

import { NextRequest, NextResponse } from "next/server";

const DATA_PATH = path.join(
	process.cwd(),
	"data/requirements/sample-project.json",
);

interface RequirementsNode {
	id: string;
	name: string;
	description: string;
	type: string;
	level: number;
	path?: string;
	screenDesign?: {
		markdown: string;
		figmaUrl: string;
		updatedAt: string | null;
	};
}

interface RequirementsGraph {
	version: string;
	name: string;
	description: string;
	nodes: RequirementsNode[];
	edges: Array<{ source: string; target: string; type: string }>;
}

interface RouteParams {
	params: Promise<{ screenId: string }>;
}

/**
 * GET /api/screens/[screenId]
 * 원천 데이터에서 화면 설계 정보 조회
 */
export async function GET(_request: NextRequest, { params }: RouteParams) {
	try {
		const { screenId } = await params;
		const data = await fs.readFile(DATA_PATH, "utf-8");
		const graph: RequirementsGraph = JSON.parse(data);

		const node = graph.nodes.find((n) => n.id === screenId);

		if (!node) {
			return NextResponse.json(
				{ error: "화면을 찾을 수 없습니다" },
				{ status: 404 },
			);
		}

		// screenDesign이 없으면 빈 객체 반환
		return NextResponse.json(
			node.screenDesign || {
				markdown: "",
				figmaUrl: "",
				updatedAt: null,
			},
		);
	} catch (error) {
		console.error("화면 설계 조회 에러:", error);
		return NextResponse.json(
			{ error: "화면 설계 데이터를 불러올 수 없습니다" },
			{ status: 500 },
		);
	}
}

/**
 * PUT /api/screens/[screenId]
 * 원천 데이터에 화면 설계 정보 저장 (동기화)
 */
export async function PUT(request: NextRequest, { params }: RouteParams) {
	try {
		const { screenId } = await params;
		const body = await request.json();

		// 원천 데이터 읽기
		const data = await fs.readFile(DATA_PATH, "utf-8");
		const graph: RequirementsGraph = JSON.parse(data);

		// 해당 노드 찾기
		const nodeIndex = graph.nodes.findIndex((n) => n.id === screenId);

		if (nodeIndex === -1) {
			return NextResponse.json(
				{ error: "화면을 찾을 수 없습니다" },
				{ status: 404 },
			);
		}

		// screenDesign 업데이트
		const screenDesign = {
			markdown: body.markdown || "",
			figmaUrl: body.figmaUrl || "",
			updatedAt: new Date().toISOString(),
		};

		graph.nodes[nodeIndex].screenDesign = screenDesign;

		// 원천 데이터에 저장
		await fs.writeFile(DATA_PATH, JSON.stringify(graph, null, "\t"), "utf-8");

		return NextResponse.json({ success: true, data: screenDesign });
	} catch (error) {
		console.error("화면 설계 저장 에러:", error);
		return NextResponse.json(
			{ error: "화면 설계 저장에 실패했습니다" },
			{ status: 500 },
		);
	}
}
