/// <reference types="vitest/globals" />

import { navigateTo } from "@cocrepo/toolkit";
import { beforeEach, describe, expect, it, vi } from "vitest";
import type { AppStore } from "../appStore";
import { Session } from "../session";
import type { Space } from "../space";

// 의존성 모킹
vi.mock("@cocrepo/toolkit", () => ({
	navigateTo: vi.fn(),
	createLogger: vi.fn(() => ({
		info: vi.fn(),
		error: vi.fn(),
	})),
}));

describe("Session", () => {
	let session: Session;
	let mockApp: AppStore;
	let mockSpace: Partial<Space>;

	beforeEach(() => {
		// Space 모킹
		mockSpace = {
			isAccessTokenExpired: false,
		};

		// AppStore 모킹
		mockApp = {
			space: mockSpace as Space,
		} as unknown as AppStore;

		// Mock 리셋
		vi.clearAllMocks();

		// window.location 모킹
		Object.defineProperty(window, "location", {
			value: { href: "" },
			writable: true,
		});

		session = new Session(mockApp);
	});

	describe("생성자", () => {
		it("app 의존성이 올바르게 주입되어야 함", () => {
			expect(session.app).toBeDefined();
			expect(session.app.space).toBeDefined();
		});

		it("isLoggingOut 초기값이 false여야 함", () => {
			expect(session.isLoggingOut).toBe(false);
		});
	});

	describe("isAuthenticated", () => {
		it("토큰이 만료되지 않았으면 true를 반환해야 함", () => {
			// Given - beforeEach에서 isAccessTokenExpired: false로 설정됨
			// Then
			expect(session.isAuthenticated).toBe(true);
		});

		it("토큰이 만료되었으면 false를 반환해야 함", () => {
			// Given - MobX computed는 비-observable mock 변경을 감지하지 못하므로 새 인스턴스 생성
			const expiredApp = {
				space: { isAccessTokenExpired: true } as Space,
			} as unknown as AppStore;
			const expiredSession = new Session(expiredApp);

			// Then
			expect(expiredSession.isAuthenticated).toBe(false);
		});

	});

	describe("handleAuthError 메서드", () => {
		it("에러를 그대로 reject해야 함", async () => {
			// Given
			const mockError = new Error("인증 에러");

			// When & Then
			await expect(session.handleAuthError(mockError)).rejects.toBe(mockError);
		});
	});

	describe("logout 메서드", () => {
		it("로그아웃 API 호출 성공 시 로그인 페이지로 이동해야 함", async () => {
			// Given
			const mockLogoutApi = vi.fn().mockResolvedValue(undefined);

			// When
			await session.logout(mockLogoutApi);

			// Then
			expect(mockLogoutApi).toHaveBeenCalled();
			expect(navigateTo).toHaveBeenCalledWith("/admin/auth/login", true);
			expect(session.isLoggingOut).toBe(false);
		});

		it("로그아웃 API 호출 실패 시에도 로그인 페이지로 이동해야 함", async () => {
			// Given
			const mockLogoutApi = vi.fn().mockRejectedValue(new Error("API 에러"));

			// When
			await session.logout(mockLogoutApi);

			// Then
			expect(mockLogoutApi).toHaveBeenCalled();
			expect(navigateTo).toHaveBeenCalledWith("/admin/auth/login", true);
			expect(session.isLoggingOut).toBe(false);
		});

		it("로그아웃 API가 제공되지 않은 경우에도 로그인 페이지로 이동해야 함", async () => {
			// When
			await session.logout();

			// Then
			expect(navigateTo).toHaveBeenCalledWith("/admin/auth/login", true);
			expect(session.isLoggingOut).toBe(false);
		});

		it("로그아웃 처리 중 isLoggingOut 상태가 올바르게 관리되어야 함", async () => {
			// Given
			const mockLogoutApi = vi.fn().mockImplementation(() => {
				expect(session.isLoggingOut).toBe(true);
				return Promise.resolve();
			});

			expect(session.isLoggingOut).toBe(false);

			// When
			await session.logout(mockLogoutApi);

			// Then
			expect(session.isLoggingOut).toBe(false);
		});

		it("로그아웃 API 에러 발생 시에도 isLoggingOut 상태가 false로 되돌아가야 함", async () => {
			// Given
			const mockLogoutApi = vi.fn().mockRejectedValue(new Error("API 에러"));

			expect(session.isLoggingOut).toBe(false);

			// When
			await session.logout(mockLogoutApi);

			// Then
			expect(session.isLoggingOut).toBe(false);
		});
	});
});
