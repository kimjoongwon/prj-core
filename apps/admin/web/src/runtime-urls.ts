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
