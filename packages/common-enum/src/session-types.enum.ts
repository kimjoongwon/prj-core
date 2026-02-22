import { BaseEnum } from "./base-enum";

export class SessionType extends BaseEnum {
	static readonly ONE_TIME = new SessionType("ONE_TIME", "일회성");
	static readonly ONE_TIME_RANGE = new SessionType("ONE_TIME_RANGE", "기간형");
	static readonly RECURRING = new SessionType("RECURRING", "반복");

	private static readonly _values = [
		SessionType.ONE_TIME,
		SessionType.ONE_TIME_RANGE,
		SessionType.RECURRING,
	] as const;

	static values(): SessionType[] {
		return [...SessionType._values];
	}

	private constructor(code: string, name: string) {
		super(code, name);
	}

	static findName(code: string): string | undefined {
		return SessionType.values().find((e) => e.equals(code))?.name;
	}
}
