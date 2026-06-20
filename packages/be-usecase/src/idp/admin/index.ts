import { CreateOidcClientUseCase } from "./create-oidc-client.usecase";
import { DeleteOidcClientUseCase } from "./delete-oidc-client.usecase";
import { GetDefaultSecurityPolicyUseCase } from "./get-default-security-policy.usecase";
import { GetEmailVerificationsUseCase } from "./get-email-verifications.usecase";
import { GetI18nCatalogUseCase } from "./get-i18n-catalog.usecase";
import { GetIdpAccountAccessGrantFormBootstrapUseCase } from "./get-idp-account-access-grant-form-bootstrap.usecase";
import { GetIdpAccountByIdUseCase } from "./get-idp-account-by-id.usecase";
import { GetIdpAccountsUseCase } from "./get-idp-accounts.usecase";
import { GetIdpDashboardStatsUseCase } from "./get-idp-dashboard-stats.usecase";
import { GetIdpI18nCatalogUseCase } from "./get-idp-i18n-catalog.usecase";
import { GetIdpLoginTrendUseCase } from "./get-idp-login-trend.usecase";
import { GetOidcClientByIdUseCase } from "./get-oidc-client-by-id.usecase";
import { GetOidcClientsUseCase } from "./get-oidc-clients.usecase";
import { GetOidcSessionStatsUseCase } from "./get-oidc-session-stats.usecase";
import { GetOidcSessionsUseCase } from "./get-oidc-sessions.usecase";
import { GrantIdpAccountAccessUseCase } from "./grant-idp-account-access.usecase";
import { ResendEmailVerificationUseCase } from "./resend-email-verification.usecase";
import { ResetIdpAccountFailedAttemptsUseCase } from "./reset-idp-account-failed-attempts.usecase";
import { RevokeAllOidcSessionsUseCase } from "./revoke-all-oidc-sessions.usecase";
import { RevokeOidcSessionByKeyUseCase } from "./revoke-oidc-session-by-key.usecase";
import { RevokeOidcSessionsByGrantIdUseCase } from "./revoke-oidc-sessions-by-grant-id.usecase";
import { ToggleIdpAccountActiveUseCase } from "./toggle-idp-account-active.usecase";
import { ToggleOidcClientActiveUseCase } from "./toggle-oidc-client-active.usecase";
import { UpdateOidcClientUseCase } from "./update-oidc-client.usecase";
import { UpdateSecurityPolicyUseCase } from "./update-security-policy.usecase";

export const EmailVerificationQueryHandlers = [GetEmailVerificationsUseCase];
export const EmailVerificationCommandHandlers = [
	ResendEmailVerificationUseCase,
];
export const EmailVerificationUseCaseProviders = [
	...EmailVerificationCommandHandlers,
	...EmailVerificationQueryHandlers,
];

export const IdpAccountQueryHandlers = [
	GetIdpAccountsUseCase,
	GetIdpAccountByIdUseCase,
	GetIdpAccountAccessGrantFormBootstrapUseCase,
];
export const IdpAccountCommandHandlers = [
	GrantIdpAccountAccessUseCase,
	ToggleIdpAccountActiveUseCase,
	ResetIdpAccountFailedAttemptsUseCase,
];
export const IdpAccountUseCaseProviders = [
	...IdpAccountCommandHandlers,
	...IdpAccountQueryHandlers,
];

export const IdpDashboardQueryHandlers = [
	GetIdpDashboardStatsUseCase,
	GetIdpLoginTrendUseCase,
];
export const IdpDashboardCommandHandlers = [];
export const IdpDashboardUseCaseProviders = [
	...IdpDashboardCommandHandlers,
	...IdpDashboardQueryHandlers,
];

export const OidcClientQueryHandlers = [
	GetOidcClientsUseCase,
	GetOidcClientByIdUseCase,
];
export const OidcClientCommandHandlers = [
	CreateOidcClientUseCase,
	UpdateOidcClientUseCase,
	DeleteOidcClientUseCase,
	ToggleOidcClientActiveUseCase,
];
export const OidcClientUseCaseProviders = [
	...OidcClientCommandHandlers,
	...OidcClientQueryHandlers,
];

export const OidcSessionQueryHandlers = [
	GetOidcSessionsUseCase,
	GetOidcSessionStatsUseCase,
];
export const OidcSessionCommandHandlers = [
	RevokeOidcSessionByKeyUseCase,
	RevokeAllOidcSessionsUseCase,
	RevokeOidcSessionsByGrantIdUseCase,
];
export const OidcSessionUseCaseProviders = [
	...OidcSessionCommandHandlers,
	...OidcSessionQueryHandlers,
];

export const SecurityPolicyQueryHandlers = [GetDefaultSecurityPolicyUseCase];
export const SecurityPolicyCommandHandlers = [UpdateSecurityPolicyUseCase];
export const SecurityPolicyUseCaseProviders = [
	...SecurityPolicyCommandHandlers,
	...SecurityPolicyQueryHandlers,
];

export const I18nCatalogQueryHandlers = [GetI18nCatalogUseCase];
export const I18nCatalogUseCaseProviders = [...I18nCatalogQueryHandlers];

export const IdpI18nCatalogQueryHandlers = [GetIdpI18nCatalogUseCase];
export const IdpI18nCatalogUseCaseProviders = [...IdpI18nCatalogQueryHandlers];

export const IdpAdminQueryHandlers = [
	...EmailVerificationQueryHandlers,
	...IdpAccountQueryHandlers,
	...IdpDashboardQueryHandlers,
	...OidcClientQueryHandlers,
	...OidcSessionQueryHandlers,
	...SecurityPolicyQueryHandlers,
	...I18nCatalogQueryHandlers,
	...IdpI18nCatalogQueryHandlers,
];

export const IdpAdminCommandHandlers = [
	...EmailVerificationCommandHandlers,
	...IdpAccountCommandHandlers,
	...IdpDashboardCommandHandlers,
	...OidcClientCommandHandlers,
	...OidcSessionCommandHandlers,
	...SecurityPolicyCommandHandlers,
];

export const IdpAdminUseCaseProviders = [
	...IdpAdminCommandHandlers,
	...IdpAdminQueryHandlers,
];

export * from "./create-oidc-client.usecase";
export * from "./delete-oidc-client.usecase";
export * from "./get-default-security-policy.usecase";
export * from "./get-email-verifications.usecase";
export * from "./get-i18n-catalog.usecase";
export * from "./get-idp-account-access-grant-form-bootstrap.usecase";
export * from "./get-idp-account-by-id.usecase";
export * from "./get-idp-accounts.usecase";
export * from "./get-idp-dashboard-stats.usecase";
export * from "./get-idp-i18n-catalog.usecase";
export * from "./get-idp-login-trend.usecase";
export * from "./get-oidc-client-by-id.usecase";
export * from "./get-oidc-clients.usecase";
export * from "./get-oidc-session-stats.usecase";
export * from "./get-oidc-sessions.usecase";
export * from "./grant-idp-account-access.usecase";
export * from "./resend-email-verification.usecase";
export * from "./reset-idp-account-failed-attempts.usecase";
export * from "./revoke-all-oidc-sessions.usecase";
export * from "./revoke-oidc-session-by-key.usecase";
export * from "./revoke-oidc-sessions-by-grant-id.usecase";
export * from "./toggle-idp-account-active.usecase";
export * from "./toggle-oidc-client-active.usecase";
export * from "./update-oidc-client.usecase";
export * from "./update-security-policy.usecase";
