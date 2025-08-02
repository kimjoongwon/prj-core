import { render, screen } from "@testing-library/react";
import { describe, expect, it, beforeEach } from "vitest";
import { NumberCell } from "./NumberCell";

describe("NumberCell", () => {
	beforeEach(() => {
		// Clean up after each test
		document.body.innerHTML = "";
	});

	describe("number formatting", () => {
		it("renders integer correctly with locale formatting", () => {
			render(<NumberCell value={1234} />);
			expect(screen.getByText("1,234")).toBeInTheDocument();
		});

		it("renders large number with locale formatting", () => {
			render(<NumberCell value={1234567890} />);
			expect(screen.getByText("1,234,567,890")).toBeInTheDocument();
		});

		it("renders decimal number correctly", () => {
			render(<NumberCell value={123.45} />);
			expect(screen.getByText("123.45")).toBeInTheDocument();
		});

		it("renders zero correctly", () => {
			render(<NumberCell value={0} />);
			expect(screen.getByText("0")).toBeInTheDocument();
		});

		it("renders negative number correctly", () => {
			render(<NumberCell value={-123456} />);
			expect(screen.getByText("-123,456")).toBeInTheDocument();
		});

		it("handles very small decimal numbers", () => {
			render(<NumberCell value={0.001} />);
			expect(screen.getByText("0.001")).toBeInTheDocument();
		});

		it("handles scientific notation", () => {
			render(<NumberCell value={1e6} />);
			expect(screen.getByText("1,000,000")).toBeInTheDocument();
		});
	});

	describe("string number handling", () => {
		it("renders string number correctly", () => {
			render(<NumberCell value="9876543" />);
			expect(screen.getByText("9,876,543")).toBeInTheDocument();
		});

		it("handles string with decimal correctly", () => {
			render(<NumberCell value="456.78" />);
			expect(screen.getByText("456.78")).toBeInTheDocument();
		});
	});

	describe("edge cases", () => {
		it("renders dash for null value", () => {
			render(<NumberCell value={null} />);
			expect(screen.getByText("-")).toBeInTheDocument();
		});

		it("renders dash for undefined value", () => {
			render(<NumberCell value={undefined} />);
			expect(screen.getByText("-")).toBeInTheDocument();
		});

		it("renders dash for invalid string", () => {
			render(<NumberCell value="not a number" />);
			expect(screen.getByText("-")).toBeInTheDocument();
		});

		it("renders dash for empty string", () => {
			render(<NumberCell value="" />);
			expect(screen.getByText("-")).toBeInTheDocument();
		});
	});

	describe("DOM structure", () => {
		it("renders p element with formatted number", () => {
			render(<NumberCell value={1234} />);
			const paragraph = screen.getByText("1,234");
			expect(paragraph.tagName).toBe("P");
		});

		it("renders p element for null/undefined/invalid values", () => {
			render(<NumberCell value={null} />);
			const paragraph = screen.getByText("-");
			expect(paragraph.tagName).toBe("P");
		});
	});
});
