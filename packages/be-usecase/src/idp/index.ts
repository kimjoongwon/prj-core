import {
	IdpAdminCommandHandlers,
	IdpAdminQueryHandlers,
} from "./admin";
import {
	InteractionCommandHandlers,
	InteractionQueryHandlers,
} from "./interaction";
import { OidcCommandHandlers } from "./oidc";
import {
	PasswordResetCommandHandlers,
	PasswordResetQueryHandlers,
} from "./password-reset";

export const IdpQueryHandlers = [
	...IdpAdminQueryHandlers,
	...InteractionQueryHandlers,
	...PasswordResetQueryHandlers,
];

export const IdpCommandHandlers = [
	...IdpAdminCommandHandlers,
	...InteractionCommandHandlers,
	...OidcCommandHandlers,
	...PasswordResetCommandHandlers,
];

export const IdpUseCaseProviders = [...IdpCommandHandlers, ...IdpQueryHandlers];

export * from "./admin";
export * from "./interaction";
export * from "./oidc";
export * from "./password-reset";
