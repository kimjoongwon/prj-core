import type { E2EPageRouteLike } from "./e2e-page-route-like";
import type { MockApiHandler } from "./mock-api-handler";
import { matchMockApiMethod } from "./match-mock-api-method";
import { matchMockApiUrl } from "./match-mock-api-url";
import { passThroughRoute } from "./pass-through-route";

export async function mockApi(
	page: E2EPageRouteLike,
	handlers: readonly MockApiHandler[],
) {
	const activeHandlers = [...handlers];

	await page.route("**/*", async (route) => {
		const request = route.request();
		const url = new URL(request.url());
		const method = request.method().toUpperCase();
		const handlerIndex = activeHandlers.findIndex(
			(handler) =>
				matchMockApiMethod(handler, method) && matchMockApiUrl(handler.url, url),
		);

		if (handlerIndex < 0) {
			await passThroughRoute(route);
			return;
		}

		const handler = activeHandlers[handlerIndex];
		const context = { route, request, url, method };
		await handler.assert?.(context);

		if (handler.once) {
			activeHandlers.splice(handlerIndex, 1);
		}

		if (handler.body !== undefined) {
			await route.fulfill({
				status: handler.status ?? 200,
				headers: handler.headers,
				body: handler.body,
			});
			return;
		}

		const json =
			typeof handler.json === "function"
				? await handler.json(context)
				: handler.json;

		await route.fulfill({
			status: handler.status ?? 200,
			contentType: "application/json",
			headers: handler.headers,
			body: JSON.stringify(json ?? {}),
		});
	});
}
