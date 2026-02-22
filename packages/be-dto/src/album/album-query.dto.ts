import {
	EnumFieldOptional,
	StringFieldOptional,
	UUIDFieldOptional,
} from "@cocrepo/decorator";
import { DeleteFilter } from "@cocrepo/enum";
import type { Prisma } from "@cocrepo/prisma";
import { Transform } from "class-transformer";
import { PrismaQueryDto } from "../query/prisma-query.dto";

/**
 * 앨범 목록 조회용 Query DTO
 *
 * 자동 매핑:
 * - name -> containsFilter (일반 string)
 * - spaceId -> 정확 매핑 (*Id)
 *
 * 커스텀 처리:
 * - statusFilter -> removedAt 필터
 */
export class AlbumQueryDto extends PrismaQueryDto<Prisma.AlbumWhereInput> {
	@UUIDFieldOptional({ description: "스페이스 ID 필터" })
	spaceId?: string;

	@StringFieldOptional({ description: "앨범명 검색 (부분 일치)" })
	name?: string;

	@EnumFieldOptional(() => DeleteFilter, {
		description: "상태 필터 (active: 활성, deleted: 삭제됨)",
	})
	statusFilter?: DeleteFilter;

	@StringFieldOptional({
		each: true,
		description:
			"복합 정렬 (JSON:API 컨벤션). 부호 없음=ASC, -prefix=DESC. 허용 필드: createdAt, name, sortOrder. 예: ?sort=sortOrder&sort=-createdAt",
	})
	@Transform(({ value }) =>
		Array.isArray(value) ? value : value ? [value] : [],
	)
	sort?: string[];

	/**
	 * 자동 매핑에서 제외할 필드
	 */
	protected excludeFromAutoMap(): string[] {
		return ["statusFilter"];
	}

	/**
	 * DTO 필드를 Prisma where 조건으로 변환합니다.
	 */
	toPrismaWhere(
		baseWhere?: Partial<Prisma.AlbumWhereInput>,
	): Prisma.AlbumWhereInput {
		const where = super.toPrismaWhere(baseWhere);

		// 삭제 상태 필터
		where.removedAt = this.removedAtFilter(
			this.statusFilter === DeleteFilter.DELETED,
		);

		return where;
	}
}
