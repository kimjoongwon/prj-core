import {
	CreateServiceDocumentDto,
	QueryPublicServiceDocumentDto,
	QueryServiceDocumentDto,
	UpdateServiceDocumentDto,
} from "@cocrepo/dto";
import { ServiceDocument } from "@cocrepo/entity";
import { ServiceDocumentKind } from "@cocrepo/prisma";
import { ServiceDocumentService } from "@cocrepo/service";
import { Injectable } from "@nestjs/common";

@Injectable()
export class ServiceDocumentFacade {
	constructor(private readonly serviceDocumentService: ServiceDocumentService) {}

	async getServiceDocuments(query: QueryServiceDocumentDto): Promise<{
		data: ServiceDocument[];
		meta: {
			total: number;
			skip: number;
			take: number;
			totalPages: number;
		};
	}> {
		const { data, totalCount } =
			await this.serviceDocumentService.getServiceDocuments(query);
		const skip = query.skip ?? 0;
		const take = query.take ?? 10;

		return {
			data,
			meta: {
				total: totalCount,
				skip,
				take,
				totalPages: take > 0 ? Math.ceil(totalCount / take) : 1,
			},
		};
	}

	getServiceDocumentById(serviceDocumentId: string): Promise<ServiceDocument> {
		return this.serviceDocumentService.getServiceDocumentById(serviceDocumentId);
	}

	getPublishedServiceDocument(
		kind: ServiceDocumentKind,
		query: QueryPublicServiceDocumentDto,
	): Promise<ServiceDocument> {
		return this.serviceDocumentService.getPublishedServiceDocument(kind, query);
	}

	getPublishedServiceDocuments(
		query: QueryPublicServiceDocumentDto,
	): Promise<ServiceDocument[]> {
		return this.serviceDocumentService.getPublishedServiceDocuments(query);
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
