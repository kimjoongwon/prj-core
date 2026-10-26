import {
	AuthAccountCommandHandlers,
	AuthAccountQueryHandlers,
} from "./account";
import { AuthOidcCommandHandlers } from "./oidc";

export const AuthCommandHandlers = [
	...AuthOidcCommandHandlers,
	...AuthAccountCommandHandlers,
];

export const AuthQueryHandlers = [...AuthAccountQueryHandlers];

export const AuthUseCaseProviders = [
	...AuthCommandHandlers,
	...AuthQueryHandlers,
];

export * from "./account";
export * from "./oidc";
