import { StringField } from "@cocrepo/decorator/field";
import { InquiryParticipant } from "@cocrepo/entity";
import { EntityResponseType } from "../mapped-types/entity-response-type";

export class InquiryParticipantDto extends EntityResponseType(
	InquiryParticipant,
	{
		pick: [
			"id",
			"createdAt",
			"updatedAt",
			"removedAt",
			"inquiryId",
			"threadId",
			"userId",
			"role",
			"isOnline",
			"isTyping",
			"lastSeenAt",
			"lastReadAt",
			"unreadCount",
			"joinedAt",
			"leftAt",
		],
		extraFields: ["userName", "userAvatar"],
	},
) {
	@StringField({ description: "참여자 이름" })
	userName!: string;

	@StringField({ nullable: true, description: "참여자 아바타" })
	userAvatar!: string | null;
}
