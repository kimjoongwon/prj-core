import { readdirSync, readFileSync, writeFileSync } from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";
import vm from "node:vm";
import ts from "typescript";

const scriptFilePath = fileURLToPath(import.meta.url);
export const scriptDir = path.dirname(scriptFilePath);
export const packageDir = path.resolve(scriptDir, "..");
export const repoRoot = path.resolve(packageDir, "../..");
export const adminAppDir = path.join(
	repoRoot,
	"apps/admin/web/src/app/(admin)",
);
export const outputFile = path.join(
	packageDir,
	"src/routing/generated/admin-route-catalog.generated.ts",
);

function toPosixPath(filePath) {
	return filePath.split(path.sep).join("/");
}

function collectFiles(directory, targetName) {
	const entries = readdirSync(directory, { withFileTypes: true });
	const files = [];

	for (const entry of entries) {
		const fullPath = path.join(directory, entry.name);
		if (entry.isDirectory()) {
			files.push(...collectFiles(fullPath, targetName));
			continue;
		}

		if (entry.isFile() && entry.name === targetName) {
			files.push(fullPath);
		}
	}

	return files.sort((left, right) => left.localeCompare(right));
}

export function collectRouteMetaFiles(directory) {
	return collectFiles(directory, "route.meta.ts");
}

export function collectPageFiles(directory) {
	return collectFiles(directory, "page.tsx");
}

function fail(filePath, message) {
	throw new Error(`[admin-route-meta] ${toPosixPath(filePath)}: ${message}`);
}

function validateString(filePath, value, fieldName) {
	if (typeof value !== "string" || value.length === 0) {
		fail(filePath, `${fieldName} must be a non-empty string.`);
	}
}

function validateOrder(filePath, value, fieldName) {
	if (!Number.isInteger(value) || value < 1) {
		fail(filePath, `${fieldName} must be an integer greater than or equal to 1.`);
	}
}

function loadRouteMeta(filePath) {
	const source = readFileSync(filePath, "utf8");
	const transpiled = ts.transpileModule(source, {
		compilerOptions: {
			target: ts.ScriptTarget.ES2022,
			module: ts.ModuleKind.CommonJS,
		},
		fileName: filePath,
	}).outputText;

	if (transpiled.includes("require(")) {
		fail(
			filePath,
			"route.meta.ts must use literal values and type-only imports only.",
		);
	}

	const module = { exports: {} };
	const context = vm.createContext({
		module,
		exports: module.exports,
	});
	const script = new vm.Script(transpiled, {
		filename: filePath,
	});
	script.runInContext(context);

	const routeMeta = module.exports.routeMeta;
	if (!routeMeta || typeof routeMeta !== "object") {
		fail(filePath, "routeMeta export is required.");
	}
	if (!routeMeta.page || typeof routeMeta.page !== "object") {
		fail(filePath, "routeMeta.page is required.");
	}

	const page = routeMeta.page;
	validateString(filePath, page.groupId, "page.groupId");
	validateString(filePath, page.groupLabel, "page.groupLabel");
	validateString(filePath, page.pageId, "page.pageId");
	validateString(filePath, page.pageLabel, "page.pageLabel");
	validateString(filePath, page.pathPattern, "page.pathPattern");
	validateOrder(filePath, page.order, "page.order");
	if (page.subject !== undefined) {
		validateString(filePath, page.subject, "page.subject");
	}
	if (page.menuLeafId !== undefined) {
		validateString(filePath, page.menuLeafId, "page.menuLeafId");
	}

	if (routeMeta.navItem !== undefined) {
		const navItem = routeMeta.navItem;
		if (!navItem || typeof navItem !== "object") {
			fail(filePath, "routeMeta.navItem must be an object when present.");
		}
		validateString(filePath, navItem.id, "navItem.id");
		validateString(filePath, navItem.label, "navItem.label");
		validateString(filePath, navItem.path, "navItem.path");
		validateString(filePath, navItem.subject, "navItem.subject");
		validateOrder(filePath, navItem.order, "navItem.order");

		if (navItem.parent !== undefined) {
			const parent = navItem.parent;
			if (!parent || typeof parent !== "object") {
				fail(filePath, "navItem.parent must be an object when present.");
			}
			validateString(filePath, parent.id, "navItem.parent.id");
			validateString(filePath, parent.label, "navItem.parent.label");
			validateString(filePath, parent.subject, "navItem.parent.subject");
			validateOrder(filePath, parent.order, "navItem.parent.order");
			if (parent.path !== undefined) {
				validateString(filePath, parent.path, "navItem.parent.path");
			}
		}
	}

	return routeMeta;
}

export function validateRouteMetaCoverage(routeMetaFiles, pageFiles) {
	const routeMetaDirs = new Set(routeMetaFiles.map((filePath) => path.dirname(filePath)));
	const pageDirs = new Set(pageFiles.map((filePath) => path.dirname(filePath)));

	const missingRouteMetaDirs = [...pageDirs]
		.filter((directory) => !routeMetaDirs.has(directory))
		.map((directory) => toPosixPath(path.relative(repoRoot, directory)));
	const orphanRouteMetaDirs = [...routeMetaDirs]
		.filter((directory) => !pageDirs.has(directory))
		.map((directory) => toPosixPath(path.relative(repoRoot, directory)));

	if (missingRouteMetaDirs.length === 0 && orphanRouteMetaDirs.length === 0) {
		return;
	}

	const problems = [];
	if (missingRouteMetaDirs.length > 0) {
		problems.push(`missing route.meta.ts: ${missingRouteMetaDirs.join(", ")}`);
	}
	if (orphanRouteMetaDirs.length > 0) {
		problems.push(`orphan route.meta.ts: ${orphanRouteMetaDirs.join(", ")}`);
	}

	throw new Error(`[admin-route-meta] coverage check failed: ${problems.join(" | ")}`);
}

function recordUniqueOrder(filePath, orderMap, order, fieldName, idValue) {
	const existing = orderMap.get(order);
	if (existing) {
		fail(filePath, `duplicate ${fieldName} detected: ${order} already used by ${existing}`);
	}
	orderMap.set(order, idValue);
}

export function buildRouteCatalog(routeMetaFiles) {
	const sources = [];
	const pageIdMap = new Map();
	const pageOrderMap = new Map();
	const singleNavMap = new Map();
	const groupedNavMap = new Map();
	const topLevelNavOrderMap = new Map();

	for (const filePath of routeMetaFiles) {
		const relativePath = toPosixPath(path.relative(repoRoot, filePath));
		const routeMeta = loadRouteMeta(filePath);
		sources.push(relativePath);

		const pageItem = {
			groupId: routeMeta.page.groupId,
			groupLabel: routeMeta.page.groupLabel,
			pageId: routeMeta.page.pageId,
			pageLabel: routeMeta.page.pageLabel,
			pathPattern: routeMeta.page.pathPattern,
			subject: routeMeta.page.subject ?? `page:${routeMeta.page.pageId}`,
			description: routeMeta.page.description,
			menuLeafId:
				routeMeta.page.menuLeafId ??
				(routeMeta.navItem?.parent ? routeMeta.navItem.id : undefined),
			sortOrder: routeMeta.page.order,
		};

		if (pageIdMap.has(pageItem.pageId)) {
			fail(filePath, `duplicate page.pageId detected: ${pageItem.pageId}`);
		}
		recordUniqueOrder(
			filePath,
			pageOrderMap,
			pageItem.sortOrder,
			"page.order",
			pageItem.pageId,
		);
		pageIdMap.set(pageItem.pageId, pageItem);

		if (!routeMeta.navItem) {
			continue;
		}

		if (!routeMeta.navItem.parent) {
			if (singleNavMap.has(routeMeta.navItem.id)) {
				fail(filePath, `duplicate top-level nav id detected: ${routeMeta.navItem.id}`);
			}
			recordUniqueOrder(
				filePath,
				topLevelNavOrderMap,
				routeMeta.navItem.order,
				"top-level nav order",
				routeMeta.navItem.id,
			);
			singleNavMap.set(routeMeta.navItem.id, {
				id: routeMeta.navItem.id,
				label: routeMeta.navItem.label,
				path: routeMeta.navItem.path,
				icon: routeMeta.navItem.icon,
				subject: routeMeta.navItem.subject,
				sortOrder: routeMeta.navItem.order,
			});
			continue;
		}

		const parent = routeMeta.navItem.parent;
		const existingGroup = groupedNavMap.get(parent.id);
		const childItem = {
			id: routeMeta.navItem.id,
			label: routeMeta.navItem.label,
			path: routeMeta.navItem.path,
			subject: routeMeta.navItem.subject,
			sortOrder: routeMeta.navItem.order,
		};

		if (!existingGroup) {
			recordUniqueOrder(
				filePath,
				topLevelNavOrderMap,
				parent.order,
				"top-level nav order",
				parent.id,
			);
			groupedNavMap.set(parent.id, {
				id: parent.id,
				label: parent.label,
				icon: parent.icon,
				path: parent.path,
				subject: parent.subject,
				sortOrder: parent.order,
				children: [childItem],
			});
			continue;
		}

		if (
			existingGroup.label !== parent.label ||
			existingGroup.subject !== parent.subject ||
			existingGroup.icon !== parent.icon ||
			existingGroup.path !== parent.path ||
			existingGroup.sortOrder !== parent.order
		) {
			fail(
				filePath,
				`conflicting navItem.parent metadata detected for parent id: ${parent.id}`,
			);
		}

		if (existingGroup.children.some((child) => child.id === childItem.id)) {
			fail(filePath, `duplicate child nav id detected: ${childItem.id}`);
		}
		if (
			existingGroup.children.some(
				(child) => child.sortOrder === childItem.sortOrder,
			)
		) {
			fail(
				filePath,
				`duplicate navItem.order detected within parent ${parent.id}: ${childItem.sortOrder}`,
			);
		}

		existingGroup.children.push(childItem);
	}

	return {
		sources,
		navItems: [...singleNavMap.values(), ...groupedNavMap.values()]
			.sort((left, right) => left.sortOrder - right.sortOrder)
			.map((navItem) => {
				const { sortOrder, children, ...rest } = navItem;
				if (!children) {
					return rest;
				}

				return {
					...rest,
					children: [...children]
						.sort((left, right) => left.sortOrder - right.sortOrder)
						.map(({ sortOrder: childSortOrder, ...child }) => child),
				};
			}),
		pageAccessItems: [...pageIdMap.values()]
			.sort((left, right) => left.sortOrder - right.sortOrder)
			.map(({ sortOrder, ...pageAccessItem }) => pageAccessItem),
	};
}

export function toTypeScriptModule(routeCatalog) {
	return `import type { NavItemConfig } from "@cocrepo/type";
import type { GeneratedAdminPageAccessItem } from "../admin-route-meta";

export const GENERATED_ADMIN_ROUTE_META_SOURCES: string[] = ${JSON.stringify(
		routeCatalog.sources,
		null,
		"\t",
	)};

export const GENERATED_ADMIN_NAV_ITEMS: NavItemConfig[] = ${JSON.stringify(
		routeCatalog.navItems,
		null,
		"\t",
	)};

export const GENERATED_ADMIN_PAGE_ACCESS_ITEMS: GeneratedAdminPageAccessItem[] = ${JSON.stringify(
		routeCatalog.pageAccessItems,
		null,
		"\t",
	)};
`;
}

export function generateAdminRouteCatalog() {
	const routeMetaFiles = collectRouteMetaFiles(adminAppDir);
	const pageFiles = collectPageFiles(adminAppDir);
	validateRouteMetaCoverage(routeMetaFiles, pageFiles);
	const routeCatalog = buildRouteCatalog(routeMetaFiles);
	writeFileSync(outputFile, toTypeScriptModule(routeCatalog), "utf8");
	return routeCatalog;
}

if (process.argv[1] && path.resolve(process.argv[1]) === scriptFilePath) {
	generateAdminRouteCatalog();
}
