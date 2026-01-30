/**
 * GET /api/wbs/list
 * 생성된 WBS 목록 조회
 */

import { promises as fs } from "node:fs";
import path from "node:path";

import { NextResponse } from "next/server";

import type { WbsData } from "../../../../types/wbs";

const WBS_DATA_PATH = path.join(process.cwd(), "data/wbs");

interface WbsSummary {
	id: string;
	name: string;
	description: string;
	startDate: string;
	taskCount: number;
	sourceType: "plan" | "manual";
	sourcePath?: string;
	updatedAt: string;
}

export async function GET() {
	try {
		// data/wbs 폴더 확인
		try {
			await fs.access(WBS_DATA_PATH);
		} catch {
			// 폴더가 없으면 빈 배열 반환
			return NextResponse.json([]);
		}

		const files = await fs.readdir(WBS_DATA_PATH);
		const jsonFiles = files.filter((f) => f.endsWith(".json"));

		const wbsList: WbsSummary[] = [];

		for (const file of jsonFiles) {
			try {
				const filePath = path.join(WBS_DATA_PATH, file);
				const content = await fs.readFile(filePath, "utf-8");
				const wbs: WbsData = JSON.parse(content);

				wbsList.push({
					id: wbs.id,
					name: wbs.name,
					description: wbs.description,
					startDate: wbs.startDate,
					taskCount: wbs.tasks.length,
					sourceType: wbs.metadata.sourceType,
					sourcePath: wbs.metadata.sourcePath,
					updatedAt: wbs.metadata.updatedAt,
				});
			} catch (err) {
				console.error(`WBS 파일 파싱 실패: ${file}`, err);
			}
		}

		// 최신순 정렬
		wbsList.sort(
			(a, b) =>
				new Date(b.updatedAt).getTime() - new Date(a.updatedAt).getTime(),
		);

		return NextResponse.json(wbsList);
	} catch (error) {
		console.error("WBS 목록 조회 실패:", error);
		return NextResponse.json(
			{ error: "WBS 목록을 불러올 수 없습니다" },
			{ status: 500 },
		);
	}
}
