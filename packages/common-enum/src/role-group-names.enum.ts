import { Enum, EnumType } from "ts-jenum";

@Enum("code")
export class RoleGroupNames extends EnumType<RoleGroupNames>() {
	static readonly TRUSTED = new RoleGroupNames("TRUSTED", "신뢰");
	static readonly STANDARD = new RoleGroupNames("STANDARD", "일반");
	static readonly PREMIUM = new RoleGroupNames("PREMIUM", "프리미엄");

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
}
