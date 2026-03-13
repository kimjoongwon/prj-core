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

import type { CategoryDto } from "../../model/categoryDto";
import type { CreateCategory201AllOf } from "../../model/createCategory201AllOf";
import type { CreateCategoryDto } from "../../model/createCategoryDto";
import type { DeleteCategory200AllOf } from "../../model/deleteCategory200AllOf";
import type { GetCategories200AllOf } from "../../model/getCategories200AllOf";
import type { GetCategoriesParams } from "../../model/getCategoriesParams";
import type { GetCategoryById200AllOf } from "../../model/getCategoryById200AllOf";
import type { UpdateCategory200AllOf } from "../../model/updateCategory200AllOf";
import type { UpdateCategoryDto } from "../../model/updateCategoryDto";
export type { CategoryDto };
export type { CreateCategory201AllOf };
export type { CreateCategoryDto };
export type { DeleteCategory200AllOf };
export type { GetCategories200AllOf };
export type { GetCategoriesParams };
export type { GetCategoryById200AllOf };
export type { UpdateCategory200AllOf };
export type { UpdateCategoryDto };
import type { BodyType, ErrorType } from "../../libs/customAxios";
import { customInstance } from "../../libs/customAxios";

type SecondParameter<T extends (...args: never) => unknown> = Parameters<T>[1];

/**
 * 카테고리 목록을 조회합니다. type 쿼리 파라미터로 유형별 필터링이 가능합니다. 상위/하위 카테고리 정보를 포함합니다.
 * @summary 카테고리 목록 조회
 */
export const getCategories = (
    params?: GetCategoriesParams,
 options?: SecondParameter<typeof customInstance>,signal?: AbortSignal
) => {
      
      
      return customInstance<GetCategories200AllOf>(
      {url: `/api/v1/categories`, method: 'GET',
        params, signal
    },
      options);
    }

export const getGetCategoriesQueryKey = (params?: GetCategoriesParams,) => {
    return [
    `/api/v1/categories`, ...(params ? [params]: [])
    ] as const;
    }

export const getGetCategoriesInfiniteQueryKey = (params?: GetCategoriesParams,) => {
    return [
    'infinite', `/api/v1/categories`, ...(params ? [params]: [])
    ] as const;
    }

export const getGetCategoriesQueryOptions = <TData = Awaited<ReturnType<typeof getCategories>>, TError = ErrorType<void>>(params?: GetCategoriesParams, options?: { query?:Partial<UseQueryOptions<Awaited<ReturnType<typeof getCategories>>, TError, TData>>, request?: SecondParameter<typeof customInstance>}
) => {

const {query: queryOptions, request: requestOptions} = options ?? {};

  const queryKey =  queryOptions?.queryKey ?? getGetCategoriesQueryKey(params);

  

    const queryFn: QueryFunction<Awaited<ReturnType<typeof getCategories>>> = ({ signal }) => getCategories(params, requestOptions, signal);

      

      

   return  { queryKey, queryFn, ...queryOptions} as UseQueryOptions<Awaited<ReturnType<typeof getCategories>>, TError, TData> & { queryKey: DataTag<QueryKey, TData, TError> }
}

export type GetCategoriesQueryResult = NonNullable<Awaited<ReturnType<typeof getCategories>>>

export type GetCategoriesQueryError = ErrorType<void>

export function useGetCategories<TData = Awaited<ReturnType<typeof getCategories>>, TError = ErrorType<void>>(
 params: undefined |  GetCategoriesParams, options: { query:Partial<UseQueryOptions<Awaited<ReturnType<typeof getCategories>>, TError, TData>> & Pick<
        DefinedInitialDataOptions<
          Awaited<ReturnType<typeof getCategories>>,
          TError,
          Awaited<ReturnType<typeof getCategories>>
        > , 'initialData'
      >, request?: SecondParameter<typeof customInstance>}
 , queryClient?: QueryClient
  ):  DefinedUseQueryResult<TData, TError> & { queryKey: DataTag<QueryKey, TData, TError> }

export function useGetCategories<TData = Awaited<ReturnType<typeof getCategories>>, TError = ErrorType<void>>(
 params?: GetCategoriesParams, options?: { query?:Partial<UseQueryOptions<Awaited<ReturnType<typeof getCategories>>, TError, TData>> & Pick<
        UndefinedInitialDataOptions<
          Awaited<ReturnType<typeof getCategories>>,
          TError,
          Awaited<ReturnType<typeof getCategories>>
        > , 'initialData'
      >, request?: SecondParameter<typeof customInstance>}
 , queryClient?: QueryClient
  ):  UseQueryResult<TData, TError> & { queryKey: DataTag<QueryKey, TData, TError> }

export function useGetCategories<TData = Awaited<ReturnType<typeof getCategories>>, TError = ErrorType<void>>(
 params?: GetCategoriesParams, options?: { query?:Partial<UseQueryOptions<Awaited<ReturnType<typeof getCategories>>, TError, TData>>, request?: SecondParameter<typeof customInstance>}
 , queryClient?: QueryClient
  ):  UseQueryResult<TData, TError> & { queryKey: DataTag<QueryKey, TData, TError> }

/**
 * @summary 카테고리 목록 조회
 */

export function useGetCategories<TData = Awaited<ReturnType<typeof getCategories>>, TError = ErrorType<void>>(
 params?: GetCategoriesParams, options?: { query?:Partial<UseQueryOptions<Awaited<ReturnType<typeof getCategories>>, TError, TData>>, request?: SecondParameter<typeof customInstance>}
 , queryClient?: QueryClient 
 ):  UseQueryResult<TData, TError> & { queryKey: DataTag<QueryKey, TData, TError> } {

  const queryOptions = getGetCategoriesQueryOptions(params,options)

  const query = useQuery(queryOptions, queryClient) as  UseQueryResult<TData, TError> & { queryKey: DataTag<QueryKey, TData, TError> };

  query.queryKey = queryOptions.queryKey ;

  return query;
}

/**
 * @summary 카테고리 목록 조회
 */
export const prefetchGetCategoriesQuery = async <TData = Awaited<ReturnType<typeof getCategories>>, TError = ErrorType<void>>(
 queryClient: QueryClient, params?: GetCategoriesParams, options?: { query?:Partial<UseQueryOptions<Awaited<ReturnType<typeof getCategories>>, TError, TData>>, request?: SecondParameter<typeof customInstance>}

  ): Promise<QueryClient> => {

  const queryOptions = getGetCategoriesQueryOptions(params,options)

  await queryClient.prefetchQuery(queryOptions);

  return queryClient;
}

export const getGetCategoriesSuspenseQueryOptions = <TData = Awaited<ReturnType<typeof getCategories>>, TError = ErrorType<void>>(params?: GetCategoriesParams, options?: { query?:Partial<UseSuspenseQueryOptions<Awaited<ReturnType<typeof getCategories>>, TError, TData>>, request?: SecondParameter<typeof customInstance>}
) => {

const {query: queryOptions, request: requestOptions} = options ?? {};

  const queryKey =  queryOptions?.queryKey ?? getGetCategoriesQueryKey(params);

  

    const queryFn: QueryFunction<Awaited<ReturnType<typeof getCategories>>> = ({ signal }) => getCategories(params, requestOptions, signal);

      

      

   return  { queryKey, queryFn, ...queryOptions} as UseSuspenseQueryOptions<Awaited<ReturnType<typeof getCategories>>, TError, TData> & { queryKey: DataTag<QueryKey, TData, TError> }
}

export type GetCategoriesSuspenseQueryResult = NonNullable<Awaited<ReturnType<typeof getCategories>>>

export type GetCategoriesSuspenseQueryError = ErrorType<void>

export function useGetCategoriesSuspense<TData = Awaited<ReturnType<typeof getCategories>>, TError = ErrorType<void>>(
 params: undefined |  GetCategoriesParams, options: { query:Partial<UseSuspenseQueryOptions<Awaited<ReturnType<typeof getCategories>>, TError, TData>>, request?: SecondParameter<typeof customInstance>}
 , queryClient?: QueryClient
  ):  UseSuspenseQueryResult<TData, TError> & { queryKey: DataTag<QueryKey, TData, TError> }

export function useGetCategoriesSuspense<TData = Awaited<ReturnType<typeof getCategories>>, TError = ErrorType<void>>(
 params?: GetCategoriesParams, options?: { query?:Partial<UseSuspenseQueryOptions<Awaited<ReturnType<typeof getCategories>>, TError, TData>>, request?: SecondParameter<typeof customInstance>}
 , queryClient?: QueryClient
  ):  UseSuspenseQueryResult<TData, TError> & { queryKey: DataTag<QueryKey, TData, TError> }

export function useGetCategoriesSuspense<TData = Awaited<ReturnType<typeof getCategories>>, TError = ErrorType<void>>(
 params?: GetCategoriesParams, options?: { query?:Partial<UseSuspenseQueryOptions<Awaited<ReturnType<typeof getCategories>>, TError, TData>>, request?: SecondParameter<typeof customInstance>}
 , queryClient?: QueryClient
  ):  UseSuspenseQueryResult<TData, TError> & { queryKey: DataTag<QueryKey, TData, TError> }

/**
 * @summary 카테고리 목록 조회
 */

export function useGetCategoriesSuspense<TData = Awaited<ReturnType<typeof getCategories>>, TError = ErrorType<void>>(
 params?: GetCategoriesParams, options?: { query?:Partial<UseSuspenseQueryOptions<Awaited<ReturnType<typeof getCategories>>, TError, TData>>, request?: SecondParameter<typeof customInstance>}
 , queryClient?: QueryClient 
 ):  UseSuspenseQueryResult<TData, TError> & { queryKey: DataTag<QueryKey, TData, TError> } {

  const queryOptions = getGetCategoriesSuspenseQueryOptions(params,options)

  const query = useSuspenseQuery(queryOptions, queryClient) as  UseSuspenseQueryResult<TData, TError> & { queryKey: DataTag<QueryKey, TData, TError> };

  query.queryKey = queryOptions.queryKey ;

  return query;
}

export const getGetCategoriesSuspenseInfiniteQueryOptions = <TData = InfiniteData<Awaited<ReturnType<typeof getCategories>>>, TError = ErrorType<void>>(params?: GetCategoriesParams, options?: { query?:Partial<UseSuspenseInfiniteQueryOptions<Awaited<ReturnType<typeof getCategories>>, TError, TData>>, request?: SecondParameter<typeof customInstance>}
) => {

const {query: queryOptions, request: requestOptions} = options ?? {};

  const queryKey =  queryOptions?.queryKey ?? getGetCategoriesInfiniteQueryKey(params);

  

    const queryFn: QueryFunction<Awaited<ReturnType<typeof getCategories>>> = ({ signal }) => getCategories(params, requestOptions, signal);

      

      

   return  { queryKey, queryFn, ...queryOptions} as UseSuspenseInfiniteQueryOptions<Awaited<ReturnType<typeof getCategories>>, TError, TData> & { queryKey: DataTag<QueryKey, TData, TError> }
}

export type GetCategoriesSuspenseInfiniteQueryResult = NonNullable<Awaited<ReturnType<typeof getCategories>>>

export type GetCategoriesSuspenseInfiniteQueryError = ErrorType<void>

export function useGetCategoriesSuspenseInfinite<TData = InfiniteData<Awaited<ReturnType<typeof getCategories>>>, TError = ErrorType<void>>(
 params: undefined |  GetCategoriesParams, options: { query:Partial<UseSuspenseInfiniteQueryOptions<Awaited<ReturnType<typeof getCategories>>, TError, TData>>, request?: SecondParameter<typeof customInstance>}
 , queryClient?: QueryClient
  ):  UseSuspenseInfiniteQueryResult<TData, TError> & { queryKey: DataTag<QueryKey, TData, TError> }

export function useGetCategoriesSuspenseInfinite<TData = InfiniteData<Awaited<ReturnType<typeof getCategories>>>, TError = ErrorType<void>>(
 params?: GetCategoriesParams, options?: { query?:Partial<UseSuspenseInfiniteQueryOptions<Awaited<ReturnType<typeof getCategories>>, TError, TData>>, request?: SecondParameter<typeof customInstance>}
 , queryClient?: QueryClient
  ):  UseSuspenseInfiniteQueryResult<TData, TError> & { queryKey: DataTag<QueryKey, TData, TError> }

export function useGetCategoriesSuspenseInfinite<TData = InfiniteData<Awaited<ReturnType<typeof getCategories>>>, TError = ErrorType<void>>(
 params?: GetCategoriesParams, options?: { query?:Partial<UseSuspenseInfiniteQueryOptions<Awaited<ReturnType<typeof getCategories>>, TError, TData>>, request?: SecondParameter<typeof customInstance>}
 , queryClient?: QueryClient
  ):  UseSuspenseInfiniteQueryResult<TData, TError> & { queryKey: DataTag<QueryKey, TData, TError> }

/**
 * @summary 카테고리 목록 조회
 */

export function useGetCategoriesSuspenseInfinite<TData = InfiniteData<Awaited<ReturnType<typeof getCategories>>>, TError = ErrorType<void>>(
 params?: GetCategoriesParams, options?: { query?:Partial<UseSuspenseInfiniteQueryOptions<Awaited<ReturnType<typeof getCategories>>, TError, TData>>, request?: SecondParameter<typeof customInstance>}
 , queryClient?: QueryClient 
 ):  UseSuspenseInfiniteQueryResult<TData, TError> & { queryKey: DataTag<QueryKey, TData, TError> } {

  const queryOptions = getGetCategoriesSuspenseInfiniteQueryOptions(params,options)

  const query = useSuspenseInfiniteQuery(queryOptions, queryClient) as  UseSuspenseInfiniteQueryResult<TData, TError> & { queryKey: DataTag<QueryKey, TData, TError> };

  query.queryKey = queryOptions.queryKey ;

  return query;
}

/**
 * @summary 카테고리 목록 조회
 */
export const prefetchGetCategoriesInfiniteQuery = async <TData = Awaited<ReturnType<typeof getCategories>>, TError = ErrorType<void>>(
 queryClient: QueryClient, params?: GetCategoriesParams, options?: { query?:Partial<UseSuspenseInfiniteQueryOptions<Awaited<ReturnType<typeof getCategories>>, TError, TData>>, request?: SecondParameter<typeof customInstance>}

  ): Promise<QueryClient> => {

  const queryOptions = getGetCategoriesSuspenseInfiniteQueryOptions(params,options)

  await queryClient.prefetchInfiniteQuery(queryOptions);

  return queryClient;
}

/**
 * 새로운 카테고리를 생성합니다. FULL_ACCESS 전용 API입니다. parentId로 상위 카테고리를 지정할 수 있습니다.
 * @summary 카테고리 생성
 */
export const createCategory = (
    createCategoryDto: BodyType<CreateCategoryDto>,
 options?: SecondParameter<typeof customInstance>,signal?: AbortSignal
) => {
      
      
      return customInstance<CreateCategory201AllOf>(
      {url: `/api/v1/categories`, method: 'POST',
      headers: {'Content-Type': 'application/json', },
      data: createCategoryDto, signal
    },
      options);
    }

export const getCreateCategoryMutationOptions = <TError = ErrorType<void>,
    TContext = unknown>(options?: { mutation?:UseMutationOptions<Awaited<ReturnType<typeof createCategory>>, TError,{data: BodyType<CreateCategoryDto>}, TContext>, request?: SecondParameter<typeof customInstance>}
): UseMutationOptions<Awaited<ReturnType<typeof createCategory>>, TError,{data: BodyType<CreateCategoryDto>}, TContext> => {

const mutationKey = ['createCategory'];
const {mutation: mutationOptions, request: requestOptions} = options ?
      options.mutation && 'mutationKey' in options.mutation && options.mutation.mutationKey ?
      options
      : {...options, mutation: {...options.mutation, mutationKey}}
      : {mutation: { mutationKey, }, request: undefined};

      


      const mutationFn: MutationFunction<Awaited<ReturnType<typeof createCategory>>, {data: BodyType<CreateCategoryDto>}> = (props) => {
          const {data} = props ?? {};

          return  createCategory(data,requestOptions)
        }

        


  return  { mutationFn, ...mutationOptions }}

export type CreateCategoryMutationResult = NonNullable<Awaited<ReturnType<typeof createCategory>>>

export type CreateCategoryMutationBody = BodyType<CreateCategoryDto>

export type CreateCategoryMutationError = ErrorType<void>

/**
 * @summary 카테고리 생성
 */
export const useCreateCategory = <TError = ErrorType<void>,
    TContext = unknown>(options?: { mutation?:UseMutationOptions<Awaited<ReturnType<typeof createCategory>>, TError,{data: BodyType<CreateCategoryDto>}, TContext>, request?: SecondParameter<typeof customInstance>}
 , queryClient?: QueryClient): UseMutationResult<
        Awaited<ReturnType<typeof createCategory>>,
        TError,
        {data: BodyType<CreateCategoryDto>},
        TContext
      > => {

      const mutationOptions = getCreateCategoryMutationOptions(options);

      return useMutation(mutationOptions, queryClient);
    }

/**
 * ID로 카테고리를 조회합니다. 상위/하위 카테고리 및 연결된 역할(RoleClassification) 정보를 포함합니다.
 * @summary 카테고리 상세 조회
 */
export const getCategoryById = (
    id: string,
 options?: SecondParameter<typeof customInstance>,signal?: AbortSignal
) => {
      
      
      return customInstance<GetCategoryById200AllOf>(
      {url: `/api/v1/categories/${id}`, method: 'GET', signal
    },
      options);
    }

export const getGetCategoryByIdQueryKey = (id?: string,) => {
    return [
    `/api/v1/categories/${id}`
    ] as const;
    }

export const getGetCategoryByIdInfiniteQueryKey = (id?: string,) => {
    return [
    'infinite', `/api/v1/categories/${id}`
    ] as const;
    }

export const getGetCategoryByIdQueryOptions = <TData = Awaited<ReturnType<typeof getCategoryById>>, TError = ErrorType<void>>(id: string, options?: { query?:Partial<UseQueryOptions<Awaited<ReturnType<typeof getCategoryById>>, TError, TData>>, request?: SecondParameter<typeof customInstance>}
) => {

const {query: queryOptions, request: requestOptions} = options ?? {};

  const queryKey =  queryOptions?.queryKey ?? getGetCategoryByIdQueryKey(id);

  

    const queryFn: QueryFunction<Awaited<ReturnType<typeof getCategoryById>>> = ({ signal }) => getCategoryById(id, requestOptions, signal);

      

      

   return  { queryKey, queryFn, enabled: !!(id), ...queryOptions} as UseQueryOptions<Awaited<ReturnType<typeof getCategoryById>>, TError, TData> & { queryKey: DataTag<QueryKey, TData, TError> }
}

export type GetCategoryByIdQueryResult = NonNullable<Awaited<ReturnType<typeof getCategoryById>>>

export type GetCategoryByIdQueryError = ErrorType<void>

export function useGetCategoryById<TData = Awaited<ReturnType<typeof getCategoryById>>, TError = ErrorType<void>>(
 id: string, options: { query:Partial<UseQueryOptions<Awaited<ReturnType<typeof getCategoryById>>, TError, TData>> & Pick<
        DefinedInitialDataOptions<
          Awaited<ReturnType<typeof getCategoryById>>,
          TError,
          Awaited<ReturnType<typeof getCategoryById>>
        > , 'initialData'
      >, request?: SecondParameter<typeof customInstance>}
 , queryClient?: QueryClient
  ):  DefinedUseQueryResult<TData, TError> & { queryKey: DataTag<QueryKey, TData, TError> }

export function useGetCategoryById<TData = Awaited<ReturnType<typeof getCategoryById>>, TError = ErrorType<void>>(
 id: string, options?: { query?:Partial<UseQueryOptions<Awaited<ReturnType<typeof getCategoryById>>, TError, TData>> & Pick<
        UndefinedInitialDataOptions<
          Awaited<ReturnType<typeof getCategoryById>>,
          TError,
          Awaited<ReturnType<typeof getCategoryById>>
        > , 'initialData'
      >, request?: SecondParameter<typeof customInstance>}
 , queryClient?: QueryClient
  ):  UseQueryResult<TData, TError> & { queryKey: DataTag<QueryKey, TData, TError> }

export function useGetCategoryById<TData = Awaited<ReturnType<typeof getCategoryById>>, TError = ErrorType<void>>(
 id: string, options?: { query?:Partial<UseQueryOptions<Awaited<ReturnType<typeof getCategoryById>>, TError, TData>>, request?: SecondParameter<typeof customInstance>}
 , queryClient?: QueryClient
  ):  UseQueryResult<TData, TError> & { queryKey: DataTag<QueryKey, TData, TError> }

/**
 * @summary 카테고리 상세 조회
 */

export function useGetCategoryById<TData = Awaited<ReturnType<typeof getCategoryById>>, TError = ErrorType<void>>(
 id: string, options?: { query?:Partial<UseQueryOptions<Awaited<ReturnType<typeof getCategoryById>>, TError, TData>>, request?: SecondParameter<typeof customInstance>}
 , queryClient?: QueryClient 
 ):  UseQueryResult<TData, TError> & { queryKey: DataTag<QueryKey, TData, TError> } {

  const queryOptions = getGetCategoryByIdQueryOptions(id,options)

  const query = useQuery(queryOptions, queryClient) as  UseQueryResult<TData, TError> & { queryKey: DataTag<QueryKey, TData, TError> };

  query.queryKey = queryOptions.queryKey ;

  return query;
}

/**
 * @summary 카테고리 상세 조회
 */
export const prefetchGetCategoryByIdQuery = async <TData = Awaited<ReturnType<typeof getCategoryById>>, TError = ErrorType<void>>(
 queryClient: QueryClient, id: string, options?: { query?:Partial<UseQueryOptions<Awaited<ReturnType<typeof getCategoryById>>, TError, TData>>, request?: SecondParameter<typeof customInstance>}

  ): Promise<QueryClient> => {

  const queryOptions = getGetCategoryByIdQueryOptions(id,options)

  await queryClient.prefetchQuery(queryOptions);

  return queryClient;
}

export const getGetCategoryByIdSuspenseQueryOptions = <TData = Awaited<ReturnType<typeof getCategoryById>>, TError = ErrorType<void>>(id: string, options?: { query?:Partial<UseSuspenseQueryOptions<Awaited<ReturnType<typeof getCategoryById>>, TError, TData>>, request?: SecondParameter<typeof customInstance>}
) => {

const {query: queryOptions, request: requestOptions} = options ?? {};

  const queryKey =  queryOptions?.queryKey ?? getGetCategoryByIdQueryKey(id);

  

    const queryFn: QueryFunction<Awaited<ReturnType<typeof getCategoryById>>> = ({ signal }) => getCategoryById(id, requestOptions, signal);

      

      

   return  { queryKey, queryFn, ...queryOptions} as UseSuspenseQueryOptions<Awaited<ReturnType<typeof getCategoryById>>, TError, TData> & { queryKey: DataTag<QueryKey, TData, TError> }
}

export type GetCategoryByIdSuspenseQueryResult = NonNullable<Awaited<ReturnType<typeof getCategoryById>>>

export type GetCategoryByIdSuspenseQueryError = ErrorType<void>

export function useGetCategoryByIdSuspense<TData = Awaited<ReturnType<typeof getCategoryById>>, TError = ErrorType<void>>(
 id: string, options: { query:Partial<UseSuspenseQueryOptions<Awaited<ReturnType<typeof getCategoryById>>, TError, TData>>, request?: SecondParameter<typeof customInstance>}
 , queryClient?: QueryClient
  ):  UseSuspenseQueryResult<TData, TError> & { queryKey: DataTag<QueryKey, TData, TError> }

export function useGetCategoryByIdSuspense<TData = Awaited<ReturnType<typeof getCategoryById>>, TError = ErrorType<void>>(
 id: string, options?: { query?:Partial<UseSuspenseQueryOptions<Awaited<ReturnType<typeof getCategoryById>>, TError, TData>>, request?: SecondParameter<typeof customInstance>}
 , queryClient?: QueryClient
  ):  UseSuspenseQueryResult<TData, TError> & { queryKey: DataTag<QueryKey, TData, TError> }

export function useGetCategoryByIdSuspense<TData = Awaited<ReturnType<typeof getCategoryById>>, TError = ErrorType<void>>(
 id: string, options?: { query?:Partial<UseSuspenseQueryOptions<Awaited<ReturnType<typeof getCategoryById>>, TError, TData>>, request?: SecondParameter<typeof customInstance>}
 , queryClient?: QueryClient
  ):  UseSuspenseQueryResult<TData, TError> & { queryKey: DataTag<QueryKey, TData, TError> }

/**
 * @summary 카테고리 상세 조회
 */

export function useGetCategoryByIdSuspense<TData = Awaited<ReturnType<typeof getCategoryById>>, TError = ErrorType<void>>(
 id: string, options?: { query?:Partial<UseSuspenseQueryOptions<Awaited<ReturnType<typeof getCategoryById>>, TError, TData>>, request?: SecondParameter<typeof customInstance>}
 , queryClient?: QueryClient 
 ):  UseSuspenseQueryResult<TData, TError> & { queryKey: DataTag<QueryKey, TData, TError> } {

  const queryOptions = getGetCategoryByIdSuspenseQueryOptions(id,options)

  const query = useSuspenseQuery(queryOptions, queryClient) as  UseSuspenseQueryResult<TData, TError> & { queryKey: DataTag<QueryKey, TData, TError> };

  query.queryKey = queryOptions.queryKey ;

  return query;
}

export const getGetCategoryByIdSuspenseInfiniteQueryOptions = <TData = InfiniteData<Awaited<ReturnType<typeof getCategoryById>>>, TError = ErrorType<void>>(id: string, options?: { query?:Partial<UseSuspenseInfiniteQueryOptions<Awaited<ReturnType<typeof getCategoryById>>, TError, TData>>, request?: SecondParameter<typeof customInstance>}
) => {

const {query: queryOptions, request: requestOptions} = options ?? {};

  const queryKey =  queryOptions?.queryKey ?? getGetCategoryByIdInfiniteQueryKey(id);

  

    const queryFn: QueryFunction<Awaited<ReturnType<typeof getCategoryById>>> = ({ signal }) => getCategoryById(id, requestOptions, signal);

      

      

   return  { queryKey, queryFn, ...queryOptions} as UseSuspenseInfiniteQueryOptions<Awaited<ReturnType<typeof getCategoryById>>, TError, TData> & { queryKey: DataTag<QueryKey, TData, TError> }
}

export type GetCategoryByIdSuspenseInfiniteQueryResult = NonNullable<Awaited<ReturnType<typeof getCategoryById>>>

export type GetCategoryByIdSuspenseInfiniteQueryError = ErrorType<void>

export function useGetCategoryByIdSuspenseInfinite<TData = InfiniteData<Awaited<ReturnType<typeof getCategoryById>>>, TError = ErrorType<void>>(
 id: string, options: { query:Partial<UseSuspenseInfiniteQueryOptions<Awaited<ReturnType<typeof getCategoryById>>, TError, TData>>, request?: SecondParameter<typeof customInstance>}
 , queryClient?: QueryClient
  ):  UseSuspenseInfiniteQueryResult<TData, TError> & { queryKey: DataTag<QueryKey, TData, TError> }

export function useGetCategoryByIdSuspenseInfinite<TData = InfiniteData<Awaited<ReturnType<typeof getCategoryById>>>, TError = ErrorType<void>>(
 id: string, options?: { query?:Partial<UseSuspenseInfiniteQueryOptions<Awaited<ReturnType<typeof getCategoryById>>, TError, TData>>, request?: SecondParameter<typeof customInstance>}
 , queryClient?: QueryClient
  ):  UseSuspenseInfiniteQueryResult<TData, TError> & { queryKey: DataTag<QueryKey, TData, TError> }

export function useGetCategoryByIdSuspenseInfinite<TData = InfiniteData<Awaited<ReturnType<typeof getCategoryById>>>, TError = ErrorType<void>>(
 id: string, options?: { query?:Partial<UseSuspenseInfiniteQueryOptions<Awaited<ReturnType<typeof getCategoryById>>, TError, TData>>, request?: SecondParameter<typeof customInstance>}
 , queryClient?: QueryClient
  ):  UseSuspenseInfiniteQueryResult<TData, TError> & { queryKey: DataTag<QueryKey, TData, TError> }

/**
 * @summary 카테고리 상세 조회
 */

export function useGetCategoryByIdSuspenseInfinite<TData = InfiniteData<Awaited<ReturnType<typeof getCategoryById>>>, TError = ErrorType<void>>(
 id: string, options?: { query?:Partial<UseSuspenseInfiniteQueryOptions<Awaited<ReturnType<typeof getCategoryById>>, TError, TData>>, request?: SecondParameter<typeof customInstance>}
 , queryClient?: QueryClient 
 ):  UseSuspenseInfiniteQueryResult<TData, TError> & { queryKey: DataTag<QueryKey, TData, TError> } {

  const queryOptions = getGetCategoryByIdSuspenseInfiniteQueryOptions(id,options)

  const query = useSuspenseInfiniteQuery(queryOptions, queryClient) as  UseSuspenseInfiniteQueryResult<TData, TError> & { queryKey: DataTag<QueryKey, TData, TError> };

  query.queryKey = queryOptions.queryKey ;

  return query;
}

/**
 * @summary 카테고리 상세 조회
 */
export const prefetchGetCategoryByIdInfiniteQuery = async <TData = Awaited<ReturnType<typeof getCategoryById>>, TError = ErrorType<void>>(
 queryClient: QueryClient, id: string, options?: { query?:Partial<UseSuspenseInfiniteQueryOptions<Awaited<ReturnType<typeof getCategoryById>>, TError, TData>>, request?: SecondParameter<typeof customInstance>}

  ): Promise<QueryClient> => {

  const queryOptions = getGetCategoryByIdSuspenseInfiniteQueryOptions(id,options)

  await queryClient.prefetchInfiniteQuery(queryOptions);

  return queryClient;
}

/**
 * 카테고리 정보를 수정합니다. FULL_ACCESS 전용 API이며, parentId 변경 시 순환 참조를 검증합니다.
 * @summary 카테고리 수정
 */
export const updateCategory = (
    id: string,
    updateCategoryDto: BodyType<UpdateCategoryDto>,
 options?: SecondParameter<typeof customInstance>,) => {
      
      
      return customInstance<UpdateCategory200AllOf>(
      {url: `/api/v1/categories/${id}`, method: 'PATCH',
      headers: {'Content-Type': 'application/json', },
      data: updateCategoryDto
    },
      options);
    }

export const getUpdateCategoryMutationOptions = <TError = ErrorType<void>,
    TContext = unknown>(options?: { mutation?:UseMutationOptions<Awaited<ReturnType<typeof updateCategory>>, TError,{id: string;data: BodyType<UpdateCategoryDto>}, TContext>, request?: SecondParameter<typeof customInstance>}
): UseMutationOptions<Awaited<ReturnType<typeof updateCategory>>, TError,{id: string;data: BodyType<UpdateCategoryDto>}, TContext> => {

const mutationKey = ['updateCategory'];
const {mutation: mutationOptions, request: requestOptions} = options ?
      options.mutation && 'mutationKey' in options.mutation && options.mutation.mutationKey ?
      options
      : {...options, mutation: {...options.mutation, mutationKey}}
      : {mutation: { mutationKey, }, request: undefined};

      


      const mutationFn: MutationFunction<Awaited<ReturnType<typeof updateCategory>>, {id: string;data: BodyType<UpdateCategoryDto>}> = (props) => {
          const {id,data} = props ?? {};

          return  updateCategory(id,data,requestOptions)
        }

        


  return  { mutationFn, ...mutationOptions }}

export type UpdateCategoryMutationResult = NonNullable<Awaited<ReturnType<typeof updateCategory>>>

export type UpdateCategoryMutationBody = BodyType<UpdateCategoryDto>

export type UpdateCategoryMutationError = ErrorType<void>

/**
 * @summary 카테고리 수정
 */
export const useUpdateCategory = <TError = ErrorType<void>,
    TContext = unknown>(options?: { mutation?:UseMutationOptions<Awaited<ReturnType<typeof updateCategory>>, TError,{id: string;data: BodyType<UpdateCategoryDto>}, TContext>, request?: SecondParameter<typeof customInstance>}
 , queryClient?: QueryClient): UseMutationResult<
        Awaited<ReturnType<typeof updateCategory>>,
        TError,
        {id: string;data: BodyType<UpdateCategoryDto>},
        TContext
      > => {

      const mutationOptions = getUpdateCategoryMutationOptions(options);

      return useMutation(mutationOptions, queryClient);
    }

/**
 * 카테고리를 삭제합니다. FULL_ACCESS 전용 API이며, 하위 카테고리가 있으면 삭제할 수 없습니다.
 * @summary 카테고리 삭제
 */
export const deleteCategory = (
    id: string,
 options?: SecondParameter<typeof customInstance>,) => {
      
      
      return customInstance<DeleteCategory200AllOf>(
      {url: `/api/v1/categories/${id}`, method: 'DELETE'
    },
      options);
    }

export const getDeleteCategoryMutationOptions = <TError = ErrorType<void>,
    TContext = unknown>(options?: { mutation?:UseMutationOptions<Awaited<ReturnType<typeof deleteCategory>>, TError,{id: string}, TContext>, request?: SecondParameter<typeof customInstance>}
): UseMutationOptions<Awaited<ReturnType<typeof deleteCategory>>, TError,{id: string}, TContext> => {

const mutationKey = ['deleteCategory'];
const {mutation: mutationOptions, request: requestOptions} = options ?
      options.mutation && 'mutationKey' in options.mutation && options.mutation.mutationKey ?
      options
      : {...options, mutation: {...options.mutation, mutationKey}}
      : {mutation: { mutationKey, }, request: undefined};

      


      const mutationFn: MutationFunction<Awaited<ReturnType<typeof deleteCategory>>, {id: string}> = (props) => {
          const {id} = props ?? {};

          return  deleteCategory(id,requestOptions)
        }

        


  return  { mutationFn, ...mutationOptions }}

export type DeleteCategoryMutationResult = NonNullable<Awaited<ReturnType<typeof deleteCategory>>>

export type DeleteCategoryMutationError = ErrorType<void>

/**
 * @summary 카테고리 삭제
 */
export const useDeleteCategory = <TError = ErrorType<void>,
    TContext = unknown>(options?: { mutation?:UseMutationOptions<Awaited<ReturnType<typeof deleteCategory>>, TError,{id: string}, TContext>, request?: SecondParameter<typeof customInstance>}
 , queryClient?: QueryClient): UseMutationResult<
        Awaited<ReturnType<typeof deleteCategory>>,
        TError,
        {id: string},
        TContext
      > => {

      const mutationOptions = getDeleteCategoryMutationOptions(options);

      return useMutation(mutationOptions, queryClient);
    }
