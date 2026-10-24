import { InquiryThread } from "@cocrepo/entity";
import { EntityResponseType } from "../mapped-types/entity-response-type";

export class InquiryThreadDto extends EntityResponseType(InquiryThread, {
	pick: [
		"id",
		"createdAt",
		"updatedAt",
		"removedAt",
		"title",
		"status",
		"lastMessageAt",
		"lastMessagePreview",
		"messageCount",
	],
}) {}
