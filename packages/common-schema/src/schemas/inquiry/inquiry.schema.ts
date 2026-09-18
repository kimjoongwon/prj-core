import type { JsonValue } from "@cocrepo/type";
import {
	InquiryCategory,
	InquiryChannel,
	InquiryPriority,
	InquirySource,
	InquiryStatus,
	SentimentType,
} from "@cocrepo/enum";
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
export class InquirySchema extends AbstractSchema {
	inquiryId!: string;

	@BigIntIdValidation({ description: "소속 Space ID" })
	spaceId!: bigint;

	@BigIntIdValidationOptional({ nullable: true, description: "생성자 ID" })
	createdById!: bigint | null;

	@StringValidation({ description: "문의 번호" })
	inquiryNumber!: string;

	@StringValidation({ description: "문의 제목" })
	title!: string;

	@EnumValidation(() => InquiryCategory, { description: "문의 카테고리" })
	category!: InquiryCategory;

	@EnumValidation(() => InquiryChannel, { description: "문의 채널" })
	channel!: InquiryChannel;

	@EnumValidation(() => InquirySource, { description: "문의 접수 유형" })
	source!: InquirySource;

	@EnumValidation(() => InquiryStatus, { description: "문의 상태" })
	status!: InquiryStatus;

	@EnumValidation(() => InquiryPriority, { description: "문의 우선순위" })
	priority!: InquiryPriority;

	@BigIntIdValidationOptional({ nullable: true, description: "고객 ID" })
	customerId!: bigint | null;

	@BigIntIdValidationOptional({ nullable: true, description: "담당자 ID" })
	assigneeId!: bigint | null;

	@DateValidation({ nullable: true, description: "첫 응답 일시" })
	firstResponseAt!: Date | null;

	@DateValidation({ nullable: true, description: "해결 일시" })
	resolvedAt!: Date | null;

	@DateValidation({ nullable: true, description: "종료 일시" })
	closedAt!: Date | null;

	@DateValidation({ nullable: true, description: "SLA 응답 기한" })
	slaResponseDue!: Date | null;

	@DateValidation({ nullable: true, description: "SLA 해결 기한" })
	slaResolveDue!: Date | null;

	@BooleanValidation({ description: "SLA 응답 위반 여부" })
	isSlaResponseBreached!: boolean;

	@BooleanValidation({ description: "SLA 해결 위반 여부" })
	isSlaResolveBreached!: boolean;

	@EnumValidation(() => SentimentType, {
		nullable: true,
		description: "감정 유형",
	})
	sentiment!: SentimentType | null;

	sentimentScore!: number | null;

	@BooleanValidation({ description: "AI 해결 시도 여부" })
	aiResolutionAttempted!: boolean;

	@BooleanValidation({ description: "AI 해결 여부" })
	aiResolved!: boolean;

	@BooleanValidation({ description: "실시간 채팅 활성화 여부" })
	isRealtimeChat!: boolean;

	@DateValidation({ nullable: true, description: "마지막 메시지 일시" })
	lastMessageAt!: Date | null;

	@NumberValidation({ description: "읽지 않은 메시지 수" })
	unreadCount!: number;

	metadata!: JsonValue;
}
