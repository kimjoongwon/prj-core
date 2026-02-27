export class UsersService {
	getByIdWithTenants() {}
	findUserForAuth() {}
	createUserForSignUp() {}
}

export class AbilitiesService {
	getMergedAbilities() {}
	getAbilityById() {}
	getAllAbilities() {}
	getRoleAbilities() {}
	getUserAbilities() {}
	createAbility() {}
	updateAbility() {}
	deleteAbility() {}
}

export class RolesService {
	getDefaultUserRole() {}
}

export class SpacesService {
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

export class EmailService {
	sendEmail() {}
}
