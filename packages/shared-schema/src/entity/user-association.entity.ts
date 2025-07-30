import { UserAssociation as UserAssociationEntity } from "@prisma/client";
import { UseDto } from "../decorator/use-dto.decorator";
import { UserAssociationDto } from "../dto/user-association.dto";
import { AbstractEntity } from "./abstract.entity";
import { Group } from "./group.entity";
import { User } from "./user.entity";

@UseDto(UserAssociationDto)
export class UserAssociation
	extends AbstractEntity<UserAssociationDto>
	implements UserAssociationEntity
{
	userId: string;
	groupId: string;

	group?: Group;
	user?: User;
}
