import { Enum, EnumType } from "ts-jenum";

@Enum("code")
export class RepeatCycleTypes extends EnumType<RepeatCycleTypes>() {
	static readonly DAILY = new RepeatCycleTypes("DAILY", "Daily");
	static readonly WEEKLY = new RepeatCycleTypes("WEEKLY", "Weekly");
	static readonly MONTHLY = new RepeatCycleTypes("MONTHLY", "Monthly");
	static readonly YEARLY = new RepeatCycleTypes("YEARLY", "Yearly");

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
		return RepeatCycleTypes.values().find((e) => e.equals(code))?.name;
	}

	equals(code: string): boolean {
		return this.code === code;
	}
}
