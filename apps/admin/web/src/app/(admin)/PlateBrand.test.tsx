import { render, screen } from "@testing-library/react";
import { describe, expect, it } from "vitest";
import { PlateBrand } from "./PlateBrand";

describe("PlateBrand", () => {
	it("Plate 브랜드를 렌더링하면 관리자 홈 링크와 로고 이미지를 표시한다", () => {
		render(<PlateBrand />);

		const homeLink = screen.getByRole("link", { name: "Plate 관리자 홈" });
		const logoImage = homeLink.querySelector("img");

		expect(homeLink).toHaveAttribute("href", "/dashboard");
		expect(homeLink).toHaveTextContent("Plate");
		expect(homeLink).not.toHaveTextContent("Operations");
		expect(logoImage).toHaveAttribute("src", "/admin/brand/plate-mark.svg");
	});
});
