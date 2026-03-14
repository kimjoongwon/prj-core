/// <reference types="vitest/globals" />

import { beforeEach, describe, expect, it, vi } from "vitest";
import { PersistStore, type SpaceInfo } from "../persistStore";

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
		vi.clearAllMocks();

		// localStorage 모킹 설정
		Object.defineProperty(window, "localStorage", {
			value: mockLocalStorage,
			writable: true,
		});

		mockLocalStorage.getItem.mockReturnValue(null);

		persistStore = new PersistStore({ storageKey: STORAGE_KEY });
	});

	describe("초기화", () => {
		it("초기 상태가 null이어야 한다", () => {
			expect(persistStore.spaceId).toBeNull();
			expect(persistStore.groundName).toBeNull();
			expect(persistStore.spaces).toEqual([]);
			expect(persistStore.accessTokenExpiresAt).toBeNull();
			expect(persistStore.refreshTokenExpiresAt).toBeNull();
			expect(persistStore.isHydrated).toBe(false);
		});

		it("localStorage에서 저장된 데이터를 hydrateFromStorage로 복원해야 한다", () => {
			// Given
			const storedData = {
				spaceId: "space-123",
				groundName: "Test Ground",
				spaces: [{ spaceId: "space-123", groundName: "Test Ground" }],
				accessTokenExpiresAt: Date.now() + 3600000,
				refreshTokenExpiresAt: Date.now() + 86400000,
			};
			mockLocalStorage.getItem.mockReturnValue(JSON.stringify(storedData));

			// When
			const store = new PersistStore({ storageKey: STORAGE_KEY });
			store.hydrateFromStorage();

			// Then
			expect(store.spaceId).toBe("space-123");
			expect(store.groundName).toBe("Test Ground");
			expect(store.spaces).toHaveLength(1);
			expect(store.isHydrated).toBe(true);
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
			persistStore.setSpace("space-456", "New Ground");

			// Then
			expect(persistStore.spaceId).toBe("space-456");
			expect(persistStore.groundName).toBe("New Ground");
		});
	});

	describe("clearSpace", () => {
		it("Space 정보를 초기화해야 한다", () => {
			// Given
			persistStore.setSpace("space-123", "Test");

			// When
			persistStore.clearSpace();

			// Then
			expect(persistStore.spaceId).toBeNull();
			expect(persistStore.groundName).toBeNull();
		});
	});

	describe("setSpaces", () => {
		it("Space 목록을 설정해야 한다", () => {
			// Given
			const spaces: SpaceInfo[] = [
				{ spaceId: "space-1", groundName: "Ground 1" },
				{ spaceId: "space-2", groundName: "Ground 2" },
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
			const accessExpires = Date.now() + 3600000;
			const refreshExpires = Date.now() + 86400000;

			// When
			persistStore.setTokenExpiries(accessExpires, refreshExpires);

			// Then
			expect(persistStore.accessTokenExpiresAt).toBe(accessExpires);
			expect(persistStore.refreshTokenExpiresAt).toBe(refreshExpires);
		});
	});

	describe("isAccessTokenExpired", () => {
		it("만료 시간이 없으면 true를 반환해야 한다", () => {
			expect(persistStore.isAccessTokenExpired).toBe(true);
		});

		it("만료되었으면 true를 반환해야 한다", () => {
			// Given - 이미 만료된 시간
			persistStore.setTokenExpiries(Date.now() - 60000, Date.now() + 86400000);

			// Then
			expect(persistStore.isAccessTokenExpired).toBe(true);
		});

		it("유효하면 false를 반환해야 한다", () => {
			// Given - 1시간 후 만료
			persistStore.setTokenExpiries(
				Date.now() + 3600000,
				Date.now() + 86400000,
			);

			// Then
			expect(persistStore.isAccessTokenExpired).toBe(false);
		});

		it("버퍼 시간(30초) 이내면 만료로 간주해야 한다", () => {
			// Given - 20초 후 만료 (버퍼 30초보다 작음)
			persistStore.setTokenExpiries(Date.now() + 20000, Date.now() + 86400000);

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
				Date.now() + 3600000,
				Date.now() + 86400000,
			);

			// Then
			expect(persistStore.isRefreshTokenExpired).toBe(false);
		});
	});

	describe("isAuthenticated", () => {
		it("Access Token이 유효하면 true를 반환해야 한다", () => {
			// Given
			persistStore.setTokenExpiries(
				Date.now() + 3600000,
				Date.now() + 86400000,
			);

			// Then
			expect(persistStore.isAuthenticated).toBe(true);
		});

		it("Access Token이 만료되었으면 false를 반환해야 한다", () => {
			// Given
			persistStore.setTokenExpiries(Date.now() - 60000, Date.now() + 86400000);

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
			persistStore.setTokenExpiries(Date.now() + 180000, Date.now() + 86400000);

			// Then
			expect(persistStore.needsTokenRefresh).toBe(true);
		});

		it("만료까지 5분 이상 남았으면 false를 반환해야 한다", () => {
			// Given - 10분 후 만료
			persistStore.setTokenExpiries(Date.now() + 600000, Date.now() + 86400000);

			// Then
			expect(persistStore.needsTokenRefresh).toBe(false);
		});

		it("이미 만료되었으면 false를 반환해야 한다", () => {
			// Given
			persistStore.setTokenExpiries(Date.now() - 60000, Date.now() + 86400000);

			// Then
			expect(persistStore.needsTokenRefresh).toBe(false);
		});
	});

	describe("clear", () => {
		it("모든 상태를 초기화해야 한다", () => {
			// Given
			persistStore.setSpace("space-123", "Test");
			persistStore.setSpaces([{ spaceId: "space-1", groundName: "G1" }]);
			persistStore.setTokenExpiries(
				Date.now() + 3600000,
				Date.now() + 86400000,
			);

			// When
			persistStore.clear();

			// Then
			expect(persistStore.spaceId).toBeNull();
			expect(persistStore.groundName).toBeNull();
			expect(persistStore.spaces).toEqual([]);
			expect(persistStore.accessTokenExpiresAt).toBeNull();
			expect(persistStore.refreshTokenExpiresAt).toBeNull();
		});

		it("localStorage에서 데이터를 삭제해야 한다", () => {
			// When
			persistStore.clear();

			// Then
			expect(mockLocalStorage.removeItem).toHaveBeenCalledWith(STORAGE_KEY);
		});
	});
});
