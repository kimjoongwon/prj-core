import { PreviewTemplateQuery } from "@cocrepo/command";
import { TemplateService } from "@cocrepo/service";
import { IQueryHandler, QueryHandler } from "@nestjs/cqrs";

@QueryHandler(PreviewTemplateQuery)
export class PreviewTemplateUseCase
	implements IQueryHandler<PreviewTemplateQuery>
{
	constructor(private readonly templateService: TemplateService) {}

	async execute(query: PreviewTemplateQuery): Promise<unknown> {
		return this.templateService.preview(query.templateId, query.dto);
	}
}
