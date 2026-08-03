/// <reference types="vitest/globals" />

import type { DecimalId } from "@cocrepo/type";
import { describe, expect, it, vi } from "vitest";
import type { PersistStorageAdapter } from "../persistence/persistStorage";
import { RootStore, type RootStoreRuntimeBindings } from "../rootStore";

const EMPTY_RUNTIME_BINDINGS: RootStoreRuntimeBindings = {
	sessionScopeBinders: [],
	languageBinders: [],
};
const TENANT_A = "101" as DecimalId;
const SPACE_A = "201" as DecimalId;

interface PersistStorageFixture {
	storageAdapter: PersistStorageAdapter;
	isAvailable: ReturnType<typeof vi.fn>;
	read: ReturnType<typeof vi.fn>;
	write: ReturnType<typeof vi.fn>;
	remove: ReturnType<typeof vi.fn>;
}

function createPersistStorage(
	initialValues: Record<string, unknown> = {},
	isStorageAvailable = true,
): PersistStorageFixture {
	const values = new Map<string, unknown>(Object.entries(initialValues));
	const isAvailable = vi.fn(() => isStorageAvailable);
	const read = vi.fn((key: string): unknown => values.get(key) ?? null);
	const write = vi.fn((key: string, value: unknown): void => {
		values.set(key, value);
	});
	const remove = vi.fn((key: string): void => {
		values.delete(key);
	});

	return {
		storageAdapter: {
			isAvailable: () => isAvailable(),
			read: <T>(key: string): T | null => read(key) as T | null,
			write: <T>(key: string, value: T): void => write(key, value),
			remove: (key: string): void => remove(key),
		},
		isAvailable,
		read,
		write,
		remove,
	};
}

function createRoot(storageAdapter: PersistStorageAdapter): RootStore {
	return new RootStore({
		appName: "TEST_APP",
		navItems: [
			{
				id: "dashboard",
				label: "Dashboard",
				path: "/dashboard",
				subject: "menu:dashboard",
			},
		],
		persistStorageKey: "root-test",
		storageAdapter,
	});
}

describe("RootStore", () => {
	it("Given 비어 있는 저장소가 있을 때 When RootStore constructor만 호출하면 Then 저장소를 읽지 않고 완성된 AppStore를 조립한다", () => {
		const storage = createPersistStorage();

		const root = createRoot(storage.storageAdapter);

		expect(storage.isAvailable).not.toHaveBeenCalled();
		expect(storage.read).not.toHaveBeenCalled();
		expect(root.isInitialized).toBe(false);
		expect(root.isStarted).toBe(false);
		expect(root.app.name).toBe("TEST_APP");
		expect(root.app.account.authSession).toBeDefined();
		expect(root.app.accessControl).toBeDefined();
		expect(root.app.language).toBeDefined();
		expect(root.app.modal).toBeDefined();
		expect(root.app.navigation).toBeDefined();
	});

	it("Given runtime binder들이 있을 때 When initialize를 두 번 호출하면 Then 동일한 참조를 한 번만 연결한다", () => {
		const root = createRoot(createPersistStorage().storageAdapter);
		const bindSessionScopeA = vi.fn();
		const bindSessionScopeB = vi.fn();
		const bindLanguageA = vi.fn();
		const bindLanguageB = vi.fn();

		root.initialize({
			sessionScopeBinders: [bindSessionScopeA, bindSessionScopeB],
			languageBinders: [bindLanguageA, bindLanguageB],
		});
		root.initialize({
			sessionScopeBinders: [bindSessionScopeA],
			languageBinders: [bindLanguageA],
		});

		expect(root.isInitialized).toBe(true);
		expect(bindSessionScopeA).toHaveBeenCalledTimes(1);
		expect(bindSessionScopeB).toHaveBeenCalledTimes(1);
		expect(bindSessionScopeA).toHaveBeenCalledWith(root.sessionScope);
		expect(bindSessionScopeB).toHaveBeenCalledWith(root.sessionScope);
		expect(bindLanguageA).toHaveBeenCalledTimes(1);
		expect(bindLanguageB).toHaveBeenCalledTimes(1);
		expect(bindLanguageA).toHaveBeenCalledWith(root.app.language);
		expect(bindLanguageB).toHaveBeenCalledWith(root.app.language);
	});

	it("Given initialize 이전 RootStore가 있을 때 When start를 호출하면 Then 명확한 오류를 발생시킨다", () => {
		const root = createRoot(createPersistStorage().storageAdapter);

		expect(() => root.start()).toThrow(
			"RootStore.initialize() must be called before start().",
		);
		expect(root.isStarted).toBe(false);
	});

	it("Given version 2 account 선택이 포함된 App 문서가 있을 때 When start를 호출하면 Then session, account, language를 함께 복원한다", () => {
		const storage = createPersistStorage({
			"root-test": {
				authSession: {
					accessToken: "access-token",
					refreshToken: "refresh-token",
					sessionId: "session-id",
					accessTokenExpiresAt: Date.now() + 60_000,
					refreshTokenExpiresAt: Date.now() + 120_000,
				},
				account: {
					version: 2,
					tenantId: TENANT_A,
					spaceId: SPACE_A,
					fitnessCenterName: "Fitness Center A",
					contentLanguageCode: "ko_KR",
					availableSpaces: [],
				},
				language: { languageCode: "en_US" },
			},
		});
		const root = createRoot(storage.storageAdapter);

		root.initialize(EMPTY_RUNTIME_BINDINGS);
		root.start();
		root.start();

		expect(storage.read).toHaveBeenCalledTimes(1);
		expect(storage.read).toHaveBeenCalledWith("root-test");
		expect(root.isStarted).toBe(true);
		expect(root.app.account.authSession.accessToken).toBe("access-token");
		expect(root.app.account.currentTenantId).toBe(TENANT_A);
		expect(root.app.account.currentSpaceId).toBe(SPACE_A);
		expect(root.app.account.currentFitnessCenterName).toBe("Fitness Center A");
		expect(root.app.language.languageCode).toBe("en_US");
	});

	it("Given version 2 account 선택에 decimal이 아닌 식별자가 저장돼 있을 때 When start를 호출하면 Then account 선택은 폐기하고 나머지 section은 유지한다", () => {
		const storage = createPersistStorage({
			"root-test": {
				authSession: {
					accessToken: "access-token",
					refreshToken: "refresh-token",
					sessionId: "session-id",
					accessTokenExpiresAt: Date.now() + 60_000,
					refreshTokenExpiresAt: Date.now() + 120_000,
				},
				account: {
					version: 2,
					tenantId: "01J7G2V0ULIDLIKEVALUE",
					spaceId: "space-ulid-value",
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
				language: { languageCode: "en_US" },
			},
		});
		const root = createRoot(storage.storageAdapter);

		root.initialize(EMPTY_RUNTIME_BINDINGS);
		root.start();

		expect(root.isStarted).toBe(true);
		expect(root.app.account.currentTenantId).toBeNull();
		expect(root.app.account.currentSpaceId).toBeNull();
		expect(root.app.account.currentFitnessCenterName).toBeNull();
		expect(root.app.account.authSession.accessToken).toBe("access-token");
		expect(root.app.language.languageCode).toBe("en_US");
		expect(storage.write).toHaveBeenCalledWith("root-test", {
			authSession: {
				accessToken: "access-token",
				refreshToken: "refresh-token",
				sessionId: "session-id",
				accessTokenExpiresAt: expect.any(Number),
				refreshTokenExpiresAt: expect.any(Number),
			},
			account: {
				version: 2,
				tenantId: null,
				spaceId: null,
				fitnessCenterName: null,
				contentLanguageCode: null,
				availableSpaces: [
					{
						tenantId: TENANT_A,
						spaceId: SPACE_A,
						fitnessCenterName: "Fitness Center A",
						contentLanguageCode: null,
					},
				],
			},
			language: { languageCode: "en_US" },
		});
	});

	it("Given 저장소를 사용할 수 없는 런타임이 있을 때 When start를 호출하면 Then 기본 상태를 유지한 채 hydrate를 완료한다", () => {
		const storage = createPersistStorage({}, false);
		const root = createRoot(storage.storageAdapter);

		root.initialize(EMPTY_RUNTIME_BINDINGS);
		root.start();

		expect(storage.read).not.toHaveBeenCalled();
		expect(root.isStarted).toBe(true);
		expect(root.app.account.authSession.isHydrated).toBe(true);
		expect(root.app.account.isHydrated).toBe(true);
		expect(root.app.language.isHydrated).toBe(true);
	});

	it("Given initialize가 끝난 RootStore가 있을 때 When sessionScope와 platform router를 연결하면 Then 실행 중인 AppStore에 같은 상태를 반영한다", () => {
		const root = createRoot(createPersistStorage().storageAdapter);
		const push = vi.fn();
		const replace = vi.fn();
		const back = vi.fn();

		root.initialize(EMPTY_RUNTIME_BINDINGS);
		root.sessionScope.accessToken = "updated-access-token";
		root.app.account.setCurrentTenant(
			TENANT_A,
			"Fitness Center A",
			null,
			SPACE_A,
		);
		root.setRouter({ push, replace, back });
		root.app.navigation.selectNavItem("dashboard");

		expect(root.app.account.authSession.accessToken).toBe(
			"updated-access-token",
		);
		expect(root.sessionScope.tenantId).toBe(TENANT_A);
		expect(push).toHaveBeenCalledWith("/dashboard");
	});
});
