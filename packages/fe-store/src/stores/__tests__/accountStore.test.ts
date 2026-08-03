/// <reference types="vitest/globals" />

import type { DecimalId } from "@cocrepo/type";
import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";
import { type AccountSpaceInfo, AccountStore } from "../account/accountStore";
import { AuthSession } from "../account/authSession";
import {
	browserPersistStorageAdapter,
	PersistStorage,
} from "../persistence/persistStorage";

const STORAGE_KEY = "tenant-test";
const NOW = new Date("2026-05-31T00:00:00.000Z").getTime();
const TENANT_A = "101" as DecimalId;
const TENANT_B = "102" as DecimalId;
const SPACE_A = "201" as DecimalId;
const SPACE_B = "202" as DecimalId;

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

	it("Given RootStore가 조립한 AuthSession 참조가 있을 때 When AccountStore를 만들면 Then 같은 참조를 그대로 소유한다", () => {
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

	it("Given 비어 있는 storage가 있을 때 When constructor만 호출하면 Then storage를 읽지 않고 기본 account 상태를 유지한다", () => {
		expect(storage.getItem).not.toHaveBeenCalled();
		expect(account.currentTenantId).toBeNull();
		expect(account.selectedTenantId).toBeNull();
		expect(account.currentSpaceId).toBeNull();
		expect(account.currentFitnessCenterName).toBeNull();
		expect(account.contentLanguageCode).toBeNull();
		expect(account.availableSpaces).toEqual([]);
		expect(account.authSession.accessToken).toBeNull();
		expect(account.isHydrated).toBe(false);
		expect(account.isSelectionResolved).toBe(false);
	});

	it("Given version 2 account 선택이 저장돼 있을 때 When hydrateFromStorage를 호출하면 Then FitnessCenter 선택과 Space 목록을 복원한다", () => {
		const availableSpaces: AccountSpaceInfo[] = [
			{
				tenantId: TENANT_A,
				spaceId: SPACE_A,
				fitnessCenterName: "Fitness Center A",
				contentLanguageCode: "ko_KR",
			},
		];
		storage.setItem(
			STORAGE_KEY,
			JSON.stringify({
				account: {
					version: 2,
					tenantId: TENANT_A,
					spaceId: SPACE_A,
					fitnessCenterName: "Fitness Center A",
					contentLanguageCode: "ko_KR",
					availableSpaces,
				},
			}),
		);

		const store = createAccountStore();
		store.hydrateFromStorage();

		expect(store.currentTenantId).toBe(TENANT_A);
		expect(store.selectedTenantId).toBe(TENANT_A);
		expect(store.currentSpaceId).toBe(SPACE_A);
		expect(store.currentFitnessCenterName).toBe("Fitness Center A");
		expect(store.contentLanguageCode).toBe("ko_KR");
		expect(store.availableSpaces).toEqual(availableSpaces);
		expect(store.isHydrated).toBe(true);
	});

	it("Given 현재 tenant가 확정돼 있을 때 When draft tenant만 바꾸면 Then current tenant는 유지하고 selectedTenantId만 갱신한다", () => {
		account.setCurrentTenant(TENANT_A, "Fitness Center A", "ko_KR", SPACE_A);

		account.selectTenant(TENANT_B);

		expect(account.currentTenantId).toBe(TENANT_A);
		expect(account.selectedTenantId).toBe(TENANT_B);
		expect(account.currentSpaceId).toBe(SPACE_A);
		expect(account.currentFitnessCenterName).toBe("Fitness Center A");
	});

	it("Given 선택 가능한 Space 목록이 있을 때 When current tenant를 확정하면 Then draft 선택도 같은 tenant와 FitnessCenter로 동기화한다", () => {
		account.setAvailableSpaces([
			{
				tenantId: TENANT_B,
				spaceId: SPACE_B,
				fitnessCenterName: "Fitness Center B",
				contentLanguageCode: "ja_JP",
			},
		]);

		account.setCurrentTenant(TENANT_B, "Fitness Center B");

		expect(account.currentTenantId).toBe(TENANT_B);
		expect(account.selectedTenantId).toBe(TENANT_B);
		expect(account.currentSpaceId).toBe(SPACE_B);
		expect(account.contentLanguageCode).toBe("ja_JP");
	});

	it("Given account와 인증 세션이 채워져 있을 때 When clear를 호출하면 Then selection resolved를 유지하며 저장 상태를 비운다", () => {
		account.setAvailableSpaces([
			{
				tenantId: TENANT_A,
				spaceId: SPACE_A,
				fitnessCenterName: "Fitness Center A",
			},
		]);
		account.setCurrentTenant(TENANT_A, "Fitness Center A", null, SPACE_A);
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
		expect(account.currentFitnessCenterName).toBeNull();
		expect(account.availableSpaces).toEqual([]);
		expect(account.authSession.accessToken).toBeNull();
		expect(account.isHydrated).toBe(true);
		expect(account.isSelectionResolved).toBe(true);
		expect(storage.removeItem).toHaveBeenCalledWith(STORAGE_KEY);
		expect(storage.dump().has(STORAGE_KEY)).toBe(false);
	});

	it("Given version 없는 예전 account 선택이 저장돼 있을 때 When hydrateFromStorage를 호출하면 Then 값을 폐기하고 Space를 다시 선택하도록 기본 상태를 유지한다", () => {
		storage.setItem(
			STORAGE_KEY,
			JSON.stringify({
				account: {
					tenantId: TENANT_A,
					spaceId: SPACE_A,
					fitnessCenterName: "Fitness Center A",
					contentLanguageCode: "ko_KR",
					availableSpaces: [
						{
							tenantId: TENANT_A,
							spaceId: SPACE_A,
							fitnessCenterName: "Fitness Center A",
						},
					],
				},
			}),
		);

		account.hydrateFromStorage();

		expect(account.currentTenantId).toBeNull();
		expect(account.selectedTenantId).toBeNull();
		expect(account.currentSpaceId).toBeNull();
		expect(account.currentFitnessCenterName).toBeNull();
		expect(account.availableSpaces).toEqual([]);
		expect(account.isHydrated).toBe(true);
		expect(storage.removeItem).toHaveBeenCalledWith(STORAGE_KEY);
		expect(storage.dump().has(STORAGE_KEY)).toBe(false);
	});

	it("Given version 2 account 선택에 ULID 같은 잘못된 식별자가 저장돼 있을 때 When hydrateFromStorage를 호출하면 Then 현재 선택은 폐기하고 유효한 Space 목록만 남긴다", () => {
		const validAvailableSpace: AccountSpaceInfo = {
			tenantId: TENANT_A,
			spaceId: SPACE_A,
			fitnessCenterName: "Fitness Center A",
			contentLanguageCode: "ko_KR",
		};
		storage.setItem(
			STORAGE_KEY,
			JSON.stringify({
				account: {
					version: 2,
					tenantId: "01J7G2V0ULIDLIKEVALUE",
					spaceId: "space-ulid-value",
					fitnessCenterName: "Fitness Center A",
					contentLanguageCode: "ko_KR",
					availableSpaces: [
						validAvailableSpace,
						{
							tenantId: "tenant-ulid-value",
							spaceId: SPACE_B,
							fitnessCenterName: "Broken Space",
						},
					],
				},
			}),
		);

		account.hydrateFromStorage();

		expect(account.currentTenantId).toBeNull();
		expect(account.selectedTenantId).toBeNull();
		expect(account.currentSpaceId).toBeNull();
		expect(account.currentFitnessCenterName).toBeNull();
		expect(account.contentLanguageCode).toBeNull();
		expect(account.availableSpaces).toEqual([validAvailableSpace]);
		expect(storage.dump().get(STORAGE_KEY)).toContain(
			`"tenantId":"${TENANT_A}"`,
		);
		expect(storage.dump().get(STORAGE_KEY)).not.toContain("ULIDLIKEVALUE");
	});

	it("Given 현재 tenant 선택이 있을 때 When storage에 저장하면 Then version 2 형식으로 FitnessCenter 선택을 기록한다", () => {
		account.setAvailableSpaces([
			{
				tenantId: TENANT_A,
				spaceId: SPACE_A,
				fitnessCenterName: "Fitness Center A",
			},
		]);
		account.setCurrentTenant(TENANT_A, "Fitness Center A", null, SPACE_A);

		const persisted = JSON.parse(
			storage.dump().get(STORAGE_KEY) ?? "{}",
		).account;

		expect(persisted).toMatchObject({
			version: 2,
			tenantId: TENANT_A,
			spaceId: SPACE_A,
			fitnessCenterName: "Fitness Center A",
			availableSpaces: [
				{
					tenantId: TENANT_A,
					spaceId: SPACE_A,
					fitnessCenterName: "Fitness Center A",
				},
			],
		});
	});
});
