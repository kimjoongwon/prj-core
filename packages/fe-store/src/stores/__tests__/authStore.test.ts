/// <reference types="vitest/globals" />

import { navigateTo } from "@cocrepo/toolkit";
import { beforeEach, describe, expect, it, vi } from "vitest";
import { AuthStore } from "../authStore";
import type { PersistStore } from "../persistStore";
import type { RootStore } from "../Store";

// 의존성 모킹
vi.mock("@cocrepo/toolkit", () => ({
	navigateTo: vi.fn(),
	createLogger: vi.fn(() => ({
		info: vi.fn(),
		error: vi.fn(),
	})),
}));

describe("AuthStore", () => {
	let authStore: AuthStore;
	let mockRootStore: RootStore;
	let mockPersistStore: Partial<PersistStore>;

	beforeEach(() => {
		// PersistStore 모킹
		mockPersistStore = {
			isAccessTokenExpired: false,
		};

		// RootStore 모킹
		mockRootStore = {
			persistStore: mockPersistStore as PersistStore,
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
			expect(authStore.rootStore.persistStore).toBeDefined();
		});

		it("isLoggingOut 초기값이 false여야 함", () => {
			expect(authStore.isLoggingOut).toBe(false);
		});
	});

	describe("isAuthenticated", () => {
		it("토큰이 만료되지 않았으면 true를 반환해야 함", () => {
			// Given - beforeEach에서 isAccessTokenExpired: false로 설정됨
			// Then
			expect(authStore.isAuthenticated).toBe(true);
		});

		it("토큰이 만료되었으면 false를 반환해야 함", () => {
			// Given - MobX computed는 비-observable mock 변경을 감지하지 못하므로 새 인스턴스 생성
			const expiredRootStore = {
				persistStore: { isAccessTokenExpired: true } as PersistStore,
			} as unknown as RootStore;
			const expiredAuthStore = new AuthStore(expiredRootStore);

			// Then
			expect(expiredAuthStore.isAuthenticated).toBe(false);
		});

		it("persistStore가 없으면 true를 반환해야 함", () => {
			// Given - persistStore 없이 새 인스턴스 생성
			const noPersistRootStore = {
				persistStore: undefined,
			} as unknown as RootStore;
			const noPersistAuthStore = new AuthStore(noPersistRootStore);

			// Then
			expect(noPersistAuthStore.isAuthenticated).toBe(true);
		});
	});

	describe("handleAuthError 메서드", () => {
		it("에러를 그대로 reject해야 함", async () => {
			// Given
			const mockError = new Error("인증 에러");

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
