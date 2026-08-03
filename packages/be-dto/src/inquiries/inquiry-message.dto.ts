import {
	BigIntIdField,
	BigIntIdFieldOptional,
	BooleanField,
	ClassField,
	DateField,
	EnumField,
	StringField,
	UUIDFieldOptional,
} from "@cocrepo/decorator/field";
import { MessageContentType, SenderType } from "@cocrepo/prisma";
import { AbstractDto } from "../abstract.dto";

import { InquiryAttachmentDto } from "./inquiry-attachment.dto";

/**
 * 문의 메시지 응답 DTO
 */
export class InquiryMessageDto extends AbstractDto {
	@BigIntIdField({ description: "소속 스레드 ID" })
	threadId!: bigint;

	@BigIntIdField({ description: "소속 문의 ID" })
	inquiryId!: bigint;

	@BigIntIdFieldOptional({ description: "발신자 ID" })
	senderId!: bigint | null;

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
