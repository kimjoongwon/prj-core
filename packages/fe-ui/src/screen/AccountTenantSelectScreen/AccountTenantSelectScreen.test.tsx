import { render, screen } from "@testing-library/react";
import { describe, expect, it, vi } from "vitest";
import { AccountTenantSelectScreen } from "./AccountTenantSelectScreen";

vi.mock("../../domain/account", () => ({
	AccountTenantSelect: () => <button type="button">Space 선택</button>,
}));

describe("AccountTenantSelectScreen", () => {
	it("안내 문구와 tenant 선택 컴포넌트를 표시한다", () => {
		render(
			<AccountTenantSelectScreen
				eyebrow="Current Space"
				title="작업할 공간을 선택하세요"
				description="선택한 공간은 계정에 저장되어 다음 접속에도 유지됩니다."
			/>,
		);

		expect(screen.getByText("Current Space")).toBeInTheDocument();
		expect(
			screen.getByRole("heading", { name: "작업할 공간을 선택하세요" }),
		).toBeInTheDocument();
		expect(
			screen.getByText(
				"선택한 공간은 계정에 저장되어 다음 접속에도 유지됩니다.",
			),
		).toBeInTheDocument();
		expect(
			screen.getByRole("button", { name: "Space 선택" }),
		).toBeInTheDocument();
	});

	it("선택 카드를 narrow 폭 역할 Container로 감싼다", () => {
		render(
			<AccountTenantSelectScreen
				eyebrow="Current Space"
				title="작업할 공간을 선택하세요"
				description="선택한 공간은 계정에 저장되어 다음 접속에도 유지됩니다."
			/>,
		);

		const cardHeading = screen.getByRole("heading", {
			name: "작업할 공간을 선택하세요",
		});
		const narrowContainer = cardHeading.closest("div.max-w-\\[40rem\\]");
		expect(narrowContainer).not.toBeNull();
		expect(narrowContainer?.className).toContain("mx-auto");
		expect(narrowContainer?.className).toContain("w-full");
	});
});
