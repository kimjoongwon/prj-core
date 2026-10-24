import { GetTemplateByIdQuery } from "@cocrepo/command";
import { TemplateService } from "@cocrepo/service";
import { QueryHandler } from "@nestjs/cqrs";

@QueryHandler(GetTemplateByIdQuery)
export class GetTemplateByIdUseCase {
	constructor(private readonly templateService: TemplateService) {}

	execute(query: GetTemplateByIdQuery): Promise<unknown> {
		return this.templateService.getTemplateById(query.templateId);
	}
}
