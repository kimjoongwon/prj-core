import {
	NumberField,
	StringField,
	StringFieldOptional,
	ULIDField,
	UUIDFieldOptional,
} from "@cocrepo/decorator";
import type { DomainEntityModel } from "@cocrepo/entity";
import type { ProgramActivity as ProgramActivityEntity } from "@cocrepo/prisma";
import { AbstractDto } from "./abstract.dto";

export class ProgramActivityDto
	extends AbstractDto
	implements DomainEntityModel<ProgramActivityEntity>
{
	@ULIDField()
	programId: string;

	@ULIDField()
	taskId: string;

	@NumberField()
	order: number;

	@NumberField()
	repetitions: number;

	@NumberField()
	restTime: number;

	@StringFieldOptional()
	notes: string | null;

	@StringField()
	exerciseName: string;

	@StringFieldOptional()
	exerciseDescription: string | null;

	@NumberField()
	exerciseDuration: number;

	@NumberField()
	exerciseCount: number;

	@UUIDFieldOptional()
	imageFileId: string | null;

	@UUIDFieldOptional()
	videoFileId: string | null;
}
