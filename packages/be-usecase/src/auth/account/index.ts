import { ConfirmEmailVerificationUseCase } from "./confirm-email-verification.usecase";
import { GetCurrentSpaceUseCase } from "./get-current-space.usecase";
import { GetMySpacesUseCase } from "./get-my-spaces.usecase";
import { GetSignUpSpacesUseCase } from "./get-sign-up-spaces.usecase";
import { SetCurrentSpaceUseCase } from "./set-current-space.usecase";
import { SignUpUseCase } from "./sign-up.usecase";
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

export const AuthAccountUseCaseProviders = [
	...AuthAccountCommandHandlers,
	...AuthAccountQueryHandlers,
];

export * from "./confirm-email-verification.usecase";
export * from "./get-current-space.usecase";
export * from "./get-my-spaces.usecase";
export * from "./get-sign-up-spaces.usecase";
export * from "./set-current-space.usecase";
export * from "./sign-up.usecase";
export * from "./verify-token.usecase";
