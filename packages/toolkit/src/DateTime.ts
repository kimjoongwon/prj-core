import dayjs from "dayjs";

export function getNow(): string {
	return dayjs().format("YYYY-MM-DD HH:mm:ss");
}

// Date formatting utilities
export function formatDate(
	date: string | Date,
	format: string = "YYYY.MM.DD",
): string {
	return dayjs(date).format(format);
}

export function formatDateTime(
	date: string | Date,
	format: string = "YYYY.MM.DD HH:mm",
): string {
	return dayjs(date).format(format);
}

export function formatDateTimeWithSeconds(
	date: string | Date,
	format: string = "YY.MM.DD HH:mm:ss",
): string {
	return dayjs(date).format(format);
}

// Date manipulation utilities
export function startOf(
	date: string | Date,
	unit: dayjs.ManipulateType = "day",
): Date {
	return dayjs(date)
		.startOf(unit as dayjs.UnitType)
		.toDate();
}

export function subtract(
	date: string | Date,
	amount: number,
	unit: dayjs.ManipulateType,
): Date {
	return dayjs(date).subtract(amount, unit).toDate();
}

export function add(
	date: string | Date,
	amount: number,
	unit: dayjs.ManipulateType,
): Date {
	return dayjs(date).add(amount, unit).toDate();
}

// Date comparison utilities
export function isSame(
	date1: string | Date,
	date2: string | Date,
	unit: dayjs.UnitType = "day",
): boolean {
	return dayjs(date1).isSame(date2, unit);
}

// Date property utilities
export function getDate(date: string | Date): number {
	return dayjs(date).get("date");
}

export function getYear(): number {
	return dayjs().get("year");
}

// Time utilities
export function formatTime(format: string = "HH:mm"): string {
	return dayjs().format(format);
}

// ISO string utilities
export function toISOString(date: string | Date): string {
	return dayjs(date).toISOString();
}
