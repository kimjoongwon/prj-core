import { SubjectAggregateRoot } from "@cocrepo/aggregate";
import { GetSubjectFieldsQuery } from "@cocrepo/command";
import { IQueryHandler, QueryHandler } from "@nestjs/cqrs";

@QueryHandler(GetSubjectFieldsQuery)
export class GetSubjectFieldsUseCase
	implements IQueryHandler<GetSubjectFieldsQuery>
{
	constructor(private readonly subjectsService: SubjectAggregateRoot) {}

	async execute(query: GetSubjectFieldsQuery): Promise<unknown> {
		const subject = await this.subjectsService.getSubjectById(query.subjectId);
		if (!subject) {
			return [];
		}
		return this.subjectsService.getSubjectFields(subject.name);
	}
}
