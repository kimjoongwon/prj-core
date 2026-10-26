import {
	I18nCatalogQueryHandlers,
	IdpI18nCatalogQueryHandlers,
} from "./i18n-catalog";
import {
	InteractionCommandHandlers,
	InteractionQueryHandlers,
} from "./interaction";
import { OidcCommandHandlers } from "./oidc";
import {
	PasswordResetCommandHandlers,
	PasswordResetQueryHandlers,
} from "./password-reset";

export const IdpQueryHandlers = [
	...I18nCatalogQueryHandlers,
	...IdpI18nCatalogQueryHandlers,
	...InteractionQueryHandlers,
	...PasswordResetQueryHandlers,
];

export const IdpCommandHandlers = [
	...InteractionCommandHandlers,
	...OidcCommandHandlers,
	...PasswordResetCommandHandlers,
];

export const IdpUseCaseProviders = [...IdpCommandHandlers, ...IdpQueryHandlers];

export * from "./i18n-catalog";
export * from "./interaction";
export * from "./oidc";
export * from "./password-reset";
