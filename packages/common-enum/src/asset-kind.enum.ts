import { BaseEnum } from "./base-enum";

/**
 * Asset(에셋)의 파일 종류
 * 파일 처리 및 변환 로직을 구분하는 데 사용됩니다.
 */
export class AssetKind extends BaseEnum {
	/** 이미지 파일 (jpg, png, gif, webp 등) */
	static readonly IMAGE = new AssetKind("Image", "이미지");
	/** 비디오 파일 (mp4, mov, avi, webm 등) */
	static readonly VIDEO = new AssetKind("Video", "비디오");
	/** 문서 파일 (pdf, doc, docx, txt 등) */
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
