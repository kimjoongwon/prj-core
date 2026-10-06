import { getCurrentSpaceQueryKey, getGetMySpacesQueryKey } from "@cocrepo/api/idp/auth";
import { QueryClient } from "@tanstack/react-query";
import { beforeEach, describe, expect, it, vi } from "vitest";
import { prefetchAuthenticatedTenantQueries } from "./authenticated-server-prefetch";

const customFetchMock = vi.hoisted(() => vi.fn());
const headersMock = vi.hoisted(() => vi.fn());

vi.mock("@cocrepo/api/core/client", () => ({
	customFetch: customFetchMock,
}));

vi.mock("next/headers", () => ({
	headers: headersMock,
}));

const createRequestHeadersStub = (entries: Record<string, string | null>) => ({
	get: (name: string) => entries[name] ?? null,
});

describe("prefetchAuthenticatedTenantQueries", () => {
	let queryClient: QueryClient;

	beforeEach(() => {
		vi.clearAllMocks();
		queryClient = new QueryClient();
	});

	it("Given accessToken이 있으면, When prefetch하면, Then 클라이언트 hook과 같은 queryKey로 재구성된 origin과 Bearer로 2건을 조회해 캐시에 남긴다", async () => {
		headersMock.mockResolvedValue(
			createRequestHeadersStub({
				host: "admin.example.com",
				"x-forwarded-proto": "https",
			}),
		);
		customFetchMock.mockResolvedValue({ data: null });

		await prefetchAuthenticatedTenantQueries({
			queryClient,
			accessToken: "token-1",
		});

		expect(customFetchMock).toHaveBeenCalledTimes(2);
		const requestedUrls = customFetchMock.mock.calls.map(
			([url]) => url as string,
		);
		expect(requestedUrls).toContain("https://admin.example.com/api/v1/auth/current-space");
		expect(requestedUrls).toContain("https://admin.example.com/api/v1/auth/my-spaces");
		for (const [, options] of customFetchMock.mock.calls) {
			expect((options as RequestInit).method).toBe("GET");
			expect((options as RequestInit).headers).toEqual({
				Authorization: "Bearer token-1",
			});
		}
		expect(
			queryClient.getQueryData(getCurrentSpaceQueryKey()),
		).toEqual({ data: null });
		expect(
			queryClient.getQueryData(getGetMySpacesQueryKey()),
		).toEqual({ data: null });
	});

	it("Given x-forwarded-proto가 쉼표로 누적되었으면, When prefetch하면, Then 첫 값을 프로토콜로 쓴다", async () => {
		headersMock.mockResolvedValue(
			createRequestHeadersStub({
				host: "localhost:3000",
				"x-forwarded-proto": "https, http",
			}),
		);
		customFetchMock.mockResolvedValue({ data: [] });

		await prefetchAuthenticatedTenantQueries({
			queryClient,
			accessToken: "token-2",
		});

		const requestedUrls = customFetchMock.mock.calls.map(
			([url]) => url as string,
		);
		expect(requestedUrls).toContain("https://localhost:3000/api/v1/auth/my-spaces");
	});

	it("Given 조회가 실패하면, When prefetch하면, Then throw하지 않고 성공 쿼리만 남긴다(클라이언트 폭포 폴백)", async () => {
		headersMock.mockResolvedValue(
			createRequestHeadersStub({ host: "localhost:3000" }),
		);
		customFetchMock.mockRejectedValue(new Error("401 unauthorized"));

		await expect(
			prefetchAuthenticatedTenantQueries({
				queryClient,
				accessToken: "expired-token",
			}),
		).resolves.toBeUndefined();

		expect(
			queryClient.getQueryData(getCurrentSpaceQueryKey()),
		).toBeUndefined();
		expect(
			queryClient.getQueryData(getGetMySpacesQueryKey()),
		).toBeUndefined();
	});

	it("Given host 헤더가 없으면, When prefetch하면, Then layout이 폴백할 수 있게 에러를 던진다", async () => {
		headersMock.mockResolvedValue(createRequestHeadersStub({}));

		await expect(
			prefetchAuthenticatedTenantQueries({
				queryClient,
				accessToken: "token-3",
			}),
		).rejects.toThrow("host");
	});
});
