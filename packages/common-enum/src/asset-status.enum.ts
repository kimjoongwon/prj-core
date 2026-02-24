import { BaseEnum } from "./base-enum";

/**
 * Asset(에셋)의 업로드 상태
 * 파일 처리 파이프라인에서 현재 단계를 추적하는 데 사용됩니다.
 */
export class AssetStatus extends BaseEnum {
	/** 파일 업로드 진행 중 */
	static readonly UPLOADING = new AssetStatus("Uploading", "업로드 중");
	/** 업로드 완료, 사용 가능 */
	static readonly READY = new AssetStatus("Ready", "준비됨");
	/** 업로드 또는 처리 실패 */
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
