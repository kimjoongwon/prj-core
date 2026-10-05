import { ServiceDocumentAggregate } from "@cocrepo/aggregate";
import { GetServiceDocumentsQuery } from "@cocrepo/command";
import { buildOffsetPaginatedResponse } from "@cocrepo/toolkit";
import { QueryHandler } from "@nestjs/cqrs";

@QueryHandler(GetServiceDocumentsQuery)
export class GetServiceDocumentsUseCase {
	constructor(
		private readonly serviceDocumentService: ServiceDocumentAggregate,
	) {}

	async execute(query: GetServiceDocumentsQuery): Promise<unknown> {
		const serviceDocumentResult =
			await this.serviceDocumentService.getServiceDocuments(query);
		const skip = query.skip ?? 0;
		const take = query.take ?? 10;
		return buildOffsetPaginatedResponse(
			serviceDocumentResult.data,
			serviceDocumentResult.totalCount,
			skip,
			take,
		);
	}
}
