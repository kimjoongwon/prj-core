export function extractBearerToken(authorization?: string): string | undefined {
	const [scheme, token] = authorization?.split(" ") ?? [];
	if (scheme?.toLowerCase() !== "bearer" || !token) {
		return undefined;
	}

	return token;
}
