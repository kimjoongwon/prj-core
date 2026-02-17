import {
	BooleanFieldOptional,
	EnumFieldOptional,
	StringFieldOptional,
} from "@cocrepo/decorator";
import type { Prisma } from "@cocrepo/prisma";
import { TemplateType } from "@cocrepo/prisma";

import { PrismaQueryDto } from "./prisma-query.dto";

/**
 * Template 목록 조회용 Query DTO
 *
 * 자동 매핑: type(enum→직접), isActive(boolean→직접)
 * 커스텀 처리: search(code OR name 통합 검색)
 */
export class QueryTemplateDto extends PrismaQueryDto<Prisma.TemplateWhereInput> {
	@StringFieldOptional({ description: "코드 또는 이름 통합 검색" })
	readonly search?: string;

	@EnumFieldOptional(() => TemplateType, { description: "템플릿 유형 필터" })
	readonly type?: TemplateType;

	@BooleanFieldOptional({ description: "활성 상태 필터" })
	readonly isActive?: boolean;

	protected excludeFromAutoMap(): string[] {
		return ["search"];
	}

	toPrismaWhere(
		baseWhere?: Partial<Prisma.TemplateWhereInput>,
	): Prisma.TemplateWhereInput {
		const where = super.toPrismaWhere(baseWhere);

		// 코드(code) 또는 이름(name) 통합 검색 (OR 조건, insensitive)
		if (this.search) {
			where.OR = [
				{ code: { contains: this.search, mode: "insensitive" } },
				{ name: { contains: this.search, mode: "insensitive" } },
			];
		}

		return where;
	}
}
