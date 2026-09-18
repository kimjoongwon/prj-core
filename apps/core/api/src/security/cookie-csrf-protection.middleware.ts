import { ForbiddenException } from "@nestjs/common";
import type { NextFunction, Request, Response } from "express";
import type { RuntimeSecurityConfig } from "../config";

const SAFE_HTTP_METHODS = new Set(["GET", "HEAD", "OPTIONS", "TRACE"]);

const readRequestOrigin = (request: Request): string | undefined => {
	const origin = request.header("origin")?.trim();
	if (origin) {
		return origin;
	}

	const referer = request.header("referer")?.trim();
	if (!referer) {
		return undefined;
	}

	try {
		return new URL(referer).origin;
	} catch {
		return undefined;
	}
};

const isCookieAuthenticatedApiStateChange = (request: Request): boolean =>
	!SAFE_HTTP_METHODS.has(request.method) &&
	request.path.startsWith("/api/v1/") &&
	typeof request.cookies?.accessToken === "string" &&
	request.cookies.accessToken.length > 0;

const isTrustedBrowserOrigin = (
	requestOrigin: string | undefined,
	runtimeSecurity: RuntimeSecurityConfig,
): boolean => {
	if (!requestOrigin) {
		return false;
	}
	if (
		!runtimeSecurity.isProduction &&
		runtimeSecurity.cors.allowedOrigins.length === 0
	) {
		return true;
	}
	return runtimeSecurity.cors.allowedOrigins.includes(requestOrigin);
};

export const createCookieCsrfProtection =
	(runtimeSecurity: RuntimeSecurityConfig) =>
	(request: Request, _response: Response, next: NextFunction): void => {
		if (!isCookieAuthenticatedApiStateChange(request)) {
			next();
			return;
		}

		if (isTrustedBrowserOrigin(readRequestOrigin(request), runtimeSecurity)) {
			next();
			return;
		}

		next(
			new ForbiddenException(
				"Cookie-authenticated state changes require a trusted Origin or Referer.",
			),
		);
	};
