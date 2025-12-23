import {
	ClassField,
	NumberField,
	StringField,
	StringFieldOptional,
	UUIDField,
} from "@cocrepo/decorator";
import { Program as ProgramEntity } from "@cocrepo/prisma";
import { AbstractDto } from "./abstract.dto";
import { RoutineDto } from "./routine.dto";
import { SessionDto } from "./session.dto";

export class ProgramDto extends AbstractDto implements ProgramEntity {
	@UUIDField()
	routineId: string;

	@UUIDField()
	sessionId: string;

	@UUIDField()
	instructorId: string;

	@NumberField()
	capacity: number;

	@StringField()
	name: string;

	@StringFieldOptional()
	level: string | null;

	@ClassField(() => RoutineDto)
	routine?: RoutineDto;

	@ClassField(() => SessionDto)
	session?: SessionDto;
}
