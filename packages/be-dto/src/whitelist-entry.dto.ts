import {
	BooleanField,
	DateField,
	DateFieldOptional,
	EnumField,
	StringField,
	StringFieldOptional,
	UUIDField,
} from "@cocrepo/decorator";
import { type WhitelistEntry, WhitelistType } from "@cocrepo/prisma";

/**
 * 화이트리스트 항목 응답 DTO
 */
export class WhitelistEntryDto implements WhitelistEntry {
	@UUIDField({ description: "ID" })
	id!: string;

	@DateField({ description: "생성일" })
	createdAt!: Date;

	@DateFieldOptional({ nullable: true, description: "수정일" })
	updatedAt!: Date | null;

	@EnumField(() => WhitelistType, { description: "유형" })
	type!: WhitelistType;

	@StringField({ description: "값" })
	value!: string;

	@StringFieldOptional({ nullable: true, description: "설명" })
	description!: string | null;

	@BooleanField({ description: "활성 여부" })
	isActive!: boolean;
}
