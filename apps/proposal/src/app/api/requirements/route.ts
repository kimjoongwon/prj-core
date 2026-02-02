import { promises as fs } from "node:fs";
import path from "node:path";

import { NextRequest, NextResponse } from "next/server";

const DATA_DIR = path.join(process.cwd(), "data/requirements");
const DEFAULT_PROJECT = "_core__navigation__navigation";

/**
 * 프로젝트 파일 경로 반환
 */
function getProjectPath(project: string): string {
	// 보안: 경로 탐색 방지
	const safeProject = project.replace(/[^a-zA-Z0-9-_]/g, "");
	return path.join(DATA_DIR, `${safeProject}.json`);
}

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
 *
 * @param project - 프로젝트 이름 (기본값: sample-project)
 * @example GET /api/requirements?project=navigation
 */
export async function GET(request: NextRequest) {
	try {
		const { searchParams } = new URL(request.url);
		const project = searchParams.get("project") || DEFAULT_PROJECT;

		const projectPath = getProjectPath(project);
		const data = await fs.readFile(projectPath, "utf-8");
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
 *
 * @param project - 프로젝트 이름 (기본값: sample-project)
 * @example PUT /api/requirements?project=navigation
 */
export async function PUT(request: NextRequest) {
	try {
		const { searchParams } = new URL(request.url);
		const project = searchParams.get("project") || DEFAULT_PROJECT;

		const body: RequirementsGraph = await request.json();

		// 데이터 검증
		if (!body.nodes || !body.edges) {
			return NextResponse.json(
				{ error: "nodes와 edges가 필요합니다" },
				{ status: 400 },
			);
		}

		const projectPath = getProjectPath(project);
		await fs.writeFile(projectPath, JSON.stringify(body, null, "\t"), "utf-8");

		return NextResponse.json({ success: true });
	} catch (error) {
		console.error("요구사항 데이터 저장 실패:", error);
		return NextResponse.json(
			{ error: "요구사항 데이터 저장에 실패했습니다" },
			{ status: 500 },
		);
	}
}
