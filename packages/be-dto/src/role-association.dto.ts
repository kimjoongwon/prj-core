import { RoleAssociation } from "@cocrepo/entity";
import { GroupDto } from "./group.dto";
import { EntityResponseType } from "./mapped-types";

export class RoleAssociationDto extends EntityResponseType(RoleAssociation, {
	pick: [
		"id",
		"createdAt",
		"updatedAt",
		"removedAt",
		"roleId",
		"groupId",
		"group",
	] as const,
	relations: {
		group: () => GroupDto,
	},
}) {
	declare group?: GroupDto;
}
