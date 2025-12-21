import { Role as RoleEntity, Roles } from "@prisma/client";
import { AbstractEntity } from "./abstract.entity";

export class Role extends AbstractEntity implements RoleEntity {
	name!: Roles;
}
