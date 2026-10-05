import { Inquiry } from "@cocrepo/entity";
import { EntityResponseType } from "../mapped-types/entity-response-type";

export class InquiryDto extends EntityResponseType(Inquiry, {
	pick: [
		"id",
		"createdAt",
		"updatedAt",
		"removedAt",
		"spaceId",
		"createdById",
		"inquiryNumber",
		"title",
		"category",
		"channel",
		"source",
		"status",
		"priority",
		"customerId",
		"assigneeId",
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
