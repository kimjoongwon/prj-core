import {
	DateFieldOptional,
	EnumFieldOptional,
	StringFieldOptional,
	UUIDFieldOptional,
} from "@cocrepo/decorator";
import { DeleteFilter } from "@cocrepo/enum";
import type { InquiryCategory } from "@cocrepo/prisma";
import {
	InquiryCategory as InquiryCategoryEnum,
	type InquiryChannel,
	InquiryChannel as InquiryChannelEnum,
	type InquiryPriority,
	InquiryPriority as InquiryPriorityEnum,
	InquiryStatus,
	type Prisma,
} from "@cocrepo/prisma";
import { Transform } from "class-transformer";
import { PrismaQueryDto } from "../query/prisma-query.dto";

/**
 * 문의 목록 조회용 Query DTO
 *
 * 페이지네이션(skip/take)은 부모 QueryDto에서 상속합니다.
 *
 * 자동 매핑:
 * - category, channel, priority (enum -> 직접 매핑)
 * - assigneeId, customerId (*Id -> 정확 매칭)
 *
 * 커스텀 처리:
 * - search (제목, 고객명 OR 검색)
 * - status (DeleteFilter -> removedAt)
 * - inquiryStatus (문의 진행 상태)
 * - startDate/endDate -> createdAt (dateRangeFilter)
 */
export class QueryInquiryDto extends PrismaQueryDto<Prisma.InquiryWhereInput> {
	// -------------------------------------------------------------------------
	// 검색
	// -------------------------------------------------------------------------
	@StringFieldOptional({
		description: "검색어 (제목, 고객명)",
	})
	search?: string;

	// -------------------------------------------------------------------------
	// 필터 - Enum
	// -------------------------------------------------------------------------
	@EnumFieldOptional(() => InquiryCategoryEnum, {
		description:
			"카테고리 필터 (GENERAL, DELIVERY, PAYMENT, REFUND, PRODUCT, ACCOUNT, TECHNICAL, COMPLAINT, OTHER)",
	})
	category?: InquiryCategory;

	@EnumFieldOptional(() => InquiryChannelEnum, {
		description: "채널 필터 (WEB, EMAIL, CHAT, SMS, PHONE, WALK_IN)",
	})
	channel?: InquiryChannel;

	@EnumFieldOptional(() => InquiryPriorityEnum, {
		description: "우선순위 필터 (LOW, NORMAL, HIGH, URGENT)",
	})
	priority?: InquiryPriority;

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
	@UUIDFieldOptional({
		description: "담당자 ID",
	})
	assigneeId?: string;

	@UUIDFieldOptional({
		description: "고객 ID",
	})
	customerId?: string;

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

	// -------------------------------------------------------------------------
	// 자동 매핑 제외 필드
	// -------------------------------------------------------------------------
	/**
	 * 검색어(OR 조건), 삭제 상태(removedAt 변환), inquiryStatus(status 필드명 충돌),
	 * 날짜 범위(startDate/endDate -> createdAt)를 자동 매핑에서 제외
	 */
	protected excludeFromAutoMap(): string[] {
		return ["search", "status", "inquiryStatus", "startDate", "endDate"];
	}

	// -------------------------------------------------------------------------
	// Prisma 변환
	// -------------------------------------------------------------------------
	}
