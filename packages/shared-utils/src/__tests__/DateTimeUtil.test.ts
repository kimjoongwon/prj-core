import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";
import * as DateTimeUtil from "../DateTimeUtil";

describe("DateTimeUtil", () => {
	describe("getNow", () => {
		beforeEach(() => {
			vi.useFakeTimers();
		});

		afterEach(() => {
			vi.useRealTimers();
		});

		it("should return current date and time in YYYY-MM-DD HH:mm:ss format", () => {
			// Arrange
			const mockDate = new Date("2023-12-25 14:30:45");
			vi.setSystemTime(mockDate);

			// Act
			const result = DateTimeUtil.getNow();

			// Assert
			expect(result).toBe("2023-12-25 14:30:45");
		});

		it("should return different values for different times", () => {
			// Arrange
			const firstDate = new Date("2023-01-01 00:00:00");
			const secondDate = new Date("2023-12-31 23:59:59");

			// Act & Assert
			vi.setSystemTime(firstDate);
			const firstResult = DateTimeUtil.getNow();
			expect(firstResult).toBe("2023-01-01 00:00:00");

			vi.setSystemTime(secondDate);
			const secondResult = DateTimeUtil.getNow();
			expect(secondResult).toBe("2023-12-31 23:59:59");

			expect(firstResult).not.toBe(secondResult);
		});

		it("should handle edge cases like leap year", () => {
			// Arrange
			const leapYearDate = new Date("2024-02-29 12:00:00");
			vi.setSystemTime(leapYearDate);

			// Act
			const result = DateTimeUtil.getNow();

			// Assert
			expect(result).toBe("2024-02-29 12:00:00");
		});

		it("should format single digit months and days with leading zeros", () => {
			// Arrange
			const singleDigitDate = new Date("2023-01-05 09:05:05");
			vi.setSystemTime(singleDigitDate);

			// Act
			const result = DateTimeUtil.getNow();

			// Assert
			expect(result).toBe("2023-01-05 09:05:05");
		});
	});
});
