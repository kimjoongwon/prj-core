import { CreateOidcClientUseCase } from "./create-oidc-client.usecase";
import { DeleteOidcClientUseCase } from "./delete-oidc-client.usecase";
import { GetOidcClientByIdUseCase } from "./get-oidc-client-by-id.usecase";
import { GetOidcClientsUseCase } from "./get-oidc-clients.usecase";
import { ToggleOidcClientActiveUseCase } from "./toggle-oidc-client-active.usecase";
import { UpdateOidcClientUseCase } from "./update-oidc-client.usecase";

export const OidcClientQueryHandlers = [
	GetOidcClientsUseCase,
	GetOidcClientByIdUseCase,
];

export const OidcClientCommandHandlers = [
	CreateOidcClientUseCase,
	UpdateOidcClientUseCase,
	DeleteOidcClientUseCase,
	ToggleOidcClientActiveUseCase,
];

export const OidcClientUseCaseProviders = [
	...OidcClientCommandHandlers,
	...OidcClientQueryHandlers,
];

export * from "./create-oidc-client.usecase";
export * from "./delete-oidc-client.usecase";
export * from "./get-oidc-client-by-id.usecase";
export * from "./get-oidc-clients.usecase";
export * from "./toggle-oidc-client-active.usecase";
export * from "./update-oidc-client.usecase";
