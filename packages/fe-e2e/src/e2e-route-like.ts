import type { E2ERequestLike } from "./e2e-request-like";

export interface E2ERouteLike {
	request(): E2ERequestLike;
	fulfill(response: {
		status?: number;
		contentType?: string;
		body?: string;
		headers?: Record<string, string>;
		json?: unknown;
	}): Promise<void>;
	fallback?(): Promise<void>;
	continue?(): Promise<void>;
}
