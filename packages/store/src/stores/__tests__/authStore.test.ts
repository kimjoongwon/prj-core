/// <reference types="vitest/globals" />

import { navigateTo } from "@cocrepo/toolkit";
import { isAxiosError } from "axios";
import { beforeEach, describe, expect, it, vi } from "vitest";
import { AuthStore } from "../authStore";
import type { RootStore } from "../Store";
import type { TokenStore } from "../tokenStore";

// 의존성 모킹
vi.mock("@cocrepo/toolkit", () => ({
	navigateTo: vi.fn(),
	createLogger: vi.fn(() => ({
		info: vi.fn(),
		error: vi.fn(),
	})),
}));
vi.mock("axios");

describe("AuthStore", () => {
	let authStore: AuthStore;
	let mockRootStore: RootStore;
	let mockTokenStore: TokenStore;

	beforeEach(() => {
		// TokenStore 모킹
		mockTokenStore = {
			isAccessTokenExpired: vi.fn().mockReturnValue(false),
		} as unknown as TokenStore;

		// RootStore 모킹
		mockRootStore = {
			tokenStore: mockTokenStore,
		} as unknown as RootStore;

		// Mock 리셋
		vi.clearAllMocks();

		// window.location 모킹
		Object.defineProperty(window, "location", {
			value: { href: "" },
			writable: true,
		});

		authStore = new AuthStore(mockRootStore);
	});

	describe("생성자", () => {
		it("RootStore 의존성이 올바르게 주입되어야 함", () => {
			expect(authStore.rootStore).toBeDefined();
			expect(authStore.rootStore.tokenStore).toBeDefined();
		});

		it("isLoggingOut 초기값이 false여야 함", () => {
			expect(authStore.isLoggingOut).toBe(false);
		});
	});

	describe("isAuthenticated", () => {
		it("토큰이 만료되지 않았으면 true를 반환해야 함", () => {
			// Given
			(
				mockTokenStore.isAccessTokenExpired as unknown as ReturnType<
					typeof vi.fn
				>
			).mockReturnValue(false);

			// Then
			expect(authStore.isAuthenticated).toBe(true);
		});

		it("토큰이 만료되었으면 false를 반환해야 함", () => {
			// Given
			(
				mockTokenStore.isAccessTokenExpired as unknown as ReturnType<
					typeof vi.fn
				>
			).mockReturnValue(true);

			// Then
			expect(authStore.isAuthenticated).toBe(false);
		});

		it("tokenStore가 없으면 true를 반환해야 함", () => {
			// Given
			mockRootStore.tokenStore = undefined;

			// Then
			expect(authStore.isAuthenticated).toBe(true);
		});
	});

	describe("handleAuthError 메서드", () => {
		it("401 에러 시 로그인 페이지로 리다이렉트해야 함", async () => {
			// Given
			const mockError = {
				response: { status: 401 },
			};
			(isAxiosError as unknown as ReturnType<typeof vi.fn>).mockReturnValue(
				true,
			);

			// When
			await authStore.handleAuthError(mockError);

			// Then
			expect(window.location.href).toBe("/admin/auth/login");
		});

		it("401이 아닌 Axios 에러는 그대로 reject해야 함", async () => {
			// Given
			const mockError = {
				response: { status: 500 },
			};
			(isAxiosError as unknown as ReturnType<typeof vi.fn>).mockReturnValue(
				true,
			);

			// When & Then
			await expect(authStore.handleAuthError(mockError)).rejects.toBe(
				mockError,
			);
		});

		it("Axios 에러가 아닌 경우 그대로 reject해야 함", async () => {
			// Given
			const mockError = new Error("일반 에러");
			(isAxiosError as unknown as ReturnType<typeof vi.fn>).mockReturnValue(
				false,
			);

			// When & Then
			await expect(authStore.handleAuthError(mockError)).rejects.toBe(
				mockError,
			);
		});
	});

	describe("logout 메서드", () => {
		it("로그아웃 API 호출 성공 시 로그인 페이지로 이동해야 함", async () => {
			// Given
			const mockLogoutApi = vi.fn().mockResolvedValue(undefined);

			// When
			await authStore.logout(mockLogoutApi);

			// Then
			expect(mockLogoutApi).toHaveBeenCalled();
			expect(navigateTo).toHaveBeenCalledWith("/admin/auth/login", true);
			expect(authStore.isLoggingOut).toBe(false);
		});

		it("로그아웃 API 호출 실패 시에도 로그인 페이지로 이동해야 함", async () => {
			// Given
			const mockLogoutApi = vi.fn().mockRejectedValue(new Error("API 에러"));

			// When
			await authStore.logout(mockLogoutApi);

			// Then
			expect(mockLogoutApi).toHaveBeenCalled();
			expect(navigateTo).toHaveBeenCalledWith("/admin/auth/login", true);
			expect(authStore.isLoggingOut).toBe(false);
		});

		it("로그아웃 API가 제공되지 않은 경우에도 로그인 페이지로 이동해야 함", async () => {
			// When
			await authStore.logout();

			// Then
			expect(navigateTo).toHaveBeenCalledWith("/admin/auth/login", true);
			expect(authStore.isLoggingOut).toBe(false);
		});

		it("로그아웃 처리 중 isLoggingOut 상태가 올바르게 관리되어야 함", async () => {
			// Given
			const mockLogoutApi = vi.fn().mockImplementation(() => {
				expect(authStore.isLoggingOut).toBe(true);
				return Promise.resolve();
			});

			expect(authStore.isLoggingOut).toBe(false);

			// When
			await authStore.logout(mockLogoutApi);

			// Then
			expect(authStore.isLoggingOut).toBe(false);
		});

		it("로그아웃 API 에러 발생 시에도 isLoggingOut 상태가 false로 되돌아가야 함", async () => {
			// Given
			const mockLogoutApi = vi.fn().mockRejectedValue(new Error("API 에러"));

			expect(authStore.isLoggingOut).toBe(false);

			// When
			await authStore.logout(mockLogoutApi);

			// Then
			expect(authStore.isLoggingOut).toBe(false);
		});
	});
});
