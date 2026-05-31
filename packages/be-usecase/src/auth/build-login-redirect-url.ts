export function buildLoginRedirectUrl(
	loginUrl: string,
	errorMessage: string,
): string {
	try {
		const url = new URL(loginUrl);
		url.searchParams.set("error", errorMessage);
		return url.toString();
	} catch {
		const joiner = loginUrl.includes("?") ? "&" : "?";
		return `${loginUrl}${joiner}error=${encodeURIComponent(errorMessage)}`;
	}
}
