// @vitest-environment jsdom

import { fireEvent, render, screen } from "@testing-library/react";
import { describe, expect, it } from "vitest";
import type { OverviewManifest } from "../overview/manifest";
import { PagePlanningDock } from "./PagePlanningDock";

const manifest: OverviewManifest = {
	summary: {
		totalPages: 1,
		routedPages: 1,
		standalonePages: 0,
		scenarioPages: 1,
		scaffoldPages: 0,
	},
	entries: [
		{
			componentName: "RoleListPage",
			componentPath: "page/RoleListPage/RoleListPage.tsx",
			storyTitle: "page/RoleListPage",
			storyId: "page-rolelistpage--default",
			storyHref: "./?path=/story/page-rolelistpage--default",
			storyIds: [
				"page-rolelistpage--default",
				"page-rolelistpage--docs",
			],
			maturity: "scenario",
			appIds: ["admin"],
			planning: {
				purePageId: "pure:RoleListPage",
				routePageIds: ["admin:/roles:spec"],
			},
			bindings: [
				{
					id: "admin:/roles",
					appId: "admin",
					componentName: "RoleListPage",
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
	],
	lanes: [],
	planningDocuments: {
		"admin:/roles:spec": {
			id: "admin:/roles:spec",
			appId: "admin",
			kind: "route-page",
			metadata: [],
			rawMarkdown:
				"# 역할 목록 페이지 기획서\n\n## 사용자 시나리오\n\n1. 관리자가 역할 목록을 확인합니다.",
			routePath: "/roles",
			sections: [
				{
					heading: "사용자 시나리오",
					content: "1. 관리자가 역할 목록을 확인합니다.",
				},
			],
			sourcePath: "apps/admin/web/src/app/(admin)/roles/page.spec.md",
			summary: null,
			title: "역할 목록 페이지 기획서",
		},
		"pure:RoleListPage": {
			id: "pure:RoleListPage",
			componentName: "RoleListPage",
			kind: "pure-page",
			metadata: [],
			rawMarkdown:
				"# RoleListPage ui 기획서\n\n## 역할\n\n역할 목록 화면의 pure page 컴포넌트입니다.",
			sections: [
				{
					heading: "역할",
					content: "역할 목록 화면의 pure page 컴포넌트입니다.",
				},
			],
			sourcePath:
				"packages/fe-ui/src/page/RoleListPage/RoleListPage.spec.md",
			summary: null,
			title: "RoleListPage ui 기획서",
		},
	},
};

describe("PagePlanningDock", () => {
	it("renders a floating launcher and expands planning into a full-screen overlay", () => {
		render(
			<PagePlanningDock
				manifest={manifest}
				storyId="page-rolelistpage--default"
			>
				<div>Story Canvas</div>
			</PagePlanningDock>,
		);

		expect(screen.getByText("Story Canvas")).toBeInTheDocument();
		expect(
			screen.getByRole("button", { name: "Open planning overlay" }),
		).toBeInTheDocument();
		expect(
			screen.queryByRole("heading", { name: "RoleListPage" }),
		).not.toBeInTheDocument();

		fireEvent.click(screen.getByRole("button", { name: "Open planning overlay" }));

		expect(
			screen.getByRole("heading", { name: "RoleListPage" }),
		).toBeInTheDocument();
		expect(screen.getByText("Route Planning")).toBeInTheDocument();
		expect(
			screen.getByRole("button", { name: "Close planning overlay" }),
		).toBeInTheDocument();
		expect(screen.getByText("Planning Overlay")).toBeInTheDocument();
	});
});
