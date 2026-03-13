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

import type { CreateUser201AllOf } from "../../model/createUser201AllOf";
import type { CreateUserMemberDto } from "../../model/createUserMemberDto";
import type { GetUserById200AllOf } from "../../model/getUserById200AllOf";
import type { GetUsers200AllOf } from "../../model/getUsers200AllOf";
import type { GetUsersParams } from "../../model/getUsersParams";
import type { UpdateUser200AllOf } from "../../model/updateUser200AllOf";
import type { UpdateUserMemberDto } from "../../model/updateUserMemberDto";
import type { UserDto } from "../../model/userDto";
export type { CreateUser201AllOf };
export type { CreateUserMemberDto };
export type { GetUserById200AllOf };
export type { GetUsers200AllOf };
export type { GetUsersParams };
export type { UpdateUser200AllOf };
export type { UpdateUserMemberDto };
export type { UserDto };
import type { BodyType, ErrorType } from "../../libs/customAxios";
import { customInstance } from "../../libs/customAxios";

type SecondParameter<T extends (...args: never) => unknown> = Parameters<T>[1];

/**
 * 현재 Space 내의 사용자 목록을 조회합니다. 검색, 필터링, 페이지네이션을 지원하며 통계 정보도 함께 반환합니다.
 * @summary 사용자 목록 조회
 */
export const getUsers = (
    params?: GetUsersParams,
 options?: SecondParameter<typeof customInstance>,signal?: AbortSignal
) => {
      
      
      return customInstance<GetUsers200AllOf>(
      {url: `/api/v1/users`, method: 'GET',
        params, signal
    },
      options);
    }

export const getGetUsersQueryKey = (params?: GetUsersParams,) => {
    return [
    `/api/v1/users`, ...(params ? [params]: [])
    ] as const;
    }

export const getGetUsersInfiniteQueryKey = (params?: GetUsersParams,) => {
    return [
    'infinite', `/api/v1/users`, ...(params ? [params]: [])
    ] as const;
    }

export const getGetUsersQueryOptions = <TData = Awaited<ReturnType<typeof getUsers>>, TError = ErrorType<void>>(params?: GetUsersParams, options?: { query?:Partial<UseQueryOptions<Awaited<ReturnType<typeof getUsers>>, TError, TData>>, request?: SecondParameter<typeof customInstance>}
) => {

const {query: queryOptions, request: requestOptions} = options ?? {};

  const queryKey =  queryOptions?.queryKey ?? getGetUsersQueryKey(params);

  

    const queryFn: QueryFunction<Awaited<ReturnType<typeof getUsers>>> = ({ signal }) => getUsers(params, requestOptions, signal);

      

      

   return  { queryKey, queryFn, ...queryOptions} as UseQueryOptions<Awaited<ReturnType<typeof getUsers>>, TError, TData> & { queryKey: DataTag<QueryKey, TData, TError> }
}

export type GetUsersQueryResult = NonNullable<Awaited<ReturnType<typeof getUsers>>>

export type GetUsersQueryError = ErrorType<void>

export function useGetUsers<TData = Awaited<ReturnType<typeof getUsers>>, TError = ErrorType<void>>(
 params: undefined |  GetUsersParams, options: { query:Partial<UseQueryOptions<Awaited<ReturnType<typeof getUsers>>, TError, TData>> & Pick<
        DefinedInitialDataOptions<
          Awaited<ReturnType<typeof getUsers>>,
          TError,
          Awaited<ReturnType<typeof getUsers>>
        > , 'initialData'
      >, request?: SecondParameter<typeof customInstance>}
 , queryClient?: QueryClient
  ):  DefinedUseQueryResult<TData, TError> & { queryKey: DataTag<QueryKey, TData, TError> }

export function useGetUsers<TData = Awaited<ReturnType<typeof getUsers>>, TError = ErrorType<void>>(
 params?: GetUsersParams, options?: { query?:Partial<UseQueryOptions<Awaited<ReturnType<typeof getUsers>>, TError, TData>> & Pick<
        UndefinedInitialDataOptions<
          Awaited<ReturnType<typeof getUsers>>,
          TError,
          Awaited<ReturnType<typeof getUsers>>
        > , 'initialData'
      >, request?: SecondParameter<typeof customInstance>}
 , queryClient?: QueryClient
  ):  UseQueryResult<TData, TError> & { queryKey: DataTag<QueryKey, TData, TError> }

export function useGetUsers<TData = Awaited<ReturnType<typeof getUsers>>, TError = ErrorType<void>>(
 params?: GetUsersParams, options?: { query?:Partial<UseQueryOptions<Awaited<ReturnType<typeof getUsers>>, TError, TData>>, request?: SecondParameter<typeof customInstance>}
 , queryClient?: QueryClient
  ):  UseQueryResult<TData, TError> & { queryKey: DataTag<QueryKey, TData, TError> }

/**
 * @summary 사용자 목록 조회
 */

export function useGetUsers<TData = Awaited<ReturnType<typeof getUsers>>, TError = ErrorType<void>>(
 params?: GetUsersParams, options?: { query?:Partial<UseQueryOptions<Awaited<ReturnType<typeof getUsers>>, TError, TData>>, request?: SecondParameter<typeof customInstance>}
 , queryClient?: QueryClient 
 ):  UseQueryResult<TData, TError> & { queryKey: DataTag<QueryKey, TData, TError> } {

  const queryOptions = getGetUsersQueryOptions(params,options)

  const query = useQuery(queryOptions, queryClient) as  UseQueryResult<TData, TError> & { queryKey: DataTag<QueryKey, TData, TError> };

  query.queryKey = queryOptions.queryKey ;

  return query;
}

/**
 * @summary 사용자 목록 조회
 */
export const prefetchGetUsersQuery = async <TData = Awaited<ReturnType<typeof getUsers>>, TError = ErrorType<void>>(
 queryClient: QueryClient, params?: GetUsersParams, options?: { query?:Partial<UseQueryOptions<Awaited<ReturnType<typeof getUsers>>, TError, TData>>, request?: SecondParameter<typeof customInstance>}

  ): Promise<QueryClient> => {

  const queryOptions = getGetUsersQueryOptions(params,options)

  await queryClient.prefetchQuery(queryOptions);

  return queryClient;
}

export const getGetUsersSuspenseQueryOptions = <TData = Awaited<ReturnType<typeof getUsers>>, TError = ErrorType<void>>(params?: GetUsersParams, options?: { query?:Partial<UseSuspenseQueryOptions<Awaited<ReturnType<typeof getUsers>>, TError, TData>>, request?: SecondParameter<typeof customInstance>}
) => {

const {query: queryOptions, request: requestOptions} = options ?? {};

  const queryKey =  queryOptions?.queryKey ?? getGetUsersQueryKey(params);

  

    const queryFn: QueryFunction<Awaited<ReturnType<typeof getUsers>>> = ({ signal }) => getUsers(params, requestOptions, signal);

      

      

   return  { queryKey, queryFn, ...queryOptions} as UseSuspenseQueryOptions<Awaited<ReturnType<typeof getUsers>>, TError, TData> & { queryKey: DataTag<QueryKey, TData, TError> }
}

export type GetUsersSuspenseQueryResult = NonNullable<Awaited<ReturnType<typeof getUsers>>>

export type GetUsersSuspenseQueryError = ErrorType<void>

export function useGetUsersSuspense<TData = Awaited<ReturnType<typeof getUsers>>, TError = ErrorType<void>>(
 params: undefined |  GetUsersParams, options: { query:Partial<UseSuspenseQueryOptions<Awaited<ReturnType<typeof getUsers>>, TError, TData>>, request?: SecondParameter<typeof customInstance>}
 , queryClient?: QueryClient
  ):  UseSuspenseQueryResult<TData, TError> & { queryKey: DataTag<QueryKey, TData, TError> }

export function useGetUsersSuspense<TData = Awaited<ReturnType<typeof getUsers>>, TError = ErrorType<void>>(
 params?: GetUsersParams, options?: { query?:Partial<UseSuspenseQueryOptions<Awaited<ReturnType<typeof getUsers>>, TError, TData>>, request?: SecondParameter<typeof customInstance>}
 , queryClient?: QueryClient
  ):  UseSuspenseQueryResult<TData, TError> & { queryKey: DataTag<QueryKey, TData, TError> }

export function useGetUsersSuspense<TData = Awaited<ReturnType<typeof getUsers>>, TError = ErrorType<void>>(
 params?: GetUsersParams, options?: { query?:Partial<UseSuspenseQueryOptions<Awaited<ReturnType<typeof getUsers>>, TError, TData>>, request?: SecondParameter<typeof customInstance>}
 , queryClient?: QueryClient
  ):  UseSuspenseQueryResult<TData, TError> & { queryKey: DataTag<QueryKey, TData, TError> }

/**
 * @summary 사용자 목록 조회
 */

export function useGetUsersSuspense<TData = Awaited<ReturnType<typeof getUsers>>, TError = ErrorType<void>>(
 params?: GetUsersParams, options?: { query?:Partial<UseSuspenseQueryOptions<Awaited<ReturnType<typeof getUsers>>, TError, TData>>, request?: SecondParameter<typeof customInstance>}
 , queryClient?: QueryClient 
 ):  UseSuspenseQueryResult<TData, TError> & { queryKey: DataTag<QueryKey, TData, TError> } {

  const queryOptions = getGetUsersSuspenseQueryOptions(params,options)

  const query = useSuspenseQuery(queryOptions, queryClient) as  UseSuspenseQueryResult<TData, TError> & { queryKey: DataTag<QueryKey, TData, TError> };

  query.queryKey = queryOptions.queryKey ;

  return query;
}

export const getGetUsersSuspenseInfiniteQueryOptions = <TData = InfiniteData<Awaited<ReturnType<typeof getUsers>>>, TError = ErrorType<void>>(params?: GetUsersParams, options?: { query?:Partial<UseSuspenseInfiniteQueryOptions<Awaited<ReturnType<typeof getUsers>>, TError, TData>>, request?: SecondParameter<typeof customInstance>}
) => {

const {query: queryOptions, request: requestOptions} = options ?? {};

  const queryKey =  queryOptions?.queryKey ?? getGetUsersInfiniteQueryKey(params);

  

    const queryFn: QueryFunction<Awaited<ReturnType<typeof getUsers>>> = ({ signal }) => getUsers(params, requestOptions, signal);

      

      

   return  { queryKey, queryFn, ...queryOptions} as UseSuspenseInfiniteQueryOptions<Awaited<ReturnType<typeof getUsers>>, TError, TData> & { queryKey: DataTag<QueryKey, TData, TError> }
}

export type GetUsersSuspenseInfiniteQueryResult = NonNullable<Awaited<ReturnType<typeof getUsers>>>

export type GetUsersSuspenseInfiniteQueryError = ErrorType<void>

export function useGetUsersSuspenseInfinite<TData = InfiniteData<Awaited<ReturnType<typeof getUsers>>>, TError = ErrorType<void>>(
 params: undefined |  GetUsersParams, options: { query:Partial<UseSuspenseInfiniteQueryOptions<Awaited<ReturnType<typeof getUsers>>, TError, TData>>, request?: SecondParameter<typeof customInstance>}
 , queryClient?: QueryClient
  ):  UseSuspenseInfiniteQueryResult<TData, TError> & { queryKey: DataTag<QueryKey, TData, TError> }

export function useGetUsersSuspenseInfinite<TData = InfiniteData<Awaited<ReturnType<typeof getUsers>>>, TError = ErrorType<void>>(
 params?: GetUsersParams, options?: { query?:Partial<UseSuspenseInfiniteQueryOptions<Awaited<ReturnType<typeof getUsers>>, TError, TData>>, request?: SecondParameter<typeof customInstance>}
 , queryClient?: QueryClient
  ):  UseSuspenseInfiniteQueryResult<TData, TError> & { queryKey: DataTag<QueryKey, TData, TError> }

export function useGetUsersSuspenseInfinite<TData = InfiniteData<Awaited<ReturnType<typeof getUsers>>>, TError = ErrorType<void>>(
 params?: GetUsersParams, options?: { query?:Partial<UseSuspenseInfiniteQueryOptions<Awaited<ReturnType<typeof getUsers>>, TError, TData>>, request?: SecondParameter<typeof customInstance>}
 , queryClient?: QueryClient
  ):  UseSuspenseInfiniteQueryResult<TData, TError> & { queryKey: DataTag<QueryKey, TData, TError> }

/**
 * @summary 사용자 목록 조회
 */

export function useGetUsersSuspenseInfinite<TData = InfiniteData<Awaited<ReturnType<typeof getUsers>>>, TError = ErrorType<void>>(
 params?: GetUsersParams, options?: { query?:Partial<UseSuspenseInfiniteQueryOptions<Awaited<ReturnType<typeof getUsers>>, TError, TData>>, request?: SecondParameter<typeof customInstance>}
 , queryClient?: QueryClient 
 ):  UseSuspenseInfiniteQueryResult<TData, TError> & { queryKey: DataTag<QueryKey, TData, TError> } {

  const queryOptions = getGetUsersSuspenseInfiniteQueryOptions(params,options)

  const query = useSuspenseInfiniteQuery(queryOptions, queryClient) as  UseSuspenseInfiniteQueryResult<TData, TError> & { queryKey: DataTag<QueryKey, TData, TError> };

  query.queryKey = queryOptions.queryKey ;

  return query;
}

/**
 * @summary 사용자 목록 조회
 */
export const prefetchGetUsersInfiniteQuery = async <TData = Awaited<ReturnType<typeof getUsers>>, TError = ErrorType<void>>(
 queryClient: QueryClient, params?: GetUsersParams, options?: { query?:Partial<UseSuspenseInfiniteQueryOptions<Awaited<ReturnType<typeof getUsers>>, TError, TData>>, request?: SecondParameter<typeof customInstance>}

  ): Promise<QueryClient> => {

  const queryOptions = getGetUsersSuspenseInfiniteQueryOptions(params,options)

  await queryClient.prefetchInfiniteQuery(queryOptions);

  return queryClient;
}

/**
 * 새로운 사용자를 등록합니다. 이메일, 전화번호, 이름은 중복될 수 없습니다.
 * @summary 사용자 등록
 */
export const createUser = (
    createUserMemberDto: BodyType<CreateUserMemberDto>,
 options?: SecondParameter<typeof customInstance>,signal?: AbortSignal
) => {
      
      
      return customInstance<CreateUser201AllOf>(
      {url: `/api/v1/users`, method: 'POST',
      headers: {'Content-Type': 'application/json', },
      data: createUserMemberDto, signal
    },
      options);
    }

export const getCreateUserMutationOptions = <TError = ErrorType<void>,
    TContext = unknown>(options?: { mutation?:UseMutationOptions<Awaited<ReturnType<typeof createUser>>, TError,{data: BodyType<CreateUserMemberDto>}, TContext>, request?: SecondParameter<typeof customInstance>}
): UseMutationOptions<Awaited<ReturnType<typeof createUser>>, TError,{data: BodyType<CreateUserMemberDto>}, TContext> => {

const mutationKey = ['createUser'];
const {mutation: mutationOptions, request: requestOptions} = options ?
      options.mutation && 'mutationKey' in options.mutation && options.mutation.mutationKey ?
      options
      : {...options, mutation: {...options.mutation, mutationKey}}
      : {mutation: { mutationKey, }, request: undefined};

      


      const mutationFn: MutationFunction<Awaited<ReturnType<typeof createUser>>, {data: BodyType<CreateUserMemberDto>}> = (props) => {
          const {data} = props ?? {};

          return  createUser(data,requestOptions)
        }

        


  return  { mutationFn, ...mutationOptions }}

export type CreateUserMutationResult = NonNullable<Awaited<ReturnType<typeof createUser>>>

export type CreateUserMutationBody = BodyType<CreateUserMemberDto>

export type CreateUserMutationError = ErrorType<void>

/**
 * @summary 사용자 등록
 */
export const useCreateUser = <TError = ErrorType<void>,
    TContext = unknown>(options?: { mutation?:UseMutationOptions<Awaited<ReturnType<typeof createUser>>, TError,{data: BodyType<CreateUserMemberDto>}, TContext>, request?: SecondParameter<typeof customInstance>}
 , queryClient?: QueryClient): UseMutationResult<
        Awaited<ReturnType<typeof createUser>>,
        TError,
        {data: BodyType<CreateUserMemberDto>},
        TContext
      > => {

      const mutationOptions = getCreateUserMutationOptions(options);

      return useMutation(mutationOptions, queryClient);
    }

/**
 * 특정 사용자의 상세 정보를 조회합니다. Profile, Tenant, Role, Space 정보를 포함합니다.
 * @summary 사용자 상세 조회
 */
export const getUserById = (
    id: string,
 options?: SecondParameter<typeof customInstance>,signal?: AbortSignal
) => {
      
      
      return customInstance<GetUserById200AllOf>(
      {url: `/api/v1/users/${id}`, method: 'GET', signal
    },
      options);
    }

export const getGetUserByIdQueryKey = (id?: string,) => {
    return [
    `/api/v1/users/${id}`
    ] as const;
    }

export const getGetUserByIdInfiniteQueryKey = (id?: string,) => {
    return [
    'infinite', `/api/v1/users/${id}`
    ] as const;
    }

export const getGetUserByIdQueryOptions = <TData = Awaited<ReturnType<typeof getUserById>>, TError = ErrorType<void>>(id: string, options?: { query?:Partial<UseQueryOptions<Awaited<ReturnType<typeof getUserById>>, TError, TData>>, request?: SecondParameter<typeof customInstance>}
) => {

const {query: queryOptions, request: requestOptions} = options ?? {};

  const queryKey =  queryOptions?.queryKey ?? getGetUserByIdQueryKey(id);

  

    const queryFn: QueryFunction<Awaited<ReturnType<typeof getUserById>>> = ({ signal }) => getUserById(id, requestOptions, signal);

      

      

   return  { queryKey, queryFn, enabled: !!(id), ...queryOptions} as UseQueryOptions<Awaited<ReturnType<typeof getUserById>>, TError, TData> & { queryKey: DataTag<QueryKey, TData, TError> }
}

export type GetUserByIdQueryResult = NonNullable<Awaited<ReturnType<typeof getUserById>>>

export type GetUserByIdQueryError = ErrorType<void>

export function useGetUserById<TData = Awaited<ReturnType<typeof getUserById>>, TError = ErrorType<void>>(
 id: string, options: { query:Partial<UseQueryOptions<Awaited<ReturnType<typeof getUserById>>, TError, TData>> & Pick<
        DefinedInitialDataOptions<
          Awaited<ReturnType<typeof getUserById>>,
          TError,
          Awaited<ReturnType<typeof getUserById>>
        > , 'initialData'
      >, request?: SecondParameter<typeof customInstance>}
 , queryClient?: QueryClient
  ):  DefinedUseQueryResult<TData, TError> & { queryKey: DataTag<QueryKey, TData, TError> }

export function useGetUserById<TData = Awaited<ReturnType<typeof getUserById>>, TError = ErrorType<void>>(
 id: string, options?: { query?:Partial<UseQueryOptions<Awaited<ReturnType<typeof getUserById>>, TError, TData>> & Pick<
        UndefinedInitialDataOptions<
          Awaited<ReturnType<typeof getUserById>>,
          TError,
          Awaited<ReturnType<typeof getUserById>>
        > , 'initialData'
      >, request?: SecondParameter<typeof customInstance>}
 , queryClient?: QueryClient
  ):  UseQueryResult<TData, TError> & { queryKey: DataTag<QueryKey, TData, TError> }

export function useGetUserById<TData = Awaited<ReturnType<typeof getUserById>>, TError = ErrorType<void>>(
 id: string, options?: { query?:Partial<UseQueryOptions<Awaited<ReturnType<typeof getUserById>>, TError, TData>>, request?: SecondParameter<typeof customInstance>}
 , queryClient?: QueryClient
  ):  UseQueryResult<TData, TError> & { queryKey: DataTag<QueryKey, TData, TError> }

/**
 * @summary 사용자 상세 조회
 */

export function useGetUserById<TData = Awaited<ReturnType<typeof getUserById>>, TError = ErrorType<void>>(
 id: string, options?: { query?:Partial<UseQueryOptions<Awaited<ReturnType<typeof getUserById>>, TError, TData>>, request?: SecondParameter<typeof customInstance>}
 , queryClient?: QueryClient 
 ):  UseQueryResult<TData, TError> & { queryKey: DataTag<QueryKey, TData, TError> } {

  const queryOptions = getGetUserByIdQueryOptions(id,options)

  const query = useQuery(queryOptions, queryClient) as  UseQueryResult<TData, TError> & { queryKey: DataTag<QueryKey, TData, TError> };

  query.queryKey = queryOptions.queryKey ;

  return query;
}

/**
 * @summary 사용자 상세 조회
 */
export const prefetchGetUserByIdQuery = async <TData = Awaited<ReturnType<typeof getUserById>>, TError = ErrorType<void>>(
 queryClient: QueryClient, id: string, options?: { query?:Partial<UseQueryOptions<Awaited<ReturnType<typeof getUserById>>, TError, TData>>, request?: SecondParameter<typeof customInstance>}

  ): Promise<QueryClient> => {

  const queryOptions = getGetUserByIdQueryOptions(id,options)

  await queryClient.prefetchQuery(queryOptions);

  return queryClient;
}

export const getGetUserByIdSuspenseQueryOptions = <TData = Awaited<ReturnType<typeof getUserById>>, TError = ErrorType<void>>(id: string, options?: { query?:Partial<UseSuspenseQueryOptions<Awaited<ReturnType<typeof getUserById>>, TError, TData>>, request?: SecondParameter<typeof customInstance>}
) => {

const {query: queryOptions, request: requestOptions} = options ?? {};

  const queryKey =  queryOptions?.queryKey ?? getGetUserByIdQueryKey(id);

  

    const queryFn: QueryFunction<Awaited<ReturnType<typeof getUserById>>> = ({ signal }) => getUserById(id, requestOptions, signal);

      

      

   return  { queryKey, queryFn, ...queryOptions} as UseSuspenseQueryOptions<Awaited<ReturnType<typeof getUserById>>, TError, TData> & { queryKey: DataTag<QueryKey, TData, TError> }
}

export type GetUserByIdSuspenseQueryResult = NonNullable<Awaited<ReturnType<typeof getUserById>>>

export type GetUserByIdSuspenseQueryError = ErrorType<void>

export function useGetUserByIdSuspense<TData = Awaited<ReturnType<typeof getUserById>>, TError = ErrorType<void>>(
 id: string, options: { query:Partial<UseSuspenseQueryOptions<Awaited<ReturnType<typeof getUserById>>, TError, TData>>, request?: SecondParameter<typeof customInstance>}
 , queryClient?: QueryClient
  ):  UseSuspenseQueryResult<TData, TError> & { queryKey: DataTag<QueryKey, TData, TError> }

export function useGetUserByIdSuspense<TData = Awaited<ReturnType<typeof getUserById>>, TError = ErrorType<void>>(
 id: string, options?: { query?:Partial<UseSuspenseQueryOptions<Awaited<ReturnType<typeof getUserById>>, TError, TData>>, request?: SecondParameter<typeof customInstance>}
 , queryClient?: QueryClient
  ):  UseSuspenseQueryResult<TData, TError> & { queryKey: DataTag<QueryKey, TData, TError> }

export function useGetUserByIdSuspense<TData = Awaited<ReturnType<typeof getUserById>>, TError = ErrorType<void>>(
 id: string, options?: { query?:Partial<UseSuspenseQueryOptions<Awaited<ReturnType<typeof getUserById>>, TError, TData>>, request?: SecondParameter<typeof customInstance>}
 , queryClient?: QueryClient
  ):  UseSuspenseQueryResult<TData, TError> & { queryKey: DataTag<QueryKey, TData, TError> }

/**
 * @summary 사용자 상세 조회
 */

export function useGetUserByIdSuspense<TData = Awaited<ReturnType<typeof getUserById>>, TError = ErrorType<void>>(
 id: string, options?: { query?:Partial<UseSuspenseQueryOptions<Awaited<ReturnType<typeof getUserById>>, TError, TData>>, request?: SecondParameter<typeof customInstance>}
 , queryClient?: QueryClient 
 ):  UseSuspenseQueryResult<TData, TError> & { queryKey: DataTag<QueryKey, TData, TError> } {

  const queryOptions = getGetUserByIdSuspenseQueryOptions(id,options)

  const query = useSuspenseQuery(queryOptions, queryClient) as  UseSuspenseQueryResult<TData, TError> & { queryKey: DataTag<QueryKey, TData, TError> };

  query.queryKey = queryOptions.queryKey ;

  return query;
}

export const getGetUserByIdSuspenseInfiniteQueryOptions = <TData = InfiniteData<Awaited<ReturnType<typeof getUserById>>>, TError = ErrorType<void>>(id: string, options?: { query?:Partial<UseSuspenseInfiniteQueryOptions<Awaited<ReturnType<typeof getUserById>>, TError, TData>>, request?: SecondParameter<typeof customInstance>}
) => {

const {query: queryOptions, request: requestOptions} = options ?? {};

  const queryKey =  queryOptions?.queryKey ?? getGetUserByIdInfiniteQueryKey(id);

  

    const queryFn: QueryFunction<Awaited<ReturnType<typeof getUserById>>> = ({ signal }) => getUserById(id, requestOptions, signal);

      

      

   return  { queryKey, queryFn, ...queryOptions} as UseSuspenseInfiniteQueryOptions<Awaited<ReturnType<typeof getUserById>>, TError, TData> & { queryKey: DataTag<QueryKey, TData, TError> }
}

export type GetUserByIdSuspenseInfiniteQueryResult = NonNullable<Awaited<ReturnType<typeof getUserById>>>

export type GetUserByIdSuspenseInfiniteQueryError = ErrorType<void>

export function useGetUserByIdSuspenseInfinite<TData = InfiniteData<Awaited<ReturnType<typeof getUserById>>>, TError = ErrorType<void>>(
 id: string, options: { query:Partial<UseSuspenseInfiniteQueryOptions<Awaited<ReturnType<typeof getUserById>>, TError, TData>>, request?: SecondParameter<typeof customInstance>}
 , queryClient?: QueryClient
  ):  UseSuspenseInfiniteQueryResult<TData, TError> & { queryKey: DataTag<QueryKey, TData, TError> }

export function useGetUserByIdSuspenseInfinite<TData = InfiniteData<Awaited<ReturnType<typeof getUserById>>>, TError = ErrorType<void>>(
 id: string, options?: { query?:Partial<UseSuspenseInfiniteQueryOptions<Awaited<ReturnType<typeof getUserById>>, TError, TData>>, request?: SecondParameter<typeof customInstance>}
 , queryClient?: QueryClient
  ):  UseSuspenseInfiniteQueryResult<TData, TError> & { queryKey: DataTag<QueryKey, TData, TError> }

export function useGetUserByIdSuspenseInfinite<TData = InfiniteData<Awaited<ReturnType<typeof getUserById>>>, TError = ErrorType<void>>(
 id: string, options?: { query?:Partial<UseSuspenseInfiniteQueryOptions<Awaited<ReturnType<typeof getUserById>>, TError, TData>>, request?: SecondParameter<typeof customInstance>}
 , queryClient?: QueryClient
  ):  UseSuspenseInfiniteQueryResult<TData, TError> & { queryKey: DataTag<QueryKey, TData, TError> }

/**
 * @summary 사용자 상세 조회
 */

export function useGetUserByIdSuspenseInfinite<TData = InfiniteData<Awaited<ReturnType<typeof getUserById>>>, TError = ErrorType<void>>(
 id: string, options?: { query?:Partial<UseSuspenseInfiniteQueryOptions<Awaited<ReturnType<typeof getUserById>>, TError, TData>>, request?: SecondParameter<typeof customInstance>}
 , queryClient?: QueryClient 
 ):  UseSuspenseInfiniteQueryResult<TData, TError> & { queryKey: DataTag<QueryKey, TData, TError> } {

  const queryOptions = getGetUserByIdSuspenseInfiniteQueryOptions(id,options)

  const query = useSuspenseInfiniteQuery(queryOptions, queryClient) as  UseSuspenseInfiniteQueryResult<TData, TError> & { queryKey: DataTag<QueryKey, TData, TError> };

  query.queryKey = queryOptions.queryKey ;

  return query;
}

/**
 * @summary 사용자 상세 조회
 */
export const prefetchGetUserByIdInfiniteQuery = async <TData = Awaited<ReturnType<typeof getUserById>>, TError = ErrorType<void>>(
 queryClient: QueryClient, id: string, options?: { query?:Partial<UseSuspenseInfiniteQueryOptions<Awaited<ReturnType<typeof getUserById>>, TError, TData>>, request?: SecondParameter<typeof customInstance>}

  ): Promise<QueryClient> => {

  const queryOptions = getGetUserByIdSuspenseInfiniteQueryOptions(id,options)

  await queryClient.prefetchInfiniteQuery(queryOptions);

  return queryClient;
}

/**
 * 사용자 정보를 수정합니다. 변경하려는 필드만 전송하면 됩니다.
 * @summary 사용자 수정
 */
export const updateUser = (
    id: string,
    updateUserMemberDto: BodyType<UpdateUserMemberDto>,
 options?: SecondParameter<typeof customInstance>,) => {
      
      
      return customInstance<UpdateUser200AllOf>(
      {url: `/api/v1/users/${id}`, method: 'PATCH',
      headers: {'Content-Type': 'application/json', },
      data: updateUserMemberDto
    },
      options);
    }

export const getUpdateUserMutationOptions = <TError = ErrorType<void>,
    TContext = unknown>(options?: { mutation?:UseMutationOptions<Awaited<ReturnType<typeof updateUser>>, TError,{id: string;data: BodyType<UpdateUserMemberDto>}, TContext>, request?: SecondParameter<typeof customInstance>}
): UseMutationOptions<Awaited<ReturnType<typeof updateUser>>, TError,{id: string;data: BodyType<UpdateUserMemberDto>}, TContext> => {

const mutationKey = ['updateUser'];
const {mutation: mutationOptions, request: requestOptions} = options ?
      options.mutation && 'mutationKey' in options.mutation && options.mutation.mutationKey ?
      options
      : {...options, mutation: {...options.mutation, mutationKey}}
      : {mutation: { mutationKey, }, request: undefined};

      


      const mutationFn: MutationFunction<Awaited<ReturnType<typeof updateUser>>, {id: string;data: BodyType<UpdateUserMemberDto>}> = (props) => {
          const {id,data} = props ?? {};

          return  updateUser(id,data,requestOptions)
        }

        


  return  { mutationFn, ...mutationOptions }}

export type UpdateUserMutationResult = NonNullable<Awaited<ReturnType<typeof updateUser>>>

export type UpdateUserMutationBody = BodyType<UpdateUserMemberDto>

export type UpdateUserMutationError = ErrorType<void>

/**
 * @summary 사용자 수정
 */
export const useUpdateUser = <TError = ErrorType<void>,
    TContext = unknown>(options?: { mutation?:UseMutationOptions<Awaited<ReturnType<typeof updateUser>>, TError,{id: string;data: BodyType<UpdateUserMemberDto>}, TContext>, request?: SecondParameter<typeof customInstance>}
 , queryClient?: QueryClient): UseMutationResult<
        Awaited<ReturnType<typeof updateUser>>,
        TError,
        {id: string;data: BodyType<UpdateUserMemberDto>},
        TContext
      > => {

      const mutationOptions = getUpdateUserMutationOptions(options);

      return useMutation(mutationOptions, queryClient);
    }

/**
 * 사용자를 삭제합니다 (Soft Delete). 자신의 계정은 삭제할 수 없습니다.
 * @summary 사용자 삭제
 */
export const deleteUser = (
    id: string,
 options?: SecondParameter<typeof customInstance>,) => {
      
      
      return customInstance<unknown>(
      {url: `/api/v1/users/${id}`, method: 'DELETE'
    },
      options);
    }

export const getDeleteUserMutationOptions = <TError = ErrorType<void>,
    TContext = unknown>(options?: { mutation?:UseMutationOptions<Awaited<ReturnType<typeof deleteUser>>, TError,{id: string}, TContext>, request?: SecondParameter<typeof customInstance>}
): UseMutationOptions<Awaited<ReturnType<typeof deleteUser>>, TError,{id: string}, TContext> => {

const mutationKey = ['deleteUser'];
const {mutation: mutationOptions, request: requestOptions} = options ?
      options.mutation && 'mutationKey' in options.mutation && options.mutation.mutationKey ?
      options
      : {...options, mutation: {...options.mutation, mutationKey}}
      : {mutation: { mutationKey, }, request: undefined};

      


      const mutationFn: MutationFunction<Awaited<ReturnType<typeof deleteUser>>, {id: string}> = (props) => {
          const {id} = props ?? {};

          return  deleteUser(id,requestOptions)
        }

        


  return  { mutationFn, ...mutationOptions }}

export type DeleteUserMutationResult = NonNullable<Awaited<ReturnType<typeof deleteUser>>>

export type DeleteUserMutationError = ErrorType<void>

/**
 * @summary 사용자 삭제
 */
export const useDeleteUser = <TError = ErrorType<void>,
    TContext = unknown>(options?: { mutation?:UseMutationOptions<Awaited<ReturnType<typeof deleteUser>>, TError,{id: string}, TContext>, request?: SecondParameter<typeof customInstance>}
 , queryClient?: QueryClient): UseMutationResult<
        Awaited<ReturnType<typeof deleteUser>>,
        TError,
        {id: string},
        TContext
      > => {

      const mutationOptions = getDeleteUserMutationOptions(options);

      return useMutation(mutationOptions, queryClient);
    }
