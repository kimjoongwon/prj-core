import { type NextRequest, NextResponse } from "next/server";

const DEFAULT_RETURN_TO = "/dashboard";
const IDP_WEB_CLIENT_ID = "idp-web";

function resolveSafeReturnTo(request: NextRequest): string {
	const rawReturnTo =
		request.nextUrl.searchParams.get("returnTo") || DEFAULT_RETURN_TO;

	try {
		const returnTo = new URL(rawReturnTo, request.nextUrl.origin);
		if (returnTo.origin !== request.nextUrl.origin) {
			return new URL(DEFAULT_RETURN_TO, request.nextUrl.origin).toString();
		}

		return returnTo.toString();
	} catch {
		return new URL(DEFAULT_RETURN_TO, request.nextUrl.origin).toString();
	}
}

function createErrorRedirectUrl(request: NextRequest): URL {
	const errorUrl = new URL("/error", request.nextUrl.origin);
	const error = request.nextUrl.searchParams.get("error");
	const errorDescription =
		request.nextUrl.searchParams.get("error_description");

	if (error) {
		errorUrl.searchParams.set("error", error);
	}

	if (errorDescription) {
		errorUrl.searchParams.set("error_description", errorDescription);
	}

	return errorUrl;
}

export function GET(request: NextRequest) {
	if (request.nextUrl.searchParams.has("error")) {
		return NextResponse.redirect(createErrorRedirectUrl(request));
	}

	const loginUrl = new URL("/api/v1/auth/login", request.nextUrl.origin);
	loginUrl.searchParams.set("clientId", IDP_WEB_CLIENT_ID);
	loginUrl.searchParams.set("returnTo", resolveSafeReturnTo(request));

	return NextResponse.redirect(loginUrl);
}
