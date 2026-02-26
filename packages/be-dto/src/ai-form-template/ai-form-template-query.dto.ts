import {
	EnumFieldOptional,
	StringFieldOptional,
} from "@cocrepo/decorator";
import { DeleteFilter } from "@cocrepo/enum";
import {
	AIProvider,
	AITemplateStatus,
	type Prisma,
} from "@cocrepo/prisma";
import { Transform } from "class-transformer";
import { PrismaQueryDto } from "../query/prisma-query.dto";

/**
 * AI 폼 템플릿 목록 조회용 Query DTO
 *
 * 페이지네이션(skip/take)은 부모 QueryDto에서 상속합니다.
 *
 * 자동 매핑:
 * - targetDomain -> containsFilter (일반 string)
 * - aiProvider -> 직접 매핑 (enum)
 *
 * 커스텀 처리:
 * - search (이름 검색)
 * - status (DeleteFilter -> removedAt)
 */
export class QueryAIFormTemplateDto extends PrismaQueryDto<Prisma.AIFormTemplateWhereInput> {
	// -------------------------------------------------------------------------
	// 검색
	// -------------------------------------------------------------------------
	@StringFieldOptional({
		description: "검색어 (템플릿 이름)",
	})
	search?: string;

	// -------------------------------------------------------------------------
	// 필터 - 대상 도메인
	// -------------------------------------------------------------------------
	@StringFieldOptional({
		description: "대상 도메인 필터 (예: Member, Inquiry, Role)",
	})
	targetDomain?: string;

	// -------------------------------------------------------------------------
	// 필터 - Enum
	// -------------------------------------------------------------------------
	@EnumFieldOptional(() => AITemplateStatus, {
		description: "템플릿 상태 필터 (DRAFT, ACTIVE, INACTIVE, ARCHIVED)",
	})
	templateStatus?: AITemplateStatus;

	@EnumFieldOptional(() => AIProvider, {
		description: "AI 제공자 필터 (OPENAI, ANTHROPIC)",
	})
	aiProvider?: AIProvider;

	// -------------------------------------------------------------------------
	// 필터 - 삭제 상태
	// -------------------------------------------------------------------------
	@EnumFieldOptional(() => DeleteFilter, {
		description: "삭제 상태 필터 (active: 활성, deleted: 삭제됨)",
	})
	status?: DeleteFilter;

	// -------------------------------------------------------------------------
	// 정렬
	// -------------------------------------------------------------------------
	@StringFieldOptional({
		each: true,
		description:
			"복합 정렬 (JSON:API 컨벤션). 부호 없음=ASC, -prefix=DESC. 허용 필드: createdAt, updatedAt, name, priority, targetDomain. 예: ?sort=-createdAt&sort=name",
	})
	@Transform(({ value }) =>
		Array.isArray(value) ? value : value ? [value] : [],
	)
	sort?: string[];

	// -------------------------------------------------------------------------
	// 자동 매핑 제외 필드
	// -------------------------------------------------------------------------
	/**
	 * 검색어(이름 검색), 삭제 상태(removedAt 변환), 템플릿 상태(templateStatus -> status 필드명 충돌)
	 * 를 자동 매핑에서 제외
	 */
	protected excludeFromAutoMap(): string[] {
		return ["search", "status", "templateStatus"];
	}

	// -------------------------------------------------------------------------
	// Prisma 변환
	// -------------------------------------------------------------------------
	/**
	 * DTO 필드를 Prisma where 조건으로 변환합니다.
	 * 자동 매핑: targetDomain, aiProvider
	 * 커스텀: search, status, templateStatus
	 */
	toPrismaWhere(
		baseWhere?: Partial<Prisma.AIFormTemplateWhereInput>,
	): Prisma.AIFormTemplateWhereInput {
		const where = super.toPrismaWhere(baseWhere);

		// 삭제 상태 필터 (DeleteFilter -> removedAt)
		where.removedAt = this.removedAtFilter(
			this.status === DeleteFilter.DELETED,
		);

		// 검색어 (템플릿 이름 검색)
		if (this.search) {
			where.name = this.containsFilter(this.search);
		}

		// 템플릿 상태 (templateStatus -> status 필드)
		if (this.templateStatus) {
			where.status = this.templateStatus;
		}

		return where;
	}
}
