import { SubjectAggregateRoot } from "@cocrepo/aggregate";
import { GetSubjectByIdQuery } from "@cocrepo/command";
import { IQueryHandler, QueryHandler } from "@nestjs/cqrs";

@QueryHandler(GetSubjectByIdQuery)
export class GetSubjectByIdUseCase
	implements IQueryHandler<GetSubjectByIdQuery>
{
	constructor(private readonly subjectsService: SubjectAggregateRoot) {}

	execute(query: GetSubjectByIdQuery): Promise<unknown> {
		return this.subjectsService.getSubjectById(query.subjectId);
	}
}
