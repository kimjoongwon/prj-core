import { ServiceDocumentAggregateRoot } from "@cocrepo/aggregate";
import {
	CreateServiceDocumentDto,
	QueryServiceDocumentDto,
	UpdateServiceDocumentDto,
} from "@cocrepo/dto";
import { ServiceDocument } from "@cocrepo/entity";
import { buildOffsetPaginatedResponse } from "@cocrepo/toolkit";
import type { OffsetPaginatedResponse } from "@cocrepo/type";
import { Injectable } from "@nestjs/common";

@Injectable()
export class ServiceDocumentFacade {
	constructor(
		private readonly serviceDocumentService: ServiceDocumentAggregateRoot,
	) {}

	async getServiceDocuments(
		query: QueryServiceDocumentDto,
	): Promise<OffsetPaginatedResponse<ServiceDocument[]>> {
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

	create(dto: CreateServiceDocumentDto): Promise<ServiceDocument> {
		return this.serviceDocumentService.create(dto);
	}

	update(
		serviceDocumentId: string,
		dto: UpdateServiceDocumentDto,
	): Promise<ServiceDocument> {
		return this.serviceDocumentService.update(serviceDocumentId, dto);
	}

	publish(serviceDocumentId: string): Promise<ServiceDocument> {
		return this.serviceDocumentService.publish(serviceDocumentId);
	}

	archive(serviceDocumentId: string): Promise<ServiceDocument> {
		return this.serviceDocumentService.archive(serviceDocumentId);
	}

	async remove(serviceDocumentId: string): Promise<void> {
		await this.serviceDocumentService.remove(serviceDocumentId);
	}
}
