import {
	StringFieldOptional,
} from "@cocrepo/decorator/field";

import { EntityQueryType } from "./entity-query-type";
import { Template } from "@cocrepo/entity";

/**
 * Template 목록 조회용 Query DTO
 *
 * 필터 계약: type(enum→직접), isActive(boolean→직접)
 * 커스텀 처리: search(code OR name 통합 검색)
 */
export class QueryTemplateDto extends EntityQueryType(Template, [
	"type",
	"isActive",
] as const) {
	@StringFieldOptional({ description: "코드 또는 이름 통합 검색" })
	readonly search?: string;

}
