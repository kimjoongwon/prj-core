import { BaseEnum } from "./base-enum";

/**
 * Derivative(파생 리소스)의 종류
 * 원본 에셋에서 생성된 변환 파일의 용도를 구분합니다.
 */
export class DerivativeKind extends BaseEnum {
	/** 작은 크기 미리보기 이미지 (예: 100x100) */
	static readonly THUMBNAIL = new DerivativeKind("Thumbnail", "썸네일");
	/** 중간 크기 미리보기 (예: 800x600) */
	static readonly PREVIEW = new DerivativeKind("Preview", "프리뷰");
	/** 비디오 포맷/해상도 변환본 */
	static readonly TRANSCODE = new DerivativeKind("Transcode", "트랜스코딩");
	/** 문서에서 추출된 텍스트 */
	static readonly TEXT = new DerivativeKind("Text", "텍스트");

	private static readonly _values = [
		DerivativeKind.THUMBNAIL,
		DerivativeKind.PREVIEW,
		DerivativeKind.TRANSCODE,
		DerivativeKind.TEXT,
	] as const;

	static values(): DerivativeKind[] {
		return [...DerivativeKind._values];
	}

	private constructor(code: string, name: string) {
		super(code, name);
	}
}
