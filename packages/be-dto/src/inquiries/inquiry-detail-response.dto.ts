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
import {
	InquiryCategory,
	InquiryChannel,
	InquiryParticipantRole,
	InquiryPriority,
	InquirySource,
	InquiryStatus,
	SentimentType,
	ThreadStatus,
} from "@cocrepo/prisma";
import { AbstractDto } from "../abstract.dto";

/**
 * 문의 스레드 DTO
 */
export class InquiryThreadDto extends AbstractDto {
	@UUIDField({ description: "소속 문의 ID" })
	inquiryId!: string;

	@StringField({ nullable: true, description: "스레드 제목" })
	title!: string | null;

	@EnumField(() => ThreadStatus, { description: "스레드 상태" })
	status!: ThreadStatus;

	@UUIDField({ description: "생성자 ID" })
	createdBy!: string;

	@DateField({ nullable: true, description: "마지막 메시지 일시" })
	lastMessageAt!: Date | null;

	@StringField({ nullable: true, description: "마지막 메시지 미리보기" })
	lastMessagePreview!: string | null;

	@NumberField({ description: "메시지 수" })
	messageCount!: number;
}

/**
 * 문의 참여자 DTO
 */
export class InquiryParticipantDto extends AbstractDto {
	@UUIDField({ description: "소속 문의 ID" })
	inquiryId!: string;

	@UUIDFieldOptional({ description: "소속 스레드 ID" })
	threadId!: string | null;

	@UUIDField({ description: "참여자 ID" })
	userId!: string;

	@StringField({ description: "참여자 이름" })
	userName!: string;

	@StringField({ nullable: true, description: "참여자 아바타" })
	userAvatar!: string | null;

	@EnumField(() => InquiryParticipantRole, { description: "참여자 역할" })
	role!: InquiryParticipantRole;

	@BooleanField({ description: "온라인 여부" })
	isOnline!: boolean;

	@BooleanField({ description: "타이핑 중 여부" })
	isTyping!: boolean;

	@DateField({ nullable: true, description: "마지막 접속 시간" })
	lastSeenAt!: Date | null;

	@DateField({ nullable: true, description: "마지막 읽은 시간" })
	lastReadAt!: Date | null;

	@NumberField({ description: "읽지 않은 메시지 수" })
	unreadCount!: number;

	@DateField({ description: "참여 일시" })
	joinedAt!: Date;

	@DateField({ nullable: true, description: "나간 일시" })
	leftAt!: Date | null;
}

/**
 * 감정 분석 결과 DTO
 */
export class SentimentResultDto extends AbstractDto {
	@UUIDField({ description: "소속 문의 ID" })
	inquiryId!: string;

	@UUIDFieldOptional({ description: "분석 대상 메시지 ID" })
	messageId!: string | null;

	@EnumField(() => SentimentType, { description: "감정 유형" })
	sentiment!: SentimentType;

	@NumberField({ description: "감정 점수 (-1.0 ~ 1.0)" })
	score!: number;

	@NumberField({ description: "분석 신뢰도 (0.0 ~ 1.0)" })
	confidence!: number;

	@NumberField({ nullable: true, description: "긴급도 점수 (0.0 ~ 1.0)" })
	urgency!: number | null;

	@DateField({ description: "분석 일시" })
	analyzedAt!: Date;
}

/**
 * 문의 상세 응답 DTO
 */
export class InquiryDetailDto extends AbstractDto {
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
