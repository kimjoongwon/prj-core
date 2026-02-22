import { BaseEnum } from "./base-enum";

export class RepeatCycleType extends BaseEnum {
	static readonly DAILY = new RepeatCycleType("DAILY", "Daily");
	static readonly WEEKLY = new RepeatCycleType("WEEKLY", "Weekly");
	static readonly MONTHLY = new RepeatCycleType("MONTHLY", "Monthly");
	static readonly YEARLY = new RepeatCycleType("YEARLY", "Yearly");

	private static readonly _values = [
		RepeatCycleType.DAILY,
		RepeatCycleType.WEEKLY,
		RepeatCycleType.MONTHLY,
		RepeatCycleType.YEARLY,
	] as const;

	static values(): RepeatCycleType[] {
		return [...RepeatCycleType._values];
	}

	private constructor(code: string, name: string) {
		super(code, name);
	}

	static findName(code: string): string | undefined {
		return RepeatCycleType.values().find((e) => e.equals(code))?.name;
	}
}
