import {
	ClassField,
	NumberFieldOptional,
	StringFieldOptional,
} from "@cocrepo/decorator/field";
import { Program } from "@cocrepo/entity";
import { EntityResponseType } from "./mapped-types";
import { ProgramActivityDto } from "./program-activity.dto";
import { RoutineDto } from "./routine.dto";
import { SessionDto } from "./session.dto";

export class ProgramDto extends EntityResponseType(Program, {
	pick: [
		"id",
		"createdAt",
		"updatedAt",
		"removedAt",
		"routineId",
		"sessionId",
		"instructorId",
		"capacity",
		"name",
		"level",
		"routineNameSnapshot",
		"routineLabelSnapshot",
		"routine",
		"session",
	] as const,
	relations: {
		routine: () => RoutineDto,
		session: () => SessionDto,
	},
	extraFields: ["activityCount", "previewExerciseNames", "executionPlan"],
}) {
	@NumberFieldOptional({ int: true, min: 0 })
	activityCount?: number;

	@StringFieldOptional({ each: true })
	previewExerciseNames?: string[];

	@ClassField(() => ProgramActivityDto, {
		each: true,
		isArray: true,
		required: false,
	})
	executionPlan?: ProgramActivityDto[];

	declare routine?: RoutineDto;
	declare session?: SessionDto;
}
