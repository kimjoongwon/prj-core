/**
 * POST /api/wbs/generate
 * 기획 문서에서 WBS 자동 생성
 */

import { promises as fs } from "node:fs";
import path from "node:path";

import { NextRequest, NextResponse } from "next/server";

import { generateWbsFromPlan, parsePlanDocument } from "../../../../lib/wbs";
import type { WbsGenerationOptions } from "../../../../types/wbs";

// proposal 앱의 plans 및 data 폴더
const PLANS_PATH = path.join(process.cwd(), "plans");
const WBS_DATA_PATH = path.join(process.cwd(), "data/wbs");

interface GenerateRequest {
	planId: string; // 기획 폴더 ID (예: 2026-01-01-AdminAuthenticationSystem)
	options?: WbsGenerationOptions;
	saveToFile?: boolean; // 파일로 저장 여부 (기본: true)
}

export async function POST(request: NextRequest) {
	try {
		const body: GenerateRequest = await request.json();

		if (!body.planId) {
			return NextResponse.json(
				{ error: "planId가 필요합니다" },
				{ status: 400 },
			);
		}

		// 기획 폴더 경로 (ID에서 __를 /로 복원)
		const planPath = body.planId.replace(/__/g, "/");
		const planFolderPath = path.join(PLANS_PATH, planPath);
		const readmePath = path.join(planFolderPath, "README.md");

		// README.md 읽기
		let readmeContent: string;
		try {
			readmeContent = await fs.readFile(readmePath, "utf-8");
		} catch {
			return NextResponse.json(
				{ error: `기획 문서를 찾을 수 없습니다: ${body.planId}` },
				{ status: 404 },
			);
		}

		// 기획 문서 파싱
		const parsedPlan = parsePlanDocument(body.planId, readmeContent);

		// WBS 생성
		const wbsData = generateWbsFromPlan(parsedPlan, body.options);

		// 파일로 저장 (기본 동작)
		if (body.saveToFile !== false) {
			// data/wbs 폴더 확인/생성
			try {
				await fs.access(WBS_DATA_PATH);
			} catch {
				await fs.mkdir(WBS_DATA_PATH, { recursive: true });
			}

			// WBS 파일 저장
			const wbsFilePath = path.join(WBS_DATA_PATH, `${body.planId}.json`);
			await fs.writeFile(
				wbsFilePath,
				JSON.stringify(wbsData, null, "\t"),
				"utf-8",
			);
		}

		return NextResponse.json({
			success: true,
			wbs: wbsData,
			message:
				body.saveToFile !== false
					? `WBS가 생성되어 data/wbs/${body.planId}.json에 저장되었습니다`
					: "WBS가 생성되었습니다 (저장하지 않음)",
		});
	} catch (error) {
		console.error("WBS 생성 실패:", error);
		return NextResponse.json(
			{ error: "WBS 생성에 실패했습니다" },
			{ status: 500 },
		);
	}
}
