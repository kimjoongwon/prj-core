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
	it("login shell renders the native login form", async () => {
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
			'action="/__storybook_auth/native-login?returnTo=http%3A%2F%2Flocalhost%3A6006%2Fiframe.html%3Fid%3Dfeatures-button--primary"',
		);
		expect(String(response.body)).toContain('name="email"');
		expect(String(response.body)).toContain('name="password"');
		expect(String(response.body)).not.toContain(
			"/api/v1/auth/login?clientId=storybook",
		);
		expect(next).not.toHaveBeenCalled();
	});

	it("native login stores storybook auth cookies and redirects back", async () => {
		const fetchMock = vi.fn(async (url) => {
			if (String(url).endsWith("/api/v1/auth/verify-token")) {
				return createSessionResponse(401, {
					authenticated: false,
					status: 401,
					data: null,
					message: "Storybook auth session not found.",
				});
			}

			return createSessionResponse(200, {
				data: {
					accessToken: "access-token",
					refreshToken: "refresh-token",
					sessionId: "storybook.session",
					accessTokenExpiresAt: Date.now() + 60_000,
					refreshTokenExpiresAt: Date.now() + 120_000,
					user: {},
				},
			});
		});
		vi.stubGlobal("fetch", fetchMock);

		const middleware = await installMiddleware({
			requireAuth: true,
			coreApiTarget: "http://localhost:3006",
			idpApiTarget: "http://localhost:3007",
		});
		const request = createRequest(
			"/__storybook_auth/native-login?returnTo=%2Fiframe.html%3Fid%3Dfeatures-button--primary",
			{
				method: "POST",
				headers: {
					"content-type": "application/x-www-form-urlencoded",
				},
					body: "email=admin%40example.com&password=secret",
			},
		);
		const response = createResponse();
		const next = vi.fn();

		await middleware(request, response, next);

		expect(response.statusCode).toBe(302);
		expect(response.getHeader("location")).toBe(
			"http://localhost:6006/iframe.html?id=features-button--primary",
		);
		expect(response.getHeader("set-cookie")).toEqual(
			expect.arrayContaining([
				expect.stringContaining("accessToken=access-token"),
				expect.stringContaining("refreshToken=refresh-token"),
				expect.stringContaining("sessionId=storybook.session"),
			]),
		);
		expect(fetchMock).toHaveBeenCalledWith(
			"http://localhost:3007/api/v1/auth/native/login",
			expect.objectContaining({
				method: "POST",
				body: JSON.stringify({
					email: "admin@example.com",
					password: "secret",
				}),
			}),
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
