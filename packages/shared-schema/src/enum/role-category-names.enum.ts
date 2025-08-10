import { Enum, EnumType } from "ts-jenum";

@Enum("code")
export class RoleCategoryNames extends EnumType<RoleCategoryNames>() {
	static readonly COMMON = new RoleCategoryNames("COMMON", "공통");
	static readonly ADMIN = new RoleCategoryNames("ADMIN", "관리자");
	static readonly USER = new RoleCategoryNames("USER", "사용자");
	static readonly MANAGER = new RoleCategoryNames("MANAGER", "매니저");
	static readonly DEVELOPER = new RoleCategoryNames("DEVELOPER", "개발자");
	static readonly GUEST = new RoleCategoryNames("GUEST", "게스트");

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
