import { promises as fs } from "node:fs";
import os from "node:os";
import path from "node:path";
import { NextResponse } from "next/server";

// Claude 설정 경로
const PERSONAL_CLAUDE_DIR = path.join(os.homedir(), ".claude");
const PROJECT_ROOT = process.cwd().replace("/apps/agent", "");
const PROJECT_CLAUDE_DIR = path.join(PROJECT_ROOT, ".claude");

// Qoder 설정 경로
const PERSONAL_QODER_DIR = path.join(os.homedir(), ".qoder");
const PROJECT_QODER_DIR = path.join(PROJECT_ROOT, ".qoder");

async function fileExists(filePath: string): Promise<boolean> {
	try {
		await fs.access(filePath);
		return true;
	} catch {
		return false;
	}
}

async function readFileContent(filePath: string): Promise<string | null> {
	try {
		return await fs.readFile(filePath, "utf-8");
	} catch {
		return null;
	}
}

async function listDirectory(dirPath: string): Promise<string[]> {
	try {
		const files = await fs.readdir(dirPath);
		return files.filter((f) => f.endsWith(".md"));
	} catch {
		return [];
	}
}

interface WikiItem {
	name: string;
	type: "file" | "folder";
	children?: WikiItem[];
}

async function getWikiStructure(dirPath: string): Promise<WikiItem[]> {
	try {
		const items = await fs.readdir(dirPath, { withFileTypes: true });
		const result: WikiItem[] = [];

		for (const item of items) {
			if (item.isDirectory()) {
				const children = await getWikiStructure(path.join(dirPath, item.name));
				result.push({
					name: item.name,
					type: "folder",
					children,
				});
			} else if (item.name.endsWith(".md")) {
				result.push({
					name: item.name,
					type: "file",
				});
			}
		}

		return result;
	} catch {
		return [];
	}
}

export async function GET() {
	try {
		// CLAUDE.md 파일들
		const personalClaudeMd = await readFileContent(
			path.join(PERSONAL_CLAUDE_DIR, "CLAUDE.md"),
		);
		const projectClaudeMd = await readFileContent(
			path.join(PROJECT_CLAUDE_DIR, "CLAUDE.md"),
		);

		// Commands
		const commandsDir = path.join(PROJECT_CLAUDE_DIR, "commands");
		const commands = await listDirectory(commandsDir);

		// Hooks (settings.json)
		const settingsPath = path.join(PROJECT_CLAUDE_DIR, "settings.json");
		let hooks = null;
		if (await fileExists(settingsPath)) {
			const content = await readFileContent(settingsPath);
			if (content) {
				try {
					const settings = JSON.parse(content);
					hooks = settings.hooks || null;
				} catch {
					hooks = null;
				}
			}
		}

		// Agents (Subagents)
		const agentsDir = path.join(PROJECT_CLAUDE_DIR, "agents");
		const agents = await listDirectory(agentsDir);

		// Skills
		const skillsDir = path.join(PROJECT_CLAUDE_DIR, "skills");
		const skills = await listDirectory(skillsDir);

		// MCP
		const mcpPath = path.join(PROJECT_CLAUDE_DIR, "mcp.json");
		let mcp = null;
		if (await fileExists(mcpPath)) {
			const content = await readFileContent(mcpPath);
			if (content) {
				try {
					mcp = JSON.parse(content);
				} catch {
					mcp = null;
				}
			}
		}

		// === Qoder 설정 ===

		// Qoder Wiki (repowiki)
		const wikiDir = path.join(PROJECT_QODER_DIR, "repowiki/en/content");
		const wiki = await getWikiStructure(wikiDir);

		// Qoder Quests
		const questsDir = path.join(PROJECT_QODER_DIR, "quests");
		const quests = await listDirectory(questsDir);

		// Qoder Commands (개인)
		const qoderCommandsDir = path.join(PERSONAL_QODER_DIR, "commands");
		const qoderCommands = await listDirectory(qoderCommandsDir);

		// Memory는 Qoder 서버에서 관리됨 (API 필요)
		// 현재는 메모리 개수만 표시 (실제 데이터는 IDE 통해서만 접근 가능)

		return NextResponse.json({
			// Claude Code
			claudeMd: {
				personal: personalClaudeMd,
				project: projectClaudeMd,
			},
			commands,
			hooks,
			agents,
			skills,
			mcp,
			// Qoder
			qoder: {
				wiki,
				quests,
				commands: qoderCommands,
				memoryNote:
					"메모리는 Qoder IDE 내에서 관리됩니다. 현재 65개의 메모리가 저장되어 있습니다.",
			},
			paths: {
				claude: {
					personal: PERSONAL_CLAUDE_DIR,
					project: PROJECT_CLAUDE_DIR,
				},
				qoder: {
					personal: PERSONAL_QODER_DIR,
					project: PROJECT_QODER_DIR,
				},
			},
		});
	} catch (error) {
		console.error("Config API error:", error);
		return NextResponse.json(
			{ error: "설정을 불러오는데 실패했습니다" },
			{ status: 500 },
		);
	}
}
