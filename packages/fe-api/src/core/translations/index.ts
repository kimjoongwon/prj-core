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

import type { CreateTranslation201AllOf } from "../../model/createTranslation201AllOf";
import type { CreateTranslationDto } from "../../model/createTranslationDto";
import type { GetTranslationById200AllOf } from "../../model/getTranslationById200AllOf";
import type { GetTranslations200AllOf } from "../../model/getTranslations200AllOf";
import type { GetTranslationsParams } from "../../model/getTranslationsParams";
import type { UpdateTranslation200AllOf } from "../../model/updateTranslation200AllOf";
import type { UpdateTranslationDto } from "../../model/updateTranslationDto";
export type { CreateTranslation201AllOf };
export type { CreateTranslationDto };
export type { GetTranslationById200AllOf };
export type { GetTranslations200AllOf };
export type { GetTranslationsParams };
export type { UpdateTranslation200AllOf };
export type { UpdateTranslationDto };
import type { BodyType, ErrorType } from "../../libs/customAxios";
import { customInstance } from "../../libs/customAxios";

type SecondParameter<T extends (...args: never) => unknown> = Parameters<T>[1];

/**
 * 번역 목록을 필터링 및 페이지네이션과 함께 조회합니다. FULL_ACCESS 전용.
 * @summary 번역 목록 조회
 */
export const getTranslations = (
    params?: GetTranslationsParams,
 options?: SecondParameter<typeof customInstance>,signal?: AbortSignal
) => {
      
      
      return customInstance<GetTranslations200AllOf>(
      {url: `/api/v1/translations`, method: 'GET',
        params, signal
    },
      options);
    }

export const getGetTranslationsQueryKey = (params?: GetTranslationsParams,) => {
    return [
    `/api/v1/translations`, ...(params ? [params]: [])
    ] as const;
    }

export const getGetTranslationsInfiniteQueryKey = (params?: GetTranslationsParams,) => {
    return [
    'infinite', `/api/v1/translations`, ...(params ? [params]: [])
    ] as const;
    }

export const getGetTranslationsQueryOptions = <TData = Awaited<ReturnType<typeof getTranslations>>, TError = ErrorType<void>>(params?: GetTranslationsParams, options?: { query?:Partial<UseQueryOptions<Awaited<ReturnType<typeof getTranslations>>, TError, TData>>, request?: SecondParameter<typeof customInstance>}
) => {

const {query: queryOptions, request: requestOptions} = options ?? {};

  const queryKey =  queryOptions?.queryKey ?? getGetTranslationsQueryKey(params);

  

    const queryFn: QueryFunction<Awaited<ReturnType<typeof getTranslations>>> = ({ signal }) => getTranslations(params, requestOptions, signal);

      

      

   return  { queryKey, queryFn, ...queryOptions} as UseQueryOptions<Awaited<ReturnType<typeof getTranslations>>, TError, TData> & { queryKey: DataTag<QueryKey, TData, TError> }
}

export type GetTranslationsQueryResult = NonNullable<Awaited<ReturnType<typeof getTranslations>>>

export type GetTranslationsQueryError = ErrorType<void>

export function useGetTranslations<TData = Awaited<ReturnType<typeof getTranslations>>, TError = ErrorType<void>>(
 params: undefined |  GetTranslationsParams, options: { query:Partial<UseQueryOptions<Awaited<ReturnType<typeof getTranslations>>, TError, TData>> & Pick<
        DefinedInitialDataOptions<
          Awaited<ReturnType<typeof getTranslations>>,
          TError,
          Awaited<ReturnType<typeof getTranslations>>
        > , 'initialData'
      >, request?: SecondParameter<typeof customInstance>}
 , queryClient?: QueryClient
  ):  DefinedUseQueryResult<TData, TError> & { queryKey: DataTag<QueryKey, TData, TError> }

export function useGetTranslations<TData = Awaited<ReturnType<typeof getTranslations>>, TError = ErrorType<void>>(
 params?: GetTranslationsParams, options?: { query?:Partial<UseQueryOptions<Awaited<ReturnType<typeof getTranslations>>, TError, TData>> & Pick<
        UndefinedInitialDataOptions<
          Awaited<ReturnType<typeof getTranslations>>,
          TError,
          Awaited<ReturnType<typeof getTranslations>>
        > , 'initialData'
      >, request?: SecondParameter<typeof customInstance>}
 , queryClient?: QueryClient
  ):  UseQueryResult<TData, TError> & { queryKey: DataTag<QueryKey, TData, TError> }

export function useGetTranslations<TData = Awaited<ReturnType<typeof getTranslations>>, TError = ErrorType<void>>(
 params?: GetTranslationsParams, options?: { query?:Partial<UseQueryOptions<Awaited<ReturnType<typeof getTranslations>>, TError, TData>>, request?: SecondParameter<typeof customInstance>}
 , queryClient?: QueryClient
  ):  UseQueryResult<TData, TError> & { queryKey: DataTag<QueryKey, TData, TError> }

/**
 * @summary 번역 목록 조회
 */

export function useGetTranslations<TData = Awaited<ReturnType<typeof getTranslations>>, TError = ErrorType<void>>(
 params?: GetTranslationsParams, options?: { query?:Partial<UseQueryOptions<Awaited<ReturnType<typeof getTranslations>>, TError, TData>>, request?: SecondParameter<typeof customInstance>}
 , queryClient?: QueryClient 
 ):  UseQueryResult<TData, TError> & { queryKey: DataTag<QueryKey, TData, TError> } {

  const queryOptions = getGetTranslationsQueryOptions(params,options)

  const query = useQuery(queryOptions, queryClient) as  UseQueryResult<TData, TError> & { queryKey: DataTag<QueryKey, TData, TError> };

  query.queryKey = queryOptions.queryKey ;

  return query;
}

/**
 * @summary 번역 목록 조회
 */
export const prefetchGetTranslationsQuery = async <TData = Awaited<ReturnType<typeof getTranslations>>, TError = ErrorType<void>>(
 queryClient: QueryClient, params?: GetTranslationsParams, options?: { query?:Partial<UseQueryOptions<Awaited<ReturnType<typeof getTranslations>>, TError, TData>>, request?: SecondParameter<typeof customInstance>}

  ): Promise<QueryClient> => {

  const queryOptions = getGetTranslationsQueryOptions(params,options)

  await queryClient.prefetchQuery(queryOptions);

  return queryClient;
}

export const getGetTranslationsSuspenseQueryOptions = <TData = Awaited<ReturnType<typeof getTranslations>>, TError = ErrorType<void>>(params?: GetTranslationsParams, options?: { query?:Partial<UseSuspenseQueryOptions<Awaited<ReturnType<typeof getTranslations>>, TError, TData>>, request?: SecondParameter<typeof customInstance>}
) => {

const {query: queryOptions, request: requestOptions} = options ?? {};

  const queryKey =  queryOptions?.queryKey ?? getGetTranslationsQueryKey(params);

  

    const queryFn: QueryFunction<Awaited<ReturnType<typeof getTranslations>>> = ({ signal }) => getTranslations(params, requestOptions, signal);

      

      

   return  { queryKey, queryFn, ...queryOptions} as UseSuspenseQueryOptions<Awaited<ReturnType<typeof getTranslations>>, TError, TData> & { queryKey: DataTag<QueryKey, TData, TError> }
}

export type GetTranslationsSuspenseQueryResult = NonNullable<Awaited<ReturnType<typeof getTranslations>>>

export type GetTranslationsSuspenseQueryError = ErrorType<void>

export function useGetTranslationsSuspense<TData = Awaited<ReturnType<typeof getTranslations>>, TError = ErrorType<void>>(
 params: undefined |  GetTranslationsParams, options: { query:Partial<UseSuspenseQueryOptions<Awaited<ReturnType<typeof getTranslations>>, TError, TData>>, request?: SecondParameter<typeof customInstance>}
 , queryClient?: QueryClient
  ):  UseSuspenseQueryResult<TData, TError> & { queryKey: DataTag<QueryKey, TData, TError> }

export function useGetTranslationsSuspense<TData = Awaited<ReturnType<typeof getTranslations>>, TError = ErrorType<void>>(
 params?: GetTranslationsParams, options?: { query?:Partial<UseSuspenseQueryOptions<Awaited<ReturnType<typeof getTranslations>>, TError, TData>>, request?: SecondParameter<typeof customInstance>}
 , queryClient?: QueryClient
  ):  UseSuspenseQueryResult<TData, TError> & { queryKey: DataTag<QueryKey, TData, TError> }

export function useGetTranslationsSuspense<TData = Awaited<ReturnType<typeof getTranslations>>, TError = ErrorType<void>>(
 params?: GetTranslationsParams, options?: { query?:Partial<UseSuspenseQueryOptions<Awaited<ReturnType<typeof getTranslations>>, TError, TData>>, request?: SecondParameter<typeof customInstance>}
 , queryClient?: QueryClient
  ):  UseSuspenseQueryResult<TData, TError> & { queryKey: DataTag<QueryKey, TData, TError> }

/**
 * @summary 번역 목록 조회
 */

export function useGetTranslationsSuspense<TData = Awaited<ReturnType<typeof getTranslations>>, TError = ErrorType<void>>(
 params?: GetTranslationsParams, options?: { query?:Partial<UseSuspenseQueryOptions<Awaited<ReturnType<typeof getTranslations>>, TError, TData>>, request?: SecondParameter<typeof customInstance>}
 , queryClient?: QueryClient 
 ):  UseSuspenseQueryResult<TData, TError> & { queryKey: DataTag<QueryKey, TData, TError> } {

  const queryOptions = getGetTranslationsSuspenseQueryOptions(params,options)

  const query = useSuspenseQuery(queryOptions, queryClient) as  UseSuspenseQueryResult<TData, TError> & { queryKey: DataTag<QueryKey, TData, TError> };

  query.queryKey = queryOptions.queryKey ;

  return query;
}

export const getGetTranslationsSuspenseInfiniteQueryOptions = <TData = InfiniteData<Awaited<ReturnType<typeof getTranslations>>>, TError = ErrorType<void>>(params?: GetTranslationsParams, options?: { query?:Partial<UseSuspenseInfiniteQueryOptions<Awaited<ReturnType<typeof getTranslations>>, TError, TData>>, request?: SecondParameter<typeof customInstance>}
) => {

const {query: queryOptions, request: requestOptions} = options ?? {};

  const queryKey =  queryOptions?.queryKey ?? getGetTranslationsInfiniteQueryKey(params);

  

    const queryFn: QueryFunction<Awaited<ReturnType<typeof getTranslations>>> = ({ signal }) => getTranslations(params, requestOptions, signal);

      

      

   return  { queryKey, queryFn, ...queryOptions} as UseSuspenseInfiniteQueryOptions<Awaited<ReturnType<typeof getTranslations>>, TError, TData> & { queryKey: DataTag<QueryKey, TData, TError> }
}

export type GetTranslationsSuspenseInfiniteQueryResult = NonNullable<Awaited<ReturnType<typeof getTranslations>>>

export type GetTranslationsSuspenseInfiniteQueryError = ErrorType<void>

export function useGetTranslationsSuspenseInfinite<TData = InfiniteData<Awaited<ReturnType<typeof getTranslations>>>, TError = ErrorType<void>>(
 params: undefined |  GetTranslationsParams, options: { query:Partial<UseSuspenseInfiniteQueryOptions<Awaited<ReturnType<typeof getTranslations>>, TError, TData>>, request?: SecondParameter<typeof customInstance>}
 , queryClient?: QueryClient
  ):  UseSuspenseInfiniteQueryResult<TData, TError> & { queryKey: DataTag<QueryKey, TData, TError> }

export function useGetTranslationsSuspenseInfinite<TData = InfiniteData<Awaited<ReturnType<typeof getTranslations>>>, TError = ErrorType<void>>(
 params?: GetTranslationsParams, options?: { query?:Partial<UseSuspenseInfiniteQueryOptions<Awaited<ReturnType<typeof getTranslations>>, TError, TData>>, request?: SecondParameter<typeof customInstance>}
 , queryClient?: QueryClient
  ):  UseSuspenseInfiniteQueryResult<TData, TError> & { queryKey: DataTag<QueryKey, TData, TError> }

export function useGetTranslationsSuspenseInfinite<TData = InfiniteData<Awaited<ReturnType<typeof getTranslations>>>, TError = ErrorType<void>>(
 params?: GetTranslationsParams, options?: { query?:Partial<UseSuspenseInfiniteQueryOptions<Awaited<ReturnType<typeof getTranslations>>, TError, TData>>, request?: SecondParameter<typeof customInstance>}
 , queryClient?: QueryClient
  ):  UseSuspenseInfiniteQueryResult<TData, TError> & { queryKey: DataTag<QueryKey, TData, TError> }

/**
 * @summary 번역 목록 조회
 */

export function useGetTranslationsSuspenseInfinite<TData = InfiniteData<Awaited<ReturnType<typeof getTranslations>>>, TError = ErrorType<void>>(
 params?: GetTranslationsParams, options?: { query?:Partial<UseSuspenseInfiniteQueryOptions<Awaited<ReturnType<typeof getTranslations>>, TError, TData>>, request?: SecondParameter<typeof customInstance>}
 , queryClient?: QueryClient 
 ):  UseSuspenseInfiniteQueryResult<TData, TError> & { queryKey: DataTag<QueryKey, TData, TError> } {

  const queryOptions = getGetTranslationsSuspenseInfiniteQueryOptions(params,options)

  const query = useSuspenseInfiniteQuery(queryOptions, queryClient) as  UseSuspenseInfiniteQueryResult<TData, TError> & { queryKey: DataTag<QueryKey, TData, TError> };

  query.queryKey = queryOptions.queryKey ;

  return query;
}

/**
 * @summary 번역 목록 조회
 */
export const prefetchGetTranslationsInfiniteQuery = async <TData = Awaited<ReturnType<typeof getTranslations>>, TError = ErrorType<void>>(
 queryClient: QueryClient, params?: GetTranslationsParams, options?: { query?:Partial<UseSuspenseInfiniteQueryOptions<Awaited<ReturnType<typeof getTranslations>>, TError, TData>>, request?: SecondParameter<typeof customInstance>}

  ): Promise<QueryClient> => {

  const queryOptions = getGetTranslationsSuspenseInfiniteQueryOptions(params,options)

  await queryClient.prefetchInfiniteQuery(queryOptions);

  return queryClient;
}

/**
 * 새로운 번역을 생성합니다. FULL_ACCESS 전용.
 * @summary 번역 생성
 */
export const createTranslation = (
    createTranslationDto: BodyType<CreateTranslationDto>,
 options?: SecondParameter<typeof customInstance>,signal?: AbortSignal
) => {
      
      
      return customInstance<CreateTranslation201AllOf>(
      {url: `/api/v1/translations`, method: 'POST',
      headers: {'Content-Type': 'application/json', },
      data: createTranslationDto, signal
    },
      options);
    }

export const getCreateTranslationMutationOptions = <TError = ErrorType<void>,
    TContext = unknown>(options?: { mutation?:UseMutationOptions<Awaited<ReturnType<typeof createTranslation>>, TError,{data: BodyType<CreateTranslationDto>}, TContext>, request?: SecondParameter<typeof customInstance>}
): UseMutationOptions<Awaited<ReturnType<typeof createTranslation>>, TError,{data: BodyType<CreateTranslationDto>}, TContext> => {

const mutationKey = ['createTranslation'];
const {mutation: mutationOptions, request: requestOptions} = options ?
      options.mutation && 'mutationKey' in options.mutation && options.mutation.mutationKey ?
      options
      : {...options, mutation: {...options.mutation, mutationKey}}
      : {mutation: { mutationKey, }, request: undefined};

      


      const mutationFn: MutationFunction<Awaited<ReturnType<typeof createTranslation>>, {data: BodyType<CreateTranslationDto>}> = (props) => {
          const {data} = props ?? {};

          return  createTranslation(data,requestOptions)
        }

        


  return  { mutationFn, ...mutationOptions }}

export type CreateTranslationMutationResult = NonNullable<Awaited<ReturnType<typeof createTranslation>>>

export type CreateTranslationMutationBody = BodyType<CreateTranslationDto>

export type CreateTranslationMutationError = ErrorType<void>

/**
 * @summary 번역 생성
 */
export const useCreateTranslation = <TError = ErrorType<void>,
    TContext = unknown>(options?: { mutation?:UseMutationOptions<Awaited<ReturnType<typeof createTranslation>>, TError,{data: BodyType<CreateTranslationDto>}, TContext>, request?: SecondParameter<typeof customInstance>}
 , queryClient?: QueryClient): UseMutationResult<
        Awaited<ReturnType<typeof createTranslation>>,
        TError,
        {data: BodyType<CreateTranslationDto>},
        TContext
      > => {

      const mutationOptions = getCreateTranslationMutationOptions(options);

      return useMutation(mutationOptions, queryClient);
    }

/**
 * ID로 특정 번역을 조회합니다. FULL_ACCESS 전용.
 * @summary 번역 조회
 */
export const getTranslationById = (
    id: string,
 options?: SecondParameter<typeof customInstance>,signal?: AbortSignal
) => {
      
      
      return customInstance<GetTranslationById200AllOf>(
      {url: `/api/v1/translations/${id}`, method: 'GET', signal
    },
      options);
    }

export const getGetTranslationByIdQueryKey = (id?: string,) => {
    return [
    `/api/v1/translations/${id}`
    ] as const;
    }

export const getGetTranslationByIdInfiniteQueryKey = (id?: string,) => {
    return [
    'infinite', `/api/v1/translations/${id}`
    ] as const;
    }

export const getGetTranslationByIdQueryOptions = <TData = Awaited<ReturnType<typeof getTranslationById>>, TError = ErrorType<void>>(id: string, options?: { query?:Partial<UseQueryOptions<Awaited<ReturnType<typeof getTranslationById>>, TError, TData>>, request?: SecondParameter<typeof customInstance>}
) => {

const {query: queryOptions, request: requestOptions} = options ?? {};

  const queryKey =  queryOptions?.queryKey ?? getGetTranslationByIdQueryKey(id);

  

    const queryFn: QueryFunction<Awaited<ReturnType<typeof getTranslationById>>> = ({ signal }) => getTranslationById(id, requestOptions, signal);

      

      

   return  { queryKey, queryFn, enabled: !!(id), ...queryOptions} as UseQueryOptions<Awaited<ReturnType<typeof getTranslationById>>, TError, TData> & { queryKey: DataTag<QueryKey, TData, TError> }
}

export type GetTranslationByIdQueryResult = NonNullable<Awaited<ReturnType<typeof getTranslationById>>>

export type GetTranslationByIdQueryError = ErrorType<void>

export function useGetTranslationById<TData = Awaited<ReturnType<typeof getTranslationById>>, TError = ErrorType<void>>(
 id: string, options: { query:Partial<UseQueryOptions<Awaited<ReturnType<typeof getTranslationById>>, TError, TData>> & Pick<
        DefinedInitialDataOptions<
          Awaited<ReturnType<typeof getTranslationById>>,
          TError,
          Awaited<ReturnType<typeof getTranslationById>>
        > , 'initialData'
      >, request?: SecondParameter<typeof customInstance>}
 , queryClient?: QueryClient
  ):  DefinedUseQueryResult<TData, TError> & { queryKey: DataTag<QueryKey, TData, TError> }

export function useGetTranslationById<TData = Awaited<ReturnType<typeof getTranslationById>>, TError = ErrorType<void>>(
 id: string, options?: { query?:Partial<UseQueryOptions<Awaited<ReturnType<typeof getTranslationById>>, TError, TData>> & Pick<
        UndefinedInitialDataOptions<
          Awaited<ReturnType<typeof getTranslationById>>,
          TError,
          Awaited<ReturnType<typeof getTranslationById>>
        > , 'initialData'
      >, request?: SecondParameter<typeof customInstance>}
 , queryClient?: QueryClient
  ):  UseQueryResult<TData, TError> & { queryKey: DataTag<QueryKey, TData, TError> }

export function useGetTranslationById<TData = Awaited<ReturnType<typeof getTranslationById>>, TError = ErrorType<void>>(
 id: string, options?: { query?:Partial<UseQueryOptions<Awaited<ReturnType<typeof getTranslationById>>, TError, TData>>, request?: SecondParameter<typeof customInstance>}
 , queryClient?: QueryClient
  ):  UseQueryResult<TData, TError> & { queryKey: DataTag<QueryKey, TData, TError> }

/**
 * @summary 번역 조회
 */

export function useGetTranslationById<TData = Awaited<ReturnType<typeof getTranslationById>>, TError = ErrorType<void>>(
 id: string, options?: { query?:Partial<UseQueryOptions<Awaited<ReturnType<typeof getTranslationById>>, TError, TData>>, request?: SecondParameter<typeof customInstance>}
 , queryClient?: QueryClient 
 ):  UseQueryResult<TData, TError> & { queryKey: DataTag<QueryKey, TData, TError> } {

  const queryOptions = getGetTranslationByIdQueryOptions(id,options)

  const query = useQuery(queryOptions, queryClient) as  UseQueryResult<TData, TError> & { queryKey: DataTag<QueryKey, TData, TError> };

  query.queryKey = queryOptions.queryKey ;

  return query;
}

/**
 * @summary 번역 조회
 */
export const prefetchGetTranslationByIdQuery = async <TData = Awaited<ReturnType<typeof getTranslationById>>, TError = ErrorType<void>>(
 queryClient: QueryClient, id: string, options?: { query?:Partial<UseQueryOptions<Awaited<ReturnType<typeof getTranslationById>>, TError, TData>>, request?: SecondParameter<typeof customInstance>}

  ): Promise<QueryClient> => {

  const queryOptions = getGetTranslationByIdQueryOptions(id,options)

  await queryClient.prefetchQuery(queryOptions);

  return queryClient;
}

export const getGetTranslationByIdSuspenseQueryOptions = <TData = Awaited<ReturnType<typeof getTranslationById>>, TError = ErrorType<void>>(id: string, options?: { query?:Partial<UseSuspenseQueryOptions<Awaited<ReturnType<typeof getTranslationById>>, TError, TData>>, request?: SecondParameter<typeof customInstance>}
) => {

const {query: queryOptions, request: requestOptions} = options ?? {};

  const queryKey =  queryOptions?.queryKey ?? getGetTranslationByIdQueryKey(id);

  

    const queryFn: QueryFunction<Awaited<ReturnType<typeof getTranslationById>>> = ({ signal }) => getTranslationById(id, requestOptions, signal);

      

      

   return  { queryKey, queryFn, ...queryOptions} as UseSuspenseQueryOptions<Awaited<ReturnType<typeof getTranslationById>>, TError, TData> & { queryKey: DataTag<QueryKey, TData, TError> }
}

export type GetTranslationByIdSuspenseQueryResult = NonNullable<Awaited<ReturnType<typeof getTranslationById>>>

export type GetTranslationByIdSuspenseQueryError = ErrorType<void>

export function useGetTranslationByIdSuspense<TData = Awaited<ReturnType<typeof getTranslationById>>, TError = ErrorType<void>>(
 id: string, options: { query:Partial<UseSuspenseQueryOptions<Awaited<ReturnType<typeof getTranslationById>>, TError, TData>>, request?: SecondParameter<typeof customInstance>}
 , queryClient?: QueryClient
  ):  UseSuspenseQueryResult<TData, TError> & { queryKey: DataTag<QueryKey, TData, TError> }

export function useGetTranslationByIdSuspense<TData = Awaited<ReturnType<typeof getTranslationById>>, TError = ErrorType<void>>(
 id: string, options?: { query?:Partial<UseSuspenseQueryOptions<Awaited<ReturnType<typeof getTranslationById>>, TError, TData>>, request?: SecondParameter<typeof customInstance>}
 , queryClient?: QueryClient
  ):  UseSuspenseQueryResult<TData, TError> & { queryKey: DataTag<QueryKey, TData, TError> }

export function useGetTranslationByIdSuspense<TData = Awaited<ReturnType<typeof getTranslationById>>, TError = ErrorType<void>>(
 id: string, options?: { query?:Partial<UseSuspenseQueryOptions<Awaited<ReturnType<typeof getTranslationById>>, TError, TData>>, request?: SecondParameter<typeof customInstance>}
 , queryClient?: QueryClient
  ):  UseSuspenseQueryResult<TData, TError> & { queryKey: DataTag<QueryKey, TData, TError> }

/**
 * @summary 번역 조회
 */

export function useGetTranslationByIdSuspense<TData = Awaited<ReturnType<typeof getTranslationById>>, TError = ErrorType<void>>(
 id: string, options?: { query?:Partial<UseSuspenseQueryOptions<Awaited<ReturnType<typeof getTranslationById>>, TError, TData>>, request?: SecondParameter<typeof customInstance>}
 , queryClient?: QueryClient 
 ):  UseSuspenseQueryResult<TData, TError> & { queryKey: DataTag<QueryKey, TData, TError> } {

  const queryOptions = getGetTranslationByIdSuspenseQueryOptions(id,options)

  const query = useSuspenseQuery(queryOptions, queryClient) as  UseSuspenseQueryResult<TData, TError> & { queryKey: DataTag<QueryKey, TData, TError> };

  query.queryKey = queryOptions.queryKey ;

  return query;
}

export const getGetTranslationByIdSuspenseInfiniteQueryOptions = <TData = InfiniteData<Awaited<ReturnType<typeof getTranslationById>>>, TError = ErrorType<void>>(id: string, options?: { query?:Partial<UseSuspenseInfiniteQueryOptions<Awaited<ReturnType<typeof getTranslationById>>, TError, TData>>, request?: SecondParameter<typeof customInstance>}
) => {

const {query: queryOptions, request: requestOptions} = options ?? {};

  const queryKey =  queryOptions?.queryKey ?? getGetTranslationByIdInfiniteQueryKey(id);

  

    const queryFn: QueryFunction<Awaited<ReturnType<typeof getTranslationById>>> = ({ signal }) => getTranslationById(id, requestOptions, signal);

      

      

   return  { queryKey, queryFn, ...queryOptions} as UseSuspenseInfiniteQueryOptions<Awaited<ReturnType<typeof getTranslationById>>, TError, TData> & { queryKey: DataTag<QueryKey, TData, TError> }
}

export type GetTranslationByIdSuspenseInfiniteQueryResult = NonNullable<Awaited<ReturnType<typeof getTranslationById>>>

export type GetTranslationByIdSuspenseInfiniteQueryError = ErrorType<void>

export function useGetTranslationByIdSuspenseInfinite<TData = InfiniteData<Awaited<ReturnType<typeof getTranslationById>>>, TError = ErrorType<void>>(
 id: string, options: { query:Partial<UseSuspenseInfiniteQueryOptions<Awaited<ReturnType<typeof getTranslationById>>, TError, TData>>, request?: SecondParameter<typeof customInstance>}
 , queryClient?: QueryClient
  ):  UseSuspenseInfiniteQueryResult<TData, TError> & { queryKey: DataTag<QueryKey, TData, TError> }

export function useGetTranslationByIdSuspenseInfinite<TData = InfiniteData<Awaited<ReturnType<typeof getTranslationById>>>, TError = ErrorType<void>>(
 id: string, options?: { query?:Partial<UseSuspenseInfiniteQueryOptions<Awaited<ReturnType<typeof getTranslationById>>, TError, TData>>, request?: SecondParameter<typeof customInstance>}
 , queryClient?: QueryClient
  ):  UseSuspenseInfiniteQueryResult<TData, TError> & { queryKey: DataTag<QueryKey, TData, TError> }

export function useGetTranslationByIdSuspenseInfinite<TData = InfiniteData<Awaited<ReturnType<typeof getTranslationById>>>, TError = ErrorType<void>>(
 id: string, options?: { query?:Partial<UseSuspenseInfiniteQueryOptions<Awaited<ReturnType<typeof getTranslationById>>, TError, TData>>, request?: SecondParameter<typeof customInstance>}
 , queryClient?: QueryClient
  ):  UseSuspenseInfiniteQueryResult<TData, TError> & { queryKey: DataTag<QueryKey, TData, TError> }

/**
 * @summary 번역 조회
 */

export function useGetTranslationByIdSuspenseInfinite<TData = InfiniteData<Awaited<ReturnType<typeof getTranslationById>>>, TError = ErrorType<void>>(
 id: string, options?: { query?:Partial<UseSuspenseInfiniteQueryOptions<Awaited<ReturnType<typeof getTranslationById>>, TError, TData>>, request?: SecondParameter<typeof customInstance>}
 , queryClient?: QueryClient 
 ):  UseSuspenseInfiniteQueryResult<TData, TError> & { queryKey: DataTag<QueryKey, TData, TError> } {

  const queryOptions = getGetTranslationByIdSuspenseInfiniteQueryOptions(id,options)

  const query = useSuspenseInfiniteQuery(queryOptions, queryClient) as  UseSuspenseInfiniteQueryResult<TData, TError> & { queryKey: DataTag<QueryKey, TData, TError> };

  query.queryKey = queryOptions.queryKey ;

  return query;
}

/**
 * @summary 번역 조회
 */
export const prefetchGetTranslationByIdInfiniteQuery = async <TData = Awaited<ReturnType<typeof getTranslationById>>, TError = ErrorType<void>>(
 queryClient: QueryClient, id: string, options?: { query?:Partial<UseSuspenseInfiniteQueryOptions<Awaited<ReturnType<typeof getTranslationById>>, TError, TData>>, request?: SecondParameter<typeof customInstance>}

  ): Promise<QueryClient> => {

  const queryOptions = getGetTranslationByIdSuspenseInfiniteQueryOptions(id,options)

  await queryClient.prefetchInfiniteQuery(queryOptions);

  return queryClient;
}

/**
 * 기존 번역을 수정합니다. FULL_ACCESS 전용.
 * @summary 번역 수정
 */
export const updateTranslation = (
    id: string,
    updateTranslationDto: BodyType<UpdateTranslationDto>,
 options?: SecondParameter<typeof customInstance>,) => {
      
      
      return customInstance<UpdateTranslation200AllOf>(
      {url: `/api/v1/translations/${id}`, method: 'PATCH',
      headers: {'Content-Type': 'application/json', },
      data: updateTranslationDto
    },
      options);
    }

export const getUpdateTranslationMutationOptions = <TError = ErrorType<void>,
    TContext = unknown>(options?: { mutation?:UseMutationOptions<Awaited<ReturnType<typeof updateTranslation>>, TError,{id: string;data: BodyType<UpdateTranslationDto>}, TContext>, request?: SecondParameter<typeof customInstance>}
): UseMutationOptions<Awaited<ReturnType<typeof updateTranslation>>, TError,{id: string;data: BodyType<UpdateTranslationDto>}, TContext> => {

const mutationKey = ['updateTranslation'];
const {mutation: mutationOptions, request: requestOptions} = options ?
      options.mutation && 'mutationKey' in options.mutation && options.mutation.mutationKey ?
      options
      : {...options, mutation: {...options.mutation, mutationKey}}
      : {mutation: { mutationKey, }, request: undefined};

      


      const mutationFn: MutationFunction<Awaited<ReturnType<typeof updateTranslation>>, {id: string;data: BodyType<UpdateTranslationDto>}> = (props) => {
          const {id,data} = props ?? {};

          return  updateTranslation(id,data,requestOptions)
        }

        


  return  { mutationFn, ...mutationOptions }}

export type UpdateTranslationMutationResult = NonNullable<Awaited<ReturnType<typeof updateTranslation>>>

export type UpdateTranslationMutationBody = BodyType<UpdateTranslationDto>

export type UpdateTranslationMutationError = ErrorType<void>

/**
 * @summary 번역 수정
 */
export const useUpdateTranslation = <TError = ErrorType<void>,
    TContext = unknown>(options?: { mutation?:UseMutationOptions<Awaited<ReturnType<typeof updateTranslation>>, TError,{id: string;data: BodyType<UpdateTranslationDto>}, TContext>, request?: SecondParameter<typeof customInstance>}
 , queryClient?: QueryClient): UseMutationResult<
        Awaited<ReturnType<typeof updateTranslation>>,
        TError,
        {id: string;data: BodyType<UpdateTranslationDto>},
        TContext
      > => {

      const mutationOptions = getUpdateTranslationMutationOptions(options);

      return useMutation(mutationOptions, queryClient);
    }

/**
 * 번역을 삭제합니다. FULL_ACCESS 전용.
 * @summary 번역 삭제
 */
export const deleteTranslation = (
    id: string,
 options?: SecondParameter<typeof customInstance>,) => {
      
      
      return customInstance<unknown>(
      {url: `/api/v1/translations/${id}`, method: 'DELETE'
    },
      options);
    }

export const getDeleteTranslationMutationOptions = <TError = ErrorType<void>,
    TContext = unknown>(options?: { mutation?:UseMutationOptions<Awaited<ReturnType<typeof deleteTranslation>>, TError,{id: string}, TContext>, request?: SecondParameter<typeof customInstance>}
): UseMutationOptions<Awaited<ReturnType<typeof deleteTranslation>>, TError,{id: string}, TContext> => {

const mutationKey = ['deleteTranslation'];
const {mutation: mutationOptions, request: requestOptions} = options ?
      options.mutation && 'mutationKey' in options.mutation && options.mutation.mutationKey ?
      options
      : {...options, mutation: {...options.mutation, mutationKey}}
      : {mutation: { mutationKey, }, request: undefined};

      


      const mutationFn: MutationFunction<Awaited<ReturnType<typeof deleteTranslation>>, {id: string}> = (props) => {
          const {id} = props ?? {};

          return  deleteTranslation(id,requestOptions)
        }

        


  return  { mutationFn, ...mutationOptions }}

export type DeleteTranslationMutationResult = NonNullable<Awaited<ReturnType<typeof deleteTranslation>>>

export type DeleteTranslationMutationError = ErrorType<void>

/**
 * @summary 번역 삭제
 */
export const useDeleteTranslation = <TError = ErrorType<void>,
    TContext = unknown>(options?: { mutation?:UseMutationOptions<Awaited<ReturnType<typeof deleteTranslation>>, TError,{id: string}, TContext>, request?: SecondParameter<typeof customInstance>}
 , queryClient?: QueryClient): UseMutationResult<
        Awaited<ReturnType<typeof deleteTranslation>>,
        TError,
        {id: string},
        TContext
      > => {

      const mutationOptions = getDeleteTranslationMutationOptions(options);

      return useMutation(mutationOptions, queryClient);
    }

/**
 * Redis에 캐시된 모든 번역 데이터를 무효화합니다. FULL_ACCESS 전용.
 * @summary 전체 번역 캐시 무효화
 */
export const invalidateAllTranslationCache = (
    
 options?: SecondParameter<typeof customInstance>,) => {
      
      
      return customInstance<unknown>(
      {url: `/api/v1/translations/cache`, method: 'DELETE'
    },
      options);
    }

export const getInvalidateAllTranslationCacheMutationOptions = <TError = ErrorType<void>,
    TContext = unknown>(options?: { mutation?:UseMutationOptions<Awaited<ReturnType<typeof invalidateAllTranslationCache>>, TError,void, TContext>, request?: SecondParameter<typeof customInstance>}
): UseMutationOptions<Awaited<ReturnType<typeof invalidateAllTranslationCache>>, TError,void, TContext> => {

const mutationKey = ['invalidateAllTranslationCache'];
const {mutation: mutationOptions, request: requestOptions} = options ?
      options.mutation && 'mutationKey' in options.mutation && options.mutation.mutationKey ?
      options
      : {...options, mutation: {...options.mutation, mutationKey}}
      : {mutation: { mutationKey, }, request: undefined};

      


      const mutationFn: MutationFunction<Awaited<ReturnType<typeof invalidateAllTranslationCache>>, void> = () => {
          

          return  invalidateAllTranslationCache(requestOptions)
        }

        


  return  { mutationFn, ...mutationOptions }}

export type InvalidateAllTranslationCacheMutationResult = NonNullable<Awaited<ReturnType<typeof invalidateAllTranslationCache>>>

export type InvalidateAllTranslationCacheMutationError = ErrorType<void>

/**
 * @summary 전체 번역 캐시 무효화
 */
export const useInvalidateAllTranslationCache = <TError = ErrorType<void>,
    TContext = unknown>(options?: { mutation?:UseMutationOptions<Awaited<ReturnType<typeof invalidateAllTranslationCache>>, TError,void, TContext>, request?: SecondParameter<typeof customInstance>}
 , queryClient?: QueryClient): UseMutationResult<
        Awaited<ReturnType<typeof invalidateAllTranslationCache>>,
        TError,
        void,
        TContext
      > => {

      const mutationOptions = getInvalidateAllTranslationCacheMutationOptions(options);

      return useMutation(mutationOptions, queryClient);
    }

/**
 * Redis에 캐시된 특정 언어의 번역 데이터를 무효화합니다. FULL_ACCESS 전용.
 * @summary 언어별 번역 캐시 무효화
 */
export const invalidateTranslationCache = (
    languageCode: string,
 options?: SecondParameter<typeof customInstance>,) => {
      
      
      return customInstance<unknown>(
      {url: `/api/v1/translations/cache/${languageCode}`, method: 'DELETE'
    },
      options);
    }

export const getInvalidateTranslationCacheMutationOptions = <TError = ErrorType<void>,
    TContext = unknown>(options?: { mutation?:UseMutationOptions<Awaited<ReturnType<typeof invalidateTranslationCache>>, TError,{languageCode: string}, TContext>, request?: SecondParameter<typeof customInstance>}
): UseMutationOptions<Awaited<ReturnType<typeof invalidateTranslationCache>>, TError,{languageCode: string}, TContext> => {

const mutationKey = ['invalidateTranslationCache'];
const {mutation: mutationOptions, request: requestOptions} = options ?
      options.mutation && 'mutationKey' in options.mutation && options.mutation.mutationKey ?
      options
      : {...options, mutation: {...options.mutation, mutationKey}}
      : {mutation: { mutationKey, }, request: undefined};

      


      const mutationFn: MutationFunction<Awaited<ReturnType<typeof invalidateTranslationCache>>, {languageCode: string}> = (props) => {
          const {languageCode} = props ?? {};

          return  invalidateTranslationCache(languageCode,requestOptions)
        }

        


  return  { mutationFn, ...mutationOptions }}

export type InvalidateTranslationCacheMutationResult = NonNullable<Awaited<ReturnType<typeof invalidateTranslationCache>>>

export type InvalidateTranslationCacheMutationError = ErrorType<void>

/**
 * @summary 언어별 번역 캐시 무효화
 */
export const useInvalidateTranslationCache = <TError = ErrorType<void>,
    TContext = unknown>(options?: { mutation?:UseMutationOptions<Awaited<ReturnType<typeof invalidateTranslationCache>>, TError,{languageCode: string}, TContext>, request?: SecondParameter<typeof customInstance>}
 , queryClient?: QueryClient): UseMutationResult<
        Awaited<ReturnType<typeof invalidateTranslationCache>>,
        TError,
        {languageCode: string},
        TContext
      > => {

      const mutationOptions = getInvalidateTranslationCacheMutationOptions(options);

      return useMutation(mutationOptions, queryClient);
    }
