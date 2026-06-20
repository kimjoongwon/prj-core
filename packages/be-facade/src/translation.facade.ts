import { TranslationCatalogAggregate } from "@cocrepo/aggregate";
import {
	CreateTranslationDto,
	GetTranslationsDto,
	TranslationCatalogResponseDto,
	UpdateTranslationDto,
} from "@cocrepo/dto";
import { Translation } from "@cocrepo/entity";
import type { LanguageCode as PrismaLanguageCode } from "@cocrepo/prisma";
import type { PagePaginatedResponse } from "@cocrepo/type";
import { Injectable } from "@nestjs/common";

@Injectable()
export class TranslationFacade {
	constructor(
		private readonly translationCatalogService: TranslationCatalogAggregate,
	) {}

	async getTranslations(
		query: GetTranslationsDto,
	): Promise<PagePaginatedResponse<Translation[]>> {
		return this.translationCatalogService.getTranslations(query);
	}

	getCatalog(
		languageCode: PrismaLanguageCode,
	): Promise<TranslationCatalogResponseDto> {
		return this.translationCatalogService.getCatalog(languageCode);
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
