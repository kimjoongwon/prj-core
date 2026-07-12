import { GetI18nCatalogUseCase } from "./get-i18n-catalog.usecase";
import { GetIdpI18nCatalogUseCase } from "./get-idp-i18n-catalog.usecase";

export const I18nCatalogQueryHandlers = [GetI18nCatalogUseCase];

export const I18nCatalogUseCaseProviders = [...I18nCatalogQueryHandlers];

export const IdpI18nCatalogQueryHandlers = [GetIdpI18nCatalogUseCase];

export const IdpI18nCatalogUseCaseProviders = [...IdpI18nCatalogQueryHandlers];

export * from "./get-i18n-catalog.usecase";
export * from "./get-idp-i18n-catalog.usecase";
