import {
	BigIntIdFieldOptional,
	DateFieldOptional,
	EnumFieldOptional,
	StringFieldOptional,
} from "@cocrepo/decorator/field";
import { Inquiry } from "@cocrepo/entity";
import { DeleteFilter } from "@cocrepo/enum";
import { InquiryStatus } from "@cocrepo/prisma";
import { Transform } from "class-transformer";
import { EntityQueryType } from "../query/entity-query-type";

/**
 * 문의 목록 조회용 Query DTO
 *
 * 페이지네이션(skip/take)은 부모 QueryDto에서 상속합니다.
 *
 * 필터 계약:
 * - category, channel, priority (enum -> 직접 매핑)
 * - assigneeId, customerId (*Id -> 정확 매칭)
 *
 * 커스텀 처리:
 * - search (제목, 고객명 OR 검색)
 * - status (DeleteFilter -> removedAt)
 * - inquiryStatus (문의 진행 상태)
 * - startDate/endDate -> createdAt (dateRangeFilter)
 */
export class QueryInquiryDto extends EntityQueryType(Inquiry, [
	"category",
	"channel",
	"priority",
] as const) {
	// -------------------------------------------------------------------------
	// 검색
	// -------------------------------------------------------------------------
	@StringFieldOptional({
		description: "검색어 (제목, 고객명)",
	})
	search?: string;

	@EnumFieldOptional(() => InquiryStatus, {
		description:
			"문의 상태 필터 (NEW, OPEN, IN_PROGRESS, WAITING_CUSTOMER, RESOLVED, CLOSED, ESCALATED)",
	})
	inquiryStatus?: InquiryStatus;

	// -------------------------------------------------------------------------
	// 필터 - 삭제 상태
	// -------------------------------------------------------------------------
	@EnumFieldOptional(() => DeleteFilter, {
		description: "삭제 상태 필터 (active: 활성, deleted: 삭제됨)",
	})
	status?: DeleteFilter;

	// -------------------------------------------------------------------------
	// 필터 - 관계자 ID
	// -------------------------------------------------------------------------
	@BigIntIdFieldOptional({
		description: "담당자 ID",
	})
	assigneeId?: bigint;

	@BigIntIdFieldOptional({
		description: "고객 ID",
	})
	customerId?: bigint;

	// -------------------------------------------------------------------------
	// 필터 - 날짜 범위
	// -------------------------------------------------------------------------
	@DateFieldOptional({
		description: "생성일 시작 (ISO8601)",
	})
	startDate?: Date;

	@DateFieldOptional({
		description: "생성일 종료 (ISO8601)",
	})
	endDate?: Date;

	// -------------------------------------------------------------------------
	// 정렬
	// -------------------------------------------------------------------------
	@StringFieldOptional({
		each: true,
		description:
			"복합 정렬 (JSON:API 컨벤션). 부호 없음=ASC, -prefix=DESC. 허용 필드: createdAt, updatedAt, priority, status, lastMessageAt. 예: ?sort=-createdAt&sort=priority",
	})
	@Transform(({ value }) =>
		Array.isArray(value) ? value : value ? [value] : [],
	)
	sort?: string[];
}
