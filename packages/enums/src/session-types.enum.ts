import { Enum, EnumType } from "ts-jenum";

@Enum("code")
export class SessionTypes extends EnumType<SessionTypes>() {
	static readonly ONE_TIME = new SessionTypes("ONE_TIME", "일회성");
	static readonly RECURRING = new SessionTypes("RECURRING", "반복");

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
		return SessionTypes.values().find((e) => e.equals(code))?.name;
	}

	equals(code: string): boolean {
		return this.code === code;
	}
}
