import { Group } from "@cocrepo/entity";
import { EntityResponseType } from "./mapped-types";

export class GroupDto extends EntityResponseType(Group, {
	pick: [
		"id",
		"createdAt",
		"updatedAt",
		"removedAt",
		"spaceId",
		"name",
		"label",
		"type",
		"createdById",
	] as const,
}) {}
