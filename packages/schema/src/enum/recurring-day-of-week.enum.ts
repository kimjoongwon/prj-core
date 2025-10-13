import { Enum, EnumType } from "ts-jenum";

@Enum("code")
export class RecurringDayOfWeek extends EnumType<RecurringDayOfWeek>() {
	static readonly SUNDAY = new RecurringDayOfWeek("SUN", "Sunday");
	static readonly MONDAY = new RecurringDayOfWeek("MON", "Monday");
	static readonly TUESDAY = new RecurringDayOfWeek("TUE", "Tuesday");
	static readonly WEDNESDAY = new RecurringDayOfWeek("WED", "Wednesday");
	static readonly THURSDAY = new RecurringDayOfWeek("THU", "Thursday");
	static readonly FRIDAY = new RecurringDayOfWeek("FRI", "Friday");
	static readonly SATURDAY = new RecurringDayOfWeek("SAT", "Saturday");

	private constructor(
		readonly _code: string,
		readonly _name: string,
	) {
		super();
	}

	get code(): string {
		return this._code;
	}

	get name(): string {
		return this._name;
	}

	static findName(code: string): string | undefined {
		return RecurringDayOfWeek.values().find((e) => e.equals(code))?.name;
	}

	equals(code: string): boolean {
		return this.code === code;
	}
}
