import { CreateTranslationUseCase } from "./create-translation.usecase";
import { DeleteTranslationUseCase } from "./delete-translation.usecase";
import { GetTranslationCatalogUseCase } from "./get-translation-catalog.usecase";
import { GetTranslationsUseCase } from "./get-translations.usecase";
import { InvalidateAllTranslationsCacheUseCase } from "./invalidate-all-translations-cache.usecase";
import { InvalidateTranslationLanguageCacheUseCase } from "./invalidate-translation-language-cache.usecase";
import { UpdateTranslationUseCase } from "./update-translation.usecase";

export const TranslationQueryHandlers = [
	GetTranslationsUseCase,
	GetTranslationCatalogUseCase,
];

export const TranslationCommandHandlers = [
	CreateTranslationUseCase,
	UpdateTranslationUseCase,
	DeleteTranslationUseCase,
	InvalidateAllTranslationsCacheUseCase,
	InvalidateTranslationLanguageCacheUseCase,
];

export * from "./create-translation.usecase";
export * from "./delete-translation.usecase";
export * from "./get-translation-catalog.usecase";
export * from "./get-translations.usecase";
export * from "./invalidate-all-translations-cache.usecase";
export * from "./invalidate-translation-language-cache.usecase";
export * from "./update-translation.usecase";
