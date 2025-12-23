import { ClassField, UUIDField } from "@cocrepo/decorator";
import { UserAssociation } from "@cocrepo/prisma";
import { AbstractDto, GroupDto, UserDto } from ".";

export class UserAssociationDto extends AbstractDto implements UserAssociation {
	@UUIDField()
	userId: string;

	@UUIDField()
	groupId: string;

	@ClassField(() => GroupDto, { required: false, swagger: false })
	group?: GroupDto;

	@ClassField(() => UserDto, { required: false, swagger: false })
	user?: UserDto;
}
