import {
	BooleanField,
	ClassField,
	StringField,
	UUIDField,
} from "@cocrepo/decorator";
import { Tenant } from "@cocrepo/prisma";
import { RoleDto, SpaceDto, UserDto } from ".";
import { AbstractDto } from "./abstract.dto";

export class TenantDto extends AbstractDto implements Tenant {
	@BooleanField({ default: false })
	main: boolean;

	@UUIDField()
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
