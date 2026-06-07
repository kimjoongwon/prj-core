import type { E2ERouteLike } from "./e2e-route-like";

export async function passThroughRoute(route: E2ERouteLike) {
	if (route.fallback) {
		await route.fallback();
		return;
	}

	if (route.continue) {
		await route.continue();
		return;
	}

	throw new Error("Route cannot pass through because fallback/continue is missing.");
}
