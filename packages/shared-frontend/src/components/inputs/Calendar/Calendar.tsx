import dayjs from "dayjs";
import { range } from "lodash-es";
import { makeObservable, observable, action } from "mobx";
import { observer, useLocalObservable } from "mobx-react-lite";
import { useEffect } from "react";
import { Date as DateComponent } from "./Date/Date";
import { DaysOfWeek } from "./DaysOfWeek";
import { Header } from "./Header";

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

export class CalendarState {
	headerDate = dayjs().startOf("d").toDate();
	dates: DateData[] = [];

	constructor() {
		makeObservable(this, {
			headerDate: observable,
			dates: observable,
			handlePrevMonth: action,
			handleNextMonth: action,
			generateDates: action,
		});
	}

	handlePrevMonth = () => {
		this.headerDate = dayjs(this.headerDate).subtract(1, "M").toDate();
		this.generateDates();
	};

	handleNextMonth = () => {
		this.headerDate = dayjs(this.headerDate).add(1, "M").toDate();
		this.generateDates();
	};

	generateDates = (selectedValues: string[] = []) => {
		const currentMonth = dayjs(this.headerDate);
		const startDay = currentMonth.startOf("month").day();
		const endDate = currentMonth.endOf("month").date();

		const prevMonth = currentMonth.subtract(1, "month");
		const nextMonth = currentMonth.add(1, "month");
		const prevMonthEnd = prevMonth.endOf("month").date();

		const prevMonthRange = range(prevMonthEnd - startDay, prevMonthEnd);
		const currentMonthRange = range(1, endDate + 1);
		const nextMonthRange = range(1, DAY_OF_WEEK * WEEK_OF_MONTH - (prevMonthRange.length + currentMonthRange.length) + 1);

		const createDateModel = (date: Date, type: "prev" | "current" | "next"): DateData => ({
			value: date.toISOString(),
			selected: selectedValues.some(value => dayjs(value).isSame(date, "date")),
			isPressable: type === "current",
			className: type === "current" ? "text-black" : "text-gray-400",
		});

		const prevMonthDates = prevMonthRange.map(day =>
			createDateModel(prevMonth.set("date", day).toDate(), "prev")
		);

		const currentMonthDates = currentMonthRange.map(day =>
			createDateModel(currentMonth.set("date", day).toDate(), "current")
		);

		const nextMonthDates = nextMonthRange.map(day =>
			createDateModel(nextMonth.set("date", day).toDate(), "next")
		);

		this.dates = [...prevMonthDates, ...currentMonthDates, ...nextMonthDates];
	};

	get displayYear() {
		return this.headerDate.getFullYear();
	}

	get displayMonth() {
		return this.headerDate.getMonth() + 1;
	}

	get uiDates(): DateData[] {
		return this.dates;
	}
}

export const Calendar = observer((props: CalendarProps) => {
	const { value, onChange } = props;

	// Calendar state management
	const localState = useLocalObservable(() => {
		const calendarState = new CalendarState();
		calendarState.generateDates(value);
		return calendarState;
	});

	// Update dates when value changes
	useEffect(() => {
		localState.generateDates(value);
	}, [value, localState]);

	// Handler functions
	const handlePrevMonth = () => {
		localState.handlePrevMonth();
		localState.generateDates(value);
	};

	const handleNextMonth = () => {
		localState.handleNextMonth();
		localState.generateDates(value);
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

	return (
		<div className="w-full">
			<Header
				year={localState.displayYear}
				month={localState.displayMonth}
				onPrevMonth={handlePrevMonth}
				onNextMonth={handleNextMonth}
			/>
			<div className="grid grid-cols-7 grid-rows-7 gap-1">
				<DaysOfWeek />
				{localState.uiDates.map((date, idx) => (
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
},
);
