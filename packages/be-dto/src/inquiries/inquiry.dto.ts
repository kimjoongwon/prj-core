import { Inquiry } from "@cocrepo/entity";
import { EntityResponseType } from "../mapped-types/entity-response-type";

export class InquiryDto extends EntityResponseType(Inquiry, {
	pick: [
		"id",
		"createdAt",
		"updatedAt",
		"removedAt",
		"inquiryNumber",
		"title",
		"category",
		"channel",
		"source",
		"status",
		"priority",
		"isRealtimeChat",
		"isSlaResponseBreached",
		"isSlaResolveBreached",
		"sentiment",
		"lastMessageAt",
		"unreadCount",
		"firstResponseAt",
		"resolvedAt",
		"closedAt",
		"slaResponseDue",
		"slaResolveDue",
	],
}) {}
