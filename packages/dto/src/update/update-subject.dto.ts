import { PartialType } from "@nestjs/swagger";
import { CreateSubjectDto } from "../create/create-subject.dto";

export class UpdateSubjectDto extends PartialType(CreateSubjectDto) {}
