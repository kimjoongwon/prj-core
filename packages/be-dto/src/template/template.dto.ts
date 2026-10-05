import { Template } from "@cocrepo/entity";
import { EntityResponseType } from "../mapped-types";

export class TemplateDto extends EntityResponseType(Template, {
	pick: [
		"id",
		"createdAt",
		"updatedAt",
		"removedAt",
		"code",
		"name",
		"type",
		"subject",
		"content",
		"description",
		"isActive",
	] as const,
}) {}
