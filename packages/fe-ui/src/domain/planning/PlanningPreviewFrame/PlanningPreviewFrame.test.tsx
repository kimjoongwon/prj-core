import type { PlanningScenario } from "@cocrepo/type";
import { fireEvent, render, screen } from "@testing-library/react";
import { describe, expect, it, vi } from "vitest";
import { PlanningPreviewFrame } from "./PlanningPreviewFrame";

const baseScenario = {
	id: "planning-preview.test",
	title: "사용자 상세 기획",
	description: "기획 검수용 프레임입니다.",
	routePath: "/users/301",
	owner: "admin-web / fe-ui",
	status: "ready-for-review",
	context: {
		realm: "admin",
		authState: "authenticated",
		account: {
			id: "501",
			name: "기획 담당자",
			email: "planner@example.com",
			role: "SPACE_MANAGER",
		},
		role: "SPACE_MANAGER",
		tenantId: "101",
		spaceId: "201",
		fitnessCenterName: "F45 강남1호",
		spaces: [
			{
				tenantId: "101",
				spaceId: "201",
				fitnessCenterName: "F45 강남1호",
			},
			{
				tenantId: "102",
				spaceId: "202",
				fitnessCenterName: "스포애니 홍대",
			},
		],
		abilities: ["read:user"],
		locale: "ko-KR",
		viewport: "desktop",
	},
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
				tenantId: "102",
				spaceId: "202",
			}),
		);
		expect(screen.getByRole("button", { name: /스포애니 홍대/ })).toBeTruthy();
	});

	it("Given 시나리오가 있을 때, When 프레임을 렌더링하면, Then preview 영역을 표시한다", () => {
		render(
			<PlanningPreviewFrame scenario={baseScenario}>
				<div>Rendered screen</div>
			</PlanningPreviewFrame>,
		);

		expect(screen.getByText("Rendered screen")).toBeTruthy();
		expect(screen.queryByRole("heading", { name: "Planning" })).toBeNull();
		expect(screen.queryByRole("heading", { name: "Context" })).toBeNull();
		expect(screen.queryByRole("heading", { name: "Acceptance" })).toBeNull();
	});
});
