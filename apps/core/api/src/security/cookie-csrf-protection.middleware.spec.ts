import type { NextFunction, Request, Response } from "express";
import type { RuntimeSecurityConfig } from "../config";
import { createCookieCsrfProtection } from "./cookie-csrf-protection.middleware";

const productionRuntimeSecurity: RuntimeSecurityConfig = {
	isProduction: true,
	trustProxyHops: 1,
	cors: {
		enabled: true,
		allowedOrigins: ["https://admin.example.com"],
	},
	swagger: {
		enabled: false,
		allowedIps: [],
	},
};

const createRequest = (overrides: {
	method?: string;
	path?: string;
	cookies?: Record<string, string>;
	headers?: Record<string, string | undefined>;
}): Request => {
	const headers = overrides.headers ?? {};
	return {
		method: overrides.method ?? "POST",
		path: overrides.path ?? "/api/v1/actions",
		cookies: overrides.cookies ?? {},
		header: (name: string) => headers[name.toLowerCase()],
	} as unknown as Request;
};

const invokeCsrfProtection = (
	runtimeSecurity: RuntimeSecurityConfig,
	request: Request,
) => {
	const next = jest.fn() as jest.MockedFunction<NextFunction>;
	createCookieCsrfProtection(runtimeSecurity)(request, {} as Response, next);
	return next;
};

describe("createCookieCsrfProtection", () => {
	it("trusted Origin의 cookie 인증 상태 변경을 허용해야 한다", () => {
		const next = invokeCsrfProtection(
			productionRuntimeSecurity,
			createRequest({
				cookies: { accessToken: "cookie-token" },
				headers: { origin: "https://admin.example.com" },
			}),
		);

		expect(next).toHaveBeenCalledWith();
	});

	it("Origin이 없으면 trusted Referer origin을 사용해야 한다", () => {
		const next = invokeCsrfProtection(
			productionRuntimeSecurity,
			createRequest({
				cookies: { accessToken: "cookie-token" },
				headers: { referer: "https://admin.example.com/settings?tab=profile" },
			}),
		);

		expect(next).toHaveBeenCalledWith();
	});

	it("untrusted Origin의 cookie 인증 상태 변경은 차단해야 한다", () => {
		const next = invokeCsrfProtection(
			productionRuntimeSecurity,
			createRequest({
				cookies: { accessToken: "cookie-token" },
				headers: { origin: "https://attacker.example.com" },
			}),
		);

		const csrfError = next.mock.calls[0]?.[0];
		if (!csrfError) {
			throw new Error(
				"CSRF middleware did not pass a rejection error to next.",
			);
		}
		expect(csrfError).toMatchObject({ status: 403 });
	});

	it("Bearer-only API와 안전한 method는 cookie CSRF 검사를 우회해야 한다", () => {
		const bearerNext = invokeCsrfProtection(
			productionRuntimeSecurity,
			createRequest({ headers: { origin: "https://attacker.example.com" } }),
		);
		const safeMethodNext = invokeCsrfProtection(
			productionRuntimeSecurity,
			createRequest({
				method: "GET",
				cookies: { accessToken: "cookie-token" },
			}),
		);

		expect(bearerNext).toHaveBeenCalledWith();
		expect(safeMethodNext).toHaveBeenCalledWith();
	});
});
