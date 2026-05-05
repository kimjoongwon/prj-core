export class UserService {
	getByIdWithTenants() {}
	findUserForAuth() {}
	createUserForSignUp() {}
}

export class AbilityService {
	getMergedAbilities() {}
	getAbilityById() {}
	getAllAbilities() {}
	getRoleAbilities() {}
	getUserAbilities() {}
	createAbility() {}
	updateAbility() {}
	deleteAbility() {}
}

export class RoleService {
	getDefaultUserRole() {}
}

export class SpaceService {
	createPersonalSpace() {}
}

export class TokenService {
	setAccessTokenCookie() {}
	setRefreshTokenCookie() {}
	clearTokenCookies() {}
	isTokenBlacklisted() {}
}

export class TokenStorageService {
	saveOidcState() {}
	validateAndConsumeOidcState() {}
	isBlacklisted() {}
	addToBlacklist() {}
	generateSessionId() {}
	saveSession() {}
}

export class AuthCacheService {
	get() {}
	set() {}
	invalidate() {}
}

export class AuthAuditLogService {
	getAuditLogs() {}
	getStats() {}
}

export class EmailService {
	sendEmail() {}
	sendPasswordResetEmail() {}
	sendTemporaryPasswordEmail() {}
}

export const FIRST_PARTY_OIDC_CLIENT_IDS = [
	"admin-web",
	"storybook-web",
	"idp-web",
	"user-mobile",
	"swagger-web",
] as const;

export const isFirstPartyOidcClientId = (clientId: string) =>
	FIRST_PARTY_OIDC_CLIENT_IDS.includes(
		clientId as (typeof FIRST_PARTY_OIDC_CLIENT_IDS)[number],
	);

export const applyFirstPartyOidcRuntimeConfig = <TClient>(client: TClient) =>
	client;
