import { EnumFieldOptional, StringFieldOptional } from "@cocrepo/decorator";
import type { Prisma } from "@cocrepo/prisma";
import { CategoryTypes } from "@cocrepo/prisma";
import { PrismaQueryDto } from "./prisma-query.dto";

/**
 * 카테고리 목록 조회용 Query DTO
 *
 * 자동 매핑:
 * - name -> containsFilter (일반 string)
 * - type -> 직접 매핑 (enum)
 * - parentId, spaceId, serviceId -> 정확 매칭 (*Id)
 */
export class QueryCategoryDto extends PrismaQueryDto<Prisma.CategoryWhereInput> {
	@StringFieldOptional()
	name?: string;

	@EnumFieldOptional(() => CategoryTypes)
	type?: CategoryTypes;

	@StringFieldOptional()
	parentId?: string;

	@StringFieldOptional()
	spaceId?: string;

	@StringFieldOptional()
	serviceId?: string;
}
