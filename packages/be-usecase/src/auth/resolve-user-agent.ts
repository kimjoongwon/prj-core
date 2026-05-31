import type { Request } from "express";

export function resolveUserAgent(req: Request): string {
	const userAgent = req.headers["user-agent"];
	if (Array.isArray(userAgent)) {
		return userAgent[0] ?? "unknown";
	}
	return userAgent || "unknown";
}
