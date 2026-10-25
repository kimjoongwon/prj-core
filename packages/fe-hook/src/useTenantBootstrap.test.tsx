// @vitest-environment jsdom

import {
	AccountStore,
	AuthSession,
	browserPersistStorageAdapter,
	PersistStorage,
} from "@cocrepo/store";
import { DATABASE_ID_MAX } from "@cocrepo/type";
import { render, screen, waitFor } from "@testing-library/react";
import { observer } from "mobx-react-lite";
import { beforeEach, describe, expect, it, vi } from "vitest";
import {
	type AccountBootstrapSpaceLike,
	normalizeAccountBootstrapSpaces,
	useTenantBootstrap,
} from "./useTenantBootstrap";
import { isWireId, toWireId } from "./wire-id";

const asId = (value: string): NonNullable<AccountBootstrapSpaceLike["id"]> =>
	value as NonNullable<AccountBootstrapSpaceLike["id"]>;

const TENANT_A = "01JTENANT000000000000000TA";
const TENANT_B = "01JTENANT000000000000000TB";
const SPACE_A = "01JSPACE0000000000000000SA";
const SPACE_B = "01JSPACE0000000000000000SB";

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
				id: asId(SPACE_A),
				tenantId: asId(TENANT_A),
				name: "Fitness Center A",
				contentLanguageCode: "ko_KR",
				fitnessCenter: {},
			},
			{
				id: asId(SPACE_B),
				tenantId: asId(TENANT_B),
				name: "Fitness Center B",
				contentLanguageCode: "en_US",
				fitnessCenter: {},
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
				tenantId: TENANT_A,
				spaceId: SPACE_A,
				spaceName: "Fitness Center A",
				contentLanguageCode: "ko_KR",
			},
			{
				tenantId: TENANT_B,
				spaceId: SPACE_B,
				spaceName: "Fitness Center B",
				contentLanguageCode: "en_US",
			},
		]);
		expect(account.currentTenantId).toBe(TENANT_B);
		expect(account.selectedTenantId).toBe(TENANT_B);
		expect(account.currentSpaceId).toBe(SPACE_B);
		expect(screen.getByLabelText("account-bootstrap-ready").textContent).toBe(
			"true",
		);
	});

	it("Given current-space가 비어 있을 때, When bootstrap이 실행되면, Then current tenant가 초기화되고 selection은 resolved로 설정된다", async () => {
		const account = createAccountStore("tenant-bootstrap-empty-test");
		account.setCurrentTenant(
			asId(TENANT_A),
			"Fitness Center A",
			null,
			asId(SPACE_A),
		);

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

describe("isWireId", () => {
	const maxDecimalId = String(DATABASE_ID_MAX);

	const validCases = [SPACE_A, "01ARZ3NDEKTSV4RRFFQ69G5FAV"];
	const invalidCases = ["0", "-1", "01", "1.2", "1e3", "1", maxDecimalId];

	it.each(validCases)(
		"Given `%s`, When isWireId를 검사하면, Then true가 반환된다",
		(value) => {
			expect(isWireId(value)).toBe(true);
		},
	);

	it.each(invalidCases)(
		"Given `%s`, When isWireId를 검사하면, Then false가 반환된다",
		(value) => {
			expect(isWireId(value)).toBe(false);
		},
	);

	it("ULID 문자열만 wire 식별자로 정규화하고 구 decimal·bigint 입력은 거부한다", () => {
		expect(toWireId(SPACE_A)).toBe(SPACE_A);
		expect(toWireId("1")).toBeNull();
		expect(toWireId(maxDecimalId)).toBeNull();
		expect(toWireId(BigInt("42"))).toBeNull();
		expect(toWireId(DATABASE_ID_MAX)).toBeNull();
		expect(toWireId(BigInt("0"))).toBeNull();
		expect(
			normalizeAccountBootstrapSpaces([
				{
					id: BigInt("101"),
					tenantId: BigInt("2"),
					name: "Fitness Center B",
					fitnessCenter: {},
				},
			]),
		).toEqual([
			{
				id: undefined,
				tenantId: undefined,
				name: "Fitness Center B",
				label: undefined,
				contentLanguageCode: undefined,
				fitnessCenter: {
					company: undefined,
				},
			},
		]);
	});
});
