import { afterEach, describe, expect, it, vi } from "vitest";
import { createStorybookAuthPlugin } from "./storybookAuthDevServer";

function createServer() {
	return {
		middlewares: {
			stack: [],
			use(handle) {
				this.stack.push({ handle });
			},
		},
	};
}

function createResponse() {
	const headers = new Map();

	return {
		body: "",
		ended: false,
		statusCode: 200,
		setHeader(name, value) {
			headers.set(name.toLowerCase(), value);
		},
		getHeader(name) {
			return headers.get(name.toLowerCase());
		},
		end(payload = "") {
			this.body = payload;
			this.ended = true;
		},
	};
}

function createRequest(url, options = {}) {
	return {
		method: "GET",
		url,
		headers: {
			host: "localhost:6006",
			accept: "text/html",
			cookie: "",
			...options.headers,
		},
		...options,
	};
}

async function installMiddleware(authConfig) {
	const plugin = createStorybookAuthPlugin(authConfig);
	const server = createServer();
	const register = plugin.configureServer(server);
	register();

	return server.middlewares.stack[0]?.handle;
}

function createSessionResponse(status, body) {
	return new Response(JSON.stringify(body), {
		status,
		headers: {
			"content-type": "application/json",
		},
	});
}

afterEach(() => {
	vi.restoreAllMocks();
	vi.unstubAllGlobals();
});

describe("storybookAuthDevServer", () => {
	it("login shell builds the generic storybook client login URL", async () => {
		vi.stubGlobal(
			"fetch",
			vi.fn(async () =>
				createSessionResponse(401, {
					authenticated: false,
					status: 401,
					data: null,
					message: "Storybook auth session not found.",
				}),
			),
		);

		const middleware = await installMiddleware({
			requireAuth: true,
			coreApiTarget: "http://localhost:3006",
			idpApiTarget: "http://localhost:3007",
		});
		const request = createRequest(
			"/__storybook_auth/login?returnTo=%2Fiframe.html%3Fid%3Dfeatures-button--primary",
		);
		const response = createResponse();
		const next = vi.fn();

		await middleware(request, response, next);

		expect(response.statusCode).toBe(200);
		expect(String(response.body)).toContain(
			'http://localhost:6006/api/v1/auth/login?clientId=storybook&amp;returnTo=http%3A%2F%2Flocalhost%3A6006%2Fiframe.html%3Fid%3Dfeatures-button--primary',
		);
		expect(next).not.toHaveBeenCalled();
	});

	it("protected iframe requests redirect to the storybook login shell with returnTo preserved", async () => {
		vi.stubGlobal(
			"fetch",
			vi.fn(async () =>
				createSessionResponse(401, {
					authenticated: false,
					status: 401,
					data: null,
					message: "Storybook auth session not found.",
				}),
			),
		);

		const middleware = await installMiddleware({
			requireAuth: true,
			coreApiTarget: "http://localhost:3006",
			idpApiTarget: "http://localhost:3007",
		});
		const request = createRequest(
			"/iframe.html?id=features-button--primary&viewMode=story",
		);
		const response = createResponse();
		const next = vi.fn();

		await middleware(request, response, next);

		expect(response.statusCode).toBe(302);
		expect(response.getHeader("location")).toBe(
			"/__storybook_auth/login?returnTo=http%3A%2F%2Flocalhost%3A6006%2Fiframe.html%3Fid%3Dfeatures-button--primary%26viewMode%3Dstory",
		);
		expect(next).not.toHaveBeenCalled();
	});
});
