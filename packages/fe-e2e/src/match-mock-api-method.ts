import type { MockApiHandler } from "./mock-api-handler";

export function matchMockApiMethod(
	handler: MockApiHandler,
	method: string,
): boolean {
	if (!handler.method) {
		return true;
	}

	const normalizedMethod = method.toUpperCase();
	const allowedMethods = Array.isArray(handler.method)
		? handler.method
		: [handler.method];

	return allowedMethods.some((allowedMethod) => allowedMethod === normalizedMethod);
}
