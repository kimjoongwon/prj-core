import { BaseEnum } from "./base-enum";

export class RecurringDayOfWeek extends BaseEnum {
	static readonly SUNDAY = new RecurringDayOfWeek("SUN", "Sunday");
	static readonly MONDAY = new RecurringDayOfWeek("MON", "Monday");
	static readonly TUESDAY = new RecurringDayOfWeek("TUE", "Tuesday");
	static readonly WEDNESDAY = new RecurringDayOfWeek("WED", "Wednesday");
	static readonly THURSDAY = new RecurringDayOfWeek("THU", "Thursday");
	static readonly FRIDAY = new RecurringDayOfWeek("FRI", "Friday");
	static readonly SATURDAY = new RecurringDayOfWeek("SAT", "Saturday");

	private static readonly _values = [
		RecurringDayOfWeek.SUNDAY,
		RecurringDayOfWeek.MONDAY,
		RecurringDayOfWeek.TUESDAY,
		RecurringDayOfWeek.WEDNESDAY,
		RecurringDayOfWeek.THURSDAY,
		RecurringDayOfWeek.FRIDAY,
		RecurringDayOfWeek.SATURDAY,
	] as const;

	static values(): RecurringDayOfWeek[] {
		return [...RecurringDayOfWeek._values];
	}

	private constructor(code: string, name: string) {
		super(code, name);
	}

	static findName(code: string): string | undefined {
		return RecurringDayOfWeek.values().find((e) => e.equals(code))?.name;
	}
}
