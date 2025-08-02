import { render, screen } from "@testing-library/react";
import { describe, expect, it } from "vitest";
import { DefaultCell } from "./DefaultCell";

describe("DefaultCell", () => {
	it("renders string value correctly", () => {
		render(<DefaultCell value="Test string" />);
		expect(screen.getByText("Test string")).toBeInTheDocument();
	});

	it("renders number value correctly", () => {
		render(<DefaultCell value={42} />);
		expect(screen.getByText("42")).toBeInTheDocument();
	});

	it("renders zero value correctly", () => {
		render(<DefaultCell value={0} />);
		expect(screen.getByText("0")).toBeInTheDocument();
	});

	it("renders dash for empty string", () => {
		render(<DefaultCell value="" />);
		expect(screen.getByText("-")).toBeInTheDocument();
	});

	it("converts number to string", () => {
		render(<DefaultCell value={123.45} />);
		expect(screen.getByText("123.45")).toBeInTheDocument();
	});

	it("renders long text correctly", () => {
		const longText = "This is a very long text that might wrap to multiple lines";
		render(<DefaultCell value={longText} />);
		expect(screen.getByText(longText)).toBeInTheDocument();
	});

	it("renders p element with correct content", () => {
		render(<DefaultCell value="Test content" />);
		const paragraph = screen.getByText("Test content");
		expect(paragraph.tagName).toBe("P");
	});
});