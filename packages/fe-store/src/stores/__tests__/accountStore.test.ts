/// <reference types="vitest/globals" />

import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";
import { type AccountSpaceInfo, AccountStore } from "../account/accountStore";
import { AuthSession } from "../account/authSession";
import {
	browserPersistStorageAdapter,
	PersistStorage,
} from "../persistence/persistStorage";

const STORAGE_KEY = "tenant-test";
const NOW = new Date("2026-05-31T00:00:00.000Z").getTime();

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

function createAccountStore(): AccountStore {
	const persistStorage = new PersistStorage(
		STORAGE_KEY,
		browserPersistStorageAdapter,
	);
	const authSession = new AuthSession(persistStorage);

	return new AccountStore({
		authSession,
		persistStorage,
	});
}

describe("AccountStore", () => {
	let storage: ReturnType<typeof createStorageMock>;
	let account: AccountStore;

	beforeEach(() => {
		vi.useFakeTimers();
		vi.setSystemTime(NOW);
		storage = createStorageMock();
		Object.defineProperty(window, "localStorage", {
			value: storage,
			writable: true,
		});
		account = createAccountStore();
	});

	afterEach(() => {
		vi.useRealTimers();
	});

	it("RootStore가 조립한 AuthSession 참조를 그대로 소유한다", () => {
		const persistStorage = new PersistStorage(
			STORAGE_KEY,
			browserPersistStorageAdapter,
		);
		const authSession = new AuthSession(persistStorage);
		const store = new AccountStore({
			authSession,
			persistStorage,
		});

		expect(store.authSession).toBe(authSession);
	});

	it("constructor에서는 storage를 읽지 않고 기본 account 상태를 유지한다", () => {
		expect(storage.getItem).not.toHaveBeenCalled();
		expect(account.currentTenantId).toBeNull();
		expect(account.selectedTenantId).toBeNull();
		expect(account.currentSpaceId).toBeNull();
		expect(account.currentGroundName).toBeNull();
		expect(account.contentLanguageCode).toBeNull();
		expect(account.availableSpaces).toEqual([]);
		expect(account.authSession.accessToken).toBeNull();
		expect(account.isHydrated).toBe(false);
		expect(account.isSelectionResolved).toBe(false);
	});

	it("저장된 tenant scope와 선택 가능한 Space 목록을 hydrate한다", () => {
		const availableSpaces: AccountSpaceInfo[] = [
			{
				tenantId: "tenant-a",
				spaceId: "space-a",
				groundName: "Ground A",
				contentLanguageCode: "ko_KR",
			},
		];
		storage.setItem(
			STORAGE_KEY,
			JSON.stringify({
				account: {
					tenantId: "tenant-a",
					spaceId: "space-a",
					groundName: "Ground A",
					contentLanguageCode: "ko_KR",
					availableSpaces,
				},
			}),
		);

		const store = createAccountStore();
		store.hydrateFromStorage();

		expect(store.currentTenantId).toBe("tenant-a");
		expect(store.selectedTenantId).toBe("tenant-a");
		expect(store.currentSpaceId).toBe("space-a");
		expect(store.currentGroundName).toBe("Ground A");
		expect(store.contentLanguageCode).toBe("ko_KR");
		expect(store.availableSpaces).toEqual(availableSpaces);
		expect(store.isHydrated).toBe(true);
	});

	it("draft 선택은 current tenant를 유지하고 selectedTenantId만 바꾼다", () => {
		account.setCurrentTenant("tenant-a", "Ground A", "ko_KR", "space-a");

		account.selectTenant("tenant-b");

		expect(account.currentTenantId).toBe("tenant-a");
		expect(account.selectedTenantId).toBe("tenant-b");
		expect(account.currentSpaceId).toBe("space-a");
		expect(account.currentGroundName).toBe("Ground A");
	});

	it("current tenant를 확정하면 draft 선택도 같은 tenant로 동기화한다", () => {
		account.setAvailableSpaces([
			{
				tenantId: "tenant-b",
				spaceId: "space-b",
				groundName: "Ground B",
				contentLanguageCode: "ja_JP",
			},
		]);

		account.setCurrentTenant("tenant-b", "Ground B");

		expect(account.currentTenantId).toBe("tenant-b");
		expect(account.selectedTenantId).toBe("tenant-b");
		expect(account.currentSpaceId).toBe("space-b");
		expect(account.contentLanguageCode).toBe("ja_JP");
	});

	it("selection resolved 상태와 clear 결과를 관리한다", () => {
		account.setAvailableSpaces([
			{ tenantId: "tenant-a", spaceId: "space-a", groundName: "Ground A" },
		]);
		account.setCurrentTenant("tenant-a", "Ground A", null, "space-a");
		account.authSession.setNativeAuthSession({
			accessToken: "access-token",
			refreshToken: "refresh-token",
			sessionId: "session-id",
			accessTokenExpiresAt: Date.now() + 60_000,
			refreshTokenExpiresAt: Date.now() + 120_000,
		});
		account.setSelectionResolved(true);

		account.clear();

		expect(account.currentTenantId).toBeNull();
		expect(account.selectedTenantId).toBeNull();
		expect(account.currentSpaceId).toBeNull();
		expect(account.currentGroundName).toBeNull();
		expect(account.availableSpaces).toEqual([]);
		expect(account.authSession.accessToken).toBeNull();
		expect(account.isHydrated).toBe(true);
		expect(account.isSelectionResolved).toBe(true);
		expect(storage.removeItem).toHaveBeenCalledWith(STORAGE_KEY);
		expect(storage.dump().has(STORAGE_KEY)).toBe(false);
	});

	it("tenant 변경 내용을 storage에 저장한다", () => {
		account.setAvailableSpaces([
			{ tenantId: "tenant-a", spaceId: "space-a", groundName: "Ground A" },
		]);
		account.setCurrentTenant("tenant-a", "Ground A", null, "space-a");

		const persisted = JSON.parse(
			storage.dump().get(STORAGE_KEY) ?? "{}",
		).account;

		expect(persisted).toMatchObject({
			tenantId: "tenant-a",
			spaceId: "space-a",
			groundName: "Ground A",
			availableSpaces: [
				{
					tenantId: "tenant-a",
					spaceId: "space-a",
					groundName: "Ground A",
				},
			],
		});
	});
});
