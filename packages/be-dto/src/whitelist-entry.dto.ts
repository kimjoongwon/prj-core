import {
	BigIntIdField,
	BooleanField,
	DateField,
	DateFieldOptional,
	EnumField,
	StringField,
	StringFieldOptional,
} from "@cocrepo/decorator/field";
import type { DomainEntityModel } from "@cocrepo/entity";
import { type WhitelistEntry, WhitelistType } from "@cocrepo/prisma";
import { Exclude } from "class-transformer";

/**
 * 화이트리스트 항목 응답 DTO
 */
export class WhitelistEntryDto
	implements DomainEntityModel<WhitelistEntry, "whitelistEntryId">
{
	@Exclude()
	// biome-ignore lint/correctness/noUnusedPrivateClassMembers: class-transformer가 일반 REST 응답에서 이 필드를 제외하려면 선언이 필요합니다.
	private readonly whitelistEntryId?: never;

	@BigIntIdField({ description: "ID" })
	id!: bigint;

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
