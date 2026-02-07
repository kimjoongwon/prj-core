import { Enum, EnumType } from "ts-jenum";

@Enum("code")
export class RoleCategoryNames extends EnumType<RoleCategoryNames>() {
	static readonly PLATFORM = new RoleCategoryNames("PLATFORM", "플랫폼");
	static readonly SHARED = new RoleCategoryNames("SHARED", "공유");
	static readonly WORKSPACE = new RoleCategoryNames("WORKSPACE", "워크스페이스");
	static readonly PUBLIC = new RoleCategoryNames("PUBLIC", "공개");
	static readonly PROJECT = new RoleCategoryNames("PROJECT", "프로젝트");
	static readonly TECHNICAL = new RoleCategoryNames("TECHNICAL", "기술");
	static readonly RESTRICTED = new RoleCategoryNames("RESTRICTED", "제한");

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
