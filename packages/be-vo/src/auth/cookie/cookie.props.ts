export interface CookieProps {
	maxAge: number;
	httpOnly: boolean;
	secure: boolean;
	sameSite: "strict" | "lax" | "none";
	path: string;
}
