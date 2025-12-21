import { Tenant as TenantEntity } from "@cocrepo/prisma";
import { AbstractEntity } from "./abstract.entity";
import { Role } from "./role.entity";
import { Space } from "./space.entity";
import { User } from "./user.entity";

export class Tenant extends AbstractEntity implements TenantEntity {
	main!: boolean;
	spaceId!: string;
	userId!: string;
	roleId!: string;
	space?: Space;
	user?: User;
	role?: Role;
}
