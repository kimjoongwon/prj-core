import { GetEmailVerificationsUseCase } from "./get-email-verifications.usecase";
import { ResendEmailVerificationUseCase } from "./resend-email-verification.usecase";

export const EmailVerificationQueryHandlers = [GetEmailVerificationsUseCase];

export const EmailVerificationCommandHandlers = [
	ResendEmailVerificationUseCase,
];

export const EmailVerificationUseCaseProviders = [
	...EmailVerificationCommandHandlers,
	...EmailVerificationQueryHandlers,
];

export * from "./get-email-verifications.usecase";
export * from "./resend-email-verification.usecase";
