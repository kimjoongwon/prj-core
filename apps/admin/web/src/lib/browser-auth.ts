import { Token } from "@cocrepo/constant";

function hasBrowserCookieValue(cookieName: string): boolean {
	if (typeof document === "undefined") {
		return false;
	}

	return document.cookie.split("; ").some((cookie) => {
		if (!cookie.startsWith(`${cookieName}=`)) {
			return false;
		}

		return cookie.slice(cookieName.length + 1).length > 0;
	});
}

export function hasAdminBrowserSessionCookie(): boolean {
	return (
		hasBrowserCookieValue(Token.ACCESS) ||
		hasBrowserCookieValue(Token.REFRESH)
	);
}
