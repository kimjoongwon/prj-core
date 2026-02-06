import { Enum, EnumType } from "ts-jenum";

@Enum("code")
export class SpaceCategoryNames extends EnumType<SpaceCategoryNames>() {
	static readonly ROOT = new SpaceCategoryNames("ROOT", "루트");
	static readonly BRANCH = new SpaceCategoryNames("BRANCH", "지점");

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
