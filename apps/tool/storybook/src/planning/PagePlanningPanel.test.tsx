// @vitest-environment jsdom

import { fireEvent, render, screen } from "@testing-library/react";
import { describe, expect, it, vi } from "vitest";
import type { OverviewManifest } from "../overview/manifest";
import { PagePlanningPanelView } from "./PagePlanningPanel";

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
				"page-rolelistpage--loading",
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
			metadata: ["생성일: 2026-03-21", "경로: /roles"],
			rawMarkdown:
				"# 역할 목록 페이지 기획서\n\n## 사용자 시나리오\n\n1. 관리자가 역할 목록을 확인합니다.\n\n## API 호출\n\n- 클라이언트 렌더: useGetRoles\n",
			routePath: "/roles",
			sections: [
				{
					heading: "사용자 시나리오",
					content: "1. 관리자가 역할 목록을 확인합니다.",
				},
				{
					heading: "API 호출",
					content:
						"- 클라이언트 렌더: useGetRoles",
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
			metadata: ["타입: ui"],
			rawMarkdown:
				"# RoleListPage ui 기획서\n\n## 역할\n\n역할 목록 화면의 pure page 컴포넌트입니다.\n\n## 공개 계약\n\n- RoleListPage: 공개 계약 요소\n",
			sections: [
				{
					heading: "역할",
					content: "역할 목록 화면의 pure page 컴포넌트입니다.",
				},
				{
					heading: "공개 계약",
					content:
						"- RoleListPage: 공개 계약 요소",
				},
			],
			sourcePath:
				"packages/fe-ui/src/page/RoleListPage/RoleListPage.spec.md",
			summary: null,
			title: "RoleListPage ui 기획서",
		},
	},
};

describe("PagePlanningPanelView", () => {
	it("shows summary content for the current page story", () => {
		render(
			<PagePlanningPanelView
				manifest={manifest}
				storyId="page-rolelistpage--loading"
			/>,
		);

		expect(
			screen.getByRole("heading", { name: "RoleListPage" }),
		).toBeInTheDocument();
		expect(screen.getByText("Route Planning")).toBeInTheDocument();
		expect(screen.getByText("역할 목록 페이지 기획서")).toBeInTheDocument();
		expect(screen.getByText("사용자 시나리오")).toBeInTheDocument();
		expect(screen.getByText("공개 계약")).toBeInTheDocument();
	});

	it("toggles to raw markdown mode", () => {
		render(
			<PagePlanningPanelView
				manifest={manifest}
				storyId="page-rolelistpage--default"
			/>,
		);

		fireEvent.click(screen.getByRole("button", { name: "Raw Spec" }));

		expect(
			screen.getAllByText("역할 목록 페이지 기획서").length,
		).toBeGreaterThan(0);
		expect(
			screen.getAllByText("RoleListPage ui 기획서").length,
		).toBeGreaterThan(0);
	});

	it("shows an empty state for stories outside the page manifest", () => {
		render(
			<PagePlanningPanelView
				manifest={manifest}
				storyId="widget-button--default"
			/>,
		);

		expect(screen.getByText("Planning Not Available")).toBeInTheDocument();
	});

	it("shows planning for autodocs entries as well", () => {
		render(
			<PagePlanningPanelView
				manifest={manifest}
				storyId="page-rolelistpage--docs"
			/>,
		);

		expect(
			screen.getByRole("heading", { name: "RoleListPage" }),
		).toBeInTheDocument();
		expect(screen.getByText("Route Planning")).toBeInTheDocument();
	});

	it("renders a compact summary-only variant for inline docks", () => {
		render(
			<PagePlanningPanelView
				manifest={manifest}
				storyId="page-rolelistpage--default"
				variant="compact"
			/>,
		);

		expect(
			screen.queryByRole("button", { name: "Raw Spec" }),
		).not.toBeInTheDocument();
		expect(screen.getByText("Route Planning")).toBeInTheDocument();
	});

	it("renders a board variant with expandable planning cards", () => {
		render(
			<PagePlanningPanelView
				manifest={manifest}
				storyId="page-rolelistpage--default"
				variant="board"
			/>,
		);

		expect(
			screen.queryByRole("button", { name: "Raw Spec" }),
		).not.toBeInTheDocument();
		expect(
			screen.getAllByRole("button", { name: "더 보기" }).length,
		).toBeGreaterThan(0);
		expect(screen.getByText("Route Planning")).toBeInTheDocument();
	});

	it("opens a Codex composer with the connected spec files", async () => {
		const fetchMock = vi.spyOn(globalThis, "fetch").mockResolvedValue(
			new Response(
				JSON.stringify({
					available: true,
					codexVersion: "1.0.0",
					editableTargets: ["spec"],
					ghAuthenticated: true,
					ghVersion: "2.73.0",
					mode: "local-only",
					originUrl: "https://github.com/kimjoongwon/prj-core.git",
					publishBase: "main",
					reason: null,
				}),
				{
					headers: {
						"Content-Type": "application/json",
					},
					status: 200,
				},
			),
		);

		render(
			<PagePlanningPanelView
				manifest={manifest}
				storyId="page-rolelistpage--default"
			/>,
		);

		fireEvent.click(screen.getByRole("button", { name: "Codex로 수정" }));

		expect(
			await screen.findByRole("button", { name: "Codex 실행" }),
		).toBeInTheDocument();
		expect(screen.getByText("page/RoleListPage")).toBeInTheDocument();
		expect(
			screen.getByText("apps/admin/web/src/app/(admin)/roles/page.spec.md"),
		).toBeInTheDocument();

		fetchMock.mockRestore();
	});

	it("shows a restart hint when the Codex bridge endpoint is missing", async () => {
		const fetchMock = vi.spyOn(globalThis, "fetch").mockResolvedValue(
			new Response("Not Found", {
				headers: {
					"Content-Type": "text/plain",
				},
				status: 404,
			}),
		);

		render(
			<PagePlanningPanelView
				manifest={manifest}
				storyId="page-rolelistpage--default"
			/>,
		);

		fireEvent.click(screen.getByRole("button", { name: "Codex로 수정" }));

		expect(
			await screen.findByText(
				"Codex bridge endpoint를 찾지 못했습니다. Storybook dev 서버를 재시작하거나 정적 build가 아닌지 확인하세요.",
			),
		).toBeInTheDocument();

		fetchMock.mockRestore();
	});

	it("shows an HTML response hint when login or redirect HTML is returned", async () => {
		const fetchMock = vi.spyOn(globalThis, "fetch").mockResolvedValue(
			new Response("<!DOCTYPE html><html><body>Login</body></html>", {
				headers: {
					"Content-Type": "text/html",
				},
				status: 200,
			}),
		);

		render(
			<PagePlanningPanelView
				manifest={manifest}
				storyId="page-rolelistpage--default"
			/>,
		);

		fireEvent.click(screen.getByRole("button", { name: "Codex로 수정" }));

		expect(
			await screen.findByText(
				"Codex bridge가 JSON 대신 HTML 응답을 반환했습니다. 로그인 리다이렉트 또는 dev 서버 상태를 확인하세요.",
			),
		).toBeInTheDocument();

		fetchMock.mockRestore();
	});

	it("hides the Codex launcher when the story disables it", () => {
		render(
			<PagePlanningPanelView
				codexEnabled={false}
				manifest={manifest}
				storyId="page-rolelistpage--default"
			/>,
		);

		expect(
			screen.queryByRole("button", { name: "Codex로 수정" }),
		).not.toBeInTheDocument();
	});
});
