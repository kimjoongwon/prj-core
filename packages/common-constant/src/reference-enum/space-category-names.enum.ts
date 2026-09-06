import { BaseEnum } from "./base-enum";

export class SpaceCategoryName extends BaseEnum {
	static readonly ROOT = new SpaceCategoryName("ROOT", "루트");
	static readonly BRANCH = new SpaceCategoryName("BRANCH", "지점");

	private static readonly _values = [
		SpaceCategoryName.ROOT,
		SpaceCategoryName.BRANCH,
	] as const;

	static values(): SpaceCategoryName[] {
		return [...SpaceCategoryName._values];
	}

	private constructor(code: string, name: string) {
		super(code, name);
	}
}
