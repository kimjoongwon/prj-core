/**
 * Generated from the current Orval monolith output.
 * Do not edit manually. Update the upstream Orval output or rerun split-orval-output.mjs.
 */
import type {
  DataTag,
  DefinedInitialDataOptions,
  DefinedUseQueryResult,
  InfiniteData,
  MutationFunction,
  QueryClient,
  QueryFunction,
  QueryKey,
  UndefinedInitialDataOptions,
  UseMutationOptions,
  UseMutationResult,
  UseQueryOptions,
  UseQueryResult,
  UseSuspenseInfiniteQueryOptions,
  UseSuspenseInfiniteQueryResult,
  UseSuspenseQueryOptions,
  UseSuspenseQueryResult,
} from "@tanstack/react-query";
import {
  useMutation,
  useQuery,
  useSuspenseInfiniteQuery,
  useSuspenseQuery,
} from "@tanstack/react-query";

import type { CreateOidcClient201AllOf } from "../../idp-model/createOidcClient201AllOf";
import type { CreateOidcClientDto } from "../../idp-model/createOidcClientDto";
import type { GetOidcClient200AllOf } from "../../idp-model/getOidcClient200AllOf";
import type { GetOidcClients200AllOf } from "../../idp-model/getOidcClients200AllOf";
import type { GetOidcClientsParams } from "../../idp-model/getOidcClientsParams";
import type { OidcClientDto } from "../../idp-model/oidcClientDto";
import type { ToggleActiveOidcClient200AllOf } from "../../idp-model/toggleActiveOidcClient200AllOf";
import type { UpdateOidcClient200AllOf } from "../../idp-model/updateOidcClient200AllOf";
import type { UpdateOidcClientDto } from "../../idp-model/updateOidcClientDto";
export type { CreateOidcClient201AllOf };
export type { CreateOidcClientDto };
export type { GetOidcClient200AllOf };
export type { GetOidcClients200AllOf };
export type { GetOidcClientsParams };
export type { OidcClientDto };
export type { ToggleActiveOidcClient200AllOf };
export type { UpdateOidcClient200AllOf };
export type { UpdateOidcClientDto };
import type { BodyType, ErrorType } from "../../libs/customIdpAxios";
import { customIdpInstance } from "../../libs/customIdpAxios";

type SecondParameter<T extends (...args: never) => unknown> = Parameters<T>[1];

/**
 * 등록된 OIDC 클라이언트 목록을 조회합니다. 검색 및 필터링을 지원합니다.
 * @summary OIDC 클라이언트 목록 조회
 */
export const getOidcClients = (
	params?: GetOidcClientsParams,
	options?: SecondParameter<typeof customIdpInstance>,
	signal?: AbortSignal,
) => {
	return customIdpInstance<GetOidcClients200AllOf>(
		{ url: `/api/v1/oidc-clients`, method: "GET", params, signal },
		options,
	);
};

export const getGetOidcClientsQueryKey = (params?: GetOidcClientsParams) => {
	return [`/api/v1/oidc-clients`, ...(params ? [params] : [])] as const;
};

export const getGetOidcClientsInfiniteQueryKey = (
	params?: GetOidcClientsParams,
) => {
	return [
		"infinite",
		`/api/v1/oidc-clients`,
		...(params ? [params] : []),
	] as const;
};

export const getGetOidcClientsQueryOptions = <
	TData = Awaited<ReturnType<typeof getOidcClients>>,
	TError = ErrorType<void>,
>(
	params?: GetOidcClientsParams,
	options?: {
		query?: Partial<
			UseQueryOptions<Awaited<ReturnType<typeof getOidcClients>>, TError, TData>
		>;
		request?: SecondParameter<typeof customIdpInstance>;
	},
) => {
	const { query: queryOptions, request: requestOptions } = options ?? {};

	const queryKey = queryOptions?.queryKey ?? getGetOidcClientsQueryKey(params);

	const queryFn: QueryFunction<Awaited<ReturnType<typeof getOidcClients>>> = ({
		signal,
	}) => getOidcClients(params, requestOptions, signal);

	return { queryKey, queryFn, ...queryOptions } as UseQueryOptions<
		Awaited<ReturnType<typeof getOidcClients>>,
		TError,
		TData
	> & { queryKey: DataTag<QueryKey, TData, TError> };
};

export type GetOidcClientsQueryResult = NonNullable<
	Awaited<ReturnType<typeof getOidcClients>>
>;

export type GetOidcClientsQueryError = ErrorType<void>;

export function useGetOidcClients<
	TData = Awaited<ReturnType<typeof getOidcClients>>,
	TError = ErrorType<void>,
>(
	params: undefined | GetOidcClientsParams,
	options: {
		query: Partial<
			UseQueryOptions<Awaited<ReturnType<typeof getOidcClients>>, TError, TData>
		> &
			Pick<
				DefinedInitialDataOptions<
					Awaited<ReturnType<typeof getOidcClients>>,
					TError,
					Awaited<ReturnType<typeof getOidcClients>>
				>,
				"initialData"
			>;
		request?: SecondParameter<typeof customIdpInstance>;
	},
	queryClient?: QueryClient,
): DefinedUseQueryResult<TData, TError> & {
	queryKey: DataTag<QueryKey, TData, TError>;
};

export function useGetOidcClients<
	TData = Awaited<ReturnType<typeof getOidcClients>>,
	TError = ErrorType<void>,
>(
	params?: GetOidcClientsParams,
	options?: {
		query?: Partial<
			UseQueryOptions<Awaited<ReturnType<typeof getOidcClients>>, TError, TData>
		> &
			Pick<
				UndefinedInitialDataOptions<
					Awaited<ReturnType<typeof getOidcClients>>,
					TError,
					Awaited<ReturnType<typeof getOidcClients>>
				>,
				"initialData"
			>;
		request?: SecondParameter<typeof customIdpInstance>;
	},
	queryClient?: QueryClient,
): UseQueryResult<TData, TError> & {
	queryKey: DataTag<QueryKey, TData, TError>;
};

export function useGetOidcClients<
	TData = Awaited<ReturnType<typeof getOidcClients>>,
	TError = ErrorType<void>,
>(
	params?: GetOidcClientsParams,
	options?: {
		query?: Partial<
			UseQueryOptions<Awaited<ReturnType<typeof getOidcClients>>, TError, TData>
		>;
		request?: SecondParameter<typeof customIdpInstance>;
	},
	queryClient?: QueryClient,
): UseQueryResult<TData, TError> & {
	queryKey: DataTag<QueryKey, TData, TError>;
};

/**
 * @summary OIDC 클라이언트 목록 조회
 */

export function useGetOidcClients<
	TData = Awaited<ReturnType<typeof getOidcClients>>,
	TError = ErrorType<void>,
>(
	params?: GetOidcClientsParams,
	options?: {
		query?: Partial<
			UseQueryOptions<Awaited<ReturnType<typeof getOidcClients>>, TError, TData>
		>;
		request?: SecondParameter<typeof customIdpInstance>;
	},
	queryClient?: QueryClient,
): UseQueryResult<TData, TError> & {
	queryKey: DataTag<QueryKey, TData, TError>;
} {
	const queryOptions = getGetOidcClientsQueryOptions(params, options);

	const query = useQuery(queryOptions, queryClient) as UseQueryResult<
		TData,
		TError
	> & { queryKey: DataTag<QueryKey, TData, TError> };

	query.queryKey = queryOptions.queryKey;

	return query;
}

/**
 * @summary OIDC 클라이언트 목록 조회
 */
export const prefetchGetOidcClientsQuery = async <
	TData = Awaited<ReturnType<typeof getOidcClients>>,
	TError = ErrorType<void>,
>(
	queryClient: QueryClient,
	params?: GetOidcClientsParams,
	options?: {
		query?: Partial<
			UseQueryOptions<Awaited<ReturnType<typeof getOidcClients>>, TError, TData>
		>;
		request?: SecondParameter<typeof customIdpInstance>;
	},
): Promise<QueryClient> => {
	const queryOptions = getGetOidcClientsQueryOptions(params, options);

	await queryClient.prefetchQuery(queryOptions);

	return queryClient;
};

export const getGetOidcClientsSuspenseQueryOptions = <
	TData = Awaited<ReturnType<typeof getOidcClients>>,
	TError = ErrorType<void>,
>(
	params?: GetOidcClientsParams,
	options?: {
		query?: Partial<
			UseSuspenseQueryOptions<
				Awaited<ReturnType<typeof getOidcClients>>,
				TError,
				TData
			>
		>;
		request?: SecondParameter<typeof customIdpInstance>;
	},
) => {
	const { query: queryOptions, request: requestOptions } = options ?? {};

	const queryKey = queryOptions?.queryKey ?? getGetOidcClientsQueryKey(params);

	const queryFn: QueryFunction<Awaited<ReturnType<typeof getOidcClients>>> = ({
		signal,
	}) => getOidcClients(params, requestOptions, signal);

	return { queryKey, queryFn, ...queryOptions } as UseSuspenseQueryOptions<
		Awaited<ReturnType<typeof getOidcClients>>,
		TError,
		TData
	> & { queryKey: DataTag<QueryKey, TData, TError> };
};

export type GetOidcClientsSuspenseQueryResult = NonNullable<
	Awaited<ReturnType<typeof getOidcClients>>
>;

export type GetOidcClientsSuspenseQueryError = ErrorType<void>;

export function useGetOidcClientsSuspense<
	TData = Awaited<ReturnType<typeof getOidcClients>>,
	TError = ErrorType<void>,
>(
	params: undefined | GetOidcClientsParams,
	options: {
		query: Partial<
			UseSuspenseQueryOptions<
				Awaited<ReturnType<typeof getOidcClients>>,
				TError,
				TData
			>
		>;
		request?: SecondParameter<typeof customIdpInstance>;
	},
	queryClient?: QueryClient,
): UseSuspenseQueryResult<TData, TError> & {
	queryKey: DataTag<QueryKey, TData, TError>;
};

export function useGetOidcClientsSuspense<
	TData = Awaited<ReturnType<typeof getOidcClients>>,
	TError = ErrorType<void>,
>(
	params?: GetOidcClientsParams,
	options?: {
		query?: Partial<
			UseSuspenseQueryOptions<
				Awaited<ReturnType<typeof getOidcClients>>,
				TError,
				TData
			>
		>;
		request?: SecondParameter<typeof customIdpInstance>;
	},
	queryClient?: QueryClient,
): UseSuspenseQueryResult<TData, TError> & {
	queryKey: DataTag<QueryKey, TData, TError>;
};

export function useGetOidcClientsSuspense<
	TData = Awaited<ReturnType<typeof getOidcClients>>,
	TError = ErrorType<void>,
>(
	params?: GetOidcClientsParams,
	options?: {
		query?: Partial<
			UseSuspenseQueryOptions<
				Awaited<ReturnType<typeof getOidcClients>>,
				TError,
				TData
			>
		>;
		request?: SecondParameter<typeof customIdpInstance>;
	},
	queryClient?: QueryClient,
): UseSuspenseQueryResult<TData, TError> & {
	queryKey: DataTag<QueryKey, TData, TError>;
};

/**
 * @summary OIDC 클라이언트 목록 조회
 */

export function useGetOidcClientsSuspense<
	TData = Awaited<ReturnType<typeof getOidcClients>>,
	TError = ErrorType<void>,
>(
	params?: GetOidcClientsParams,
	options?: {
		query?: Partial<
			UseSuspenseQueryOptions<
				Awaited<ReturnType<typeof getOidcClients>>,
				TError,
				TData
			>
		>;
		request?: SecondParameter<typeof customIdpInstance>;
	},
	queryClient?: QueryClient,
): UseSuspenseQueryResult<TData, TError> & {
	queryKey: DataTag<QueryKey, TData, TError>;
} {
	const queryOptions = getGetOidcClientsSuspenseQueryOptions(params, options);

	const query = useSuspenseQuery(
		queryOptions,
		queryClient,
	) as UseSuspenseQueryResult<TData, TError> & {
		queryKey: DataTag<QueryKey, TData, TError>;
	};

	query.queryKey = queryOptions.queryKey;

	return query;
}

export const getGetOidcClientsSuspenseInfiniteQueryOptions = <
	TData = InfiniteData<Awaited<ReturnType<typeof getOidcClients>>>,
	TError = ErrorType<void>,
>(
	params?: GetOidcClientsParams,
	options?: {
		query?: Partial<
			UseSuspenseInfiniteQueryOptions<
				Awaited<ReturnType<typeof getOidcClients>>,
				TError,
				TData
			>
		>;
		request?: SecondParameter<typeof customIdpInstance>;
	},
) => {
	const { query: queryOptions, request: requestOptions } = options ?? {};

	const queryKey =
		queryOptions?.queryKey ?? getGetOidcClientsInfiniteQueryKey(params);

	const queryFn: QueryFunction<Awaited<ReturnType<typeof getOidcClients>>> = ({
		signal,
	}) => getOidcClients(params, requestOptions, signal);

	return {
		queryKey,
		queryFn,
		...queryOptions,
	} as UseSuspenseInfiniteQueryOptions<
		Awaited<ReturnType<typeof getOidcClients>>,
		TError,
		TData
	> & { queryKey: DataTag<QueryKey, TData, TError> };
};

export type GetOidcClientsSuspenseInfiniteQueryResult = NonNullable<
	Awaited<ReturnType<typeof getOidcClients>>
>;

export type GetOidcClientsSuspenseInfiniteQueryError = ErrorType<void>;

export function useGetOidcClientsSuspenseInfinite<
	TData = InfiniteData<Awaited<ReturnType<typeof getOidcClients>>>,
	TError = ErrorType<void>,
>(
	params: undefined | GetOidcClientsParams,
	options: {
		query: Partial<
			UseSuspenseInfiniteQueryOptions<
				Awaited<ReturnType<typeof getOidcClients>>,
				TError,
				TData
			>
		>;
		request?: SecondParameter<typeof customIdpInstance>;
	},
	queryClient?: QueryClient,
): UseSuspenseInfiniteQueryResult<TData, TError> & {
	queryKey: DataTag<QueryKey, TData, TError>;
};

export function useGetOidcClientsSuspenseInfinite<
	TData = InfiniteData<Awaited<ReturnType<typeof getOidcClients>>>,
	TError = ErrorType<void>,
>(
	params?: GetOidcClientsParams,
	options?: {
		query?: Partial<
			UseSuspenseInfiniteQueryOptions<
				Awaited<ReturnType<typeof getOidcClients>>,
				TError,
				TData
			>
		>;
		request?: SecondParameter<typeof customIdpInstance>;
	},
	queryClient?: QueryClient,
): UseSuspenseInfiniteQueryResult<TData, TError> & {
	queryKey: DataTag<QueryKey, TData, TError>;
};

export function useGetOidcClientsSuspenseInfinite<
	TData = InfiniteData<Awaited<ReturnType<typeof getOidcClients>>>,
	TError = ErrorType<void>,
>(
	params?: GetOidcClientsParams,
	options?: {
		query?: Partial<
			UseSuspenseInfiniteQueryOptions<
				Awaited<ReturnType<typeof getOidcClients>>,
				TError,
				TData
			>
		>;
		request?: SecondParameter<typeof customIdpInstance>;
	},
	queryClient?: QueryClient,
): UseSuspenseInfiniteQueryResult<TData, TError> & {
	queryKey: DataTag<QueryKey, TData, TError>;
};

/**
 * @summary OIDC 클라이언트 목록 조회
 */

export function useGetOidcClientsSuspenseInfinite<
	TData = InfiniteData<Awaited<ReturnType<typeof getOidcClients>>>,
	TError = ErrorType<void>,
>(
	params?: GetOidcClientsParams,
	options?: {
		query?: Partial<
			UseSuspenseInfiniteQueryOptions<
				Awaited<ReturnType<typeof getOidcClients>>,
				TError,
				TData
			>
		>;
		request?: SecondParameter<typeof customIdpInstance>;
	},
	queryClient?: QueryClient,
): UseSuspenseInfiniteQueryResult<TData, TError> & {
	queryKey: DataTag<QueryKey, TData, TError>;
} {
	const queryOptions = getGetOidcClientsSuspenseInfiniteQueryOptions(
		params,
		options,
	);

	const query = useSuspenseInfiniteQuery(
		queryOptions,
		queryClient,
	) as UseSuspenseInfiniteQueryResult<TData, TError> & {
		queryKey: DataTag<QueryKey, TData, TError>;
	};

	query.queryKey = queryOptions.queryKey;

	return query;
}

/**
 * @summary OIDC 클라이언트 목록 조회
 */
export const prefetchGetOidcClientsInfiniteQuery = async <
	TData = Awaited<ReturnType<typeof getOidcClients>>,
	TError = ErrorType<void>,
>(
	queryClient: QueryClient,
	params?: GetOidcClientsParams,
	options?: {
		query?: Partial<
			UseSuspenseInfiniteQueryOptions<
				Awaited<ReturnType<typeof getOidcClients>>,
				TError,
				TData
			>
		>;
		request?: SecondParameter<typeof customIdpInstance>;
	},
): Promise<QueryClient> => {
	const queryOptions = getGetOidcClientsSuspenseInfiniteQueryOptions(
		params,
		options,
	);

	await queryClient.prefetchInfiniteQuery(queryOptions);

	return queryClient;
};

/**
 * 새로운 OIDC 클라이언트를 등록합니다. Client ID는 고유해야 합니다.
 * @summary OIDC 클라이언트 등록
 */
export const createOidcClient = (
	createOidcClientDto: BodyType<CreateOidcClientDto>,
	options?: SecondParameter<typeof customIdpInstance>,
	signal?: AbortSignal,
) => {
	return customIdpInstance<CreateOidcClient201AllOf>(
		{
			url: `/api/v1/oidc-clients`,
			method: "POST",
			headers: { "Content-Type": "application/json" },
			data: createOidcClientDto,
			signal,
		},
		options,
	);
};

export const getCreateOidcClientMutationOptions = <
	TError = ErrorType<void>,
	TContext = unknown,
>(options?: {
	mutation?: UseMutationOptions<
		Awaited<ReturnType<typeof createOidcClient>>,
		TError,
		{ data: BodyType<CreateOidcClientDto> },
		TContext
	>;
	request?: SecondParameter<typeof customIdpInstance>;
}): UseMutationOptions<
	Awaited<ReturnType<typeof createOidcClient>>,
	TError,
	{ data: BodyType<CreateOidcClientDto> },
	TContext
> => {
	const mutationKey = ["createOidcClient"];
	const { mutation: mutationOptions, request: requestOptions } = options
		? options.mutation &&
			"mutationKey" in options.mutation &&
			options.mutation.mutationKey
			? options
			: { ...options, mutation: { ...options.mutation, mutationKey } }
		: { mutation: { mutationKey }, request: undefined };

	const mutationFn: MutationFunction<
		Awaited<ReturnType<typeof createOidcClient>>,
		{ data: BodyType<CreateOidcClientDto> }
	> = (props) => {
		const { data } = props ?? {};

		return createOidcClient(data, requestOptions);
	};

	return { mutationFn, ...mutationOptions };
};

export type CreateOidcClientMutationResult = NonNullable<
	Awaited<ReturnType<typeof createOidcClient>>
>;

export type CreateOidcClientMutationBody = BodyType<CreateOidcClientDto>;

export type CreateOidcClientMutationError = ErrorType<void>;

/**
 * @summary OIDC 클라이언트 등록
 */
export const useCreateOidcClient = <
	TError = ErrorType<void>,
	TContext = unknown,
>(
	options?: {
		mutation?: UseMutationOptions<
			Awaited<ReturnType<typeof createOidcClient>>,
			TError,
			{ data: BodyType<CreateOidcClientDto> },
			TContext
		>;
		request?: SecondParameter<typeof customIdpInstance>;
	},
	queryClient?: QueryClient,
): UseMutationResult<
	Awaited<ReturnType<typeof createOidcClient>>,
	TError,
	{ data: BodyType<CreateOidcClientDto> },
	TContext
> => {
	const mutationOptions = getCreateOidcClientMutationOptions(options);

	return useMutation(mutationOptions, queryClient);
};

/**
 * 특정 OIDC 클라이언트의 상세 정보를 조회합니다.
 * @summary OIDC 클라이언트 상세 조회
 */
export const getOidcClient = (
	oidcClientId: string,
	options?: SecondParameter<typeof customIdpInstance>,
	signal?: AbortSignal,
) => {
	return customIdpInstance<GetOidcClient200AllOf>(
		{ url: `/api/v1/oidc-clients/${oidcClientId}`, method: "GET", signal },
		options,
	);
};

export const getGetOidcClientQueryKey = (oidcClientId?: string) => {
	return [`/api/v1/oidc-clients/${oidcClientId}`] as const;
};

export const getGetOidcClientInfiniteQueryKey = (oidcClientId?: string) => {
	return ["infinite", `/api/v1/oidc-clients/${oidcClientId}`] as const;
};

export const getGetOidcClientQueryOptions = <
	TData = Awaited<ReturnType<typeof getOidcClient>>,
	TError = ErrorType<void>,
>(
	oidcClientId: string,
	options?: {
		query?: Partial<
			UseQueryOptions<Awaited<ReturnType<typeof getOidcClient>>, TError, TData>
		>;
		request?: SecondParameter<typeof customIdpInstance>;
	},
) => {
	const { query: queryOptions, request: requestOptions } = options ?? {};

	const queryKey =
		queryOptions?.queryKey ?? getGetOidcClientQueryKey(oidcClientId);

	const queryFn: QueryFunction<Awaited<ReturnType<typeof getOidcClient>>> = ({
		signal,
	}) => getOidcClient(oidcClientId, requestOptions, signal);

	return {
		queryKey,
		queryFn,
		enabled: !!oidcClientId,
		...queryOptions,
	} as UseQueryOptions<
		Awaited<ReturnType<typeof getOidcClient>>,
		TError,
		TData
	> & { queryKey: DataTag<QueryKey, TData, TError> };
};

export type GetOidcClientQueryResult = NonNullable<
	Awaited<ReturnType<typeof getOidcClient>>
>;

export type GetOidcClientQueryError = ErrorType<void>;

export function useGetOidcClient<
	TData = Awaited<ReturnType<typeof getOidcClient>>,
	TError = ErrorType<void>,
>(
	oidcClientId: string,
	options: {
		query: Partial<
			UseQueryOptions<Awaited<ReturnType<typeof getOidcClient>>, TError, TData>
		> &
			Pick<
				DefinedInitialDataOptions<
					Awaited<ReturnType<typeof getOidcClient>>,
					TError,
					Awaited<ReturnType<typeof getOidcClient>>
				>,
				"initialData"
			>;
		request?: SecondParameter<typeof customIdpInstance>;
	},
	queryClient?: QueryClient,
): DefinedUseQueryResult<TData, TError> & {
	queryKey: DataTag<QueryKey, TData, TError>;
};

export function useGetOidcClient<
	TData = Awaited<ReturnType<typeof getOidcClient>>,
	TError = ErrorType<void>,
>(
	oidcClientId: string,
	options?: {
		query?: Partial<
			UseQueryOptions<Awaited<ReturnType<typeof getOidcClient>>, TError, TData>
		> &
			Pick<
				UndefinedInitialDataOptions<
					Awaited<ReturnType<typeof getOidcClient>>,
					TError,
					Awaited<ReturnType<typeof getOidcClient>>
				>,
				"initialData"
			>;
		request?: SecondParameter<typeof customIdpInstance>;
	},
	queryClient?: QueryClient,
): UseQueryResult<TData, TError> & {
	queryKey: DataTag<QueryKey, TData, TError>;
};

export function useGetOidcClient<
	TData = Awaited<ReturnType<typeof getOidcClient>>,
	TError = ErrorType<void>,
>(
	oidcClientId: string,
	options?: {
		query?: Partial<
			UseQueryOptions<Awaited<ReturnType<typeof getOidcClient>>, TError, TData>
		>;
		request?: SecondParameter<typeof customIdpInstance>;
	},
	queryClient?: QueryClient,
): UseQueryResult<TData, TError> & {
	queryKey: DataTag<QueryKey, TData, TError>;
};

/**
 * @summary OIDC 클라이언트 상세 조회
 */

export function useGetOidcClient<
	TData = Awaited<ReturnType<typeof getOidcClient>>,
	TError = ErrorType<void>,
>(
	oidcClientId: string,
	options?: {
		query?: Partial<
			UseQueryOptions<Awaited<ReturnType<typeof getOidcClient>>, TError, TData>
		>;
		request?: SecondParameter<typeof customIdpInstance>;
	},
	queryClient?: QueryClient,
): UseQueryResult<TData, TError> & {
	queryKey: DataTag<QueryKey, TData, TError>;
} {
	const queryOptions = getGetOidcClientQueryOptions(oidcClientId, options);

	const query = useQuery(queryOptions, queryClient) as UseQueryResult<
		TData,
		TError
	> & { queryKey: DataTag<QueryKey, TData, TError> };

	query.queryKey = queryOptions.queryKey;

	return query;
}

/**
 * @summary OIDC 클라이언트 상세 조회
 */
export const prefetchGetOidcClientQuery = async <
	TData = Awaited<ReturnType<typeof getOidcClient>>,
	TError = ErrorType<void>,
>(
	queryClient: QueryClient,
	oidcClientId: string,
	options?: {
		query?: Partial<
			UseQueryOptions<Awaited<ReturnType<typeof getOidcClient>>, TError, TData>
		>;
		request?: SecondParameter<typeof customIdpInstance>;
	},
): Promise<QueryClient> => {
	const queryOptions = getGetOidcClientQueryOptions(oidcClientId, options);

	await queryClient.prefetchQuery(queryOptions);

	return queryClient;
};

export const getGetOidcClientSuspenseQueryOptions = <
	TData = Awaited<ReturnType<typeof getOidcClient>>,
	TError = ErrorType<void>,
>(
	oidcClientId: string,
	options?: {
		query?: Partial<
			UseSuspenseQueryOptions<
				Awaited<ReturnType<typeof getOidcClient>>,
				TError,
				TData
			>
		>;
		request?: SecondParameter<typeof customIdpInstance>;
	},
) => {
	const { query: queryOptions, request: requestOptions } = options ?? {};

	const queryKey =
		queryOptions?.queryKey ?? getGetOidcClientQueryKey(oidcClientId);

	const queryFn: QueryFunction<Awaited<ReturnType<typeof getOidcClient>>> = ({
		signal,
	}) => getOidcClient(oidcClientId, requestOptions, signal);

	return { queryKey, queryFn, ...queryOptions } as UseSuspenseQueryOptions<
		Awaited<ReturnType<typeof getOidcClient>>,
		TError,
		TData
	> & { queryKey: DataTag<QueryKey, TData, TError> };
};

export type GetOidcClientSuspenseQueryResult = NonNullable<
	Awaited<ReturnType<typeof getOidcClient>>
>;

export type GetOidcClientSuspenseQueryError = ErrorType<void>;

export function useGetOidcClientSuspense<
	TData = Awaited<ReturnType<typeof getOidcClient>>,
	TError = ErrorType<void>,
>(
	oidcClientId: string,
	options: {
		query: Partial<
			UseSuspenseQueryOptions<
				Awaited<ReturnType<typeof getOidcClient>>,
				TError,
				TData
			>
		>;
		request?: SecondParameter<typeof customIdpInstance>;
	},
	queryClient?: QueryClient,
): UseSuspenseQueryResult<TData, TError> & {
	queryKey: DataTag<QueryKey, TData, TError>;
};

export function useGetOidcClientSuspense<
	TData = Awaited<ReturnType<typeof getOidcClient>>,
	TError = ErrorType<void>,
>(
	oidcClientId: string,
	options?: {
		query?: Partial<
			UseSuspenseQueryOptions<
				Awaited<ReturnType<typeof getOidcClient>>,
				TError,
				TData
			>
		>;
		request?: SecondParameter<typeof customIdpInstance>;
	},
	queryClient?: QueryClient,
): UseSuspenseQueryResult<TData, TError> & {
	queryKey: DataTag<QueryKey, TData, TError>;
};

export function useGetOidcClientSuspense<
	TData = Awaited<ReturnType<typeof getOidcClient>>,
	TError = ErrorType<void>,
>(
	oidcClientId: string,
	options?: {
		query?: Partial<
			UseSuspenseQueryOptions<
				Awaited<ReturnType<typeof getOidcClient>>,
				TError,
				TData
			>
		>;
		request?: SecondParameter<typeof customIdpInstance>;
	},
	queryClient?: QueryClient,
): UseSuspenseQueryResult<TData, TError> & {
	queryKey: DataTag<QueryKey, TData, TError>;
};

/**
 * @summary OIDC 클라이언트 상세 조회
 */

export function useGetOidcClientSuspense<
	TData = Awaited<ReturnType<typeof getOidcClient>>,
	TError = ErrorType<void>,
>(
	oidcClientId: string,
	options?: {
		query?: Partial<
			UseSuspenseQueryOptions<
				Awaited<ReturnType<typeof getOidcClient>>,
				TError,
				TData
			>
		>;
		request?: SecondParameter<typeof customIdpInstance>;
	},
	queryClient?: QueryClient,
): UseSuspenseQueryResult<TData, TError> & {
	queryKey: DataTag<QueryKey, TData, TError>;
} {
	const queryOptions = getGetOidcClientSuspenseQueryOptions(
		oidcClientId,
		options,
	);

	const query = useSuspenseQuery(
		queryOptions,
		queryClient,
	) as UseSuspenseQueryResult<TData, TError> & {
		queryKey: DataTag<QueryKey, TData, TError>;
	};

	query.queryKey = queryOptions.queryKey;

	return query;
}

export const getGetOidcClientSuspenseInfiniteQueryOptions = <
	TData = InfiniteData<Awaited<ReturnType<typeof getOidcClient>>>,
	TError = ErrorType<void>,
>(
	oidcClientId: string,
	options?: {
		query?: Partial<
			UseSuspenseInfiniteQueryOptions<
				Awaited<ReturnType<typeof getOidcClient>>,
				TError,
				TData
			>
		>;
		request?: SecondParameter<typeof customIdpInstance>;
	},
) => {
	const { query: queryOptions, request: requestOptions } = options ?? {};

	const queryKey =
		queryOptions?.queryKey ?? getGetOidcClientInfiniteQueryKey(oidcClientId);

	const queryFn: QueryFunction<Awaited<ReturnType<typeof getOidcClient>>> = ({
		signal,
	}) => getOidcClient(oidcClientId, requestOptions, signal);

	return {
		queryKey,
		queryFn,
		...queryOptions,
	} as UseSuspenseInfiniteQueryOptions<
		Awaited<ReturnType<typeof getOidcClient>>,
		TError,
		TData
	> & { queryKey: DataTag<QueryKey, TData, TError> };
};

export type GetOidcClientSuspenseInfiniteQueryResult = NonNullable<
	Awaited<ReturnType<typeof getOidcClient>>
>;

export type GetOidcClientSuspenseInfiniteQueryError = ErrorType<void>;

export function useGetOidcClientSuspenseInfinite<
	TData = InfiniteData<Awaited<ReturnType<typeof getOidcClient>>>,
	TError = ErrorType<void>,
>(
	oidcClientId: string,
	options: {
		query: Partial<
			UseSuspenseInfiniteQueryOptions<
				Awaited<ReturnType<typeof getOidcClient>>,
				TError,
				TData
			>
		>;
		request?: SecondParameter<typeof customIdpInstance>;
	},
	queryClient?: QueryClient,
): UseSuspenseInfiniteQueryResult<TData, TError> & {
	queryKey: DataTag<QueryKey, TData, TError>;
};

export function useGetOidcClientSuspenseInfinite<
	TData = InfiniteData<Awaited<ReturnType<typeof getOidcClient>>>,
	TError = ErrorType<void>,
>(
	oidcClientId: string,
	options?: {
		query?: Partial<
			UseSuspenseInfiniteQueryOptions<
				Awaited<ReturnType<typeof getOidcClient>>,
				TError,
				TData
			>
		>;
		request?: SecondParameter<typeof customIdpInstance>;
	},
	queryClient?: QueryClient,
): UseSuspenseInfiniteQueryResult<TData, TError> & {
	queryKey: DataTag<QueryKey, TData, TError>;
};

export function useGetOidcClientSuspenseInfinite<
	TData = InfiniteData<Awaited<ReturnType<typeof getOidcClient>>>,
	TError = ErrorType<void>,
>(
	oidcClientId: string,
	options?: {
		query?: Partial<
			UseSuspenseInfiniteQueryOptions<
				Awaited<ReturnType<typeof getOidcClient>>,
				TError,
				TData
			>
		>;
		request?: SecondParameter<typeof customIdpInstance>;
	},
	queryClient?: QueryClient,
): UseSuspenseInfiniteQueryResult<TData, TError> & {
	queryKey: DataTag<QueryKey, TData, TError>;
};

/**
 * @summary OIDC 클라이언트 상세 조회
 */

export function useGetOidcClientSuspenseInfinite<
	TData = InfiniteData<Awaited<ReturnType<typeof getOidcClient>>>,
	TError = ErrorType<void>,
>(
	oidcClientId: string,
	options?: {
		query?: Partial<
			UseSuspenseInfiniteQueryOptions<
				Awaited<ReturnType<typeof getOidcClient>>,
				TError,
				TData
			>
		>;
		request?: SecondParameter<typeof customIdpInstance>;
	},
	queryClient?: QueryClient,
): UseSuspenseInfiniteQueryResult<TData, TError> & {
	queryKey: DataTag<QueryKey, TData, TError>;
} {
	const queryOptions = getGetOidcClientSuspenseInfiniteQueryOptions(
		oidcClientId,
		options,
	);

	const query = useSuspenseInfiniteQuery(
		queryOptions,
		queryClient,
	) as UseSuspenseInfiniteQueryResult<TData, TError> & {
		queryKey: DataTag<QueryKey, TData, TError>;
	};

	query.queryKey = queryOptions.queryKey;

	return query;
}

/**
 * @summary OIDC 클라이언트 상세 조회
 */
export const prefetchGetOidcClientInfiniteQuery = async <
	TData = Awaited<ReturnType<typeof getOidcClient>>,
	TError = ErrorType<void>,
>(
	queryClient: QueryClient,
	oidcClientId: string,
	options?: {
		query?: Partial<
			UseSuspenseInfiniteQueryOptions<
				Awaited<ReturnType<typeof getOidcClient>>,
				TError,
				TData
			>
		>;
		request?: SecondParameter<typeof customIdpInstance>;
	},
): Promise<QueryClient> => {
	const queryOptions = getGetOidcClientSuspenseInfiniteQueryOptions(
		oidcClientId,
		options,
	);

	await queryClient.prefetchInfiniteQuery(queryOptions);

	return queryClient;
};

/**
 * OIDC 클라이언트 정보를 수정합니다. Client ID는 수정할 수 없습니다.
 * @summary OIDC 클라이언트 수정
 */
export const updateOidcClient = (
	oidcClientId: string,
	updateOidcClientDto: BodyType<UpdateOidcClientDto>,
	options?: SecondParameter<typeof customIdpInstance>,
) => {
	return customIdpInstance<UpdateOidcClient200AllOf>(
		{
			url: `/api/v1/oidc-clients/${oidcClientId}`,
			method: "PATCH",
			headers: { "Content-Type": "application/json" },
			data: updateOidcClientDto,
		},
		options,
	);
};

export const getUpdateOidcClientMutationOptions = <
	TError = ErrorType<void>,
	TContext = unknown,
>(options?: {
	mutation?: UseMutationOptions<
		Awaited<ReturnType<typeof updateOidcClient>>,
		TError,
		{ oidcClientId: string; data: BodyType<UpdateOidcClientDto> },
		TContext
	>;
	request?: SecondParameter<typeof customIdpInstance>;
}): UseMutationOptions<
	Awaited<ReturnType<typeof updateOidcClient>>,
	TError,
	{ oidcClientId: string; data: BodyType<UpdateOidcClientDto> },
	TContext
> => {
	const mutationKey = ["updateOidcClient"];
	const { mutation: mutationOptions, request: requestOptions } = options
		? options.mutation &&
			"mutationKey" in options.mutation &&
			options.mutation.mutationKey
			? options
			: { ...options, mutation: { ...options.mutation, mutationKey } }
		: { mutation: { mutationKey }, request: undefined };

	const mutationFn: MutationFunction<
		Awaited<ReturnType<typeof updateOidcClient>>,
		{ oidcClientId: string; data: BodyType<UpdateOidcClientDto> }
	> = (props) => {
		const { oidcClientId, data } = props ?? {};

		return updateOidcClient(oidcClientId, data, requestOptions);
	};

	return { mutationFn, ...mutationOptions };
};

export type UpdateOidcClientMutationResult = NonNullable<
	Awaited<ReturnType<typeof updateOidcClient>>
>;

export type UpdateOidcClientMutationBody = BodyType<UpdateOidcClientDto>;

export type UpdateOidcClientMutationError = ErrorType<void>;

/**
 * @summary OIDC 클라이언트 수정
 */
export const useUpdateOidcClient = <
	TError = ErrorType<void>,
	TContext = unknown,
>(
	options?: {
		mutation?: UseMutationOptions<
			Awaited<ReturnType<typeof updateOidcClient>>,
			TError,
			{ oidcClientId: string; data: BodyType<UpdateOidcClientDto> },
			TContext
		>;
		request?: SecondParameter<typeof customIdpInstance>;
	},
	queryClient?: QueryClient,
): UseMutationResult<
	Awaited<ReturnType<typeof updateOidcClient>>,
	TError,
	{ oidcClientId: string; data: BodyType<UpdateOidcClientDto> },
	TContext
> => {
	const mutationOptions = getUpdateOidcClientMutationOptions(options);

	return useMutation(mutationOptions, queryClient);
};

/**
 * OIDC 클라이언트를 삭제합니다 (소프트 삭제).
 * @summary OIDC 클라이언트 삭제
 */
export const deleteOidcClient = (
	oidcClientId: string,
	options?: SecondParameter<typeof customIdpInstance>,
) => {
	return customIdpInstance<unknown>(
		{ url: `/api/v1/oidc-clients/${oidcClientId}`, method: "DELETE" },
		options,
	);
};

export const getDeleteOidcClientMutationOptions = <
	TError = ErrorType<void>,
	TContext = unknown,
>(options?: {
	mutation?: UseMutationOptions<
		Awaited<ReturnType<typeof deleteOidcClient>>,
		TError,
		{ oidcClientId: string },
		TContext
	>;
	request?: SecondParameter<typeof customIdpInstance>;
}): UseMutationOptions<
	Awaited<ReturnType<typeof deleteOidcClient>>,
	TError,
	{ oidcClientId: string },
	TContext
> => {
	const mutationKey = ["deleteOidcClient"];
	const { mutation: mutationOptions, request: requestOptions } = options
		? options.mutation &&
			"mutationKey" in options.mutation &&
			options.mutation.mutationKey
			? options
			: { ...options, mutation: { ...options.mutation, mutationKey } }
		: { mutation: { mutationKey }, request: undefined };

	const mutationFn: MutationFunction<
		Awaited<ReturnType<typeof deleteOidcClient>>,
		{ oidcClientId: string }
	> = (props) => {
		const { oidcClientId } = props ?? {};

		return deleteOidcClient(oidcClientId, requestOptions);
	};

	return { mutationFn, ...mutationOptions };
};

export type DeleteOidcClientMutationResult = NonNullable<
	Awaited<ReturnType<typeof deleteOidcClient>>
>;

export type DeleteOidcClientMutationError = ErrorType<void>;

/**
 * @summary OIDC 클라이언트 삭제
 */
export const useDeleteOidcClient = <
	TError = ErrorType<void>,
	TContext = unknown,
>(
	options?: {
		mutation?: UseMutationOptions<
			Awaited<ReturnType<typeof deleteOidcClient>>,
			TError,
			{ oidcClientId: string },
			TContext
		>;
		request?: SecondParameter<typeof customIdpInstance>;
	},
	queryClient?: QueryClient,
): UseMutationResult<
	Awaited<ReturnType<typeof deleteOidcClient>>,
	TError,
	{ oidcClientId: string },
	TContext
> => {
	const mutationOptions = getDeleteOidcClientMutationOptions(options);

	return useMutation(mutationOptions, queryClient);
};

/**
 * OIDC 클라이언트의 활성 상태를 반전시킵니다.
 * @summary OIDC 클라이언트 활성/비활성 토글
 */
export const toggleActiveOidcClient = (
	oidcClientId: string,
	options?: SecondParameter<typeof customIdpInstance>,
) => {
	return customIdpInstance<ToggleActiveOidcClient200AllOf>(
		{
			url: `/api/v1/oidc-clients/${oidcClientId}/toggle-active`,
			method: "PATCH",
		},
		options,
	);
};

export const getToggleActiveOidcClientMutationOptions = <
	TError = ErrorType<void>,
	TContext = unknown,
>(options?: {
	mutation?: UseMutationOptions<
		Awaited<ReturnType<typeof toggleActiveOidcClient>>,
		TError,
		{ oidcClientId: string },
		TContext
	>;
	request?: SecondParameter<typeof customIdpInstance>;
}): UseMutationOptions<
	Awaited<ReturnType<typeof toggleActiveOidcClient>>,
	TError,
	{ oidcClientId: string },
	TContext
> => {
	const mutationKey = ["toggleActiveOidcClient"];
	const { mutation: mutationOptions, request: requestOptions } = options
		? options.mutation &&
			"mutationKey" in options.mutation &&
			options.mutation.mutationKey
			? options
			: { ...options, mutation: { ...options.mutation, mutationKey } }
		: { mutation: { mutationKey }, request: undefined };

	const mutationFn: MutationFunction<
		Awaited<ReturnType<typeof toggleActiveOidcClient>>,
		{ oidcClientId: string }
	> = (props) => {
		const { oidcClientId } = props ?? {};

		return toggleActiveOidcClient(oidcClientId, requestOptions);
	};

	return { mutationFn, ...mutationOptions };
};

export type ToggleActiveOidcClientMutationResult = NonNullable<
	Awaited<ReturnType<typeof toggleActiveOidcClient>>
>;

export type ToggleActiveOidcClientMutationError = ErrorType<void>;

/**
 * @summary OIDC 클라이언트 활성/비활성 토글
 */
export const useToggleActiveOidcClient = <
	TError = ErrorType<void>,
	TContext = unknown,
>(
	options?: {
		mutation?: UseMutationOptions<
			Awaited<ReturnType<typeof toggleActiveOidcClient>>,
			TError,
			{ oidcClientId: string },
			TContext
		>;
		request?: SecondParameter<typeof customIdpInstance>;
	},
	queryClient?: QueryClient,
): UseMutationResult<
	Awaited<ReturnType<typeof toggleActiveOidcClient>>,
	TError,
	{ oidcClientId: string },
	TContext
> => {
	const mutationOptions = getToggleActiveOidcClientMutationOptions(options);

	return useMutation(mutationOptions, queryClient);
};
