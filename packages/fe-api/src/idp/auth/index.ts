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

import type { AuthAuditLogDto } from "../../idp-model/authAuditLogDto";
import type { AuthAuditResult } from "../../idp-model/authAuditResult";
import type { ChangePassword200AllOf } from "../../idp-model/changePassword200AllOf";
import type { ChangePasswordDto } from "../../idp-model/changePasswordDto";
import type { ForceResetPassword200AllOf } from "../../idp-model/forceResetPassword200AllOf";
import type { GetAuthAuditLogs200AllOf } from "../../idp-model/getAuthAuditLogs200AllOf";
import type { GetAuthAuditLogsParams } from "../../idp-model/getAuthAuditLogsParams";
import type { GetAuthAuditLogStats200AllOf } from "../../idp-model/getAuthAuditLogStats200AllOf";
import type { GetMySessions200AllOf } from "../../idp-model/getMySessions200AllOf";
import type { GetMySpaces200AllOf } from "../../idp-model/getMySpaces200AllOf";
import type { InvalidateUserSessions200AllOf } from "../../idp-model/invalidateUserSessions200AllOf";
import type { LoginParams } from "../../idp-model/loginParams";
import type { OidcCallbackParams } from "../../idp-model/oidcCallbackParams";
import type { RefreshToken200AllOf } from "../../idp-model/refreshToken200AllOf";
import type { RevokeOtherSessions200AllOf } from "../../idp-model/revokeOtherSessions200AllOf";
import type { RevokeSession200AllOf } from "../../idp-model/revokeSession200AllOf";
import type { SignUpPayloadDto } from "../../idp-model/signUpPayloadDto";
import type { UnlockAccount200AllOf } from "../../idp-model/unlockAccount200AllOf";
import type { VerifyToken200AllOf } from "../../idp-model/verifyToken200AllOf";
export type { AuthAuditLogDto };
export type { AuthAuditResult };
export type { ChangePassword200AllOf };
export type { ChangePasswordDto };
export type { ForceResetPassword200AllOf };
export type { GetAuthAuditLogs200AllOf };
export type { GetAuthAuditLogsParams };
export type { GetAuthAuditLogStats200AllOf };
export type { GetMySessions200AllOf };
export type { GetMySpaces200AllOf };
export type { InvalidateUserSessions200AllOf };
export type { LoginParams };
export type { OidcCallbackParams };
export type { RefreshToken200AllOf };
export type { RevokeOtherSessions200AllOf };
export type { RevokeSession200AllOf };
export type { SignUpPayloadDto };
export type { UnlockAccount200AllOf };
export type { VerifyToken200AllOf };
import type { BodyType, ErrorType } from "../../libs/customIdpAxios";
import { customIdpInstance } from "../../libs/customIdpAxios";

type SecondParameter<T extends (...args: never) => unknown> = Parameters<T>[1];

/**
 * IDP의 OIDC Authorization 엔드포인트로 리다이렉트합니다. returnTo 파라미터로 인증 완료 후 리다이렉트할 경로를 지정할 수 있습니다.
 * @summary OIDC 로그인 리다이렉트
 */
export const login = (
	params: LoginParams,
	options?: SecondParameter<typeof customIdpInstance>,
	signal?: AbortSignal,
) => {
	return customIdpInstance<void>(
		{ url: `/api/v1/auth/login`, method: "GET", params, signal },
		options,
	);
};

export const getLoginQueryKey = (params?: LoginParams) => {
	return [`/api/v1/auth/login`, ...(params ? [params] : [])] as const;
};

export const getLoginInfiniteQueryKey = (params?: LoginParams) => {
	return [
		"infinite",
		`/api/v1/auth/login`,
		...(params ? [params] : []),
	] as const;
};

export const getLoginQueryOptions = <
	TData = Awaited<ReturnType<typeof login>>,
	TError = ErrorType<unknown>,
>(
	params: LoginParams,
	options?: {
		query?: Partial<
			UseQueryOptions<Awaited<ReturnType<typeof login>>, TError, TData>
		>;
		request?: SecondParameter<typeof customIdpInstance>;
	},
) => {
	const { query: queryOptions, request: requestOptions } = options ?? {};

	const queryKey = queryOptions?.queryKey ?? getLoginQueryKey(params);

	const queryFn: QueryFunction<Awaited<ReturnType<typeof login>>> = ({
		signal,
	}) => login(params, requestOptions, signal);

	return { queryKey, queryFn, ...queryOptions } as UseQueryOptions<
		Awaited<ReturnType<typeof login>>,
		TError,
		TData
	> & { queryKey: DataTag<QueryKey, TData, TError> };
};

export type LoginQueryResult = NonNullable<Awaited<ReturnType<typeof login>>>;

export type LoginQueryError = ErrorType<unknown>;

export function useLogin<
	TData = Awaited<ReturnType<typeof login>>,
	TError = ErrorType<unknown>,
>(
	params: LoginParams,
	options: {
		query: Partial<
			UseQueryOptions<Awaited<ReturnType<typeof login>>, TError, TData>
		> &
			Pick<
				DefinedInitialDataOptions<
					Awaited<ReturnType<typeof login>>,
					TError,
					Awaited<ReturnType<typeof login>>
				>,
				"initialData"
			>;
		request?: SecondParameter<typeof customIdpInstance>;
	},
	queryClient?: QueryClient,
): DefinedUseQueryResult<TData, TError> & {
	queryKey: DataTag<QueryKey, TData, TError>;
};

export function useLogin<
	TData = Awaited<ReturnType<typeof login>>,
	TError = ErrorType<unknown>,
>(
	params: LoginParams,
	options?: {
		query?: Partial<
			UseQueryOptions<Awaited<ReturnType<typeof login>>, TError, TData>
		> &
			Pick<
				UndefinedInitialDataOptions<
					Awaited<ReturnType<typeof login>>,
					TError,
					Awaited<ReturnType<typeof login>>
				>,
				"initialData"
			>;
		request?: SecondParameter<typeof customIdpInstance>;
	},
	queryClient?: QueryClient,
): UseQueryResult<TData, TError> & {
	queryKey: DataTag<QueryKey, TData, TError>;
};

export function useLogin<
	TData = Awaited<ReturnType<typeof login>>,
	TError = ErrorType<unknown>,
>(
	params: LoginParams,
	options?: {
		query?: Partial<
			UseQueryOptions<Awaited<ReturnType<typeof login>>, TError, TData>
		>;
		request?: SecondParameter<typeof customIdpInstance>;
	},
	queryClient?: QueryClient,
): UseQueryResult<TData, TError> & {
	queryKey: DataTag<QueryKey, TData, TError>;
};

/**
 * @summary OIDC 로그인 리다이렉트
 */

export function useLogin<
	TData = Awaited<ReturnType<typeof login>>,
	TError = ErrorType<unknown>,
>(
	params: LoginParams,
	options?: {
		query?: Partial<
			UseQueryOptions<Awaited<ReturnType<typeof login>>, TError, TData>
		>;
		request?: SecondParameter<typeof customIdpInstance>;
	},
	queryClient?: QueryClient,
): UseQueryResult<TData, TError> & {
	queryKey: DataTag<QueryKey, TData, TError>;
} {
	const queryOptions = getLoginQueryOptions(params, options);

	const query = useQuery(queryOptions, queryClient) as UseQueryResult<
		TData,
		TError
	> & { queryKey: DataTag<QueryKey, TData, TError> };

	query.queryKey = queryOptions.queryKey;

	return query;
}

/**
 * @summary OIDC 로그인 리다이렉트
 */
export const prefetchLoginQuery = async <
	TData = Awaited<ReturnType<typeof login>>,
	TError = ErrorType<unknown>,
>(
	queryClient: QueryClient,
	params: LoginParams,
	options?: {
		query?: Partial<
			UseQueryOptions<Awaited<ReturnType<typeof login>>, TError, TData>
		>;
		request?: SecondParameter<typeof customIdpInstance>;
	},
): Promise<QueryClient> => {
	const queryOptions = getLoginQueryOptions(params, options);

	await queryClient.prefetchQuery(queryOptions);

	return queryClient;
};

export const getLoginSuspenseQueryOptions = <
	TData = Awaited<ReturnType<typeof login>>,
	TError = ErrorType<unknown>,
>(
	params: LoginParams,
	options?: {
		query?: Partial<
			UseSuspenseQueryOptions<Awaited<ReturnType<typeof login>>, TError, TData>
		>;
		request?: SecondParameter<typeof customIdpInstance>;
	},
) => {
	const { query: queryOptions, request: requestOptions } = options ?? {};

	const queryKey = queryOptions?.queryKey ?? getLoginQueryKey(params);

	const queryFn: QueryFunction<Awaited<ReturnType<typeof login>>> = ({
		signal,
	}) => login(params, requestOptions, signal);

	return { queryKey, queryFn, ...queryOptions } as UseSuspenseQueryOptions<
		Awaited<ReturnType<typeof login>>,
		TError,
		TData
	> & { queryKey: DataTag<QueryKey, TData, TError> };
};

export type LoginSuspenseQueryResult = NonNullable<
	Awaited<ReturnType<typeof login>>
>;

export type LoginSuspenseQueryError = ErrorType<unknown>;

export function useLoginSuspense<
	TData = Awaited<ReturnType<typeof login>>,
	TError = ErrorType<unknown>,
>(
	params: LoginParams,
	options: {
		query: Partial<
			UseSuspenseQueryOptions<Awaited<ReturnType<typeof login>>, TError, TData>
		>;
		request?: SecondParameter<typeof customIdpInstance>;
	},
	queryClient?: QueryClient,
): UseSuspenseQueryResult<TData, TError> & {
	queryKey: DataTag<QueryKey, TData, TError>;
};

export function useLoginSuspense<
	TData = Awaited<ReturnType<typeof login>>,
	TError = ErrorType<unknown>,
>(
	params: LoginParams,
	options?: {
		query?: Partial<
			UseSuspenseQueryOptions<Awaited<ReturnType<typeof login>>, TError, TData>
		>;
		request?: SecondParameter<typeof customIdpInstance>;
	},
	queryClient?: QueryClient,
): UseSuspenseQueryResult<TData, TError> & {
	queryKey: DataTag<QueryKey, TData, TError>;
};

export function useLoginSuspense<
	TData = Awaited<ReturnType<typeof login>>,
	TError = ErrorType<unknown>,
>(
	params: LoginParams,
	options?: {
		query?: Partial<
			UseSuspenseQueryOptions<Awaited<ReturnType<typeof login>>, TError, TData>
		>;
		request?: SecondParameter<typeof customIdpInstance>;
	},
	queryClient?: QueryClient,
): UseSuspenseQueryResult<TData, TError> & {
	queryKey: DataTag<QueryKey, TData, TError>;
};

/**
 * @summary OIDC 로그인 리다이렉트
 */

export function useLoginSuspense<
	TData = Awaited<ReturnType<typeof login>>,
	TError = ErrorType<unknown>,
>(
	params: LoginParams,
	options?: {
		query?: Partial<
			UseSuspenseQueryOptions<Awaited<ReturnType<typeof login>>, TError, TData>
		>;
		request?: SecondParameter<typeof customIdpInstance>;
	},
	queryClient?: QueryClient,
): UseSuspenseQueryResult<TData, TError> & {
	queryKey: DataTag<QueryKey, TData, TError>;
} {
	const queryOptions = getLoginSuspenseQueryOptions(params, options);

	const query = useSuspenseQuery(
		queryOptions,
		queryClient,
	) as UseSuspenseQueryResult<TData, TError> & {
		queryKey: DataTag<QueryKey, TData, TError>;
	};

	query.queryKey = queryOptions.queryKey;

	return query;
}

export const getLoginSuspenseInfiniteQueryOptions = <
	TData = InfiniteData<Awaited<ReturnType<typeof login>>>,
	TError = ErrorType<unknown>,
>(
	params: LoginParams,
	options?: {
		query?: Partial<
			UseSuspenseInfiniteQueryOptions<
				Awaited<ReturnType<typeof login>>,
				TError,
				TData
			>
		>;
		request?: SecondParameter<typeof customIdpInstance>;
	},
) => {
	const { query: queryOptions, request: requestOptions } = options ?? {};

	const queryKey = queryOptions?.queryKey ?? getLoginInfiniteQueryKey(params);

	const queryFn: QueryFunction<Awaited<ReturnType<typeof login>>> = ({
		signal,
	}) => login(params, requestOptions, signal);

	return {
		queryKey,
		queryFn,
		...queryOptions,
	} as UseSuspenseInfiniteQueryOptions<
		Awaited<ReturnType<typeof login>>,
		TError,
		TData
	> & { queryKey: DataTag<QueryKey, TData, TError> };
};

export type LoginSuspenseInfiniteQueryResult = NonNullable<
	Awaited<ReturnType<typeof login>>
>;

export type LoginSuspenseInfiniteQueryError = ErrorType<unknown>;

export function useLoginSuspenseInfinite<
	TData = InfiniteData<Awaited<ReturnType<typeof login>>>,
	TError = ErrorType<unknown>,
>(
	params: LoginParams,
	options: {
		query: Partial<
			UseSuspenseInfiniteQueryOptions<
				Awaited<ReturnType<typeof login>>,
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

export function useLoginSuspenseInfinite<
	TData = InfiniteData<Awaited<ReturnType<typeof login>>>,
	TError = ErrorType<unknown>,
>(
	params: LoginParams,
	options?: {
		query?: Partial<
			UseSuspenseInfiniteQueryOptions<
				Awaited<ReturnType<typeof login>>,
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

export function useLoginSuspenseInfinite<
	TData = InfiniteData<Awaited<ReturnType<typeof login>>>,
	TError = ErrorType<unknown>,
>(
	params: LoginParams,
	options?: {
		query?: Partial<
			UseSuspenseInfiniteQueryOptions<
				Awaited<ReturnType<typeof login>>,
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
 * @summary OIDC 로그인 리다이렉트
 */

export function useLoginSuspenseInfinite<
	TData = InfiniteData<Awaited<ReturnType<typeof login>>>,
	TError = ErrorType<unknown>,
>(
	params: LoginParams,
	options?: {
		query?: Partial<
			UseSuspenseInfiniteQueryOptions<
				Awaited<ReturnType<typeof login>>,
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
	const queryOptions = getLoginSuspenseInfiniteQueryOptions(params, options);

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
 * @summary OIDC 로그인 리다이렉트
 */
export const prefetchLoginInfiniteQuery = async <
	TData = Awaited<ReturnType<typeof login>>,
	TError = ErrorType<unknown>,
>(
	queryClient: QueryClient,
	params: LoginParams,
	options?: {
		query?: Partial<
			UseSuspenseInfiniteQueryOptions<
				Awaited<ReturnType<typeof login>>,
				TError,
				TData
			>
		>;
		request?: SecondParameter<typeof customIdpInstance>;
	},
): Promise<QueryClient> => {
	const queryOptions = getLoginSuspenseInfiniteQueryOptions(params, options);

	await queryClient.prefetchInfiniteQuery(queryOptions);

	return queryClient;
};

/**
 * IDP에서 인증 완료 후 Authorization Code를 수신하여 토큰을 교환하고 대시보드로 리다이렉트합니다.
 * @summary OIDC 콜백
 */
export const oidcCallback = (
	params: OidcCallbackParams,
	options?: SecondParameter<typeof customIdpInstance>,
	signal?: AbortSignal,
) => {
	return customIdpInstance<void>(
		{ url: `/api/v1/auth/callback`, method: "GET", params, signal },
		options,
	);
};

export const getOidcCallbackQueryKey = (params?: OidcCallbackParams) => {
	return [`/api/v1/auth/callback`, ...(params ? [params] : [])] as const;
};

export const getOidcCallbackInfiniteQueryKey = (
	params?: OidcCallbackParams,
) => {
	return [
		"infinite",
		`/api/v1/auth/callback`,
		...(params ? [params] : []),
	] as const;
};

export const getOidcCallbackQueryOptions = <
	TData = Awaited<ReturnType<typeof oidcCallback>>,
	TError = ErrorType<unknown>,
>(
	params: OidcCallbackParams,
	options?: {
		query?: Partial<
			UseQueryOptions<Awaited<ReturnType<typeof oidcCallback>>, TError, TData>
		>;
		request?: SecondParameter<typeof customIdpInstance>;
	},
) => {
	const { query: queryOptions, request: requestOptions } = options ?? {};

	const queryKey = queryOptions?.queryKey ?? getOidcCallbackQueryKey(params);

	const queryFn: QueryFunction<Awaited<ReturnType<typeof oidcCallback>>> = ({
		signal,
	}) => oidcCallback(params, requestOptions, signal);

	return { queryKey, queryFn, ...queryOptions } as UseQueryOptions<
		Awaited<ReturnType<typeof oidcCallback>>,
		TError,
		TData
	> & { queryKey: DataTag<QueryKey, TData, TError> };
};

export type OidcCallbackQueryResult = NonNullable<
	Awaited<ReturnType<typeof oidcCallback>>
>;

export type OidcCallbackQueryError = ErrorType<unknown>;

export function useOidcCallback<
	TData = Awaited<ReturnType<typeof oidcCallback>>,
	TError = ErrorType<unknown>,
>(
	params: OidcCallbackParams,
	options: {
		query: Partial<
			UseQueryOptions<Awaited<ReturnType<typeof oidcCallback>>, TError, TData>
		> &
			Pick<
				DefinedInitialDataOptions<
					Awaited<ReturnType<typeof oidcCallback>>,
					TError,
					Awaited<ReturnType<typeof oidcCallback>>
				>,
				"initialData"
			>;
		request?: SecondParameter<typeof customIdpInstance>;
	},
	queryClient?: QueryClient,
): DefinedUseQueryResult<TData, TError> & {
	queryKey: DataTag<QueryKey, TData, TError>;
};

export function useOidcCallback<
	TData = Awaited<ReturnType<typeof oidcCallback>>,
	TError = ErrorType<unknown>,
>(
	params: OidcCallbackParams,
	options?: {
		query?: Partial<
			UseQueryOptions<Awaited<ReturnType<typeof oidcCallback>>, TError, TData>
		> &
			Pick<
				UndefinedInitialDataOptions<
					Awaited<ReturnType<typeof oidcCallback>>,
					TError,
					Awaited<ReturnType<typeof oidcCallback>>
				>,
				"initialData"
			>;
		request?: SecondParameter<typeof customIdpInstance>;
	},
	queryClient?: QueryClient,
): UseQueryResult<TData, TError> & {
	queryKey: DataTag<QueryKey, TData, TError>;
};

export function useOidcCallback<
	TData = Awaited<ReturnType<typeof oidcCallback>>,
	TError = ErrorType<unknown>,
>(
	params: OidcCallbackParams,
	options?: {
		query?: Partial<
			UseQueryOptions<Awaited<ReturnType<typeof oidcCallback>>, TError, TData>
		>;
		request?: SecondParameter<typeof customIdpInstance>;
	},
	queryClient?: QueryClient,
): UseQueryResult<TData, TError> & {
	queryKey: DataTag<QueryKey, TData, TError>;
};

/**
 * @summary OIDC 콜백
 */

export function useOidcCallback<
	TData = Awaited<ReturnType<typeof oidcCallback>>,
	TError = ErrorType<unknown>,
>(
	params: OidcCallbackParams,
	options?: {
		query?: Partial<
			UseQueryOptions<Awaited<ReturnType<typeof oidcCallback>>, TError, TData>
		>;
		request?: SecondParameter<typeof customIdpInstance>;
	},
	queryClient?: QueryClient,
): UseQueryResult<TData, TError> & {
	queryKey: DataTag<QueryKey, TData, TError>;
} {
	const queryOptions = getOidcCallbackQueryOptions(params, options);

	const query = useQuery(queryOptions, queryClient) as UseQueryResult<
		TData,
		TError
	> & { queryKey: DataTag<QueryKey, TData, TError> };

	query.queryKey = queryOptions.queryKey;

	return query;
}

/**
 * @summary OIDC 콜백
 */
export const prefetchOidcCallbackQuery = async <
	TData = Awaited<ReturnType<typeof oidcCallback>>,
	TError = ErrorType<unknown>,
>(
	queryClient: QueryClient,
	params: OidcCallbackParams,
	options?: {
		query?: Partial<
			UseQueryOptions<Awaited<ReturnType<typeof oidcCallback>>, TError, TData>
		>;
		request?: SecondParameter<typeof customIdpInstance>;
	},
): Promise<QueryClient> => {
	const queryOptions = getOidcCallbackQueryOptions(params, options);

	await queryClient.prefetchQuery(queryOptions);

	return queryClient;
};

export const getOidcCallbackSuspenseQueryOptions = <
	TData = Awaited<ReturnType<typeof oidcCallback>>,
	TError = ErrorType<unknown>,
>(
	params: OidcCallbackParams,
	options?: {
		query?: Partial<
			UseSuspenseQueryOptions<
				Awaited<ReturnType<typeof oidcCallback>>,
				TError,
				TData
			>
		>;
		request?: SecondParameter<typeof customIdpInstance>;
	},
) => {
	const { query: queryOptions, request: requestOptions } = options ?? {};

	const queryKey = queryOptions?.queryKey ?? getOidcCallbackQueryKey(params);

	const queryFn: QueryFunction<Awaited<ReturnType<typeof oidcCallback>>> = ({
		signal,
	}) => oidcCallback(params, requestOptions, signal);

	return { queryKey, queryFn, ...queryOptions } as UseSuspenseQueryOptions<
		Awaited<ReturnType<typeof oidcCallback>>,
		TError,
		TData
	> & { queryKey: DataTag<QueryKey, TData, TError> };
};

export type OidcCallbackSuspenseQueryResult = NonNullable<
	Awaited<ReturnType<typeof oidcCallback>>
>;

export type OidcCallbackSuspenseQueryError = ErrorType<unknown>;

export function useOidcCallbackSuspense<
	TData = Awaited<ReturnType<typeof oidcCallback>>,
	TError = ErrorType<unknown>,
>(
	params: OidcCallbackParams,
	options: {
		query: Partial<
			UseSuspenseQueryOptions<
				Awaited<ReturnType<typeof oidcCallback>>,
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

export function useOidcCallbackSuspense<
	TData = Awaited<ReturnType<typeof oidcCallback>>,
	TError = ErrorType<unknown>,
>(
	params: OidcCallbackParams,
	options?: {
		query?: Partial<
			UseSuspenseQueryOptions<
				Awaited<ReturnType<typeof oidcCallback>>,
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

export function useOidcCallbackSuspense<
	TData = Awaited<ReturnType<typeof oidcCallback>>,
	TError = ErrorType<unknown>,
>(
	params: OidcCallbackParams,
	options?: {
		query?: Partial<
			UseSuspenseQueryOptions<
				Awaited<ReturnType<typeof oidcCallback>>,
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
 * @summary OIDC 콜백
 */

export function useOidcCallbackSuspense<
	TData = Awaited<ReturnType<typeof oidcCallback>>,
	TError = ErrorType<unknown>,
>(
	params: OidcCallbackParams,
	options?: {
		query?: Partial<
			UseSuspenseQueryOptions<
				Awaited<ReturnType<typeof oidcCallback>>,
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
	const queryOptions = getOidcCallbackSuspenseQueryOptions(params, options);

	const query = useSuspenseQuery(
		queryOptions,
		queryClient,
	) as UseSuspenseQueryResult<TData, TError> & {
		queryKey: DataTag<QueryKey, TData, TError>;
	};

	query.queryKey = queryOptions.queryKey;

	return query;
}

export const getOidcCallbackSuspenseInfiniteQueryOptions = <
	TData = InfiniteData<Awaited<ReturnType<typeof oidcCallback>>>,
	TError = ErrorType<unknown>,
>(
	params: OidcCallbackParams,
	options?: {
		query?: Partial<
			UseSuspenseInfiniteQueryOptions<
				Awaited<ReturnType<typeof oidcCallback>>,
				TError,
				TData
			>
		>;
		request?: SecondParameter<typeof customIdpInstance>;
	},
) => {
	const { query: queryOptions, request: requestOptions } = options ?? {};

	const queryKey =
		queryOptions?.queryKey ?? getOidcCallbackInfiniteQueryKey(params);

	const queryFn: QueryFunction<Awaited<ReturnType<typeof oidcCallback>>> = ({
		signal,
	}) => oidcCallback(params, requestOptions, signal);

	return {
		queryKey,
		queryFn,
		...queryOptions,
	} as UseSuspenseInfiniteQueryOptions<
		Awaited<ReturnType<typeof oidcCallback>>,
		TError,
		TData
	> & { queryKey: DataTag<QueryKey, TData, TError> };
};

export type OidcCallbackSuspenseInfiniteQueryResult = NonNullable<
	Awaited<ReturnType<typeof oidcCallback>>
>;

export type OidcCallbackSuspenseInfiniteQueryError = ErrorType<unknown>;

export function useOidcCallbackSuspenseInfinite<
	TData = InfiniteData<Awaited<ReturnType<typeof oidcCallback>>>,
	TError = ErrorType<unknown>,
>(
	params: OidcCallbackParams,
	options: {
		query: Partial<
			UseSuspenseInfiniteQueryOptions<
				Awaited<ReturnType<typeof oidcCallback>>,
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

export function useOidcCallbackSuspenseInfinite<
	TData = InfiniteData<Awaited<ReturnType<typeof oidcCallback>>>,
	TError = ErrorType<unknown>,
>(
	params: OidcCallbackParams,
	options?: {
		query?: Partial<
			UseSuspenseInfiniteQueryOptions<
				Awaited<ReturnType<typeof oidcCallback>>,
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

export function useOidcCallbackSuspenseInfinite<
	TData = InfiniteData<Awaited<ReturnType<typeof oidcCallback>>>,
	TError = ErrorType<unknown>,
>(
	params: OidcCallbackParams,
	options?: {
		query?: Partial<
			UseSuspenseInfiniteQueryOptions<
				Awaited<ReturnType<typeof oidcCallback>>,
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
 * @summary OIDC 콜백
 */

export function useOidcCallbackSuspenseInfinite<
	TData = InfiniteData<Awaited<ReturnType<typeof oidcCallback>>>,
	TError = ErrorType<unknown>,
>(
	params: OidcCallbackParams,
	options?: {
		query?: Partial<
			UseSuspenseInfiniteQueryOptions<
				Awaited<ReturnType<typeof oidcCallback>>,
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
	const queryOptions = getOidcCallbackSuspenseInfiniteQueryOptions(
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
 * @summary OIDC 콜백
 */
export const prefetchOidcCallbackInfiniteQuery = async <
	TData = Awaited<ReturnType<typeof oidcCallback>>,
	TError = ErrorType<unknown>,
>(
	queryClient: QueryClient,
	params: OidcCallbackParams,
	options?: {
		query?: Partial<
			UseSuspenseInfiniteQueryOptions<
				Awaited<ReturnType<typeof oidcCallback>>,
				TError,
				TData
			>
		>;
		request?: SecondParameter<typeof customIdpInstance>;
	},
): Promise<QueryClient> => {
	const queryOptions = getOidcCallbackSuspenseInfiniteQueryOptions(
		params,
		options,
	);

	await queryClient.prefetchInfiniteQuery(queryOptions);

	return queryClient;
};

/**
 * 리프레시 토큰을 사용하여 IDP에서 새로운 토큰을 발급받습니다.
 * @summary 토큰 재발급
 */
export const refreshToken = (
	options?: SecondParameter<typeof customIdpInstance>,
	signal?: AbortSignal,
) => {
	return customIdpInstance<RefreshToken200AllOf>(
		{ url: `/api/v1/auth/token/refresh`, method: "POST", signal },
		options,
	);
};

export const getRefreshTokenMutationOptions = <
	TError = ErrorType<void>,
	TContext = unknown,
>(options?: {
	mutation?: UseMutationOptions<
		Awaited<ReturnType<typeof refreshToken>>,
		TError,
		void,
		TContext
	>;
	request?: SecondParameter<typeof customIdpInstance>;
}): UseMutationOptions<
	Awaited<ReturnType<typeof refreshToken>>,
	TError,
	void,
	TContext
> => {
	const mutationKey = ["refreshToken"];
	const { mutation: mutationOptions, request: requestOptions } = options
		? options.mutation &&
			"mutationKey" in options.mutation &&
			options.mutation.mutationKey
			? options
			: { ...options, mutation: { ...options.mutation, mutationKey } }
		: { mutation: { mutationKey }, request: undefined };

	const mutationFn: MutationFunction<
		Awaited<ReturnType<typeof refreshToken>>,
		void
	> = () => {
		return refreshToken(requestOptions);
	};

	return { mutationFn, ...mutationOptions };
};

export type RefreshTokenMutationResult = NonNullable<
	Awaited<ReturnType<typeof refreshToken>>
>;

export type RefreshTokenMutationError = ErrorType<void>;

/**
 * @summary 토큰 재발급
 */
export const useRefreshToken = <TError = ErrorType<void>, TContext = unknown>(
	options?: {
		mutation?: UseMutationOptions<
			Awaited<ReturnType<typeof refreshToken>>,
			TError,
			void,
			TContext
		>;
		request?: SecondParameter<typeof customIdpInstance>;
	},
	queryClient?: QueryClient,
): UseMutationResult<
	Awaited<ReturnType<typeof refreshToken>>,
	TError,
	void,
	TContext
> => {
	const mutationOptions = getRefreshTokenMutationOptions(options);

	return useMutation(mutationOptions, queryClient);
};

/**
 * 새로운 사용자 계정을 생성합니다.
 * @summary 회원가입
 */
export const signUp = (
	signUpPayloadDto: BodyType<SignUpPayloadDto>,
	options?: SecondParameter<typeof customIdpInstance>,
	signal?: AbortSignal,
) => {
	return customIdpInstance<unknown>(
		{
			url: `/api/v1/auth/sign-up`,
			method: "POST",
			headers: { "Content-Type": "application/json" },
			data: signUpPayloadDto,
			signal,
		},
		options,
	);
};

export const getSignUpMutationOptions = <
	TError = ErrorType<void>,
	TContext = unknown,
>(options?: {
	mutation?: UseMutationOptions<
		Awaited<ReturnType<typeof signUp>>,
		TError,
		{ data: BodyType<SignUpPayloadDto> },
		TContext
	>;
	request?: SecondParameter<typeof customIdpInstance>;
}): UseMutationOptions<
	Awaited<ReturnType<typeof signUp>>,
	TError,
	{ data: BodyType<SignUpPayloadDto> },
	TContext
> => {
	const mutationKey = ["signUp"];
	const { mutation: mutationOptions, request: requestOptions } = options
		? options.mutation &&
			"mutationKey" in options.mutation &&
			options.mutation.mutationKey
			? options
			: { ...options, mutation: { ...options.mutation, mutationKey } }
		: { mutation: { mutationKey }, request: undefined };

	const mutationFn: MutationFunction<
		Awaited<ReturnType<typeof signUp>>,
		{ data: BodyType<SignUpPayloadDto> }
	> = (props) => {
		const { data } = props ?? {};

		return signUp(data, requestOptions);
	};

	return { mutationFn, ...mutationOptions };
};

export type SignUpMutationResult = NonNullable<
	Awaited<ReturnType<typeof signUp>>
>;

export type SignUpMutationBody = BodyType<SignUpPayloadDto>;

export type SignUpMutationError = ErrorType<void>;

/**
 * @summary 회원가입
 */
export const useSignUp = <TError = ErrorType<void>, TContext = unknown>(
	options?: {
		mutation?: UseMutationOptions<
			Awaited<ReturnType<typeof signUp>>,
			TError,
			{ data: BodyType<SignUpPayloadDto> },
			TContext
		>;
		request?: SecondParameter<typeof customIdpInstance>;
	},
	queryClient?: QueryClient,
): UseMutationResult<
	Awaited<ReturnType<typeof signUp>>,
	TError,
	{ data: BodyType<SignUpPayloadDto> },
	TContext
> => {
	const mutationOptions = getSignUpMutationOptions(options);

	return useMutation(mutationOptions, queryClient);
};

/**
 * 현재 요청의 액세스 토큰이 유효한지 검증합니다.
 * @summary 토큰 유효성 검증
 */
export const verifyToken = (
	options?: SecondParameter<typeof customIdpInstance>,
	signal?: AbortSignal,
) => {
	return customIdpInstance<VerifyToken200AllOf>(
		{ url: `/api/v1/auth/verify-token`, method: "GET", signal },
		options,
	);
};

export const getVerifyTokenQueryKey = () => {
	return [`/api/v1/auth/verify-token`] as const;
};

export const getVerifyTokenInfiniteQueryKey = () => {
	return ["infinite", `/api/v1/auth/verify-token`] as const;
};

export const getVerifyTokenQueryOptions = <
	TData = Awaited<ReturnType<typeof verifyToken>>,
	TError = ErrorType<void>,
>(options?: {
	query?: Partial<
		UseQueryOptions<Awaited<ReturnType<typeof verifyToken>>, TError, TData>
	>;
	request?: SecondParameter<typeof customIdpInstance>;
}) => {
	const { query: queryOptions, request: requestOptions } = options ?? {};

	const queryKey = queryOptions?.queryKey ?? getVerifyTokenQueryKey();

	const queryFn: QueryFunction<Awaited<ReturnType<typeof verifyToken>>> = ({
		signal,
	}) => verifyToken(requestOptions, signal);

	return { queryKey, queryFn, ...queryOptions } as UseQueryOptions<
		Awaited<ReturnType<typeof verifyToken>>,
		TError,
		TData
	> & { queryKey: DataTag<QueryKey, TData, TError> };
};

export type VerifyTokenQueryResult = NonNullable<
	Awaited<ReturnType<typeof verifyToken>>
>;

export type VerifyTokenQueryError = ErrorType<void>;

export function useVerifyToken<
	TData = Awaited<ReturnType<typeof verifyToken>>,
	TError = ErrorType<void>,
>(
	options: {
		query: Partial<
			UseQueryOptions<Awaited<ReturnType<typeof verifyToken>>, TError, TData>
		> &
			Pick<
				DefinedInitialDataOptions<
					Awaited<ReturnType<typeof verifyToken>>,
					TError,
					Awaited<ReturnType<typeof verifyToken>>
				>,
				"initialData"
			>;
		request?: SecondParameter<typeof customIdpInstance>;
	},
	queryClient?: QueryClient,
): DefinedUseQueryResult<TData, TError> & {
	queryKey: DataTag<QueryKey, TData, TError>;
};

export function useVerifyToken<
	TData = Awaited<ReturnType<typeof verifyToken>>,
	TError = ErrorType<void>,
>(
	options?: {
		query?: Partial<
			UseQueryOptions<Awaited<ReturnType<typeof verifyToken>>, TError, TData>
		> &
			Pick<
				UndefinedInitialDataOptions<
					Awaited<ReturnType<typeof verifyToken>>,
					TError,
					Awaited<ReturnType<typeof verifyToken>>
				>,
				"initialData"
			>;
		request?: SecondParameter<typeof customIdpInstance>;
	},
	queryClient?: QueryClient,
): UseQueryResult<TData, TError> & {
	queryKey: DataTag<QueryKey, TData, TError>;
};

export function useVerifyToken<
	TData = Awaited<ReturnType<typeof verifyToken>>,
	TError = ErrorType<void>,
>(
	options?: {
		query?: Partial<
			UseQueryOptions<Awaited<ReturnType<typeof verifyToken>>, TError, TData>
		>;
		request?: SecondParameter<typeof customIdpInstance>;
	},
	queryClient?: QueryClient,
): UseQueryResult<TData, TError> & {
	queryKey: DataTag<QueryKey, TData, TError>;
};

/**
 * @summary 토큰 유효성 검증
 */

export function useVerifyToken<
	TData = Awaited<ReturnType<typeof verifyToken>>,
	TError = ErrorType<void>,
>(
	options?: {
		query?: Partial<
			UseQueryOptions<Awaited<ReturnType<typeof verifyToken>>, TError, TData>
		>;
		request?: SecondParameter<typeof customIdpInstance>;
	},
	queryClient?: QueryClient,
): UseQueryResult<TData, TError> & {
	queryKey: DataTag<QueryKey, TData, TError>;
} {
	const queryOptions = getVerifyTokenQueryOptions(options);

	const query = useQuery(queryOptions, queryClient) as UseQueryResult<
		TData,
		TError
	> & { queryKey: DataTag<QueryKey, TData, TError> };

	query.queryKey = queryOptions.queryKey;

	return query;
}

/**
 * @summary 토큰 유효성 검증
 */
export const prefetchVerifyTokenQuery = async <
	TData = Awaited<ReturnType<typeof verifyToken>>,
	TError = ErrorType<void>,
>(
	queryClient: QueryClient,
	options?: {
		query?: Partial<
			UseQueryOptions<Awaited<ReturnType<typeof verifyToken>>, TError, TData>
		>;
		request?: SecondParameter<typeof customIdpInstance>;
	},
): Promise<QueryClient> => {
	const queryOptions = getVerifyTokenQueryOptions(options);

	await queryClient.prefetchQuery(queryOptions);

	return queryClient;
};

export const getVerifyTokenSuspenseQueryOptions = <
	TData = Awaited<ReturnType<typeof verifyToken>>,
	TError = ErrorType<void>,
>(options?: {
	query?: Partial<
		UseSuspenseQueryOptions<
			Awaited<ReturnType<typeof verifyToken>>,
			TError,
			TData
		>
	>;
	request?: SecondParameter<typeof customIdpInstance>;
}) => {
	const { query: queryOptions, request: requestOptions } = options ?? {};

	const queryKey = queryOptions?.queryKey ?? getVerifyTokenQueryKey();

	const queryFn: QueryFunction<Awaited<ReturnType<typeof verifyToken>>> = ({
		signal,
	}) => verifyToken(requestOptions, signal);

	return { queryKey, queryFn, ...queryOptions } as UseSuspenseQueryOptions<
		Awaited<ReturnType<typeof verifyToken>>,
		TError,
		TData
	> & { queryKey: DataTag<QueryKey, TData, TError> };
};

export type VerifyTokenSuspenseQueryResult = NonNullable<
	Awaited<ReturnType<typeof verifyToken>>
>;

export type VerifyTokenSuspenseQueryError = ErrorType<void>;

export function useVerifyTokenSuspense<
	TData = Awaited<ReturnType<typeof verifyToken>>,
	TError = ErrorType<void>,
>(
	options: {
		query: Partial<
			UseSuspenseQueryOptions<
				Awaited<ReturnType<typeof verifyToken>>,
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

export function useVerifyTokenSuspense<
	TData = Awaited<ReturnType<typeof verifyToken>>,
	TError = ErrorType<void>,
>(
	options?: {
		query?: Partial<
			UseSuspenseQueryOptions<
				Awaited<ReturnType<typeof verifyToken>>,
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

export function useVerifyTokenSuspense<
	TData = Awaited<ReturnType<typeof verifyToken>>,
	TError = ErrorType<void>,
>(
	options?: {
		query?: Partial<
			UseSuspenseQueryOptions<
				Awaited<ReturnType<typeof verifyToken>>,
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
 * @summary 토큰 유효성 검증
 */

export function useVerifyTokenSuspense<
	TData = Awaited<ReturnType<typeof verifyToken>>,
	TError = ErrorType<void>,
>(
	options?: {
		query?: Partial<
			UseSuspenseQueryOptions<
				Awaited<ReturnType<typeof verifyToken>>,
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
	const queryOptions = getVerifyTokenSuspenseQueryOptions(options);

	const query = useSuspenseQuery(
		queryOptions,
		queryClient,
	) as UseSuspenseQueryResult<TData, TError> & {
		queryKey: DataTag<QueryKey, TData, TError>;
	};

	query.queryKey = queryOptions.queryKey;

	return query;
}

export const getVerifyTokenSuspenseInfiniteQueryOptions = <
	TData = InfiniteData<Awaited<ReturnType<typeof verifyToken>>>,
	TError = ErrorType<void>,
>(options?: {
	query?: Partial<
		UseSuspenseInfiniteQueryOptions<
			Awaited<ReturnType<typeof verifyToken>>,
			TError,
			TData
		>
	>;
	request?: SecondParameter<typeof customIdpInstance>;
}) => {
	const { query: queryOptions, request: requestOptions } = options ?? {};

	const queryKey = queryOptions?.queryKey ?? getVerifyTokenInfiniteQueryKey();

	const queryFn: QueryFunction<Awaited<ReturnType<typeof verifyToken>>> = ({
		signal,
	}) => verifyToken(requestOptions, signal);

	return {
		queryKey,
		queryFn,
		...queryOptions,
	} as UseSuspenseInfiniteQueryOptions<
		Awaited<ReturnType<typeof verifyToken>>,
		TError,
		TData
	> & { queryKey: DataTag<QueryKey, TData, TError> };
};

export type VerifyTokenSuspenseInfiniteQueryResult = NonNullable<
	Awaited<ReturnType<typeof verifyToken>>
>;

export type VerifyTokenSuspenseInfiniteQueryError = ErrorType<void>;

export function useVerifyTokenSuspenseInfinite<
	TData = InfiniteData<Awaited<ReturnType<typeof verifyToken>>>,
	TError = ErrorType<void>,
>(
	options: {
		query: Partial<
			UseSuspenseInfiniteQueryOptions<
				Awaited<ReturnType<typeof verifyToken>>,
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

export function useVerifyTokenSuspenseInfinite<
	TData = InfiniteData<Awaited<ReturnType<typeof verifyToken>>>,
	TError = ErrorType<void>,
>(
	options?: {
		query?: Partial<
			UseSuspenseInfiniteQueryOptions<
				Awaited<ReturnType<typeof verifyToken>>,
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

export function useVerifyTokenSuspenseInfinite<
	TData = InfiniteData<Awaited<ReturnType<typeof verifyToken>>>,
	TError = ErrorType<void>,
>(
	options?: {
		query?: Partial<
			UseSuspenseInfiniteQueryOptions<
				Awaited<ReturnType<typeof verifyToken>>,
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
 * @summary 토큰 유효성 검증
 */

export function useVerifyTokenSuspenseInfinite<
	TData = InfiniteData<Awaited<ReturnType<typeof verifyToken>>>,
	TError = ErrorType<void>,
>(
	options?: {
		query?: Partial<
			UseSuspenseInfiniteQueryOptions<
				Awaited<ReturnType<typeof verifyToken>>,
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
	const queryOptions = getVerifyTokenSuspenseInfiniteQueryOptions(options);

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
 * @summary 토큰 유효성 검증
 */
export const prefetchVerifyTokenInfiniteQuery = async <
	TData = Awaited<ReturnType<typeof verifyToken>>,
	TError = ErrorType<void>,
>(
	queryClient: QueryClient,
	options?: {
		query?: Partial<
			UseSuspenseInfiniteQueryOptions<
				Awaited<ReturnType<typeof verifyToken>>,
				TError,
				TData
			>
		>;
		request?: SecondParameter<typeof customIdpInstance>;
	},
): Promise<QueryClient> => {
	const queryOptions = getVerifyTokenSuspenseInfiniteQueryOptions(options);

	await queryClient.prefetchInfiniteQuery(queryOptions);

	return queryClient;
};

/**
 * 현재 인증된 사용자가 접근 가능한 Space 목록을 반환합니다. X-Space-ID 헤더가 필요하지 않습니다.
 * @summary 내 Space 목록 조회
 */
export const getMySpaces = (
	options?: SecondParameter<typeof customIdpInstance>,
	signal?: AbortSignal,
) => {
	return customIdpInstance<GetMySpaces200AllOf>(
		{ url: `/api/v1/auth/my-spaces`, method: "GET", signal },
		options,
	);
};

export const getGetMySpacesQueryKey = () => {
	return [`/api/v1/auth/my-spaces`] as const;
};

export const getGetMySpacesInfiniteQueryKey = () => {
	return ["infinite", `/api/v1/auth/my-spaces`] as const;
};

export const getGetMySpacesQueryOptions = <
	TData = Awaited<ReturnType<typeof getMySpaces>>,
	TError = ErrorType<void>,
>(options?: {
	query?: Partial<
		UseQueryOptions<Awaited<ReturnType<typeof getMySpaces>>, TError, TData>
	>;
	request?: SecondParameter<typeof customIdpInstance>;
}) => {
	const { query: queryOptions, request: requestOptions } = options ?? {};

	const queryKey = queryOptions?.queryKey ?? getGetMySpacesQueryKey();

	const queryFn: QueryFunction<Awaited<ReturnType<typeof getMySpaces>>> = ({
		signal,
	}) => getMySpaces(requestOptions, signal);

	return { queryKey, queryFn, ...queryOptions } as UseQueryOptions<
		Awaited<ReturnType<typeof getMySpaces>>,
		TError,
		TData
	> & { queryKey: DataTag<QueryKey, TData, TError> };
};

export type GetMySpacesQueryResult = NonNullable<
	Awaited<ReturnType<typeof getMySpaces>>
>;

export type GetMySpacesQueryError = ErrorType<void>;

export function useGetMySpaces<
	TData = Awaited<ReturnType<typeof getMySpaces>>,
	TError = ErrorType<void>,
>(
	options: {
		query: Partial<
			UseQueryOptions<Awaited<ReturnType<typeof getMySpaces>>, TError, TData>
		> &
			Pick<
				DefinedInitialDataOptions<
					Awaited<ReturnType<typeof getMySpaces>>,
					TError,
					Awaited<ReturnType<typeof getMySpaces>>
				>,
				"initialData"
			>;
		request?: SecondParameter<typeof customIdpInstance>;
	},
	queryClient?: QueryClient,
): DefinedUseQueryResult<TData, TError> & {
	queryKey: DataTag<QueryKey, TData, TError>;
};

export function useGetMySpaces<
	TData = Awaited<ReturnType<typeof getMySpaces>>,
	TError = ErrorType<void>,
>(
	options?: {
		query?: Partial<
			UseQueryOptions<Awaited<ReturnType<typeof getMySpaces>>, TError, TData>
		> &
			Pick<
				UndefinedInitialDataOptions<
					Awaited<ReturnType<typeof getMySpaces>>,
					TError,
					Awaited<ReturnType<typeof getMySpaces>>
				>,
				"initialData"
			>;
		request?: SecondParameter<typeof customIdpInstance>;
	},
	queryClient?: QueryClient,
): UseQueryResult<TData, TError> & {
	queryKey: DataTag<QueryKey, TData, TError>;
};

export function useGetMySpaces<
	TData = Awaited<ReturnType<typeof getMySpaces>>,
	TError = ErrorType<void>,
>(
	options?: {
		query?: Partial<
			UseQueryOptions<Awaited<ReturnType<typeof getMySpaces>>, TError, TData>
		>;
		request?: SecondParameter<typeof customIdpInstance>;
	},
	queryClient?: QueryClient,
): UseQueryResult<TData, TError> & {
	queryKey: DataTag<QueryKey, TData, TError>;
};

/**
 * @summary 내 Space 목록 조회
 */

export function useGetMySpaces<
	TData = Awaited<ReturnType<typeof getMySpaces>>,
	TError = ErrorType<void>,
>(
	options?: {
		query?: Partial<
			UseQueryOptions<Awaited<ReturnType<typeof getMySpaces>>, TError, TData>
		>;
		request?: SecondParameter<typeof customIdpInstance>;
	},
	queryClient?: QueryClient,
): UseQueryResult<TData, TError> & {
	queryKey: DataTag<QueryKey, TData, TError>;
} {
	const queryOptions = getGetMySpacesQueryOptions(options);

	const query = useQuery(queryOptions, queryClient) as UseQueryResult<
		TData,
		TError
	> & { queryKey: DataTag<QueryKey, TData, TError> };

	query.queryKey = queryOptions.queryKey;

	return query;
}

/**
 * @summary 내 Space 목록 조회
 */
export const prefetchGetMySpacesQuery = async <
	TData = Awaited<ReturnType<typeof getMySpaces>>,
	TError = ErrorType<void>,
>(
	queryClient: QueryClient,
	options?: {
		query?: Partial<
			UseQueryOptions<Awaited<ReturnType<typeof getMySpaces>>, TError, TData>
		>;
		request?: SecondParameter<typeof customIdpInstance>;
	},
): Promise<QueryClient> => {
	const queryOptions = getGetMySpacesQueryOptions(options);

	await queryClient.prefetchQuery(queryOptions);

	return queryClient;
};

export const getGetMySpacesSuspenseQueryOptions = <
	TData = Awaited<ReturnType<typeof getMySpaces>>,
	TError = ErrorType<void>,
>(options?: {
	query?: Partial<
		UseSuspenseQueryOptions<
			Awaited<ReturnType<typeof getMySpaces>>,
			TError,
			TData
		>
	>;
	request?: SecondParameter<typeof customIdpInstance>;
}) => {
	const { query: queryOptions, request: requestOptions } = options ?? {};

	const queryKey = queryOptions?.queryKey ?? getGetMySpacesQueryKey();

	const queryFn: QueryFunction<Awaited<ReturnType<typeof getMySpaces>>> = ({
		signal,
	}) => getMySpaces(requestOptions, signal);

	return { queryKey, queryFn, ...queryOptions } as UseSuspenseQueryOptions<
		Awaited<ReturnType<typeof getMySpaces>>,
		TError,
		TData
	> & { queryKey: DataTag<QueryKey, TData, TError> };
};

export type GetMySpacesSuspenseQueryResult = NonNullable<
	Awaited<ReturnType<typeof getMySpaces>>
>;

export type GetMySpacesSuspenseQueryError = ErrorType<void>;

export function useGetMySpacesSuspense<
	TData = Awaited<ReturnType<typeof getMySpaces>>,
	TError = ErrorType<void>,
>(
	options: {
		query: Partial<
			UseSuspenseQueryOptions<
				Awaited<ReturnType<typeof getMySpaces>>,
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

export function useGetMySpacesSuspense<
	TData = Awaited<ReturnType<typeof getMySpaces>>,
	TError = ErrorType<void>,
>(
	options?: {
		query?: Partial<
			UseSuspenseQueryOptions<
				Awaited<ReturnType<typeof getMySpaces>>,
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

export function useGetMySpacesSuspense<
	TData = Awaited<ReturnType<typeof getMySpaces>>,
	TError = ErrorType<void>,
>(
	options?: {
		query?: Partial<
			UseSuspenseQueryOptions<
				Awaited<ReturnType<typeof getMySpaces>>,
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
 * @summary 내 Space 목록 조회
 */

export function useGetMySpacesSuspense<
	TData = Awaited<ReturnType<typeof getMySpaces>>,
	TError = ErrorType<void>,
>(
	options?: {
		query?: Partial<
			UseSuspenseQueryOptions<
				Awaited<ReturnType<typeof getMySpaces>>,
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
	const queryOptions = getGetMySpacesSuspenseQueryOptions(options);

	const query = useSuspenseQuery(
		queryOptions,
		queryClient,
	) as UseSuspenseQueryResult<TData, TError> & {
		queryKey: DataTag<QueryKey, TData, TError>;
	};

	query.queryKey = queryOptions.queryKey;

	return query;
}

export const getGetMySpacesSuspenseInfiniteQueryOptions = <
	TData = InfiniteData<Awaited<ReturnType<typeof getMySpaces>>>,
	TError = ErrorType<void>,
>(options?: {
	query?: Partial<
		UseSuspenseInfiniteQueryOptions<
			Awaited<ReturnType<typeof getMySpaces>>,
			TError,
			TData
		>
	>;
	request?: SecondParameter<typeof customIdpInstance>;
}) => {
	const { query: queryOptions, request: requestOptions } = options ?? {};

	const queryKey = queryOptions?.queryKey ?? getGetMySpacesInfiniteQueryKey();

	const queryFn: QueryFunction<Awaited<ReturnType<typeof getMySpaces>>> = ({
		signal,
	}) => getMySpaces(requestOptions, signal);

	return {
		queryKey,
		queryFn,
		...queryOptions,
	} as UseSuspenseInfiniteQueryOptions<
		Awaited<ReturnType<typeof getMySpaces>>,
		TError,
		TData
	> & { queryKey: DataTag<QueryKey, TData, TError> };
};

export type GetMySpacesSuspenseInfiniteQueryResult = NonNullable<
	Awaited<ReturnType<typeof getMySpaces>>
>;

export type GetMySpacesSuspenseInfiniteQueryError = ErrorType<void>;

export function useGetMySpacesSuspenseInfinite<
	TData = InfiniteData<Awaited<ReturnType<typeof getMySpaces>>>,
	TError = ErrorType<void>,
>(
	options: {
		query: Partial<
			UseSuspenseInfiniteQueryOptions<
				Awaited<ReturnType<typeof getMySpaces>>,
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

export function useGetMySpacesSuspenseInfinite<
	TData = InfiniteData<Awaited<ReturnType<typeof getMySpaces>>>,
	TError = ErrorType<void>,
>(
	options?: {
		query?: Partial<
			UseSuspenseInfiniteQueryOptions<
				Awaited<ReturnType<typeof getMySpaces>>,
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

export function useGetMySpacesSuspenseInfinite<
	TData = InfiniteData<Awaited<ReturnType<typeof getMySpaces>>>,
	TError = ErrorType<void>,
>(
	options?: {
		query?: Partial<
			UseSuspenseInfiniteQueryOptions<
				Awaited<ReturnType<typeof getMySpaces>>,
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
 * @summary 내 Space 목록 조회
 */

export function useGetMySpacesSuspenseInfinite<
	TData = InfiniteData<Awaited<ReturnType<typeof getMySpaces>>>,
	TError = ErrorType<void>,
>(
	options?: {
		query?: Partial<
			UseSuspenseInfiniteQueryOptions<
				Awaited<ReturnType<typeof getMySpaces>>,
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
	const queryOptions = getGetMySpacesSuspenseInfiniteQueryOptions(options);

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
 * @summary 내 Space 목록 조회
 */
export const prefetchGetMySpacesInfiniteQuery = async <
	TData = Awaited<ReturnType<typeof getMySpaces>>,
	TError = ErrorType<void>,
>(
	queryClient: QueryClient,
	options?: {
		query?: Partial<
			UseSuspenseInfiniteQueryOptions<
				Awaited<ReturnType<typeof getMySpaces>>,
				TError,
				TData
			>
		>;
		request?: SecondParameter<typeof customIdpInstance>;
	},
): Promise<QueryClient> => {
	const queryOptions = getGetMySpacesSuspenseInfiniteQueryOptions(options);

	await queryClient.prefetchInfiniteQuery(queryOptions);

	return queryClient;
};

/**
 * 현재 사용자를 로그아웃하고 IDP 토큰을 무효화하며 쿠키를 삭제합니다.
 * @summary 로그아웃
 */
export const logout = (
	options?: SecondParameter<typeof customIdpInstance>,
	signal?: AbortSignal,
) => {
	return customIdpInstance<void>(
		{ url: `/api/v1/auth/logout`, method: "POST", signal },
		options,
	);
};

export const getLogoutMutationOptions = <
	TError = ErrorType<unknown>,
	TContext = unknown,
>(options?: {
	mutation?: UseMutationOptions<
		Awaited<ReturnType<typeof logout>>,
		TError,
		void,
		TContext
	>;
	request?: SecondParameter<typeof customIdpInstance>;
}): UseMutationOptions<
	Awaited<ReturnType<typeof logout>>,
	TError,
	void,
	TContext
> => {
	const mutationKey = ["logout"];
	const { mutation: mutationOptions, request: requestOptions } = options
		? options.mutation &&
			"mutationKey" in options.mutation &&
			options.mutation.mutationKey
			? options
			: { ...options, mutation: { ...options.mutation, mutationKey } }
		: { mutation: { mutationKey }, request: undefined };

	const mutationFn: MutationFunction<
		Awaited<ReturnType<typeof logout>>,
		void
	> = () => {
		return logout(requestOptions);
	};

	return { mutationFn, ...mutationOptions };
};

export type LogoutMutationResult = NonNullable<
	Awaited<ReturnType<typeof logout>>
>;

export type LogoutMutationError = ErrorType<unknown>;

/**
 * @summary 로그아웃
 */
export const useLogout = <TError = ErrorType<unknown>, TContext = unknown>(
	options?: {
		mutation?: UseMutationOptions<
			Awaited<ReturnType<typeof logout>>,
			TError,
			void,
			TContext
		>;
		request?: SecondParameter<typeof customIdpInstance>;
	},
	queryClient?: QueryClient,
): UseMutationResult<
	Awaited<ReturnType<typeof logout>>,
	TError,
	void,
	TContext
> => {
	const mutationOptions = getLogoutMutationOptions(options);

	return useMutation(mutationOptions, queryClient);
};

/**
 * 로그인 시도에 대한 감사 로그를 조회합니다. FULL_ACCESS 권한이 필요합니다.
 * @summary 인증 감사 로그 조회
 */
export const getAuthAuditLogs = (
	params?: GetAuthAuditLogsParams,
	options?: SecondParameter<typeof customIdpInstance>,
	signal?: AbortSignal,
) => {
	return customIdpInstance<GetAuthAuditLogs200AllOf>(
		{ url: `/api/v1/auth/audit-logs`, method: "GET", params, signal },
		options,
	);
};

export const getGetAuthAuditLogsQueryKey = (
	params?: GetAuthAuditLogsParams,
) => {
	return [`/api/v1/auth/audit-logs`, ...(params ? [params] : [])] as const;
};

export const getGetAuthAuditLogsInfiniteQueryKey = (
	params?: GetAuthAuditLogsParams,
) => {
	return [
		"infinite",
		`/api/v1/auth/audit-logs`,
		...(params ? [params] : []),
	] as const;
};

export const getGetAuthAuditLogsQueryOptions = <
	TData = Awaited<ReturnType<typeof getAuthAuditLogs>>,
	TError = ErrorType<void>,
>(
	params?: GetAuthAuditLogsParams,
	options?: {
		query?: Partial<
			UseQueryOptions<
				Awaited<ReturnType<typeof getAuthAuditLogs>>,
				TError,
				TData
			>
		>;
		request?: SecondParameter<typeof customIdpInstance>;
	},
) => {
	const { query: queryOptions, request: requestOptions } = options ?? {};

	const queryKey =
		queryOptions?.queryKey ?? getGetAuthAuditLogsQueryKey(params);

	const queryFn: QueryFunction<
		Awaited<ReturnType<typeof getAuthAuditLogs>>
	> = ({ signal }) => getAuthAuditLogs(params, requestOptions, signal);

	return { queryKey, queryFn, ...queryOptions } as UseQueryOptions<
		Awaited<ReturnType<typeof getAuthAuditLogs>>,
		TError,
		TData
	> & { queryKey: DataTag<QueryKey, TData, TError> };
};

export type GetAuthAuditLogsQueryResult = NonNullable<
	Awaited<ReturnType<typeof getAuthAuditLogs>>
>;

export type GetAuthAuditLogsQueryError = ErrorType<void>;

export function useGetAuthAuditLogs<
	TData = Awaited<ReturnType<typeof getAuthAuditLogs>>,
	TError = ErrorType<void>,
>(
	params: undefined | GetAuthAuditLogsParams,
	options: {
		query: Partial<
			UseQueryOptions<
				Awaited<ReturnType<typeof getAuthAuditLogs>>,
				TError,
				TData
			>
		> &
			Pick<
				DefinedInitialDataOptions<
					Awaited<ReturnType<typeof getAuthAuditLogs>>,
					TError,
					Awaited<ReturnType<typeof getAuthAuditLogs>>
				>,
				"initialData"
			>;
		request?: SecondParameter<typeof customIdpInstance>;
	},
	queryClient?: QueryClient,
): DefinedUseQueryResult<TData, TError> & {
	queryKey: DataTag<QueryKey, TData, TError>;
};

export function useGetAuthAuditLogs<
	TData = Awaited<ReturnType<typeof getAuthAuditLogs>>,
	TError = ErrorType<void>,
>(
	params?: GetAuthAuditLogsParams,
	options?: {
		query?: Partial<
			UseQueryOptions<
				Awaited<ReturnType<typeof getAuthAuditLogs>>,
				TError,
				TData
			>
		> &
			Pick<
				UndefinedInitialDataOptions<
					Awaited<ReturnType<typeof getAuthAuditLogs>>,
					TError,
					Awaited<ReturnType<typeof getAuthAuditLogs>>
				>,
				"initialData"
			>;
		request?: SecondParameter<typeof customIdpInstance>;
	},
	queryClient?: QueryClient,
): UseQueryResult<TData, TError> & {
	queryKey: DataTag<QueryKey, TData, TError>;
};

export function useGetAuthAuditLogs<
	TData = Awaited<ReturnType<typeof getAuthAuditLogs>>,
	TError = ErrorType<void>,
>(
	params?: GetAuthAuditLogsParams,
	options?: {
		query?: Partial<
			UseQueryOptions<
				Awaited<ReturnType<typeof getAuthAuditLogs>>,
				TError,
				TData
			>
		>;
		request?: SecondParameter<typeof customIdpInstance>;
	},
	queryClient?: QueryClient,
): UseQueryResult<TData, TError> & {
	queryKey: DataTag<QueryKey, TData, TError>;
};

/**
 * @summary 인증 감사 로그 조회
 */

export function useGetAuthAuditLogs<
	TData = Awaited<ReturnType<typeof getAuthAuditLogs>>,
	TError = ErrorType<void>,
>(
	params?: GetAuthAuditLogsParams,
	options?: {
		query?: Partial<
			UseQueryOptions<
				Awaited<ReturnType<typeof getAuthAuditLogs>>,
				TError,
				TData
			>
		>;
		request?: SecondParameter<typeof customIdpInstance>;
	},
	queryClient?: QueryClient,
): UseQueryResult<TData, TError> & {
	queryKey: DataTag<QueryKey, TData, TError>;
} {
	const queryOptions = getGetAuthAuditLogsQueryOptions(params, options);

	const query = useQuery(queryOptions, queryClient) as UseQueryResult<
		TData,
		TError
	> & { queryKey: DataTag<QueryKey, TData, TError> };

	query.queryKey = queryOptions.queryKey;

	return query;
}

/**
 * @summary 인증 감사 로그 조회
 */
export const prefetchGetAuthAuditLogsQuery = async <
	TData = Awaited<ReturnType<typeof getAuthAuditLogs>>,
	TError = ErrorType<void>,
>(
	queryClient: QueryClient,
	params?: GetAuthAuditLogsParams,
	options?: {
		query?: Partial<
			UseQueryOptions<
				Awaited<ReturnType<typeof getAuthAuditLogs>>,
				TError,
				TData
			>
		>;
		request?: SecondParameter<typeof customIdpInstance>;
	},
): Promise<QueryClient> => {
	const queryOptions = getGetAuthAuditLogsQueryOptions(params, options);

	await queryClient.prefetchQuery(queryOptions);

	return queryClient;
};

export const getGetAuthAuditLogsSuspenseQueryOptions = <
	TData = Awaited<ReturnType<typeof getAuthAuditLogs>>,
	TError = ErrorType<void>,
>(
	params?: GetAuthAuditLogsParams,
	options?: {
		query?: Partial<
			UseSuspenseQueryOptions<
				Awaited<ReturnType<typeof getAuthAuditLogs>>,
				TError,
				TData
			>
		>;
		request?: SecondParameter<typeof customIdpInstance>;
	},
) => {
	const { query: queryOptions, request: requestOptions } = options ?? {};

	const queryKey =
		queryOptions?.queryKey ?? getGetAuthAuditLogsQueryKey(params);

	const queryFn: QueryFunction<
		Awaited<ReturnType<typeof getAuthAuditLogs>>
	> = ({ signal }) => getAuthAuditLogs(params, requestOptions, signal);

	return { queryKey, queryFn, ...queryOptions } as UseSuspenseQueryOptions<
		Awaited<ReturnType<typeof getAuthAuditLogs>>,
		TError,
		TData
	> & { queryKey: DataTag<QueryKey, TData, TError> };
};

export type GetAuthAuditLogsSuspenseQueryResult = NonNullable<
	Awaited<ReturnType<typeof getAuthAuditLogs>>
>;

export type GetAuthAuditLogsSuspenseQueryError = ErrorType<void>;

export function useGetAuthAuditLogsSuspense<
	TData = Awaited<ReturnType<typeof getAuthAuditLogs>>,
	TError = ErrorType<void>,
>(
	params: undefined | GetAuthAuditLogsParams,
	options: {
		query: Partial<
			UseSuspenseQueryOptions<
				Awaited<ReturnType<typeof getAuthAuditLogs>>,
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

export function useGetAuthAuditLogsSuspense<
	TData = Awaited<ReturnType<typeof getAuthAuditLogs>>,
	TError = ErrorType<void>,
>(
	params?: GetAuthAuditLogsParams,
	options?: {
		query?: Partial<
			UseSuspenseQueryOptions<
				Awaited<ReturnType<typeof getAuthAuditLogs>>,
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

export function useGetAuthAuditLogsSuspense<
	TData = Awaited<ReturnType<typeof getAuthAuditLogs>>,
	TError = ErrorType<void>,
>(
	params?: GetAuthAuditLogsParams,
	options?: {
		query?: Partial<
			UseSuspenseQueryOptions<
				Awaited<ReturnType<typeof getAuthAuditLogs>>,
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
 * @summary 인증 감사 로그 조회
 */

export function useGetAuthAuditLogsSuspense<
	TData = Awaited<ReturnType<typeof getAuthAuditLogs>>,
	TError = ErrorType<void>,
>(
	params?: GetAuthAuditLogsParams,
	options?: {
		query?: Partial<
			UseSuspenseQueryOptions<
				Awaited<ReturnType<typeof getAuthAuditLogs>>,
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
	const queryOptions = getGetAuthAuditLogsSuspenseQueryOptions(params, options);

	const query = useSuspenseQuery(
		queryOptions,
		queryClient,
	) as UseSuspenseQueryResult<TData, TError> & {
		queryKey: DataTag<QueryKey, TData, TError>;
	};

	query.queryKey = queryOptions.queryKey;

	return query;
}

export const getGetAuthAuditLogsSuspenseInfiniteQueryOptions = <
	TData = InfiniteData<Awaited<ReturnType<typeof getAuthAuditLogs>>>,
	TError = ErrorType<void>,
>(
	params?: GetAuthAuditLogsParams,
	options?: {
		query?: Partial<
			UseSuspenseInfiniteQueryOptions<
				Awaited<ReturnType<typeof getAuthAuditLogs>>,
				TError,
				TData
			>
		>;
		request?: SecondParameter<typeof customIdpInstance>;
	},
) => {
	const { query: queryOptions, request: requestOptions } = options ?? {};

	const queryKey =
		queryOptions?.queryKey ?? getGetAuthAuditLogsInfiniteQueryKey(params);

	const queryFn: QueryFunction<
		Awaited<ReturnType<typeof getAuthAuditLogs>>
	> = ({ signal }) => getAuthAuditLogs(params, requestOptions, signal);

	return {
		queryKey,
		queryFn,
		...queryOptions,
	} as UseSuspenseInfiniteQueryOptions<
		Awaited<ReturnType<typeof getAuthAuditLogs>>,
		TError,
		TData
	> & { queryKey: DataTag<QueryKey, TData, TError> };
};

export type GetAuthAuditLogsSuspenseInfiniteQueryResult = NonNullable<
	Awaited<ReturnType<typeof getAuthAuditLogs>>
>;

export type GetAuthAuditLogsSuspenseInfiniteQueryError = ErrorType<void>;

export function useGetAuthAuditLogsSuspenseInfinite<
	TData = InfiniteData<Awaited<ReturnType<typeof getAuthAuditLogs>>>,
	TError = ErrorType<void>,
>(
	params: undefined | GetAuthAuditLogsParams,
	options: {
		query: Partial<
			UseSuspenseInfiniteQueryOptions<
				Awaited<ReturnType<typeof getAuthAuditLogs>>,
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

export function useGetAuthAuditLogsSuspenseInfinite<
	TData = InfiniteData<Awaited<ReturnType<typeof getAuthAuditLogs>>>,
	TError = ErrorType<void>,
>(
	params?: GetAuthAuditLogsParams,
	options?: {
		query?: Partial<
			UseSuspenseInfiniteQueryOptions<
				Awaited<ReturnType<typeof getAuthAuditLogs>>,
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

export function useGetAuthAuditLogsSuspenseInfinite<
	TData = InfiniteData<Awaited<ReturnType<typeof getAuthAuditLogs>>>,
	TError = ErrorType<void>,
>(
	params?: GetAuthAuditLogsParams,
	options?: {
		query?: Partial<
			UseSuspenseInfiniteQueryOptions<
				Awaited<ReturnType<typeof getAuthAuditLogs>>,
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
 * @summary 인증 감사 로그 조회
 */

export function useGetAuthAuditLogsSuspenseInfinite<
	TData = InfiniteData<Awaited<ReturnType<typeof getAuthAuditLogs>>>,
	TError = ErrorType<void>,
>(
	params?: GetAuthAuditLogsParams,
	options?: {
		query?: Partial<
			UseSuspenseInfiniteQueryOptions<
				Awaited<ReturnType<typeof getAuthAuditLogs>>,
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
	const queryOptions = getGetAuthAuditLogsSuspenseInfiniteQueryOptions(
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
 * @summary 인증 감사 로그 조회
 */
export const prefetchGetAuthAuditLogsInfiniteQuery = async <
	TData = Awaited<ReturnType<typeof getAuthAuditLogs>>,
	TError = ErrorType<void>,
>(
	queryClient: QueryClient,
	params?: GetAuthAuditLogsParams,
	options?: {
		query?: Partial<
			UseSuspenseInfiniteQueryOptions<
				Awaited<ReturnType<typeof getAuthAuditLogs>>,
				TError,
				TData
			>
		>;
		request?: SecondParameter<typeof customIdpInstance>;
	},
): Promise<QueryClient> => {
	const queryOptions = getGetAuthAuditLogsSuspenseInfiniteQueryOptions(
		params,
		options,
	);

	await queryClient.prefetchInfiniteQuery(queryOptions);

	return queryClient;
};

/**
 * 오늘의 로그인 성공/실패/잠금 건수와 전체 건수를 조회합니다.
 * @summary 감사 로그 통계 조회
 */
export const getAuthAuditLogStats = (
	options?: SecondParameter<typeof customIdpInstance>,
	signal?: AbortSignal,
) => {
	return customIdpInstance<GetAuthAuditLogStats200AllOf>(
		{ url: `/api/v1/auth/audit-logs/stats`, method: "GET", signal },
		options,
	);
};

export const getGetAuthAuditLogStatsQueryKey = () => {
	return [`/api/v1/auth/audit-logs/stats`] as const;
};

export const getGetAuthAuditLogStatsInfiniteQueryKey = () => {
	return ["infinite", `/api/v1/auth/audit-logs/stats`] as const;
};

export const getGetAuthAuditLogStatsQueryOptions = <
	TData = Awaited<ReturnType<typeof getAuthAuditLogStats>>,
	TError = ErrorType<void>,
>(options?: {
	query?: Partial<
		UseQueryOptions<
			Awaited<ReturnType<typeof getAuthAuditLogStats>>,
			TError,
			TData
		>
	>;
	request?: SecondParameter<typeof customIdpInstance>;
}) => {
	const { query: queryOptions, request: requestOptions } = options ?? {};

	const queryKey = queryOptions?.queryKey ?? getGetAuthAuditLogStatsQueryKey();

	const queryFn: QueryFunction<
		Awaited<ReturnType<typeof getAuthAuditLogStats>>
	> = ({ signal }) => getAuthAuditLogStats(requestOptions, signal);

	return { queryKey, queryFn, ...queryOptions } as UseQueryOptions<
		Awaited<ReturnType<typeof getAuthAuditLogStats>>,
		TError,
		TData
	> & { queryKey: DataTag<QueryKey, TData, TError> };
};

export type GetAuthAuditLogStatsQueryResult = NonNullable<
	Awaited<ReturnType<typeof getAuthAuditLogStats>>
>;

export type GetAuthAuditLogStatsQueryError = ErrorType<void>;

export function useGetAuthAuditLogStats<
	TData = Awaited<ReturnType<typeof getAuthAuditLogStats>>,
	TError = ErrorType<void>,
>(
	options: {
		query: Partial<
			UseQueryOptions<
				Awaited<ReturnType<typeof getAuthAuditLogStats>>,
				TError,
				TData
			>
		> &
			Pick<
				DefinedInitialDataOptions<
					Awaited<ReturnType<typeof getAuthAuditLogStats>>,
					TError,
					Awaited<ReturnType<typeof getAuthAuditLogStats>>
				>,
				"initialData"
			>;
		request?: SecondParameter<typeof customIdpInstance>;
	},
	queryClient?: QueryClient,
): DefinedUseQueryResult<TData, TError> & {
	queryKey: DataTag<QueryKey, TData, TError>;
};

export function useGetAuthAuditLogStats<
	TData = Awaited<ReturnType<typeof getAuthAuditLogStats>>,
	TError = ErrorType<void>,
>(
	options?: {
		query?: Partial<
			UseQueryOptions<
				Awaited<ReturnType<typeof getAuthAuditLogStats>>,
				TError,
				TData
			>
		> &
			Pick<
				UndefinedInitialDataOptions<
					Awaited<ReturnType<typeof getAuthAuditLogStats>>,
					TError,
					Awaited<ReturnType<typeof getAuthAuditLogStats>>
				>,
				"initialData"
			>;
		request?: SecondParameter<typeof customIdpInstance>;
	},
	queryClient?: QueryClient,
): UseQueryResult<TData, TError> & {
	queryKey: DataTag<QueryKey, TData, TError>;
};

export function useGetAuthAuditLogStats<
	TData = Awaited<ReturnType<typeof getAuthAuditLogStats>>,
	TError = ErrorType<void>,
>(
	options?: {
		query?: Partial<
			UseQueryOptions<
				Awaited<ReturnType<typeof getAuthAuditLogStats>>,
				TError,
				TData
			>
		>;
		request?: SecondParameter<typeof customIdpInstance>;
	},
	queryClient?: QueryClient,
): UseQueryResult<TData, TError> & {
	queryKey: DataTag<QueryKey, TData, TError>;
};

/**
 * @summary 감사 로그 통계 조회
 */

export function useGetAuthAuditLogStats<
	TData = Awaited<ReturnType<typeof getAuthAuditLogStats>>,
	TError = ErrorType<void>,
>(
	options?: {
		query?: Partial<
			UseQueryOptions<
				Awaited<ReturnType<typeof getAuthAuditLogStats>>,
				TError,
				TData
			>
		>;
		request?: SecondParameter<typeof customIdpInstance>;
	},
	queryClient?: QueryClient,
): UseQueryResult<TData, TError> & {
	queryKey: DataTag<QueryKey, TData, TError>;
} {
	const queryOptions = getGetAuthAuditLogStatsQueryOptions(options);

	const query = useQuery(queryOptions, queryClient) as UseQueryResult<
		TData,
		TError
	> & { queryKey: DataTag<QueryKey, TData, TError> };

	query.queryKey = queryOptions.queryKey;

	return query;
}

/**
 * @summary 감사 로그 통계 조회
 */
export const prefetchGetAuthAuditLogStatsQuery = async <
	TData = Awaited<ReturnType<typeof getAuthAuditLogStats>>,
	TError = ErrorType<void>,
>(
	queryClient: QueryClient,
	options?: {
		query?: Partial<
			UseQueryOptions<
				Awaited<ReturnType<typeof getAuthAuditLogStats>>,
				TError,
				TData
			>
		>;
		request?: SecondParameter<typeof customIdpInstance>;
	},
): Promise<QueryClient> => {
	const queryOptions = getGetAuthAuditLogStatsQueryOptions(options);

	await queryClient.prefetchQuery(queryOptions);

	return queryClient;
};

export const getGetAuthAuditLogStatsSuspenseQueryOptions = <
	TData = Awaited<ReturnType<typeof getAuthAuditLogStats>>,
	TError = ErrorType<void>,
>(options?: {
	query?: Partial<
		UseSuspenseQueryOptions<
			Awaited<ReturnType<typeof getAuthAuditLogStats>>,
			TError,
			TData
		>
	>;
	request?: SecondParameter<typeof customIdpInstance>;
}) => {
	const { query: queryOptions, request: requestOptions } = options ?? {};

	const queryKey = queryOptions?.queryKey ?? getGetAuthAuditLogStatsQueryKey();

	const queryFn: QueryFunction<
		Awaited<ReturnType<typeof getAuthAuditLogStats>>
	> = ({ signal }) => getAuthAuditLogStats(requestOptions, signal);

	return { queryKey, queryFn, ...queryOptions } as UseSuspenseQueryOptions<
		Awaited<ReturnType<typeof getAuthAuditLogStats>>,
		TError,
		TData
	> & { queryKey: DataTag<QueryKey, TData, TError> };
};

export type GetAuthAuditLogStatsSuspenseQueryResult = NonNullable<
	Awaited<ReturnType<typeof getAuthAuditLogStats>>
>;

export type GetAuthAuditLogStatsSuspenseQueryError = ErrorType<void>;

export function useGetAuthAuditLogStatsSuspense<
	TData = Awaited<ReturnType<typeof getAuthAuditLogStats>>,
	TError = ErrorType<void>,
>(
	options: {
		query: Partial<
			UseSuspenseQueryOptions<
				Awaited<ReturnType<typeof getAuthAuditLogStats>>,
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

export function useGetAuthAuditLogStatsSuspense<
	TData = Awaited<ReturnType<typeof getAuthAuditLogStats>>,
	TError = ErrorType<void>,
>(
	options?: {
		query?: Partial<
			UseSuspenseQueryOptions<
				Awaited<ReturnType<typeof getAuthAuditLogStats>>,
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

export function useGetAuthAuditLogStatsSuspense<
	TData = Awaited<ReturnType<typeof getAuthAuditLogStats>>,
	TError = ErrorType<void>,
>(
	options?: {
		query?: Partial<
			UseSuspenseQueryOptions<
				Awaited<ReturnType<typeof getAuthAuditLogStats>>,
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
 * @summary 감사 로그 통계 조회
 */

export function useGetAuthAuditLogStatsSuspense<
	TData = Awaited<ReturnType<typeof getAuthAuditLogStats>>,
	TError = ErrorType<void>,
>(
	options?: {
		query?: Partial<
			UseSuspenseQueryOptions<
				Awaited<ReturnType<typeof getAuthAuditLogStats>>,
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
	const queryOptions = getGetAuthAuditLogStatsSuspenseQueryOptions(options);

	const query = useSuspenseQuery(
		queryOptions,
		queryClient,
	) as UseSuspenseQueryResult<TData, TError> & {
		queryKey: DataTag<QueryKey, TData, TError>;
	};

	query.queryKey = queryOptions.queryKey;

	return query;
}

export const getGetAuthAuditLogStatsSuspenseInfiniteQueryOptions = <
	TData = InfiniteData<Awaited<ReturnType<typeof getAuthAuditLogStats>>>,
	TError = ErrorType<void>,
>(options?: {
	query?: Partial<
		UseSuspenseInfiniteQueryOptions<
			Awaited<ReturnType<typeof getAuthAuditLogStats>>,
			TError,
			TData
		>
	>;
	request?: SecondParameter<typeof customIdpInstance>;
}) => {
	const { query: queryOptions, request: requestOptions } = options ?? {};

	const queryKey =
		queryOptions?.queryKey ?? getGetAuthAuditLogStatsInfiniteQueryKey();

	const queryFn: QueryFunction<
		Awaited<ReturnType<typeof getAuthAuditLogStats>>
	> = ({ signal }) => getAuthAuditLogStats(requestOptions, signal);

	return {
		queryKey,
		queryFn,
		...queryOptions,
	} as UseSuspenseInfiniteQueryOptions<
		Awaited<ReturnType<typeof getAuthAuditLogStats>>,
		TError,
		TData
	> & { queryKey: DataTag<QueryKey, TData, TError> };
};

export type GetAuthAuditLogStatsSuspenseInfiniteQueryResult = NonNullable<
	Awaited<ReturnType<typeof getAuthAuditLogStats>>
>;

export type GetAuthAuditLogStatsSuspenseInfiniteQueryError = ErrorType<void>;

export function useGetAuthAuditLogStatsSuspenseInfinite<
	TData = InfiniteData<Awaited<ReturnType<typeof getAuthAuditLogStats>>>,
	TError = ErrorType<void>,
>(
	options: {
		query: Partial<
			UseSuspenseInfiniteQueryOptions<
				Awaited<ReturnType<typeof getAuthAuditLogStats>>,
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

export function useGetAuthAuditLogStatsSuspenseInfinite<
	TData = InfiniteData<Awaited<ReturnType<typeof getAuthAuditLogStats>>>,
	TError = ErrorType<void>,
>(
	options?: {
		query?: Partial<
			UseSuspenseInfiniteQueryOptions<
				Awaited<ReturnType<typeof getAuthAuditLogStats>>,
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

export function useGetAuthAuditLogStatsSuspenseInfinite<
	TData = InfiniteData<Awaited<ReturnType<typeof getAuthAuditLogStats>>>,
	TError = ErrorType<void>,
>(
	options?: {
		query?: Partial<
			UseSuspenseInfiniteQueryOptions<
				Awaited<ReturnType<typeof getAuthAuditLogStats>>,
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
 * @summary 감사 로그 통계 조회
 */

export function useGetAuthAuditLogStatsSuspenseInfinite<
	TData = InfiniteData<Awaited<ReturnType<typeof getAuthAuditLogStats>>>,
	TError = ErrorType<void>,
>(
	options?: {
		query?: Partial<
			UseSuspenseInfiniteQueryOptions<
				Awaited<ReturnType<typeof getAuthAuditLogStats>>,
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
	const queryOptions =
		getGetAuthAuditLogStatsSuspenseInfiniteQueryOptions(options);

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
 * @summary 감사 로그 통계 조회
 */
export const prefetchGetAuthAuditLogStatsInfiniteQuery = async <
	TData = Awaited<ReturnType<typeof getAuthAuditLogStats>>,
	TError = ErrorType<void>,
>(
	queryClient: QueryClient,
	options?: {
		query?: Partial<
			UseSuspenseInfiniteQueryOptions<
				Awaited<ReturnType<typeof getAuthAuditLogStats>>,
				TError,
				TData
			>
		>;
		request?: SecondParameter<typeof customIdpInstance>;
	},
): Promise<QueryClient> => {
	const queryOptions =
		getGetAuthAuditLogStatsSuspenseInfiniteQueryOptions(options);

	await queryClient.prefetchInfiniteQuery(queryOptions);

	return queryClient;
};

/**
 * 현재 비밀번호를 확인 후 새 비밀번호로 변경합니다. 비밀번호 정책 검증 및 재사용 방지가 적용됩니다.
 * @summary 비밀번호 변경
 */
export const changePassword = (
	changePasswordDto: BodyType<ChangePasswordDto>,
	options?: SecondParameter<typeof customIdpInstance>,
	signal?: AbortSignal,
) => {
	return customIdpInstance<ChangePassword200AllOf>(
		{
			url: `/api/v1/auth/change-password`,
			method: "POST",
			headers: { "Content-Type": "application/json" },
			data: changePasswordDto,
			signal,
		},
		options,
	);
};

export const getChangePasswordMutationOptions = <
	TError = ErrorType<void>,
	TContext = unknown,
>(options?: {
	mutation?: UseMutationOptions<
		Awaited<ReturnType<typeof changePassword>>,
		TError,
		{ data: BodyType<ChangePasswordDto> },
		TContext
	>;
	request?: SecondParameter<typeof customIdpInstance>;
}): UseMutationOptions<
	Awaited<ReturnType<typeof changePassword>>,
	TError,
	{ data: BodyType<ChangePasswordDto> },
	TContext
> => {
	const mutationKey = ["changePassword"];
	const { mutation: mutationOptions, request: requestOptions } = options
		? options.mutation &&
			"mutationKey" in options.mutation &&
			options.mutation.mutationKey
			? options
			: { ...options, mutation: { ...options.mutation, mutationKey } }
		: { mutation: { mutationKey }, request: undefined };

	const mutationFn: MutationFunction<
		Awaited<ReturnType<typeof changePassword>>,
		{ data: BodyType<ChangePasswordDto> }
	> = (props) => {
		const { data } = props ?? {};

		return changePassword(data, requestOptions);
	};

	return { mutationFn, ...mutationOptions };
};

export type ChangePasswordMutationResult = NonNullable<
	Awaited<ReturnType<typeof changePassword>>
>;

export type ChangePasswordMutationBody = BodyType<ChangePasswordDto>;

export type ChangePasswordMutationError = ErrorType<void>;

/**
 * @summary 비밀번호 변경
 */
export const useChangePassword = <TError = ErrorType<void>, TContext = unknown>(
	options?: {
		mutation?: UseMutationOptions<
			Awaited<ReturnType<typeof changePassword>>,
			TError,
			{ data: BodyType<ChangePasswordDto> },
			TContext
		>;
		request?: SecondParameter<typeof customIdpInstance>;
	},
	queryClient?: QueryClient,
): UseMutationResult<
	Awaited<ReturnType<typeof changePassword>>,
	TError,
	{ data: BodyType<ChangePasswordDto> },
	TContext
> => {
	const mutationOptions = getChangePasswordMutationOptions(options);

	return useMutation(mutationOptions, queryClient);
};

/**
 * 잠긴 계정을 해제합니다. FULL_ACCESS 권한이 필요합니다.
 * @summary 계정 잠금 해제
 */
export const unlockAccount = (
	userId: string,
	options?: SecondParameter<typeof customIdpInstance>,
	signal?: AbortSignal,
) => {
	return customIdpInstance<UnlockAccount200AllOf>(
		{ url: `/api/v1/auth/users/${userId}/unlock`, method: "POST", signal },
		options,
	);
};

export const getUnlockAccountMutationOptions = <
	TError = ErrorType<void>,
	TContext = unknown,
>(options?: {
	mutation?: UseMutationOptions<
		Awaited<ReturnType<typeof unlockAccount>>,
		TError,
		{ userId: string },
		TContext
	>;
	request?: SecondParameter<typeof customIdpInstance>;
}): UseMutationOptions<
	Awaited<ReturnType<typeof unlockAccount>>,
	TError,
	{ userId: string },
	TContext
> => {
	const mutationKey = ["unlockAccount"];
	const { mutation: mutationOptions, request: requestOptions } = options
		? options.mutation &&
			"mutationKey" in options.mutation &&
			options.mutation.mutationKey
			? options
			: { ...options, mutation: { ...options.mutation, mutationKey } }
		: { mutation: { mutationKey }, request: undefined };

	const mutationFn: MutationFunction<
		Awaited<ReturnType<typeof unlockAccount>>,
		{ userId: string }
	> = (props) => {
		const { userId } = props ?? {};

		return unlockAccount(userId, requestOptions);
	};

	return { mutationFn, ...mutationOptions };
};

export type UnlockAccountMutationResult = NonNullable<
	Awaited<ReturnType<typeof unlockAccount>>
>;

export type UnlockAccountMutationError = ErrorType<void>;

/**
 * @summary 계정 잠금 해제
 */
export const useUnlockAccount = <TError = ErrorType<void>, TContext = unknown>(
	options?: {
		mutation?: UseMutationOptions<
			Awaited<ReturnType<typeof unlockAccount>>,
			TError,
			{ userId: string },
			TContext
		>;
		request?: SecondParameter<typeof customIdpInstance>;
	},
	queryClient?: QueryClient,
): UseMutationResult<
	Awaited<ReturnType<typeof unlockAccount>>,
	TError,
	{ userId: string },
	TContext
> => {
	const mutationOptions = getUnlockAccountMutationOptions(options);

	return useMutation(mutationOptions, queryClient);
};

/**
 * 임시 비밀번호를 생성하여 이메일로 발송합니다. FULL_ACCESS 권한이 필요합니다.
 * @summary 비밀번호 강제 재설정
 */
export const forceResetPassword = (
	userId: string,
	options?: SecondParameter<typeof customIdpInstance>,
	signal?: AbortSignal,
) => {
	return customIdpInstance<ForceResetPassword200AllOf>(
		{
			url: `/api/v1/auth/users/${userId}/force-reset-password`,
			method: "POST",
			signal,
		},
		options,
	);
};

export const getForceResetPasswordMutationOptions = <
	TError = ErrorType<void>,
	TContext = unknown,
>(options?: {
	mutation?: UseMutationOptions<
		Awaited<ReturnType<typeof forceResetPassword>>,
		TError,
		{ userId: string },
		TContext
	>;
	request?: SecondParameter<typeof customIdpInstance>;
}): UseMutationOptions<
	Awaited<ReturnType<typeof forceResetPassword>>,
	TError,
	{ userId: string },
	TContext
> => {
	const mutationKey = ["forceResetPassword"];
	const { mutation: mutationOptions, request: requestOptions } = options
		? options.mutation &&
			"mutationKey" in options.mutation &&
			options.mutation.mutationKey
			? options
			: { ...options, mutation: { ...options.mutation, mutationKey } }
		: { mutation: { mutationKey }, request: undefined };

	const mutationFn: MutationFunction<
		Awaited<ReturnType<typeof forceResetPassword>>,
		{ userId: string }
	> = (props) => {
		const { userId } = props ?? {};

		return forceResetPassword(userId, requestOptions);
	};

	return { mutationFn, ...mutationOptions };
};

export type ForceResetPasswordMutationResult = NonNullable<
	Awaited<ReturnType<typeof forceResetPassword>>
>;

export type ForceResetPasswordMutationError = ErrorType<void>;

/**
 * @summary 비밀번호 강제 재설정
 */
export const useForceResetPassword = <
	TError = ErrorType<void>,
	TContext = unknown,
>(
	options?: {
		mutation?: UseMutationOptions<
			Awaited<ReturnType<typeof forceResetPassword>>,
			TError,
			{ userId: string },
			TContext
		>;
		request?: SecondParameter<typeof customIdpInstance>;
	},
	queryClient?: QueryClient,
): UseMutationResult<
	Awaited<ReturnType<typeof forceResetPassword>>,
	TError,
	{ userId: string },
	TContext
> => {
	const mutationOptions = getForceResetPasswordMutationOptions(options);

	return useMutation(mutationOptions, queryClient);
};

/**
 * 특정 사용자의 모든 세션을 강제 종료합니다. FULL_ACCESS 권한이 필요합니다.
 * @summary 사용자 전체 세션 무효화
 */
export const invalidateUserSessions = (
	userId: string,
	options?: SecondParameter<typeof customIdpInstance>,
	signal?: AbortSignal,
) => {
	return customIdpInstance<InvalidateUserSessions200AllOf>(
		{
			url: `/api/v1/auth/users/${userId}/invalidate-sessions`,
			method: "POST",
			signal,
		},
		options,
	);
};

export const getInvalidateUserSessionsMutationOptions = <
	TError = ErrorType<void>,
	TContext = unknown,
>(options?: {
	mutation?: UseMutationOptions<
		Awaited<ReturnType<typeof invalidateUserSessions>>,
		TError,
		{ userId: string },
		TContext
	>;
	request?: SecondParameter<typeof customIdpInstance>;
}): UseMutationOptions<
	Awaited<ReturnType<typeof invalidateUserSessions>>,
	TError,
	{ userId: string },
	TContext
> => {
	const mutationKey = ["invalidateUserSessions"];
	const { mutation: mutationOptions, request: requestOptions } = options
		? options.mutation &&
			"mutationKey" in options.mutation &&
			options.mutation.mutationKey
			? options
			: { ...options, mutation: { ...options.mutation, mutationKey } }
		: { mutation: { mutationKey }, request: undefined };

	const mutationFn: MutationFunction<
		Awaited<ReturnType<typeof invalidateUserSessions>>,
		{ userId: string }
	> = (props) => {
		const { userId } = props ?? {};

		return invalidateUserSessions(userId, requestOptions);
	};

	return { mutationFn, ...mutationOptions };
};

export type InvalidateUserSessionsMutationResult = NonNullable<
	Awaited<ReturnType<typeof invalidateUserSessions>>
>;

export type InvalidateUserSessionsMutationError = ErrorType<void>;

/**
 * @summary 사용자 전체 세션 무효화
 */
export const useInvalidateUserSessions = <
	TError = ErrorType<void>,
	TContext = unknown,
>(
	options?: {
		mutation?: UseMutationOptions<
			Awaited<ReturnType<typeof invalidateUserSessions>>,
			TError,
			{ userId: string },
			TContext
		>;
		request?: SecondParameter<typeof customIdpInstance>;
	},
	queryClient?: QueryClient,
): UseMutationResult<
	Awaited<ReturnType<typeof invalidateUserSessions>>,
	TError,
	{ userId: string },
	TContext
> => {
	const mutationOptions = getInvalidateUserSessionsMutationOptions(options);

	return useMutation(mutationOptions, queryClient);
};

/**
 * 현재 인증된 사용자의 모든 활성 세션 목록을 반환합니다. 현재 세션에 isCurrent=true가 표시됩니다.
 * @summary 내 활성 세션 목록
 */
export const getMySessions = (
	options?: SecondParameter<typeof customIdpInstance>,
	signal?: AbortSignal,
) => {
	return customIdpInstance<GetMySessions200AllOf>(
		{ url: `/api/v1/auth/my-sessions`, method: "GET", signal },
		options,
	);
};

export const getGetMySessionsQueryKey = () => {
	return [`/api/v1/auth/my-sessions`] as const;
};

export const getGetMySessionsInfiniteQueryKey = () => {
	return ["infinite", `/api/v1/auth/my-sessions`] as const;
};

export const getGetMySessionsQueryOptions = <
	TData = Awaited<ReturnType<typeof getMySessions>>,
	TError = ErrorType<void>,
>(options?: {
	query?: Partial<
		UseQueryOptions<Awaited<ReturnType<typeof getMySessions>>, TError, TData>
	>;
	request?: SecondParameter<typeof customIdpInstance>;
}) => {
	const { query: queryOptions, request: requestOptions } = options ?? {};

	const queryKey = queryOptions?.queryKey ?? getGetMySessionsQueryKey();

	const queryFn: QueryFunction<Awaited<ReturnType<typeof getMySessions>>> = ({
		signal,
	}) => getMySessions(requestOptions, signal);

	return { queryKey, queryFn, ...queryOptions } as UseQueryOptions<
		Awaited<ReturnType<typeof getMySessions>>,
		TError,
		TData
	> & { queryKey: DataTag<QueryKey, TData, TError> };
};

export type GetMySessionsQueryResult = NonNullable<
	Awaited<ReturnType<typeof getMySessions>>
>;

export type GetMySessionsQueryError = ErrorType<void>;

export function useGetMySessions<
	TData = Awaited<ReturnType<typeof getMySessions>>,
	TError = ErrorType<void>,
>(
	options: {
		query: Partial<
			UseQueryOptions<Awaited<ReturnType<typeof getMySessions>>, TError, TData>
		> &
			Pick<
				DefinedInitialDataOptions<
					Awaited<ReturnType<typeof getMySessions>>,
					TError,
					Awaited<ReturnType<typeof getMySessions>>
				>,
				"initialData"
			>;
		request?: SecondParameter<typeof customIdpInstance>;
	},
	queryClient?: QueryClient,
): DefinedUseQueryResult<TData, TError> & {
	queryKey: DataTag<QueryKey, TData, TError>;
};

export function useGetMySessions<
	TData = Awaited<ReturnType<typeof getMySessions>>,
	TError = ErrorType<void>,
>(
	options?: {
		query?: Partial<
			UseQueryOptions<Awaited<ReturnType<typeof getMySessions>>, TError, TData>
		> &
			Pick<
				UndefinedInitialDataOptions<
					Awaited<ReturnType<typeof getMySessions>>,
					TError,
					Awaited<ReturnType<typeof getMySessions>>
				>,
				"initialData"
			>;
		request?: SecondParameter<typeof customIdpInstance>;
	},
	queryClient?: QueryClient,
): UseQueryResult<TData, TError> & {
	queryKey: DataTag<QueryKey, TData, TError>;
};

export function useGetMySessions<
	TData = Awaited<ReturnType<typeof getMySessions>>,
	TError = ErrorType<void>,
>(
	options?: {
		query?: Partial<
			UseQueryOptions<Awaited<ReturnType<typeof getMySessions>>, TError, TData>
		>;
		request?: SecondParameter<typeof customIdpInstance>;
	},
	queryClient?: QueryClient,
): UseQueryResult<TData, TError> & {
	queryKey: DataTag<QueryKey, TData, TError>;
};

/**
 * @summary 내 활성 세션 목록
 */

export function useGetMySessions<
	TData = Awaited<ReturnType<typeof getMySessions>>,
	TError = ErrorType<void>,
>(
	options?: {
		query?: Partial<
			UseQueryOptions<Awaited<ReturnType<typeof getMySessions>>, TError, TData>
		>;
		request?: SecondParameter<typeof customIdpInstance>;
	},
	queryClient?: QueryClient,
): UseQueryResult<TData, TError> & {
	queryKey: DataTag<QueryKey, TData, TError>;
} {
	const queryOptions = getGetMySessionsQueryOptions(options);

	const query = useQuery(queryOptions, queryClient) as UseQueryResult<
		TData,
		TError
	> & { queryKey: DataTag<QueryKey, TData, TError> };

	query.queryKey = queryOptions.queryKey;

	return query;
}

/**
 * @summary 내 활성 세션 목록
 */
export const prefetchGetMySessionsQuery = async <
	TData = Awaited<ReturnType<typeof getMySessions>>,
	TError = ErrorType<void>,
>(
	queryClient: QueryClient,
	options?: {
		query?: Partial<
			UseQueryOptions<Awaited<ReturnType<typeof getMySessions>>, TError, TData>
		>;
		request?: SecondParameter<typeof customIdpInstance>;
	},
): Promise<QueryClient> => {
	const queryOptions = getGetMySessionsQueryOptions(options);

	await queryClient.prefetchQuery(queryOptions);

	return queryClient;
};

export const getGetMySessionsSuspenseQueryOptions = <
	TData = Awaited<ReturnType<typeof getMySessions>>,
	TError = ErrorType<void>,
>(options?: {
	query?: Partial<
		UseSuspenseQueryOptions<
			Awaited<ReturnType<typeof getMySessions>>,
			TError,
			TData
		>
	>;
	request?: SecondParameter<typeof customIdpInstance>;
}) => {
	const { query: queryOptions, request: requestOptions } = options ?? {};

	const queryKey = queryOptions?.queryKey ?? getGetMySessionsQueryKey();

	const queryFn: QueryFunction<Awaited<ReturnType<typeof getMySessions>>> = ({
		signal,
	}) => getMySessions(requestOptions, signal);

	return { queryKey, queryFn, ...queryOptions } as UseSuspenseQueryOptions<
		Awaited<ReturnType<typeof getMySessions>>,
		TError,
		TData
	> & { queryKey: DataTag<QueryKey, TData, TError> };
};

export type GetMySessionsSuspenseQueryResult = NonNullable<
	Awaited<ReturnType<typeof getMySessions>>
>;

export type GetMySessionsSuspenseQueryError = ErrorType<void>;

export function useGetMySessionsSuspense<
	TData = Awaited<ReturnType<typeof getMySessions>>,
	TError = ErrorType<void>,
>(
	options: {
		query: Partial<
			UseSuspenseQueryOptions<
				Awaited<ReturnType<typeof getMySessions>>,
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

export function useGetMySessionsSuspense<
	TData = Awaited<ReturnType<typeof getMySessions>>,
	TError = ErrorType<void>,
>(
	options?: {
		query?: Partial<
			UseSuspenseQueryOptions<
				Awaited<ReturnType<typeof getMySessions>>,
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

export function useGetMySessionsSuspense<
	TData = Awaited<ReturnType<typeof getMySessions>>,
	TError = ErrorType<void>,
>(
	options?: {
		query?: Partial<
			UseSuspenseQueryOptions<
				Awaited<ReturnType<typeof getMySessions>>,
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
 * @summary 내 활성 세션 목록
 */

export function useGetMySessionsSuspense<
	TData = Awaited<ReturnType<typeof getMySessions>>,
	TError = ErrorType<void>,
>(
	options?: {
		query?: Partial<
			UseSuspenseQueryOptions<
				Awaited<ReturnType<typeof getMySessions>>,
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
	const queryOptions = getGetMySessionsSuspenseQueryOptions(options);

	const query = useSuspenseQuery(
		queryOptions,
		queryClient,
	) as UseSuspenseQueryResult<TData, TError> & {
		queryKey: DataTag<QueryKey, TData, TError>;
	};

	query.queryKey = queryOptions.queryKey;

	return query;
}

export const getGetMySessionsSuspenseInfiniteQueryOptions = <
	TData = InfiniteData<Awaited<ReturnType<typeof getMySessions>>>,
	TError = ErrorType<void>,
>(options?: {
	query?: Partial<
		UseSuspenseInfiniteQueryOptions<
			Awaited<ReturnType<typeof getMySessions>>,
			TError,
			TData
		>
	>;
	request?: SecondParameter<typeof customIdpInstance>;
}) => {
	const { query: queryOptions, request: requestOptions } = options ?? {};

	const queryKey = queryOptions?.queryKey ?? getGetMySessionsInfiniteQueryKey();

	const queryFn: QueryFunction<Awaited<ReturnType<typeof getMySessions>>> = ({
		signal,
	}) => getMySessions(requestOptions, signal);

	return {
		queryKey,
		queryFn,
		...queryOptions,
	} as UseSuspenseInfiniteQueryOptions<
		Awaited<ReturnType<typeof getMySessions>>,
		TError,
		TData
	> & { queryKey: DataTag<QueryKey, TData, TError> };
};

export type GetMySessionsSuspenseInfiniteQueryResult = NonNullable<
	Awaited<ReturnType<typeof getMySessions>>
>;

export type GetMySessionsSuspenseInfiniteQueryError = ErrorType<void>;

export function useGetMySessionsSuspenseInfinite<
	TData = InfiniteData<Awaited<ReturnType<typeof getMySessions>>>,
	TError = ErrorType<void>,
>(
	options: {
		query: Partial<
			UseSuspenseInfiniteQueryOptions<
				Awaited<ReturnType<typeof getMySessions>>,
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

export function useGetMySessionsSuspenseInfinite<
	TData = InfiniteData<Awaited<ReturnType<typeof getMySessions>>>,
	TError = ErrorType<void>,
>(
	options?: {
		query?: Partial<
			UseSuspenseInfiniteQueryOptions<
				Awaited<ReturnType<typeof getMySessions>>,
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

export function useGetMySessionsSuspenseInfinite<
	TData = InfiniteData<Awaited<ReturnType<typeof getMySessions>>>,
	TError = ErrorType<void>,
>(
	options?: {
		query?: Partial<
			UseSuspenseInfiniteQueryOptions<
				Awaited<ReturnType<typeof getMySessions>>,
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
 * @summary 내 활성 세션 목록
 */

export function useGetMySessionsSuspenseInfinite<
	TData = InfiniteData<Awaited<ReturnType<typeof getMySessions>>>,
	TError = ErrorType<void>,
>(
	options?: {
		query?: Partial<
			UseSuspenseInfiniteQueryOptions<
				Awaited<ReturnType<typeof getMySessions>>,
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
	const queryOptions = getGetMySessionsSuspenseInfiniteQueryOptions(options);

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
 * @summary 내 활성 세션 목록
 */
export const prefetchGetMySessionsInfiniteQuery = async <
	TData = Awaited<ReturnType<typeof getMySessions>>,
	TError = ErrorType<void>,
>(
	queryClient: QueryClient,
	options?: {
		query?: Partial<
			UseSuspenseInfiniteQueryOptions<
				Awaited<ReturnType<typeof getMySessions>>,
				TError,
				TData
			>
		>;
		request?: SecondParameter<typeof customIdpInstance>;
	},
): Promise<QueryClient> => {
	const queryOptions = getGetMySessionsSuspenseInfiniteQueryOptions(options);

	await queryClient.prefetchInfiniteQuery(queryOptions);

	return queryClient;
};

/**
 * 지정된 세션을 종료합니다. 다른 기기의 세션을 종료할 때 사용합니다.
 * @summary 특정 세션 종료
 */
export const revokeSession = (
	sessionId: string,
	options?: SecondParameter<typeof customIdpInstance>,
	signal?: AbortSignal,
) => {
	return customIdpInstance<RevokeSession200AllOf>(
		{
			url: `/api/v1/auth/my-sessions/${sessionId}/revoke`,
			method: "POST",
			signal,
		},
		options,
	);
};

export const getRevokeSessionMutationOptions = <
	TError = ErrorType<void>,
	TContext = unknown,
>(options?: {
	mutation?: UseMutationOptions<
		Awaited<ReturnType<typeof revokeSession>>,
		TError,
		{ sessionId: string },
		TContext
	>;
	request?: SecondParameter<typeof customIdpInstance>;
}): UseMutationOptions<
	Awaited<ReturnType<typeof revokeSession>>,
	TError,
	{ sessionId: string },
	TContext
> => {
	const mutationKey = ["revokeSession"];
	const { mutation: mutationOptions, request: requestOptions } = options
		? options.mutation &&
			"mutationKey" in options.mutation &&
			options.mutation.mutationKey
			? options
			: { ...options, mutation: { ...options.mutation, mutationKey } }
		: { mutation: { mutationKey }, request: undefined };

	const mutationFn: MutationFunction<
		Awaited<ReturnType<typeof revokeSession>>,
		{ sessionId: string }
	> = (props) => {
		const { sessionId } = props ?? {};

		return revokeSession(sessionId, requestOptions);
	};

	return { mutationFn, ...mutationOptions };
};

export type RevokeSessionMutationResult = NonNullable<
	Awaited<ReturnType<typeof revokeSession>>
>;

export type RevokeSessionMutationError = ErrorType<void>;

/**
 * @summary 특정 세션 종료
 */
export const useRevokeSession = <TError = ErrorType<void>, TContext = unknown>(
	options?: {
		mutation?: UseMutationOptions<
			Awaited<ReturnType<typeof revokeSession>>,
			TError,
			{ sessionId: string },
			TContext
		>;
		request?: SecondParameter<typeof customIdpInstance>;
	},
	queryClient?: QueryClient,
): UseMutationResult<
	Awaited<ReturnType<typeof revokeSession>>,
	TError,
	{ sessionId: string },
	TContext
> => {
	const mutationOptions = getRevokeSessionMutationOptions(options);

	return useMutation(mutationOptions, queryClient);
};

/**
 * 현재 세션을 제외한 다른 모든 세션을 종료합니다.
 * @summary 다른 모든 세션 종료
 */
export const revokeOtherSessions = (
	options?: SecondParameter<typeof customIdpInstance>,
	signal?: AbortSignal,
) => {
	return customIdpInstance<RevokeOtherSessions200AllOf>(
		{ url: `/api/v1/auth/my-sessions/revoke-others`, method: "POST", signal },
		options,
	);
};

export const getRevokeOtherSessionsMutationOptions = <
	TError = ErrorType<void>,
	TContext = unknown,
>(options?: {
	mutation?: UseMutationOptions<
		Awaited<ReturnType<typeof revokeOtherSessions>>,
		TError,
		void,
		TContext
	>;
	request?: SecondParameter<typeof customIdpInstance>;
}): UseMutationOptions<
	Awaited<ReturnType<typeof revokeOtherSessions>>,
	TError,
	void,
	TContext
> => {
	const mutationKey = ["revokeOtherSessions"];
	const { mutation: mutationOptions, request: requestOptions } = options
		? options.mutation &&
			"mutationKey" in options.mutation &&
			options.mutation.mutationKey
			? options
			: { ...options, mutation: { ...options.mutation, mutationKey } }
		: { mutation: { mutationKey }, request: undefined };

	const mutationFn: MutationFunction<
		Awaited<ReturnType<typeof revokeOtherSessions>>,
		void
	> = () => {
		return revokeOtherSessions(requestOptions);
	};

	return { mutationFn, ...mutationOptions };
};

export type RevokeOtherSessionsMutationResult = NonNullable<
	Awaited<ReturnType<typeof revokeOtherSessions>>
>;

export type RevokeOtherSessionsMutationError = ErrorType<void>;

/**
 * @summary 다른 모든 세션 종료
 */
export const useRevokeOtherSessions = <
	TError = ErrorType<void>,
	TContext = unknown,
>(
	options?: {
		mutation?: UseMutationOptions<
			Awaited<ReturnType<typeof revokeOtherSessions>>,
			TError,
			void,
			TContext
		>;
		request?: SecondParameter<typeof customIdpInstance>;
	},
	queryClient?: QueryClient,
): UseMutationResult<
	Awaited<ReturnType<typeof revokeOtherSessions>>,
	TError,
	void,
	TContext
> => {
	const mutationOptions = getRevokeOtherSessionsMutationOptions(options);

	return useMutation(mutationOptions, queryClient);
};
