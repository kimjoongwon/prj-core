import {
	DateFieldOptional,
	StringFieldOptional,
} from "@cocrepo/decorator/field";
import { ServiceDocument } from "@cocrepo/entity";
import { IntersectionType, PartialType, PickType } from "@nestjs/swagger";

/**
 * 서비스 문서 생성 DTO
 *
 * 문서는 기본적으로 DRAFT 상태로 생성되며 publish API로 게시합니다.
 */
export class CreateServiceDocumentDto extends IntersectionType(
	PickType(ServiceDocument, ["kind", "title", "content", "version"] as const),
	PartialType(
		PickType(ServiceDocument, [
			"platform",
			"locale",
			"format",
			"isRequired",
			"displayOrder",
		] as const),
		{ skipNullProperties: false },
	),
) {
	@StringFieldOptional({ description: "요약" })
	summary?: string;

	@DateFieldOptional({ description: "효력 시작 시각" })
	effectiveAt?: Date;
}
