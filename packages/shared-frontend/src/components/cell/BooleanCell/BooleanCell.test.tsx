import { render, screen } from "@testing-library/react";
import { describe, expect, it } from "vitest";
import { BooleanCell } from "./BooleanCell";

describe("BooleanCell", () => {
	it("renders '예' for true value", () => {
		render(<BooleanCell value={true} />);
		expect(screen.getByText("예")).toBeInTheDocument();
	});

	it("renders '아니오' for false value", () => {
		render(<BooleanCell value={false} />);
		expect(screen.getByText("아니오")).toBeInTheDocument();
	});

	it("renders dash for null value", () => {
		render(<BooleanCell value={null} />);
		expect(screen.getByText("-")).toBeInTheDocument();
	});

	it("renders dash for undefined value", () => {
		render(<BooleanCell value={undefined} />);
		expect(screen.getByText("-")).toBeInTheDocument();
	});

	it("renders success color chip for true value", () => {
		render(<BooleanCell value={true} />);
		const chip = screen.getByText("예").closest("div");
		expect(chip).toHaveClass("bg-success/20");
	});

	it("renders default color chip for false value", () => {
		render(<BooleanCell value={false} />);
		const chip = screen.getByText("아니오").closest("div");
		expect(chip).toHaveClass("bg-default/40");
	});

	it("renders small size chip", () => {
		render(<BooleanCell value={true} />);
		const chip = screen.getByText("예").closest("div");
		expect(chip).toHaveClass("text-tiny");
	});

	it("renders flat variant chip", () => {
		render(<BooleanCell value={true} />);
		const chip = screen.getByText("예").closest("div");
		expect(chip).toHaveClass("rounded-full");
	});

	it("renders p element for null/undefined values", () => {
		render(<BooleanCell value={null} />);
		const paragraph = screen.getByText("-");
		expect(paragraph.tagName).toBe("P");
	});
});