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
import { MessageContentType, SenderType } from "@cocrepo/prisma";
import { AbstractDto } from "../abstract.dto";

/**
 * 메시지 첨부파일 DTO
 */
export class InquiryAttachmentDto extends AbstractDto {
	@UUIDField({ description: "소속 메시지 ID" })
	messageId!: string;

	@StringField({ description: "원본 파일명" })
	fileName!: string;

	@NumberField({ description: "파일 크기 (bytes)" })
	fileSize!: number;

	@StringField({ description: "MIME 타입" })
	mimeType!: string;

	@StringField({ description: "파일 URL" })
	url!: string;

	@StringField({ nullable: true, description: "썸네일 URL" })
	thumbnailUrl!: string | null;

	@NumberField({ nullable: true, description: "이미지 너비" })
	width!: number | null;

	@NumberField({ nullable: true, description: "이미지 높이" })
	height!: number | null;

	@NumberField({ nullable: true, description: "재생 시간 (초)" })
	duration!: number | null;

	@BooleanField({ description: "삭제 여부" })
	isDeleted!: boolean;
}

/**
 * 문의 메시지 응답 DTO
 */
export class InquiryMessageDto extends AbstractDto {
	@UUIDField({ description: "소속 스레드 ID" })
	threadId!: string;

	@UUIDField({ description: "소속 문의 ID" })
	inquiryId!: string;

	@UUIDFieldOptional({ description: "발신자 ID" })
	senderId!: string | null;

	@StringField({ description: "발신자 이름" })
	senderName!: string;

	@StringField({ nullable: true, description: "발신자 아바타" })
	senderAvatar!: string | null;

	@EnumField(() => SenderType, { description: "발신자 유형" })
	senderType!: SenderType;

	@StringField({ description: "메시지 내용" })
	content!: string;

	@EnumField(() => MessageContentType, { description: "콘텐츠 유형" })
	contentType!: MessageContentType;

	@UUIDFieldOptional({ description: "클라이언트 메시지 ID" })
	clientMessageId!: string | null;

	@BooleanField({ description: "수정 여부" })
	isEdited!: boolean;

	@BooleanField({ description: "삭제 여부" })
	isDeleted!: boolean;

	@DateField({ nullable: true, description: "수정 일시" })
	editedAt!: Date | null;

	@DateField({ nullable: true, description: "전달 완료 시간" })
	deliveredAt!: Date | null;

	@DateField({ nullable: true, description: "읽음 확인 시간" })
	readAt!: Date | null;

	@ClassField(() => InquiryAttachmentDto, {
		isArray: true,
		required: false,
		description: "첨부파일 목록",
	})
	attachments?: InquiryAttachmentDto[];
}

/**
 * 메시지 페이지네이션 메타 정보
 */
export class InquiryMessagePaginationMetaDto {
	@NumberField({ description: "전체 개수" })
	total!: number;

	@NumberField({ description: "건너뛴 항목 수 (offset)" })
	skip!: number;

	@NumberField({ description: "조회 항목 수" })
	take!: number;

	@NumberField({ description: "전체 페이지 수" })
	totalPages!: number;
}
