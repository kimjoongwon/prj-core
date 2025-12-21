import { Enum, EnumType } from "ts-jenum";

@Enum("code")
export class GroupTypes extends EnumType<GroupTypes>() {
	static readonly ROLE = new GroupTypes("Role", "역할");
	static readonly SPACE = new GroupTypes("Space", "공간");
	static readonly FILE = new GroupTypes("File", "파일");
	static readonly USER = new GroupTypes("User", "사용자");

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
