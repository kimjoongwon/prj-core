import { describe, it, expect } from "vitest";
import { render, screen } from "@testing-library/react";
import { AssetStatusBadge } from "../AssetStatusBadge/AssetStatusBadge";

describe("AssetStatusBadge", () => {
	describe("렌더링", () => {
		it("UPLOADING 상태일 때 '업로드중' 라벨과 warning 색상으로 렌더링되어야 한다", () => {
			// Given
			const status = "UPLOADING";

			// When
			render(<AssetStatusBadge status={status} />);

			// Then
			expect(screen.getByText("업로드중")).toBeInTheDocument();
		});

		it("READY 상태일 때 '준비완료' 라벨과 success 색상으로 렌더링되어야 한다", () => {
			// Given
			const status = "READY";

			// When
			render(<AssetStatusBadge status={status} />);

			// Then
			expect(screen.getByText("준비완료")).toBeInTheDocument();
		});

		it("FAILED 상태일 때 '실패' 라벨과 danger 색상으로 렌더링되어야 한다", () => {
			// Given
			const status = "FAILED";

			// When
			render(<AssetStatusBadge status={status} />);

			// Then
			expect(screen.getByText("실패")).toBeInTheDocument();
		});
	});

	describe("className prop", () => {
		it("추가 className이 적용되어야 한다", () => {
			// Given
			const status = "READY";
			const customClass = "custom-class";

			// When
			render(<AssetStatusBadge status={status} className={customClass} />);

			// Then
			const badge = screen.getByText("준비완료").closest(".custom-class");
			expect(badge).toBeInTheDocument();
		});
	});
});
