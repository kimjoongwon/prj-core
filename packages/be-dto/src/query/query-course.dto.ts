import {
	EnumFieldOptional,
	StringFieldOptional,
	UUIDFieldOptional,
} from "@cocrepo/decorator";
import { CourseStatus, type Prisma } from "@cocrepo/prisma";
import { Transform } from "class-transformer";
import { PrismaQueryDto } from "./prisma-query.dto";

/**
 * Course 목록 조회용 Query DTO
 *
 * 자동 매핑: status(enum), spaceId(*Id)
 * 커스텀 처리: search(name OR description)
 */
export class QueryCourseDto extends PrismaQueryDto<Prisma.CourseWhereInput> {
	@StringFieldOptional({ description: "코스명 또는 설명 통합 검색" })
	search?: string;

	@EnumFieldOptional(() => CourseStatus, {
		description: "코스 상태 필터 (DRAFT, ACTIVE, ARCHIVED)",
	})
	status?: CourseStatus;

	@UUIDFieldOptional({ description: "스페이스 ID 필터" })
	spaceId?: string;

	@StringFieldOptional({
		each: true,
		description:
			"복합 정렬 (JSON:API 컨벤션). 부호 없음=ASC, -prefix=DESC. 허용 필드: createdAt, name, status, activeOfferingCount, activeEnrollmentCount. 예: ?sort=name&sort=-createdAt",
	})
	@Transform(({ value }) =>
		Array.isArray(value) ? value : value ? [value] : [],
	)
	sort?: string[];

	protected excludeFromAutoMap(): string[] {
		return ["search"];
	}

	toPrismaWhere(
		baseWhere?: Partial<Prisma.CourseWhereInput>,
	): Prisma.CourseWhereInput {
		const where = super.toPrismaWhere(baseWhere);

		if (this.search) {
			const search = this.containsFilter(this.search);
			where.OR = [{ name: search }, { description: search }];
		}

		return where;
	}
}
