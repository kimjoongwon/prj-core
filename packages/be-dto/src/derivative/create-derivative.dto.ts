import { NumberField } from "@cocrepo/decorator/field";
import { Derivative } from "@cocrepo/entity";
import { PickType } from "@nestjs/swagger";

/**
 * 파생 리소스 생성 DTO
 */
export class CreateDerivativeDto extends PickType(Derivative, [
	"spaceId",
	"createdById",
	"assetId",
	"kind",
	"profile",
	"storageKey",
	"mimeType",
	"width",
	"height",
	"durationMs",
] as const) {
	// DB의 bigint 크기는 요청에서 기존 숫자 계약으로 받습니다.
	@NumberField({ description: "파일 크기 (바이트)", int: true })
	sizeBytes!: number;
}
