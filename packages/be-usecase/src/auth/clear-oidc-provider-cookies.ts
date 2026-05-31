import type { Response } from "express";
import { OIDC_PROVIDER_COOKIE_NAMES } from "./oidc-provider-cookie-names";

export function clearOidcProviderCookies(res: Response) {
	for (const cookieName of OIDC_PROVIDER_COOKIE_NAMES) {
		res.clearCookie(cookieName);
		res.clearCookie(`${cookieName}.sig`);
		res.clearCookie(`${cookieName}.legacy`);
		res.clearCookie(`${cookieName}.legacy.sig`);
	}
}
