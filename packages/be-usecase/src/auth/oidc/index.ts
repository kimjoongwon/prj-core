import { GetAuthLoginRedirectUseCase } from "./get-auth-login-redirect.usecase";
import { HandleOidcCallbackUseCase } from "./handle-oidc-callback.usecase";
import { LogoutWithCookieUseCase } from "./logout-with-cookie.usecase";
import { RefreshTokenWithIdpUseCase } from "./refresh-token-with-idp.usecase";

export const AuthOidcCommandHandlers = [
	GetAuthLoginRedirectUseCase,
	HandleOidcCallbackUseCase,
	RefreshTokenWithIdpUseCase,
	LogoutWithCookieUseCase,
];

export const AuthOidcUseCaseProviders = [...AuthOidcCommandHandlers];

export * from "./get-auth-login-redirect.usecase";
export * from "./handle-oidc-callback.usecase";
export * from "./logout-with-cookie.usecase";
export * from "./refresh-token-with-idp.usecase";
