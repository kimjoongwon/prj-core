import { Group } from "@cocrepo/entity";
import { EntityResponseType } from "./mapped-types";

export class GroupDto extends EntityResponseType(Group, {
	pick: [
		"id",
		"createdAt",
		"updatedAt",
		"removedAt",
		"name",
		"label",
		"type",
	] as const,
}) {}
