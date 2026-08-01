import { ClassField, ULIDField } from "@cocrepo/decorator";
import type { DomainEntityModel } from "@cocrepo/entity";
import type { RoleAssociation } from "@cocrepo/prisma";
import { AbstractDto, GroupDto } from ".";

export class RoleAssociationDto
	extends AbstractDto
	implements DomainEntityModel<RoleAssociation>
{
	@ULIDField()
	roleId: string;

	@ULIDField()
	groupId: string;

	@ClassField(() => GroupDto, { required: false, swagger: false })
	group?: GroupDto;
}
