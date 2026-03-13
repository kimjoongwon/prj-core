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

import type { GetIdpAccount200AllOf } from "../../idp-model/getIdpAccount200AllOf";
import type { GetIdpAccounts200AllOf } from "../../idp-model/getIdpAccounts200AllOf";
import type { GetIdpAccountsParams } from "../../idp-model/getIdpAccountsParams";
import type { IdpAccountDto } from "../../idp-model/idpAccountDto";
import type { ToggleIdpAccountActive200AllOf } from "../../idp-model/toggleIdpAccountActive200AllOf";
export type { GetIdpAccount200AllOf };
export type { GetIdpAccounts200AllOf };
export type { GetIdpAccountsParams };
export type { IdpAccountDto };
export type { ToggleIdpAccountActive200AllOf };
import type { BodyType, ErrorType } from "../../libs/customIdpAxios";
import { customIdpInstance } from "../../libs/customIdpAxios";

type SecondParameter<T extends (...args: never) => unknown> = Parameters<T>[1];

/**
 * IDP 계정 목록을 보안 정보와 함께 조회합니다.
 * @summary IDP 계정 목록 조회
 */
export const getIdpAccounts = (
	params?: GetIdpAccountsParams,
	options?: SecondParameter<typeof customIdpInstance>,
	signal?: AbortSignal,
) => {
	return customIdpInstance<GetIdpAccounts200AllOf>(
		{ url: `/api/v1/idp/accounts`, method: "GET", params, signal },
		options,
	);
};

export const getGetIdpAccountsQueryKey = (params?: GetIdpAccountsParams) => {
	return [`/api/v1/idp/accounts`, ...(params ? [params] : [])] as const;
};

export const getGetIdpAccountsInfiniteQueryKey = (
	params?: GetIdpAccountsParams,
) => {
	return [
		"infinite",
		`/api/v1/idp/accounts`,
		...(params ? [params] : []),
	] as const;
};

export const getGetIdpAccountsQueryOptions = <
	TData = Awaited<ReturnType<typeof getIdpAccounts>>,
	TError = ErrorType<void>,
>(
	params?: GetIdpAccountsParams,
	options?: {
		query?: Partial<
			UseQueryOptions<Awaited<ReturnType<typeof getIdpAccounts>>, TError, TData>
		>;
		request?: SecondParameter<typeof customIdpInstance>;
	},
) => {
	const { query: queryOptions, request: requestOptions } = options ?? {};

	const queryKey = queryOptions?.queryKey ?? getGetIdpAccountsQueryKey(params);

	const queryFn: QueryFunction<Awaited<ReturnType<typeof getIdpAccounts>>> = ({
		signal,
	}) => getIdpAccounts(params, requestOptions, signal);

	return { queryKey, queryFn, ...queryOptions } as UseQueryOptions<
		Awaited<ReturnType<typeof getIdpAccounts>>,
		TError,
		TData
	> & { queryKey: DataTag<QueryKey, TData, TError> };
};

export type GetIdpAccountsQueryResult = NonNullable<
	Awaited<ReturnType<typeof getIdpAccounts>>
>;

export type GetIdpAccountsQueryError = ErrorType<void>;

export function useGetIdpAccounts<
	TData = Awaited<ReturnType<typeof getIdpAccounts>>,
	TError = ErrorType<void>,
>(
	params: undefined | GetIdpAccountsParams,
	options: {
		query: Partial<
			UseQueryOptions<Awaited<ReturnType<typeof getIdpAccounts>>, TError, TData>
		> &
			Pick<
				DefinedInitialDataOptions<
					Awaited<ReturnType<typeof getIdpAccounts>>,
					TError,
					Awaited<ReturnType<typeof getIdpAccounts>>
				>,
				"initialData"
			>;
		request?: SecondParameter<typeof customIdpInstance>;
	},
	queryClient?: QueryClient,
): DefinedUseQueryResult<TData, TError> & {
	queryKey: DataTag<QueryKey, TData, TError>;
};

export function useGetIdpAccounts<
	TData = Awaited<ReturnType<typeof getIdpAccounts>>,
	TError = ErrorType<void>,
>(
	params?: GetIdpAccountsParams,
	options?: {
		query?: Partial<
			UseQueryOptions<Awaited<ReturnType<typeof getIdpAccounts>>, TError, TData>
		> &
			Pick<
				UndefinedInitialDataOptions<
					Awaited<ReturnType<typeof getIdpAccounts>>,
					TError,
					Awaited<ReturnType<typeof getIdpAccounts>>
				>,
				"initialData"
			>;
		request?: SecondParameter<typeof customIdpInstance>;
	},
	queryClient?: QueryClient,
): UseQueryResult<TData, TError> & {
	queryKey: DataTag<QueryKey, TData, TError>;
};

export function useGetIdpAccounts<
	TData = Awaited<ReturnType<typeof getIdpAccounts>>,
	TError = ErrorType<void>,
>(
	params?: GetIdpAccountsParams,
	options?: {
		query?: Partial<
			UseQueryOptions<Awaited<ReturnType<typeof getIdpAccounts>>, TError, TData>
		>;
		request?: SecondParameter<typeof customIdpInstance>;
	},
	queryClient?: QueryClient,
): UseQueryResult<TData, TError> & {
	queryKey: DataTag<QueryKey, TData, TError>;
};

/**
 * @summary IDP 계정 목록 조회
 */

export function useGetIdpAccounts<
	TData = Awaited<ReturnType<typeof getIdpAccounts>>,
	TError = ErrorType<void>,
>(
	params?: GetIdpAccountsParams,
	options?: {
		query?: Partial<
			UseQueryOptions<Awaited<ReturnType<typeof getIdpAccounts>>, TError, TData>
		>;
		request?: SecondParameter<typeof customIdpInstance>;
	},
	queryClient?: QueryClient,
): UseQueryResult<TData, TError> & {
	queryKey: DataTag<QueryKey, TData, TError>;
} {
	const queryOptions = getGetIdpAccountsQueryOptions(params, options);

	const query = useQuery(queryOptions, queryClient) as UseQueryResult<
		TData,
		TError
	> & { queryKey: DataTag<QueryKey, TData, TError> };

	query.queryKey = queryOptions.queryKey;

	return query;
}

/**
 * @summary IDP 계정 목록 조회
 */
export const prefetchGetIdpAccountsQuery = async <
	TData = Awaited<ReturnType<typeof getIdpAccounts>>,
	TError = ErrorType<void>,
>(
	queryClient: QueryClient,
	params?: GetIdpAccountsParams,
	options?: {
		query?: Partial<
			UseQueryOptions<Awaited<ReturnType<typeof getIdpAccounts>>, TError, TData>
		>;
		request?: SecondParameter<typeof customIdpInstance>;
	},
): Promise<QueryClient> => {
	const queryOptions = getGetIdpAccountsQueryOptions(params, options);

	await queryClient.prefetchQuery(queryOptions);

	return queryClient;
};

export const getGetIdpAccountsSuspenseQueryOptions = <
	TData = Awaited<ReturnType<typeof getIdpAccounts>>,
	TError = ErrorType<void>,
>(
	params?: GetIdpAccountsParams,
	options?: {
		query?: Partial<
			UseSuspenseQueryOptions<
				Awaited<ReturnType<typeof getIdpAccounts>>,
				TError,
				TData
			>
		>;
		request?: SecondParameter<typeof customIdpInstance>;
	},
) => {
	const { query: queryOptions, request: requestOptions } = options ?? {};

	const queryKey = queryOptions?.queryKey ?? getGetIdpAccountsQueryKey(params);

	const queryFn: QueryFunction<Awaited<ReturnType<typeof getIdpAccounts>>> = ({
		signal,
	}) => getIdpAccounts(params, requestOptions, signal);

	return { queryKey, queryFn, ...queryOptions } as UseSuspenseQueryOptions<
		Awaited<ReturnType<typeof getIdpAccounts>>,
		TError,
		TData
	> & { queryKey: DataTag<QueryKey, TData, TError> };
};

export type GetIdpAccountsSuspenseQueryResult = NonNullable<
	Awaited<ReturnType<typeof getIdpAccounts>>
>;

export type GetIdpAccountsSuspenseQueryError = ErrorType<void>;

export function useGetIdpAccountsSuspense<
	TData = Awaited<ReturnType<typeof getIdpAccounts>>,
	TError = ErrorType<void>,
>(
	params: undefined | GetIdpAccountsParams,
	options: {
		query: Partial<
			UseSuspenseQueryOptions<
				Awaited<ReturnType<typeof getIdpAccounts>>,
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

export function useGetIdpAccountsSuspense<
	TData = Awaited<ReturnType<typeof getIdpAccounts>>,
	TError = ErrorType<void>,
>(
	params?: GetIdpAccountsParams,
	options?: {
		query?: Partial<
			UseSuspenseQueryOptions<
				Awaited<ReturnType<typeof getIdpAccounts>>,
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

export function useGetIdpAccountsSuspense<
	TData = Awaited<ReturnType<typeof getIdpAccounts>>,
	TError = ErrorType<void>,
>(
	params?: GetIdpAccountsParams,
	options?: {
		query?: Partial<
			UseSuspenseQueryOptions<
				Awaited<ReturnType<typeof getIdpAccounts>>,
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
 * @summary IDP 계정 목록 조회
 */

export function useGetIdpAccountsSuspense<
	TData = Awaited<ReturnType<typeof getIdpAccounts>>,
	TError = ErrorType<void>,
>(
	params?: GetIdpAccountsParams,
	options?: {
		query?: Partial<
			UseSuspenseQueryOptions<
				Awaited<ReturnType<typeof getIdpAccounts>>,
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
	const queryOptions = getGetIdpAccountsSuspenseQueryOptions(params, options);

	const query = useSuspenseQuery(
		queryOptions,
		queryClient,
	) as UseSuspenseQueryResult<TData, TError> & {
		queryKey: DataTag<QueryKey, TData, TError>;
	};

	query.queryKey = queryOptions.queryKey;

	return query;
}

export const getGetIdpAccountsSuspenseInfiniteQueryOptions = <
	TData = InfiniteData<Awaited<ReturnType<typeof getIdpAccounts>>>,
	TError = ErrorType<void>,
>(
	params?: GetIdpAccountsParams,
	options?: {
		query?: Partial<
			UseSuspenseInfiniteQueryOptions<
				Awaited<ReturnType<typeof getIdpAccounts>>,
				TError,
				TData
			>
		>;
		request?: SecondParameter<typeof customIdpInstance>;
	},
) => {
	const { query: queryOptions, request: requestOptions } = options ?? {};

	const queryKey =
		queryOptions?.queryKey ?? getGetIdpAccountsInfiniteQueryKey(params);

	const queryFn: QueryFunction<Awaited<ReturnType<typeof getIdpAccounts>>> = ({
		signal,
	}) => getIdpAccounts(params, requestOptions, signal);

	return {
		queryKey,
		queryFn,
		...queryOptions,
	} as UseSuspenseInfiniteQueryOptions<
		Awaited<ReturnType<typeof getIdpAccounts>>,
		TError,
		TData
	> & { queryKey: DataTag<QueryKey, TData, TError> };
};

export type GetIdpAccountsSuspenseInfiniteQueryResult = NonNullable<
	Awaited<ReturnType<typeof getIdpAccounts>>
>;

export type GetIdpAccountsSuspenseInfiniteQueryError = ErrorType<void>;

export function useGetIdpAccountsSuspenseInfinite<
	TData = InfiniteData<Awaited<ReturnType<typeof getIdpAccounts>>>,
	TError = ErrorType<void>,
>(
	params: undefined | GetIdpAccountsParams,
	options: {
		query: Partial<
			UseSuspenseInfiniteQueryOptions<
				Awaited<ReturnType<typeof getIdpAccounts>>,
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

export function useGetIdpAccountsSuspenseInfinite<
	TData = InfiniteData<Awaited<ReturnType<typeof getIdpAccounts>>>,
	TError = ErrorType<void>,
>(
	params?: GetIdpAccountsParams,
	options?: {
		query?: Partial<
			UseSuspenseInfiniteQueryOptions<
				Awaited<ReturnType<typeof getIdpAccounts>>,
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

export function useGetIdpAccountsSuspenseInfinite<
	TData = InfiniteData<Awaited<ReturnType<typeof getIdpAccounts>>>,
	TError = ErrorType<void>,
>(
	params?: GetIdpAccountsParams,
	options?: {
		query?: Partial<
			UseSuspenseInfiniteQueryOptions<
				Awaited<ReturnType<typeof getIdpAccounts>>,
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
 * @summary IDP 계정 목록 조회
 */

export function useGetIdpAccountsSuspenseInfinite<
	TData = InfiniteData<Awaited<ReturnType<typeof getIdpAccounts>>>,
	TError = ErrorType<void>,
>(
	params?: GetIdpAccountsParams,
	options?: {
		query?: Partial<
			UseSuspenseInfiniteQueryOptions<
				Awaited<ReturnType<typeof getIdpAccounts>>,
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
	const queryOptions = getGetIdpAccountsSuspenseInfiniteQueryOptions(
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
 * @summary IDP 계정 목록 조회
 */
export const prefetchGetIdpAccountsInfiniteQuery = async <
	TData = Awaited<ReturnType<typeof getIdpAccounts>>,
	TError = ErrorType<void>,
>(
	queryClient: QueryClient,
	params?: GetIdpAccountsParams,
	options?: {
		query?: Partial<
			UseSuspenseInfiniteQueryOptions<
				Awaited<ReturnType<typeof getIdpAccounts>>,
				TError,
				TData
			>
		>;
		request?: SecondParameter<typeof customIdpInstance>;
	},
): Promise<QueryClient> => {
	const queryOptions = getGetIdpAccountsSuspenseInfiniteQueryOptions(
		params,
		options,
	);

	await queryClient.prefetchInfiniteQuery(queryOptions);

	return queryClient;
};

/**
 * 계정의 보안 정보와 최근 감사 로그를 함께 조회합니다.
 * @summary IDP 계정 상세 조회
 */
export const getIdpAccount = (
	userId: string,
	options?: SecondParameter<typeof customIdpInstance>,
	signal?: AbortSignal,
) => {
	return customIdpInstance<GetIdpAccount200AllOf>(
		{ url: `/api/v1/idp/accounts/${userId}`, method: "GET", signal },
		options,
	);
};

export const getGetIdpAccountQueryKey = (userId?: string) => {
	return [`/api/v1/idp/accounts/${userId}`] as const;
};

export const getGetIdpAccountInfiniteQueryKey = (userId?: string) => {
	return ["infinite", `/api/v1/idp/accounts/${userId}`] as const;
};

export const getGetIdpAccountQueryOptions = <
	TData = Awaited<ReturnType<typeof getIdpAccount>>,
	TError = ErrorType<void>,
>(
	userId: string,
	options?: {
		query?: Partial<
			UseQueryOptions<Awaited<ReturnType<typeof getIdpAccount>>, TError, TData>
		>;
		request?: SecondParameter<typeof customIdpInstance>;
	},
) => {
	const { query: queryOptions, request: requestOptions } = options ?? {};

	const queryKey = queryOptions?.queryKey ?? getGetIdpAccountQueryKey(userId);

	const queryFn: QueryFunction<Awaited<ReturnType<typeof getIdpAccount>>> = ({
		signal,
	}) => getIdpAccount(userId, requestOptions, signal);

	return {
		queryKey,
		queryFn,
		enabled: !!userId,
		...queryOptions,
	} as UseQueryOptions<
		Awaited<ReturnType<typeof getIdpAccount>>,
		TError,
		TData
	> & { queryKey: DataTag<QueryKey, TData, TError> };
};

export type GetIdpAccountQueryResult = NonNullable<
	Awaited<ReturnType<typeof getIdpAccount>>
>;

export type GetIdpAccountQueryError = ErrorType<void>;

export function useGetIdpAccount<
	TData = Awaited<ReturnType<typeof getIdpAccount>>,
	TError = ErrorType<void>,
>(
	userId: string,
	options: {
		query: Partial<
			UseQueryOptions<Awaited<ReturnType<typeof getIdpAccount>>, TError, TData>
		> &
			Pick<
				DefinedInitialDataOptions<
					Awaited<ReturnType<typeof getIdpAccount>>,
					TError,
					Awaited<ReturnType<typeof getIdpAccount>>
				>,
				"initialData"
			>;
		request?: SecondParameter<typeof customIdpInstance>;
	},
	queryClient?: QueryClient,
): DefinedUseQueryResult<TData, TError> & {
	queryKey: DataTag<QueryKey, TData, TError>;
};

export function useGetIdpAccount<
	TData = Awaited<ReturnType<typeof getIdpAccount>>,
	TError = ErrorType<void>,
>(
	userId: string,
	options?: {
		query?: Partial<
			UseQueryOptions<Awaited<ReturnType<typeof getIdpAccount>>, TError, TData>
		> &
			Pick<
				UndefinedInitialDataOptions<
					Awaited<ReturnType<typeof getIdpAccount>>,
					TError,
					Awaited<ReturnType<typeof getIdpAccount>>
				>,
				"initialData"
			>;
		request?: SecondParameter<typeof customIdpInstance>;
	},
	queryClient?: QueryClient,
): UseQueryResult<TData, TError> & {
	queryKey: DataTag<QueryKey, TData, TError>;
};

export function useGetIdpAccount<
	TData = Awaited<ReturnType<typeof getIdpAccount>>,
	TError = ErrorType<void>,
>(
	userId: string,
	options?: {
		query?: Partial<
			UseQueryOptions<Awaited<ReturnType<typeof getIdpAccount>>, TError, TData>
		>;
		request?: SecondParameter<typeof customIdpInstance>;
	},
	queryClient?: QueryClient,
): UseQueryResult<TData, TError> & {
	queryKey: DataTag<QueryKey, TData, TError>;
};

/**
 * @summary IDP 계정 상세 조회
 */

export function useGetIdpAccount<
	TData = Awaited<ReturnType<typeof getIdpAccount>>,
	TError = ErrorType<void>,
>(
	userId: string,
	options?: {
		query?: Partial<
			UseQueryOptions<Awaited<ReturnType<typeof getIdpAccount>>, TError, TData>
		>;
		request?: SecondParameter<typeof customIdpInstance>;
	},
	queryClient?: QueryClient,
): UseQueryResult<TData, TError> & {
	queryKey: DataTag<QueryKey, TData, TError>;
} {
	const queryOptions = getGetIdpAccountQueryOptions(userId, options);

	const query = useQuery(queryOptions, queryClient) as UseQueryResult<
		TData,
		TError
	> & { queryKey: DataTag<QueryKey, TData, TError> };

	query.queryKey = queryOptions.queryKey;

	return query;
}

/**
 * @summary IDP 계정 상세 조회
 */
export const prefetchGetIdpAccountQuery = async <
	TData = Awaited<ReturnType<typeof getIdpAccount>>,
	TError = ErrorType<void>,
>(
	queryClient: QueryClient,
	userId: string,
	options?: {
		query?: Partial<
			UseQueryOptions<Awaited<ReturnType<typeof getIdpAccount>>, TError, TData>
		>;
		request?: SecondParameter<typeof customIdpInstance>;
	},
): Promise<QueryClient> => {
	const queryOptions = getGetIdpAccountQueryOptions(userId, options);

	await queryClient.prefetchQuery(queryOptions);

	return queryClient;
};

export const getGetIdpAccountSuspenseQueryOptions = <
	TData = Awaited<ReturnType<typeof getIdpAccount>>,
	TError = ErrorType<void>,
>(
	userId: string,
	options?: {
		query?: Partial<
			UseSuspenseQueryOptions<
				Awaited<ReturnType<typeof getIdpAccount>>,
				TError,
				TData
			>
		>;
		request?: SecondParameter<typeof customIdpInstance>;
	},
) => {
	const { query: queryOptions, request: requestOptions } = options ?? {};

	const queryKey = queryOptions?.queryKey ?? getGetIdpAccountQueryKey(userId);

	const queryFn: QueryFunction<Awaited<ReturnType<typeof getIdpAccount>>> = ({
		signal,
	}) => getIdpAccount(userId, requestOptions, signal);

	return { queryKey, queryFn, ...queryOptions } as UseSuspenseQueryOptions<
		Awaited<ReturnType<typeof getIdpAccount>>,
		TError,
		TData
	> & { queryKey: DataTag<QueryKey, TData, TError> };
};

export type GetIdpAccountSuspenseQueryResult = NonNullable<
	Awaited<ReturnType<typeof getIdpAccount>>
>;

export type GetIdpAccountSuspenseQueryError = ErrorType<void>;

export function useGetIdpAccountSuspense<
	TData = Awaited<ReturnType<typeof getIdpAccount>>,
	TError = ErrorType<void>,
>(
	userId: string,
	options: {
		query: Partial<
			UseSuspenseQueryOptions<
				Awaited<ReturnType<typeof getIdpAccount>>,
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

export function useGetIdpAccountSuspense<
	TData = Awaited<ReturnType<typeof getIdpAccount>>,
	TError = ErrorType<void>,
>(
	userId: string,
	options?: {
		query?: Partial<
			UseSuspenseQueryOptions<
				Awaited<ReturnType<typeof getIdpAccount>>,
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

export function useGetIdpAccountSuspense<
	TData = Awaited<ReturnType<typeof getIdpAccount>>,
	TError = ErrorType<void>,
>(
	userId: string,
	options?: {
		query?: Partial<
			UseSuspenseQueryOptions<
				Awaited<ReturnType<typeof getIdpAccount>>,
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
 * @summary IDP 계정 상세 조회
 */

export function useGetIdpAccountSuspense<
	TData = Awaited<ReturnType<typeof getIdpAccount>>,
	TError = ErrorType<void>,
>(
	userId: string,
	options?: {
		query?: Partial<
			UseSuspenseQueryOptions<
				Awaited<ReturnType<typeof getIdpAccount>>,
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
	const queryOptions = getGetIdpAccountSuspenseQueryOptions(userId, options);

	const query = useSuspenseQuery(
		queryOptions,
		queryClient,
	) as UseSuspenseQueryResult<TData, TError> & {
		queryKey: DataTag<QueryKey, TData, TError>;
	};

	query.queryKey = queryOptions.queryKey;

	return query;
}

export const getGetIdpAccountSuspenseInfiniteQueryOptions = <
	TData = InfiniteData<Awaited<ReturnType<typeof getIdpAccount>>>,
	TError = ErrorType<void>,
>(
	userId: string,
	options?: {
		query?: Partial<
			UseSuspenseInfiniteQueryOptions<
				Awaited<ReturnType<typeof getIdpAccount>>,
				TError,
				TData
			>
		>;
		request?: SecondParameter<typeof customIdpInstance>;
	},
) => {
	const { query: queryOptions, request: requestOptions } = options ?? {};

	const queryKey =
		queryOptions?.queryKey ?? getGetIdpAccountInfiniteQueryKey(userId);

	const queryFn: QueryFunction<Awaited<ReturnType<typeof getIdpAccount>>> = ({
		signal,
	}) => getIdpAccount(userId, requestOptions, signal);

	return {
		queryKey,
		queryFn,
		...queryOptions,
	} as UseSuspenseInfiniteQueryOptions<
		Awaited<ReturnType<typeof getIdpAccount>>,
		TError,
		TData
	> & { queryKey: DataTag<QueryKey, TData, TError> };
};

export type GetIdpAccountSuspenseInfiniteQueryResult = NonNullable<
	Awaited<ReturnType<typeof getIdpAccount>>
>;

export type GetIdpAccountSuspenseInfiniteQueryError = ErrorType<void>;

export function useGetIdpAccountSuspenseInfinite<
	TData = InfiniteData<Awaited<ReturnType<typeof getIdpAccount>>>,
	TError = ErrorType<void>,
>(
	userId: string,
	options: {
		query: Partial<
			UseSuspenseInfiniteQueryOptions<
				Awaited<ReturnType<typeof getIdpAccount>>,
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

export function useGetIdpAccountSuspenseInfinite<
	TData = InfiniteData<Awaited<ReturnType<typeof getIdpAccount>>>,
	TError = ErrorType<void>,
>(
	userId: string,
	options?: {
		query?: Partial<
			UseSuspenseInfiniteQueryOptions<
				Awaited<ReturnType<typeof getIdpAccount>>,
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

export function useGetIdpAccountSuspenseInfinite<
	TData = InfiniteData<Awaited<ReturnType<typeof getIdpAccount>>>,
	TError = ErrorType<void>,
>(
	userId: string,
	options?: {
		query?: Partial<
			UseSuspenseInfiniteQueryOptions<
				Awaited<ReturnType<typeof getIdpAccount>>,
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
 * @summary IDP 계정 상세 조회
 */

export function useGetIdpAccountSuspenseInfinite<
	TData = InfiniteData<Awaited<ReturnType<typeof getIdpAccount>>>,
	TError = ErrorType<void>,
>(
	userId: string,
	options?: {
		query?: Partial<
			UseSuspenseInfiniteQueryOptions<
				Awaited<ReturnType<typeof getIdpAccount>>,
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
	const queryOptions = getGetIdpAccountSuspenseInfiniteQueryOptions(
		userId,
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
 * @summary IDP 계정 상세 조회
 */
export const prefetchGetIdpAccountInfiniteQuery = async <
	TData = Awaited<ReturnType<typeof getIdpAccount>>,
	TError = ErrorType<void>,
>(
	queryClient: QueryClient,
	userId: string,
	options?: {
		query?: Partial<
			UseSuspenseInfiniteQueryOptions<
				Awaited<ReturnType<typeof getIdpAccount>>,
				TError,
				TData
			>
		>;
		request?: SecondParameter<typeof customIdpInstance>;
	},
): Promise<QueryClient> => {
	const queryOptions = getGetIdpAccountSuspenseInfiniteQueryOptions(
		userId,
		options,
	);

	await queryClient.prefetchInfiniteQuery(queryOptions);

	return queryClient;
};

/**
 * 계정의 활성 상태를 반전시킵니다.
 * @summary 계정 활성/비활성 토글
 */
export const toggleIdpAccountActive = (
	userId: string,
	options?: SecondParameter<typeof customIdpInstance>,
) => {
	return customIdpInstance<ToggleIdpAccountActive200AllOf>(
		{ url: `/api/v1/idp/accounts/${userId}/toggle-active`, method: "PATCH" },
		options,
	);
};

export const getToggleIdpAccountActiveMutationOptions = <
	TError = ErrorType<void>,
	TContext = unknown,
>(options?: {
	mutation?: UseMutationOptions<
		Awaited<ReturnType<typeof toggleIdpAccountActive>>,
		TError,
		{ userId: string },
		TContext
	>;
	request?: SecondParameter<typeof customIdpInstance>;
}): UseMutationOptions<
	Awaited<ReturnType<typeof toggleIdpAccountActive>>,
	TError,
	{ userId: string },
	TContext
> => {
	const mutationKey = ["toggleIdpAccountActive"];
	const { mutation: mutationOptions, request: requestOptions } = options
		? options.mutation &&
			"mutationKey" in options.mutation &&
			options.mutation.mutationKey
			? options
			: { ...options, mutation: { ...options.mutation, mutationKey } }
		: { mutation: { mutationKey }, request: undefined };

	const mutationFn: MutationFunction<
		Awaited<ReturnType<typeof toggleIdpAccountActive>>,
		{ userId: string }
	> = (props) => {
		const { userId } = props ?? {};

		return toggleIdpAccountActive(userId, requestOptions);
	};

	return { mutationFn, ...mutationOptions };
};

export type ToggleIdpAccountActiveMutationResult = NonNullable<
	Awaited<ReturnType<typeof toggleIdpAccountActive>>
>;

export type ToggleIdpAccountActiveMutationError = ErrorType<void>;

/**
 * @summary 계정 활성/비활성 토글
 */
export const useToggleIdpAccountActive = <
	TError = ErrorType<void>,
	TContext = unknown,
>(
	options?: {
		mutation?: UseMutationOptions<
			Awaited<ReturnType<typeof toggleIdpAccountActive>>,
			TError,
			{ userId: string },
			TContext
		>;
		request?: SecondParameter<typeof customIdpInstance>;
	},
	queryClient?: QueryClient,
): UseMutationResult<
	Awaited<ReturnType<typeof toggleIdpAccountActive>>,
	TError,
	{ userId: string },
	TContext
> => {
	const mutationOptions = getToggleIdpAccountActiveMutationOptions(options);

	return useMutation(mutationOptions, queryClient);
};

/**
 * 로그인 실패 횟수를 0으로 초기화하고 잠금을 해제합니다.
 * @summary 로그인 실패 횟수 초기화
 */
export const resetIdpAccountFailedAttempts = (
	userId: string,
	options?: SecondParameter<typeof customIdpInstance>,
	signal?: AbortSignal,
) => {
	return customIdpInstance<unknown>(
		{
			url: `/api/v1/idp/accounts/${userId}/reset-failed-attempts`,
			method: "POST",
			signal,
		},
		options,
	);
};

export const getResetIdpAccountFailedAttemptsMutationOptions = <
	TError = ErrorType<void>,
	TContext = unknown,
>(options?: {
	mutation?: UseMutationOptions<
		Awaited<ReturnType<typeof resetIdpAccountFailedAttempts>>,
		TError,
		{ userId: string },
		TContext
	>;
	request?: SecondParameter<typeof customIdpInstance>;
}): UseMutationOptions<
	Awaited<ReturnType<typeof resetIdpAccountFailedAttempts>>,
	TError,
	{ userId: string },
	TContext
> => {
	const mutationKey = ["resetIdpAccountFailedAttempts"];
	const { mutation: mutationOptions, request: requestOptions } = options
		? options.mutation &&
			"mutationKey" in options.mutation &&
			options.mutation.mutationKey
			? options
			: { ...options, mutation: { ...options.mutation, mutationKey } }
		: { mutation: { mutationKey }, request: undefined };

	const mutationFn: MutationFunction<
		Awaited<ReturnType<typeof resetIdpAccountFailedAttempts>>,
		{ userId: string }
	> = (props) => {
		const { userId } = props ?? {};

		return resetIdpAccountFailedAttempts(userId, requestOptions);
	};

	return { mutationFn, ...mutationOptions };
};

export type ResetIdpAccountFailedAttemptsMutationResult = NonNullable<
	Awaited<ReturnType<typeof resetIdpAccountFailedAttempts>>
>;

export type ResetIdpAccountFailedAttemptsMutationError = ErrorType<void>;

/**
 * @summary 로그인 실패 횟수 초기화
 */
export const useResetIdpAccountFailedAttempts = <
	TError = ErrorType<void>,
	TContext = unknown,
>(
	options?: {
		mutation?: UseMutationOptions<
			Awaited<ReturnType<typeof resetIdpAccountFailedAttempts>>,
			TError,
			{ userId: string },
			TContext
		>;
		request?: SecondParameter<typeof customIdpInstance>;
	},
	queryClient?: QueryClient,
): UseMutationResult<
	Awaited<ReturnType<typeof resetIdpAccountFailedAttempts>>,
	TError,
	{ userId: string },
	TContext
> => {
	const mutationOptions =
		getResetIdpAccountFailedAttemptsMutationOptions(options);

	return useMutation(mutationOptions, queryClient);
};
