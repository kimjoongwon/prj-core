import { render, screen } from "@testing-library/react";
import { describe, expect, it } from "vitest";
import { AdminCopyrightFooter } from "./AdminCopyrightFooter";

describe("AdminCopyrightFooter", () => {
	it("저작권 푸터를 렌더링하면 회사와 사업자 안내 정보를 표시한다", () => {
		render(<AdminCopyrightFooter />);

		expect(screen.getByText("© 2026 Plate Labs Inc.")).toBeVisible();
		expect(screen.getByText("All rights reserved.")).toBeVisible();
		expect(screen.getByText("대표 김중원")).toBeVisible();
		expect(screen.getByText("사업자등록번호 123-45-67890")).toBeVisible();
		expect(
			screen.getByText("서울특별시 성동구 성수이로 88, 8층"),
		).toBeVisible();
		expect(
			screen.getByRole("link", { name: "support@plate.example" }),
		).toHaveAttribute("href", "mailto:support@plate.example");
	});
});
