import { promises as fs } from "node:fs";
import path from "node:path";

import { ScreenDesignListClient } from "./_client";

interface ScreenDesign {
	markdown: string;
	figmaUrl: string;
	updatedAt: string | null;
}

interface ScreenNode {
	id: string;
	name: string;
	description: string;
	path?: string;
	type: string;
	level: number;
	screenDesign?: ScreenDesign;
}

interface RequirementsGraph {
	version: string;
	name: string;
	description: string;
	nodes: ScreenNode[];
	edges: Array<{ source: string; target: string; type: string }>;
}

const DATA_PATH = path.join(
	process.cwd(),
	"data/requirements/sample-project.json",
);

/**
 * 원천 데이터에서 화면 노드와 설계 상태를 한 번에 조회
 */
async function getScreensWithStatuses(): Promise<{
	screens: ScreenNode[];
	statuses: Record<string, boolean>;
}> {
	const data = await fs.readFile(DATA_PATH, "utf-8");
	const graph: RequirementsGraph = JSON.parse(data);

	// screen 타입 노드만 필터링
	const screens = graph.nodes.filter((n) => n.type === "screen");

	// screenDesign.markdown이 있으면 완료로 판단
	const statuses: Record<string, boolean> = {};
	for (const screen of screens) {
		statuses[screen.id] = !!screen.screenDesign?.markdown?.trim();
	}

	return { screens, statuses };
}

export default async function ScreenDesignListPage() {
	const { screens, statuses } = await getScreensWithStatuses();

	return <ScreenDesignListClient screens={screens} statuses={statuses} />;
}
