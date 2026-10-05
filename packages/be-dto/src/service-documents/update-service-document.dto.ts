import {
	DateFieldOptional,
	StringFieldOptional,
} from "@cocrepo/decorator/field";
import { ServiceDocument } from "@cocrepo/entity";
import { PartialType, PickType } from "@nestjs/swagger";

/**
 * 서비스 문서 수정 DTO
 *
 * kind/platform/locale/version은 버전 식별자라 수정하지 않습니다.
 */
export class UpdateServiceDocumentDto extends PartialType(
	PickType(ServiceDocument, [
		"title",
		"content",
		"format",
		"isRequired",
		"displayOrder",
	] as const),
	{ skipNullProperties: false },
) {
	@StringFieldOptional({ description: "요약" })
	summary?: string;

	@DateFieldOptional({ description: "효력 시작 시각" })
	effectiveAt?: Date;
}
