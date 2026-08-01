import { ClassField, StringField, ULIDField } from "@cocrepo/decorator";
import type { DomainEntityModel } from "@cocrepo/entity";
import type { Tenant } from "@cocrepo/prisma";
import { RoleDto, SpaceDto, UserDto } from ".";
import { AbstractDto } from "./abstract.dto";

export class TenantDto
	extends AbstractDto
	implements DomainEntityModel<Tenant>
{
	@ULIDField()
	roleId: string;

	@StringField()
	userId: string;

	@StringField()
	spaceId: string;

	@ClassField(() => UserDto, { required: false })
	user?: UserDto;

	@ClassField(() => SpaceDto, { required: false })
	space?: SpaceDto;

	@ClassField(() => RoleDto, { required: false })
	role?: RoleDto;
}
