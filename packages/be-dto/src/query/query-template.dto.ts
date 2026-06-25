import {
	BooleanFieldOptional,
	EnumFieldOptional,
	StringFieldOptional,
} from "@cocrepo/decorator";
import { TemplateType } from "@cocrepo/prisma";

import { QueryDto } from "./query.dto";

/**
 * Template 목록 조회용 Query DTO
 *
 * 필터 계약: type(enum→직접), isActive(boolean→직접)
 * 커스텀 처리: search(code OR name 통합 검색)
 */
export class QueryTemplateDto extends QueryDto {
	@StringFieldOptional({ description: "코드 또는 이름 통합 검색" })
	readonly search?: string;

	@EnumFieldOptional(() => TemplateType, { description: "템플릿 유형 필터" })
	readonly type?: TemplateType;

	@BooleanFieldOptional({ description: "활성 상태 필터" })
	readonly isActive?: boolean;

}
