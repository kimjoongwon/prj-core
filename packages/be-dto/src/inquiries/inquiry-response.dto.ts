import {
	BooleanField,
	ClassField,
	DateField,
	EnumField,
	NumberField,
	StringField,
	UUIDField,
	UUIDFieldOptional,
} from "@cocrepo/decorator";
import type { Inquiry } from "@cocrepo/prisma";
import {
	InquiryCategory,
	InquiryChannel,
	InquiryPriority,
	InquirySource,
	InquiryStatus,
	SentimentType,
} from "@cocrepo/prisma";
import { AbstractDto } from "../abstract.dto";

/**
 * 문의 응답 DTO
 */
export class InquiryDto extends AbstractDto implements Partial<Inquiry> {
	@StringField({ description: "문의 번호" })
	inquiryNumber!: string;

	@StringField({ description: "문의 제목" })
	title!: string;

	@EnumField(() => InquiryCategory, { description: "문의 카테고리" })
	category!: InquiryCategory;

	@EnumField(() => InquiryChannel, { description: "문의 채널" })
	channel!: InquiryChannel;

	@EnumField(() => InquirySource, { description: "문의 접수 유형" })
	source!: InquirySource;

	@EnumField(() => InquiryStatus, { description: "문의 상태" })
	status!: InquiryStatus;

	@EnumField(() => InquiryPriority, { description: "문의 우선순위" })
	priority!: InquiryPriority;

	@UUIDFieldOptional({ description: "고객 ID" })
	customerId!: string | null;

	@UUIDFieldOptional({ description: "담당자 ID" })
	assigneeId!: string | null;

	@BooleanField({ description: "실시간 채팅 활성화 여부" })
	isRealtimeChat!: boolean;

	@BooleanField({ description: "SLA 응답 위반 여부" })
	isSlaResponseBreached!: boolean;

	@BooleanField({ description: "SLA 해결 위반 여부" })
	isSlaResolveBreached!: boolean;

	@EnumField(() => SentimentType, { nullable: true, description: "감정 유형" })
	sentiment!: SentimentType | null;

	@DateField({ nullable: true, description: "마지막 메시지 일시" })
	lastMessageAt!: Date | null;

	@NumberField({ description: "읽지 않은 메시지 수" })
	unreadCount!: number;

	@DateField({ nullable: true, description: "첫 응답 일시" })
	firstResponseAt!: Date | null;

	@DateField({ nullable: true, description: "해결 일시" })
	resolvedAt!: Date | null;

	@DateField({ nullable: true, description: "종료 일시" })
	closedAt!: Date | null;

	@DateField({ nullable: true, description: "SLA 응답 기한" })
	slaResponseDue!: Date | null;

	@DateField({ nullable: true, description: "SLA 해결 기한" })
	slaResolveDue!: Date | null;
}

/**
 * 문의 페이지네이션 메타 정보
 */
export class InquiryPaginationMetaDto {
	@NumberField({ description: "전체 개수" })
	total!: number;

	@NumberField({ description: "건너뛴 항목 수 (offset)" })
	skip!: number;

	@NumberField({ description: "조회 항목 수" })
	take!: number;

	@NumberField({ description: "전체 페이지 수" })
	totalPages!: number;
}

/**
 * 문의 통계 응답 DTO
 */
export class InquiryStatsDto {
	@NumberField({ description: "전체 문의 수" })
	total!: number;

	@NumberField({ description: "신규 문의 수" })
	new!: number;

	@NumberField({ description: "진행 중 문의 수" })
	inProgress!: number;

	@NumberField({ description: "대기 중 문의 수" })
	waiting!: number;

	@NumberField({ description: "해결된 문의 수" })
	resolved!: number;

	@NumberField({ description: "종료된 문의 수" })
	closed!: number;

	@NumberField({ description: "에스컬레이션 문의 수" })
	escalated!: number;

	@NumberField({ description: "SLA 위반 문의 수" })
	slaBreached!: number;

	@NumberField({ description: "평균 응답 시간 (분)" })
	avgResponseTime!: number;

	@NumberField({ description: "평균 해결 시간 (분)" })
	avgResolutionTime!: number;
}
