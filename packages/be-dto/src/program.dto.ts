import {
	BigIntIdField,
	ClassField,
	NumberField,
	NumberFieldOptional,
	StringField,
	StringFieldOptional,
} from "@cocrepo/decorator/field";
import type { DomainEntityModel } from "@cocrepo/entity";
import type { Program as ProgramEntity } from "@cocrepo/prisma";
import { Exclude } from "class-transformer";
import { AbstractDto } from "./abstract.dto";
import { ProgramActivityDto } from "./program-activity.dto";
import { RoutineDto } from "./routine.dto";
import { SessionDto } from "./session.dto";

export class ProgramDto
	extends AbstractDto
	implements DomainEntityModel<ProgramEntity, "programId">
{
	@Exclude()
	// biome-ignore lint/correctness/noUnusedPrivateClassMembers: class-transformer가 일반 REST 응답에서 이 필드를 제외하려면 선언이 필요합니다.
	private readonly programId?: never;

	@BigIntIdField()
	routineId: bigint;

	@BigIntIdField()
	sessionId: bigint;

	@BigIntIdField()
	instructorId: bigint;

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
