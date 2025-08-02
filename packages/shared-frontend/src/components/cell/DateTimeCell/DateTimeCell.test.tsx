import { render, screen } from "@testing-library/react";
import { describe, expect, it } from "vitest";
import dayjs from "dayjs";
import { DateTimeCell } from "./DateTimeCell";

describe("DateTimeCell", () => {
	it("renders formatted date string correctly", () => {
		const dateString = "2024-01-15T10:30:00";
		render(<DateTimeCell value={dateString} />);
		const expectedFormat = dayjs(dateString).format("YYYY.MM.DD HH:mm");
		expect(screen.getByText(expectedFormat)).toBeInTheDocument();
	});

	it("renders formatted Date object correctly", () => {
		const dateObject = new Date("2024-01-15T10:30:00");
		render(<DateTimeCell value={dateObject} />);
		const expectedFormat = dayjs(dateObject).format("YYYY.MM.DD HH:mm");
		expect(screen.getByText(expectedFormat)).toBeInTheDocument();
	});

	it("renders ISO date string correctly", () => {
		const isoString = "2024-12-25T23:59:59Z";
		render(<DateTimeCell value={isoString} />);
		const expectedFormat = dayjs(isoString).format("YYYY.MM.DD HH:mm");
		expect(screen.getByText(expectedFormat)).toBeInTheDocument();
	});

	it("renders dash for null value", () => {
		render(<DateTimeCell value={null} />);
		expect(screen.getByText("-")).toBeInTheDocument();
	});

	it("renders dash for undefined value", () => {
		render(<DateTimeCell value={undefined} />);
		expect(screen.getByText("-")).toBeInTheDocument();
	});

	it("renders dash for empty string", () => {
		render(<DateTimeCell value="" />);
		expect(screen.getByText("-")).toBeInTheDocument();
	});

	it("formats date with correct pattern YYYY.MM.DD HH:mm", () => {
		const testDate = "2024-03-15T14:25:30";
		render(<DateTimeCell value={testDate} />);
		expect(screen.getByText("2024.03.15 14:25")).toBeInTheDocument();
	});

	it("handles morning time correctly", () => {
		const morningTime = "2024-01-15T06:30:00";
		render(<DateTimeCell value={morningTime} />);
		expect(screen.getByText("2024.01.15 06:30")).toBeInTheDocument();
	});

	it("handles evening time correctly", () => {
		const eveningTime = "2024-01-15T18:45:00";
		render(<DateTimeCell value={eveningTime} />);
		expect(screen.getByText("2024.01.15 18:45")).toBeInTheDocument();
	});

	it("renders p element with formatted datetime", () => {
		const dateString = "2024-01-15T10:30:00";
		render(<DateTimeCell value={dateString} />);
		const expectedFormat = dayjs(dateString).format("YYYY.MM.DD HH:mm");
		const paragraph = screen.getByText(expectedFormat);
		expect(paragraph.tagName).toBe("P");
	});

	it("renders p element for null/undefined values", () => {
		render(<DateTimeCell value={null} />);
		const paragraph = screen.getByText("-");
		expect(paragraph.tagName).toBe("P");
	});
});