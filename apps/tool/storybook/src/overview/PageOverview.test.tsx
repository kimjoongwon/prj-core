// @vitest-environment jsdom

import { fireEvent, render, screen } from "@testing-library/react";
import { describe, expect, it } from "vitest";
import type { OverviewManifest } from "./manifest";
import { PageOverview } from "./PageOverview";

const manifest: OverviewManifest = {
	summary: {
		totalPages: 3,
		routedPages: 2,
		standalonePages: 1,
		scenarioPages: 1,
		scaffoldPages: 2,
	},
	entries: [
		{
			componentName: "AdminRolesPage",
			componentPath: "page/AdminRolesPage/AdminRolesPage.tsx",
			storyTitle: "page/AdminRolesPage",
			storyId: "page-adminrolespage--default",
			storyHref: "./?path=/story/page-adminrolespage--default",
			maturity: "scaffold",
			appIds: ["admin"],
			bindings: [
				{
					id: "admin:/roles",
					appId: "admin",
					componentName: "AdminRolesPage",
					path: "/roles",
					pageKind: "list",
					pageLabel: "역할 목록",
					laneId: "admin:roles-list",
					laneLabel: "권한 관리 / 역할",
					laneOrder: 10,
					routeSource: "apps/admin/web/src/app/(admin)/roles/page.tsx",
				},
			],
		},
		{
			componentName: "IdpConsoleAccountsPage",
			componentPath: "page/IdpConsoleAccountsPage/IdpConsoleAccountsPage.tsx",
			storyTitle: "page/IdpConsoleAccountsPage",
			storyId: "page-idpconsoleaccountspage--default",
			storyHref: "./?path=/story/page-idpconsoleaccountspage--default",
			maturity: "scaffold",
			appIds: ["idp"],
			bindings: [
				{
					id: "idp:/accounts",
					appId: "idp",
					componentName: "IdpConsoleAccountsPage",
					path: "/accounts",
					pageKind: "list",
					pageLabel: "계정 관리",
					laneId: "idp:accounts",
					laneLabel: "계정 관리",
					laneOrder: 20,
					routeSource: "apps/idp/web/src/app/(console)/accounts/page.tsx",
				},
			],
		},
		{
			componentName: "TenantSelectPage",
			componentPath: "page/TenantSelectPage/TenantSelectPage.tsx",
			storyTitle: "page/TenantSelectPage",
			storyId: "page-tenantselectpage--default",
			storyHref: "./?path=/story/page-tenantselectpage--default",
			maturity: "scenario",
			appIds: ["standalone"],
			bindings: [],
		},
	],
	lanes: [
		{
			id: "admin:roles-list",
			appId: "admin",
			label: "권한 관리 / 역할",
			order: 10,
			nodes: [
				{
					id: "admin:/roles",
					appId: "admin",
					componentName: "AdminRolesPage",
					storyId: "page-adminrolespage--default",
					storyHref: "./?path=/story/page-adminrolespage--default",
					maturity: "scaffold",
					path: "/roles",
					pageKind: "list",
					label: "역할 목록",
					laneId: "admin:roles-list",
					laneLabel: "권한 관리 / 역할",
					order: 10,
				},
			],
			edges: [],
		},
		{
			id: "idp:accounts",
			appId: "idp",
			label: "계정 관리",
			order: 20,
			nodes: [
				{
					id: "idp:/accounts",
					appId: "idp",
					componentName: "IdpConsoleAccountsPage",
					storyId: "page-idpconsoleaccountspage--default",
					storyHref: "./?path=/story/page-idpconsoleaccountspage--default",
					maturity: "scaffold",
					path: "/accounts",
					pageKind: "list",
					label: "계정 관리",
					laneId: "idp:accounts",
					laneLabel: "계정 관리",
					order: 10,
				},
			],
			edges: [],
		},
	],
};

describe("PageOverview", () => {
	it("renders summary cards and catalog entries", () => {
		render(<PageOverview manifest={manifest} />);

		expect(screen.getByText("Page Catalog + Flow Map")).toBeInTheDocument();
		expect(screen.getAllByText("AdminRolesPage").length).toBeGreaterThan(0);
		expect(screen.getByText("TenantSelectPage")).toBeInTheDocument();
		expect(screen.getByText("3")).toBeInTheDocument();
	});

	it("filters to standalone pages and hides routed lanes", () => {
		render(<PageOverview manifest={manifest} />);

		fireEvent.change(screen.getByLabelText("App"), {
			target: { value: "standalone" },
		});

		expect(screen.getByText("TenantSelectPage")).toBeInTheDocument();
		expect(screen.queryByText("AdminRolesPage")).not.toBeInTheDocument();
		expect(
			screen.getByText("현재 필터에는 표시할 routed flow가 없습니다."),
		).toBeInTheDocument();
	});

	it("filters by search and keeps story links accessible", () => {
		render(<PageOverview manifest={manifest} />);

		fireEvent.change(screen.getByLabelText("Search"), {
			target: { value: "accounts" },
		});

		expect(
			screen.getAllByText("IdpConsoleAccountsPage").length,
		).toBeGreaterThan(0);
		expect(screen.queryByText("AdminRolesPage")).not.toBeInTheDocument();
		expect(
			screen
				.getAllByRole("link", { name: "Open Story" })
				.some(
					(link) =>
						link.getAttribute("href") ===
						"./?path=/story/page-idpconsoleaccountspage--default",
				),
		).toBe(true);
	});
});
