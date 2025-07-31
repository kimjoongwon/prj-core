import dayjs from "dayjs";
import { beforeEach, describe, expect, it } from "vitest";
import { CalendarState } from "./Calendar";

describe("CalendarState", () => {
	let calendarState: CalendarState;

	beforeEach(() => {
		calendarState = new CalendarState();
		// 테스트용 고정 날짜 설정 (2024년 1월)
		calendarState.headerDate = dayjs("2024-01-15").toDate();
	});

	describe("초기 상태", () => {
		it("headerDate가 올바르게 설정되어야 한다", () => {
			expect(calendarState.headerDate).toBeInstanceOf(Date);
		});

		it("dates 배열이 초기화되어야 한다", () => {
			expect(Array.isArray(calendarState.dates)).toBe(true);
		});

		it("displayYear가 올바른 연도를 반환해야 한다", () => {
			expect(calendarState.displayYear).toBe(2024);
		});

		it("displayMonth가 올바른 월을 반환해야 한다", () => {
			expect(calendarState.displayMonth).toBe(1);
		});
	});

	describe("월 네비게이션", () => {
		it("handlePrevMonth가 이전 달로 이동해야 한다", () => {
			const initialMonth = calendarState.displayMonth;
			calendarState.handlePrevMonth();

			expect(calendarState.displayMonth).toBe(
				initialMonth === 1 ? 12 : initialMonth - 1,
			);
		});

		it("handleNextMonth가 다음 달로 이동해야 한다", () => {
			const initialMonth = calendarState.displayMonth;
			calendarState.handleNextMonth();

			expect(calendarState.displayMonth).toBe(
				initialMonth === 12 ? 1 : initialMonth + 1,
			);
		});

		it("12월에서 이전 달로 이동하면 연도가 변경되어야 한다", () => {
			calendarState.headerDate = dayjs("2024-01-15").toDate();
			calendarState.handlePrevMonth();

			expect(calendarState.displayYear).toBe(2023);
			expect(calendarState.displayMonth).toBe(12);
		});

		it("1월에서 다음 달로 이동하면 연도가 변경되어야 한다", () => {
			calendarState.headerDate = dayjs("2023-12-15").toDate();
			calendarState.handleNextMonth();

			expect(calendarState.displayYear).toBe(2024);
			expect(calendarState.displayMonth).toBe(1);
		});
	});

	describe("날짜 생성", () => {
		beforeEach(() => {
			calendarState.generateDates();
		});

		it("총 42개의 날짜가 생성되어야 한다 (7일 × 6주)", () => {
			expect(calendarState.dates).toHaveLength(42);
		});

		it("현재 월의 날짜들이 isPressable=true여야 한다", () => {
			const currentMonthDates = calendarState.dates.filter(
				(date) => date.isPressable,
			);
			expect(currentMonthDates.length).toBeGreaterThan(0);

			currentMonthDates.forEach((date) => {
				const dateObj = new Date(date.value);
				expect(dateObj.getMonth()).toBe(0); // 1월은 0
			});
		});

		it("이전/다음 월의 날짜들이 isPressable=false여야 한다", () => {
			const otherMonthDates = calendarState.dates.filter(
				(date) => !date.isPressable,
			);
			expect(otherMonthDates.length).toBeGreaterThan(0);

			otherMonthDates.forEach((date) => {
				expect(date.className).toBe("text-gray-400");
			});
		});

		it("현재 월의 날짜들이 올바른 클래스를 가져야 한다", () => {
			const currentMonthDates = calendarState.dates.filter(
				(date) => date.isPressable,
			);

			currentMonthDates.forEach((date) => {
				expect(date.className).toBe("text-black");
			});
		});
	});

	describe("선택된 날짜 처리", () => {
		it("선택된 날짜가 올바르게 표시되어야 한다", () => {
			const selectedDate = "2024-01-15T00:00:00.000Z";
			calendarState.generateDates([selectedDate]);

			const selectedDateItem = calendarState.dates.find((date) =>
				dayjs(date.value).isSame(selectedDate, "date"),
			);

			expect(selectedDateItem?.selected).toBe(true);
		});

		it("여러 날짜가 선택된 경우 모두 표시되어야 한다", () => {
			const selectedDates = [
				"2024-01-15T00:00:00.000Z",
				"2024-01-20T00:00:00.000Z",
			];
			calendarState.generateDates(selectedDates);

			const selectedItems = calendarState.dates.filter((date) => date.selected);
			expect(selectedItems).toHaveLength(2);
		});

		it("선택되지 않은 날짜는 selected=false여야 한다", () => {
			calendarState.generateDates(["2024-01-15T00:00:00.000Z"]);

			const unselectedItems = calendarState.dates.filter(
				(date) => !date.selected,
			);
			expect(unselectedItems.length).toBe(41); // 42 - 1
		});
	});

	describe("uiDates getter", () => {
		it("dates와 동일한 데이터를 반환해야 한다", () => {
			calendarState.generateDates();

			expect(calendarState.uiDates).toEqual(calendarState.dates);
		});

		it("각 날짜 객체가 필요한 속성들을 가져야 한다", () => {
			calendarState.generateDates();

			calendarState.uiDates.forEach((date) => {
				expect(date).toHaveProperty("value");
				expect(date).toHaveProperty("selected");
				expect(date).toHaveProperty("isPressable");
				expect(date).toHaveProperty("className");
				expect(typeof date.value).toBe("string");
				expect(typeof date.selected).toBe("boolean");
				expect(typeof date.isPressable).toBe("boolean");
				expect(typeof date.className).toBe("string");
			});
		});
	});

	describe("MobX actions 테스트", () => {
		it("handlePrevMonth 호출 시 generateDates가 자동으로 호출되어야 한다", () => {
			calendarState.handlePrevMonth();

			// generateDates가 호출되어 dates가 채워져야 함
			expect(calendarState.dates.length).toBe(42);
		});

		it("handleNextMonth 호출 시 generateDates가 자동으로 호출되어야 한다", () => {
			calendarState.handleNextMonth();

			// generateDates가 호출되어 dates가 채워져야 함
			expect(calendarState.dates.length).toBe(42);
		});
	});
});
