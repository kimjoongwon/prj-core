// @vitest-environment jsdom

import {
	AccountStore,
	AuthSession,
	browserPersistStorageAdapter,
	PersistStorage,
} from "@cocrepo/store";
import { render, screen, waitFor } from "@testing-library/react";
import { observer } from "mobx-react-lite";
import { beforeEach, describe, expect, it, vi } from "vitest";
import {
	type AccountBootstrapSpaceLike,
	useTenantBootstrap,
} from "./useTenantBootstrap";

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
	};
}

function createAccountStore(storageKey: string): AccountStore {
	const persistStorage = new PersistStorage(
		storageKey,
		browserPersistStorageAdapter,
	);
	const authSession = new AuthSession(persistStorage);

	return new AccountStore({
		authSession,
		persistStorage,
	});
}

const AccountBootstrapProbe = observer(function AccountBootstrapProbe({
	account,
	spaces,
	currentSpace,
	isCurrentSpaceFetched,
}: {
	account: AccountStore;
	spaces: AccountBootstrapSpaceLike[];
	currentSpace: AccountBootstrapSpaceLike | null;
	isCurrentSpaceFetched: boolean;
}) {
	const result = useTenantBootstrap({
		account,
		isHydrated: true,
		spaces,
		currentSpace,
		isCurrentSpaceFetched,
	});

	return (
		<output aria-label="account-bootstrap-ready">
			{String(result.isAccountBootstrapReady)}
		</output>
	);
});

describe("useTenantBootstrap", () => {
	beforeEach(() => {
		Object.defineProperty(window, "localStorage", {
			value: createStorageMock(),
			writable: true,
		});
	});

	it("Given my-spaces와 current-space가 존재할 때, When bootstrap이 실행되면, Then Account의 선택 정보를 fitness center 기준으로 반영하고 ready가 true가 된다", async () => {
		const account = createAccountStore("tenant-bootstrap-test");
		const spaces: AccountBootstrapSpaceLike[] = [
			{
				id: "space-a",
				tenantId: "tenant-a",
				contentLanguageCode: "ko_KR",
				fitnessCenter: {
					name: "Fitness Center A",
				},
			},
			{
				id: "space-b",
				tenantId: "tenant-b",
				contentLanguageCode: "en_US",
				fitnessCenter: {
					name: "Fitness Center B",
				},
			},
		];

		render(
			<AccountBootstrapProbe
				account={account}
				spaces={spaces}
				currentSpace={spaces[1]}
				isCurrentSpaceFetched
			/>,
		);

		await waitFor(() => {
			expect(account.isSelectionResolved).toBe(true);
		});

		expect(account.availableSpaces).toEqual([
			{
				tenantId: "tenant-a",
				spaceId: "space-a",
				fitnessCenterName: "Fitness Center A",
				contentLanguageCode: "ko_KR",
			},
			{
				tenantId: "tenant-b",
				spaceId: "space-b",
				fitnessCenterName: "Fitness Center B",
				contentLanguageCode: "en_US",
			},
		]);
		expect(account.currentTenantId).toBe("tenant-b");
		expect(account.selectedTenantId).toBe("tenant-b");
		expect(account.currentSpaceId).toBe("space-b");
		expect(screen.getByLabelText("account-bootstrap-ready").textContent).toBe(
			"true",
		);
	});

	it("Given current-space가 비어 있을 때, When bootstrap이 실행되면, Then current tenant가 초기화되고 selection은 resolved로 설정된다", async () => {
		const account = createAccountStore("tenant-bootstrap-empty-test");
		account.setCurrentTenant("tenant-a", "Fitness Center A", null, "space-a");

		render(
			<AccountBootstrapProbe
				account={account}
				spaces={[]}
				currentSpace={null}
				isCurrentSpaceFetched
			/>,
		);

		await waitFor(() => {
			expect(account.isSelectionResolved).toBe(true);
		});

		expect(account.currentTenantId).toBeNull();
		expect(account.selectedTenantId).toBeNull();
		expect(account.currentSpaceId).toBeNull();
	});
});
