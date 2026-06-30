import type { PlanningScenario } from "@cocrepo/type";
import { fireEvent, render, screen } from "@testing-library/react";
import { describe, expect, it, vi } from "vitest";
import { PlanningPreviewFrame } from "./PlanningPreviewFrame";

const baseScenario = {
	id: "planning-preview.test",
	title: "사용자 상세 기획",
	description: "기획 검수용 프레임입니다.",
	routePath: "/users/storybook-user",
	owner: "admin-web / fe-ui",
	status: "ready-for-review",
	context: {
		realm: "admin",
		authState: "authenticated",
		account: {
			id: "planner",
			name: "기획 담당자",
			email: "planner@example.com",
			role: "SPACE_MANAGER",
		},
		role: "SPACE_MANAGER",
		tenantId: "tenant-gangnam",
		spaceId: "space-gangnam",
		groundName: "강남 스페이스",
		spaces: [
			{
				tenantId: "tenant-gangnam",
				spaceId: "space-gangnam",
				groundName: "강남 스페이스",
			},
			{
				tenantId: "tenant-hongdae",
				spaceId: "space-hongdae",
				groundName: "홍대 스페이스",
			},
		],
		abilities: ["read:user"],
		locale: "ko-KR",
		viewport: "desktop",
	},
	api: {
		name: "user-detail-ready",
		mode: "msw",
		requests: [
			{
				method: "GET",
				path: "/admin/users/storybook-user",
				status: 200,
				description: "사용자 상세 정보를 반환합니다.",
			},
		],
	},
	acceptance: [{ label: "사용자 기본 정보가 보인다" }],
	notes: ["개인 Policy 할당 제거 이후 정보 구조를 검토합니다."],
} satisfies PlanningScenario;

describe("PlanningPreviewFrame", () => {
	it("renders the mock session bar and preview content", () => {
		render(
			<PlanningPreviewFrame scenario={baseScenario}>
				<div>Rendered screen</div>
			</PlanningPreviewFrame>,
		);

		expect(screen.getByLabelText("Storybook mock session")).toBeTruthy();
		expect(screen.getByText("Mock 로그인")).toBeTruthy();
		expect(screen.getByText("기획 담당자")).toBeTruthy();
		expect(screen.getByText("Rendered screen")).toBeTruthy();
	});

	it("updates the local tenant selection and notifies the story callback", async () => {
		const onSpaceChange = vi.fn();

		render(
			<PlanningPreviewFrame
				scenario={baseScenario}
				onSpaceChange={onSpaceChange}
			>
				<div>Rendered screen</div>
			</PlanningPreviewFrame>,
		);

		fireEvent.click(screen.getByRole("button", { name: /강남 스페이스/ }));
		fireEvent.click(await screen.findByText("홍대 스페이스"));

		expect(onSpaceChange).toHaveBeenCalledWith(
			expect.objectContaining({
				tenantId: "tenant-hongdae",
				spaceId: "space-hongdae",
			}),
		);
		expect(screen.getByRole("button", { name: /홍대 스페이스/ })).toBeTruthy();
	});

	it("renders notes, acceptance, and API request summaries", () => {
		render(
			<PlanningPreviewFrame scenario={baseScenario}>
				<div>Rendered screen</div>
			</PlanningPreviewFrame>,
		);

		expect(screen.getByText("사용자 기본 정보가 보인다")).toBeTruthy();
		expect(
			screen.getByText("개인 Policy 할당 제거 이후 정보 구조를 검토합니다."),
		).toBeTruthy();
		expect(screen.getByText("GET /admin/users/storybook-user")).toBeTruthy();
		expect(screen.getByText("status 200")).toBeTruthy();
	});
});
