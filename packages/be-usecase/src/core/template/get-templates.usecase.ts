import { GetTemplatesQuery } from "@cocrepo/command";
import { TemplateService } from "@cocrepo/service";
import { buildOffsetPaginatedResponse } from "@cocrepo/toolkit";
import { QueryHandler } from "@nestjs/cqrs";

@QueryHandler(GetTemplatesQuery)
export class GetTemplatesUseCase {
	constructor(private readonly templateService: TemplateService) {}

	async execute(query: GetTemplatesQuery): Promise<unknown> {
		const skip = query.query.skip ?? 0;
		const take = query.query.take ?? 10;
		const templateResult = await this.templateService.getTemplates({
			where: query.query.toPrismaWhere(),
			orderBy: query.query.toPrismaOrderBy(),
			skip,
			take,
		});
		return buildOffsetPaginatedResponse(
			templateResult.data,
			templateResult.totalCount,
			skip,
			take,
		);
	}
}
