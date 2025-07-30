import { $Enums, Role as RoleEntity } from "@prisma/client";
import { UseDto } from "../decorator/use-dto.decorator";
import { RoleDto } from "../dto";
import { AbstractEntity } from "./abstract.entity";

@UseDto(RoleDto)
export class Role extends AbstractEntity<RoleDto> implements RoleEntity {
	name: $Enums.Roles;
}
