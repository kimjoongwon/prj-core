import { BaseEnum } from "./base-enum";

export class AssetKind extends BaseEnum {
	static readonly IMAGE = new AssetKind("Image", "이미지");
	static readonly VIDEO = new AssetKind("Video", "비디오");
	static readonly DOCUMENT = new AssetKind("Document", "문서");

	private static readonly _values = [
		AssetKind.IMAGE,
		AssetKind.VIDEO,
		AssetKind.DOCUMENT,
	] as const;

	static values(): AssetKind[] {
		return [...AssetKind._values];
	}

	private constructor(code: string, name: string) {
		super(code, name);
	}
}
