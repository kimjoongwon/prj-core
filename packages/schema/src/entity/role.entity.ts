import { Role as RoleEntity, Roles } from "@prisma/client";
import { UseDto } from "../decorator/use-dto.decorator";
import { RoleDto } from "../dto";
import { AbstractEntity } from "./abstract.entity";

@UseDto(RoleDto)
export class Role extends AbstractEntity<RoleDto> implements RoleEntity {
	name: Roles;
}
