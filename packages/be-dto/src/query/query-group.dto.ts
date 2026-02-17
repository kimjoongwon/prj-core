import { EnumFieldOptional, StringFieldOptional } from "@cocrepo/decorator";
import type { Prisma } from "@cocrepo/prisma";
import { GroupTypes } from "@cocrepo/prisma";
import { PrismaQueryDto } from "./prisma-query.dto";

/**
 * 그룹 목록 조회용 Query DTO
 *
 * 자동 매핑:
 * - name -> containsFilter (부분 일치)
 * - label -> containsFilter (부분 일치)
 * - type -> 직접 매핑 (enum)
 * - spaceId -> 정확 매칭 (*Id)
 */
export class QueryGroupDto extends PrismaQueryDto<Prisma.GroupWhereInput> {
	@StringFieldOptional()
	name?: string;

	@StringFieldOptional()
	label?: string;

	@EnumFieldOptional(() => GroupTypes)
	type?: GroupTypes;

	@StringFieldOptional()
	spaceId?: string;
}
