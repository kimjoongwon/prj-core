import { Program as ProgramEntity } from "@prisma/client";
import { NumberField, UUIDField } from "../decorator";
import { AbstractDto } from "./abstract.dto";

export class ProgramDto extends AbstractDto implements ProgramEntity {
	@UUIDField()
	instructorId: string;

	@NumberField()
	capacity: number;

	@UUIDField()
	routineId: string;

	@UUIDField()
	sessionId: string;

	@UUIDField()
	tenancyId: string;
}
