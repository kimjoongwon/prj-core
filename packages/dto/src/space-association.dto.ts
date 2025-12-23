import { ClassField, UUIDField } from "@cocrepo/decorator";
import { SpaceAssociation } from "@cocrepo/prisma";
import { AbstractDto, GroupDto } from ".";

export class SpaceAssociationDto
	extends AbstractDto
	implements SpaceAssociation
{
	@UUIDField()
	spaceId: string;

	@UUIDField()
	groupId: string;

	@ClassField(() => GroupDto, { required: false, swagger: false })
	group?: GroupDto;
}
