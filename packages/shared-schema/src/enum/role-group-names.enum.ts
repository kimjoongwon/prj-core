import { Enum, EnumType } from "ts-jenum";

@Enum("code")
export class RoleGroupNames extends EnumType<RoleGroupNames>() {
	static readonly NORMAL = new RoleGroupNames("NORMAL", "일반");
	static readonly VIP = new RoleGroupNames("VIP", "VIP");

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
