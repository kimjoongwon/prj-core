import { SubjectAggregate } from "@cocrepo/aggregate";
import { GetSubjectByIdQuery } from "@cocrepo/command";
import { QueryHandler } from "@nestjs/cqrs";

@QueryHandler(GetSubjectByIdQuery)
export class GetSubjectByIdUseCase {
	constructor(private readonly subjectsService: SubjectAggregate) {}

	execute(query: GetSubjectByIdQuery): Promise<unknown> {
		return this.subjectsService.getSubjectById(query.subjectId);
	}
}
