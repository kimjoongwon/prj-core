import { BaseEnum } from "./base-enum";

export class AssetStatus extends BaseEnum {
	static readonly UPLOADING = new AssetStatus("Uploading", "업로드 중");
	static readonly READY = new AssetStatus("Ready", "준비됨");
	static readonly FAILED = new AssetStatus("Failed", "실패");

	private static readonly _values = [
		AssetStatus.UPLOADING,
		AssetStatus.READY,
		AssetStatus.FAILED,
	] as const;

	static values(): AssetStatus[] {
		return [...AssetStatus._values];
	}

	private constructor(code: string, name: string) {
		super(code, name);
	}
}
