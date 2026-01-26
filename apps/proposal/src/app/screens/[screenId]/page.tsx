import { promises as fs } from "node:fs";
import path from "node:path";

import { ScreenDesignClient } from "./_client";

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
 * 원천 데이터에서 화면 정보와 설계 데이터를 한 번에 조회
 */
async function getScreenWithDesign(screenId: string): Promise<{
	screen: { id: string; name: string; description: string; path?: string } | null;
	design: { markdown: string; figmaUrl: string };
}> {
	const data = await fs.readFile(DATA_PATH, "utf-8");
	const graph: RequirementsGraph = JSON.parse(data);

	const node = graph.nodes.find(
		(n) => n.id === screenId && n.type === "screen",
	);

	if (!node) {
		return { screen: null, design: { markdown: "", figmaUrl: "" } };
	}

	return {
		screen: {
			id: node.id,
			name: node.name,
			description: node.description,
			path: node.path,
		},
		design: {
			markdown: node.screenDesign?.markdown || "",
			figmaUrl: node.screenDesign?.figmaUrl || "",
		},
	};
}

interface PageProps {
	params: Promise<{ screenId: string }>;
}

export default async function ScreenDesignPage({ params }: PageProps) {
	const { screenId } = await params;

	const { screen, design } = await getScreenWithDesign(screenId);

	if (!screen) {
		return (
			<div className="flex h-screen items-center justify-center">
				<div className="text-center">
					<h1 className="text-xl font-bold text-danger">화면을 찾을 수 없음</h1>
					<p className="mt-2 text-default-500">ID: {screenId}</p>
				</div>
			</div>
		);
	}

	return (
		<ScreenDesignClient
			screenId={screenId}
			screen={screen}
			initialMarkdown={design.markdown}
			initialFigmaUrl={design.figmaUrl}
		/>
	);
}
