import { describe, it, expect } from "vitest";
import { render, screen } from "@testing-library/react";
import { AssetKindBadge } from "../AssetKindBadge/AssetKindBadge";

describe("AssetKindBadge", () => {
	describe("렌더링", () => {
		it("IMAGE 종류일 때 '이미지' 라벨로 렌더링되어야 한다", () => {
			// Given
			const kind = "IMAGE";

			// When
			render(<AssetKindBadge kind={kind} />);

			// Then
			expect(screen.getByText("이미지")).toBeInTheDocument();
		});

		it("VIDEO 종류일 때 '비디오' 라벨로 렌더링되어야 한다", () => {
			// Given
			const kind = "VIDEO";

			// When
			render(<AssetKindBadge kind={kind} />);

			// Then
			expect(screen.getByText("비디오")).toBeInTheDocument();
		});

		it("DOCUMENT 종류일 때 '문서' 라벨로 렌더링되어야 한다", () => {
			// Given
			const kind = "DOCUMENT";

			// When
			render(<AssetKindBadge kind={kind} />);

			// Then
			expect(screen.getByText("문서")).toBeInTheDocument();
		});
	});

	describe("className prop", () => {
		it("추가 className이 적용되어야 한다", () => {
			// Given
			const kind = "IMAGE";
			const customClass = "custom-class";

			// When
			render(<AssetKindBadge kind={kind} className={customClass} />);

			// Then
			const badge = screen.getByText("이미지").closest(".custom-class");
			expect(badge).toBeInTheDocument();
		});
	});
});
