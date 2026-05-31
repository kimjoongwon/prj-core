export interface CookieOptions {
	maxAge?: number;
	httpOnly?: boolean;
	secure?: boolean;
	sameSite?: "strict" | "lax" | "none";
	path?: string;
	domain?: string;
}
