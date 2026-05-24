import {
	ADMIN_NAV_ITEMS,
	ADMIN_PAGE_ACCESS_ITEMS,
	IDP_NAV_ITEMS,
} from "../../../../../packages/common-constant/src";
import {
	FLOW_OVERRIDES,
	type FlowOverride,
	type FlowOverrideEdge,
} from "./flow-overrides";

type AppId = "admin" | "idp";

export type StoryMaturity = "scenario" | "scaffold";
export type PageKind = "list" | "new" | "detail" | "edit" | "custom";
export type PlanningDocumentKind = "pure-page" | "route-page";

export interface OverviewManifestSourceMaps {
	storySources: Record<string, string>;
	purePageSpecSources: Record<string, string>;
	adminRouteSources: Record<string, string>;
	adminRouteSpecSources: Record<string, string>;
	idpRouteSources: Record<string, string>;
	idpRouteSpecSources: Record<string, string>;
}

declare const __STORYBOOK_OVERVIEW_MANIFEST_SOURCES__:
	| OverviewManifestSourceMaps
	| undefined;

const EMPTY_OVERVIEW_MANIFEST_SOURCE_MAPS: OverviewManifestSourceMaps = {
	storySources: {},
	purePageSpecSources: {},
	adminRouteSources: {},
	adminRouteSpecSources: {},
	idpRouteSources: {},
	idpRouteSpecSources: {},
};

export interface MarkdownSection {
	heading: string;
	content: string;
}

export interface PlanningDocument {
	id: string;
	appId?: AppId;
	componentName?: string;
	kind: PlanningDocumentKind;
	metadata: string[];
	rawMarkdown: string;
	routePath?: string;
	sections: MarkdownSection[];
	sourcePath: string;
	summary: string | null;
	title: string;
}

export interface PlanningRefs {
	purePageId: string | null;
	routePageIds: string[];
}

export interface RouteBinding {
	id: string;
	appId: AppId;
	componentName: string;
	path: string;
	pageKind: PageKind;
	pageLabel: string;
	description?: string;
	laneId: string;
	laneLabel: string;
	laneOrder: number;
	routeSource: string;
}

export interface PageCatalogEntry {
	componentName: string;
	componentPath: string;
	storyTitle: string;
	storyId: string | null;
	storyHref: string | null;
	storyIds: string[];
	maturity: StoryMaturity;
	bindings: RouteBinding[];
	appIds: Array<AppId | "standalone">;
	planning: PlanningRefs;
}

export interface FlowNode {
	id: string;
	appId: AppId;
	componentName: string;
	storyId: string | null;
	storyHref: string | null;
	maturity: StoryMaturity;
	path: string;
	pageKind: PageKind;
	label: string;
	description?: string;
	laneId: string;
	laneLabel: string;
	order: number;
	planning: {
		purePageId: string | null;
		routePageId: string | null;
	};
}

export interface FlowEdge {
	id: string;
	from: string;
	to: string;
	label: string;
	source: "auto" | "manual";
}

export interface FlowLane {
	id: string;
	appId: AppId;
	label: string;
	order: number;
	nodes: FlowNode[];
	edges: FlowEdge[];
}

export interface OverviewSummary {
	totalPages: number;
	routedPages: number;
	standalonePages: number;
	scenarioPages: number;
	scaffoldPages: number;
}

export interface OverviewManifest {
	summary: OverviewSummary;
	entries: PageCatalogEntry[];
	lanes: FlowLane[];
	planningDocuments: Record<string, PlanningDocument>;
}

interface StoryRecord {
	componentName: string;
	componentPath: string;
	storyTitle: string;
	storyId: string | null;
	storyHref: string | null;
	storyIds: string[];
	maturity: StoryMaturity;
}

interface AdminPageAccessItem {
	groupId: string;
	groupLabel: string;
	pageId: string;
	pageLabel: string;
	pathPattern: string;
	description?: string;
	menuLeafId?: string;
}

interface LaneInfo {
	id: string;
	label: string;
	order: number;
}

interface AdminLeafInfo extends LaneInfo {
	groupLabel: string;
}

interface PlanningBuildResult {
	documents: Record<string, PlanningDocument>;
	purePageIdByComponent: Map<string, string>;
	routePageIdByKey: Map<string, string>;
}

function normalizeSlashes(value: string) {
	return value.replace(/\\/g, "/");
}

function slugifyStorySegment(value: string) {
	return value
		.trim()
		.toLowerCase()
		.replace(/[^a-z0-9]+/g, "-")
		.replace(/-+/g, "-")
		.replace(/^-|-$/g, "");
}

export function createStoryId(title: string, exportName: string) {
	return `${slugifyStorySegment(title)}--${slugifyStorySegment(exportName)}`;
}

export function normalizeAppRoutePath(filePath: string) {
	const normalized = normalizeSlashes(filePath);
	const marker = "/src/app/";
	const markerIndex = normalized.indexOf(marker);

	if (markerIndex === -1) {
		return "/";
	}

	const relativePath = normalized
		.slice(markerIndex + marker.length)
		.replace(/(?:^|\/)page(?:\.spec\.md|\.tsx)$/, "");
	const segments = relativePath
		.split("/")
		.filter(Boolean)
		.filter((segment) => !/^\(.*\)$/.test(segment));

	return segments.length === 0 ? "/" : `/${segments.join("/")}`;
}

export function extractPageComponentNames(source: string) {
	const names = new Set<string>();

	for (const match of source.matchAll(
		/import\s*{([^}]*)}\s*from\s*["']@cocrepo\/ui["']/g,
	)) {
		for (const rawName of match[1].split(",")) {
			const normalized = rawName
				.trim()
				.replace(/^type\s+/, "")
				.replace(/\s+as\s+.*$/, "");

			if (normalized.endsWith("Page")) {
				names.add(normalized);
			}
		}
	}

	for (const match of source.matchAll(
		/export\s*{\s*([A-Za-z0-9_]+)\s+as\s+default\s*}\s*from\s*["']@cocrepo\/ui["']/g,
	)) {
		if (match[1].endsWith("Page")) {
			names.add(match[1]);
		}
	}

	return [...names];
}

export function getStoryMaturity(source: string): StoryMaturity {
	return source.includes("PageStoryScaffold") ? "scaffold" : "scenario";
}

function extractStoryExportNames(source: string) {
	return [...source.matchAll(/export const ([A-Za-z0-9_]+)/g)].map(
		(match) => match[1],
	);
}

function getComponentNameFromStoryPath(filePath: string) {
	const normalized = normalizeSlashes(filePath);
	const match = normalized.match(/\/screen\/([^/]+)\/[^/]+\.stories\.tsx$/);

	return match?.[1] ?? null;
}

function getComponentNameFromPureSpecPath(filePath: string) {
	const normalized = normalizeSlashes(filePath);
	const match = normalized.match(/\/screen\/([^/]+)\/[^/]+\.spec\.md$/);

	return match?.[1] ?? null;
}

function createStoryRecords(storySources: Record<string, string>) {
	const storyRecords: StoryRecord[] = [];

	for (const [filePath, source] of Object.entries(storySources)) {
		const componentName = getComponentNameFromStoryPath(filePath);

		if (!componentName) {
			continue;
		}

		const storyTitle = `screen/${componentName}`;
		const storyExports = extractStoryExportNames(source);
		const storyIds = storyExports.map((exportName) =>
			createStoryId(storyTitle, exportName),
		);
		const docsStoryId = createStoryId(storyTitle, "Docs");
		const storyId = storyExports.includes("Default")
			? createStoryId(storyTitle, "Default")
			: (storyIds[0] ?? null);

		storyRecords.push({
			componentName,
			componentPath: `screen/${componentName}/${componentName}.tsx`,
			storyTitle,
			storyId,
			storyHref: storyId ? `./?path=/story/${storyId}` : null,
			storyIds: [...storyIds, docsStoryId],
			maturity: getStoryMaturity(source),
		});
	}

	return storyRecords;
}

function flattenAdminNavLanes(navItems: typeof ADMIN_NAV_ITEMS) {
	const laneMap = new Map<string, AdminLeafInfo>();
	let nextOrder = 0;

	for (const navItem of navItems) {
		if (navItem.children && navItem.children.length > 0) {
			for (const child of navItem.children) {
				const laneLabel = child.label.startsWith(navItem.label)
					? child.label
					: `${navItem.label} / ${child.label}`;

				laneMap.set(child.id, {
					id: child.id,
					label: laneLabel,
					order: nextOrder,
					groupLabel: navItem.label,
				});
				nextOrder += 1;
			}
			continue;
		}

		laneMap.set(navItem.id, {
			id: navItem.id,
			label: navItem.label,
			order: nextOrder,
			groupLabel: navItem.label,
		});
		nextOrder += 1;
	}

	return laneMap;
}

function createIdpLaneMap(navItems: typeof IDP_NAV_ITEMS) {
	const laneMap = new Map<string, LaneInfo>();

	navItems.forEach((navItem, index) => {
		laneMap.set(navItem.id, {
			id: navItem.id,
			label: navItem.label,
			order: index + 10,
		});
	});

	laneMap.set("bootstrap", {
		id: "bootstrap",
		label: "IDP 시스템",
		order: 0,
	});
	laneMap.set("auth", {
		id: "auth",
		label: "IDP 인증",
		order: 1,
	});

	return laneMap;
}

function buildAdminLeafIdFromPageId(pageId: string) {
	if (pageId === "dashboard") {
		return "dashboard";
	}

	const prefix = pageId.split(":")[0];
	const directLeafId = `${prefix}-list`;

	const fallbackLeafIds: Record<string, string> = {
		programs: "timelines-list",
		roles: "roles-list",
		sessions: "timelines-list",
	};

	return fallbackLeafIds[prefix] ?? directLeafId;
}

function getAdminPageKind(pageId: string): PageKind {
	if (pageId.endsWith(":list")) {
		return "list";
	}
	if (pageId.endsWith(":new")) {
		return "new";
	}
	if (pageId.endsWith(":detail")) {
		return "detail";
	}
	if (pageId.endsWith(":edit")) {
		return "edit";
	}

	return "custom";
}

function getGenericPageKind(path: string, isTopLevelList = false): PageKind {
	if (isTopLevelList) {
		return "list";
	}
	if (path.endsWith("/new")) {
		return "new";
	}
	if (path.endsWith("/edit")) {
		return "edit";
	}
	if (/\[[^/]+\]$/.test(path)) {
		return "detail";
	}

	return "custom";
}

function createAdminRouteBindings(
	routeSources: Record<string, string>,
	storyRecordMap: Map<string, StoryRecord>,
) {
	const pageAccessByPath = new Map<string, AdminPageAccessItem>(
		ADMIN_PAGE_ACCESS_ITEMS.map((item) => [item.pathPattern, item]),
	);
	const adminLeafMap = flattenAdminNavLanes(ADMIN_NAV_ITEMS);
	const bindings: RouteBinding[] = [];

	for (const [filePath, source] of Object.entries(routeSources)) {
		const path = normalizeAppRoutePath(filePath);
		const componentNames = extractPageComponentNames(source).filter((name) =>
			storyRecordMap.has(name),
		);

		for (const componentName of componentNames) {
			const pageAccessItem = pageAccessByPath.get(path);

			if (pageAccessItem) {
				const laneLeafId =
					pageAccessItem.menuLeafId ??
					buildAdminLeafIdFromPageId(pageAccessItem.pageId);
				const laneInfo = adminLeafMap.get(laneLeafId) ?? {
					id: pageAccessItem.groupId,
					label: pageAccessItem.groupLabel,
					order: 999,
					groupLabel: pageAccessItem.groupLabel,
				};

				bindings.push({
					id: `admin:${path}`,
					appId: "admin",
					componentName,
					path,
					pageKind: getAdminPageKind(pageAccessItem.pageId),
					pageLabel: pageAccessItem.pageLabel,
					description: pageAccessItem.description,
					laneId: `admin:${laneInfo.id}`,
					laneLabel: laneInfo.label,
					laneOrder: laneInfo.order,
					routeSource: normalizeSlashes(filePath),
				});
				continue;
			}

			const specialBinding = createAdminSpecialBinding({
				componentName,
				filePath,
				path,
			});

			if (specialBinding) {
				bindings.push(specialBinding);
			}
		}
	}

	return bindings;
}

function createAdminSpecialBinding({
	componentName,
	filePath,
	path,
}: {
	componentName: string;
	filePath: string;
	path: string;
}) {
	if (path === "/") {
		return {
			id: "admin:/",
			appId: "admin",
			componentName,
			path,
			pageKind: "custom",
			pageLabel: "세션 확인",
			laneId: "admin:system",
			laneLabel: "Admin 시스템",
			laneOrder: 0,
			routeSource: normalizeSlashes(filePath),
		} satisfies RouteBinding;
	}

	if (path === "/auth/login") {
		return {
			id: "admin:/auth/login",
			appId: "admin",
			componentName,
			path,
			pageKind: "custom",
			pageLabel: "관리자 로그인",
			laneId: "admin:auth",
			laneLabel: "Admin 인증",
			laneOrder: 1,
			routeSource: normalizeSlashes(filePath),
		} satisfies RouteBinding;
	}

	return null;
}

function createIdpRouteBindings(
	routeSources: Record<string, string>,
	storyRecordMap: Map<string, StoryRecord>,
) {
	const laneMap = createIdpLaneMap(IDP_NAV_ITEMS);
	const bindings: RouteBinding[] = [];

	for (const [filePath, source] of Object.entries(routeSources)) {
		const path = normalizeAppRoutePath(filePath);
		const componentNames = extractPageComponentNames(source).filter((name) =>
			storyRecordMap.has(name),
		);

		for (const componentName of componentNames) {
			bindings.push(
				createIdpRouteBinding({
					componentName,
					filePath,
					path,
					laneMap,
				}),
			);
		}
	}

	return bindings;
}

function createIdpRouteBinding({
	componentName,
	filePath,
	path,
	laneMap,
}: {
	componentName: string;
	filePath: string;
	path: string;
	laneMap: Map<string, LaneInfo>;
}) {
	const matchingNavItem = IDP_NAV_ITEMS.find(
		(navItem) => path === navItem.path || path.startsWith(`${navItem.path}/`),
	);

	if (matchingNavItem) {
		const laneInfo = laneMap.get(matchingNavItem.id) ?? {
			id: matchingNavItem.id,
			label: matchingNavItem.label,
			order: 999,
		};

		return {
			id: `idp:${path}`,
			appId: "idp",
			componentName,
			path,
			pageKind: getGenericPageKind(path, path === matchingNavItem.path),
			pageLabel: getIdpPageLabel(path, matchingNavItem.label),
			laneId: `idp:${laneInfo.id}`,
			laneLabel: laneInfo.label,
			laneOrder: laneInfo.order,
			routeSource: normalizeSlashes(filePath),
		} satisfies RouteBinding;
	}

	return createIdpSpecialBinding({
		componentName,
		filePath,
		path,
		laneMap,
	});
}

function createIdpSpecialBinding({
	componentName,
	filePath,
	path,
	laneMap,
}: {
	componentName: string;
	filePath: string;
	path: string;
	laneMap: Map<string, LaneInfo>;
}) {
	const bootstrapLane = laneMap.get("bootstrap");
	const authLane = laneMap.get("auth");
	const authLabels: Record<string, string> = {
		"/auth/login": "IDP 로그인",
		"/error": "오류 화면",
		"/forgot-password": "비밀번호 재설정 요청",
		"/interaction/[uid]": "OIDC 상호작용",
		"/reset-password/[token]": "비밀번호 재설정",
	};

	if (path === "/") {
		return {
			id: "idp:/",
			appId: "idp",
			componentName,
			path,
			pageKind: "custom",
			pageLabel: "세션 확인",
			laneId: `idp:${bootstrapLane?.id ?? "bootstrap"}`,
			laneLabel: bootstrapLane?.label ?? "IDP 시스템",
			laneOrder: bootstrapLane?.order ?? 0,
			routeSource: normalizeSlashes(filePath),
		} satisfies RouteBinding;
	}

	return {
		id: `idp:${path}`,
		appId: "idp",
		componentName,
		path,
		pageKind: getGenericPageKind(path),
		pageLabel: authLabels[path] ?? "IDP 인증 화면",
		laneId: `idp:${authLane?.id ?? "auth"}`,
		laneLabel: authLane?.label ?? "IDP 인증",
		laneOrder: authLane?.order ?? 1,
		routeSource: normalizeSlashes(filePath),
	} satisfies RouteBinding;
}

function getIdpPageLabel(path: string, navLabel: string) {
	if (path.endsWith("/new")) {
		return `${navLabel} 등록`;
	}
	if (path.endsWith("/edit")) {
		return `${navLabel} 수정`;
	}
	if (/\[[^/]+\]$/.test(path)) {
		return `${navLabel} 상세`;
	}

	return navLabel;
}

function getPageDepth(path: string) {
	return path.split("/").filter(Boolean).length;
}

function parsePlanningDocument(sourcePath: string, rawMarkdown: string) {
	const lines = rawMarkdown.replace(/\r\n?/g, "\n").split("\n");
	const titleIndex = lines.findIndex((line) => /^#\s+/.test(line));
	const title =
		titleIndex === -1
			? (sourcePath.split("/").pop()?.replace(/\.md$/, "") ?? sourcePath)
			: lines[titleIndex].replace(/^#\s+/, "").trim();
	const preamble: string[] = [];
	const sections: MarkdownSection[] = [];
	let currentHeading: string | null = null;
	let currentLines: string[] = [];

	const flushSection = () => {
		if (!currentHeading) {
			return;
		}

		sections.push({
			heading: currentHeading,
			content: currentLines.join("\n").trim(),
		});
		currentHeading = null;
		currentLines = [];
	};

	for (const line of lines.slice(titleIndex + 1)) {
		const sectionMatch = line.match(/^##\s+(.+)$/);

		if (sectionMatch) {
			flushSection();
			currentHeading = sectionMatch[1].trim();
			continue;
		}

		if (currentHeading) {
			currentLines.push(line);
			continue;
		}

		preamble.push(line);
	}

	flushSection();

	const normalizedPreamble = preamble
		.join("\n")
		.split("\n")
		.map((line) => line.trim())
		.filter(Boolean);
	const metadata = normalizedPreamble
		.filter((line) => line.startsWith(">"))
		.map((line) => line.replace(/^>\s*/, "").trim());
	const summaryLines = normalizedPreamble.filter(
		(line) => !line.startsWith(">"),
	);

	return {
		title,
		metadata,
		summary: summaryLines.length > 0 ? summaryLines.join("\n") : null,
		sections: sections.filter((section) => section.content.length > 0),
	};
}

function createPlanningDocuments({
	purePageSpecSources,
	adminRouteSpecSources,
	idpRouteSpecSources,
}: {
	purePageSpecSources: Record<string, string>;
	adminRouteSpecSources: Record<string, string>;
	idpRouteSpecSources: Record<string, string>;
}) {
	const documents: Record<string, PlanningDocument> = {};
	const purePageIdByComponent = new Map<string, string>();
	const routePageIdByKey = new Map<string, string>();

	for (const [filePath, source] of Object.entries(purePageSpecSources)) {
		if (filePath.endsWith(".stories.spec.md")) {
			continue;
		}

		const componentName = getComponentNameFromPureSpecPath(filePath);

		if (!componentName) {
			continue;
		}

		const documentId = `pure:${componentName}`;
		const parsed = parsePlanningDocument(normalizeSlashes(filePath), source);
		documents[documentId] = {
			id: documentId,
			componentName,
			kind: "pure-page",
			metadata: parsed.metadata,
			rawMarkdown: source,
			sections: parsed.sections,
			sourcePath: normalizeSlashes(filePath),
			summary: parsed.summary,
			title: parsed.title,
		};
		purePageIdByComponent.set(componentName, documentId);
	}

	const appendRouteDocuments = (
		appId: AppId,
		specSources: Record<string, string>,
	) => {
		for (const [filePath, source] of Object.entries(specSources)) {
			const routePath = normalizeAppRoutePath(filePath);
			const documentId = `${appId}:${routePath}:spec`;
			const parsed = parsePlanningDocument(normalizeSlashes(filePath), source);

			documents[documentId] = {
				id: documentId,
				appId,
				kind: "route-page",
				metadata: parsed.metadata,
				rawMarkdown: source,
				routePath,
				sections: parsed.sections,
				sourcePath: normalizeSlashes(filePath),
				summary: parsed.summary,
				title: parsed.title,
			};
			routePageIdByKey.set(`${appId}:${routePath}`, documentId);
		}
	};

	appendRouteDocuments("admin", adminRouteSpecSources);
	appendRouteDocuments("idp", idpRouteSpecSources);

	return {
		documents,
		purePageIdByComponent,
		routePageIdByKey,
	} satisfies PlanningBuildResult;
}

function buildCatalogEntries(
	storyRecords: StoryRecord[],
	bindings: RouteBinding[],
	planning: PlanningBuildResult,
) {
	const bindingsByComponent = new Map<string, RouteBinding[]>();

	for (const binding of bindings) {
		const existingBindings =
			bindingsByComponent.get(binding.componentName) ?? [];
		existingBindings.push(binding);
		bindingsByComponent.set(binding.componentName, existingBindings);
	}

	return storyRecords
		.map((storyRecord) => {
			const componentBindings = (
				bindingsByComponent.get(storyRecord.componentName) ?? []
			).sort(
				(left, right) =>
					left.laneOrder - right.laneOrder ||
					left.path.localeCompare(right.path),
			);
			const appIds =
				componentBindings.length === 0
					? (["standalone"] as Array<AppId | "standalone">)
					: [...new Set(componentBindings.map((binding) => binding.appId))];
			const routePageIds = [
				...new Set(
					componentBindings
						.map((binding) =>
							planning.routePageIdByKey.get(`${binding.appId}:${binding.path}`),
						)
						.filter((value): value is string => Boolean(value)),
				),
			];

			return {
				...storyRecord,
				bindings: componentBindings,
				appIds,
				planning: {
					purePageId:
						planning.purePageIdByComponent.get(storyRecord.componentName) ??
						null,
					routePageIds,
				},
			} satisfies PageCatalogEntry;
		})
		.sort((left, right) => {
			const leftStandalone = left.bindings.length === 0 ? 1 : 0;
			const rightStandalone = right.bindings.length === 0 ? 1 : 0;

			if (leftStandalone !== rightStandalone) {
				return leftStandalone - rightStandalone;
			}

			const leftPath = left.bindings[0]?.path ?? left.componentName;
			const rightPath = right.bindings[0]?.path ?? right.componentName;

			return leftPath.localeCompare(rightPath);
		});
}

function buildFlowLanes(
	entries: PageCatalogEntry[],
	flowOverrides: FlowOverride[],
) {
	const laneMap = new Map<string, FlowLane>();
	const overrideEdgesByLane = createOverrideEdgesByLane(flowOverrides);

	for (const entry of entries) {
		for (const binding of entry.bindings) {
			const lane = laneMap.get(binding.laneId) ?? {
				id: binding.laneId,
				appId: binding.appId,
				label: binding.laneLabel,
				order: binding.laneOrder,
				nodes: [],
				edges: [],
			};

			lane.nodes.push({
				id: binding.id,
				appId: binding.appId,
				componentName: binding.componentName,
				storyId: entry.storyId,
				storyHref: entry.storyHref,
				maturity: entry.maturity,
				path: binding.path,
				pageKind: binding.pageKind,
				label: binding.pageLabel,
				description: binding.description,
				laneId: binding.laneId,
				laneLabel: binding.laneLabel,
				order:
					getPageDepth(binding.path) * 10 + getPageKindRank(binding.pageKind),
				planning: {
					purePageId: entry.planning.purePageId,
					routePageId:
						entry.planning.routePageIds.find(
							(documentId) =>
								documentId === `${binding.appId}:${binding.path}:spec`,
						) ?? null,
				},
			});

			laneMap.set(binding.laneId, lane);
		}
	}

	for (const lane of laneMap.values()) {
		lane.nodes.sort(
			(left, right) =>
				left.order - right.order || left.path.localeCompare(right.path),
		);
		lane.edges = buildLaneEdges(
			lane.nodes,
			overrideEdgesByLane.get(lane.id) ?? [],
		);
	}

	return [...laneMap.values()].sort(
		(left, right) =>
			left.order - right.order || left.label.localeCompare(right.label),
	);
}

function createOverrideEdgesByLane(flowOverrides: FlowOverride[]) {
	const overrideEdgesByLane = new Map<string, FlowOverrideEdge[]>();

	for (const flowOverride of flowOverrides) {
		for (const edge of flowOverride.edges ?? []) {
			const existingEdges = overrideEdgesByLane.get(edge.laneId) ?? [];
			existingEdges.push(edge);
			overrideEdgesByLane.set(edge.laneId, existingEdges);
		}
	}

	return overrideEdgesByLane;
}

function getPageKindRank(pageKind: PageKind) {
	const rank: Record<PageKind, number> = {
		list: 0,
		new: 1,
		detail: 2,
		edit: 3,
		custom: 4,
	};

	return rank[pageKind];
}

function buildLaneEdges(nodes: FlowNode[], overrideEdges: FlowOverrideEdge[]) {
	const nodeByPath = new Map(nodes.map((node) => [node.path, node]));
	const edgeMap = new Map<string, FlowEdge>();

	for (const node of nodes) {
		const candidates = collectParentCandidates(node.path, node.pageKind);

		for (const candidate of candidates) {
			const parentNode = nodeByPath.get(candidate.path);

			if (!parentNode) {
				continue;
			}

			const edgeId = `${parentNode.id}->${node.id}`;

			if (!edgeMap.has(edgeId)) {
				edgeMap.set(edgeId, {
					id: edgeId,
					from: parentNode.id,
					to: node.id,
					label: candidate.label,
					source: "auto",
				});
			}

			break;
		}
	}

	for (const overrideEdge of overrideEdges) {
		const fromNode = nodeByPath.get(overrideEdge.fromPath);
		const toNode = nodeByPath.get(overrideEdge.toPath);

		if (!fromNode || !toNode) {
			continue;
		}

		const edgeId = `${fromNode.id}->${toNode.id}`;
		edgeMap.set(edgeId, {
			id: edgeId,
			from: fromNode.id,
			to: toNode.id,
			label: overrideEdge.label,
			source: "manual",
		});
	}

	return [...edgeMap.values()];
}

function collectParentCandidates(path: string, pageKind: PageKind) {
	const candidates: Array<{ path: string; label: string }> = [];
	const segments = path.split("/").filter(Boolean);

	if (pageKind === "new") {
		candidates.push({
			path: `/${segments.slice(0, -1).join("/")}`,
			label: "등록",
		});
	}

	if (pageKind === "edit") {
		candidates.push({
			path: `/${segments.slice(0, -1).join("/")}`,
			label: "수정",
		});
	}

	if (pageKind === "detail") {
		candidates.push({
			path: `/${segments.slice(0, -1).join("/")}`,
			label: "상세",
		});
	}

	for (let index = segments.length - 1; index > 0; index -= 1) {
		candidates.push({
			path: `/${segments.slice(0, index).join("/")}`,
			label: "하위 흐름",
		});
	}

	return candidates.filter((candidate) => candidate.path !== path);
}

function createSummary(entries: PageCatalogEntry[]): OverviewSummary {
	const totalPages = entries.length;
	const routedPages = entries.filter(
		(entry) => entry.bindings.length > 0,
	).length;
	const scaffoldPages = entries.filter(
		(entry) => entry.maturity === "scaffold",
	).length;

	return {
		totalPages,
		routedPages,
		standalonePages: totalPages - routedPages,
		scenarioPages: totalPages - scaffoldPages,
		scaffoldPages,
	};
}

export function findCatalogEntryForStory(
	manifest: OverviewManifest,
	storyId: string,
) {
	return (
		manifest.entries.find((entry) => entry.storyIds.includes(storyId)) ?? null
	);
}

export function getPlanningDocument(
	manifest: OverviewManifest,
	documentId: string | null,
) {
	if (!documentId) {
		return null;
	}

	return manifest.planningDocuments[documentId] ?? null;
}

export function createOverviewManifest({
	storySources,
	purePageSpecSources,
	adminRouteSources,
	adminRouteSpecSources,
	idpRouteSources,
	idpRouteSpecSources,
	flowOverrides = FLOW_OVERRIDES,
}: {
	storySources: Record<string, string>;
	purePageSpecSources: Record<string, string>;
	adminRouteSources: Record<string, string>;
	adminRouteSpecSources: Record<string, string>;
	idpRouteSources: Record<string, string>;
	idpRouteSpecSources: Record<string, string>;
	flowOverrides?: FlowOverride[];
}) {
	const storyRecords = createStoryRecords(storySources);
	const storyRecordMap = new Map(
		storyRecords.map((storyRecord) => [storyRecord.componentName, storyRecord]),
	);
	const bindings = [
		...createAdminRouteBindings(adminRouteSources, storyRecordMap),
		...createIdpRouteBindings(idpRouteSources, storyRecordMap),
	];
	const planning = createPlanningDocuments({
		purePageSpecSources,
		adminRouteSpecSources,
		idpRouteSpecSources,
	});
	const entries = buildCatalogEntries(storyRecords, bindings, planning);
	const lanes = buildFlowLanes(entries, flowOverrides);

	return {
		summary: createSummary(entries),
		entries,
		lanes,
		planningDocuments: planning.documents,
	} satisfies OverviewManifest;
}

export function buildOverviewManifest() {
	const sourceMaps =
		typeof __STORYBOOK_OVERVIEW_MANIFEST_SOURCES__ === "undefined"
			? EMPTY_OVERVIEW_MANIFEST_SOURCE_MAPS
			: __STORYBOOK_OVERVIEW_MANIFEST_SOURCES__;

	return createOverviewManifest({
		...sourceMaps,
	});
}
