import {
	AuthAccountCommandHandlers,
	AuthAccountQueryHandlers,
} from "./account";
import { AuthAdminCommandHandlers, AuthAdminQueryHandlers } from "./admin";
import { AuthNativeSessionCommandHandlers } from "./native-session";
import { AuthOidcCommandHandlers } from "./oidc";

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

export * from "./account";
export * from "./admin";
export * from "./native-session";
export * from "./oidc";
