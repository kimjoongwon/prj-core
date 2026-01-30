/**
 * /api/wbs/[id]
 * 특정 WBS 조회, 수정, 삭제
 */

import { promises as fs } from "node:fs";
import path from "node:path";

import { NextRequest, NextResponse } from "next/server";

import type { WbsData } from "../../../../types/wbs";

const WBS_DATA_PATH = path.join(process.cwd(), "data/wbs");

interface RouteParams {
	params: Promise<{ id: string }>;
}

/**
 * GET /api/wbs/[id]
 * 특정 WBS 조회
 */
export async function GET(_request: NextRequest, { params }: RouteParams) {
	try {
		const { id } = await params;
		const filePath = path.join(WBS_DATA_PATH, `${id}.json`);

		const content = await fs.readFile(filePath, "utf-8");
		const wbs: WbsData = JSON.parse(content);

		return NextResponse.json(wbs);
	} catch (error) {
		const { id } = await params;
		console.error(`WBS 조회 실패: ${id}`, error);
		return NextResponse.json(
			{ error: "WBS를 찾을 수 없습니다" },
			{ status: 404 },
		);
	}
}

/**
 * PUT /api/wbs/[id]
 * WBS 전체 업데이트
 */
export async function PUT(request: NextRequest, { params }: RouteParams) {
	try {
		const { id } = await params;
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

		const filePath = path.join(WBS_DATA_PATH, `${id}.json`);
		await fs.writeFile(filePath, JSON.stringify(body, null, "\t"), "utf-8");

		return NextResponse.json({ success: true });
	} catch (error) {
		const { id } = await params;
		console.error(`WBS 업데이트 실패: ${id}`, error);
		return NextResponse.json(
			{ error: "WBS 업데이트에 실패했습니다" },
			{ status: 500 },
		);
	}
}

/**
 * PATCH /api/wbs/[id]
 * 특정 태스크 업데이트
 */
export async function PATCH(request: NextRequest, { params }: RouteParams) {
	try {
		const { id } = await params;
		const { taskId, updates } = await request.json();

		if (!taskId) {
			return NextResponse.json(
				{ error: "taskId가 필요합니다" },
				{ status: 400 },
			);
		}

		const filePath = path.join(WBS_DATA_PATH, `${id}.json`);
		const content = await fs.readFile(filePath, "utf-8");
		const wbs: WbsData = JSON.parse(content);

		const taskIndex = wbs.tasks.findIndex((t) => t.id === taskId);
		if (taskIndex === -1) {
			return NextResponse.json(
				{ error: "해당 태스크를 찾을 수 없습니다" },
				{ status: 404 },
			);
		}

		wbs.tasks[taskIndex] = { ...wbs.tasks[taskIndex], ...updates };
		wbs.metadata.updatedAt = new Date().toISOString();

		await fs.writeFile(filePath, JSON.stringify(wbs, null, "\t"), "utf-8");

		return NextResponse.json({ success: true, task: wbs.tasks[taskIndex] });
	} catch (error) {
		const { id } = await params;
		console.error(`WBS 태스크 업데이트 실패: ${id}`, error);
		return NextResponse.json(
			{ error: "태스크 업데이트에 실패했습니다" },
			{ status: 500 },
		);
	}
}

/**
 * DELETE /api/wbs/[id]
 * WBS 삭제
 */
export async function DELETE(_request: NextRequest, { params }: RouteParams) {
	try {
		const { id } = await params;
		const filePath = path.join(WBS_DATA_PATH, `${id}.json`);

		await fs.unlink(filePath);

		return NextResponse.json({ success: true });
	} catch (error) {
		const { id } = await params;
		console.error(`WBS 삭제 실패: ${id}`, error);
		return NextResponse.json(
			{ error: "WBS 삭제에 실패했습니다" },
			{ status: 500 },
		);
	}
}
