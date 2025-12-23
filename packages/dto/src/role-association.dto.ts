import { ClassField, UUIDField } from "@cocrepo/decorator";
import { RoleAssociation } from "@cocrepo/prisma";
import { AbstractDto, GroupDto } from ".";

export class RoleAssociationDto extends AbstractDto implements RoleAssociation {
	@UUIDField()
	roleId: string;

	@UUIDField()
	groupId: string;

	@ClassField(() => GroupDto, { required: false, swagger: false })
	group?: GroupDto;
}
