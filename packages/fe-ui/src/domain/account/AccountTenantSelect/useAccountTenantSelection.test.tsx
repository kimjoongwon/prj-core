// @vitest-environment jsdom

import type { AccountBootstrapSpaceLike } from "@cocrepo/type";
import { act, renderHook } from "@testing-library/react";
import { beforeEach, describe, expect, it, vi } from "vitest";
import { useAccountTenantSelection } from "./useAccountTenantSelection";

interface MutationOptions {
	onSuccess?: (
		response: { data?: AccountBootstrapSpaceLike },
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
				fitnessCenterName: "Fitness Center A",
				contentLanguageCode: "ko_KR",
			},
			{
				tenantId: "tenant-b",
				spaceId: "space-b",
				fitnessCenterName: "Fitness Center B",
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

	it("Given 접근 가능한 피트니스센터가 있을 때, When 다른 Tenant를 선택하면, Then 피트니스센터 Option과 tenantId를 mutation에 전달한다", () => {
		const { result } = renderHook(() => useAccountTenantSelection());

		expect(result.current.options).toEqual([
			{ text: "Fitness Center A", value: "tenant-a" },
			{ text: "Fitness Center B", value: "tenant-b" },
		]);

		act(() => result.current.selectTenant("tenant-b"));

		expect(mocks.account.selectTenant).toHaveBeenCalledWith("tenant-b");
		expect(mocks.mutate).toHaveBeenCalledWith({ tenantId: "tenant-b" });
	});

	it.each([
		"",
		"tenant-a",
		"unknown-tenant",
	])("Given 선택할 수 없는 tenantId %s가 있을 때, When Tenant 선택을 요청하면, Then 요청을 무시한다", (tenantId) => {
		const { result } = renderHook(() => useAccountTenantSelection());

		act(() => result.current.selectTenant(tenantId));

		expect(mocks.account.selectTenant).not.toHaveBeenCalled();
		expect(mocks.mutate).not.toHaveBeenCalled();
	});

	it("Given mutation이 pending일 때, When 다른 Tenant를 선택하면, Then 새 선택을 무시한다", () => {
		mocks.isPending = true;
		const { result } = renderHook(() => useAccountTenantSelection());

		act(() => result.current.selectTenant("tenant-b"));

		expect(result.current.isPending).toBe(true);
		expect(mocks.account.selectTenant).not.toHaveBeenCalled();
		expect(mocks.mutate).not.toHaveBeenCalled();
	});

	it("Given FitnessCenter와 Company 이름이 모두 있는 응답일 때, When mutation이 성공하면, Then FitnessCenter 이름으로 현재 Tenant를 확정한다", () => {
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
							fitnessCenter: {
								name: "Server Fitness Center B",
								company: { name: "Server Company B" },
							},
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
			"Server Fitness Center B",
			"en_US",
			"server-space-b",
		);
	});

	it("Given FitnessCenter 이름이 없는 응답일 때, When mutation이 성공하면, Then Company 이름으로 현재 Tenant를 확정한다", () => {
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
							fitnessCenter: {
								company: { name: "Server Company B" },
							},
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
			"Server Company B",
			"en_US",
			"server-space-b",
		);
	});

	it("Given 서버 응답에 표시 이름이 없을 때, When mutation이 성공하면, Then 선택 Option의 fitnessCenterName으로 현재 Tenant를 확정한다", () => {
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
							fitnessCenter: {},
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
			"Fitness Center B",
			"en_US",
			"server-space-b",
		);
	});

	it("Given 선택 정보를 찾을 수 없을 때, When mutation이 성공하면, Then 서버에서 확정된 currentTenantId로 되돌린다", () => {
		renderHook(() => useAccountTenantSelection());

		act(() =>
			mocks.mutationOptions?.onSuccess?.({}, { tenantId: "unknown-tenant" }),
		);

		expect(mocks.account.selectTenant).toHaveBeenCalledWith("tenant-a");
		expect(mocks.account.setCurrentTenant).not.toHaveBeenCalled();
	});

	it("Given Tenant 선택 mutation이 실패할 때, When 오류 callback이 실행되면, Then 서버에서 확정된 currentTenantId로 되돌린다", () => {
		renderHook(() => useAccountTenantSelection());

		act(() => mocks.mutationOptions?.onError?.());

		expect(mocks.account.selectTenant).toHaveBeenCalledWith("tenant-a");
	});
});
