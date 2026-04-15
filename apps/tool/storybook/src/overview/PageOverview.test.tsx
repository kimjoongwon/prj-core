// @vitest-environment jsdom

import { fireEvent, render, screen } from "@testing-library/react";
import { beforeAll, describe, expect, it } from "vitest";
import type { OverviewManifest } from "./manifest";
import { PageOverview } from "./PageOverview";

beforeAll(() => {
	class ResizeObserverMock {
		observe() {}
		unobserve() {}
		disconnect() {}
	}

	Object.defineProperty(window, "ResizeObserver", {
		value: ResizeObserverMock,
		writable: true,
	});
	Object.defineProperty(HTMLElement.prototype, "clientWidth", {
		configurable: true,
		get() {
			return 1200;
		},
	});
	Object.defineProperty(HTMLElement.prototype, "clientHeight", {
		configurable: true,
		get() {
			return 800;
		},
	});
	Object.defineProperty(HTMLElement.prototype, "getBoundingClientRect", {
		configurable: true,
		value() {
			return {
				x: 0,
				y: 0,
				top: 0,
				left: 0,
				right: 1200,
				bottom: 800,
				width: 1200,
				height: 800,
				toJSON() {
					return {};
				},
			};
		},
	});
});

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
			storyIds: [
				"page-adminrolespage--default",
				"page-adminrolespage--loading",
			],
			maturity: "scaffold",
			appIds: ["admin"],
			planning: {
				purePageId: "pure:AdminRolesPage",
				routePageIds: ["admin:/roles:spec"],
			},
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
			storyIds: ["page-idpconsoleaccountspage--default"],
			maturity: "scaffold",
			appIds: ["idp"],
			planning: {
				purePageId: "pure:IdpConsoleAccountsPage",
				routePageIds: ["idp:/accounts:spec"],
			},
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
			storyIds: ["page-tenantselectpage--default"],
			maturity: "scenario",
			appIds: ["standalone"],
			planning: {
				purePageId: "pure:TenantSelectPage",
				routePageIds: [],
			},
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
					planning: {
						purePageId: "pure:AdminRolesPage",
						routePageId: "admin:/roles:spec",
					},
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
					planning: {
						purePageId: "pure:IdpConsoleAccountsPage",
						routePageId: "idp:/accounts:spec",
					},
				},
			],
			edges: [],
		},
	],
	planningDocuments: {
		"pure:AdminRolesPage": {
			id: "pure:AdminRolesPage",
			componentName: "AdminRolesPage",
			kind: "pure-page",
			metadata: [],
			rawMarkdown: "# AdminRolesPage ui 기획서",
			sections: [],
			sourcePath:
				"packages/fe-ui/src/page/AdminRolesPage/AdminRolesPage.spec.md",
			summary: null,
			title: "AdminRolesPage ui 기획서",
		},
		"admin:/roles:spec": {
			id: "admin:/roles:spec",
			appId: "admin",
			kind: "route-page",
			metadata: [],
			rawMarkdown: "# 역할 목록 페이지 기획서",
			routePath: "/roles",
			sections: [],
			sourcePath: "apps/admin/web/src/app/(admin)/roles/page.spec.md",
			summary: null,
			title: "역할 목록 페이지 기획서",
		},
		"pure:IdpConsoleAccountsPage": {
			id: "pure:IdpConsoleAccountsPage",
			componentName: "IdpConsoleAccountsPage",
			kind: "pure-page",
			metadata: [],
			rawMarkdown: "# IdpConsoleAccountsPage ui 기획서",
			sections: [],
			sourcePath:
				"packages/fe-ui/src/page/IdpConsoleAccountsPage/IdpConsoleAccountsPage.spec.md",
			summary: null,
			title: "IdpConsoleAccountsPage ui 기획서",
		},
		"idp:/accounts:spec": {
			id: "idp:/accounts:spec",
			appId: "idp",
			kind: "route-page",
			metadata: [],
			rawMarkdown: "# 계정 관리 페이지 기획서",
			routePath: "/accounts",
			sections: [],
			sourcePath: "apps/idp/web/src/app/(console)/accounts/page.spec.md",
			summary: null,
			title: "계정 관리 페이지 기획서",
		},
		"pure:TenantSelectPage": {
			id: "pure:TenantSelectPage",
			componentName: "TenantSelectPage",
			kind: "pure-page",
			metadata: [],
			rawMarkdown: "# TenantSelectPage ui 기획서",
			sections: [],
			sourcePath:
				"packages/fe-ui/src/page/TenantSelectPage/TenantSelectPage.spec.md",
			summary: null,
			title: "TenantSelectPage ui 기획서",
		},
	},
};

describe("PageOverview", () => {
	it("renders summary cards and catalog entries", () => {
		render(<PageOverview manifest={manifest} />);

		expect(screen.getByText("Page Flow Workspace")).toBeInTheDocument();
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

	it("updates the flow detail panel when the visible graph scope changes", () => {
		render(<PageOverview manifest={manifest} />);

		fireEvent.change(screen.getByLabelText("Search"), {
			target: { value: "accounts" },
		});

		expect(screen.getByText("Flow Detail")).toBeInTheDocument();
		expect(screen.getAllByText("계정 관리").length).toBeGreaterThan(1);
		expect(screen.getAllByText("/accounts").length).toBeGreaterThan(0);
	});
});
