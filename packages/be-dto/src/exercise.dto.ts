import {
	ClassField,
	NumberField,
	StringField,
	StringFieldOptional,
	ULIDField,
	UUIDFieldOptional,
} from "@cocrepo/decorator";
import type { DomainEntityModel } from "@cocrepo/entity";
import type { Exercise as ExcerciesEntity } from "@cocrepo/prisma";
import { AbstractDto } from "./abstract.dto";
import { TaskDto } from "./task.dto";

export class ExerciseDto
	extends AbstractDto
	implements DomainEntityModel<ExcerciesEntity>
{
	@NumberField()
	duration: number;

	@NumberField()
	count: number;

	@ULIDField()
	taskId: string;

	@StringFieldOptional()
	description: string | null;

	@UUIDFieldOptional()
	imageFileId: string | null;

	@UUIDFieldOptional()
	videoFileId: string | null;

	@StringField()
	name: string;

	@ClassField(() => TaskDto)
	task?: TaskDto;
}
