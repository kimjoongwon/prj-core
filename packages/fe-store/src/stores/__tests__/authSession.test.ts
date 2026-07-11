/// <reference types="vitest/globals" />

import { navigateTo } from "@cocrepo/toolkit";
import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";
import { AuthSession, type NativeAuthSession } from "../account/authSession";
import {
	browserPersistStorageAdapter,
	PersistStorage,
} from "../persistence/persistStorage";

const STORAGE_KEY = "session-test";
const NOW = new Date("2026-05-31T00:00:00.000Z").getTime();
const ACCESS_TOKEN_EXPIRES_AT = NOW + 60 * 60 * 1000;
const REFRESH_TOKEN_EXPIRES_AT = NOW + 24 * 60 * 60 * 1000;

const createNativeAuthSession = (
	overrides: Partial<NativeAuthSession> = {},
): NativeAuthSession => ({
	accessToken: "access-token",
	refreshToken: "refresh-token",
	sessionId: "native-session-id",
	accessTokenExpiresAt: ACCESS_TOKEN_EXPIRES_AT,
	refreshTokenExpiresAt: REFRESH_TOKEN_EXPIRES_AT,
	...overrides,
});

function createStorageMock() {
	const store = new Map<string, string>();

	return {
		getItem: vi.fn((key: string) => store.get(key) ?? null),
		setItem: vi.fn((key: string, value: string) => {
			store.set(key, value);
		}),
		removeItem: vi.fn((key: string) => {
			store.delete(key);
		}),
		clear: vi.fn(() => {
			store.clear();
		}),
		dump: () => new Map(store),
	};
}

vi.mock("@cocrepo/toolkit", () => ({
	navigateTo: vi.fn(),
	createLogger: vi.fn(() => ({
		info: vi.fn(),
		error: vi.fn(),
	})),
}));

describe("AuthSession", () => {
	let storage: ReturnType<typeof createStorageMock>;
	let session: AuthSession;

	beforeEach(() => {
		vi.useFakeTimers();
		vi.setSystemTime(NOW);
		storage = createStorageMock();
		Object.defineProperty(window, "localStorage", {
			value: storage,
			writable: true,
		});
		vi.clearAllMocks();
		session = new AuthSession(
			new PersistStorage(STORAGE_KEY, browserPersistStorageAdapter),
		);
	});

	afterEach(() => {
		vi.useRealTimers();
	});

	it("constructor에서는 storage를 읽지 않고 로그아웃/토큰 기본 상태를 유지한다", () => {
		expect(storage.getItem).not.toHaveBeenCalled();
		expect(session.isLoggingOut).toBe(false);
		expect(session.isHydrated).toBe(false);
		expect(session.accessToken).toBeNull();
		expect(session.refreshToken).toBeNull();
		expect(session.sessionId).toBeNull();
		expect(session.isAuthenticated).toBe(false);
	});

	it("저장된 native session을 hydrate한다", () => {
		storage.setItem(
			STORAGE_KEY,
			JSON.stringify({ authSession: createNativeAuthSession() }),
		);

		const store = new AuthSession(
			new PersistStorage(STORAGE_KEY, browserPersistStorageAdapter),
		);
		store.hydrateFromStorage();

		expect(store.accessToken).toBe("access-token");
		expect(store.refreshToken).toBe("refresh-token");
		expect(store.sessionId).toBe("native-session-id");
		expect(store.accessTokenExpiresAt).toBe(ACCESS_TOKEN_EXPIRES_AT);
		expect(store.refreshTokenExpiresAt).toBe(REFRESH_TOKEN_EXPIRES_AT);
		expect(store.isAuthenticated).toBe(true);
		expect(store.isHydrated).toBe(true);
	});

	it("native auth session 저장과 초기화를 수행한다", () => {
		session.setNativeAuthSession(createNativeAuthSession());

		expect(session.isAuthenticated).toBe(true);
		expect(
			JSON.parse(storage.dump().get(STORAGE_KEY) ?? "{}").authSession,
		).toMatchObject({
			accessToken: "access-token",
			refreshToken: "refresh-token",
			sessionId: "native-session-id",
		});

		session.clearNativeAuthSession();

		expect(session.accessToken).toBeNull();
		expect(session.refreshToken).toBeNull();
		expect(session.sessionId).toBeNull();
		expect(session.isAuthenticated).toBe(false);
	});

	it("token expiry computed 값을 계산한다", () => {
		session.setNativeAuthSession(
			createNativeAuthSession({
				accessTokenExpiresAt: NOW + 4 * 60 * 1000,
				refreshTokenExpiresAt: NOW + 60 * 60 * 1000,
			}),
		);

		expect(session.isAccessTokenExpired).toBe(false);
		expect(session.needsTokenRefresh).toBe(true);

		vi.setSystemTime(NOW + 4 * 60 * 1000 - 29_999);
		expect(session.isAccessTokenExpired).toBe(true);
	});

	it("refresh token이 만료됐거나 session 정보가 없으면 refresh 필요 없음으로 계산한다", () => {
		session.setNativeAuthSession(
			createNativeAuthSession({
				accessTokenExpiresAt: NOW + 4 * 60 * 1000,
				refreshTokenExpiresAt: NOW + 10_000,
			}),
		);

		expect(session.isRefreshTokenExpired).toBe(true);
		expect(session.needsTokenRefresh).toBe(false);

		session.clearNativeAuthSession();

		expect(session.needsTokenRefresh).toBe(false);
	});

	it("setTokenExpiries로 token 만료 시간을 갱신한다", () => {
		session.setTokenExpiries(NOW + 120_000, NOW + 240_000);

		expect(session.accessTokenExpiresAt).toBe(NOW + 120_000);
		expect(session.refreshTokenExpiresAt).toBe(NOW + 240_000);
	});

	it("clear는 native session과 저장값을 제거하고 hydrated 상태로 만든다", () => {
		session.setNativeAuthSession(createNativeAuthSession());

		session.clear();

		expect(session.accessToken).toBeNull();
		expect(session.refreshToken).toBeNull();
		expect(session.sessionId).toBeNull();
		expect(session.isHydrated).toBe(true);
		expect(storage.removeItem).toHaveBeenCalledWith(STORAGE_KEY);
		expect(storage.dump().has(STORAGE_KEY)).toBe(false);
	});

	it("handleAuthError는 에러를 그대로 reject한다", async () => {
		const error = new Error("인증 에러");

		await expect(session.handleAuthError(error)).rejects.toBe(error);
	});

	it("logout API 성공/실패와 관계없이 로그인 페이지로 이동하고 상태를 복구한다", async () => {
		const successLogoutApi = vi.fn().mockResolvedValue(undefined);
		const failedLogoutApi = vi.fn().mockRejectedValue(new Error("API 에러"));

		await session.logout(successLogoutApi);
		await session.logout(failedLogoutApi);

		expect(successLogoutApi).toHaveBeenCalled();
		expect(failedLogoutApi).toHaveBeenCalled();
		expect(navigateTo).toHaveBeenCalledWith("/admin/auth/login", true);
		expect(session.isLoggingOut).toBe(false);
	});
});
