const PRODUCTION_APP_HOST = "cocdev.co.kr";
const STAGING_APP_HOST = "stg.cocdev.co.kr";
const PRODUCTION_IDP_HOST = "idp.cocdev.co.kr";
const STAGING_IDP_HOST = "idp-stg.cocdev.co.kr";

export function resolveIdpClientUrl() {
	const envUrl = process.env.NEXT_PUBLIC_IDP_CLIENT_URL;
	if (envUrl) {
		return envUrl;
	}

	if (typeof window === "undefined") {
		return undefined;
	}

	if (window.location.hostname === "localhost") {
		return `${window.location.protocol}//localhost:3008`;
	}

	const url = new URL(window.location.origin);

	if (url.hostname === PRODUCTION_APP_HOST) {
		url.hostname = PRODUCTION_IDP_HOST;
		return url.origin;
	}

	if (url.hostname === STAGING_APP_HOST) {
		url.hostname = STAGING_IDP_HOST;
		return url.origin;
	}

	return undefined;
}

export function resolveWebSocketBaseUrl() {
	const envUrl = process.env.NEXT_PUBLIC_WS_URL;
	if (envUrl) {
		return envUrl;
	}

	if (typeof window === "undefined") {
		return undefined;
	}

	if (window.location.hostname === "localhost") {
		return "ws://localhost:4000";
	}

	const url = new URL(window.location.origin);
	url.protocol = url.protocol === "https:" ? "wss:" : "ws:";
	return url.origin;
}
