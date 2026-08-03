import { BigIntIdField, ClassField } from "@cocrepo/decorator/field";
import type { DomainEntityModel } from "@cocrepo/entity";
import type { UserAssociation } from "@cocrepo/prisma";
import { Exclude } from "class-transformer";
import { AbstractDto } from "./abstract.dto";
import { GroupDto } from "./group.dto";
import { UserDto } from "./user.dto";

export class UserAssociationDto
	extends AbstractDto
	implements DomainEntityModel<UserAssociation, "userAssociationId">
{
	@Exclude()
	// biome-ignore lint/correctness/noUnusedPrivateClassMembers: class-transformer가 일반 REST 응답에서 이 필드를 제외하려면 선언이 필요합니다.
	private readonly userAssociationId?: never;

	@BigIntIdField()
	userId: bigint;

	@BigIntIdField()
	groupId: bigint;

	@ClassField(() => GroupDto, { required: false, swagger: false })
	group?: GroupDto;

	@ClassField(() => UserDto, { required: false, swagger: false })
	user?: UserDto;
}
