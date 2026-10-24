import { ServiceDocument } from "@cocrepo/entity";
import type {
	CreateServiceDocumentCommandInput,
	GetServiceDocumentsQueryInput,
	UpdateServiceDocumentCommandInput,
} from "@cocrepo/input";
import {
	type Prisma,
	ServiceDocumentKind,
	ServiceDocumentPlatform,
} from "@cocrepo/prisma";
import {
	buildServiceDocumentQueryOrderBy,
	buildServiceDocumentQueryWhere,
	ServiceDocumentsRepository,
} from "@cocrepo/repository";
import {
	BadRequestException,
	ConflictException,
	Injectable,
	Logger,
	NotFoundException,
} from "@nestjs/common";

@Injectable()
export class ServiceDocumentAggregate {
	private readonly logger = new Logger(ServiceDocumentAggregate.name);

	constructor(private readonly repository: ServiceDocumentsRepository) {}

	async getServiceDocuments(
		query: GetServiceDocumentsQueryInput,
	): Promise<{ data: ServiceDocument[]; totalCount: number }> {
		const where = buildServiceDocumentQueryWhere(query);
		const orderBy = buildServiceDocumentQueryOrderBy(query);

		return this.repository.findMany({
			where,
			orderBy,
			skip: query.skip,
			take: query.take,
		});
	}

	async getServiceDocumentById(id: string): Promise<ServiceDocument> {
		const document = await this.repository.findById(id);
		if (!document) {
			throw new NotFoundException("서비스 문서를 찾을 수 없습니다");
		}
		return document;
	}

	async create(
		dto: CreateServiceDocumentCommandInput,
	): Promise<ServiceDocument> {
		this.logger.debug(`서비스 문서 생성: ${dto.kind} ${dto.version}`);

		const platform = this.resolvePlatform(dto.platform);
		const locale = this.resolveLocale(dto.locale);
		const existing = await this.repository.findByIdentity({
			kind: dto.kind,
			platform,
			locale,
			version: dto.version,
		});

		if (existing) {
			throw new ConflictException(
				"동일한 종류, 플랫폼, 로케일, 버전의 서비스 문서가 이미 존재합니다",
			);
		}

		const data: Prisma.ServiceDocumentUncheckedCreateInput = {
			kind: dto.kind,
			platform,
			locale,
			title: dto.title,
			summary: dto.summary ?? null,
			content: dto.content,
			format: dto.format ?? "MARKDOWN",
			version: dto.version,
			isRequired: dto.isRequired ?? this.getDefaultRequired(dto.kind),
			displayOrder: dto.displayOrder ?? 0,
			effectiveAt: dto.effectiveAt ?? null,
		};

		return this.repository.create(data);
	}

	async update(
		id: string,
		dto: UpdateServiceDocumentCommandInput,
	): Promise<ServiceDocument> {
		const document = await this.getServiceDocumentById(id);
		this.assertEditable(document);

		const data: Prisma.ServiceDocumentUncheckedUpdateInput = {};
		if (dto.title !== undefined) data.title = dto.title;
		if (dto.summary !== undefined) data.summary = dto.summary || null;
		if (dto.content !== undefined) data.content = dto.content;
		if (dto.format !== undefined) data.format = dto.format;
		if (dto.isRequired !== undefined) data.isRequired = dto.isRequired;
		if (dto.displayOrder !== undefined) data.displayOrder = dto.displayOrder;
		if (dto.effectiveAt !== undefined) data.effectiveAt = dto.effectiveAt;

		return this.repository.updateById(id, data);
	}

	async publish(id: string): Promise<ServiceDocument> {
		const document = await this.getServiceDocumentById(id);
		if (!document.content.trim()) {
			throw new BadRequestException(
				"본문이 비어 있는 문서는 게시할 수 없습니다",
			);
		}

		return this.repository.publishById(id);
	}

	async archive(id: string): Promise<ServiceDocument> {
		await this.getServiceDocumentById(id);
		return this.repository.archiveById(id);
	}

	async remove(id: string): Promise<ServiceDocument> {
		await this.getServiceDocumentById(id);
		return this.repository.removeById(id);
	}

	private assertEditable(document: ServiceDocument): void {
		if (!document.isDraft()) {
			throw new BadRequestException(
				"게시 또는 보관된 문서는 직접 수정할 수 없습니다. 새 버전을 생성해 주세요.",
			);
		}
	}

	private resolvePlatform(
		platform?: ServiceDocumentPlatform,
	): ServiceDocumentPlatform {
		return platform ?? "ALL";
	}

	private resolveLocale(locale?: string): string {
		return locale?.trim() || "ko-KR";
	}

	private getDefaultRequired(kind: ServiceDocumentKind): boolean {
		return kind === "TERMS_OF_SERVICE" || kind === "PRIVACY_POLICY";
	}
}
