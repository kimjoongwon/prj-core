// @vitest-environment jsdom

import { act, renderHook } from "@testing-library/react";
import { beforeEach, describe, expect, it, vi } from "vitest";
import { useAccountTenantSelection } from "./useAccountTenantSelection";

interface MutationOptions {
	onSuccess?: (
		response: { data?: { id?: string; ground?: { name?: string } } },
		variables: { tenantId: string },
	) => void;
	onError?: () => void;
}

const mocks = vi.hoisted(() => ({
	account: {
		availableSpaces: [
			{
				tenantId: "tenant-a",
				spaceId: "space-a",
				groundName: "Ground A",
				contentLanguageCode: "ko_KR",
			},
			{
				tenantId: "tenant-b",
				spaceId: "space-b",
				groundName: "Ground B",
				contentLanguageCode: "en_US",
			},
		],
		currentTenantId: "tenant-a" as string | null,
		selectedTenantId: "tenant-a" as string | null,
		selectTenant: vi.fn(),
		setCurrentTenant: vi.fn(),
	},
	isPending: false,
	mutate: vi.fn(),
	mutationOptions: undefined as MutationOptions | undefined,
}));

vi.mock("@cocrepo/store", () => ({
	useApp: () => ({ account: mocks.account }),
}));

vi.mock("@cocrepo/api/idp/auth", () => ({
	useSetCurrentSpace: (options: { mutation?: MutationOptions }) => {
		mocks.mutationOptions = options.mutation;
		return { mutate: mocks.mutate, isPending: mocks.isPending };
	},
}));

describe("useAccountTenantSelection", () => {
	beforeEach(() => {
		mocks.mutate.mockReset();
		mocks.account.selectTenant.mockReset();
		mocks.account.setCurrentTenant.mockReset();
		mocks.account.currentTenantId = "tenant-a";
		mocks.account.selectedTenantId = "tenant-a";
		mocks.isPending = false;
		mocks.mutationOptions = undefined;
	});

	it("Option을 만들고 변경된 tenantId를 current-space mutation에 전달한다", () => {
		const { result } = renderHook(() => useAccountTenantSelection());

		expect(result.current.options).toEqual([
			{ text: "Ground A", value: "tenant-a" },
			{ text: "Ground B", value: "tenant-b" },
		]);

		act(() => result.current.selectTenant("tenant-b"));

		expect(mocks.account.selectTenant).toHaveBeenCalledWith("tenant-b");
		expect(mocks.mutate).toHaveBeenCalledWith({ tenantId: "tenant-b" });
	});

	it.each([
		"",
		"tenant-a",
		"unknown-tenant",
	])("유효하지 않은 tenantId %s 선택을 무시한다", (tenantId) => {
		const { result } = renderHook(() => useAccountTenantSelection());

		act(() => result.current.selectTenant(tenantId));

		expect(mocks.account.selectTenant).not.toHaveBeenCalled();
		expect(mocks.mutate).not.toHaveBeenCalled();
	});

	it("mutation이 pending이면 새 선택을 무시한다", () => {
		mocks.isPending = true;
		const { result } = renderHook(() => useAccountTenantSelection());

		act(() => result.current.selectTenant("tenant-b"));

		expect(result.current.isPending).toBe(true);
		expect(mocks.account.selectTenant).not.toHaveBeenCalled();
		expect(mocks.mutate).not.toHaveBeenCalled();
	});

	it("mutation 성공 시 서버 응답으로 current tenant를 확정한다", () => {
		renderHook(() => useAccountTenantSelection());
		const navigationErrorSpy = vi
			.spyOn(console, "error")
			.mockImplementation(() => {});

		try {
			// jsdom은 navigation을 구현하지 않으므로 reload 경고만 숨깁니다.
			act(() =>
				mocks.mutationOptions?.onSuccess?.(
					{
						data: {
							id: "server-space-b",
							ground: { name: "Server Ground B" },
						},
					},
					{ tenantId: "tenant-b" },
				),
			);
		} finally {
			navigationErrorSpy.mockRestore();
		}

		expect(mocks.account.setCurrentTenant).toHaveBeenCalledWith(
			"tenant-b",
			"Server Ground B",
			"en_US",
			"server-space-b",
		);
	});

	it("mutation 성공 시 선택 정보를 찾지 못하면 currentTenantId로 되돌린다", () => {
		renderHook(() => useAccountTenantSelection());

		act(() =>
			mocks.mutationOptions?.onSuccess?.({}, { tenantId: "unknown-tenant" }),
		);

		expect(mocks.account.selectTenant).toHaveBeenCalledWith("tenant-a");
		expect(mocks.account.setCurrentTenant).not.toHaveBeenCalled();
	});

	it("mutation 실패 시 서버에서 확정된 currentTenantId로 되돌린다", () => {
		renderHook(() => useAccountTenantSelection());

		act(() => mocks.mutationOptions?.onError?.());

		expect(mocks.account.selectTenant).toHaveBeenCalledWith("tenant-a");
	});
});
