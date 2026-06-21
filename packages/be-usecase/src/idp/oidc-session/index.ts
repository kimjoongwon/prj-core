import { GetOidcSessionStatsUseCase } from "./get-oidc-session-stats.usecase";
import { GetOidcSessionsUseCase } from "./get-oidc-sessions.usecase";
import { RevokeAllOidcSessionsUseCase } from "./revoke-all-oidc-sessions.usecase";
import { RevokeOidcSessionByKeyUseCase } from "./revoke-oidc-session-by-key.usecase";
import { RevokeOidcSessionsByGrantIdUseCase } from "./revoke-oidc-sessions-by-grant-id.usecase";

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

export * from "./get-oidc-session-stats.usecase";
export * from "./get-oidc-sessions.usecase";
export * from "./revoke-all-oidc-sessions.usecase";
export * from "./revoke-oidc-session-by-key.usecase";
export * from "./revoke-oidc-sessions-by-grant-id.usecase";
