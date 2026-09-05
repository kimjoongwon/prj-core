import { Action } from "@cocrepo/entity";
import { EntityResponseType } from "./mapped-types";

export class ActionDto extends EntityResponseType(Action, {
	pick: [
		"id",
		"createdAt",
		"updatedAt",
		"removedAt",
		"name",
		"displayName",
		"description",
		"group",
		"order",
		"config",
	] as const,
}) {}
