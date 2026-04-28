import { describe, expect, it } from "vitest";
import {
	buildOverviewManifest,
	createOverviewManifest,
	createStoryId,
	extractPageComponentNames,
	findCatalogEntryForStory,
	getPlanningDocument,
	getStoryMaturity,
	normalizeAppRoutePath,
} from "./manifest";

describe("overview manifest helpers", () => {
	it("normalizes app route file paths without route groups", () => {
		expect(
			normalizeAppRoutePath(
				"../../../../apps/admin/web/src/app/(admin)/roles/[roleId]/edit/page.tsx",
			),
		).toBe("/roles/[roleId]/edit");
		expect(
			normalizeAppRoutePath(
				"../../../../apps/idp/web/src/app/(auth)/reset-password/[token]/page.tsx",
			),
		).toBe("/reset-password/[token]");
		expect(
			normalizeAppRoutePath("../../../../apps/idp/web/src/app/page.tsx"),
		).toBe("/");
		expect(
			normalizeAppRoutePath(
				"../../../../apps/admin/web/src/app/(admin)/roles/page.spec.md",
			),
		).toBe("/roles");
	});

	it("extracts page components from @cocrepo/ui route files", () => {
		const source = `
			import {
				RoleListPage,
				type RoleListPageProps,
			} from "@cocrepo/ui";

			export { SessionCheckPage as default } from "@cocrepo/ui";
		`;

		expect(extractPageComponentNames(source)).toEqual([
			"RoleListPage",
			"SessionCheckPage",
		]);
	});

	it("detects scaffold stories and creates stable story ids", () => {
		expect(
			getStoryMaturity(
				'import { PageStoryScaffold } from "../storybookFrame"; export const Default = {};',
			),
		).toBe("scaffold");
		expect(createStoryId("page/RoleListPage", "Default")).toBe(
			"page-rolelistpage--default",
		);
	});
});

describe("buildOverviewManifest", () => {
	it("includes known admin and idp routed pages", () => {
		const manifest = buildOverviewManifest();
		const adminRolesPage = manifest.entries.find(
			(entry) => entry.componentName === "RoleListPage",
		);
		const idpAccountsPage = manifest.entries.find(
			(entry) => entry.componentName === "AccountListPage",
		);

		expect(adminRolesPage?.bindings).toEqual(
			expect.arrayContaining([
				expect.objectContaining({
					appId: "admin",
					path: "/roles",
					pageLabel: "역할 목록",
				}),
			]),
		);
		expect(idpAccountsPage?.bindings).toEqual(
			expect.arrayContaining([
				expect.objectContaining({
					appId: "idp",
					path: "/accounts",
					pageLabel: "계정 관리",
				}),
			]),
		);
	});

	it("keeps standalone page components separate from routed entries", () => {
		const manifest = buildOverviewManifest();
		const tenantSelectPage = manifest.entries.find(
			(entry) => entry.componentName === "TenantSelectPage",
		);

		expect(tenantSelectPage?.bindings).toHaveLength(0);
		expect(tenantSelectPage?.appIds).toEqual(["standalone"]);
		expect(tenantSelectPage?.maturity).toBe("scenario");
	});

	it("creates lane flows for representative admin and idp journeys", () => {
		const manifest = buildOverviewManifest();
		const adminRolesLane = manifest.lanes.find(
			(lane) => lane.id === "admin:roles-list",
		);
		const idpAccountsLane = manifest.lanes.find(
			(lane) => lane.id === "idp:accounts",
		);

		expect(adminRolesLane?.nodes).toEqual(
			expect.arrayContaining([
				expect.objectContaining({ path: "/roles" }),
				expect.objectContaining({ path: "/roles/new" }),
				expect.objectContaining({ path: "/roles/[roleId]" }),
				expect.objectContaining({ path: "/roles/[roleId]/edit" }),
			]),
		);
		expect(adminRolesLane?.edges).toEqual(
			expect.arrayContaining([
				expect.objectContaining({
					label: "등록",
					source: "auto",
				}),
				expect.objectContaining({
					label: "상세",
					source: "auto",
				}),
				expect.objectContaining({
					label: "수정",
					source: "auto",
				}),
			]),
		);
		expect(idpAccountsLane?.nodes).toEqual(
			expect.arrayContaining([
				expect.objectContaining({ path: "/accounts" }),
				expect.objectContaining({ path: "/accounts/[userId]" }),
			]),
		);
	});

	it("indexes every story export back to the owning page entry", () => {
		const manifest = buildOverviewManifest();
		const entry = findCatalogEntryForStory(
			manifest,
			"page-rolelistpage--loading",
		);

		expect(entry?.componentName).toBe("RoleListPage");
	});

	it("maps autodocs entries back to the owning page entry", () => {
		const manifest = buildOverviewManifest();
		const entry = findCatalogEntryForStory(manifest, "page-rolelistpage--docs");

		expect(entry?.componentName).toBe("RoleListPage");
	});

	it("loads pure page and route planning documents for page stories", () => {
		const manifest = buildOverviewManifest();
		const entry = manifest.entries.find(
			(item) => item.componentName === "RoleListPage",
		);
		const purePageDocument = getPlanningDocument(
			manifest,
			entry?.planning.purePageId ?? null,
		);
		const routeDocument = getPlanningDocument(
			manifest,
			entry?.planning.routePageIds[0] ?? null,
		);

		expect(purePageDocument?.title).toBe("RoleListPage ui 기획서");
		expect(routeDocument?.title).toBe("역할 목록 페이지 기획서");
		expect(routeDocument?.sections).toEqual(
			expect.arrayContaining([
				expect.objectContaining({ heading: "사용자 시나리오" }),
				expect.objectContaining({ heading: "Rendering Decision" }),
			]),
		);
	});
});

describe("createOverviewManifest", () => {
	it("merges manual flow overrides into the lane graph", () => {
		const manifest = createOverviewManifest({
			storySources: {
				"/repo/packages/fe-ui/src/page/RoleListPage/RoleListPage.stories.tsx": `
						export default {};
						export const Default = {};
					`,
				"/repo/packages/fe-ui/src/page/RoleEditPage/RoleEditPage.stories.tsx": `
						export default {};
						export const Default = {};
					`,
			},
			purePageSpecSources: {
				"/repo/packages/fe-ui/src/page/RoleListPage/RoleListPage.spec.md":
					"# RoleListPage ui 기획서\n\n## 역할\n\n역할 목록",
				"/repo/packages/fe-ui/src/page/RoleEditPage/RoleEditPage.spec.md":
					"# RoleEditPage ui 기획서\n\n## 역할\n\n역할 수정",
			},
			adminRouteSources: {
				"/repo/apps/admin/web/src/app/(admin)/roles/page.tsx":
					'import { RoleListPage } from "@cocrepo/ui";',
				"/repo/apps/admin/web/src/app/(admin)/roles/[roleId]/edit/page.tsx":
					'import { RoleEditPage } from "@cocrepo/ui";',
			},
			adminRouteSpecSources: {
				"/repo/apps/admin/web/src/app/(admin)/roles/page.spec.md":
					"# 역할 목록 페이지 기획서\n\n## 사용자 시나리오\n\n1. 역할 목록을 확인합니다.",
				"/repo/apps/admin/web/src/app/(admin)/roles/[roleId]/edit/page.spec.md":
					"# 역할 수정 페이지 기획서\n\n## 사용자 시나리오\n\n1. 역할을 수정합니다.",
			},
			idpRouteSources: {},
			idpRouteSpecSources: {},
			flowOverrides: [
				{
					edges: [
						{
							laneId: "admin:roles-list",
							fromPath: "/roles",
							toPath: "/roles/[roleId]/edit",
							label: "바로 수정",
						},
					],
				},
			],
		});
		const adminRolesLane = manifest.lanes.find(
			(lane) => lane.id === "admin:roles-list",
		);

		expect(adminRolesLane?.edges).toEqual(
			expect.arrayContaining([
				expect.objectContaining({
					label: "바로 수정",
					source: "manual",
				}),
			]),
		);
	});
});
