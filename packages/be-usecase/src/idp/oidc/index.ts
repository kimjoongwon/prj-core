import { HandleOidcUseCase } from "./handle-oidc.usecase";

export const OidcCommandHandlers = [HandleOidcUseCase];

export const OidcUseCaseProviders = [...OidcCommandHandlers];

export * from "./handle-oidc.usecase";
