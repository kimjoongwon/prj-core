import type { E2ERequestLike } from "./e2e-request-like";
import type { E2ERouteLike } from "./e2e-route-like";

export interface MockApiContext {
	route: E2ERouteLike;
	request: E2ERequestLike;
	url: URL;
	method: string;
}
