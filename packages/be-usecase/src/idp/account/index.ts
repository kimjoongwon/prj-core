import { GetIdpAccountAccessGrantFormBootstrapUseCase } from "./get-idp-account-access-grant-form-bootstrap.usecase";
import { GetIdpAccountByIdUseCase } from "./get-idp-account-by-id.usecase";
import { GetIdpAccountsUseCase } from "./get-idp-accounts.usecase";
import { GrantIdpAccountAccessUseCase } from "./grant-idp-account-access.usecase";
import { ResetIdpAccountFailedAttemptsUseCase } from "./reset-idp-account-failed-attempts.usecase";
import { ToggleIdpAccountActiveUseCase } from "./toggle-idp-account-active.usecase";

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

export * from "./get-idp-account-access-grant-form-bootstrap.usecase";
export * from "./get-idp-account-by-id.usecase";
export * from "./get-idp-accounts.usecase";
export * from "./grant-idp-account-access.usecase";
export * from "./reset-idp-account-failed-attempts.usecase";
export * from "./toggle-idp-account-active.usecase";
