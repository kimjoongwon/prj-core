import { ClassField, ULIDField } from "@cocrepo/decorator";
import type { DomainEntityModel } from "@cocrepo/entity";
import type { UserAssociation } from "@cocrepo/prisma";
import { AbstractDto, GroupDto, UserDto } from ".";

export class UserAssociationDto
	extends AbstractDto
	implements DomainEntityModel<UserAssociation>
{
	@ULIDField()
	userId: string;

	@ULIDField()
	groupId: string;

	@ClassField(() => GroupDto, { required: false, swagger: false })
	group?: GroupDto;

	@ClassField(() => UserDto, { required: false, swagger: false })
	user?: UserDto;
}
