import { BaseEnum } from "./base-enum";

export class GroupTypes extends BaseEnum {
	static readonly ROLE = new GroupTypes("Role", "역할");
	static readonly SPACE = new GroupTypes("Space", "공간");
	static readonly FILE = new GroupTypes("File", "파일");
	static readonly USER = new GroupTypes("User", "사용자");

	private static readonly _values = [
		GroupTypes.ROLE,
		GroupTypes.SPACE,
		GroupTypes.FILE,
		GroupTypes.USER,
	] as const;

	static values(): GroupTypes[] {
		return [...GroupTypes._values];
	}

	private constructor(code: string, name: string) {
		super(code, name);
	}
}
