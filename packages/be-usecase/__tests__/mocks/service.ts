export class AuthCacheService {}
export class InteractionService {}
export class OidcRedirectUrlService {}
export class TokenService {}
export class TokenStorageService {}
export class UserService {}

export const IDP_INTERACTION_LOGIN_SERVICE = Symbol(
	"IDP_INTERACTION_LOGIN_SERVICE",
);
export const IDP_OIDC_PROVIDER_SERVICE = Symbol("IDP_OIDC_PROVIDER_SERVICE");
export const IDP_PASSWORD_RESET_SERVICE = Symbol("IDP_PASSWORD_RESET_SERVICE");

export function applyRuntimeManagedOidcClientConfig<TConfig>(
	config: TConfig,
): TConfig {
	return config;
}
