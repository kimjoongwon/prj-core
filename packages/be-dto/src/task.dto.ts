import {
	BigIntIdField,
	BigIntIdFieldOptional,
	ClassField,
} from "@cocrepo/decorator/field";
import type { DomainEntityModel } from "@cocrepo/entity";
import type { Task as TaskEntity } from "@cocrepo/prisma";
import { Exclude } from "class-transformer";
import { AbstractDto } from "./abstract.dto";
import { ActivityDto } from "./activity.dto";
import { ExerciseDto } from "./exercise.dto";

export class TaskDto
	extends AbstractDto
	implements DomainEntityModel<TaskEntity, "taskId">
{
	@Exclude()
	// biome-ignore lint/correctness/noUnusedPrivateClassMembers: class-transformer가 일반 REST 응답에서 이 필드를 제외하려면 선언이 필요합니다.
	private readonly taskId?: never;

	@BigIntIdField()
	spaceId: bigint;

	@BigIntIdFieldOptional({ nullable: true })
	createdById: bigint | null;

	@ClassField(() => ExerciseDto)
	exercise?: ExerciseDto;

	@ClassField(() => ActivityDto, { isArray: true })
	activities?: ActivityDto[];
}
