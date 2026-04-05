import { NumberFieldOptional } from "@cocrepo/decorator";
import { PageMetaDto } from "./page-meta.dto";

/**
 * 페이지네이션 기본 Query DTO
 *
 * skip/take와 PageMeta 변환만 제공합니다.
 * 필터/정렬 기능은 PrismaQueryDto에서 제공합니다.
 */
export class QueryDto {
	@NumberFieldOptional({
		minimum: 0,
		default: undefined,
		int: true,
	})
	readonly skip?: number = undefined;

	@NumberFieldOptional({
		minimum: 1,
		maximum: 50,
		default: undefined,
		int: true,
	})
	readonly take?: number = undefined;

	toPageMetaDto(totalCount: number) {
		return new PageMetaDto(this.skip, this.take, totalCount);
	}
}
