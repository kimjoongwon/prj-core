import { promises as fs } from "node:fs";
import path from "node:path";

import { NextRequest, NextResponse } from "next/server";

const DATA_PATH = path.join(process.cwd(), "data/wbs/reservation-service.json");

export interface WbsTask {
	id: string;
	name: string;
	start: string;
	end: string;
	progress: number;
	dependencies?: string[];
	parentId?: string;
	isGroup?: boolean;
}

export interface WbsData {
	id: string;
	name: string;
	description: string;
	startDate: string;
	tasks: WbsTask[];
	metadata: {
		createdAt: string;
		updatedAt: string;
	};
}

/**
 * GET /api/wbs
 * WBS 데이터 조회
 */
export async function GET() {
	try {
		const data = await fs.readFile(DATA_PATH, "utf-8");
		const wbs: WbsData = JSON.parse(data);

		return NextResponse.json(wbs);
	} catch (error) {
		console.error("WBS 데이터 읽기 실패:", error);
		return NextResponse.json(
			{ error: "WBS 데이터를 불러올 수 없습니다" },
			{ status: 500 },
		);
	}
}

/**
 * PUT /api/wbs
 * WBS 데이터 저장 (전체 업데이트)
 */
export async function PUT(request: NextRequest) {
	try {
		const body: WbsData = await request.json();

		// 데이터 검증
		if (!body.tasks || !Array.isArray(body.tasks)) {
			return NextResponse.json(
				{ error: "tasks 배열이 필요합니다" },
				{ status: 400 },
			);
		}

		// 업데이트 시간 갱신
		body.metadata = {
			...body.metadata,
			updatedAt: new Date().toISOString(),
		};

		await fs.writeFile(DATA_PATH, JSON.stringify(body, null, "\t"), "utf-8");

		return NextResponse.json({ success: true });
	} catch (error) {
		console.error("WBS 데이터 저장 실패:", error);
		return NextResponse.json(
			{ error: "WBS 데이터 저장에 실패했습니다" },
			{ status: 500 },
		);
	}
}

/**
 * PATCH /api/wbs
 * 특정 태스크 업데이트
 */
export async function PATCH(request: NextRequest) {
	try {
		const { taskId, updates } = await request.json();

		if (!taskId) {
			return NextResponse.json(
				{ error: "taskId가 필요합니다" },
				{ status: 400 },
			);
		}

		const data = await fs.readFile(DATA_PATH, "utf-8");
		const wbs: WbsData = JSON.parse(data);

		const taskIndex = wbs.tasks.findIndex((t) => t.id === taskId);
		if (taskIndex === -1) {
			return NextResponse.json(
				{ error: "해당 태스크를 찾을 수 없습니다" },
				{ status: 404 },
			);
		}

		wbs.tasks[taskIndex] = { ...wbs.tasks[taskIndex], ...updates };
		wbs.metadata.updatedAt = new Date().toISOString();

		await fs.writeFile(DATA_PATH, JSON.stringify(wbs, null, "\t"), "utf-8");

		return NextResponse.json({ success: true, task: wbs.tasks[taskIndex] });
	} catch (error) {
		console.error("WBS 태스크 업데이트 실패:", error);
		return NextResponse.json(
			{ error: "태스크 업데이트에 실패했습니다" },
			{ status: 500 },
		);
	}
}
