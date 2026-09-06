import { BaseEnum } from "@cocrepo/constant";

export class CategoryName extends BaseEnum {
	static readonly THUMBNAIL_IMAGE = new CategoryName(
		"THUMBNAIL_IMAGE",
		"썸네일 이미지",
	);
	static readonly THUMBNAIL_VIDEO = new CategoryName(
		"THUMBNAIL_VIDEO",
		"썸네일 비디오",
	);
	static readonly VIDEO_CONTENT = new CategoryName("VIDEO_CONTENT", "영상");
	static readonly AUDIO_CONTENT = new CategoryName("AUDIO_CONTENT", "오디오");
	static readonly DOCUMENT_CONTENT = new CategoryName(
		"DOCUMENT_CONTENT",
		"문서",
	);
	static readonly IMAGE_CONTENT = new CategoryName("IMAGE_CONTENT", "이미지");

	private static readonly _values = [
		CategoryName.THUMBNAIL_IMAGE,
		CategoryName.THUMBNAIL_VIDEO,
		CategoryName.VIDEO_CONTENT,
		CategoryName.AUDIO_CONTENT,
		CategoryName.DOCUMENT_CONTENT,
		CategoryName.IMAGE_CONTENT,
	] as const;

	static values(): CategoryName[] {
		return [...CategoryName._values];
	}

	private constructor(code: string, name: string) {
		super(code, name);
	}
}
