import { describe, expect, it } from "vitest";
import {
	buildOverviewManifest,
	createStoryId,
	extractPageComponentNames,
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
	});

	it("extracts page components from @cocrepo/ui route files", () => {
		const source = `
			import {
				AdminRolesPage,
				type AdminRolesPageRole,
				useMetaDataGridQueryStates,
			} from "@cocrepo/ui";

			export { SessionCheckPage as default } from "@cocrepo/ui";
		`;

		expect(extractPageComponentNames(source)).toEqual([
			"AdminRolesPage",
			"SessionCheckPage",
		]);
	});

	it("detects scaffold stories and creates stable story ids", () => {
		expect(
			getStoryMaturity(
				'import { PageStoryScaffold } from "../storybookFrame"; export const Default = {};',
			),
		).toBe("scaffold");
		expect(createStoryId("page/AdminRolesPage", "Default")).toBe(
			"page-adminrolespage--default",
		);
	});
});

describe("buildOverviewManifest", () => {
	it("includes known admin and idp routed pages", () => {
		const manifest = buildOverviewManifest();
		const adminRolesPage = manifest.entries.find(
			(entry) => entry.componentName === "AdminRolesPage",
		);
		const idpAccountsPage = manifest.entries.find(
			(entry) => entry.componentName === "IdpConsoleAccountsPage",
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
				}),
				expect.objectContaining({
					label: "상세",
				}),
				expect.objectContaining({
					label: "수정",
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
});
