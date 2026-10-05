import { TemplateVariable } from "@cocrepo/entity";
import { EntityResponseType } from "../mapped-types";

export class TemplateVariableDto extends EntityResponseType(TemplateVariable, {
	pick: [
		"id",
		"createdAt",
		"updatedAt",
		"name",
		"description",
		"defaultValue",
		"isRequired",
		"templateId",
	] as const,
}) {}
