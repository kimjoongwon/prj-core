import {
	BigIntIdField,
	DateField,
	EnumField,
	NumberField,
	StringField,
} from "@cocrepo/decorator/field";
import { ThreadStatus } from "@cocrepo/prisma";
import { AbstractDto } from "../abstract.dto";

/**
 * 문의 스레드 DTO
 */
export class InquiryThreadDto extends AbstractDto {
	@BigIntIdField({ description: "소속 문의 ID" })
	inquiryId!: bigint;

	@StringField({ nullable: true, description: "스레드 제목" })
	title!: string | null;

	@EnumField(() => ThreadStatus, { description: "스레드 상태" })
	status!: ThreadStatus;

	@BigIntIdField({ description: "생성자 ID" })
	createdById!: bigint;

	@DateField({ nullable: true, description: "마지막 메시지 일시" })
	lastMessageAt!: Date | null;

	@StringField({ nullable: true, description: "마지막 메시지 미리보기" })
	lastMessagePreview!: string | null;

	@NumberField({ description: "메시지 수" })
	messageCount!: number;
}
