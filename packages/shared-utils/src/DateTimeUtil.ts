import dayjs from "dayjs";
import { parseAbsoluteToLocal } from "@internationalized/date";

export class DateTimeUtil {
	static getNow(): string {
		return dayjs().format("YYYY-MM-DD HH:mm:ss");
	}

	// Date formatting utilities
	static formatDate(date: string | Date, format: string = "YYYY.MM.DD"): string {
		return dayjs(date).format(format);
	}

	static formatDateTime(date: string | Date, format: string = "YYYY.MM.DD HH:mm"): string {
		return dayjs(date).format(format);
	}

	static formatDateTimeWithSeconds(date: string | Date, format: string = "YY.MM.DD HH:mm:ss"): string {
		return dayjs(date).format(format);
	}

	// Date manipulation utilities
	static startOf(date: string | Date, unit: dayjs.ManipulateType = "day"): Date {
		return dayjs(date).startOf(unit as dayjs.UnitType).toDate();
	}

	static subtract(date: string | Date, amount: number, unit: dayjs.ManipulateType): Date {
		return dayjs(date).subtract(amount, unit).toDate();
	}

	static add(date: string | Date, amount: number, unit: dayjs.ManipulateType): Date {
		return dayjs(date).add(amount, unit).toDate();
	}

	// Date comparison utilities
	static isSame(date1: string | Date, date2: string | Date, unit: dayjs.UnitType = "day"): boolean {
		return dayjs(date1).isSame(date2, unit);
	}

	// Date property utilities
	static getDate(date: string | Date): number {
		return dayjs(date).get("date");
	}

	static getYear(): number {
		return dayjs().get("year");
	}

	// Time utilities
	static formatTime(format: string = "HH:mm"): string {
		return dayjs().format(format);
	}

	// Internationalized date utilities
	static parseAbsoluteToLocal = parseAbsoluteToLocal;

	// ISO string utilities
	static toISOString(date: string | Date): string {
		return dayjs(date).toISOString();
	}
}
