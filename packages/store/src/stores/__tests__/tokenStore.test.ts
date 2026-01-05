/// <reference types="vitest/globals" />

import { beforeEach, describe, expect, it, vi } from "vitest";
import type { RootStore } from "../Store";
import { TokenStore } from "../tokenStore";

// CookieStore 모킹
vi.mock("../cookieStore", () => ({
	CookieStore: vi.fn().mockImplementation(() => ({
		set: vi.fn(),
		get: vi.fn(),
		remove: vi.fn(),
		getAll: vi.fn(),
	})),
}));

describe("TokenStore", () => {
	let tokenStore: TokenStore;
	let mockRootStore: RootStore;
	let mockCookieStore: {
		set: ReturnType<typeof vi.fn>;
		get: ReturnType<typeof vi.fn>;
		remove: ReturnType<typeof vi.fn>;
	};

	// 유효한 JWT 토큰 생성 (만료 시간 포함)
	const createMockToken = (expiresInSeconds: number): string => {
		const header = btoa(JSON.stringify({ alg: "HS256", typ: "JWT" }));
		const payload = btoa(
			JSON.stringify({
				userId: "test-user",
				exp: Math.floor(Date.now() / 1000) + expiresInSeconds,
			}),
		);
		const signature = "mock-signature";
		return `${header}.${payload}.${signature}`;
	};

	beforeEach(() => {
		vi.clearAllMocks();

		mockRootStore = {} as RootStore;
		tokenStore = new TokenStore(mockRootStore);

		// CookieStore 인스턴스에 접근
		mockCookieStore = (tokenStore as unknown).cookieStore;
	});

	describe("setAccessToken", () => {
		it("쿠키에 액세스 토큰을 설정해야 한다", () => {
			// Given
			const token = "test-access-token";

			// When
			tokenStore.setAccessToken(token);

			// Then
			expect(mockCookieStore.set).toHaveBeenCalledWith("accessToken", token, {
				path: "/",
				secure: true,
				sameSite: "strict",
			});
		});
	});

	describe("getAccessToken", () => {
		it("쿠키에서 액세스 토큰을 가져와야 한다", () => {
			// Given
			const token = "test-access-token";
			mockCookieStore.get.mockReturnValue(token);

			// When
			const result = tokenStore.getAccessToken();

			// Then
			expect(mockCookieStore.get).toHaveBeenCalledWith("accessToken");
			expect(result).toBe(token);
		});

		it("토큰이 없으면 null을 반환해야 한다", () => {
			// Given
			mockCookieStore.get.mockReturnValue(undefined);

			// When
			const result = tokenStore.getAccessToken();

			// Then
			expect(result).toBeNull();
		});
	});

	describe("setRefreshToken", () => {
		it("쿠키에 리프레시 토큰을 설정해야 한다", () => {
			// Given
			const token = "test-refresh-token";

			// When
			tokenStore.setRefreshToken(token);

			// Then
			expect(mockCookieStore.set).toHaveBeenCalledWith("refreshToken", token, {
				path: "/",
				secure: true,
				sameSite: "strict",
				httpOnly: false,
			});
		});
	});

	describe("getRefreshToken", () => {
		it("쿠키에서 리프레시 토큰을 가져와야 한다", () => {
			// Given
			const token = "test-refresh-token";
			mockCookieStore.get.mockReturnValue(token);

			// When
			const result = tokenStore.getRefreshToken();

			// Then
			expect(mockCookieStore.get).toHaveBeenCalledWith("refreshToken");
			expect(result).toBe(token);
		});
	});

	describe("clearTokens", () => {
		it("모든 토큰을 쿠키에서 제거해야 한다", () => {
			// When
			tokenStore.clearTokens();

			// Then
			expect(mockCookieStore.remove).toHaveBeenCalledWith("accessToken", {
				path: "/",
			});
			expect(mockCookieStore.remove).toHaveBeenCalledWith("refreshToken", {
				path: "/",
			});
		});
	});

	describe("hasValidTokens", () => {
		it("두 토큰이 모두 있으면 true를 반환해야 한다", () => {
			// Given
			mockCookieStore.get.mockImplementation((name: string) => {
				if (name === "accessToken") return "access";
				if (name === "refreshToken") return "refresh";
				return undefined;
			});

			// When
			const result = tokenStore.hasValidTokens();

			// Then
			expect(result).toBe(true);
		});

		it("액세스 토큰이 없으면 false를 반환해야 한다", () => {
			// Given
			mockCookieStore.get.mockImplementation((name: string) => {
				if (name === "refreshToken") return "refresh";
				return undefined;
			});

			// When
			const result = tokenStore.hasValidTokens();

			// Then
			expect(result).toBe(false);
		});

		it("리프레시 토큰이 없으면 false를 반환해야 한다", () => {
			// Given
			mockCookieStore.get.mockImplementation((name: string) => {
				if (name === "accessToken") return "access";
				return undefined;
			});

			// When
			const result = tokenStore.hasValidTokens();

			// Then
			expect(result).toBe(false);
		});
	});

	describe("isAccessTokenExpired", () => {
		it("토큰이 없으면 true를 반환해야 한다", () => {
			// Given
			mockCookieStore.get.mockReturnValue(undefined);

			// When
			const result = tokenStore.isAccessTokenExpired();

			// Then
			expect(result).toBe(true);
		});

		it("유효하지 않은 토큰 형식이면 true를 반환해야 한다", () => {
			// Given
			mockCookieStore.get.mockReturnValue("invalid-token");

			// When
			const result = tokenStore.isAccessTokenExpired();

			// Then
			expect(result).toBe(true);
		});

		it("토큰이 만료되었으면 true를 반환해야 한다", () => {
			// Given
			const expiredToken = createMockToken(-3600); // 1시간 전 만료
			mockCookieStore.get.mockReturnValue(expiredToken);

			// When
			const result = tokenStore.isAccessTokenExpired();

			// Then
			expect(result).toBe(true);
		});

		it("토큰이 유효하면 false를 반환해야 한다", () => {
			// Given
			const validToken = createMockToken(3600); // 1시간 후 만료
			mockCookieStore.get.mockReturnValue(validToken);

			// When
			const result = tokenStore.isAccessTokenExpired();

			// Then
			expect(result).toBe(false);
		});

		it("exp 클레임이 없으면 true를 반환해야 한다", () => {
			// Given
			const header = btoa(JSON.stringify({ alg: "HS256", typ: "JWT" }));
			const payload = btoa(JSON.stringify({ userId: "test-user" })); // exp 없음
			const tokenWithoutExp = `${header}.${payload}.signature`;
			mockCookieStore.get.mockReturnValue(tokenWithoutExp);

			// When
			const result = tokenStore.isAccessTokenExpired();

			// Then
			expect(result).toBe(true);
		});
	});
});
