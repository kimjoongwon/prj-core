import {
	BigIntIdField,
	BigIntIdFieldOptional,
	BooleanField,
	ClassField,
	DateField,
	EnumField,
	NumberField,
	StringField,
} from "@cocrepo/decorator/field";
import {
	InquiryCategory,
	InquiryChannel,
	InquiryPriority,
	InquirySource,
	InquiryStatus,
} from "@cocrepo/prisma";
import { AbstractDto } from "../abstract.dto";

import { InquiryParticipantDto } from "./inquiry-participant.dto";
import { InquiryThreadDto } from "./inquiry-thread.dto";
import { SentimentResultDto } from "./sentiment-result.dto";

/**
 * 문의 상세 응답 DTO
 */
export class InquiryDetailDto extends AbstractDto {
	@BigIntIdField({ description: "소속 Space ID" })
	spaceId!: bigint;

	@BigIntIdFieldOptional({ nullable: true, description: "생성자 ID" })
	createdById!: bigint | null;

	@StringField({ description: "문의 번호" })
	inquiryNumber!: string;

	@StringField({ description: "문의 제목" })
	title!: string;

	@EnumField(() => InquiryCategory, { description: "문의 카테리" })
	category!: InquiryCategory;

	@EnumField(() => InquiryChannel, { description: "문의 채널" })
	channel!: InquiryChannel;

	@EnumField(() => InquirySource, { description: "문의 접수 유형" })
	source!: InquirySource;

	@EnumField(() => InquiryStatus, { description: "문의 상태" })
	status!: InquiryStatus;

	@EnumField(() => InquiryPriority, { description: "문의 우선순위" })
	priority!: InquiryPriority;

	@BigIntIdFieldOptional({ description: "고객 ID" })
	customerId!: bigint | null;

	@BigIntIdFieldOptional({ description: "담당자 ID" })
	assigneeId!: bigint | null;

	@BooleanField({ description: "실시간 채팅 활성화 여부" })
	isRealtimeChat!: boolean;

	@BooleanField({ description: "SLA 응답 위반 여부" })
	isSlaResponseBreached!: boolean;

	@BooleanField({ description: "SLA 해결 위반 여부" })
	isSlaResolveBreached!: boolean;

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

	@ClassField(() => SentimentResultDto, {
		nullable: true,
		description: "감정 분석 결과",
	})
	sentiment?: SentimentResultDto | null;

	@ClassField(() => InquiryThreadDto, {
		isArray: true,
		description: "스레드 목록",
	})
	threads!: InquiryThreadDto[];

	@ClassField(() => InquiryParticipantDto, {
		isArray: true,
		description: "참여자 목록",
	})
	participants!: InquiryParticipantDto[];
}
