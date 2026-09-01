import {
	BigIntIdField,
	ClassField,
	NumberField,
	StringField,
	StringFieldOptional,
	UUIDFieldOptional,
} from "@cocrepo/decorator/field";
import type { DomainEntityModel } from "@cocrepo/entity";
import type { Exercise as ExcerciesEntity } from "@cocrepo/prisma";
import { Exclude } from "class-transformer";
import { AbstractDto } from "./abstract.dto";
import { TaskDto } from "./task.dto";

export class ExerciseDto
	extends AbstractDto
	implements DomainEntityModel<ExcerciesEntity, "exerciseId">
{
	@Exclude()
	// biome-ignore lint/correctness/noUnusedPrivateClassMembers: class-transformer가 일반 REST 응답에서 이 필드를 제외하려면 선언이 필요합니다.
	private readonly exerciseId?: never;

	@NumberField()
	duration: number;

	@NumberField()
	count: number;

	@BigIntIdField()
	taskId: bigint;

	@StringFieldOptional({ nullable: true })
	description: string | null;

	@UUIDFieldOptional({ nullable: true })
	imageFileId: string | null;

	@UUIDFieldOptional({ nullable: true })
	videoFileId: string | null;

	@StringField()
	name: string;

	@ClassField(() => TaskDto)
	task?: TaskDto;
}
