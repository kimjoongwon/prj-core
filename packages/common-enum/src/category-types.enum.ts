import { BaseEnum } from "./base-enum";

export class CategoryType extends BaseEnum {
	static readonly ROLE = new CategoryType("Role", "역할");
	static readonly SPACE = new CategoryType("Space", "공간");
	static readonly FILE = new CategoryType("File", "파일");
	static readonly USER = new CategoryType("User", "사용자");

	private static readonly _values = [
		CategoryType.ROLE,
		CategoryType.SPACE,
		CategoryType.FILE,
		CategoryType.USER,
	] as const;

	static values(): CategoryType[] {
		return [...CategoryType._values];
	}

	private constructor(code: string, name: string) {
		super(code, name);
	}
}
