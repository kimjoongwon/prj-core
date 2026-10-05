import { BaseEnum } from "./base-enum";

export class SpaceGroupName extends BaseEnum {
	static readonly ROOT = new SpaceGroupName("ROOT", "루트");

	private static readonly _values = [SpaceGroupName.ROOT] as const;

	static values(): SpaceGroupName[] {
		return [...SpaceGroupName._values];
	}

	private constructor(code: string, name: string) {
		super(code, name);
	}
}
