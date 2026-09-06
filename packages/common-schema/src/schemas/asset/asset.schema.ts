import { AssetKind, AssetStatus } from "@cocrepo/enum";
import type { Asset as PrismaAsset } from "@cocrepo/prisma";
import {
	BigIntIdValidation,
	BigIntIdValidationOptional,
	ClassValidation,
	EnumValidation,
	StringValidation,
	StringValidationOptional,
} from "../../decorators/model-validation";
import { AbstractSchema } from "../abstract.schema";

/** Asset의 DB 필드 타입과 공통 검증입니다. */
export class AssetSchema extends AbstractSchema implements PrismaAsset {
	assetId!: PrismaAsset["assetId"];

	@BigIntIdValidation({ description: "소속 Space ID" })
	spaceId!: PrismaAsset["spaceId"];

	@BigIntIdValidation({ description: "소속 폴더 ID" })
	folderId!: PrismaAsset["folderId"];

	@EnumValidation(() => AssetKind, {
		description: "에셋 종류 (IMAGE, VIDEO, DOCUMENT)",
	})
	kind!: PrismaAsset["kind"];

	@EnumValidation(() => AssetStatus, {
		description: "에셋 상태 (UPLOADING, READY, FAILED)",
	})
	status!: PrismaAsset["status"];

	@StringValidation({ description: "원본 파일명" })
	originalName!: PrismaAsset["originalName"];

	@StringValidation({ description: "스토리지 저장 키" })
	storageKey!: PrismaAsset["storageKey"];

	@StringValidation({ description: "MIME 타입" })
	mimeType!: PrismaAsset["mimeType"];

	@StringValidationOptional({ nullable: true, description: "파일 확장자" })
	extension!: PrismaAsset["extension"];

	@BigIntIdValidation({ description: "파일 크기 (바이트)" })
	sizeBytes!: PrismaAsset["sizeBytes"];

	@StringValidationOptional({
		nullable: true,
		description: "체크섬 (무결성 검증용)",
	})
	checksum!: PrismaAsset["checksum"];

	@ClassValidation({
		required: false,
		nullable: true,
		description: "메타데이터 (Exif, 동영상 길이 등)",
	})
	metadata!: PrismaAsset["metadata"];

	@BigIntIdValidationOptional({ nullable: true, description: "생성자 ID" })
	createdById!: PrismaAsset["createdById"];
}
