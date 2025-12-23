import { ClassField, StringField } from "@cocrepo/decorator";
import { Routine } from "@cocrepo/prisma";
import { AbstractDto } from "./abstract.dto";
import { ActivityDto } from "./activity.dto";
import { ProgramDto } from "./program.dto";

export class RoutineDto extends AbstractDto implements Routine {
	@StringField()
	name: string;

	@StringField()
	label: string;

	@ClassField(() => ProgramDto, { isArray: true })
	programs?: ProgramDto[];

	@ClassField(() => ActivityDto, { isArray: true })
	activities?: ActivityDto[];
}
