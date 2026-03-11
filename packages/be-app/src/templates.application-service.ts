import {
	CreateTemplateDto,
	PreviewTemplateDto,
	QueryTemplateDto,
	SendTestTemplateDto,
	UpdateTemplateDto,
} from "@cocrepo/dto";
import { Template } from "@cocrepo/entity";
import { TemplatesService } from "@cocrepo/service";
import { Injectable } from "@nestjs/common";

@Injectable()
export class TemplatesApplicationService {
	constructor(private readonly templatesService: TemplatesService) {}

	async getTemplates(query: QueryTemplateDto): Promise<{
		data: Template[];
		meta: {
			total: number;
			skip: number;
			take: number;
			totalPages: number;
		};
	}> {
		const { data, totalCount } =
			await this.templatesService.getTemplates(query);
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

	getTemplate(templateId: string): Promise<Template> {
		return this.templatesService.getTemplateById(templateId);
	}

	createTemplate(dto: CreateTemplateDto): Promise<Template> {
		return this.templatesService.create(dto);
	}

	updateTemplate(
		templateId: string,
		dto: UpdateTemplateDto,
	): Promise<Template> {
		return this.templatesService.update(templateId, dto);
	}

	async deleteTemplate(templateId: string): Promise<void> {
		await this.templatesService.remove(templateId);
	}

	toggleTemplateStatus(templateId: string): Promise<Template> {
		return this.templatesService.toggleStatus(templateId);
	}

	previewTemplate(templateId: string, dto: PreviewTemplateDto) {
		return this.templatesService.preview(templateId, dto);
	}

	sendTestTemplate(templateId: string, dto: SendTestTemplateDto) {
		return this.templatesService.sendTest(templateId, dto);
	}
}
