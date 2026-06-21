/// <reference types="vitest/globals" />

import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";
import {
	type NativeAuthSession,
	PersistStore,
	type SpaceInfo,
} from "../persistStore";

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

describe("PersistStore", () => {
	let persistStore: PersistStore;
	const STORAGE_KEY = "test-persist-store";

	// localStorage 모킹
	const mockLocalStorage = {
		getItem: vi.fn(),
		setItem: vi.fn(),
		removeItem: vi.fn(),
		clear: vi.fn(),
	};

	beforeEach(() => {
		vi.useFakeTimers();
		vi.setSystemTime(NOW);
		vi.clearAllMocks();

		// localStorage 모킹 설정
		Object.defineProperty(window, "localStorage", {
			value: mockLocalStorage,
			writable: true,
		});

		mockLocalStorage.getItem.mockReturnValue(null);

		persistStore = new PersistStore({ storageKey: STORAGE_KEY });
	});

	afterEach(() => {
		vi.useRealTimers();
	});

	describe("초기화", () => {
		it("초기 상태가 null이어야 한다", () => {
			expect(persistStore.spaceId).toBeNull();
			expect(persistStore.groundName).toBeNull();
			expect(persistStore.spaces).toEqual([]);
			expect(persistStore.accessToken).toBeNull();
			expect(persistStore.refreshToken).toBeNull();
			expect(persistStore.sessionId).toBeNull();
			expect(persistStore.accessTokenExpiresAt).toBeNull();
			expect(persistStore.refreshTokenExpiresAt).toBeNull();
			expect(persistStore.isHydrated).toBe(false);
		});

		it("localStorage에서 저장된 데이터를 hydrateFromStorage로 복원해야 한다", () => {
			// Given
			const storedData = {
				tenantId: "tenant-123",
				spaceId: "space-123",
				groundName: "Test Ground",
				spaces: [
					{
						tenantId: "tenant-123",
						spaceId: "space-123",
						groundName: "Test Ground",
					},
				],
				...createNativeAuthSession(),
			};
			mockLocalStorage.getItem.mockReturnValue(JSON.stringify(storedData));

			// When
			const store = new PersistStore({ storageKey: STORAGE_KEY });
			store.hydrateFromStorage();

			// Then
			expect(store.tenantId).toBe("tenant-123");
			expect(store.spaceId).toBe("space-123");
			expect(store.groundName).toBe("Test Ground");
			expect(store.spaces).toHaveLength(1);
			expect(store.accessToken).toBe("access-token");
			expect(store.refreshToken).toBe("refresh-token");
			expect(store.sessionId).toBe("native-session-id");
			expect(store.accessTokenExpiresAt).toBe(ACCESS_TOKEN_EXPIRES_AT);
			expect(store.refreshTokenExpiresAt).toBe(REFRESH_TOKEN_EXPIRES_AT);
			expect(store.isAuthenticated).toBe(true);
			expect(store.isHydrated).toBe(true);
		});

		it("legacy 저장 데이터에 native session 필드가 없으면 null로 복원해야 한다", () => {
			// Given
			const storedData = {
				tenantId: "tenant-123",
				spaceId: "space-123",
				groundName: "Test Ground",
				spaces: [
					{
						tenantId: "tenant-123",
						spaceId: "space-123",
						groundName: "Test Ground",
					},
				],
			};
			mockLocalStorage.getItem.mockReturnValue(JSON.stringify(storedData));

			// When
			const store = new PersistStore({ storageKey: STORAGE_KEY });
			store.hydrateFromStorage();

			// Then
			expect(store.accessToken).toBeNull();
			expect(store.refreshToken).toBeNull();
			expect(store.sessionId).toBeNull();
			expect(store.accessTokenExpiresAt).toBeNull();
			expect(store.refreshTokenExpiresAt).toBeNull();
			expect(store.isAuthenticated).toBe(false);
			expect(store.needsTokenRefresh).toBe(false);
		});

		it("constructor에서는 localStorage를 읽지 않아야 한다", () => {
			// When
			const store = new PersistStore({ storageKey: STORAGE_KEY });

			// Then
			expect(mockLocalStorage.getItem).not.toHaveBeenCalled();
			expect(store.isHydrated).toBe(false);
		});

		it("잘못된 JSON 형식이면 무시하고 hydrate 완료 상태가 되어야 한다", () => {
			// Given
			mockLocalStorage.getItem.mockReturnValue("invalid-json");

			// When
			const store = new PersistStore({ storageKey: STORAGE_KEY });
			store.hydrateFromStorage();

			// Then - 에러 없이 기본값 유지
			expect(store.spaceId).toBeNull();
			expect(store.isHydrated).toBe(true);
		});

		it("hydrateFromStorage는 한 번만 실행해야 한다", () => {
			// Given
			mockLocalStorage.getItem.mockReturnValue(null);

			// When
			const store = new PersistStore({ storageKey: STORAGE_KEY });
			store.hydrateFromStorage();
			store.hydrateFromStorage();

			// Then
			expect(mockLocalStorage.getItem).toHaveBeenCalledTimes(1);
		});
	});

	describe("setSpace", () => {
		it("Space 정보를 설정해야 한다", () => {
			// When
			persistStore.setSpace("tenant-456", "New Ground", null, "space-456");

			// Then
			expect(persistStore.tenantId).toBe("tenant-456");
			expect(persistStore.spaceId).toBe("space-456");
			expect(persistStore.groundName).toBe("New Ground");
		});

		it("Space 정보를 localStorage 자동 저장 대상에 포함해야 한다", async () => {
			// When
			persistStore.setSpace("tenant-456", "New Ground", null, "space-456");
			await Promise.resolve();

			// Then
			expect(mockLocalStorage.setItem).toHaveBeenCalled();
			const latestCall =
				mockLocalStorage.setItem.mock.calls[
					mockLocalStorage.setItem.mock.calls.length - 1
				];
			expect(latestCall?.[0]).toBe(STORAGE_KEY);
			expect(JSON.parse(latestCall?.[1] as string)).toMatchObject({
				tenantId: "tenant-456",
				spaceId: "space-456",
				groundName: "New Ground",
			});
		});
	});

	describe("clearSpace", () => {
		it("Space 정보를 초기화해야 한다", () => {
			// Given
			persistStore.setSpace("tenant-123", "Test", null, "space-123");

			// When
			persistStore.clearSpace();

			// Then
			expect(persistStore.tenantId).toBeNull();
			expect(persistStore.spaceId).toBeNull();
			expect(persistStore.groundName).toBeNull();
		});
	});

	describe("setSpaces", () => {
		it("Space 목록을 설정해야 한다", () => {
			// Given
			const spaces: SpaceInfo[] = [
				{ tenantId: "tenant-1", spaceId: "space-1", groundName: "Ground 1" },
				{ tenantId: "tenant-2", spaceId: "space-2", groundName: "Ground 2" },
			];

			// When
			persistStore.setSpaces(spaces);

			// Then
			expect(persistStore.spaces).toHaveLength(2);
			expect(persistStore.spaces[0].groundName).toBe("Ground 1");
		});
	});

	describe("setTokenExpiries", () => {
		it("토큰 만료 시간을 설정해야 한다", () => {
			// Given
			const accessExpires = ACCESS_TOKEN_EXPIRES_AT;
			const refreshExpires = REFRESH_TOKEN_EXPIRES_AT;

			// When
			persistStore.setTokenExpiries(accessExpires, refreshExpires);

			// Then
			expect(persistStore.accessTokenExpiresAt).toBe(accessExpires);
			expect(persistStore.refreshTokenExpiresAt).toBe(refreshExpires);
		});
	});

	describe("setNativeAuthSession", () => {
		it("native auth 세션 정보를 설정해야 한다", () => {
			// Given
			const session = createNativeAuthSession();

			// When
			persistStore.setNativeAuthSession(session);

			// Then
			expect(persistStore.accessToken).toBe("access-token");
			expect(persistStore.refreshToken).toBe("refresh-token");
			expect(persistStore.sessionId).toBe("native-session-id");
			expect(persistStore.accessTokenExpiresAt).toBe(ACCESS_TOKEN_EXPIRES_AT);
			expect(persistStore.refreshTokenExpiresAt).toBe(REFRESH_TOKEN_EXPIRES_AT);
			expect(persistStore.isAuthenticated).toBe(true);
		});

		it("native auth 세션 정보를 localStorage 자동 저장 대상에 포함해야 한다", async () => {
			// When
			persistStore.setNativeAuthSession(createNativeAuthSession());
			await Promise.resolve();

			// Then
			expect(mockLocalStorage.setItem).toHaveBeenCalled();
			const latestCall =
				mockLocalStorage.setItem.mock.calls[
					mockLocalStorage.setItem.mock.calls.length - 1
				];
			expect(latestCall?.[0]).toBe(STORAGE_KEY);
			expect(JSON.parse(latestCall?.[1] as string)).toMatchObject({
				accessToken: "access-token",
				refreshToken: "refresh-token",
				sessionId: "native-session-id",
				accessTokenExpiresAt: ACCESS_TOKEN_EXPIRES_AT,
				refreshTokenExpiresAt: REFRESH_TOKEN_EXPIRES_AT,
			});
		});
	});

	describe("clearNativeAuthSession", () => {
		it("native auth 세션 정보만 초기화해야 한다", () => {
			// Given
			persistStore.setSpace("tenant-123", "Test Ground", null, "space-123");
			persistStore.setSpaces([
				{
					tenantId: "tenant-123",
					spaceId: "space-123",
					groundName: "Test Ground",
				},
			]);
			persistStore.setSpaceSelectionResolved(false);
			persistStore.setNativeAuthSession(createNativeAuthSession());

			// When
			persistStore.clearNativeAuthSession();

			// Then
			expect(persistStore.accessToken).toBeNull();
			expect(persistStore.refreshToken).toBeNull();
			expect(persistStore.sessionId).toBeNull();
			expect(persistStore.accessTokenExpiresAt).toBeNull();
			expect(persistStore.refreshTokenExpiresAt).toBeNull();
			expect(persistStore.isAuthenticated).toBe(false);
			expect(persistStore.needsTokenRefresh).toBe(false);
			expect(persistStore.tenantId).toBe("tenant-123");
			expect(persistStore.spaceId).toBe("space-123");
			expect(persistStore.groundName).toBe("Test Ground");
			expect(persistStore.spaces).toHaveLength(1);
			expect(persistStore.isSpaceSelectionResolved).toBe(false);
		});
	});

	describe("isAccessTokenExpired", () => {
		it("만료 시간이 없으면 true를 반환해야 한다", () => {
			expect(persistStore.isAccessTokenExpired).toBe(true);
		});

		it("만료되었으면 true를 반환해야 한다", () => {
			// Given - 이미 만료된 시간
			persistStore.setTokenExpiries(NOW - 60000, REFRESH_TOKEN_EXPIRES_AT);

			// Then
			expect(persistStore.isAccessTokenExpired).toBe(true);
		});

		it("유효하면 false를 반환해야 한다", () => {
			// Given - 1시간 후 만료
			persistStore.setTokenExpiries(
				ACCESS_TOKEN_EXPIRES_AT,
				REFRESH_TOKEN_EXPIRES_AT,
			);

			// Then
			expect(persistStore.isAccessTokenExpired).toBe(false);
		});

		it("버퍼 시간(30초) 이내면 만료로 간주해야 한다", () => {
			// Given - 20초 후 만료 (버퍼 30초보다 작음)
			persistStore.setTokenExpiries(NOW + 20000, REFRESH_TOKEN_EXPIRES_AT);

			// Then
			expect(persistStore.isAccessTokenExpired).toBe(true);
		});
	});

	describe("isRefreshTokenExpired", () => {
		it("만료 시간이 없으면 true를 반환해야 한다", () => {
			expect(persistStore.isRefreshTokenExpired).toBe(true);
		});

		it("유효하면 false를 반환해야 한다", () => {
			// Given
			persistStore.setTokenExpiries(
				ACCESS_TOKEN_EXPIRES_AT,
				REFRESH_TOKEN_EXPIRES_AT,
			);

			// Then
			expect(persistStore.isRefreshTokenExpired).toBe(false);
		});
	});

	describe("isAuthenticated", () => {
		it("완전한 native session의 Access Token이 유효하면 true를 반환해야 한다", () => {
			// Given
			persistStore.setNativeAuthSession(createNativeAuthSession());

			// Then
			expect(persistStore.isAuthenticated).toBe(true);
		});

		it("토큰 만료 시간만 있고 native session 값이 없으면 false를 반환해야 한다", () => {
			// Given
			persistStore.setTokenExpiries(
				ACCESS_TOKEN_EXPIRES_AT,
				REFRESH_TOKEN_EXPIRES_AT,
			);

			// Then
			expect(persistStore.isAuthenticated).toBe(false);
		});

		it("native session 필수 값이 비어 있으면 false를 반환해야 한다", () => {
			// Given
			persistStore.setNativeAuthSession(
				createNativeAuthSession({
					sessionId: "",
				}),
			);

			// Then
			expect(persistStore.isAuthenticated).toBe(false);
		});

		it("Access Token이 만료되었으면 false를 반환해야 한다", () => {
			// Given
			persistStore.setNativeAuthSession(
				createNativeAuthSession({
					accessTokenExpiresAt: NOW - 60000,
				}),
			);

			// Then
			expect(persistStore.isAuthenticated).toBe(false);
		});
	});

	describe("needsTokenRefresh", () => {
		it("만료 시간이 없으면 false를 반환해야 한다", () => {
			expect(persistStore.needsTokenRefresh).toBe(false);
		});

		it("만료 5분 전이면 true를 반환해야 한다", () => {
			// Given - 3분 후 만료
			persistStore.setNativeAuthSession(
				createNativeAuthSession({
					accessTokenExpiresAt: NOW + 180000,
				}),
			);

			// Then
			expect(persistStore.needsTokenRefresh).toBe(true);
		});

		it("만료까지 5분 이상 남았으면 false를 반환해야 한다", () => {
			// Given - 10분 후 만료
			persistStore.setNativeAuthSession(
				createNativeAuthSession({
					accessTokenExpiresAt: NOW + 600000,
				}),
			);

			// Then
			expect(persistStore.needsTokenRefresh).toBe(false);
		});

		it("이미 만료되었으면 false를 반환해야 한다", () => {
			// Given
			persistStore.setNativeAuthSession(
				createNativeAuthSession({
					accessTokenExpiresAt: NOW - 60000,
				}),
			);

			// Then
			expect(persistStore.needsTokenRefresh).toBe(false);
		});

		it("토큰 만료 시간만 있고 native session 값이 없으면 false를 반환해야 한다", () => {
			// Given
			persistStore.setTokenExpiries(NOW + 180000, REFRESH_TOKEN_EXPIRES_AT);

			// Then
			expect(persistStore.needsTokenRefresh).toBe(false);
		});

		it("Refresh Token이 만료되었으면 false를 반환해야 한다", () => {
			// Given
			persistStore.setNativeAuthSession(
				createNativeAuthSession({
					accessTokenExpiresAt: NOW + 180000,
					refreshTokenExpiresAt: NOW - 60000,
				}),
			);

			// Then
			expect(persistStore.needsTokenRefresh).toBe(false);
		});
	});

	describe("clear", () => {
		it("모든 상태를 초기화해야 한다", () => {
			// Given
			persistStore.setSpace("tenant-123", "Test", null, "space-123");
			persistStore.setSpaces([
				{ tenantId: "tenant-1", spaceId: "space-1", groundName: "G1" },
			]);
			persistStore.setSpaceSelectionResolved(false);
			persistStore.setNativeAuthSession(createNativeAuthSession());

			// When
			persistStore.clear();

			// Then
			expect(persistStore.tenantId).toBeNull();
			expect(persistStore.spaceId).toBeNull();
			expect(persistStore.groundName).toBeNull();
			expect(persistStore.spaces).toEqual([]);
			expect(persistStore.accessToken).toBeNull();
			expect(persistStore.refreshToken).toBeNull();
			expect(persistStore.sessionId).toBeNull();
			expect(persistStore.accessTokenExpiresAt).toBeNull();
			expect(persistStore.refreshTokenExpiresAt).toBeNull();
			expect(persistStore.isHydrated).toBe(true);
			expect(persistStore.isSpaceSelectionResolved).toBe(true);
		});

		it("localStorage에서 데이터를 삭제해야 한다", () => {
			// When
			persistStore.clear();

			// Then
			expect(mockLocalStorage.removeItem).toHaveBeenCalledWith(STORAGE_KEY);
		});
	});
});
