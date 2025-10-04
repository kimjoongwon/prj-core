import { Exercise as ExcerciesEntity } from "@prisma/client";
import {
	ClassField,
	NumberField,
	StringField,
	StringFieldOptional,
	UUIDField,
	UUIDFieldOptional,
} from "../decorator";
import { AbstractDto } from "./abstract.dto";
import { TaskDto } from "./task.dto";

export class ExerciseDto extends AbstractDto implements ExcerciesEntity {
	@NumberField()
	duration: number;

	@NumberField()
	count: number;

	@UUIDField()
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
