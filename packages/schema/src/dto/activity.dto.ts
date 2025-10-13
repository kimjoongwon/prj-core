import { Activity as ActivityEntity } from "@prisma/client";
import {
	ClassField,
	NumberField,
	StringFieldOptional,
	UUIDField,
} from "../decorator/field";
import { AbstractDto } from "./abstract.dto";
import { RoutineDto } from "./routine.dto";
import { TaskDto } from "./task.dto";

export class ActivityDto extends AbstractDto implements ActivityEntity {
	@UUIDField()
	routineId: string;

	@UUIDField()
	taskId: string;

	@NumberField()
	order: number;

	@NumberField()
	repetitions: number;

	@NumberField()
	restTime: number;

	@StringFieldOptional()
	notes: string | null;

	@ClassField(() => RoutineDto)
	routine?: RoutineDto;

	@ClassField(() => TaskDto)
	task?: TaskDto;
}
