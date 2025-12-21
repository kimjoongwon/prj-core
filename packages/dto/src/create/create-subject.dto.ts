import { OmitType } from "@nestjs/swagger";
import { COMMON_ENTITY_FIELDS } from "../constant";
import { SubjectDto } from "../subject.dto";

export class CreateSubjectDto extends OmitType(SubjectDto, [
	...COMMON_ENTITY_FIELDS,
]) {}
