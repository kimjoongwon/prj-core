import type { Role as RoleEntity } from "@cocrepo/prisma";
import { AbstractEntity } from "./abstract.entity";
import type { RolePolicy } from "./role-policy.entity";

export class Role extends AbstractEntity implements RoleEntity {
	name!: string;
	displayName!: string | null;
	description!: string | null;
	isSystem!: boolean;
	rolePolicies?: RolePolicy[];
}
