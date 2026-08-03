import {
	BigIntIdField,
	BigIntIdFieldOptional,
	EnumField,
	StringField,
	StringFieldOptional,
} from "@cocrepo/decorator/field";
import type { DomainEntityModel } from "@cocrepo/entity";
import type { Group } from "@cocrepo/prisma";
import { GroupTypes } from "@cocrepo/prisma";
import { Exclude } from "class-transformer";
import { AbstractDto } from "./abstract.dto";

export class GroupDto
	extends AbstractDto
	implements DomainEntityModel<Group, "groupId">
{
	@Exclude()
	// biome-ignore lint/correctness/noUnusedPrivateClassMembers: class-transformer가 일반 REST 응답에서 이 필드를 제외하려면 선언이 필요합니다.
	private readonly groupId?: never;

	@BigIntIdField()
	spaceId!: bigint;

	@StringField()
	name!: string;

	@StringFieldOptional({ nullable: true })
	label!: string | null;

	@EnumField(() => GroupTypes, { required: true })
	type!: GroupTypes;

	@BigIntIdFieldOptional({ nullable: true })
	createdById!: bigint | null;
}
