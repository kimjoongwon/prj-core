import { refreshToken } from "@cocrepo/api-client";
import { CookieStore } from "./cookieStore";
import { PlateStore } from "./Store";

export class TokenStore {
	private cookieStore: CookieStore;
	readonly plateStore: PlateStore;

	constructor(plateStore: PlateStore) {
		this.plateStore = plateStore;
		this.cookieStore = new CookieStore();
	}

	setAccessToken(token: string): void {
		this.cookieStore.set("accessToken", token, {
			path: "/",
			secure: true,
			sameSite: "strict",
		});
	}

	getAccessToken(): string | null {
		return this.cookieStore.get("accessToken") || null;
	}

	setRefreshToken(token: string): void {
		this.cookieStore.set("refreshToken", token, {
			path: "/",
			secure: true,
			sameSite: "strict",
			httpOnly: false,
		});
	}

	getRefreshToken(): string | null {
		return this.cookieStore.get("refreshToken") || null;
	}

	clearTokens(): void {
		this.cookieStore.remove("accessToken", { path: "/" });
		this.cookieStore.remove("refreshToken", { path: "/" });
	}

	hasValidTokens(): boolean {
		return !!(this.getAccessToken() && this.getRefreshToken());
	}

	isAccessTokenExpired(): boolean {
		const token = this.getAccessToken();
		if (!token) return true;

		try {
			const parts = token.split(".");
			if (parts.length !== 3) return true;

			const payload = JSON.parse(atob(parts[1]));
			if (!payload.exp) return true;

			const currentTime = Math.floor(Date.now() / 1000);
			return payload.exp < currentTime;
		} catch (_error) {
			return true;
		}
	}

	async refreshToken() {
		try {
			await refreshToken();
		} catch (error) {
			console.error("Token refresh failed:", error);
			this.clearTokens();
			throw error;
		}
	}
}
