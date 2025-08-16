import dayjs from "dayjs";
import { range } from "lodash-es";
import { useState, useEffect } from "react";
import { Date as DateComponent } from "./Date/Date";
import { DaysOfWeek } from "./DaysOfWeek/DaysOfWeek";
import { Header } from "./Header/Header";

export interface DateData {
	value: string;
	selected: boolean;
	isPressable: boolean;
	className: string;
}

export interface CalendarProps {
	value: string[];
	onChange: (value: string[]) => void;
}

const DAY_OF_WEEK = 7;
const WEEK_OF_MONTH = 6;

const generateDates = (
	headerDate: Date,
	selectedValues: string[] = [],
): DateData[] => {
	const currentMonth = dayjs(headerDate);
	const startDay = currentMonth.startOf("month").day();
	const endDate = currentMonth.endOf("month").date();

	const prevMonth = currentMonth.subtract(1, "month");
	const nextMonth = currentMonth.add(1, "month");
	const prevMonthEnd = prevMonth.endOf("month").date();

	const prevMonthRange = range(prevMonthEnd - startDay, prevMonthEnd);
	const currentMonthRange = range(1, endDate + 1);
	const nextMonthRange = range(
		1,
		DAY_OF_WEEK * WEEK_OF_MONTH -
			(prevMonthRange.length + currentMonthRange.length) +
			1,
	);

	const createDateModel = (
		date: Date,
		type: "prev" | "current" | "next",
	): DateData => ({
		value: date.toISOString(),
		selected: selectedValues.some((value) => dayjs(value).isSame(date, "date")),
		isPressable: type === "current",
		className: type === "current" ? "text-black" : "text-gray-400",
	});

	const prevMonthDates = prevMonthRange.map((day) =>
		createDateModel(prevMonth.set("date", day).toDate(), "prev"),
	);

	const currentMonthDates = currentMonthRange.map((day) =>
		createDateModel(currentMonth.set("date", day).toDate(), "current"),
	);

	const nextMonthDates = nextMonthRange.map((day) =>
		createDateModel(nextMonth.set("date", day).toDate(), "next"),
	);

	return [...prevMonthDates, ...currentMonthDates, ...nextMonthDates];
};

export const Calendar = (props: CalendarProps) => {
	const { value, onChange } = props;

	// Calendar state management
	const [headerDate, setHeaderDate] = useState(dayjs().startOf("d").toDate());
	const [dates, setDates] = useState<DateData[]>([]);

	// Update dates when value or headerDate changes
	useEffect(() => {
		setDates(generateDates(headerDate, value));
	}, [value, headerDate]);

	// Handler functions
	const handlePrevMonth = () => {
		setHeaderDate(dayjs(headerDate).subtract(1, "M").toDate());
	};

	const handleNextMonth = () => {
		setHeaderDate(dayjs(headerDate).add(1, "M").toDate());
	};

	const handleDateClick = (dateValue: string) => {
		const isSelected = value.some((v) => dayjs(v).isSame(dateValue, "date"));
		let newValue: string[];

		if (isSelected) {
			newValue = value.filter((v) => !dayjs(v).isSame(dateValue, "date"));
		} else {
			newValue = [...value, dateValue];
		}

		onChange(newValue);
	};

	const displayYear = headerDate.getFullYear();
	const displayMonth = headerDate.getMonth() + 1;

	return (
		<div className="w-full">
			<Header
				year={displayYear}
				month={displayMonth}
				onPrevMonth={handlePrevMonth}
				onNextMonth={handleNextMonth}
			/>
			<div className="grid grid-cols-7 grid-rows-7 gap-1">
				<DaysOfWeek />
				{dates.map((date, idx) => (
					<DateComponent
						key={date.value ?? idx}
						value={date.value}
						selected={date.selected}
						isPressable={date.isPressable}
						className={date.className}
						onDateClick={handleDateClick}
					/>
				))}
			</div>
		</div>
	);
};
