import {
	EnumField,
	NumberField,
	NumberFieldOptional,
	StringField,
	UUIDField,
} from "@cocrepo/decorator";
import { DerivativeKind } from "@cocrepo/prisma";
import { AbstractDto } from "../abstract.dto";

/**
 * 파생 리소스 DTO
 */
export class DerivativeDto extends AbstractDto {
	@UUIDField({ description: "소속 Tenant ID" })
	tenantId!: string;

	@UUIDField({ description: "원본 에셋 ID" })
	assetId!: string;

	@EnumField(() => DerivativeKind, {
		description: "파생 리소스 종류 (THUMBNAIL, PREVIEW, TRANSCODE, TEXT)",
	})
	kind!: DerivativeKind;

	@StringField({ description: "프로필명 (예: thumbnail-256, preview-1080p)" })
	profile!: string;

	@StringField({ description: "스토리지 저장 키" })
	storageKey!: string;

	@StringField({ description: "MIME 타입" })
	mimeType!: string;

	@NumberField({ description: "파일 크기 (바이트)", int: true })
	sizeBytes!: number;

	@NumberFieldOptional({
		nullable: true,
		description: "너비 (이미지/비디오)",
		int: true,
	})
	width!: number | null;

	@NumberFieldOptional({
		nullable: true,
		description: "높이 (이미지/비디오)",
		int: true,
	})
	height!: number | null;

	@NumberFieldOptional({
		nullable: true,
		description: "재생 시간 (밀리초, 비디오)",
		int: true,
	})
	durationMs!: number | null;
}
