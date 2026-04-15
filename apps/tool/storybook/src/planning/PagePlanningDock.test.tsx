// @vitest-environment jsdom

import { render, screen } from "@testing-library/react";
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
			componentName: "AdminRolesPage",
			componentPath: "page/AdminRolesPage/AdminRolesPage.tsx",
			storyTitle: "page/AdminRolesPage",
			storyId: "page-adminrolespage--default",
			storyHref: "./?path=/story/page-adminrolespage--default",
			storyIds: [
				"page-adminrolespage--default",
				"page-adminrolespage--docs",
			],
			maturity: "scenario",
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
		"pure:AdminRolesPage": {
			id: "pure:AdminRolesPage",
			componentName: "AdminRolesPage",
			kind: "pure-page",
			metadata: [],
			rawMarkdown:
				"# AdminRolesPage ui 기획서\n\n## 역할\n\n역할 목록 화면의 pure page 컴포넌트입니다.",
			sections: [
				{
					heading: "역할",
					content: "역할 목록 화면의 pure page 컴포넌트입니다.",
				},
			],
			sourcePath:
				"packages/fe-ui/src/page/AdminRolesPage/AdminRolesPage.spec.md",
			summary: null,
			title: "AdminRolesPage ui 기획서",
		},
	},
};

describe("PagePlanningDock", () => {
	it("renders the story content with an expandable planning shelf", () => {
		Object.defineProperty(window, "innerWidth", {
			configurable: true,
			value: 1680,
		});
		render(
			<PagePlanningDock
				manifest={manifest}
				storyId="page-adminrolespage--default"
			>
				<div>Story Canvas</div>
			</PagePlanningDock>,
		);

		expect(screen.getByText("Story Canvas")).toBeInTheDocument();
		expect(
			screen.getByRole("heading", { name: "AdminRolesPage" }),
		).toBeInTheDocument();
		expect(screen.getByText("Route Planning")).toBeInTheDocument();
		expect(
			screen.getByRole("button", { name: "Collapse planning shelf" }),
		).toBeInTheDocument();
		expect(screen.getByText("Planning Shelf")).toBeInTheDocument();
	});
});
