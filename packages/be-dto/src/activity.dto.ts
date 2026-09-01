import {
	BigIntIdField,
	ClassField,
	NumberField,
	StringFieldOptional,
} from "@cocrepo/decorator/field";
import type { DomainEntityModel } from "@cocrepo/entity";
import type { Activity as ActivityEntity } from "@cocrepo/prisma";
import { Exclude } from "class-transformer";
import { AbstractDto } from "./abstract.dto";
import { RoutineDto } from "./routine.dto";
import { TaskDto } from "./task.dto";

export class ActivityDto
	extends AbstractDto
	implements DomainEntityModel<ActivityEntity, "activityId">
{
	@Exclude()
	// biome-ignore lint/correctness/noUnusedPrivateClassMembers: class-transformer가 일반 REST 응답에서 이 필드를 제외하려면 선언이 필요합니다.
	private readonly activityId?: never;

	@BigIntIdField()
	routineId: bigint;

	@BigIntIdField()
	taskId: bigint;

	@NumberField()
	order: number;

	@NumberField()
	repetitions: number;

	@NumberField()
	restTime: number;

	@StringFieldOptional({ nullable: true })
	notes: string | null;

	@ClassField(() => RoutineDto)
	routine?: RoutineDto;

	@ClassField(() => TaskDto)
	task?: TaskDto;
}
