import { render, screen } from "@testing-library/react";
import { describe, expect, it } from "vitest";
import dayjs from "dayjs";
import { DateCell } from "./DateCell";

describe("DateCell", () => {
	it("renders formatted date string correctly", () => {
		const dateString = "2024-01-15T10:30:00";
		render(<DateCell value={dateString} />);
		const expectedFormat = dayjs(dateString).format("YY.MM.DD HH:mm:ss");
		expect(screen.getByText(expectedFormat)).toBeInTheDocument();
	});

	it("renders formatted Date object correctly", () => {
		const dateObject = new Date("2024-01-15T10:30:00");
		render(<DateCell value={dateObject} />);
		const expectedFormat = dayjs(dateObject).format("YY.MM.DD HH:mm:ss");
		expect(screen.getByText(expectedFormat)).toBeInTheDocument();
	});

	it("renders ISO date string correctly", () => {
		const isoString = "2024-12-25T23:59:59Z";
		render(<DateCell value={isoString} />);
		const expectedFormat = dayjs(isoString).format("YY.MM.DD HH:mm:ss");
		expect(screen.getByText(expectedFormat)).toBeInTheDocument();
	});

	it("renders dash for null value", () => {
		render(<DateCell value={null} />);
		expect(screen.getByText("-")).toBeInTheDocument();
	});

	it("renders dash for undefined value", () => {
		render(<DateCell value={undefined} />);
		expect(screen.getByText("-")).toBeInTheDocument();
	});

	it("renders dash for empty string", () => {
		render(<DateCell value="" />);
		expect(screen.getByText("-")).toBeInTheDocument();
	});

	it("formats date with correct pattern YY.MM.DD HH:mm:ss", () => {
		const testDate = "2024-03-15T14:25:30";
		render(<DateCell value={testDate} />);
		expect(screen.getByText("24.03.15 14:25:30")).toBeInTheDocument();
	});

	it("renders p element with formatted date", () => {
		const dateString = "2024-01-15T10:30:00";
		render(<DateCell value={dateString} />);
		const expectedFormat = dayjs(dateString).format("YY.MM.DD HH:mm:ss");
		const paragraph = screen.getByText(expectedFormat);
		expect(paragraph.tagName).toBe("P");
	});

	it("renders p element for null/undefined values", () => {
		render(<DateCell value={null} />);
		const paragraph = screen.getByText("-");
		expect(paragraph.tagName).toBe("P");
	});
});