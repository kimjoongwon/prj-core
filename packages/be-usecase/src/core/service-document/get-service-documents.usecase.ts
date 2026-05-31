import { ServiceDocumentAggregateRoot } from "@cocrepo/aggregate";
import { GetServiceDocumentsQuery } from "@cocrepo/command";
import { buildOffsetPaginatedResponse } from "@cocrepo/toolkit";
import { IQueryHandler, QueryHandler } from "@nestjs/cqrs";

@QueryHandler(GetServiceDocumentsQuery)
export class GetServiceDocumentsUseCase
	implements IQueryHandler<GetServiceDocumentsQuery>
{
	constructor(
		private readonly serviceDocumentService: ServiceDocumentAggregateRoot,
	) {}

	async execute(query: GetServiceDocumentsQuery): Promise<unknown> {
		const serviceDocumentResult =
			await this.serviceDocumentService.getServiceDocuments(query.query);
		const skip = query.query.skip ?? 0;
		const take = query.query.take ?? 10;
		return buildOffsetPaginatedResponse(
			serviceDocumentResult.data,
			serviceDocumentResult.totalCount,
			skip,
			take,
		);
	}
}
