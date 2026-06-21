import {
	IdpAccountCommandHandlers,
	IdpAccountQueryHandlers,
} from "./account";
import {
	IdpDashboardCommandHandlers,
	IdpDashboardQueryHandlers,
} from "./dashboard";
import {
	EmailVerificationCommandHandlers,
	EmailVerificationQueryHandlers,
} from "./email-verification";
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
	OidcClientCommandHandlers,
	OidcClientQueryHandlers,
} from "./oidc-client";
import {
	OidcSessionCommandHandlers,
	OidcSessionQueryHandlers,
} from "./oidc-session";
import {
	PasswordResetCommandHandlers,
	PasswordResetQueryHandlers,
} from "./password-reset";
import {
	SecurityPolicyCommandHandlers,
	SecurityPolicyQueryHandlers,
} from "./security-policy";

export const IdpQueryHandlers = [
	...EmailVerificationQueryHandlers,
	...IdpAccountQueryHandlers,
	...IdpDashboardQueryHandlers,
	...OidcClientQueryHandlers,
	...OidcSessionQueryHandlers,
	...SecurityPolicyQueryHandlers,
	...I18nCatalogQueryHandlers,
	...IdpI18nCatalogQueryHandlers,
	...InteractionQueryHandlers,
	...PasswordResetQueryHandlers,
];

export const IdpCommandHandlers = [
	...EmailVerificationCommandHandlers,
	...IdpAccountCommandHandlers,
	...IdpDashboardCommandHandlers,
	...OidcClientCommandHandlers,
	...OidcSessionCommandHandlers,
	...SecurityPolicyCommandHandlers,
	...InteractionCommandHandlers,
	...OidcCommandHandlers,
	...PasswordResetCommandHandlers,
];

export const IdpUseCaseProviders = [...IdpCommandHandlers, ...IdpQueryHandlers];

export * from "./account";
export * from "./dashboard";
export * from "./email-verification";
export * from "./i18n-catalog";
export * from "./interaction";
export * from "./oidc";
export * from "./oidc-client";
export * from "./oidc-session";
export * from "./password-reset";
export * from "./security-policy";
