import { ConfirmEmailVerificationUseCase } from "./confirm-email-verification.usecase";
import { ForceResetPasswordUseCase } from "./force-reset-password.usecase";
import { GetAuthAuditLogStatsUseCase } from "./get-auth-audit-log-stats.usecase";
import { GetAuthAuditLogsUseCase } from "./get-auth-audit-logs.usecase";
import { GetAuthLoginRedirectUseCase } from "./get-auth-login-redirect.usecase";
import { GetCurrentSpaceUseCase } from "./get-current-space.usecase";
import { GetMySpacesUseCase } from "./get-my-spaces.usecase";
import { GetSignUpSpacesUseCase } from "./get-sign-up-spaces.usecase";
import { HandleOidcCallbackUseCase } from "./handle-oidc-callback.usecase";
import { InvalidateUserSessionsUseCase } from "./invalidate-user-sessions.usecase";
import { LogoutNativeMobileSessionUseCase } from "./logout-native-mobile-session.usecase";
import { LogoutWithCookieUseCase } from "./logout-with-cookie.usecase";
import { NativeLoginUseCase } from "./native-login.usecase";
import { RefreshNativeMobileSessionUseCase } from "./refresh-native-mobile-session.usecase";
import { RefreshTokenWithIdpUseCase } from "./refresh-token-with-idp.usecase";
import { SetCurrentSpaceUseCase } from "./set-current-space.usecase";
import { SignUpUseCase } from "./sign-up.usecase";
import { UnlockAccountUseCase } from "./unlock-account.usecase";
import { VerifyTokenUseCase } from "./verify-token.usecase";

export const AuthAccountCommandHandlers = [
	SignUpUseCase,
	ConfirmEmailVerificationUseCase,
	SetCurrentSpaceUseCase,
];

export const AuthAccountQueryHandlers = [
	GetSignUpSpacesUseCase,
	VerifyTokenUseCase,
	GetMySpacesUseCase,
	GetCurrentSpaceUseCase,
];

export const AuthAdminCommandHandlers = [
	UnlockAccountUseCase,
	ForceResetPasswordUseCase,
	InvalidateUserSessionsUseCase,
];

export const AuthAdminQueryHandlers = [
	GetAuthAuditLogsUseCase,
	GetAuthAuditLogStatsUseCase,
];

export const AuthNativeSessionCommandHandlers = [
	NativeLoginUseCase,
	RefreshNativeMobileSessionUseCase,
	LogoutNativeMobileSessionUseCase,
];

export const AuthOidcCommandHandlers = [
	GetAuthLoginRedirectUseCase,
	HandleOidcCallbackUseCase,
	RefreshTokenWithIdpUseCase,
	LogoutWithCookieUseCase,
];

export const AuthCommandHandlers = [
	...AuthOidcCommandHandlers,
	...AuthNativeSessionCommandHandlers,
	...AuthAccountCommandHandlers,
	...AuthAdminCommandHandlers,
];

export const AuthQueryHandlers = [
	...AuthAccountQueryHandlers,
	...AuthAdminQueryHandlers,
];

export const AuthUseCaseProviders = [
	...AuthCommandHandlers,
	...AuthQueryHandlers,
];

export * from "./confirm-email-verification.usecase";
export * from "./force-reset-password.usecase";
export * from "./get-auth-audit-log-stats.usecase";
export * from "./get-auth-audit-logs.usecase";
export * from "./get-auth-login-redirect.usecase";
export * from "./get-current-space.usecase";
export * from "./get-my-spaces.usecase";
export * from "./get-sign-up-spaces.usecase";
export * from "./handle-oidc-callback.usecase";
export * from "./invalidate-user-sessions.usecase";
export * from "./logout-native-mobile-session.usecase";
export * from "./logout-with-cookie.usecase";
export * from "./native-login.usecase";
export * from "./refresh-native-mobile-session.usecase";
export * from "./refresh-token-with-idp.usecase";
export * from "./set-current-space.usecase";
export * from "./sign-up.usecase";
export * from "./unlock-account.usecase";
export * from "./verify-token.usecase";
