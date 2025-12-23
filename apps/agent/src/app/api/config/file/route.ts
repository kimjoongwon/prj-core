import { promises as fs } from "node:fs";
import os from "node:os";
import path from "node:path";
import { NextRequest, NextResponse } from "next/server";

// Claude 경로
const PERSONAL_CLAUDE_DIR = path.join(os.homedir(), ".claude");
const PROJECT_ROOT = process.cwd().replace("/apps/agent", "");
const PROJECT_CLAUDE_DIR = path.join(PROJECT_ROOT, ".claude");

// Qoder 경로
const PROJECT_QODER_DIR = path.join(PROJECT_ROOT, ".qoder");

async function readFileContent(filePath: string): Promise<string | null> {
	try {
		return await fs.readFile(filePath, "utf-8");
	} catch {
		return null;
	}
}

async function findFileRecursively(
	dirPath: string,
	fileName: string,
): Promise<string | null> {
	try {
		const items = await fs.readdir(dirPath, { withFileTypes: true });
		for (const item of items) {
			const fullPath = path.join(dirPath, item.name);
			if (item.isDirectory()) {
				const found = await findFileRecursively(fullPath, fileName);
				if (found) return found;
			} else if (item.name === fileName) {
				return fullPath;
			}
		}
		return null;
	} catch {
		return null;
	}
}

export async function GET(request: NextRequest) {
	const searchParams = request.nextUrl.searchParams;
	const type = searchParams.get("type");
	const name = searchParams.get("name");

	if (!type || !name) {
		return NextResponse.json(
			{ error: "type과 name 파라미터가 필요합니다" },
			{ status: 400 },
		);
	}

	let filePath: string;
	let content: string | null = null;

	switch (type) {
		case "claude-md":
			if (name === "personal") {
				filePath = path.join(PERSONAL_CLAUDE_DIR, "CLAUDE.md");
			} else if (name === "project") {
				filePath = path.join(PROJECT_CLAUDE_DIR, "CLAUDE.md");
			} else {
				return NextResponse.json({ error: "잘못된 name" }, { status: 400 });
			}
			content = await readFileContent(filePath);
			break;

		case "command":
			filePath = path.join(PROJECT_CLAUDE_DIR, "commands", name);
			content = await readFileContent(filePath);
			break;

		case "hooks": {
			filePath = path.join(PROJECT_CLAUDE_DIR, "settings.json");
			const settingsContent = await readFileContent(filePath);
			if (settingsContent) {
				try {
					const settings = JSON.parse(settingsContent);
					content = JSON.stringify(settings.hooks || {}, null, 2);
				} catch {
					content = settingsContent;
				}
			}
			break;
		}

		case "agent":
			filePath = path.join(PROJECT_CLAUDE_DIR, "agents", name);
			content = await readFileContent(filePath);
			break;

		case "skill":
			filePath = path.join(PROJECT_CLAUDE_DIR, "skills", name);
			content = await readFileContent(filePath);
			break;

		case "mcp": {
			filePath = path.join(PROJECT_CLAUDE_DIR, "mcp.json");
			const mcpContent = await readFileContent(filePath);
			if (mcpContent) {
				try {
					content = JSON.stringify(JSON.parse(mcpContent), null, 2);
				} catch {
					content = mcpContent;
				}
			}
			break;
		}

		// === Qoder 파일들 ===
		case "qoder-wiki": {
			// Wiki 파일 검색 (재귀적으로)
			const wikiFile = await findFileRecursively(
				path.join(PROJECT_QODER_DIR, "repowiki/en/content"),
				name.endsWith(".md") ? name : `${name}.md`,
			);
			if (wikiFile) {
				content = await readFileContent(wikiFile);
			}
			break;
		}

		case "qoder-quest":
			filePath = path.join(PROJECT_QODER_DIR, "quests", name);
			content = await readFileContent(filePath);
			break;

		default:
			return NextResponse.json({ error: "잘못된 type" }, { status: 400 });
	}

	if (content === null) {
		return NextResponse.json(
			{ error: "파일을 찾을 수 없습니다" },
			{ status: 404 },
		);
	}

	return NextResponse.json({ content });
}
