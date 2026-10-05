import { AbortInteractionUseCase } from "./abort-interaction.usecase";
import { ConfirmInteractionConsentUseCase } from "./confirm-interaction-consent.usecase";
import { GetInteractionUseCase } from "./get-interaction.usecase";
import { SubmitInteractionLoginUseCase } from "./submit-interaction-login.usecase";

export const InteractionCommandHandlers = [
	SubmitInteractionLoginUseCase,
	ConfirmInteractionConsentUseCase,
	AbortInteractionUseCase,
];

export const InteractionQueryHandlers = [GetInteractionUseCase];

export const InteractionUseCaseProviders = [
	...InteractionCommandHandlers,
	...InteractionQueryHandlers,
];

export * from "./abort-interaction.usecase";
export * from "./confirm-interaction-consent.usecase";
export * from "./get-interaction.usecase";
export * from "./submit-interaction-login.usecase";
