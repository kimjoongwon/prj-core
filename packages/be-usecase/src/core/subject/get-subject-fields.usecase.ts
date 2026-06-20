import { SubjectAggregate } from "@cocrepo/aggregate";
import { GetSubjectFieldsQuery } from "@cocrepo/command";
import { QueryHandler } from "@nestjs/cqrs";

@QueryHandler(GetSubjectFieldsQuery)
export class GetSubjectFieldsUseCase {
	constructor(private readonly subjectsService: SubjectAggregate) {}

	async execute(query: GetSubjectFieldsQuery): Promise<unknown> {
		const subject = await this.subjectsService.getSubjectById(query.subjectId);
		if (!subject) {
			return [];
		}
		return this.subjectsService.getSubjectFields(subject.name);
	}
}
