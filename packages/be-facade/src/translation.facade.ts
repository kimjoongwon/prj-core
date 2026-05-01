import {
	CreateTranslationDto,
	GetTranslationsDto,
	UpdateTranslationDto,
} from "@cocrepo/dto";
import { Translation } from "@cocrepo/entity";
import { TranslationCatalogService } from "@cocrepo/service";
import { Injectable } from "@nestjs/common";

@Injectable()
export class TranslationFacade {
	constructor(
		private readonly translationCatalogService: TranslationCatalogService,
	) {}

	async getTranslations(query: GetTranslationsDto): Promise<{
		data: Translation[];
		meta: {
			total: number;
			page: number;
			limit: number;
			totalPages: number;
		};
	}> {
		return this.translationCatalogService.getTranslations(query);
	}

	getTranslationById(id: string): Promise<Translation> {
		return this.translationCatalogService.getTranslationById(id);
	}

	create(dto: CreateTranslationDto): Promise<Translation> {
		return this.translationCatalogService.create(dto);
	}

	update(id: string, dto: UpdateTranslationDto): Promise<Translation> {
		return this.translationCatalogService.update(id, dto);
	}

	remove(id: string): Promise<void> {
		return this.translationCatalogService.remove(id);
	}

	invalidateAllCache(): Promise<void> {
		return this.translationCatalogService.invalidateAllCache();
	}

	invalidateLanguageCache(languageCode: string): Promise<void> {
		return this.translationCatalogService.invalidateLanguageCache(languageCode);
	}
}
