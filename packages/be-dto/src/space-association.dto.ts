import { BigIntIdField, ClassField } from "@cocrepo/decorator/field";
import type { DomainEntityModel } from "@cocrepo/entity";
import type { SpaceAssociation } from "@cocrepo/prisma";
import { Exclude } from "class-transformer";
import { AbstractDto } from "./abstract.dto";
import { GroupDto } from "./group.dto";

export class SpaceAssociationDto
	extends AbstractDto
	implements DomainEntityModel<SpaceAssociation, "spaceAssociationId">
{
	@Exclude()
	// biome-ignore lint/correctness/noUnusedPrivateClassMembers: class-transformer가 일반 REST 응답에서 이 필드를 제외하려면 선언이 필요합니다.
	private readonly spaceAssociationId?: never;

	@BigIntIdField()
	spaceId: bigint;

	@BigIntIdField()
	groupId: bigint;

	@ClassField(() => GroupDto, { required: false, swagger: false })
	group?: GroupDto;
}
