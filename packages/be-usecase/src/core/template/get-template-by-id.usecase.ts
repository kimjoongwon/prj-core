import { GetTemplateByIdQuery } from "@cocrepo/command";
import { TemplateService } from "@cocrepo/service";
import { IQueryHandler, QueryHandler } from "@nestjs/cqrs";

@QueryHandler(GetTemplateByIdQuery)
export class GetTemplateByIdUseCase
	implements IQueryHandler<GetTemplateByIdQuery>
{
	constructor(private readonly templateService: TemplateService) {}

	execute(query: GetTemplateByIdQuery): Promise<unknown> {
		return this.templateService.getTemplateById(query.templateId);
	}
}
