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

import type { AbilityResponseDto } from "../../model/abilityResponseDto";
import type { CreateAbility201AllOf } from "../../model/createAbility201AllOf";
import type { CreateAbilityDto } from "../../model/createAbilityDto";
import type { DeleteAbility200AllOf } from "../../model/deleteAbility200AllOf";
import type { GetAbilities200AllOf } from "../../model/getAbilities200AllOf";
import type { GetAbilitiesByRoleId200AllOf } from "../../model/getAbilitiesByRoleId200AllOf";
import type { GetAbilitiesByUserId200AllOf } from "../../model/getAbilitiesByUserId200AllOf";
import type { GetAbilityById200AllOf } from "../../model/getAbilityById200AllOf";
import type { GetMyAbilities200AllOf } from "../../model/getMyAbilities200AllOf";
import type { UpdateAbility200AllOf } from "../../model/updateAbility200AllOf";
import type { UpdateAbilityDto } from "../../model/updateAbilityDto";
import type { User } from "../../model/user";
export type { AbilityResponseDto };
export type { CreateAbility201AllOf };
export type { CreateAbilityDto };
export type { DeleteAbility200AllOf };
export type { GetAbilities200AllOf };
export type { GetAbilitiesByRoleId200AllOf };
export type { GetAbilitiesByUserId200AllOf };
export type { GetAbilityById200AllOf };
export type { GetMyAbilities200AllOf };
export type { UpdateAbility200AllOf };
export type { UpdateAbilityDto };
export type { User };
import type { BodyType, ErrorType } from "../../libs/customAxios";
import { customInstance } from "../../libs/customAxios";

type SecondParameter<T extends (...args: never) => unknown> = Parameters<T>[1];

/**
 * 모든 권한 정의(Ability) 목록을 조회합니다. Subject, Action 정보를 포함합니다.
 * @summary 전체 권한 정의 목록 조회
 */
export const getAbilities = (
    
 options?: SecondParameter<typeof customInstance>,signal?: AbortSignal
) => {
      
      
      return customInstance<GetAbilities200AllOf>(
      {url: `/api/v1/abilities`, method: 'GET', signal
    },
      options);
    }

export const getGetAbilitiesQueryKey = () => {
    return [
    `/api/v1/abilities`
    ] as const;
    }

export const getGetAbilitiesInfiniteQueryKey = () => {
    return [
    'infinite', `/api/v1/abilities`
    ] as const;
    }

export const getGetAbilitiesQueryOptions = <TData = Awaited<ReturnType<typeof getAbilities>>, TError = ErrorType<void>>( options?: { query?:Partial<UseQueryOptions<Awaited<ReturnType<typeof getAbilities>>, TError, TData>>, request?: SecondParameter<typeof customInstance>}
) => {

const {query: queryOptions, request: requestOptions} = options ?? {};

  const queryKey =  queryOptions?.queryKey ?? getGetAbilitiesQueryKey();

  

    const queryFn: QueryFunction<Awaited<ReturnType<typeof getAbilities>>> = ({ signal }) => getAbilities(requestOptions, signal);

      

      

   return  { queryKey, queryFn, ...queryOptions} as UseQueryOptions<Awaited<ReturnType<typeof getAbilities>>, TError, TData> & { queryKey: DataTag<QueryKey, TData, TError> }
}

export type GetAbilitiesQueryResult = NonNullable<Awaited<ReturnType<typeof getAbilities>>>

export type GetAbilitiesQueryError = ErrorType<void>

export function useGetAbilities<TData = Awaited<ReturnType<typeof getAbilities>>, TError = ErrorType<void>>(
  options: { query:Partial<UseQueryOptions<Awaited<ReturnType<typeof getAbilities>>, TError, TData>> & Pick<
        DefinedInitialDataOptions<
          Awaited<ReturnType<typeof getAbilities>>,
          TError,
          Awaited<ReturnType<typeof getAbilities>>
        > , 'initialData'
      >, request?: SecondParameter<typeof customInstance>}
 , queryClient?: QueryClient
  ):  DefinedUseQueryResult<TData, TError> & { queryKey: DataTag<QueryKey, TData, TError> }

export function useGetAbilities<TData = Awaited<ReturnType<typeof getAbilities>>, TError = ErrorType<void>>(
  options?: { query?:Partial<UseQueryOptions<Awaited<ReturnType<typeof getAbilities>>, TError, TData>> & Pick<
        UndefinedInitialDataOptions<
          Awaited<ReturnType<typeof getAbilities>>,
          TError,
          Awaited<ReturnType<typeof getAbilities>>
        > , 'initialData'
      >, request?: SecondParameter<typeof customInstance>}
 , queryClient?: QueryClient
  ):  UseQueryResult<TData, TError> & { queryKey: DataTag<QueryKey, TData, TError> }

export function useGetAbilities<TData = Awaited<ReturnType<typeof getAbilities>>, TError = ErrorType<void>>(
  options?: { query?:Partial<UseQueryOptions<Awaited<ReturnType<typeof getAbilities>>, TError, TData>>, request?: SecondParameter<typeof customInstance>}
 , queryClient?: QueryClient
  ):  UseQueryResult<TData, TError> & { queryKey: DataTag<QueryKey, TData, TError> }

/**
 * @summary 전체 권한 정의 목록 조회
 */

export function useGetAbilities<TData = Awaited<ReturnType<typeof getAbilities>>, TError = ErrorType<void>>(
  options?: { query?:Partial<UseQueryOptions<Awaited<ReturnType<typeof getAbilities>>, TError, TData>>, request?: SecondParameter<typeof customInstance>}
 , queryClient?: QueryClient 
 ):  UseQueryResult<TData, TError> & { queryKey: DataTag<QueryKey, TData, TError> } {

  const queryOptions = getGetAbilitiesQueryOptions(options)

  const query = useQuery(queryOptions, queryClient) as  UseQueryResult<TData, TError> & { queryKey: DataTag<QueryKey, TData, TError> };

  query.queryKey = queryOptions.queryKey ;

  return query;
}

/**
 * @summary 전체 권한 정의 목록 조회
 */
export const prefetchGetAbilitiesQuery = async <TData = Awaited<ReturnType<typeof getAbilities>>, TError = ErrorType<void>>(
 queryClient: QueryClient,  options?: { query?:Partial<UseQueryOptions<Awaited<ReturnType<typeof getAbilities>>, TError, TData>>, request?: SecondParameter<typeof customInstance>}

  ): Promise<QueryClient> => {

  const queryOptions = getGetAbilitiesQueryOptions(options)

  await queryClient.prefetchQuery(queryOptions);

  return queryClient;
}

export const getGetAbilitiesSuspenseQueryOptions = <TData = Awaited<ReturnType<typeof getAbilities>>, TError = ErrorType<void>>( options?: { query?:Partial<UseSuspenseQueryOptions<Awaited<ReturnType<typeof getAbilities>>, TError, TData>>, request?: SecondParameter<typeof customInstance>}
) => {

const {query: queryOptions, request: requestOptions} = options ?? {};

  const queryKey =  queryOptions?.queryKey ?? getGetAbilitiesQueryKey();

  

    const queryFn: QueryFunction<Awaited<ReturnType<typeof getAbilities>>> = ({ signal }) => getAbilities(requestOptions, signal);

      

      

   return  { queryKey, queryFn, ...queryOptions} as UseSuspenseQueryOptions<Awaited<ReturnType<typeof getAbilities>>, TError, TData> & { queryKey: DataTag<QueryKey, TData, TError> }
}

export type GetAbilitiesSuspenseQueryResult = NonNullable<Awaited<ReturnType<typeof getAbilities>>>

export type GetAbilitiesSuspenseQueryError = ErrorType<void>

export function useGetAbilitiesSuspense<TData = Awaited<ReturnType<typeof getAbilities>>, TError = ErrorType<void>>(
  options: { query:Partial<UseSuspenseQueryOptions<Awaited<ReturnType<typeof getAbilities>>, TError, TData>>, request?: SecondParameter<typeof customInstance>}
 , queryClient?: QueryClient
  ):  UseSuspenseQueryResult<TData, TError> & { queryKey: DataTag<QueryKey, TData, TError> }

export function useGetAbilitiesSuspense<TData = Awaited<ReturnType<typeof getAbilities>>, TError = ErrorType<void>>(
  options?: { query?:Partial<UseSuspenseQueryOptions<Awaited<ReturnType<typeof getAbilities>>, TError, TData>>, request?: SecondParameter<typeof customInstance>}
 , queryClient?: QueryClient
  ):  UseSuspenseQueryResult<TData, TError> & { queryKey: DataTag<QueryKey, TData, TError> }

export function useGetAbilitiesSuspense<TData = Awaited<ReturnType<typeof getAbilities>>, TError = ErrorType<void>>(
  options?: { query?:Partial<UseSuspenseQueryOptions<Awaited<ReturnType<typeof getAbilities>>, TError, TData>>, request?: SecondParameter<typeof customInstance>}
 , queryClient?: QueryClient
  ):  UseSuspenseQueryResult<TData, TError> & { queryKey: DataTag<QueryKey, TData, TError> }

/**
 * @summary 전체 권한 정의 목록 조회
 */

export function useGetAbilitiesSuspense<TData = Awaited<ReturnType<typeof getAbilities>>, TError = ErrorType<void>>(
  options?: { query?:Partial<UseSuspenseQueryOptions<Awaited<ReturnType<typeof getAbilities>>, TError, TData>>, request?: SecondParameter<typeof customInstance>}
 , queryClient?: QueryClient 
 ):  UseSuspenseQueryResult<TData, TError> & { queryKey: DataTag<QueryKey, TData, TError> } {

  const queryOptions = getGetAbilitiesSuspenseQueryOptions(options)

  const query = useSuspenseQuery(queryOptions, queryClient) as  UseSuspenseQueryResult<TData, TError> & { queryKey: DataTag<QueryKey, TData, TError> };

  query.queryKey = queryOptions.queryKey ;

  return query;
}

export const getGetAbilitiesSuspenseInfiniteQueryOptions = <TData = InfiniteData<Awaited<ReturnType<typeof getAbilities>>>, TError = ErrorType<void>>( options?: { query?:Partial<UseSuspenseInfiniteQueryOptions<Awaited<ReturnType<typeof getAbilities>>, TError, TData>>, request?: SecondParameter<typeof customInstance>}
) => {

const {query: queryOptions, request: requestOptions} = options ?? {};

  const queryKey =  queryOptions?.queryKey ?? getGetAbilitiesInfiniteQueryKey();

  

    const queryFn: QueryFunction<Awaited<ReturnType<typeof getAbilities>>> = ({ signal }) => getAbilities(requestOptions, signal);

      

      

   return  { queryKey, queryFn, ...queryOptions} as UseSuspenseInfiniteQueryOptions<Awaited<ReturnType<typeof getAbilities>>, TError, TData> & { queryKey: DataTag<QueryKey, TData, TError> }
}

export type GetAbilitiesSuspenseInfiniteQueryResult = NonNullable<Awaited<ReturnType<typeof getAbilities>>>

export type GetAbilitiesSuspenseInfiniteQueryError = ErrorType<void>

export function useGetAbilitiesSuspenseInfinite<TData = InfiniteData<Awaited<ReturnType<typeof getAbilities>>>, TError = ErrorType<void>>(
  options: { query:Partial<UseSuspenseInfiniteQueryOptions<Awaited<ReturnType<typeof getAbilities>>, TError, TData>>, request?: SecondParameter<typeof customInstance>}
 , queryClient?: QueryClient
  ):  UseSuspenseInfiniteQueryResult<TData, TError> & { queryKey: DataTag<QueryKey, TData, TError> }

export function useGetAbilitiesSuspenseInfinite<TData = InfiniteData<Awaited<ReturnType<typeof getAbilities>>>, TError = ErrorType<void>>(
  options?: { query?:Partial<UseSuspenseInfiniteQueryOptions<Awaited<ReturnType<typeof getAbilities>>, TError, TData>>, request?: SecondParameter<typeof customInstance>}
 , queryClient?: QueryClient
  ):  UseSuspenseInfiniteQueryResult<TData, TError> & { queryKey: DataTag<QueryKey, TData, TError> }

export function useGetAbilitiesSuspenseInfinite<TData = InfiniteData<Awaited<ReturnType<typeof getAbilities>>>, TError = ErrorType<void>>(
  options?: { query?:Partial<UseSuspenseInfiniteQueryOptions<Awaited<ReturnType<typeof getAbilities>>, TError, TData>>, request?: SecondParameter<typeof customInstance>}
 , queryClient?: QueryClient
  ):  UseSuspenseInfiniteQueryResult<TData, TError> & { queryKey: DataTag<QueryKey, TData, TError> }

/**
 * @summary 전체 권한 정의 목록 조회
 */

export function useGetAbilitiesSuspenseInfinite<TData = InfiniteData<Awaited<ReturnType<typeof getAbilities>>>, TError = ErrorType<void>>(
  options?: { query?:Partial<UseSuspenseInfiniteQueryOptions<Awaited<ReturnType<typeof getAbilities>>, TError, TData>>, request?: SecondParameter<typeof customInstance>}
 , queryClient?: QueryClient 
 ):  UseSuspenseInfiniteQueryResult<TData, TError> & { queryKey: DataTag<QueryKey, TData, TError> } {

  const queryOptions = getGetAbilitiesSuspenseInfiniteQueryOptions(options)

  const query = useSuspenseInfiniteQuery(queryOptions, queryClient) as  UseSuspenseInfiniteQueryResult<TData, TError> & { queryKey: DataTag<QueryKey, TData, TError> };

  query.queryKey = queryOptions.queryKey ;

  return query;
}

/**
 * @summary 전체 권한 정의 목록 조회
 */
export const prefetchGetAbilitiesInfiniteQuery = async <TData = Awaited<ReturnType<typeof getAbilities>>, TError = ErrorType<void>>(
 queryClient: QueryClient,  options?: { query?:Partial<UseSuspenseInfiniteQueryOptions<Awaited<ReturnType<typeof getAbilities>>, TError, TData>>, request?: SecondParameter<typeof customInstance>}

  ): Promise<QueryClient> => {

  const queryOptions = getGetAbilitiesSuspenseInfiniteQueryOptions(options)

  await queryClient.prefetchInfiniteQuery(queryOptions);

  return queryClient;
}

/**
 * 재사용 가능한 권한 정의를 생성합니다. Role/User에 할당하려면 Grant를 생성하세요.
 * @summary 권한 정의 생성
 */
export const createAbility = (
    createAbilityDto: BodyType<CreateAbilityDto>,
 options?: SecondParameter<typeof customInstance>,signal?: AbortSignal
) => {
      
      
      return customInstance<CreateAbility201AllOf>(
      {url: `/api/v1/abilities`, method: 'POST',
      headers: {'Content-Type': 'application/json', },
      data: createAbilityDto, signal
    },
      options);
    }

export const getCreateAbilityMutationOptions = <TError = ErrorType<void>,
    TContext = unknown>(options?: { mutation?:UseMutationOptions<Awaited<ReturnType<typeof createAbility>>, TError,{data: BodyType<CreateAbilityDto>}, TContext>, request?: SecondParameter<typeof customInstance>}
): UseMutationOptions<Awaited<ReturnType<typeof createAbility>>, TError,{data: BodyType<CreateAbilityDto>}, TContext> => {

const mutationKey = ['createAbility'];
const {mutation: mutationOptions, request: requestOptions} = options ?
      options.mutation && 'mutationKey' in options.mutation && options.mutation.mutationKey ?
      options
      : {...options, mutation: {...options.mutation, mutationKey}}
      : {mutation: { mutationKey, }, request: undefined};

      


      const mutationFn: MutationFunction<Awaited<ReturnType<typeof createAbility>>, {data: BodyType<CreateAbilityDto>}> = (props) => {
          const {data} = props ?? {};

          return  createAbility(data,requestOptions)
        }

        


  return  { mutationFn, ...mutationOptions }}

export type CreateAbilityMutationResult = NonNullable<Awaited<ReturnType<typeof createAbility>>>

export type CreateAbilityMutationBody = BodyType<CreateAbilityDto>

export type CreateAbilityMutationError = ErrorType<void>

/**
 * @summary 권한 정의 생성
 */
export const useCreateAbility = <TError = ErrorType<void>,
    TContext = unknown>(options?: { mutation?:UseMutationOptions<Awaited<ReturnType<typeof createAbility>>, TError,{data: BodyType<CreateAbilityDto>}, TContext>, request?: SecondParameter<typeof customInstance>}
 , queryClient?: QueryClient): UseMutationResult<
        Awaited<ReturnType<typeof createAbility>>,
        TError,
        {data: BodyType<CreateAbilityDto>},
        TContext
      > => {

      const mutationOptions = getCreateAbilityMutationOptions(options);

      return useMutation(mutationOptions, queryClient);
    }

/**
 * 현재 로그인한 사용자의 Role 권한과 예외 권한을 병합하여 조회합니다.
 * @summary 내 권한 조회
 */
export const getMyAbilities = (
    
 options?: SecondParameter<typeof customInstance>,signal?: AbortSignal
) => {
      
      
      return customInstance<GetMyAbilities200AllOf>(
      {url: `/api/v1/abilities/my`, method: 'GET', signal
    },
      options);
    }

export const getGetMyAbilitiesQueryKey = () => {
    return [
    `/api/v1/abilities/my`
    ] as const;
    }

export const getGetMyAbilitiesInfiniteQueryKey = () => {
    return [
    'infinite', `/api/v1/abilities/my`
    ] as const;
    }

export const getGetMyAbilitiesQueryOptions = <TData = Awaited<ReturnType<typeof getMyAbilities>>, TError = ErrorType<void>>( options?: { query?:Partial<UseQueryOptions<Awaited<ReturnType<typeof getMyAbilities>>, TError, TData>>, request?: SecondParameter<typeof customInstance>}
) => {

const {query: queryOptions, request: requestOptions} = options ?? {};

  const queryKey =  queryOptions?.queryKey ?? getGetMyAbilitiesQueryKey();

  

    const queryFn: QueryFunction<Awaited<ReturnType<typeof getMyAbilities>>> = ({ signal }) => getMyAbilities(requestOptions, signal);

      

      

   return  { queryKey, queryFn, ...queryOptions} as UseQueryOptions<Awaited<ReturnType<typeof getMyAbilities>>, TError, TData> & { queryKey: DataTag<QueryKey, TData, TError> }
}

export type GetMyAbilitiesQueryResult = NonNullable<Awaited<ReturnType<typeof getMyAbilities>>>

export type GetMyAbilitiesQueryError = ErrorType<void>

export function useGetMyAbilities<TData = Awaited<ReturnType<typeof getMyAbilities>>, TError = ErrorType<void>>(
  options: { query:Partial<UseQueryOptions<Awaited<ReturnType<typeof getMyAbilities>>, TError, TData>> & Pick<
        DefinedInitialDataOptions<
          Awaited<ReturnType<typeof getMyAbilities>>,
          TError,
          Awaited<ReturnType<typeof getMyAbilities>>
        > , 'initialData'
      >, request?: SecondParameter<typeof customInstance>}
 , queryClient?: QueryClient
  ):  DefinedUseQueryResult<TData, TError> & { queryKey: DataTag<QueryKey, TData, TError> }

export function useGetMyAbilities<TData = Awaited<ReturnType<typeof getMyAbilities>>, TError = ErrorType<void>>(
  options?: { query?:Partial<UseQueryOptions<Awaited<ReturnType<typeof getMyAbilities>>, TError, TData>> & Pick<
        UndefinedInitialDataOptions<
          Awaited<ReturnType<typeof getMyAbilities>>,
          TError,
          Awaited<ReturnType<typeof getMyAbilities>>
        > , 'initialData'
      >, request?: SecondParameter<typeof customInstance>}
 , queryClient?: QueryClient
  ):  UseQueryResult<TData, TError> & { queryKey: DataTag<QueryKey, TData, TError> }

export function useGetMyAbilities<TData = Awaited<ReturnType<typeof getMyAbilities>>, TError = ErrorType<void>>(
  options?: { query?:Partial<UseQueryOptions<Awaited<ReturnType<typeof getMyAbilities>>, TError, TData>>, request?: SecondParameter<typeof customInstance>}
 , queryClient?: QueryClient
  ):  UseQueryResult<TData, TError> & { queryKey: DataTag<QueryKey, TData, TError> }

/**
 * @summary 내 권한 조회
 */

export function useGetMyAbilities<TData = Awaited<ReturnType<typeof getMyAbilities>>, TError = ErrorType<void>>(
  options?: { query?:Partial<UseQueryOptions<Awaited<ReturnType<typeof getMyAbilities>>, TError, TData>>, request?: SecondParameter<typeof customInstance>}
 , queryClient?: QueryClient 
 ):  UseQueryResult<TData, TError> & { queryKey: DataTag<QueryKey, TData, TError> } {

  const queryOptions = getGetMyAbilitiesQueryOptions(options)

  const query = useQuery(queryOptions, queryClient) as  UseQueryResult<TData, TError> & { queryKey: DataTag<QueryKey, TData, TError> };

  query.queryKey = queryOptions.queryKey ;

  return query;
}

/**
 * @summary 내 권한 조회
 */
export const prefetchGetMyAbilitiesQuery = async <TData = Awaited<ReturnType<typeof getMyAbilities>>, TError = ErrorType<void>>(
 queryClient: QueryClient,  options?: { query?:Partial<UseQueryOptions<Awaited<ReturnType<typeof getMyAbilities>>, TError, TData>>, request?: SecondParameter<typeof customInstance>}

  ): Promise<QueryClient> => {

  const queryOptions = getGetMyAbilitiesQueryOptions(options)

  await queryClient.prefetchQuery(queryOptions);

  return queryClient;
}

export const getGetMyAbilitiesSuspenseQueryOptions = <TData = Awaited<ReturnType<typeof getMyAbilities>>, TError = ErrorType<void>>( options?: { query?:Partial<UseSuspenseQueryOptions<Awaited<ReturnType<typeof getMyAbilities>>, TError, TData>>, request?: SecondParameter<typeof customInstance>}
) => {

const {query: queryOptions, request: requestOptions} = options ?? {};

  const queryKey =  queryOptions?.queryKey ?? getGetMyAbilitiesQueryKey();

  

    const queryFn: QueryFunction<Awaited<ReturnType<typeof getMyAbilities>>> = ({ signal }) => getMyAbilities(requestOptions, signal);

      

      

   return  { queryKey, queryFn, ...queryOptions} as UseSuspenseQueryOptions<Awaited<ReturnType<typeof getMyAbilities>>, TError, TData> & { queryKey: DataTag<QueryKey, TData, TError> }
}

export type GetMyAbilitiesSuspenseQueryResult = NonNullable<Awaited<ReturnType<typeof getMyAbilities>>>

export type GetMyAbilitiesSuspenseQueryError = ErrorType<void>

export function useGetMyAbilitiesSuspense<TData = Awaited<ReturnType<typeof getMyAbilities>>, TError = ErrorType<void>>(
  options: { query:Partial<UseSuspenseQueryOptions<Awaited<ReturnType<typeof getMyAbilities>>, TError, TData>>, request?: SecondParameter<typeof customInstance>}
 , queryClient?: QueryClient
  ):  UseSuspenseQueryResult<TData, TError> & { queryKey: DataTag<QueryKey, TData, TError> }

export function useGetMyAbilitiesSuspense<TData = Awaited<ReturnType<typeof getMyAbilities>>, TError = ErrorType<void>>(
  options?: { query?:Partial<UseSuspenseQueryOptions<Awaited<ReturnType<typeof getMyAbilities>>, TError, TData>>, request?: SecondParameter<typeof customInstance>}
 , queryClient?: QueryClient
  ):  UseSuspenseQueryResult<TData, TError> & { queryKey: DataTag<QueryKey, TData, TError> }

export function useGetMyAbilitiesSuspense<TData = Awaited<ReturnType<typeof getMyAbilities>>, TError = ErrorType<void>>(
  options?: { query?:Partial<UseSuspenseQueryOptions<Awaited<ReturnType<typeof getMyAbilities>>, TError, TData>>, request?: SecondParameter<typeof customInstance>}
 , queryClient?: QueryClient
  ):  UseSuspenseQueryResult<TData, TError> & { queryKey: DataTag<QueryKey, TData, TError> }

/**
 * @summary 내 권한 조회
 */

export function useGetMyAbilitiesSuspense<TData = Awaited<ReturnType<typeof getMyAbilities>>, TError = ErrorType<void>>(
  options?: { query?:Partial<UseSuspenseQueryOptions<Awaited<ReturnType<typeof getMyAbilities>>, TError, TData>>, request?: SecondParameter<typeof customInstance>}
 , queryClient?: QueryClient 
 ):  UseSuspenseQueryResult<TData, TError> & { queryKey: DataTag<QueryKey, TData, TError> } {

  const queryOptions = getGetMyAbilitiesSuspenseQueryOptions(options)

  const query = useSuspenseQuery(queryOptions, queryClient) as  UseSuspenseQueryResult<TData, TError> & { queryKey: DataTag<QueryKey, TData, TError> };

  query.queryKey = queryOptions.queryKey ;

  return query;
}

export const getGetMyAbilitiesSuspenseInfiniteQueryOptions = <TData = InfiniteData<Awaited<ReturnType<typeof getMyAbilities>>>, TError = ErrorType<void>>( options?: { query?:Partial<UseSuspenseInfiniteQueryOptions<Awaited<ReturnType<typeof getMyAbilities>>, TError, TData>>, request?: SecondParameter<typeof customInstance>}
) => {

const {query: queryOptions, request: requestOptions} = options ?? {};

  const queryKey =  queryOptions?.queryKey ?? getGetMyAbilitiesInfiniteQueryKey();

  

    const queryFn: QueryFunction<Awaited<ReturnType<typeof getMyAbilities>>> = ({ signal }) => getMyAbilities(requestOptions, signal);

      

      

   return  { queryKey, queryFn, ...queryOptions} as UseSuspenseInfiniteQueryOptions<Awaited<ReturnType<typeof getMyAbilities>>, TError, TData> & { queryKey: DataTag<QueryKey, TData, TError> }
}

export type GetMyAbilitiesSuspenseInfiniteQueryResult = NonNullable<Awaited<ReturnType<typeof getMyAbilities>>>

export type GetMyAbilitiesSuspenseInfiniteQueryError = ErrorType<void>

export function useGetMyAbilitiesSuspenseInfinite<TData = InfiniteData<Awaited<ReturnType<typeof getMyAbilities>>>, TError = ErrorType<void>>(
  options: { query:Partial<UseSuspenseInfiniteQueryOptions<Awaited<ReturnType<typeof getMyAbilities>>, TError, TData>>, request?: SecondParameter<typeof customInstance>}
 , queryClient?: QueryClient
  ):  UseSuspenseInfiniteQueryResult<TData, TError> & { queryKey: DataTag<QueryKey, TData, TError> }

export function useGetMyAbilitiesSuspenseInfinite<TData = InfiniteData<Awaited<ReturnType<typeof getMyAbilities>>>, TError = ErrorType<void>>(
  options?: { query?:Partial<UseSuspenseInfiniteQueryOptions<Awaited<ReturnType<typeof getMyAbilities>>, TError, TData>>, request?: SecondParameter<typeof customInstance>}
 , queryClient?: QueryClient
  ):  UseSuspenseInfiniteQueryResult<TData, TError> & { queryKey: DataTag<QueryKey, TData, TError> }

export function useGetMyAbilitiesSuspenseInfinite<TData = InfiniteData<Awaited<ReturnType<typeof getMyAbilities>>>, TError = ErrorType<void>>(
  options?: { query?:Partial<UseSuspenseInfiniteQueryOptions<Awaited<ReturnType<typeof getMyAbilities>>, TError, TData>>, request?: SecondParameter<typeof customInstance>}
 , queryClient?: QueryClient
  ):  UseSuspenseInfiniteQueryResult<TData, TError> & { queryKey: DataTag<QueryKey, TData, TError> }

/**
 * @summary 내 권한 조회
 */

export function useGetMyAbilitiesSuspenseInfinite<TData = InfiniteData<Awaited<ReturnType<typeof getMyAbilities>>>, TError = ErrorType<void>>(
  options?: { query?:Partial<UseSuspenseInfiniteQueryOptions<Awaited<ReturnType<typeof getMyAbilities>>, TError, TData>>, request?: SecondParameter<typeof customInstance>}
 , queryClient?: QueryClient 
 ):  UseSuspenseInfiniteQueryResult<TData, TError> & { queryKey: DataTag<QueryKey, TData, TError> } {

  const queryOptions = getGetMyAbilitiesSuspenseInfiniteQueryOptions(options)

  const query = useSuspenseInfiniteQuery(queryOptions, queryClient) as  UseSuspenseInfiniteQueryResult<TData, TError> & { queryKey: DataTag<QueryKey, TData, TError> };

  query.queryKey = queryOptions.queryKey ;

  return query;
}

/**
 * @summary 내 권한 조회
 */
export const prefetchGetMyAbilitiesInfiniteQuery = async <TData = Awaited<ReturnType<typeof getMyAbilities>>, TError = ErrorType<void>>(
 queryClient: QueryClient,  options?: { query?:Partial<UseSuspenseInfiniteQueryOptions<Awaited<ReturnType<typeof getMyAbilities>>, TError, TData>>, request?: SecondParameter<typeof customInstance>}

  ): Promise<QueryClient> => {

  const queryOptions = getGetMyAbilitiesSuspenseInfiniteQueryOptions(options)

  await queryClient.prefetchInfiniteQuery(queryOptions);

  return queryClient;
}

/**
 * 특정 Role에 할당된 기본 권한 목록을 조회합니다.
 * @summary Role별 기본 권한 조회
 */
export const getAbilitiesByRoleId = (
    roleId: string,
 options?: SecondParameter<typeof customInstance>,signal?: AbortSignal
) => {
      
      
      return customInstance<GetAbilitiesByRoleId200AllOf>(
      {url: `/api/v1/abilities/roles/${roleId}`, method: 'GET', signal
    },
      options);
    }

export const getGetAbilitiesByRoleIdQueryKey = (roleId?: string,) => {
    return [
    `/api/v1/abilities/roles/${roleId}`
    ] as const;
    }

export const getGetAbilitiesByRoleIdInfiniteQueryKey = (roleId?: string,) => {
    return [
    'infinite', `/api/v1/abilities/roles/${roleId}`
    ] as const;
    }

export const getGetAbilitiesByRoleIdQueryOptions = <TData = Awaited<ReturnType<typeof getAbilitiesByRoleId>>, TError = ErrorType<void>>(roleId: string, options?: { query?:Partial<UseQueryOptions<Awaited<ReturnType<typeof getAbilitiesByRoleId>>, TError, TData>>, request?: SecondParameter<typeof customInstance>}
) => {

const {query: queryOptions, request: requestOptions} = options ?? {};

  const queryKey =  queryOptions?.queryKey ?? getGetAbilitiesByRoleIdQueryKey(roleId);

  

    const queryFn: QueryFunction<Awaited<ReturnType<typeof getAbilitiesByRoleId>>> = ({ signal }) => getAbilitiesByRoleId(roleId, requestOptions, signal);

      

      

   return  { queryKey, queryFn, enabled: !!(roleId), ...queryOptions} as UseQueryOptions<Awaited<ReturnType<typeof getAbilitiesByRoleId>>, TError, TData> & { queryKey: DataTag<QueryKey, TData, TError> }
}

export type GetAbilitiesByRoleIdQueryResult = NonNullable<Awaited<ReturnType<typeof getAbilitiesByRoleId>>>

export type GetAbilitiesByRoleIdQueryError = ErrorType<void>

export function useGetAbilitiesByRoleId<TData = Awaited<ReturnType<typeof getAbilitiesByRoleId>>, TError = ErrorType<void>>(
 roleId: string, options: { query:Partial<UseQueryOptions<Awaited<ReturnType<typeof getAbilitiesByRoleId>>, TError, TData>> & Pick<
        DefinedInitialDataOptions<
          Awaited<ReturnType<typeof getAbilitiesByRoleId>>,
          TError,
          Awaited<ReturnType<typeof getAbilitiesByRoleId>>
        > , 'initialData'
      >, request?: SecondParameter<typeof customInstance>}
 , queryClient?: QueryClient
  ):  DefinedUseQueryResult<TData, TError> & { queryKey: DataTag<QueryKey, TData, TError> }

export function useGetAbilitiesByRoleId<TData = Awaited<ReturnType<typeof getAbilitiesByRoleId>>, TError = ErrorType<void>>(
 roleId: string, options?: { query?:Partial<UseQueryOptions<Awaited<ReturnType<typeof getAbilitiesByRoleId>>, TError, TData>> & Pick<
        UndefinedInitialDataOptions<
          Awaited<ReturnType<typeof getAbilitiesByRoleId>>,
          TError,
          Awaited<ReturnType<typeof getAbilitiesByRoleId>>
        > , 'initialData'
      >, request?: SecondParameter<typeof customInstance>}
 , queryClient?: QueryClient
  ):  UseQueryResult<TData, TError> & { queryKey: DataTag<QueryKey, TData, TError> }

export function useGetAbilitiesByRoleId<TData = Awaited<ReturnType<typeof getAbilitiesByRoleId>>, TError = ErrorType<void>>(
 roleId: string, options?: { query?:Partial<UseQueryOptions<Awaited<ReturnType<typeof getAbilitiesByRoleId>>, TError, TData>>, request?: SecondParameter<typeof customInstance>}
 , queryClient?: QueryClient
  ):  UseQueryResult<TData, TError> & { queryKey: DataTag<QueryKey, TData, TError> }

/**
 * @summary Role별 기본 권한 조회
 */

export function useGetAbilitiesByRoleId<TData = Awaited<ReturnType<typeof getAbilitiesByRoleId>>, TError = ErrorType<void>>(
 roleId: string, options?: { query?:Partial<UseQueryOptions<Awaited<ReturnType<typeof getAbilitiesByRoleId>>, TError, TData>>, request?: SecondParameter<typeof customInstance>}
 , queryClient?: QueryClient 
 ):  UseQueryResult<TData, TError> & { queryKey: DataTag<QueryKey, TData, TError> } {

  const queryOptions = getGetAbilitiesByRoleIdQueryOptions(roleId,options)

  const query = useQuery(queryOptions, queryClient) as  UseQueryResult<TData, TError> & { queryKey: DataTag<QueryKey, TData, TError> };

  query.queryKey = queryOptions.queryKey ;

  return query;
}

/**
 * @summary Role별 기본 권한 조회
 */
export const prefetchGetAbilitiesByRoleIdQuery = async <TData = Awaited<ReturnType<typeof getAbilitiesByRoleId>>, TError = ErrorType<void>>(
 queryClient: QueryClient, roleId: string, options?: { query?:Partial<UseQueryOptions<Awaited<ReturnType<typeof getAbilitiesByRoleId>>, TError, TData>>, request?: SecondParameter<typeof customInstance>}

  ): Promise<QueryClient> => {

  const queryOptions = getGetAbilitiesByRoleIdQueryOptions(roleId,options)

  await queryClient.prefetchQuery(queryOptions);

  return queryClient;
}

export const getGetAbilitiesByRoleIdSuspenseQueryOptions = <TData = Awaited<ReturnType<typeof getAbilitiesByRoleId>>, TError = ErrorType<void>>(roleId: string, options?: { query?:Partial<UseSuspenseQueryOptions<Awaited<ReturnType<typeof getAbilitiesByRoleId>>, TError, TData>>, request?: SecondParameter<typeof customInstance>}
) => {

const {query: queryOptions, request: requestOptions} = options ?? {};

  const queryKey =  queryOptions?.queryKey ?? getGetAbilitiesByRoleIdQueryKey(roleId);

  

    const queryFn: QueryFunction<Awaited<ReturnType<typeof getAbilitiesByRoleId>>> = ({ signal }) => getAbilitiesByRoleId(roleId, requestOptions, signal);

      

      

   return  { queryKey, queryFn, ...queryOptions} as UseSuspenseQueryOptions<Awaited<ReturnType<typeof getAbilitiesByRoleId>>, TError, TData> & { queryKey: DataTag<QueryKey, TData, TError> }
}

export type GetAbilitiesByRoleIdSuspenseQueryResult = NonNullable<Awaited<ReturnType<typeof getAbilitiesByRoleId>>>

export type GetAbilitiesByRoleIdSuspenseQueryError = ErrorType<void>

export function useGetAbilitiesByRoleIdSuspense<TData = Awaited<ReturnType<typeof getAbilitiesByRoleId>>, TError = ErrorType<void>>(
 roleId: string, options: { query:Partial<UseSuspenseQueryOptions<Awaited<ReturnType<typeof getAbilitiesByRoleId>>, TError, TData>>, request?: SecondParameter<typeof customInstance>}
 , queryClient?: QueryClient
  ):  UseSuspenseQueryResult<TData, TError> & { queryKey: DataTag<QueryKey, TData, TError> }

export function useGetAbilitiesByRoleIdSuspense<TData = Awaited<ReturnType<typeof getAbilitiesByRoleId>>, TError = ErrorType<void>>(
 roleId: string, options?: { query?:Partial<UseSuspenseQueryOptions<Awaited<ReturnType<typeof getAbilitiesByRoleId>>, TError, TData>>, request?: SecondParameter<typeof customInstance>}
 , queryClient?: QueryClient
  ):  UseSuspenseQueryResult<TData, TError> & { queryKey: DataTag<QueryKey, TData, TError> }

export function useGetAbilitiesByRoleIdSuspense<TData = Awaited<ReturnType<typeof getAbilitiesByRoleId>>, TError = ErrorType<void>>(
 roleId: string, options?: { query?:Partial<UseSuspenseQueryOptions<Awaited<ReturnType<typeof getAbilitiesByRoleId>>, TError, TData>>, request?: SecondParameter<typeof customInstance>}
 , queryClient?: QueryClient
  ):  UseSuspenseQueryResult<TData, TError> & { queryKey: DataTag<QueryKey, TData, TError> }

/**
 * @summary Role별 기본 권한 조회
 */

export function useGetAbilitiesByRoleIdSuspense<TData = Awaited<ReturnType<typeof getAbilitiesByRoleId>>, TError = ErrorType<void>>(
 roleId: string, options?: { query?:Partial<UseSuspenseQueryOptions<Awaited<ReturnType<typeof getAbilitiesByRoleId>>, TError, TData>>, request?: SecondParameter<typeof customInstance>}
 , queryClient?: QueryClient 
 ):  UseSuspenseQueryResult<TData, TError> & { queryKey: DataTag<QueryKey, TData, TError> } {

  const queryOptions = getGetAbilitiesByRoleIdSuspenseQueryOptions(roleId,options)

  const query = useSuspenseQuery(queryOptions, queryClient) as  UseSuspenseQueryResult<TData, TError> & { queryKey: DataTag<QueryKey, TData, TError> };

  query.queryKey = queryOptions.queryKey ;

  return query;
}

export const getGetAbilitiesByRoleIdSuspenseInfiniteQueryOptions = <TData = InfiniteData<Awaited<ReturnType<typeof getAbilitiesByRoleId>>>, TError = ErrorType<void>>(roleId: string, options?: { query?:Partial<UseSuspenseInfiniteQueryOptions<Awaited<ReturnType<typeof getAbilitiesByRoleId>>, TError, TData>>, request?: SecondParameter<typeof customInstance>}
) => {

const {query: queryOptions, request: requestOptions} = options ?? {};

  const queryKey =  queryOptions?.queryKey ?? getGetAbilitiesByRoleIdInfiniteQueryKey(roleId);

  

    const queryFn: QueryFunction<Awaited<ReturnType<typeof getAbilitiesByRoleId>>> = ({ signal }) => getAbilitiesByRoleId(roleId, requestOptions, signal);

      

      

   return  { queryKey, queryFn, ...queryOptions} as UseSuspenseInfiniteQueryOptions<Awaited<ReturnType<typeof getAbilitiesByRoleId>>, TError, TData> & { queryKey: DataTag<QueryKey, TData, TError> }
}

export type GetAbilitiesByRoleIdSuspenseInfiniteQueryResult = NonNullable<Awaited<ReturnType<typeof getAbilitiesByRoleId>>>

export type GetAbilitiesByRoleIdSuspenseInfiniteQueryError = ErrorType<void>

export function useGetAbilitiesByRoleIdSuspenseInfinite<TData = InfiniteData<Awaited<ReturnType<typeof getAbilitiesByRoleId>>>, TError = ErrorType<void>>(
 roleId: string, options: { query:Partial<UseSuspenseInfiniteQueryOptions<Awaited<ReturnType<typeof getAbilitiesByRoleId>>, TError, TData>>, request?: SecondParameter<typeof customInstance>}
 , queryClient?: QueryClient
  ):  UseSuspenseInfiniteQueryResult<TData, TError> & { queryKey: DataTag<QueryKey, TData, TError> }

export function useGetAbilitiesByRoleIdSuspenseInfinite<TData = InfiniteData<Awaited<ReturnType<typeof getAbilitiesByRoleId>>>, TError = ErrorType<void>>(
 roleId: string, options?: { query?:Partial<UseSuspenseInfiniteQueryOptions<Awaited<ReturnType<typeof getAbilitiesByRoleId>>, TError, TData>>, request?: SecondParameter<typeof customInstance>}
 , queryClient?: QueryClient
  ):  UseSuspenseInfiniteQueryResult<TData, TError> & { queryKey: DataTag<QueryKey, TData, TError> }

export function useGetAbilitiesByRoleIdSuspenseInfinite<TData = InfiniteData<Awaited<ReturnType<typeof getAbilitiesByRoleId>>>, TError = ErrorType<void>>(
 roleId: string, options?: { query?:Partial<UseSuspenseInfiniteQueryOptions<Awaited<ReturnType<typeof getAbilitiesByRoleId>>, TError, TData>>, request?: SecondParameter<typeof customInstance>}
 , queryClient?: QueryClient
  ):  UseSuspenseInfiniteQueryResult<TData, TError> & { queryKey: DataTag<QueryKey, TData, TError> }

/**
 * @summary Role별 기본 권한 조회
 */

export function useGetAbilitiesByRoleIdSuspenseInfinite<TData = InfiniteData<Awaited<ReturnType<typeof getAbilitiesByRoleId>>>, TError = ErrorType<void>>(
 roleId: string, options?: { query?:Partial<UseSuspenseInfiniteQueryOptions<Awaited<ReturnType<typeof getAbilitiesByRoleId>>, TError, TData>>, request?: SecondParameter<typeof customInstance>}
 , queryClient?: QueryClient 
 ):  UseSuspenseInfiniteQueryResult<TData, TError> & { queryKey: DataTag<QueryKey, TData, TError> } {

  const queryOptions = getGetAbilitiesByRoleIdSuspenseInfiniteQueryOptions(roleId,options)

  const query = useSuspenseInfiniteQuery(queryOptions, queryClient) as  UseSuspenseInfiniteQueryResult<TData, TError> & { queryKey: DataTag<QueryKey, TData, TError> };

  query.queryKey = queryOptions.queryKey ;

  return query;
}

/**
 * @summary Role별 기본 권한 조회
 */
export const prefetchGetAbilitiesByRoleIdInfiniteQuery = async <TData = Awaited<ReturnType<typeof getAbilitiesByRoleId>>, TError = ErrorType<void>>(
 queryClient: QueryClient, roleId: string, options?: { query?:Partial<UseSuspenseInfiniteQueryOptions<Awaited<ReturnType<typeof getAbilitiesByRoleId>>, TError, TData>>, request?: SecondParameter<typeof customInstance>}

  ): Promise<QueryClient> => {

  const queryOptions = getGetAbilitiesByRoleIdSuspenseInfiniteQueryOptions(roleId,options)

  await queryClient.prefetchInfiniteQuery(queryOptions);

  return queryClient;
}

/**
 * 특정 User에게 할당된 예외 권한 목록을 조회합니다.
 * @summary User별 예외 권한 조회
 */
export const getAbilitiesByUserId = (
    userId: string,
 options?: SecondParameter<typeof customInstance>,signal?: AbortSignal
) => {
      
      
      return customInstance<GetAbilitiesByUserId200AllOf>(
      {url: `/api/v1/abilities/users/${userId}`, method: 'GET', signal
    },
      options);
    }

export const getGetAbilitiesByUserIdQueryKey = (userId?: string,) => {
    return [
    `/api/v1/abilities/users/${userId}`
    ] as const;
    }

export const getGetAbilitiesByUserIdInfiniteQueryKey = (userId?: string,) => {
    return [
    'infinite', `/api/v1/abilities/users/${userId}`
    ] as const;
    }

export const getGetAbilitiesByUserIdQueryOptions = <TData = Awaited<ReturnType<typeof getAbilitiesByUserId>>, TError = ErrorType<void>>(userId: string, options?: { query?:Partial<UseQueryOptions<Awaited<ReturnType<typeof getAbilitiesByUserId>>, TError, TData>>, request?: SecondParameter<typeof customInstance>}
) => {

const {query: queryOptions, request: requestOptions} = options ?? {};

  const queryKey =  queryOptions?.queryKey ?? getGetAbilitiesByUserIdQueryKey(userId);

  

    const queryFn: QueryFunction<Awaited<ReturnType<typeof getAbilitiesByUserId>>> = ({ signal }) => getAbilitiesByUserId(userId, requestOptions, signal);

      

      

   return  { queryKey, queryFn, enabled: !!(userId), ...queryOptions} as UseQueryOptions<Awaited<ReturnType<typeof getAbilitiesByUserId>>, TError, TData> & { queryKey: DataTag<QueryKey, TData, TError> }
}

export type GetAbilitiesByUserIdQueryResult = NonNullable<Awaited<ReturnType<typeof getAbilitiesByUserId>>>

export type GetAbilitiesByUserIdQueryError = ErrorType<void>

export function useGetAbilitiesByUserId<TData = Awaited<ReturnType<typeof getAbilitiesByUserId>>, TError = ErrorType<void>>(
 userId: string, options: { query:Partial<UseQueryOptions<Awaited<ReturnType<typeof getAbilitiesByUserId>>, TError, TData>> & Pick<
        DefinedInitialDataOptions<
          Awaited<ReturnType<typeof getAbilitiesByUserId>>,
          TError,
          Awaited<ReturnType<typeof getAbilitiesByUserId>>
        > , 'initialData'
      >, request?: SecondParameter<typeof customInstance>}
 , queryClient?: QueryClient
  ):  DefinedUseQueryResult<TData, TError> & { queryKey: DataTag<QueryKey, TData, TError> }

export function useGetAbilitiesByUserId<TData = Awaited<ReturnType<typeof getAbilitiesByUserId>>, TError = ErrorType<void>>(
 userId: string, options?: { query?:Partial<UseQueryOptions<Awaited<ReturnType<typeof getAbilitiesByUserId>>, TError, TData>> & Pick<
        UndefinedInitialDataOptions<
          Awaited<ReturnType<typeof getAbilitiesByUserId>>,
          TError,
          Awaited<ReturnType<typeof getAbilitiesByUserId>>
        > , 'initialData'
      >, request?: SecondParameter<typeof customInstance>}
 , queryClient?: QueryClient
  ):  UseQueryResult<TData, TError> & { queryKey: DataTag<QueryKey, TData, TError> }

export function useGetAbilitiesByUserId<TData = Awaited<ReturnType<typeof getAbilitiesByUserId>>, TError = ErrorType<void>>(
 userId: string, options?: { query?:Partial<UseQueryOptions<Awaited<ReturnType<typeof getAbilitiesByUserId>>, TError, TData>>, request?: SecondParameter<typeof customInstance>}
 , queryClient?: QueryClient
  ):  UseQueryResult<TData, TError> & { queryKey: DataTag<QueryKey, TData, TError> }

/**
 * @summary User별 예외 권한 조회
 */

export function useGetAbilitiesByUserId<TData = Awaited<ReturnType<typeof getAbilitiesByUserId>>, TError = ErrorType<void>>(
 userId: string, options?: { query?:Partial<UseQueryOptions<Awaited<ReturnType<typeof getAbilitiesByUserId>>, TError, TData>>, request?: SecondParameter<typeof customInstance>}
 , queryClient?: QueryClient 
 ):  UseQueryResult<TData, TError> & { queryKey: DataTag<QueryKey, TData, TError> } {

  const queryOptions = getGetAbilitiesByUserIdQueryOptions(userId,options)

  const query = useQuery(queryOptions, queryClient) as  UseQueryResult<TData, TError> & { queryKey: DataTag<QueryKey, TData, TError> };

  query.queryKey = queryOptions.queryKey ;

  return query;
}

/**
 * @summary User별 예외 권한 조회
 */
export const prefetchGetAbilitiesByUserIdQuery = async <TData = Awaited<ReturnType<typeof getAbilitiesByUserId>>, TError = ErrorType<void>>(
 queryClient: QueryClient, userId: string, options?: { query?:Partial<UseQueryOptions<Awaited<ReturnType<typeof getAbilitiesByUserId>>, TError, TData>>, request?: SecondParameter<typeof customInstance>}

  ): Promise<QueryClient> => {

  const queryOptions = getGetAbilitiesByUserIdQueryOptions(userId,options)

  await queryClient.prefetchQuery(queryOptions);

  return queryClient;
}

export const getGetAbilitiesByUserIdSuspenseQueryOptions = <TData = Awaited<ReturnType<typeof getAbilitiesByUserId>>, TError = ErrorType<void>>(userId: string, options?: { query?:Partial<UseSuspenseQueryOptions<Awaited<ReturnType<typeof getAbilitiesByUserId>>, TError, TData>>, request?: SecondParameter<typeof customInstance>}
) => {

const {query: queryOptions, request: requestOptions} = options ?? {};

  const queryKey =  queryOptions?.queryKey ?? getGetAbilitiesByUserIdQueryKey(userId);

  

    const queryFn: QueryFunction<Awaited<ReturnType<typeof getAbilitiesByUserId>>> = ({ signal }) => getAbilitiesByUserId(userId, requestOptions, signal);

      

      

   return  { queryKey, queryFn, ...queryOptions} as UseSuspenseQueryOptions<Awaited<ReturnType<typeof getAbilitiesByUserId>>, TError, TData> & { queryKey: DataTag<QueryKey, TData, TError> }
}

export type GetAbilitiesByUserIdSuspenseQueryResult = NonNullable<Awaited<ReturnType<typeof getAbilitiesByUserId>>>

export type GetAbilitiesByUserIdSuspenseQueryError = ErrorType<void>

export function useGetAbilitiesByUserIdSuspense<TData = Awaited<ReturnType<typeof getAbilitiesByUserId>>, TError = ErrorType<void>>(
 userId: string, options: { query:Partial<UseSuspenseQueryOptions<Awaited<ReturnType<typeof getAbilitiesByUserId>>, TError, TData>>, request?: SecondParameter<typeof customInstance>}
 , queryClient?: QueryClient
  ):  UseSuspenseQueryResult<TData, TError> & { queryKey: DataTag<QueryKey, TData, TError> }

export function useGetAbilitiesByUserIdSuspense<TData = Awaited<ReturnType<typeof getAbilitiesByUserId>>, TError = ErrorType<void>>(
 userId: string, options?: { query?:Partial<UseSuspenseQueryOptions<Awaited<ReturnType<typeof getAbilitiesByUserId>>, TError, TData>>, request?: SecondParameter<typeof customInstance>}
 , queryClient?: QueryClient
  ):  UseSuspenseQueryResult<TData, TError> & { queryKey: DataTag<QueryKey, TData, TError> }

export function useGetAbilitiesByUserIdSuspense<TData = Awaited<ReturnType<typeof getAbilitiesByUserId>>, TError = ErrorType<void>>(
 userId: string, options?: { query?:Partial<UseSuspenseQueryOptions<Awaited<ReturnType<typeof getAbilitiesByUserId>>, TError, TData>>, request?: SecondParameter<typeof customInstance>}
 , queryClient?: QueryClient
  ):  UseSuspenseQueryResult<TData, TError> & { queryKey: DataTag<QueryKey, TData, TError> }

/**
 * @summary User별 예외 권한 조회
 */

export function useGetAbilitiesByUserIdSuspense<TData = Awaited<ReturnType<typeof getAbilitiesByUserId>>, TError = ErrorType<void>>(
 userId: string, options?: { query?:Partial<UseSuspenseQueryOptions<Awaited<ReturnType<typeof getAbilitiesByUserId>>, TError, TData>>, request?: SecondParameter<typeof customInstance>}
 , queryClient?: QueryClient 
 ):  UseSuspenseQueryResult<TData, TError> & { queryKey: DataTag<QueryKey, TData, TError> } {

  const queryOptions = getGetAbilitiesByUserIdSuspenseQueryOptions(userId,options)

  const query = useSuspenseQuery(queryOptions, queryClient) as  UseSuspenseQueryResult<TData, TError> & { queryKey: DataTag<QueryKey, TData, TError> };

  query.queryKey = queryOptions.queryKey ;

  return query;
}

export const getGetAbilitiesByUserIdSuspenseInfiniteQueryOptions = <TData = InfiniteData<Awaited<ReturnType<typeof getAbilitiesByUserId>>>, TError = ErrorType<void>>(userId: string, options?: { query?:Partial<UseSuspenseInfiniteQueryOptions<Awaited<ReturnType<typeof getAbilitiesByUserId>>, TError, TData>>, request?: SecondParameter<typeof customInstance>}
) => {

const {query: queryOptions, request: requestOptions} = options ?? {};

  const queryKey =  queryOptions?.queryKey ?? getGetAbilitiesByUserIdInfiniteQueryKey(userId);

  

    const queryFn: QueryFunction<Awaited<ReturnType<typeof getAbilitiesByUserId>>> = ({ signal }) => getAbilitiesByUserId(userId, requestOptions, signal);

      

      

   return  { queryKey, queryFn, ...queryOptions} as UseSuspenseInfiniteQueryOptions<Awaited<ReturnType<typeof getAbilitiesByUserId>>, TError, TData> & { queryKey: DataTag<QueryKey, TData, TError> }
}

export type GetAbilitiesByUserIdSuspenseInfiniteQueryResult = NonNullable<Awaited<ReturnType<typeof getAbilitiesByUserId>>>

export type GetAbilitiesByUserIdSuspenseInfiniteQueryError = ErrorType<void>

export function useGetAbilitiesByUserIdSuspenseInfinite<TData = InfiniteData<Awaited<ReturnType<typeof getAbilitiesByUserId>>>, TError = ErrorType<void>>(
 userId: string, options: { query:Partial<UseSuspenseInfiniteQueryOptions<Awaited<ReturnType<typeof getAbilitiesByUserId>>, TError, TData>>, request?: SecondParameter<typeof customInstance>}
 , queryClient?: QueryClient
  ):  UseSuspenseInfiniteQueryResult<TData, TError> & { queryKey: DataTag<QueryKey, TData, TError> }

export function useGetAbilitiesByUserIdSuspenseInfinite<TData = InfiniteData<Awaited<ReturnType<typeof getAbilitiesByUserId>>>, TError = ErrorType<void>>(
 userId: string, options?: { query?:Partial<UseSuspenseInfiniteQueryOptions<Awaited<ReturnType<typeof getAbilitiesByUserId>>, TError, TData>>, request?: SecondParameter<typeof customInstance>}
 , queryClient?: QueryClient
  ):  UseSuspenseInfiniteQueryResult<TData, TError> & { queryKey: DataTag<QueryKey, TData, TError> }

export function useGetAbilitiesByUserIdSuspenseInfinite<TData = InfiniteData<Awaited<ReturnType<typeof getAbilitiesByUserId>>>, TError = ErrorType<void>>(
 userId: string, options?: { query?:Partial<UseSuspenseInfiniteQueryOptions<Awaited<ReturnType<typeof getAbilitiesByUserId>>, TError, TData>>, request?: SecondParameter<typeof customInstance>}
 , queryClient?: QueryClient
  ):  UseSuspenseInfiniteQueryResult<TData, TError> & { queryKey: DataTag<QueryKey, TData, TError> }

/**
 * @summary User별 예외 권한 조회
 */

export function useGetAbilitiesByUserIdSuspenseInfinite<TData = InfiniteData<Awaited<ReturnType<typeof getAbilitiesByUserId>>>, TError = ErrorType<void>>(
 userId: string, options?: { query?:Partial<UseSuspenseInfiniteQueryOptions<Awaited<ReturnType<typeof getAbilitiesByUserId>>, TError, TData>>, request?: SecondParameter<typeof customInstance>}
 , queryClient?: QueryClient 
 ):  UseSuspenseInfiniteQueryResult<TData, TError> & { queryKey: DataTag<QueryKey, TData, TError> } {

  const queryOptions = getGetAbilitiesByUserIdSuspenseInfiniteQueryOptions(userId,options)

  const query = useSuspenseInfiniteQuery(queryOptions, queryClient) as  UseSuspenseInfiniteQueryResult<TData, TError> & { queryKey: DataTag<QueryKey, TData, TError> };

  query.queryKey = queryOptions.queryKey ;

  return query;
}

/**
 * @summary User별 예외 권한 조회
 */
export const prefetchGetAbilitiesByUserIdInfiniteQuery = async <TData = Awaited<ReturnType<typeof getAbilitiesByUserId>>, TError = ErrorType<void>>(
 queryClient: QueryClient, userId: string, options?: { query?:Partial<UseSuspenseInfiniteQueryOptions<Awaited<ReturnType<typeof getAbilitiesByUserId>>, TError, TData>>, request?: SecondParameter<typeof customInstance>}

  ): Promise<QueryClient> => {

  const queryOptions = getGetAbilitiesByUserIdSuspenseInfiniteQueryOptions(userId,options)

  await queryClient.prefetchInfiniteQuery(queryOptions);

  return queryClient;
}

/**
 * ID로 특정 권한을 조회합니다.
 * @summary 권한 상세 조회
 */
export const getAbilityById = (
    id: string,
 options?: SecondParameter<typeof customInstance>,signal?: AbortSignal
) => {
      
      
      return customInstance<GetAbilityById200AllOf>(
      {url: `/api/v1/abilities/${id}`, method: 'GET', signal
    },
      options);
    }

export const getGetAbilityByIdQueryKey = (id?: string,) => {
    return [
    `/api/v1/abilities/${id}`
    ] as const;
    }

export const getGetAbilityByIdInfiniteQueryKey = (id?: string,) => {
    return [
    'infinite', `/api/v1/abilities/${id}`
    ] as const;
    }

export const getGetAbilityByIdQueryOptions = <TData = Awaited<ReturnType<typeof getAbilityById>>, TError = ErrorType<void>>(id: string, options?: { query?:Partial<UseQueryOptions<Awaited<ReturnType<typeof getAbilityById>>, TError, TData>>, request?: SecondParameter<typeof customInstance>}
) => {

const {query: queryOptions, request: requestOptions} = options ?? {};

  const queryKey =  queryOptions?.queryKey ?? getGetAbilityByIdQueryKey(id);

  

    const queryFn: QueryFunction<Awaited<ReturnType<typeof getAbilityById>>> = ({ signal }) => getAbilityById(id, requestOptions, signal);

      

      

   return  { queryKey, queryFn, enabled: !!(id), ...queryOptions} as UseQueryOptions<Awaited<ReturnType<typeof getAbilityById>>, TError, TData> & { queryKey: DataTag<QueryKey, TData, TError> }
}

export type GetAbilityByIdQueryResult = NonNullable<Awaited<ReturnType<typeof getAbilityById>>>

export type GetAbilityByIdQueryError = ErrorType<void>

export function useGetAbilityById<TData = Awaited<ReturnType<typeof getAbilityById>>, TError = ErrorType<void>>(
 id: string, options: { query:Partial<UseQueryOptions<Awaited<ReturnType<typeof getAbilityById>>, TError, TData>> & Pick<
        DefinedInitialDataOptions<
          Awaited<ReturnType<typeof getAbilityById>>,
          TError,
          Awaited<ReturnType<typeof getAbilityById>>
        > , 'initialData'
      >, request?: SecondParameter<typeof customInstance>}
 , queryClient?: QueryClient
  ):  DefinedUseQueryResult<TData, TError> & { queryKey: DataTag<QueryKey, TData, TError> }

export function useGetAbilityById<TData = Awaited<ReturnType<typeof getAbilityById>>, TError = ErrorType<void>>(
 id: string, options?: { query?:Partial<UseQueryOptions<Awaited<ReturnType<typeof getAbilityById>>, TError, TData>> & Pick<
        UndefinedInitialDataOptions<
          Awaited<ReturnType<typeof getAbilityById>>,
          TError,
          Awaited<ReturnType<typeof getAbilityById>>
        > , 'initialData'
      >, request?: SecondParameter<typeof customInstance>}
 , queryClient?: QueryClient
  ):  UseQueryResult<TData, TError> & { queryKey: DataTag<QueryKey, TData, TError> }

export function useGetAbilityById<TData = Awaited<ReturnType<typeof getAbilityById>>, TError = ErrorType<void>>(
 id: string, options?: { query?:Partial<UseQueryOptions<Awaited<ReturnType<typeof getAbilityById>>, TError, TData>>, request?: SecondParameter<typeof customInstance>}
 , queryClient?: QueryClient
  ):  UseQueryResult<TData, TError> & { queryKey: DataTag<QueryKey, TData, TError> }

/**
 * @summary 권한 상세 조회
 */

export function useGetAbilityById<TData = Awaited<ReturnType<typeof getAbilityById>>, TError = ErrorType<void>>(
 id: string, options?: { query?:Partial<UseQueryOptions<Awaited<ReturnType<typeof getAbilityById>>, TError, TData>>, request?: SecondParameter<typeof customInstance>}
 , queryClient?: QueryClient 
 ):  UseQueryResult<TData, TError> & { queryKey: DataTag<QueryKey, TData, TError> } {

  const queryOptions = getGetAbilityByIdQueryOptions(id,options)

  const query = useQuery(queryOptions, queryClient) as  UseQueryResult<TData, TError> & { queryKey: DataTag<QueryKey, TData, TError> };

  query.queryKey = queryOptions.queryKey ;

  return query;
}

/**
 * @summary 권한 상세 조회
 */
export const prefetchGetAbilityByIdQuery = async <TData = Awaited<ReturnType<typeof getAbilityById>>, TError = ErrorType<void>>(
 queryClient: QueryClient, id: string, options?: { query?:Partial<UseQueryOptions<Awaited<ReturnType<typeof getAbilityById>>, TError, TData>>, request?: SecondParameter<typeof customInstance>}

  ): Promise<QueryClient> => {

  const queryOptions = getGetAbilityByIdQueryOptions(id,options)

  await queryClient.prefetchQuery(queryOptions);

  return queryClient;
}

export const getGetAbilityByIdSuspenseQueryOptions = <TData = Awaited<ReturnType<typeof getAbilityById>>, TError = ErrorType<void>>(id: string, options?: { query?:Partial<UseSuspenseQueryOptions<Awaited<ReturnType<typeof getAbilityById>>, TError, TData>>, request?: SecondParameter<typeof customInstance>}
) => {

const {query: queryOptions, request: requestOptions} = options ?? {};

  const queryKey =  queryOptions?.queryKey ?? getGetAbilityByIdQueryKey(id);

  

    const queryFn: QueryFunction<Awaited<ReturnType<typeof getAbilityById>>> = ({ signal }) => getAbilityById(id, requestOptions, signal);

      

      

   return  { queryKey, queryFn, ...queryOptions} as UseSuspenseQueryOptions<Awaited<ReturnType<typeof getAbilityById>>, TError, TData> & { queryKey: DataTag<QueryKey, TData, TError> }
}

export type GetAbilityByIdSuspenseQueryResult = NonNullable<Awaited<ReturnType<typeof getAbilityById>>>

export type GetAbilityByIdSuspenseQueryError = ErrorType<void>

export function useGetAbilityByIdSuspense<TData = Awaited<ReturnType<typeof getAbilityById>>, TError = ErrorType<void>>(
 id: string, options: { query:Partial<UseSuspenseQueryOptions<Awaited<ReturnType<typeof getAbilityById>>, TError, TData>>, request?: SecondParameter<typeof customInstance>}
 , queryClient?: QueryClient
  ):  UseSuspenseQueryResult<TData, TError> & { queryKey: DataTag<QueryKey, TData, TError> }

export function useGetAbilityByIdSuspense<TData = Awaited<ReturnType<typeof getAbilityById>>, TError = ErrorType<void>>(
 id: string, options?: { query?:Partial<UseSuspenseQueryOptions<Awaited<ReturnType<typeof getAbilityById>>, TError, TData>>, request?: SecondParameter<typeof customInstance>}
 , queryClient?: QueryClient
  ):  UseSuspenseQueryResult<TData, TError> & { queryKey: DataTag<QueryKey, TData, TError> }

export function useGetAbilityByIdSuspense<TData = Awaited<ReturnType<typeof getAbilityById>>, TError = ErrorType<void>>(
 id: string, options?: { query?:Partial<UseSuspenseQueryOptions<Awaited<ReturnType<typeof getAbilityById>>, TError, TData>>, request?: SecondParameter<typeof customInstance>}
 , queryClient?: QueryClient
  ):  UseSuspenseQueryResult<TData, TError> & { queryKey: DataTag<QueryKey, TData, TError> }

/**
 * @summary 권한 상세 조회
 */

export function useGetAbilityByIdSuspense<TData = Awaited<ReturnType<typeof getAbilityById>>, TError = ErrorType<void>>(
 id: string, options?: { query?:Partial<UseSuspenseQueryOptions<Awaited<ReturnType<typeof getAbilityById>>, TError, TData>>, request?: SecondParameter<typeof customInstance>}
 , queryClient?: QueryClient 
 ):  UseSuspenseQueryResult<TData, TError> & { queryKey: DataTag<QueryKey, TData, TError> } {

  const queryOptions = getGetAbilityByIdSuspenseQueryOptions(id,options)

  const query = useSuspenseQuery(queryOptions, queryClient) as  UseSuspenseQueryResult<TData, TError> & { queryKey: DataTag<QueryKey, TData, TError> };

  query.queryKey = queryOptions.queryKey ;

  return query;
}

export const getGetAbilityByIdSuspenseInfiniteQueryOptions = <TData = InfiniteData<Awaited<ReturnType<typeof getAbilityById>>>, TError = ErrorType<void>>(id: string, options?: { query?:Partial<UseSuspenseInfiniteQueryOptions<Awaited<ReturnType<typeof getAbilityById>>, TError, TData>>, request?: SecondParameter<typeof customInstance>}
) => {

const {query: queryOptions, request: requestOptions} = options ?? {};

  const queryKey =  queryOptions?.queryKey ?? getGetAbilityByIdInfiniteQueryKey(id);

  

    const queryFn: QueryFunction<Awaited<ReturnType<typeof getAbilityById>>> = ({ signal }) => getAbilityById(id, requestOptions, signal);

      

      

   return  { queryKey, queryFn, ...queryOptions} as UseSuspenseInfiniteQueryOptions<Awaited<ReturnType<typeof getAbilityById>>, TError, TData> & { queryKey: DataTag<QueryKey, TData, TError> }
}

export type GetAbilityByIdSuspenseInfiniteQueryResult = NonNullable<Awaited<ReturnType<typeof getAbilityById>>>

export type GetAbilityByIdSuspenseInfiniteQueryError = ErrorType<void>

export function useGetAbilityByIdSuspenseInfinite<TData = InfiniteData<Awaited<ReturnType<typeof getAbilityById>>>, TError = ErrorType<void>>(
 id: string, options: { query:Partial<UseSuspenseInfiniteQueryOptions<Awaited<ReturnType<typeof getAbilityById>>, TError, TData>>, request?: SecondParameter<typeof customInstance>}
 , queryClient?: QueryClient
  ):  UseSuspenseInfiniteQueryResult<TData, TError> & { queryKey: DataTag<QueryKey, TData, TError> }

export function useGetAbilityByIdSuspenseInfinite<TData = InfiniteData<Awaited<ReturnType<typeof getAbilityById>>>, TError = ErrorType<void>>(
 id: string, options?: { query?:Partial<UseSuspenseInfiniteQueryOptions<Awaited<ReturnType<typeof getAbilityById>>, TError, TData>>, request?: SecondParameter<typeof customInstance>}
 , queryClient?: QueryClient
  ):  UseSuspenseInfiniteQueryResult<TData, TError> & { queryKey: DataTag<QueryKey, TData, TError> }

export function useGetAbilityByIdSuspenseInfinite<TData = InfiniteData<Awaited<ReturnType<typeof getAbilityById>>>, TError = ErrorType<void>>(
 id: string, options?: { query?:Partial<UseSuspenseInfiniteQueryOptions<Awaited<ReturnType<typeof getAbilityById>>, TError, TData>>, request?: SecondParameter<typeof customInstance>}
 , queryClient?: QueryClient
  ):  UseSuspenseInfiniteQueryResult<TData, TError> & { queryKey: DataTag<QueryKey, TData, TError> }

/**
 * @summary 권한 상세 조회
 */

export function useGetAbilityByIdSuspenseInfinite<TData = InfiniteData<Awaited<ReturnType<typeof getAbilityById>>>, TError = ErrorType<void>>(
 id: string, options?: { query?:Partial<UseSuspenseInfiniteQueryOptions<Awaited<ReturnType<typeof getAbilityById>>, TError, TData>>, request?: SecondParameter<typeof customInstance>}
 , queryClient?: QueryClient 
 ):  UseSuspenseInfiniteQueryResult<TData, TError> & { queryKey: DataTag<QueryKey, TData, TError> } {

  const queryOptions = getGetAbilityByIdSuspenseInfiniteQueryOptions(id,options)

  const query = useSuspenseInfiniteQuery(queryOptions, queryClient) as  UseSuspenseInfiniteQueryResult<TData, TError> & { queryKey: DataTag<QueryKey, TData, TError> };

  query.queryKey = queryOptions.queryKey ;

  return query;
}

/**
 * @summary 권한 상세 조회
 */
export const prefetchGetAbilityByIdInfiniteQuery = async <TData = Awaited<ReturnType<typeof getAbilityById>>, TError = ErrorType<void>>(
 queryClient: QueryClient, id: string, options?: { query?:Partial<UseSuspenseInfiniteQueryOptions<Awaited<ReturnType<typeof getAbilityById>>, TError, TData>>, request?: SecondParameter<typeof customInstance>}

  ): Promise<QueryClient> => {

  const queryOptions = getGetAbilityByIdSuspenseInfiniteQueryOptions(id,options)

  await queryClient.prefetchInfiniteQuery(queryOptions);

  return queryClient;
}

/**
 * 기존 권한 정의를 수정합니다. Grant 메타데이터(isActive, priority)는 변경되지 않습니다.
 * @summary 권한 정의 수정
 */
export const updateAbility = (
    id: string,
    updateAbilityDto: BodyType<UpdateAbilityDto>,
 options?: SecondParameter<typeof customInstance>,) => {
      
      
      return customInstance<UpdateAbility200AllOf>(
      {url: `/api/v1/abilities/${id}`, method: 'PATCH',
      headers: {'Content-Type': 'application/json', },
      data: updateAbilityDto
    },
      options);
    }

export const getUpdateAbilityMutationOptions = <TError = ErrorType<void>,
    TContext = unknown>(options?: { mutation?:UseMutationOptions<Awaited<ReturnType<typeof updateAbility>>, TError,{id: string;data: BodyType<UpdateAbilityDto>}, TContext>, request?: SecondParameter<typeof customInstance>}
): UseMutationOptions<Awaited<ReturnType<typeof updateAbility>>, TError,{id: string;data: BodyType<UpdateAbilityDto>}, TContext> => {

const mutationKey = ['updateAbility'];
const {mutation: mutationOptions, request: requestOptions} = options ?
      options.mutation && 'mutationKey' in options.mutation && options.mutation.mutationKey ?
      options
      : {...options, mutation: {...options.mutation, mutationKey}}
      : {mutation: { mutationKey, }, request: undefined};

      


      const mutationFn: MutationFunction<Awaited<ReturnType<typeof updateAbility>>, {id: string;data: BodyType<UpdateAbilityDto>}> = (props) => {
          const {id,data} = props ?? {};

          return  updateAbility(id,data,requestOptions)
        }

        


  return  { mutationFn, ...mutationOptions }}

export type UpdateAbilityMutationResult = NonNullable<Awaited<ReturnType<typeof updateAbility>>>

export type UpdateAbilityMutationBody = BodyType<UpdateAbilityDto>

export type UpdateAbilityMutationError = ErrorType<void>

/**
 * @summary 권한 정의 수정
 */
export const useUpdateAbility = <TError = ErrorType<void>,
    TContext = unknown>(options?: { mutation?:UseMutationOptions<Awaited<ReturnType<typeof updateAbility>>, TError,{id: string;data: BodyType<UpdateAbilityDto>}, TContext>, request?: SecondParameter<typeof customInstance>}
 , queryClient?: QueryClient): UseMutationResult<
        Awaited<ReturnType<typeof updateAbility>>,
        TError,
        {id: string;data: BodyType<UpdateAbilityDto>},
        TContext
      > => {

      const mutationOptions = getUpdateAbilityMutationOptions(options);

      return useMutation(mutationOptions, queryClient);
    }

/**
 * 기존 권한을 삭제합니다. (소프트 삭제)
 * @summary 권한 삭제
 */
export const deleteAbility = (
    id: string,
 options?: SecondParameter<typeof customInstance>,) => {
      
      
      return customInstance<DeleteAbility200AllOf>(
      {url: `/api/v1/abilities/${id}`, method: 'DELETE'
    },
      options);
    }

export const getDeleteAbilityMutationOptions = <TError = ErrorType<void>,
    TContext = unknown>(options?: { mutation?:UseMutationOptions<Awaited<ReturnType<typeof deleteAbility>>, TError,{id: string}, TContext>, request?: SecondParameter<typeof customInstance>}
): UseMutationOptions<Awaited<ReturnType<typeof deleteAbility>>, TError,{id: string}, TContext> => {

const mutationKey = ['deleteAbility'];
const {mutation: mutationOptions, request: requestOptions} = options ?
      options.mutation && 'mutationKey' in options.mutation && options.mutation.mutationKey ?
      options
      : {...options, mutation: {...options.mutation, mutationKey}}
      : {mutation: { mutationKey, }, request: undefined};

      


      const mutationFn: MutationFunction<Awaited<ReturnType<typeof deleteAbility>>, {id: string}> = (props) => {
          const {id} = props ?? {};

          return  deleteAbility(id,requestOptions)
        }

        


  return  { mutationFn, ...mutationOptions }}

export type DeleteAbilityMutationResult = NonNullable<Awaited<ReturnType<typeof deleteAbility>>>

export type DeleteAbilityMutationError = ErrorType<void>

/**
 * @summary 권한 삭제
 */
export const useDeleteAbility = <TError = ErrorType<void>,
    TContext = unknown>(options?: { mutation?:UseMutationOptions<Awaited<ReturnType<typeof deleteAbility>>, TError,{id: string}, TContext>, request?: SecondParameter<typeof customInstance>}
 , queryClient?: QueryClient): UseMutationResult<
        Awaited<ReturnType<typeof deleteAbility>>,
        TError,
        {id: string},
        TContext
      > => {

      const mutationOptions = getDeleteAbilityMutationOptions(options);

      return useMutation(mutationOptions, queryClient);
    }
