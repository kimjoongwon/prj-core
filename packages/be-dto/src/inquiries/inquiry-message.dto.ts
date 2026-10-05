import { StringField } from "@cocrepo/decorator/field";
import { InquiryMessage } from "@cocrepo/entity";
import { EntityResponseType } from "../mapped-types/entity-response-type";
import { InquiryAttachmentDto } from "./inquiry-attachment.dto";

export class InquiryMessageDto extends EntityResponseType(InquiryMessage, {
	pick: [
		"id",
		"createdAt",
		"updatedAt",
		"removedAt",
		"threadId",
		"inquiryId",
		"senderId",
		"senderType",
		"content",
		"contentType",
		"clientMessageId",
		"isEdited",
		"isDeleted",
		"editedAt",
		"deliveredAt",
		"readAt",
		"attachments",
	],
	relations: { attachments: () => InquiryAttachmentDto },
	extraFields: ["senderName", "senderAvatar"],
}) {
	@StringField({ description: "발신자 이름" })
	senderName!: string;

	@StringField({ nullable: true, description: "발신자 아바타" })
	senderAvatar!: string | null;
	declare attachments?: InquiryAttachmentDto[];
}
