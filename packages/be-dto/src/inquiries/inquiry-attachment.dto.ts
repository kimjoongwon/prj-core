import { NumberField } from "@cocrepo/decorator/field";
import { InquiryAttachment } from "@cocrepo/entity";
import { EntityResponseType } from "../mapped-types/entity-response-type";

export class InquiryAttachmentDto extends EntityResponseType(
	InquiryAttachment,
	{
		pick: [
			"id",
			"createdAt",
			"updatedAt",
			"removedAt",
			"messageId",
			"fileName",
			"mimeType",
			"url",
			"thumbnailUrl",
			"width",
			"height",
			"duration",
			"isDeleted",
		],
		extraFields: ["fileSize"],
	},
) {
	@NumberField({ description: "파일 크기 (bytes)" })
	fileSize!: number;
}
