import { Role as RoleEntity, Roles } from "@cocrepo/prisma";
import { AbstractEntity } from "./abstract.entity";

export class Role extends AbstractEntity implements RoleEntity {
	name!: Roles;
}
