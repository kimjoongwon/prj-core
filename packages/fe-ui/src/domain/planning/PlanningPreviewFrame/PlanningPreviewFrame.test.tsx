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
		fitnessCenterName: "F45 강남1호",
		spaces: [
			{
				tenantId: "tenant-gangnam",
				spaceId: "space-gangnam",
				fitnessCenterName: "F45 강남1호",
			},
			{
				tenantId: "tenant-hongdae",
				spaceId: "space-hongdae",
				fitnessCenterName: "스포애니 홍대",
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
	notes: ["개인 Policy 할당 제거 이후 정보 구조를 검토합니다."],
} satisfies PlanningScenario;

describe("PlanningPreviewFrame", () => {
	it("Given 로그인된 기획 시나리오가 있을 때, When 프레임을 렌더링하면, Then mock session과 preview 내용을 표시한다", () => {
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

	it("Given 여러 피트니스센터를 선택할 수 있을 때, When 다른 센터를 선택하면, Then 로컬 선택과 story callback을 갱신한다", async () => {
		const onSpaceChange = vi.fn();

		render(
			<PlanningPreviewFrame
				scenario={baseScenario}
				onSpaceChange={onSpaceChange}
			>
				<div>Rendered screen</div>
			</PlanningPreviewFrame>,
		);

		fireEvent.click(screen.getByRole("button", { name: /F45 강남1호/ }));
		fireEvent.click(
			await screen.findByRole("option", { name: "스포애니 홍대" }),
		);

		expect(onSpaceChange).toHaveBeenCalledWith(
			expect.objectContaining({
				tenantId: "tenant-hongdae",
				spaceId: "space-hongdae",
			}),
		);
		expect(screen.getByRole("button", { name: /스포애니 홍대/ })).toBeTruthy();
	});

	it("Given notes와 API 요청이 있는 시나리오일 때, When 프레임을 렌더링하면, Then 별도 metadata 패널 없이 요약을 표시한다", () => {
		render(
			<PlanningPreviewFrame scenario={baseScenario}>
				<div>Rendered screen</div>
			</PlanningPreviewFrame>,
		);

		expect(
			screen.getByText("개인 Policy 할당 제거 이후 정보 구조를 검토합니다."),
		).toBeTruthy();
		expect(screen.getByText("GET /admin/users/storybook-user")).toBeTruthy();
		expect(screen.getByText("status 200")).toBeTruthy();
		expect(screen.queryByRole("heading", { name: "Planning" })).toBeNull();
		expect(screen.queryByRole("heading", { name: "Context" })).toBeNull();
		expect(screen.queryByRole("heading", { name: "Acceptance" })).toBeNull();
	});
});
