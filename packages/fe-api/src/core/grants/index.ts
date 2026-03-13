/**
 * Generated from the current Orval monolith output.
 * Do not edit manually. Update the upstream Orval output or rerun split-orval-output.mjs.
 */
import {
  useMutation,
  useQuery,
  useSuspenseInfiniteQuery,
  useSuspenseQuery
} from '@tanstack/react-query';
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
  UseSuspenseQueryResult
} from '@tanstack/react-query';

import type { BatchAssignGrantsToRole200AllOf } from "../../model/batchAssignGrantsToRole200AllOf";
import type { BatchGrantRequestDto } from "../../model/batchGrantRequestDto";
import type { GetGrantsByRoleId200AllOf } from "../../model/getGrantsByRoleId200AllOf";
export type { BatchAssignGrantsToRole200AllOf };
export type { BatchGrantRequestDto };
export type { GetGrantsByRoleId200AllOf };
import type { BodyType, ErrorType } from "../../libs/customAxios";
import { customInstance } from "../../libs/customAxios";

type SecondParameter<T extends (...args: never) => unknown> = Parameters<T>[1];

/**
 * 특정 Role에 Ability를 배치로 할당/해제합니다. 전체 목록 동기화 방식입니다.
 * @summary 역할별 권한 배치 할당
 */
export const batchAssignGrantsToRole = (
    roleId: string,
    batchGrantRequestDto: BodyType<BatchGrantRequestDto>,
 options?: SecondParameter<typeof customInstance>,) => {
      
      
      return customInstance<BatchAssignGrantsToRole200AllOf>(
      {url: `/api/v1/grants/roles/${roleId}`, method: 'PUT',
      headers: {'Content-Type': 'application/json', },
      data: batchGrantRequestDto
    },
      options);
    }

export const getBatchAssignGrantsToRoleMutationOptions = <TError = ErrorType<void>,
    TContext = unknown>(options?: { mutation?:UseMutationOptions<Awaited<ReturnType<typeof batchAssignGrantsToRole>>, TError,{roleId: string;data: BodyType<BatchGrantRequestDto>}, TContext>, request?: SecondParameter<typeof customInstance>}
): UseMutationOptions<Awaited<ReturnType<typeof batchAssignGrantsToRole>>, TError,{roleId: string;data: BodyType<BatchGrantRequestDto>}, TContext> => {

const mutationKey = ['batchAssignGrantsToRole'];
const {mutation: mutationOptions, request: requestOptions} = options ?
      options.mutation && 'mutationKey' in options.mutation && options.mutation.mutationKey ?
      options
      : {...options, mutation: {...options.mutation, mutationKey}}
      : {mutation: { mutationKey, }, request: undefined};

      


      const mutationFn: MutationFunction<Awaited<ReturnType<typeof batchAssignGrantsToRole>>, {roleId: string;data: BodyType<BatchGrantRequestDto>}> = (props) => {
          const {roleId,data} = props ?? {};

          return  batchAssignGrantsToRole(roleId,data,requestOptions)
        }

        


  return  { mutationFn, ...mutationOptions }}

export type BatchAssignGrantsToRoleMutationResult = NonNullable<Awaited<ReturnType<typeof batchAssignGrantsToRole>>>

export type BatchAssignGrantsToRoleMutationBody = BodyType<BatchGrantRequestDto>

export type BatchAssignGrantsToRoleMutationError = ErrorType<void>

/**
 * @summary 역할별 권한 배치 할당
 */
export const useBatchAssignGrantsToRole = <TError = ErrorType<void>,
    TContext = unknown>(options?: { mutation?:UseMutationOptions<Awaited<ReturnType<typeof batchAssignGrantsToRole>>, TError,{roleId: string;data: BodyType<BatchGrantRequestDto>}, TContext>, request?: SecondParameter<typeof customInstance>}
 , queryClient?: QueryClient): UseMutationResult<
        Awaited<ReturnType<typeof batchAssignGrantsToRole>>,
        TError,
        {roleId: string;data: BodyType<BatchGrantRequestDto>},
        TContext
      > => {

      const mutationOptions = getBatchAssignGrantsToRoleMutationOptions(options);

      return useMutation(mutationOptions, queryClient);
    }

/**
 * 특정 Role에 할당된 Grant 목록을 조회합니다.
 * @summary 역할별 권한 조회
 */
export const getGrantsByRoleId = (
    roleId: string,
 options?: SecondParameter<typeof customInstance>,signal?: AbortSignal
) => {
      
      
      return customInstance<GetGrantsByRoleId200AllOf>(
      {url: `/api/v1/grants/roles/${roleId}`, method: 'GET', signal
    },
      options);
    }

export const getGetGrantsByRoleIdQueryKey = (roleId?: string,) => {
    return [
    `/api/v1/grants/roles/${roleId}`
    ] as const;
    }

export const getGetGrantsByRoleIdInfiniteQueryKey = (roleId?: string,) => {
    return [
    'infinite', `/api/v1/grants/roles/${roleId}`
    ] as const;
    }

export const getGetGrantsByRoleIdQueryOptions = <TData = Awaited<ReturnType<typeof getGrantsByRoleId>>, TError = ErrorType<void>>(roleId: string, options?: { query?:Partial<UseQueryOptions<Awaited<ReturnType<typeof getGrantsByRoleId>>, TError, TData>>, request?: SecondParameter<typeof customInstance>}
) => {

const {query: queryOptions, request: requestOptions} = options ?? {};

  const queryKey =  queryOptions?.queryKey ?? getGetGrantsByRoleIdQueryKey(roleId);

  

    const queryFn: QueryFunction<Awaited<ReturnType<typeof getGrantsByRoleId>>> = ({ signal }) => getGrantsByRoleId(roleId, requestOptions, signal);

      

      

   return  { queryKey, queryFn, enabled: !!(roleId), ...queryOptions} as UseQueryOptions<Awaited<ReturnType<typeof getGrantsByRoleId>>, TError, TData> & { queryKey: DataTag<QueryKey, TData, TError> }
}

export type GetGrantsByRoleIdQueryResult = NonNullable<Awaited<ReturnType<typeof getGrantsByRoleId>>>

export type GetGrantsByRoleIdQueryError = ErrorType<void>

export function useGetGrantsByRoleId<TData = Awaited<ReturnType<typeof getGrantsByRoleId>>, TError = ErrorType<void>>(
 roleId: string, options: { query:Partial<UseQueryOptions<Awaited<ReturnType<typeof getGrantsByRoleId>>, TError, TData>> & Pick<
        DefinedInitialDataOptions<
          Awaited<ReturnType<typeof getGrantsByRoleId>>,
          TError,
          Awaited<ReturnType<typeof getGrantsByRoleId>>
        > , 'initialData'
      >, request?: SecondParameter<typeof customInstance>}
 , queryClient?: QueryClient
  ):  DefinedUseQueryResult<TData, TError> & { queryKey: DataTag<QueryKey, TData, TError> }

export function useGetGrantsByRoleId<TData = Awaited<ReturnType<typeof getGrantsByRoleId>>, TError = ErrorType<void>>(
 roleId: string, options?: { query?:Partial<UseQueryOptions<Awaited<ReturnType<typeof getGrantsByRoleId>>, TError, TData>> & Pick<
        UndefinedInitialDataOptions<
          Awaited<ReturnType<typeof getGrantsByRoleId>>,
          TError,
          Awaited<ReturnType<typeof getGrantsByRoleId>>
        > , 'initialData'
      >, request?: SecondParameter<typeof customInstance>}
 , queryClient?: QueryClient
  ):  UseQueryResult<TData, TError> & { queryKey: DataTag<QueryKey, TData, TError> }

export function useGetGrantsByRoleId<TData = Awaited<ReturnType<typeof getGrantsByRoleId>>, TError = ErrorType<void>>(
 roleId: string, options?: { query?:Partial<UseQueryOptions<Awaited<ReturnType<typeof getGrantsByRoleId>>, TError, TData>>, request?: SecondParameter<typeof customInstance>}
 , queryClient?: QueryClient
  ):  UseQueryResult<TData, TError> & { queryKey: DataTag<QueryKey, TData, TError> }

/**
 * @summary 역할별 권한 조회
 */

export function useGetGrantsByRoleId<TData = Awaited<ReturnType<typeof getGrantsByRoleId>>, TError = ErrorType<void>>(
 roleId: string, options?: { query?:Partial<UseQueryOptions<Awaited<ReturnType<typeof getGrantsByRoleId>>, TError, TData>>, request?: SecondParameter<typeof customInstance>}
 , queryClient?: QueryClient 
 ):  UseQueryResult<TData, TError> & { queryKey: DataTag<QueryKey, TData, TError> } {

  const queryOptions = getGetGrantsByRoleIdQueryOptions(roleId,options)

  const query = useQuery(queryOptions, queryClient) as  UseQueryResult<TData, TError> & { queryKey: DataTag<QueryKey, TData, TError> };

  query.queryKey = queryOptions.queryKey ;

  return query;
}

/**
 * @summary 역할별 권한 조회
 */
export const prefetchGetGrantsByRoleIdQuery = async <TData = Awaited<ReturnType<typeof getGrantsByRoleId>>, TError = ErrorType<void>>(
 queryClient: QueryClient, roleId: string, options?: { query?:Partial<UseQueryOptions<Awaited<ReturnType<typeof getGrantsByRoleId>>, TError, TData>>, request?: SecondParameter<typeof customInstance>}

  ): Promise<QueryClient> => {

  const queryOptions = getGetGrantsByRoleIdQueryOptions(roleId,options)

  await queryClient.prefetchQuery(queryOptions);

  return queryClient;
}

export const getGetGrantsByRoleIdSuspenseQueryOptions = <TData = Awaited<ReturnType<typeof getGrantsByRoleId>>, TError = ErrorType<void>>(roleId: string, options?: { query?:Partial<UseSuspenseQueryOptions<Awaited<ReturnType<typeof getGrantsByRoleId>>, TError, TData>>, request?: SecondParameter<typeof customInstance>}
) => {

const {query: queryOptions, request: requestOptions} = options ?? {};

  const queryKey =  queryOptions?.queryKey ?? getGetGrantsByRoleIdQueryKey(roleId);

  

    const queryFn: QueryFunction<Awaited<ReturnType<typeof getGrantsByRoleId>>> = ({ signal }) => getGrantsByRoleId(roleId, requestOptions, signal);

      

      

   return  { queryKey, queryFn, ...queryOptions} as UseSuspenseQueryOptions<Awaited<ReturnType<typeof getGrantsByRoleId>>, TError, TData> & { queryKey: DataTag<QueryKey, TData, TError> }
}

export type GetGrantsByRoleIdSuspenseQueryResult = NonNullable<Awaited<ReturnType<typeof getGrantsByRoleId>>>

export type GetGrantsByRoleIdSuspenseQueryError = ErrorType<void>

export function useGetGrantsByRoleIdSuspense<TData = Awaited<ReturnType<typeof getGrantsByRoleId>>, TError = ErrorType<void>>(
 roleId: string, options: { query:Partial<UseSuspenseQueryOptions<Awaited<ReturnType<typeof getGrantsByRoleId>>, TError, TData>>, request?: SecondParameter<typeof customInstance>}
 , queryClient?: QueryClient
  ):  UseSuspenseQueryResult<TData, TError> & { queryKey: DataTag<QueryKey, TData, TError> }

export function useGetGrantsByRoleIdSuspense<TData = Awaited<ReturnType<typeof getGrantsByRoleId>>, TError = ErrorType<void>>(
 roleId: string, options?: { query?:Partial<UseSuspenseQueryOptions<Awaited<ReturnType<typeof getGrantsByRoleId>>, TError, TData>>, request?: SecondParameter<typeof customInstance>}
 , queryClient?: QueryClient
  ):  UseSuspenseQueryResult<TData, TError> & { queryKey: DataTag<QueryKey, TData, TError> }

export function useGetGrantsByRoleIdSuspense<TData = Awaited<ReturnType<typeof getGrantsByRoleId>>, TError = ErrorType<void>>(
 roleId: string, options?: { query?:Partial<UseSuspenseQueryOptions<Awaited<ReturnType<typeof getGrantsByRoleId>>, TError, TData>>, request?: SecondParameter<typeof customInstance>}
 , queryClient?: QueryClient
  ):  UseSuspenseQueryResult<TData, TError> & { queryKey: DataTag<QueryKey, TData, TError> }

/**
 * @summary 역할별 권한 조회
 */

export function useGetGrantsByRoleIdSuspense<TData = Awaited<ReturnType<typeof getGrantsByRoleId>>, TError = ErrorType<void>>(
 roleId: string, options?: { query?:Partial<UseSuspenseQueryOptions<Awaited<ReturnType<typeof getGrantsByRoleId>>, TError, TData>>, request?: SecondParameter<typeof customInstance>}
 , queryClient?: QueryClient 
 ):  UseSuspenseQueryResult<TData, TError> & { queryKey: DataTag<QueryKey, TData, TError> } {

  const queryOptions = getGetGrantsByRoleIdSuspenseQueryOptions(roleId,options)

  const query = useSuspenseQuery(queryOptions, queryClient) as  UseSuspenseQueryResult<TData, TError> & { queryKey: DataTag<QueryKey, TData, TError> };

  query.queryKey = queryOptions.queryKey ;

  return query;
}

export const getGetGrantsByRoleIdSuspenseInfiniteQueryOptions = <TData = InfiniteData<Awaited<ReturnType<typeof getGrantsByRoleId>>>, TError = ErrorType<void>>(roleId: string, options?: { query?:Partial<UseSuspenseInfiniteQueryOptions<Awaited<ReturnType<typeof getGrantsByRoleId>>, TError, TData>>, request?: SecondParameter<typeof customInstance>}
) => {

const {query: queryOptions, request: requestOptions} = options ?? {};

  const queryKey =  queryOptions?.queryKey ?? getGetGrantsByRoleIdInfiniteQueryKey(roleId);

  

    const queryFn: QueryFunction<Awaited<ReturnType<typeof getGrantsByRoleId>>> = ({ signal }) => getGrantsByRoleId(roleId, requestOptions, signal);

      

      

   return  { queryKey, queryFn, ...queryOptions} as UseSuspenseInfiniteQueryOptions<Awaited<ReturnType<typeof getGrantsByRoleId>>, TError, TData> & { queryKey: DataTag<QueryKey, TData, TError> }
}

export type GetGrantsByRoleIdSuspenseInfiniteQueryResult = NonNullable<Awaited<ReturnType<typeof getGrantsByRoleId>>>

export type GetGrantsByRoleIdSuspenseInfiniteQueryError = ErrorType<void>

export function useGetGrantsByRoleIdSuspenseInfinite<TData = InfiniteData<Awaited<ReturnType<typeof getGrantsByRoleId>>>, TError = ErrorType<void>>(
 roleId: string, options: { query:Partial<UseSuspenseInfiniteQueryOptions<Awaited<ReturnType<typeof getGrantsByRoleId>>, TError, TData>>, request?: SecondParameter<typeof customInstance>}
 , queryClient?: QueryClient
  ):  UseSuspenseInfiniteQueryResult<TData, TError> & { queryKey: DataTag<QueryKey, TData, TError> }

export function useGetGrantsByRoleIdSuspenseInfinite<TData = InfiniteData<Awaited<ReturnType<typeof getGrantsByRoleId>>>, TError = ErrorType<void>>(
 roleId: string, options?: { query?:Partial<UseSuspenseInfiniteQueryOptions<Awaited<ReturnType<typeof getGrantsByRoleId>>, TError, TData>>, request?: SecondParameter<typeof customInstance>}
 , queryClient?: QueryClient
  ):  UseSuspenseInfiniteQueryResult<TData, TError> & { queryKey: DataTag<QueryKey, TData, TError> }

export function useGetGrantsByRoleIdSuspenseInfinite<TData = InfiniteData<Awaited<ReturnType<typeof getGrantsByRoleId>>>, TError = ErrorType<void>>(
 roleId: string, options?: { query?:Partial<UseSuspenseInfiniteQueryOptions<Awaited<ReturnType<typeof getGrantsByRoleId>>, TError, TData>>, request?: SecondParameter<typeof customInstance>}
 , queryClient?: QueryClient
  ):  UseSuspenseInfiniteQueryResult<TData, TError> & { queryKey: DataTag<QueryKey, TData, TError> }

/**
 * @summary 역할별 권한 조회
 */

export function useGetGrantsByRoleIdSuspenseInfinite<TData = InfiniteData<Awaited<ReturnType<typeof getGrantsByRoleId>>>, TError = ErrorType<void>>(
 roleId: string, options?: { query?:Partial<UseSuspenseInfiniteQueryOptions<Awaited<ReturnType<typeof getGrantsByRoleId>>, TError, TData>>, request?: SecondParameter<typeof customInstance>}
 , queryClient?: QueryClient 
 ):  UseSuspenseInfiniteQueryResult<TData, TError> & { queryKey: DataTag<QueryKey, TData, TError> } {

  const queryOptions = getGetGrantsByRoleIdSuspenseInfiniteQueryOptions(roleId,options)

  const query = useSuspenseInfiniteQuery(queryOptions, queryClient) as  UseSuspenseInfiniteQueryResult<TData, TError> & { queryKey: DataTag<QueryKey, TData, TError> };

  query.queryKey = queryOptions.queryKey ;

  return query;
}

/**
 * @summary 역할별 권한 조회
 */
export const prefetchGetGrantsByRoleIdInfiniteQuery = async <TData = Awaited<ReturnType<typeof getGrantsByRoleId>>, TError = ErrorType<void>>(
 queryClient: QueryClient, roleId: string, options?: { query?:Partial<UseSuspenseInfiniteQueryOptions<Awaited<ReturnType<typeof getGrantsByRoleId>>, TError, TData>>, request?: SecondParameter<typeof customInstance>}

  ): Promise<QueryClient> => {

  const queryOptions = getGetGrantsByRoleIdSuspenseInfiniteQueryOptions(roleId,options)

  await queryClient.prefetchInfiniteQuery(queryOptions);

  return queryClient;
}
