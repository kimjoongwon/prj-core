import { describe, it, expect } from "vitest";
import { render, screen } from "@testing-library/react";
import { SizeDisplay } from "../SizeDisplay/SizeDisplay";

describe("SizeDisplay", () => {
	describe("렌더링", () => {
		it("0 바이트일 때 '0 B'를 표시해야 한다", () => {
			// Given
			const bytes = 0;

			// When
			render(<SizeDisplay bytes={bytes} />);

			// Then
			expect(screen.getByText("0 B")).toBeInTheDocument();
		});

		it("바이트 단위일 때 'B' 단위로 표시해야 한다", () => {
			// Given
			const bytes = 512;

			// When
			render(<SizeDisplay bytes={bytes} />);

			// Then
			expect(screen.getByText("512 B")).toBeInTheDocument();
		});

		it("킬로바이트 단위일 때 'KB' 단위로 표시해야 한다", () => {
			// Given
			const bytes = 1536; // 1.5 KB

			// When
			render(<SizeDisplay bytes={bytes} />);

			// Then
			expect(screen.getByText("1.5 KB")).toBeInTheDocument();
		});

		it("메가바이트 단위일 때 'MB' 단위로 표시해야 한다", () => {
			// Given
			const bytes = 1572864; // 1.5 MB

			// When
			render(<SizeDisplay bytes={bytes} />);

			// Then
			expect(screen.getByText("1.5 MB")).toBeInTheDocument();
		});

		it("기가바이트 단위일 때 'GB' 단위로 표시해야 한다", () => {
			// Given
			const bytes = 1610612736; // 1.5 GB

			// When
			render(<SizeDisplay bytes={bytes} />);

			// Then
			expect(screen.getByText("1.5 GB")).toBeInTheDocument();
		});

		it("테라바이트 단위일 때 'TB' 단위로 표시해야 한다", () => {
			// Given
			const bytes = 1649267441664; // 1.5 TB

			// When
			render(<SizeDisplay bytes={bytes} />);

			// Then
			expect(screen.getByText("1.5 TB")).toBeInTheDocument();
		});

		it("페타바이트 단위일 때 'PB' 단위로 표시해야 한다", () => {
			// Given
			const bytes = 1688849860263936; // 1.5 PB

			// When
			render(<SizeDisplay bytes={bytes} />);

			// Then
			expect(screen.getByText("1.5 PB")).toBeInTheDocument();
		});
	});

	describe("decimals prop", () => {
		it("decimals가 0일 때 소수점 없이 표시해야 한다", () => {
			// Given
			const bytes = 1536;
			const decimals = 0;

			// When
			render(<SizeDisplay bytes={bytes} decimals={decimals} />);

			// Then
			expect(screen.getByText("2 KB")).toBeInTheDocument();
		});

		it("decimals가 2일 때 소수점 둘째 자리까지 표시해야 한다", () => {
			// Given
			const bytes = 1536;
			const decimals = 2;

			// When
			render(<SizeDisplay bytes={bytes} decimals={decimals} />);

			// Then
			expect(screen.getByText("1.5 KB")).toBeInTheDocument();
		});

		it("decimals가 음수일 때 0으로 처리해야 한다", () => {
			// Given
			const bytes = 1536;
			const decimals = -1;

			// When
			render(<SizeDisplay bytes={bytes} decimals={decimals} />);

			// Then
			expect(screen.getByText("2 KB")).toBeInTheDocument();
		});
	});

	describe("className prop", () => {
		it("추가 className이 적용되어야 한다", () => {
			// Given
			const bytes = 1024;
			const customClass = "text-xs";

			// When
			render(<SizeDisplay bytes={bytes} className={customClass} />);

			// Then
			const element = screen.getByText("1 KB");
			expect(element).toHaveClass("text-xs");
		});
	});
});
