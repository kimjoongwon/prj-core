import type { Tenant as TenantEntity } from "@cocrepo/prisma";
import { AbstractEntity } from "./abstract.entity";
import type { DomainEntityModel } from "./domain-entity-model.type";
import type { Role } from "./role.entity";
import type { Space } from "./space.entity";
import type { User } from "./user.entity";

export class Tenant
	extends AbstractEntity
	implements DomainEntityModel<TenantEntity>
{
	main!: boolean;
	spaceId!: string;
	userId!: string;
	roleId!: string;
	space?: Space;
	user?: User;
	role?: Role;
}
