import { Subject as SubjectEntity } from "@prisma/client";
import { UseDto } from "../decorator/use-dto.decorator";
import { SubjectDto } from "../dto/subject.dto";
import { AbstractEntity } from "./abstract.entity";

@UseDto(SubjectDto)
export class Subject
	extends AbstractEntity<SubjectDto>
	implements SubjectEntity
{
	tenantId: string;
	name: string;
}
