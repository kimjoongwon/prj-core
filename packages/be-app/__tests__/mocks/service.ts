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
	sendTemporaryPasswordEmail() {}
}
