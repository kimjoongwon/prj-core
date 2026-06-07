import type { MockApiContext } from "./mock-api-context";
import type { MockApiMatcher } from "./mock-api-matcher";
import type { MockApiMethod } from "./mock-api-method";

export interface MockApiHandler {
	url: MockApiMatcher;
	method?: MockApiMethod | readonly MockApiMethod[];
	status?: number;
	headers?: Record<string, string>;
	body?: string;
	json?: unknown | ((context: MockApiContext) => unknown | Promise<unknown>);
	assert?: (context: MockApiContext) => void | Promise<void>;
	once?: boolean;
}
