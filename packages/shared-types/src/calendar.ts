// Calendar related types
export type ISOString = string;

export interface DateModel {
	value: string;
	selected: boolean;
	selectDate: () => void;
	className?: string;
	isPressable?: boolean;
}

export interface CalendarHeaderProps {
	state: any; // ReturnType<typeof useProps>['state']
}

export interface YearProps {
	state: any; // ReturnType<typeof useProps>['state']
}

export interface DateViewProps {
	dateModel: DateModel;
}

export interface DatesProps {
	state: any; // ReturnType<typeof useProps>['state']
}

export interface DatesViewProps {
	state: any; // ReturnType<typeof useProps>['state']
}

export enum Months {
	January = 0,
	February = 1,
	March = 2,
	April = 3,
	May = 4,
	June = 5,
	July = 6,
	August = 7,
	September = 8,
	October = 9,
	November = 10,
	December = 11,
}

export interface CalendarState {
	calendarInput: {
		header: {
			date: Date;
			increaseMonth: () => void;
			decreaseMonth: () => void;
		};
		dates: any[]; // Using any to avoid DateModel conflicts
	};
}

// Recurring day types
export type RecurringDayOfTheWeek =
	| "MONDAY"
	| "TUESDAY"
	| "WEDNESDAY"
	| "THURSDAY"
	| "FRIDAY"
	| "SATURDAY"
	| "SUNDAY";