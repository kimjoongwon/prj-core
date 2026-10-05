import { UserAssociation } from "@cocrepo/entity";
import { GroupDto } from "./group.dto";
import { EntityResponseType } from "./mapped-types";
import { UserDto } from "./user.dto";

export class UserAssociationDto extends EntityResponseType(UserAssociation, {
	pick: [
		"id",
		"createdAt",
		"updatedAt",
		"removedAt",
		"userId",
		"groupId",
		"group",
		"user",
	] as const,
	relations: {
		group: () => GroupDto,
		user: () => UserDto,
	},
}) {
	declare group?: GroupDto;
	declare user?: UserDto;
}
