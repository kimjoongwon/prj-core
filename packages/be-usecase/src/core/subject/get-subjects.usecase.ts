import { SubjectAggregateRoot } from "@cocrepo/aggregate";
import { GetSubjectsQuery } from "@cocrepo/command";
import { IQueryHandler, QueryHandler } from "@nestjs/cqrs";

@QueryHandler(GetSubjectsQuery)
export class GetSubjectsUseCase implements IQueryHandler<GetSubjectsQuery> {
	constructor(private readonly subjectsService: SubjectAggregateRoot) {}

	execute(query: GetSubjectsQuery): Promise<unknown> {
		return query.group
			? this.subjectsService.getSubjectsByGroup(query.group)
			: this.subjectsService.getSubjects();
	}
}
