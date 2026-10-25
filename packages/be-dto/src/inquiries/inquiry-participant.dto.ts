import {
	StringField,
	ULIDField,
	ULIDFieldOptional,
} from "@cocrepo/decorator/field";
import { InquiryParticipant } from "@cocrepo/entity";
import { Expose, Transform } from "class-transformer";
import { EntityResponseType } from "../mapped-types/entity-response-type";

export class InquiryParticipantDto extends EntityResponseType(
	InquiryParticipant,
	{
		pick: [
			"id",
			"createdAt",
			"updatedAt",
			"removedAt",
			"role",
			"isOnline",
			"isTyping",
			"lastSeenAt",
			"lastReadAt",
			"unreadCount",
			"joinedAt",
			"leftAt",
		],
		extraFields: ["userName", "userAvatar", "inquiryId", "threadId", "userId"],
	},
) {
	@StringField({ nullable: true, description: "참여자 이름" })
	userName!: string | null;

	@StringField({ nullable: true, description: "참여자 아바타" })
	userAvatar!: string | null;

	/** 관계의 공개 ULID를 평평한 참조 필드로 노출합니다. */
	@ULIDField({ description: "소속 문의 ULID" })
	@Expose()
	@Transform(({ obj }) => obj?.inquiry?.id ?? null, { toClassOnly: true })
	declare inquiryId: string;

	@ULIDFieldOptional({ nullable: true, description: "소속 스레드 ULID" })
	@Expose()
	@Transform(({ obj }) => obj?.thread?.id ?? null, { toClassOnly: true })
	declare threadId: string | null;

	@ULIDField({ description: "참여자 사용자 ULID" })
	@Expose()
	@Transform(({ obj }) => obj?.user?.id ?? null, { toClassOnly: true })
	declare userId: string;
}
