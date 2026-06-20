import { ExecutePasswordResetUseCase } from "./execute-password-reset.usecase";
import { GetPasswordPolicyUseCase } from "./get-password-policy.usecase";
import { RequestPasswordResetUseCase } from "./request-password-reset.usecase";
import { ValidateResetTokenUseCase } from "./validate-reset-token.usecase";

export const PasswordResetCommandHandlers = [
	RequestPasswordResetUseCase,
	ExecutePasswordResetUseCase,
];

export const PasswordResetQueryHandlers = [
	GetPasswordPolicyUseCase,
	ValidateResetTokenUseCase,
];

export const PasswordResetUseCaseProviders = [
	...PasswordResetCommandHandlers,
	...PasswordResetQueryHandlers,
];

export * from "./execute-password-reset.usecase";
export * from "./get-password-policy.usecase";
export * from "./request-password-reset.usecase";
export * from "./validate-reset-token.usecase";
