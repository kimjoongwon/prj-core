import { BaseEnum } from "./base-enum";

export class RoleCategoryName extends BaseEnum {
	static readonly PLATFORM = new RoleCategoryName("PLATFORM", "플랫폼");
	static readonly SHARED = new RoleCategoryName("SHARED", "공유");
	static readonly WORKSPACE = new RoleCategoryName("WORKSPACE", "워크스페이스");
	static readonly PUBLIC = new RoleCategoryName("PUBLIC", "공개");
	static readonly PROJECT = new RoleCategoryName("PROJECT", "프로젝트");
	static readonly TECHNICAL = new RoleCategoryName("TECHNICAL", "기술");
	static readonly RESTRICTED = new RoleCategoryName("RESTRICTED", "제한");

	private static readonly _values = [
		RoleCategoryName.PLATFORM,
		RoleCategoryName.SHARED,
		RoleCategoryName.WORKSPACE,
		RoleCategoryName.PUBLIC,
		RoleCategoryName.PROJECT,
		RoleCategoryName.TECHNICAL,
		RoleCategoryName.RESTRICTED,
	] as const;

	static values(): RoleCategoryName[] {
		return [...RoleCategoryName._values];
	}

	private constructor(code: string, name: string) {
		super(code, name);
	}
}
