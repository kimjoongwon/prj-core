import type { JsonValue } from "@cocrepo/type";
import { AssetKind, AssetStatus } from "@cocrepo/enum";
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
export class AssetSchema extends AbstractSchema {
	assetId!: string;

	@BigIntIdValidation({ description: "소속 Space ID" })
	spaceId!: bigint;

	@BigIntIdValidation({ description: "소속 폴더 ID" })
	folderId!: bigint;

	@EnumValidation(() => AssetKind, {
		description: "에셋 종류 (IMAGE, VIDEO, DOCUMENT)",
	})
	kind!: AssetKind;

	@EnumValidation(() => AssetStatus, {
		description: "에셋 상태 (UPLOADING, READY, FAILED)",
	})
	status!: AssetStatus;

	@StringValidation({ description: "원본 파일명" })
	originalName!: string;

	@StringValidation({ description: "스토리지 저장 키" })
	storageKey!: string;

	@StringValidation({ description: "MIME 타입" })
	mimeType!: string;

	@StringValidationOptional({ nullable: true, description: "파일 확장자" })
	extension!: string | null;

	@BigIntIdValidation({ description: "파일 크기 (바이트)" })
	sizeBytes!: bigint;

	@StringValidationOptional({
		nullable: true,
		description: "체크섬 (무결성 검증용)",
	})
	checksum!: string | null;

	@ClassValidation({
		required: false,
		nullable: true,
		description: "메타데이터 (Exif, 동영상 길이 등)",
	})
	metadata!: JsonValue;

	@BigIntIdValidationOptional({ nullable: true, description: "생성자 ID" })
	createdById!: bigint | null;
}
