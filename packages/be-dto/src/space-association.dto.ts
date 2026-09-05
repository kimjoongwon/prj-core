import { SpaceAssociation } from "@cocrepo/entity";
import { GroupDto } from "./group.dto";
import { EntityResponseType } from "./mapped-types";

export class SpaceAssociationDto extends EntityResponseType(SpaceAssociation, {
	pick: [
		"id",
		"createdAt",
		"updatedAt",
		"removedAt",
		"spaceId",
		"groupId",
		"group",
	] as const,
	relations: {
		group: () => GroupDto,
	},
}) {
	declare group?: GroupDto;
}
