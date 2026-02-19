import { ClassField, StringField, StringFieldOptional } from "@cocrepo/decorator";
import type { Routine } from "@cocrepo/prisma";
import { AbstractDto } from "./abstract.dto";
import { ActivityDto } from "./activity.dto";
import { ProgramDto } from "./program.dto";

export class RoutineDto extends AbstractDto implements Routine {
	@StringField()
	name: string;

	@StringField()
	label: string;

	@StringField()
	spaceId: string;

	@StringFieldOptional()
	creatorId: string | null;

	@ClassField(() => ProgramDto, { isArray: true })
	programs?: ProgramDto[];

	@ClassField(() => ActivityDto, { isArray: true })
	activities?: ActivityDto[];
}
