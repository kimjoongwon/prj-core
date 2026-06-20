import { SubjectAggregate } from "@cocrepo/aggregate";
import { GetSubjectsQuery } from "@cocrepo/command";
import { QueryHandler } from "@nestjs/cqrs";

@QueryHandler(GetSubjectsQuery)
export class GetSubjectsUseCase {
	constructor(private readonly subjectsService: SubjectAggregate) {}

	execute(query: GetSubjectsQuery): Promise<unknown> {
		return query.group
			? this.subjectsService.getSubjectsByGroup(query.group)
			: this.subjectsService.getSubjects();
	}
}
