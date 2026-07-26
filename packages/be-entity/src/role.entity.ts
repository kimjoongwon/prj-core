import type { Role as RoleEntity } from "@cocrepo/prisma";
import { AbstractEntity } from "./abstract.entity";
import type { RoleAssignment } from "./role-assignment.entity";

export class Role extends AbstractEntity implements RoleEntity {
	name!: string;
	displayName!: string | null;
	description!: string | null;
	isSystem!: boolean;
	assignments?: RoleAssignment[];
}
