import { BaseEnum } from "@cocrepo/constant";

export class GroupName extends BaseEnum {
	static readonly TEAM_TRAINING = new GroupName("TEAM_TRAINING", "팀 트레이닝");
	static readonly PERSONAL_TRAINING = new GroupName(
		"PERSONAL_TRAINING",
		"개인 트레이닝",
	);
	static readonly GROUND = new GroupName("GROUND", "그라운드 PT");
	static readonly PILATES = new GroupName("PILATES", "필라테스");

	private static readonly _values = [
		GroupName.TEAM_TRAINING,
		GroupName.PERSONAL_TRAINING,
		GroupName.GROUND,
		GroupName.PILATES,
	] as const;

	static values(): GroupName[] {
		return [...GroupName._values];
	}

	private constructor(code: string, name: string) {
		super(code, name);
	}
}
