import {
	CreateTemplateDto,
	PreviewTemplateDto,
	QueryTemplateDto,
	SendTestTemplateDto,
	UpdateTemplateDto,
} from "@cocrepo/dto";
import { Template } from "@cocrepo/entity";
import { TemplateService } from "@cocrepo/service";
import { buildOffsetPaginatedResponse } from "@cocrepo/toolkit";
import type { OffsetPaginatedResponse } from "@cocrepo/type";
import { Injectable } from "@nestjs/common";

@Injectable()
export class TemplateFacade {
	constructor(private readonly templateService: TemplateService) {}

	async getTemplates(
		query: QueryTemplateDto,
	): Promise<OffsetPaginatedResponse<Template[]>> {
		const templateResult = await this.templateService.getTemplates(query);
		const skip = query.skip ?? 0;
		const take = query.take ?? 10;

		return buildOffsetPaginatedResponse(
			templateResult.data,
			templateResult.totalCount,
			skip,
			take,
		);
	}

	getTemplateById(templateId: string): Promise<Template> {
		return this.getTemplate(templateId);
	}

	getTemplate(templateId: string): Promise<Template> {
		return this.templateService.getTemplateById(templateId);
	}

	create(dto: CreateTemplateDto): Promise<Template> {
		return this.createTemplate(dto);
	}

	createTemplate(dto: CreateTemplateDto): Promise<Template> {
		return this.templateService.create(dto);
	}

	update(templateId: string, dto: UpdateTemplateDto): Promise<Template> {
		return this.updateTemplate(templateId, dto);
	}

	updateTemplate(
		templateId: string,
		dto: UpdateTemplateDto,
	): Promise<Template> {
		return this.templateService.update(templateId, dto);
	}

	remove(templateId: string): Promise<void> {
		return this.deleteTemplate(templateId);
	}

	async deleteTemplate(templateId: string): Promise<void> {
		await this.templateService.remove(templateId);
	}

	toggleStatus(templateId: string): Promise<Template> {
		return this.toggleTemplateStatus(templateId);
	}

	toggleTemplateStatus(templateId: string): Promise<Template> {
		return this.templateService.toggleStatus(templateId);
	}

	preview(templateId: string, dto: PreviewTemplateDto) {
		return this.previewTemplate(templateId, dto);
	}

	previewTemplate(templateId: string, dto: PreviewTemplateDto) {
		return this.templateService.preview(templateId, dto);
	}

	sendTest(templateId: string, dto: SendTestTemplateDto) {
		return this.sendTestTemplate(templateId, dto);
	}

	sendTestTemplate(templateId: string, dto: SendTestTemplateDto) {
		return this.templateService.sendTest(templateId, dto);
	}
}
