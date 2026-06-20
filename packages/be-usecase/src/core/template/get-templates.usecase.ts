import { GetTemplatesQuery } from "@cocrepo/command";
import { TemplateService } from "@cocrepo/service";
import { buildOffsetPaginatedResponse } from "@cocrepo/toolkit";
import { QueryHandler } from "@nestjs/cqrs";

@QueryHandler(GetTemplatesQuery)
export class GetTemplatesUseCase {
	constructor(private readonly templateService: TemplateService) {}

	async execute(query: GetTemplatesQuery): Promise<unknown> {
		const templateResult = await this.templateService.getTemplates(query.query);
		const skip = query.query.skip ?? 0;
		const take = query.query.take ?? 10;
		return buildOffsetPaginatedResponse(
			templateResult.data,
			templateResult.totalCount,
			skip,
			take,
		);
	}
}
