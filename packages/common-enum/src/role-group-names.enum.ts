import { BaseEnum } from "./base-enum";

export class RoleGroupName extends BaseEnum {
	static readonly TRUSTED = new RoleGroupName("TRUSTED", "신뢰");
	static readonly STANDARD = new RoleGroupName("STANDARD", "일반");
	static readonly PREMIUM = new RoleGroupName("PREMIUM", "프리미엄");

	private static readonly _values = [
		RoleGroupName.TRUSTED,
		RoleGroupName.STANDARD,
		RoleGroupName.PREMIUM,
	] as const;

	static values(): RoleGroupName[] {
		return [...RoleGroupName._values];
	}

	private constructor(code: string, name: string) {
		super(code, name);
	}
}
