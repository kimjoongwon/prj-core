import { WhitelistEntry } from "@cocrepo/entity";
import { EntityResponseType } from "./mapped-types";

export class WhitelistEntryDto extends EntityResponseType(WhitelistEntry, {
	pick: [
		"id",
		"createdAt",
		"updatedAt",
		"type",
		"value",
		"description",
		"isActive",
	] as const,
}) {}
