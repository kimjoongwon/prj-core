/**
 * GET /api/wbs/plans
 * 기획 폴더 목록 조회 (WBS 생성 소스 선택용)
 */

import { promises as fs } from "node:fs";
import path from "node:path";

import { NextResponse } from "next/server";

import type { PlanFolder } from "../../../../types/wbs";

// proposal 앱의 plans 폴더 (apps/proposal/plans/)
const PLANS_PATH = path.join(process.cwd(), "plans");

/**
 * 중첩된 폴더를 재귀적으로 탐색하여 날짜 형식 기획 폴더 찾기
 */
async function findPlanFolders(
	basePath: string,
	relativePath = "",
): Promise<PlanFolder[]> {
	const folders: PlanFolder[] = [];
	const currentPath = path.join(basePath, relativePath);

	try {
		const entries = await fs.readdir(currentPath, { withFileTypes: true });

		for (const entry of entries) {
			if (!entry.isDirectory()) continue;

			const entryRelativePath = relativePath
				? `${relativePath}/${entry.name}`
				: entry.name;

			// 날짜 형식으로 시작하는 폴더 = 기획 폴더
			if (/^\d{4}-\d{2}-\d{2}/.test(entry.name)) {
				const folderPath = path.join(basePath, entryRelativePath);
				const readmePath = path.join(folderPath, "README.md");

				let hasReadme = false;
				let name = entry.name;
				try {
					const readmeContent = await fs.readFile(readmePath, "utf-8");
					hasReadme = true;

					const titleMatch = readmeContent.match(/^#\s+(.+)$/m);
					if (titleMatch) {
						name = titleMatch[1].trim();
					}
				} catch {
					// README.md가 없으면 폴더명 사용
				}

				const files = await fs.readdir(folderPath);
				const documentCount = files.filter((f) => f.endsWith(".md")).length;
				const stat = await fs.stat(folderPath);

				folders.push({
					id: entryRelativePath.replace(/\//g, "__"),
					name,
					path: `plans/${entryRelativePath}`,
					hasReadme,
					documentCount,
					lastModified: stat.mtime.toISOString(),
				});
			} else {
				// 하위 폴더 재귀 탐색 (_로 시작하는 폴더도 포함)
				const subFolders = await findPlanFolders(basePath, entryRelativePath);
				folders.push(...subFolders);
			}
		}
	} catch {
		// 폴더 읽기 실패 시 무시
	}

	return folders;
}

export async function GET() {
	try {
		const folders = await findPlanFolders(PLANS_PATH);

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
