import { Exercise as ExcerciseEntity } from "@prisma/client";
import { UseDto } from "../decorator/use-dto.decorator";
import { ExerciseDto } from "../dto/exercise.dto";
import { AbstractEntity } from "./abstract.entity";
import { Task } from "./task.entity";

@UseDto(ExerciseDto)
export class Exercise
	extends AbstractEntity<ExerciseDto>
	implements ExcerciseEntity
{
	duration: number;
	count: number;
	taskId: string;
	description: string | null;
	imageFileId: string | null;
	videoFileId: string | null;
	name: string;

	task?: Task;
}
