import { ForceResetPasswordUseCase } from "./force-reset-password.usecase";
import { GetAuthAuditLogStatsUseCase } from "./get-auth-audit-log-stats.usecase";
import { GetAuthAuditLogsUseCase } from "./get-auth-audit-logs.usecase";
import { InvalidateUserSessionsUseCase } from "./invalidate-user-sessions.usecase";
import { UnlockAccountUseCase } from "./unlock-account.usecase";

export const AuthAdminCommandHandlers = [
	UnlockAccountUseCase,
	ForceResetPasswordUseCase,
	InvalidateUserSessionsUseCase,
];

export const AuthAdminQueryHandlers = [
	GetAuthAuditLogsUseCase,
	GetAuthAuditLogStatsUseCase,
];

export const AuthAdminUseCaseProviders = [
	...AuthAdminCommandHandlers,
	...AuthAdminQueryHandlers,
];

export * from "./force-reset-password.usecase";
export * from "./get-auth-audit-log-stats.usecase";
export * from "./get-auth-audit-logs.usecase";
export * from "./invalidate-user-sessions.usecase";
export * from "./unlock-account.usecase";
