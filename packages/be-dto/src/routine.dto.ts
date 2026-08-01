import { ClassField, StringField, ULIDFieldOptional } from "@cocrepo/decorator";
import type { DomainEntityModel } from "@cocrepo/entity";
import type { Routine } from "@cocrepo/prisma";
import { AbstractDto } from "./abstract.dto";
import { ActivityDto } from "./activity.dto";
import { ProgramDto } from "./program.dto";

export class RoutineDto
	extends AbstractDto
	implements DomainEntityModel<Routine>
{
	@StringField()
	name: string;

	@StringField()
	label: string;

	@StringField()
	spaceId: string;

	@ULIDFieldOptional({ nullable: true })
	createdById: string | null;

	@ClassField(() => ProgramDto, { isArray: true })
	programs?: ProgramDto[];

	@ClassField(() => ActivityDto, { isArray: true })
	activities?: ActivityDto[];
}
