import { OmitType } from "@nestjs/swagger";
import { COMMON_ENTITY_FIELDS } from "../constant";
import { RoutineDto } from "../routine.dto";

export class CreateRoutineDto extends OmitType(RoutineDto, [
	...COMMON_ENTITY_FIELDS,
	"programs",
	"activities",
]) {}
