/// <reference types="vitest/globals" />

import { describe, expect, it, vi } from "vitest";
import type { PersistStorageAdapter } from "../persistence/persistStorage";
import { RootStore, type RootStoreRuntimeBindings } from "../rootStore";

const EMPTY_RUNTIME_BINDINGS: RootStoreRuntimeBindings = {
	sessionScopeBinders: [],
	languageBinders: [],
};

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
			read: <T,>(key: string): T | null => read(key) as T | null,
			write: <T,>(key: string, value: T): void => write(key, value),
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
	it("constructor에서는 저장소를 읽지 않고 완성된 AppStore를 조립한다", () => {
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
		expect(root.app.navigation).toBeDefined();
	});

	it("initialize하면 runtime binder에 동일한 참조를 한 번만 연결한다", () => {
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

	it("initialize 전에 start하면 명확한 오류를 발생시킨다", () => {
		const root = createRoot(createPersistStorage().storageAdapter);

		expect(() => root.start()).toThrow(
			"RootStore.initialize() must be called before start().",
		);
		expect(root.isStarted).toBe(false);
	});

	it("start하면 하나의 App 문서에서 session, account, language를 복원한다", () => {
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
					tenantId: "tenant-a",
					spaceId: "space-a",
					groundName: "Ground A",
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
		expect(root.app.account.currentTenantId).toBe("tenant-a");
		expect(root.app.account.currentSpaceId).toBe("space-a");
		expect(root.app.language.languageCode).toBe("en_US");
	});

	it("저장소를 사용할 수 없어도 start를 완료하고 기본 상태를 유지한다", () => {
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

	it("sessionScope와 platform router를 실행 중인 AppStore에 연결한다", () => {
		const root = createRoot(createPersistStorage().storageAdapter);
		const push = vi.fn();
		const replace = vi.fn();
		const back = vi.fn();

		root.initialize(EMPTY_RUNTIME_BINDINGS);
		root.sessionScope.accessToken = "updated-access-token";
		root.app.account.setCurrentTenant(
			"tenant-a",
			"Ground A",
			null,
			"space-a",
		);
		root.setRouter({ push, replace, back });
		root.app.navigation.selectNavItem("dashboard");

		expect(root.app.account.authSession.accessToken).toBe(
			"updated-access-token",
		);
		expect(root.sessionScope.tenantId).toBe("tenant-a");
		expect(push).toHaveBeenCalledWith("/dashboard");
	});
});
