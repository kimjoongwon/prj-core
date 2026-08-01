import {
	ClassField,
	NumberField,
	NumberFieldOptional,
	StringField,
	StringFieldOptional,
	ULIDField,
} from "@cocrepo/decorator";
import type { DomainEntityModel } from "@cocrepo/entity";
import type { Program as ProgramEntity } from "@cocrepo/prisma";
import { AbstractDto } from "./abstract.dto";
import { ProgramActivityDto } from "./program-activity.dto";
import { RoutineDto } from "./routine.dto";
import { SessionDto } from "./session.dto";

export class ProgramDto
	extends AbstractDto
	implements DomainEntityModel<ProgramEntity>
{
	@ULIDField()
	routineId: string;

	@ULIDField()
	sessionId: string;

	@ULIDField()
	instructorId: string;

	@NumberField()
	capacity: number;

	@StringField()
	name: string;

	@StringFieldOptional()
	level: string | null;

	@StringFieldOptional()
	routineNameSnapshot: string | null;

	@StringFieldOptional()
	routineLabelSnapshot: string | null;

	@NumberFieldOptional({ int: true, min: 0 })
	activityCount?: number;

	@StringFieldOptional({ each: true })
	previewExerciseNames?: string[];

	@ClassField(() => RoutineDto)
	routine?: RoutineDto;

	@ClassField(() => SessionDto)
	session?: SessionDto;

	@ClassField(() => ProgramActivityDto, {
		each: true,
		isArray: true,
		required: false,
	})
	executionPlan?: ProgramActivityDto[];
}
