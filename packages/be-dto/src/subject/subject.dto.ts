import { Subject } from "@cocrepo/entity";
import { EntityResponseType } from "../mapped-types";

export class SubjectDto extends EntityResponseType(Subject, {
	pick: [
		"id",
		"createdAt",
		"updatedAt",
		"removedAt",
		"name",
		"displayName",
		"icon",
		"group",
		"order",
	] as const,
}) {}
