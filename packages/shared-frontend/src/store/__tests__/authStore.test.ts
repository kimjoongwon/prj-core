/// <reference types="vitest/globals" />

import { AXIOS_INSTANCE } from "@shared/api-client";
import { navigateTo } from "@shared/utils";
import { isAxiosError } from "axios";
import { beforeEach, describe, expect, it, vi } from "vitest";
import { AuthStore } from "../authStore";
import { PlateStore } from "../plateStore";
import { TokenStore } from "../tokenStore";

// 의존성 모킹
vi.mock("@shared/utils", () => ({
	navigateTo: vi.fn(),
	createLogger: vi.fn(() => ({
		info: vi.fn(),
		error: vi.fn(),
	})),
}));
vi.mock("axios");
vi.mock("../plateStore");
vi.mock("../tokenStore");

// AXIOS_INSTANCE 모킹
vi.mock("@shared/api-client", () => ({
	AXIOS_INSTANCE: {
		interceptors: {
			response: {
				use: vi.fn(),
			},
			request: {
				use: vi.fn(),
			},
		},
	},
}));

describe("AuthStore", () => {
	let authStore: AuthStore;
	let mockPlateStore: PlateStore;
	let mockTokenStore: TokenStore;

	beforeEach(() => {
		// PlateStore와 TokenStore 모킹
		mockTokenStore = {
			isAccessTokenExpired: vi.fn().mockReturnValue(false),
			refreshToken: vi.fn().mockResolvedValue(undefined),
		} as any;

		mockPlateStore = {
			tokenStore: mockTokenStore,
		} as any;

		// Mock 리셋
		vi.clearAllMocks();

		// window.location 모킹
		Object.defineProperty(window, "location", {
			value: { href: "" },
			writable: true,
		});

		authStore = new AuthStore(mockPlateStore);
	});

	describe("생성자", () => {
		it("PlateStore 의존성이 올바르게 주입되어야 함", () => {
			expect(authStore.plateStore).toBeDefined();
			expect(authStore.plateStore.tokenStore).toBeDefined();
		});

		it("응답 인터셉터가 등록되어야 함", () => {
			expect(AXIOS_INSTANCE.interceptors.response.use).toHaveBeenCalledWith(
				expect.any(Function),
				expect.any(Function),
			);
		});

		it("요청 인터셉터가 등록되어야 함", () => {
			expect(AXIOS_INSTANCE.interceptors.request.use).toHaveBeenCalledWith(
				expect.any(Function),
				expect.any(Function),
			);
		});

		it("isLoggingOut 초기값이 false여야 함", () => {
			expect(authStore.isLoggingOut).toBe(false);
		});
	});

	describe("응답 인터셉터", () => {
		let responseInterceptor: any;
		let errorHandler: any;

		beforeEach(() => {
			const responseCall = (AXIOS_INSTANCE.interceptors.response.use as any)
				.mock.calls[0];
			responseInterceptor = responseCall[0];
			errorHandler = responseCall[1];
		});

		it("정상 응답은 그대로 반환되어야 함", () => {
			const mockResponse = { data: "test" };
			const result = responseInterceptor(mockResponse);
			expect(result).toBe(mockResponse);
		});

		it("에러 발생 시 handleAuthError가 호출되어야 함", () => {
			const mockError = new Error("Test error");
			const handleAuthErrorSpy = vi.spyOn(authStore, "handleAuthError");

			errorHandler(mockError);

			expect(handleAuthErrorSpy).toHaveBeenCalledWith(mockError);
		});
	});

	describe("요청 인터셉터", () => {
		let requestInterceptor: any;
		let requestErrorHandler: any;

		beforeEach(() => {
			const requestCall = (AXIOS_INSTANCE.interceptors.request.use as any).mock
				.calls[0];
			requestInterceptor = requestCall[0];
			requestErrorHandler = requestCall[1];
		});

		it("액세스 토큰이 만료된 경우 토큰 갱신을 호출해야 함", async () => {
			const mockConfig = { url: "/test" };
			(mockTokenStore.isAccessTokenExpired as any).mockReturnValue(true);
			(mockTokenStore.refreshToken as any).mockResolvedValue(undefined);

			const result = await requestInterceptor(mockConfig);

			expect(mockTokenStore.isAccessTokenExpired).toHaveBeenCalled();
			expect(mockTokenStore.refreshToken).toHaveBeenCalled();
			expect(result).toBe(mockConfig);
		});

		it("액세스 토큰이 유효한 경우 토큰 갱신을 호출하지 않아야 함", async () => {
			const mockConfig = { url: "/test" };
			(mockTokenStore.isAccessTokenExpired as any).mockReturnValue(false);

			const result = await requestInterceptor(mockConfig);

			expect(mockTokenStore.isAccessTokenExpired).toHaveBeenCalled();
			expect(mockTokenStore.refreshToken).not.toHaveBeenCalled();
			expect(result).toBe(mockConfig);
		});

		it("요청 에러가 발생하면 Promise.reject을 반환해야 함", async () => {
			const mockError = new Error("Request error");
			const result = requestErrorHandler(mockError);

			await expect(result).rejects.toBe(mockError);
		});
	});

	describe("handleAuthError 메서드", () => {
		it("401 에러 시 로그인 페이지로 리다이렉트해야 함", async () => {
			const mockError = {
				response: { status: 401 },
			};
			(isAxiosError as any).mockReturnValue(true);

			await authStore.handleAuthError(mockError);

			expect(window.location.href).toBe("/admin/auth/login");
		});

		it("401이 아닌 Axios 에러는 그대로 reject해야 함", async () => {
			const mockError = {
				response: { status: 500 },
			};
			(isAxiosError as any).mockReturnValue(true);

			await expect(authStore.handleAuthError(mockError)).rejects.toBe(
				mockError,
			);
		});

		it("Axios 에러가 아닌 경우 그대로 reject해야 함", async () => {
			const mockError = new Error("일반 에러");
			(isAxiosError as any).mockReturnValue(false);

			await expect(authStore.handleAuthError(mockError)).rejects.toBe(
				mockError,
			);
		});
	});

	describe("logout 메서드", () => {
		it("로그아웃 API 호출 성공 시 스토리지를 클리어하고 로그인 페이지로 이동해야 함", async () => {
			const mockLogoutApi = vi.fn().mockResolvedValue(undefined);

			await authStore.logout(mockLogoutApi);

			expect(mockLogoutApi).toHaveBeenCalled();
			expect(navigateTo).toHaveBeenCalledWith("/admin/auth/login", true);
			expect(authStore.isLoggingOut).toBe(false);
		});

		it("로그아웃 API 호출 실패 시에도 스토리지를 클리어하고 로그인 페이지로 이동해야 함", async () => {
			const mockLogoutApi = vi.fn().mockRejectedValue(new Error("API 에러"));

			await authStore.logout(mockLogoutApi);

			expect(mockLogoutApi).toHaveBeenCalled();
			expect(navigateTo).toHaveBeenCalledWith("/admin/auth/login", true);
			expect(authStore.isLoggingOut).toBe(false);
		});

		it("로그아웃 API가 제공되지 않은 경우에도 스토리지를 클리어하고 로그인 페이지로 이동해야 함", async () => {
			await authStore.logout();

			expect(navigateTo).toHaveBeenCalledWith("/admin/auth/login", true);
			expect(authStore.isLoggingOut).toBe(false);
		});

		it("로그아웃 처리 중 isLoggingOut 상태가 올바르게 관리되어야 함", async () => {
			const mockLogoutApi = vi.fn().mockImplementation(() => {
				expect(authStore.isLoggingOut).toBe(true);
				return Promise.resolve();
			});

			expect(authStore.isLoggingOut).toBe(false);

			await authStore.logout(mockLogoutApi);

			expect(authStore.isLoggingOut).toBe(false);
		});

		it("로그아웃 API 에러 발생 시에도 isLoggingOut 상태가 false로 되돌아가야 함", async () => {
			const mockLogoutApi = vi.fn().mockRejectedValue(new Error("API 에러"));

			expect(authStore.isLoggingOut).toBe(false);

			await authStore.logout(mockLogoutApi);

			expect(authStore.isLoggingOut).toBe(false);
		});
	});

	describe("토큰스토어가 없는 경우", () => {
		beforeEach(() => {
			mockPlateStore.tokenStore = undefined;
			authStore = new AuthStore(mockPlateStore);
		});

		it("토큰스토어가 없어도 요청 인터셉터가 정상 작동해야 함", async () => {
			const requestCall = (AXIOS_INSTANCE.interceptors.request.use as any).mock
				.calls[0];
			const requestInterceptor = requestCall[0];
			const mockConfig = { url: "/test" };

			const result = await requestInterceptor(mockConfig);

			expect(result).toBe(mockConfig);
		});
	});
});
