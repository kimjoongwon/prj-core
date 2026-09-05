import { NumberField, StringFieldOptional } from "@cocrepo/decorator/field";
import { Asset } from "@cocrepo/entity";
import { PickType } from "@nestjs/swagger";

/**
 * 에셋 생성 DTO
 */
export class CreateAssetDto extends PickType(Asset, [
	"spaceId",
	"folderId",
	"kind",
	"status",
	"originalName",
	"storageKey",
	"mimeType",
	"extension",
	"checksum",
	"metadata",
	"createdById",
] as const) {
	@StringFieldOptional({
		nullable: true,
		description: "공개 접근 가능한 에셋 URL",
	})
	publicUrl!: string | null;

	// DB의 bigint 크기는 요청에서 기존 숫자 계약으로 받습니다.
	@NumberField({ description: "파일 크기 (바이트)", int: true })
	sizeBytes!: number;
}
