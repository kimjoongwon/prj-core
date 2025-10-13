import { RoleAssociation as RoleAssociationEntity } from "@prisma/client";
import { UseDto } from "../decorator/use-dto.decorator";
import { RoleAssociationDto } from "../dto/role-association.dto";
import { AbstractEntity } from "./abstract.entity";
import { Group } from "./group.entity";

@UseDto(RoleAssociationDto)
export class RoleAssociation
	extends AbstractEntity<RoleAssociationDto>
	implements RoleAssociationEntity
{
	roleId: string;
	groupId: string;

	group?: Group;
}
