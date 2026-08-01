import {
	BooleanField,
	DateField,
	EnumField,
	NumberField,
	StringField,
	ULIDField,
	ULIDFieldOptional,
} from "@cocrepo/decorator";
import { InquiryParticipantRole } from "@cocrepo/prisma";
import { AbstractDto } from "../abstract.dto";

/**
 * 문의 참여자 DTO
 */
export class InquiryParticipantDto extends AbstractDto {
	@ULIDField({ description: "소속 문의 ID" })
	inquiryId!: string;

	@ULIDFieldOptional({ description: "소속 스레드 ID" })
	threadId!: string | null;

	@ULIDField({ description: "참여자 ID" })
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
