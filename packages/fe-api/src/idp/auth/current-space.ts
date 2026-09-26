import { parseDecimalId } from "@cocrepo/type/database-id";
import {
	type QueryClient,
	type UseMutationOptions,
	type UseMutationResult,
	type UseQueryOptions,
	type UseQueryResult,
	useMutation,
	useQuery,
} from "@tanstack/react-query";
import { apiJsonStringify } from "../../libs/apiFetchCore";
import type { ErrorType } from "../../libs/customFetch";
import { customFetch } from "../../libs/customFetch";
import type { SpaceDto } from "../model/spaceDto";

type CurrentSpaceResponse = {
	data?: SpaceDto | null;
};

type SetCurrentSpacePayload = {
	tenantId: string;
};

type SecondParameter<T extends (...args: never) => unknown> = Parameters<T>[1];

export const getCurrentSpace = (
	options?: SecondParameter<typeof customFetch>,
	signal?: AbortSignal,
) =>
	customFetch<CurrentSpaceResponse>("/api/v1/auth/current-space", {
		...options,
		method: "GET",
		signal: signal ?? options?.signal,
	});

export const getCurrentSpaceQueryKey = () =>
	["/api/v1/auth/current-space"] as const;

export function useGetCurrentSpace<
	TData = Awaited<ReturnType<typeof getCurrentSpace>>,
	TError = ErrorType<unknown>,
>(
	options?: {
		query?: Partial<
			UseQueryOptions<
				Awaited<ReturnType<typeof getCurrentSpace>>,
				TError,
				TData
			>
		>;
		request?: SecondParameter<typeof customFetch>;
	},
	queryClient?: QueryClient,
): UseQueryResult<TData, TError> {
	const queryOptions = options?.query;
	const requestOptions = options?.request;

	return useQuery(
		{
			queryKey: queryOptions?.queryKey ?? getCurrentSpaceQueryKey(),
			queryFn: ({ signal }) => getCurrentSpace(requestOptions, signal),
			...queryOptions,
		},
		queryClient,
	);
}

export const setCurrentSpace = (
	payload: SetCurrentSpacePayload,
	options?: SecondParameter<typeof customFetch>,
) => {
	// 기존 문자열 입력 계약을 공용 클라이언트의 bigint 안전 직렬화에 연결합니다.
	const tenantId = parseDecimalId(payload.tenantId);
	if (tenantId === null) {
		throw new TypeError("tenantId must be a canonical positive BIGINT string");
	}
	return customFetch<CurrentSpaceResponse>("/api/v1/auth/current-space", {
		...options,
		method: "POST",
		headers: { "Content-Type": "application/json" },
		body: apiJsonStringify({ ...payload, tenantId }),
	});
};

export function useSetCurrentSpace<
	TError = ErrorType<unknown>,
	TContext = unknown,
>(
	options?: {
		mutation?: UseMutationOptions<
			Awaited<ReturnType<typeof setCurrentSpace>>,
			TError,
			SetCurrentSpacePayload,
			TContext
		>;
		request?: SecondParameter<typeof customFetch>;
	},
	queryClient?: QueryClient,
): UseMutationResult<
	Awaited<ReturnType<typeof setCurrentSpace>>,
	TError,
	SetCurrentSpacePayload,
	TContext
> {
	return useMutation(
		{
			mutationFn: (payload) => setCurrentSpace(payload, options?.request),
			...options?.mutation,
		},
		queryClient,
	);
}
