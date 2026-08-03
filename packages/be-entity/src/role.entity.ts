import type { Role as RoleEntity } from "@cocrepo/prisma";
import { AbstractEntity } from "./abstract.entity";
import type { DomainEntityModel } from "./domain-entity-model.type";
import type { RoleAssignment } from "./role-assignment.entity";

export class Role
	extends AbstractEntity
	implements DomainEntityModel<RoleEntity>
{
	name!: string;
	displayName!: string | null;
	description!: string | null;
	assignments?: RoleAssignment[];
}
