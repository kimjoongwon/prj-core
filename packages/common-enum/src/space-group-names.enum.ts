import { Enum, EnumType } from "ts-jenum";

@Enum("code")
export class SpaceGroupNames extends EnumType<SpaceGroupNames>() {
	static readonly ROOT = new SpaceGroupNames("ROOT", "루트");

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
