import type { HttpRequestLike } from "@cocrepo/type";

const UNKNOWN_HTTP_CLIENT_VALUE = "unknown";

export function resolveHttpClientIp(request: HttpRequestLike): string {
	const forwarded = request.headers?.["x-forwarded-for"];

	if (Array.isArray(forwarded)) {
		const firstForwarded = forwarded[0]?.split(",")[0]?.trim();
		if (firstForwarded) {
			return firstForwarded;
		}
	}

	if (typeof forwarded === "string") {
		const firstForwarded = forwarded.split(",")[0]?.trim();
		if (firstForwarded) {
			return firstForwarded;
		}
	}

	return (
		request.ip || request.socket?.remoteAddress || UNKNOWN_HTTP_CLIENT_VALUE
	);
}

export function resolveHttpUserAgent(request: HttpRequestLike): string {
	const userAgent = request.headers?.["user-agent"];

	if (Array.isArray(userAgent)) {
		return userAgent[0] || UNKNOWN_HTTP_CLIENT_VALUE;
	}

	return userAgent || UNKNOWN_HTTP_CLIENT_VALUE;
}
