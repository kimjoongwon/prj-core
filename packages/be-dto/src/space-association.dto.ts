import { ClassField, ULIDField } from "@cocrepo/decorator";
import type { DomainEntityModel } from "@cocrepo/entity";
import type { SpaceAssociation } from "@cocrepo/prisma";
import { AbstractDto, GroupDto } from ".";

export class SpaceAssociationDto
	extends AbstractDto
	implements DomainEntityModel<SpaceAssociation>
{
	@ULIDField()
	spaceId: string;

	@ULIDField()
	groupId: string;

	@ClassField(() => GroupDto, { required: false, swagger: false })
	group?: GroupDto;
}
