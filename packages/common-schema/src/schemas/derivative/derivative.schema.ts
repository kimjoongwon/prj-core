import { DerivativeKind } from "@cocrepo/enum";
import {
	BigIntIdValidation,
	BigIntIdValidationOptional,
	EnumValidation,
	NumberValidation,
	NumberValidationOptional,
	StringValidation,
} from "../../decorators/model-validation";
import { AbstractSchema } from "../abstract.schema";

/** Derivative의 DB 필드 타입과 공통 검증입니다. */
export class DerivativeSchema
	extends AbstractSchema
{
	derivativeId!: string;

	@BigIntIdValidation({ description: "소속 Space ID" })
	spaceId!: bigint;

	@BigIntIdValidationOptional({ nullable: true, description: "생성자 ID" })
	createdById!: bigint | null;

	@BigIntIdValidation({ description: "원본 에셋 ID" })
	assetId!: bigint;

	@EnumValidation(() => DerivativeKind, {
		description: "파생 리소스 종류 (THUMBNAIL, PREVIEW, TRANSCODE, TEXT)",
	})
	kind!: DerivativeKind;

	@StringValidation({
		description: "프로필명 (예: thumbnail-256, preview-1080p)",
	})
	profile!: string;

	@StringValidation({ description: "스토리지 저장 키" })
	storageKey!: string;

	@StringValidation({ description: "MIME 타입" })
	mimeType!: string;

	@NumberValidation({ description: "파일 크기 (바이트)", int: true })
	sizeBytes!: bigint;

	@NumberValidationOptional({
		nullable: true,
		description: "너비 (이미지/비디오)",
		int: true,
	})
	width!: number | null;

	@NumberValidationOptional({
		nullable: true,
		description: "높이 (이미지/비디오)",
		int: true,
	})
	height!: number | null;

	@NumberValidationOptional({
		nullable: true,
		description: "재생 시간 (밀리초, 비디오)",
		int: true,
	})
	durationMs!: number | null;
}
