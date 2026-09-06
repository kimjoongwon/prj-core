import {
	InquiryCategory,
	InquiryChannel,
	InquiryPriority,
	InquirySource,
	InquiryStatus,
	SentimentType,
} from "@cocrepo/enum";
import type { Inquiry as PrismaInquiry } from "@cocrepo/prisma";
import {
	BigIntIdValidation,
	BigIntIdValidationOptional,
	BooleanValidation,
	DateValidation,
	EnumValidation,
	NumberValidation,
	StringValidation,
} from "../../decorators/model-validation";
import { AbstractSchema } from "../abstract.schema";

/** Inquiry의 DB 필드 타입과 공통 검증입니다. */
export class InquirySchema extends AbstractSchema implements PrismaInquiry {
	inquiryId!: PrismaInquiry["inquiryId"];

	@BigIntIdValidation({ description: "소속 Space ID" })
	spaceId!: PrismaInquiry["spaceId"];

	@BigIntIdValidationOptional({ nullable: true, description: "생성자 ID" })
	createdById!: PrismaInquiry["createdById"];

	@StringValidation({ description: "문의 번호" })
	inquiryNumber!: PrismaInquiry["inquiryNumber"];

	@StringValidation({ description: "문의 제목" })
	title!: PrismaInquiry["title"];

	@EnumValidation(() => InquiryCategory, { description: "문의 카테고리" })
	category!: PrismaInquiry["category"];

	@EnumValidation(() => InquiryChannel, { description: "문의 채널" })
	channel!: PrismaInquiry["channel"];

	@EnumValidation(() => InquirySource, { description: "문의 접수 유형" })
	source!: PrismaInquiry["source"];

	@EnumValidation(() => InquiryStatus, { description: "문의 상태" })
	status!: PrismaInquiry["status"];

	@EnumValidation(() => InquiryPriority, { description: "문의 우선순위" })
	priority!: PrismaInquiry["priority"];

	@BigIntIdValidationOptional({ nullable: true, description: "고객 ID" })
	customerId!: PrismaInquiry["customerId"];

	@BigIntIdValidationOptional({ nullable: true, description: "담당자 ID" })
	assigneeId!: PrismaInquiry["assigneeId"];

	@DateValidation({ nullable: true, description: "첫 응답 일시" })
	firstResponseAt!: PrismaInquiry["firstResponseAt"];

	@DateValidation({ nullable: true, description: "해결 일시" })
	resolvedAt!: PrismaInquiry["resolvedAt"];

	@DateValidation({ nullable: true, description: "종료 일시" })
	closedAt!: PrismaInquiry["closedAt"];

	@DateValidation({ nullable: true, description: "SLA 응답 기한" })
	slaResponseDue!: PrismaInquiry["slaResponseDue"];

	@DateValidation({ nullable: true, description: "SLA 해결 기한" })
	slaResolveDue!: PrismaInquiry["slaResolveDue"];

	@BooleanValidation({ description: "SLA 응답 위반 여부" })
	isSlaResponseBreached!: PrismaInquiry["isSlaResponseBreached"];

	@BooleanValidation({ description: "SLA 해결 위반 여부" })
	isSlaResolveBreached!: PrismaInquiry["isSlaResolveBreached"];

	@EnumValidation(() => SentimentType, {
		nullable: true,
		description: "감정 유형",
	})
	sentiment!: PrismaInquiry["sentiment"];

	sentimentScore!: PrismaInquiry["sentimentScore"];

	@BooleanValidation({ description: "AI 해결 시도 여부" })
	aiResolutionAttempted!: PrismaInquiry["aiResolutionAttempted"];

	@BooleanValidation({ description: "AI 해결 여부" })
	aiResolved!: PrismaInquiry["aiResolved"];

	@BooleanValidation({ description: "실시간 채팅 활성화 여부" })
	isRealtimeChat!: PrismaInquiry["isRealtimeChat"];

	@DateValidation({ nullable: true, description: "마지막 메시지 일시" })
	lastMessageAt!: PrismaInquiry["lastMessageAt"];

	@NumberValidation({ description: "읽지 않은 메시지 수" })
	unreadCount!: PrismaInquiry["unreadCount"];

	metadata!: PrismaInquiry["metadata"];
}
