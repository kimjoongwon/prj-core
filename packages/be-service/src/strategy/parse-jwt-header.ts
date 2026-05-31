import type { JwtHeader } from "./jwt-header";

export const parseJwtHeader = (token?: string): JwtHeader | null => {
	if (!token?.includes(".")) {
		return null;
	}

	try {
		return JSON.parse(
			Buffer.from(token.split(".")[0], "base64url").toString(),
		) as JwtHeader;
	} catch {
		return null;
	}
};
