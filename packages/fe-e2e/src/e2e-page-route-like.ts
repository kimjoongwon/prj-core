import type { E2ERouteLike } from "./e2e-route-like";

export interface E2EPageRouteLike {
	route(
		url: string | RegExp,
		handler: (route: E2ERouteLike) => Promise<void> | void,
	): Promise<void>;
}
