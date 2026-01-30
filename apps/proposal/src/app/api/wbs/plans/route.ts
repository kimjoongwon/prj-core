/**
 * GET /api/wbs/plans
 * 기획 폴더 목록 조회 (WBS 생성 소스 선택용)
 */

import { promises as fs } from "node:fs";
import path from "node:path";

import { NextResponse } from "next/server";

import type { PlanFolder } from "../../../../types/wbs";

const PLANS_PATH = path.join(process.cwd(), "plans");

export async function GET() {
	try {
		const entries = await fs.readdir(PLANS_PATH, { withFileTypes: true });

		const folders: PlanFolder[] = [];

		for (const entry of entries) {
			// 폴더만 처리 (날짜 형식으로 시작하는 것)
			if (entry.isDirectory() && /^\d{4}-\d{2}-\d{2}/.test(entry.name)) {
				const folderPath = path.join(PLANS_PATH, entry.name);
				const readmePath = path.join(folderPath, "README.md");

				// README.md 존재 여부 확인
				let hasReadme = false;
				let name = entry.name;
				try {
					const readmeContent = await fs.readFile(readmePath, "utf-8");
					hasReadme = true;

					// 제목 추출
					const titleMatch = readmeContent.match(/^#\s+(.+)$/m);
					if (titleMatch) {
						name = titleMatch[1].trim();
					}
				} catch {
					// README.md가 없으면 폴더명 사용
				}

				// 폴더 내 문서 수 계산
				const files = await fs.readdir(folderPath);
				const documentCount = files.filter((f) => f.endsWith(".md")).length;

				// 최종 수정일
				const stat = await fs.stat(folderPath);

				folders.push({
					id: entry.name,
					name,
					path: `plans/${entry.name}`,
					hasReadme,
					documentCount,
					lastModified: stat.mtime.toISOString(),
				});
			}
		}

		// 최신순 정렬
		folders.sort(
			(a, b) =>
				new Date(b.lastModified).getTime() - new Date(a.lastModified).getTime(),
		);

		return NextResponse.json(folders);
	} catch (error) {
		console.error("기획 폴더 목록 조회 실패:", error);
		return NextResponse.json(
			{ error: "기획 폴더 목록을 불러올 수 없습니다" },
			{ status: 500 },
		);
	}
}
