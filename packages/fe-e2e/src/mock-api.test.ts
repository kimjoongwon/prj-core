import { describe, expect, it } from "vitest";
import type { E2ERequestLike } from "./e2e-request-like";
import type { E2ERouteLike } from "./e2e-route-like";
import { expectSpaceHeader } from "./expect-space-header";
import { mockApi } from "./mock-api";

class FakeRequest implements E2ERequestLike {
	constructor(
		private readonly requestUrl: string,
		private readonly requestMethod: string,
		private readonly requestHeaders: Record<string, string> = {},
		private readonly requestBody?: unknown,
	) {}

	url() {
		return this.requestUrl;
	}

	method() {
		return this.requestMethod;
	}

	headers() {
		return this.requestHeaders;
	}

	postDataJSON() {
		return this.requestBody;
	}
}

class FakeRoute implements E2ERouteLike {
	fulfilled?: {
		status?: number;
		contentType?: string;
		body?: string;
		headers?: Record<string, string>;
		json?: unknown;
	};
	fallbackCalled = false;
	continueCalled = false;

	constructor(private readonly fakeRequest: E2ERequestLike) {}

	request() {
		return this.fakeRequest;
	}

	async fulfill(response: {
		status?: number;
		contentType?: string;
		body?: string;
		headers?: Record<string, string>;
		json?: unknown;
	}) {
		this.fulfilled = response;
	}

	async fallback() {
		this.fallbackCalled = true;
	}

	async continue() {
		this.continueCalled = true;
	}
}

class FakePage {
	handler?: (route: E2ERouteLike) => Promise<void> | void;

	async route(_url: string | RegExp, handler: (route: E2ERouteLike) => Promise<void> | void) {
		this.handler = handler;
	}

	async trigger(route: FakeRoute) {
		if (!this.handler) {
			throw new Error("Route handler was not registered.");
		}

		await this.handler(route);
	}
}

describe("mockApi", () => {
	it("matches method, path, and query before fulfilling json", async () => {
		const page = new FakePage();
		await mockApi(page, [
			{
				method: "GET",
				url: (url) =>
					url.pathname === "/api/v1/users" && url.searchParams.get("take") === "20",
				status: 201,
				json: { data: [{ id: "user-1" }] },
			},
		]);

		const route = new FakeRoute(
			new FakeRequest("http://localhost:3006/api/v1/users?take=20", "GET"),
		);
		await page.trigger(route);

		expect(route.fulfilled?.status).toBe(201);
		expect(route.fulfilled?.contentType).toBe("application/json");
		expect(JSON.parse(route.fulfilled?.body ?? "{}")).toEqual({
			data: [{ id: "user-1" }],
		});
	});

	it("falls through when no handler matches", async () => {
		const page = new FakePage();
		await mockApi(page, [
			{
				method: "POST",
				url: "/api/v1/users",
				json: { data: [] },
			},
		]);

		const route = new FakeRoute(
			new FakeRequest("http://localhost:3006/api/v1/users", "GET"),
		);
		await page.trigger(route);

		expect(route.fallbackCalled).toBe(true);
		expect(route.fulfilled).toBeUndefined();
	});

	it("supports glob strings and one-time handlers", async () => {
		const page = new FakePage();
		await mockApi(page, [
			{
				url: "**/api/v1/assets**",
				once: true,
				json: { data: ["first"] },
			},
		]);

		const firstRoute = new FakeRoute(
			new FakeRequest("http://localhost:3006/api/v1/assets?skip=0", "GET"),
		);
		await page.trigger(firstRoute);
		const secondRoute = new FakeRoute(
			new FakeRequest("http://localhost:3006/api/v1/assets?skip=0", "GET"),
		);
		await page.trigger(secondRoute);

		expect(JSON.parse(firstRoute.fulfilled?.body ?? "{}")).toEqual({
			data: ["first"],
		});
		expect(secondRoute.fallbackCalled).toBe(true);
	});

	it("surfaces request header assertion failures", () => {
		const route = new FakeRoute(
			new FakeRequest("http://localhost:3006/api/v1/assets", "GET", {
				"x-space-id": "wrong-space",
			}),
		);

		expect(() => expectSpaceHeader(route, "expected-space")).toThrow(
			"x-space-id header mismatch. Expected expected-space, received wrong-space.",
		);
	});
});
