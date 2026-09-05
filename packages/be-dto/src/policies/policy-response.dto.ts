import { Policy } from "@cocrepo/entity";
import { EntityResponseType } from "../mapped-types";
import { PolicyEntryResponseDto } from "./policy-entry-response.dto";

export class PolicyResponseDto extends EntityResponseType(Policy, {
	pick: [
		"id",
		"spaceId",
		"createdById",
		"name",
		"displayName",
		"description",
		"createdAt",
		"updatedAt",
		"removedAt",
		"entries",
	] as const,
	relations: { entries: () => PolicyEntryResponseDto },
}) {
	declare entries?: PolicyEntryResponseDto[];
}
