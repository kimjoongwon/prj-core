import { OmitType } from "@nestjs/swagger";
import { COMMON_ENTITY_FIELDS } from "../constant";
import { ProgramDto } from "../program.dto";

export class CreateProgramDto extends OmitType(ProgramDto, [
	...COMMON_ENTITY_FIELDS,
	"routine",
	"session",
]) {}
