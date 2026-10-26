import {
	StringFieldOptional,
} from "@cocrepo/decorator/field";

import { EntityQueryType } from "../query/entity-query-type";
import { ServiceDocument } from "@cocrepo/entity";

/**
 * ServiceDocument 목록 조회용 Query DTO
 */
export class QueryServiceDocumentDto extends EntityQueryType(ServiceDocument, [
	"kind",
	"platform",
	"status",
	"locale",
	"isRequired",
] as const) {
	@StringFieldOptional({ description: "제목, 요약, 버전 통합 검색" })
	readonly search?: string;

}
