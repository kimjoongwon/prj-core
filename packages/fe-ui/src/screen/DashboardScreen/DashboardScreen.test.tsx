import { render, screen } from "@testing-library/react";
import { describe, expect, it } from "vitest";
import { DashboardScreen } from "./DashboardScreen";

describe("DashboardScreen", () => {
	it("대시보드 제목과 통계 카드를 표시한다", () => {
		render(<DashboardScreen />);

		expect(
			screen.getByRole("heading", { name: "대시보드" }),
		).toBeInTheDocument();
		expect(screen.getByText("오늘 예약")).toBeInTheDocument();
		expect(screen.getByText("이번 달 매출")).toBeInTheDocument();
	});

	it("랜딩 콘텐츠를 page 폭 역할 Container로 감싼다", () => {
		render(<DashboardScreen />);

		const pageContainer = screen
			.getByRole("heading", { name: "대시보드" })
			.closest("div.max-w-7xl");
		expect(pageContainer).not.toBeNull();
		expect(pageContainer?.className).toContain("mx-auto");
		expect(pageContainer?.className).toContain("w-full");
	});
});
