import { ProgramActivity } from "@cocrepo/entity";
import { EntityResponseType } from "./mapped-types";

export class ProgramActivityDto extends EntityResponseType(ProgramActivity, {
	pick: [
		"id",
		"createdAt",
		"updatedAt",
		"removedAt",
		"programId",
		"taskId",
		"order",
		"repetitions",
		"restTime",
		"notes",
		"exerciseName",
		"exerciseDescription",
		"exerciseDuration",
		"exerciseCount",
		"imageFileId",
		"videoFileId",
	] as const,
}) {}
