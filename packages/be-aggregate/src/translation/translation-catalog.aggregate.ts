import { LanguageCode, supportedLanguages } from "@cocrepo/constant";
import { TranslationsRepository } from "@cocrepo/repository";
import { BadRequestException, Injectable } from "@nestjs/common";

@Injectable()
export class TranslationCatalogAggregate {
	constructor(private readonly repository: TranslationsRepository) {}

	async getCatalog(languageCode: string): Promise<{
		languageCode: LanguageCode;
		messages: Record<string, string>;
	}> {
		if (!supportedLanguages.includes(languageCode as LanguageCode)) {
			throw new BadRequestException("허용된 값이 아닙니다");
		}

		const normalizedLanguageCode = languageCode as LanguageCode;
		const messages = await this.repository.findCatalogByLanguage(
			normalizedLanguageCode,
		);

		return {
			languageCode: normalizedLanguageCode,
			messages,
		};
	}
}
