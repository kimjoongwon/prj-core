import { Routine } from "@cocrepo/entity";
import { ActivityDto } from "./activity.dto";
import { EntityResponseType } from "./mapped-types";
import { ProgramDto } from "./program.dto";

export class RoutineDto extends EntityResponseType(Routine, {
	pick: [
		"id",
		"createdAt",
		"updatedAt",
		"removedAt",
		"name",
		"label",
		"spaceId",
		"createdById",
		"programs",
		"activities",
	] as const,
	relations: {
		programs: () => ProgramDto,
		activities: () => ActivityDto,
	},
}) {
	declare programs?: ProgramDto[];
	declare activities?: ActivityDto[];
}
