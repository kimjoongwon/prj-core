import { Enum, EnumType } from "ts-jenum";

@Enum("code")
export class GroupNames extends EnumType<GroupNames>() {
	static readonly TEAM_TRAINING = new GroupNames(
		"TEAM_TRAINING",
		"팀 트레이닝",
	);
	static readonly PERSONAL_TRAINING = new GroupNames(
		"PERSONAL_TRAINING",
		"개인 트레이닝",
	);
	static readonly GROUND = new GroupNames("GROUND", "그라운드 PT");
	static readonly PILATES = new GroupNames("PILATES", "필라테스");

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
