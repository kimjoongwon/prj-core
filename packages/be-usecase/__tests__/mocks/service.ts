export class AuthCacheService {}
export class InteractionLoginService {}
export class InteractionService {}
export class OidcRedirectUrlService {}
export class OidcProviderService {}
export class PasswordResetService {}
export class TokenService {}
export class TokenStorageService {}
export class UserService {}

export function applyRuntimeManagedOidcClientConfig<TConfig>(
	config: TConfig,
): TConfig {
	return config;
}
