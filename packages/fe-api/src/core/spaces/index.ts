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

import type { CreateGroundDto } from "../../model/createGroundDto";
import type { CreateSpace201AllOf } from "../../model/createSpace201AllOf";
import type { GetSpaceById200AllOf } from "../../model/getSpaceById200AllOf";
import type { GetSpaceGround200AllOf } from "../../model/getSpaceGround200AllOf";
import type { GetSpaces200AllOf } from "../../model/getSpaces200AllOf";
import type { GroundDto } from "../../model/groundDto";
import type { SpaceDto } from "../../model/spaceDto";
import type { UpdateGroundDto } from "../../model/updateGroundDto";
import type { UpdateSpaceGround200AllOf } from "../../model/updateSpaceGround200AllOf";
export type { CreateGroundDto };
export type { CreateSpace201AllOf };
export type { GetSpaceById200AllOf };
export type { GetSpaceGround200AllOf };
export type { GetSpaces200AllOf };
export type { GroundDto };
export type { SpaceDto };
export type { UpdateGroundDto };
export type { UpdateSpaceGround200AllOf };
import type { BodyType, ErrorType } from "../../libs/customAxios";
import { customInstance } from "../../libs/customAxios";

type SecondParameter<T extends (...args: never) => unknown> = Parameters<T>[1];

/**
 * Ground detail이 있는 Space 목록을 조회합니다.
 * @summary 공간 목록 조회
 */
export const getSpaces = (
    
 options?: SecondParameter<typeof customInstance>,signal?: AbortSignal
) => {
      
      
      return customInstance<GetSpaces200AllOf>(
      {url: `/api/v1/spaces`, method: 'GET', signal
    },
      options);
    }

export const getGetSpacesQueryKey = () => {
    return [
    `/api/v1/spaces`
    ] as const;
    }

export const getGetSpacesInfiniteQueryKey = () => {
    return [
    'infinite', `/api/v1/spaces`
    ] as const;
    }

export const getGetSpacesQueryOptions = <TData = Awaited<ReturnType<typeof getSpaces>>, TError = ErrorType<void>>( options?: { query?:Partial<UseQueryOptions<Awaited<ReturnType<typeof getSpaces>>, TError, TData>>, request?: SecondParameter<typeof customInstance>}
) => {

const {query: queryOptions, request: requestOptions} = options ?? {};

  const queryKey =  queryOptions?.queryKey ?? getGetSpacesQueryKey();

  

    const queryFn: QueryFunction<Awaited<ReturnType<typeof getSpaces>>> = ({ signal }) => getSpaces(requestOptions, signal);

      

      

   return  { queryKey, queryFn, ...queryOptions} as UseQueryOptions<Awaited<ReturnType<typeof getSpaces>>, TError, TData> & { queryKey: DataTag<QueryKey, TData, TError> }
}

export type GetSpacesQueryResult = NonNullable<Awaited<ReturnType<typeof getSpaces>>>

export type GetSpacesQueryError = ErrorType<void>

export function useGetSpaces<TData = Awaited<ReturnType<typeof getSpaces>>, TError = ErrorType<void>>(
  options: { query:Partial<UseQueryOptions<Awaited<ReturnType<typeof getSpaces>>, TError, TData>> & Pick<
        DefinedInitialDataOptions<
          Awaited<ReturnType<typeof getSpaces>>,
          TError,
          Awaited<ReturnType<typeof getSpaces>>
        > , 'initialData'
      >, request?: SecondParameter<typeof customInstance>}
 , queryClient?: QueryClient
  ):  DefinedUseQueryResult<TData, TError> & { queryKey: DataTag<QueryKey, TData, TError> }

export function useGetSpaces<TData = Awaited<ReturnType<typeof getSpaces>>, TError = ErrorType<void>>(
  options?: { query?:Partial<UseQueryOptions<Awaited<ReturnType<typeof getSpaces>>, TError, TData>> & Pick<
        UndefinedInitialDataOptions<
          Awaited<ReturnType<typeof getSpaces>>,
          TError,
          Awaited<ReturnType<typeof getSpaces>>
        > , 'initialData'
      >, request?: SecondParameter<typeof customInstance>}
 , queryClient?: QueryClient
  ):  UseQueryResult<TData, TError> & { queryKey: DataTag<QueryKey, TData, TError> }

export function useGetSpaces<TData = Awaited<ReturnType<typeof getSpaces>>, TError = ErrorType<void>>(
  options?: { query?:Partial<UseQueryOptions<Awaited<ReturnType<typeof getSpaces>>, TError, TData>>, request?: SecondParameter<typeof customInstance>}
 , queryClient?: QueryClient
  ):  UseQueryResult<TData, TError> & { queryKey: DataTag<QueryKey, TData, TError> }

/**
 * @summary 공간 목록 조회
 */

export function useGetSpaces<TData = Awaited<ReturnType<typeof getSpaces>>, TError = ErrorType<void>>(
  options?: { query?:Partial<UseQueryOptions<Awaited<ReturnType<typeof getSpaces>>, TError, TData>>, request?: SecondParameter<typeof customInstance>}
 , queryClient?: QueryClient 
 ):  UseQueryResult<TData, TError> & { queryKey: DataTag<QueryKey, TData, TError> } {

  const queryOptions = getGetSpacesQueryOptions(options)

  const query = useQuery(queryOptions, queryClient) as  UseQueryResult<TData, TError> & { queryKey: DataTag<QueryKey, TData, TError> };

  query.queryKey = queryOptions.queryKey ;

  return query;
}

/**
 * @summary 공간 목록 조회
 */
export const prefetchGetSpacesQuery = async <TData = Awaited<ReturnType<typeof getSpaces>>, TError = ErrorType<void>>(
 queryClient: QueryClient,  options?: { query?:Partial<UseQueryOptions<Awaited<ReturnType<typeof getSpaces>>, TError, TData>>, request?: SecondParameter<typeof customInstance>}

  ): Promise<QueryClient> => {

  const queryOptions = getGetSpacesQueryOptions(options)

  await queryClient.prefetchQuery(queryOptions);

  return queryClient;
}

export const getGetSpacesSuspenseQueryOptions = <TData = Awaited<ReturnType<typeof getSpaces>>, TError = ErrorType<void>>( options?: { query?:Partial<UseSuspenseQueryOptions<Awaited<ReturnType<typeof getSpaces>>, TError, TData>>, request?: SecondParameter<typeof customInstance>}
) => {

const {query: queryOptions, request: requestOptions} = options ?? {};

  const queryKey =  queryOptions?.queryKey ?? getGetSpacesQueryKey();

  

    const queryFn: QueryFunction<Awaited<ReturnType<typeof getSpaces>>> = ({ signal }) => getSpaces(requestOptions, signal);

      

      

   return  { queryKey, queryFn, ...queryOptions} as UseSuspenseQueryOptions<Awaited<ReturnType<typeof getSpaces>>, TError, TData> & { queryKey: DataTag<QueryKey, TData, TError> }
}

export type GetSpacesSuspenseQueryResult = NonNullable<Awaited<ReturnType<typeof getSpaces>>>

export type GetSpacesSuspenseQueryError = ErrorType<void>

export function useGetSpacesSuspense<TData = Awaited<ReturnType<typeof getSpaces>>, TError = ErrorType<void>>(
  options: { query:Partial<UseSuspenseQueryOptions<Awaited<ReturnType<typeof getSpaces>>, TError, TData>>, request?: SecondParameter<typeof customInstance>}
 , queryClient?: QueryClient
  ):  UseSuspenseQueryResult<TData, TError> & { queryKey: DataTag<QueryKey, TData, TError> }

export function useGetSpacesSuspense<TData = Awaited<ReturnType<typeof getSpaces>>, TError = ErrorType<void>>(
  options?: { query?:Partial<UseSuspenseQueryOptions<Awaited<ReturnType<typeof getSpaces>>, TError, TData>>, request?: SecondParameter<typeof customInstance>}
 , queryClient?: QueryClient
  ):  UseSuspenseQueryResult<TData, TError> & { queryKey: DataTag<QueryKey, TData, TError> }

export function useGetSpacesSuspense<TData = Awaited<ReturnType<typeof getSpaces>>, TError = ErrorType<void>>(
  options?: { query?:Partial<UseSuspenseQueryOptions<Awaited<ReturnType<typeof getSpaces>>, TError, TData>>, request?: SecondParameter<typeof customInstance>}
 , queryClient?: QueryClient
  ):  UseSuspenseQueryResult<TData, TError> & { queryKey: DataTag<QueryKey, TData, TError> }

/**
 * @summary 공간 목록 조회
 */

export function useGetSpacesSuspense<TData = Awaited<ReturnType<typeof getSpaces>>, TError = ErrorType<void>>(
  options?: { query?:Partial<UseSuspenseQueryOptions<Awaited<ReturnType<typeof getSpaces>>, TError, TData>>, request?: SecondParameter<typeof customInstance>}
 , queryClient?: QueryClient 
 ):  UseSuspenseQueryResult<TData, TError> & { queryKey: DataTag<QueryKey, TData, TError> } {

  const queryOptions = getGetSpacesSuspenseQueryOptions(options)

  const query = useSuspenseQuery(queryOptions, queryClient) as  UseSuspenseQueryResult<TData, TError> & { queryKey: DataTag<QueryKey, TData, TError> };

  query.queryKey = queryOptions.queryKey ;

  return query;
}

export const getGetSpacesSuspenseInfiniteQueryOptions = <TData = InfiniteData<Awaited<ReturnType<typeof getSpaces>>>, TError = ErrorType<void>>( options?: { query?:Partial<UseSuspenseInfiniteQueryOptions<Awaited<ReturnType<typeof getSpaces>>, TError, TData>>, request?: SecondParameter<typeof customInstance>}
) => {

const {query: queryOptions, request: requestOptions} = options ?? {};

  const queryKey =  queryOptions?.queryKey ?? getGetSpacesInfiniteQueryKey();

  

    const queryFn: QueryFunction<Awaited<ReturnType<typeof getSpaces>>> = ({ signal }) => getSpaces(requestOptions, signal);

      

      

   return  { queryKey, queryFn, ...queryOptions} as UseSuspenseInfiniteQueryOptions<Awaited<ReturnType<typeof getSpaces>>, TError, TData> & { queryKey: DataTag<QueryKey, TData, TError> }
}

export type GetSpacesSuspenseInfiniteQueryResult = NonNullable<Awaited<ReturnType<typeof getSpaces>>>

export type GetSpacesSuspenseInfiniteQueryError = ErrorType<void>

export function useGetSpacesSuspenseInfinite<TData = InfiniteData<Awaited<ReturnType<typeof getSpaces>>>, TError = ErrorType<void>>(
  options: { query:Partial<UseSuspenseInfiniteQueryOptions<Awaited<ReturnType<typeof getSpaces>>, TError, TData>>, request?: SecondParameter<typeof customInstance>}
 , queryClient?: QueryClient
  ):  UseSuspenseInfiniteQueryResult<TData, TError> & { queryKey: DataTag<QueryKey, TData, TError> }

export function useGetSpacesSuspenseInfinite<TData = InfiniteData<Awaited<ReturnType<typeof getSpaces>>>, TError = ErrorType<void>>(
  options?: { query?:Partial<UseSuspenseInfiniteQueryOptions<Awaited<ReturnType<typeof getSpaces>>, TError, TData>>, request?: SecondParameter<typeof customInstance>}
 , queryClient?: QueryClient
  ):  UseSuspenseInfiniteQueryResult<TData, TError> & { queryKey: DataTag<QueryKey, TData, TError> }

export function useGetSpacesSuspenseInfinite<TData = InfiniteData<Awaited<ReturnType<typeof getSpaces>>>, TError = ErrorType<void>>(
  options?: { query?:Partial<UseSuspenseInfiniteQueryOptions<Awaited<ReturnType<typeof getSpaces>>, TError, TData>>, request?: SecondParameter<typeof customInstance>}
 , queryClient?: QueryClient
  ):  UseSuspenseInfiniteQueryResult<TData, TError> & { queryKey: DataTag<QueryKey, TData, TError> }

/**
 * @summary 공간 목록 조회
 */

export function useGetSpacesSuspenseInfinite<TData = InfiniteData<Awaited<ReturnType<typeof getSpaces>>>, TError = ErrorType<void>>(
  options?: { query?:Partial<UseSuspenseInfiniteQueryOptions<Awaited<ReturnType<typeof getSpaces>>, TError, TData>>, request?: SecondParameter<typeof customInstance>}
 , queryClient?: QueryClient 
 ):  UseSuspenseInfiniteQueryResult<TData, TError> & { queryKey: DataTag<QueryKey, TData, TError> } {

  const queryOptions = getGetSpacesSuspenseInfiniteQueryOptions(options)

  const query = useSuspenseInfiniteQuery(queryOptions, queryClient) as  UseSuspenseInfiniteQueryResult<TData, TError> & { queryKey: DataTag<QueryKey, TData, TError> };

  query.queryKey = queryOptions.queryKey ;

  return query;
}

/**
 * @summary 공간 목록 조회
 */
export const prefetchGetSpacesInfiniteQuery = async <TData = Awaited<ReturnType<typeof getSpaces>>, TError = ErrorType<void>>(
 queryClient: QueryClient,  options?: { query?:Partial<UseSuspenseInfiniteQueryOptions<Awaited<ReturnType<typeof getSpaces>>, TError, TData>>, request?: SecondParameter<typeof customInstance>}

  ): Promise<QueryClient> => {

  const queryOptions = getGetSpacesSuspenseInfiniteQueryOptions(options)

  await queryClient.prefetchInfiniteQuery(queryOptions);

  return queryClient;
}

/**
 * Space root와 Ground detail을 함께 생성합니다.
 * @summary 공간 생성
 */
export const createSpace = (
    createGroundDto: BodyType<CreateGroundDto>,
 options?: SecondParameter<typeof customInstance>,signal?: AbortSignal
) => {
      
      
      return customInstance<CreateSpace201AllOf>(
      {url: `/api/v1/spaces`, method: 'POST',
      headers: {'Content-Type': 'application/json', },
      data: createGroundDto, signal
    },
      options);
    }

export const getCreateSpaceMutationOptions = <TError = ErrorType<void>,
    TContext = unknown>(options?: { mutation?:UseMutationOptions<Awaited<ReturnType<typeof createSpace>>, TError,{data: BodyType<CreateGroundDto>}, TContext>, request?: SecondParameter<typeof customInstance>}
): UseMutationOptions<Awaited<ReturnType<typeof createSpace>>, TError,{data: BodyType<CreateGroundDto>}, TContext> => {

const mutationKey = ['createSpace'];
const {mutation: mutationOptions, request: requestOptions} = options ?
      options.mutation && 'mutationKey' in options.mutation && options.mutation.mutationKey ?
      options
      : {...options, mutation: {...options.mutation, mutationKey}}
      : {mutation: { mutationKey, }, request: undefined};

      


      const mutationFn: MutationFunction<Awaited<ReturnType<typeof createSpace>>, {data: BodyType<CreateGroundDto>}> = (props) => {
          const {data} = props ?? {};

          return  createSpace(data,requestOptions)
        }

        


  return  { mutationFn, ...mutationOptions }}

export type CreateSpaceMutationResult = NonNullable<Awaited<ReturnType<typeof createSpace>>>

export type CreateSpaceMutationBody = BodyType<CreateGroundDto>

export type CreateSpaceMutationError = ErrorType<void>

/**
 * @summary 공간 생성
 */
export const useCreateSpace = <TError = ErrorType<void>,
    TContext = unknown>(options?: { mutation?:UseMutationOptions<Awaited<ReturnType<typeof createSpace>>, TError,{data: BodyType<CreateGroundDto>}, TContext>, request?: SecondParameter<typeof customInstance>}
 , queryClient?: QueryClient): UseMutationResult<
        Awaited<ReturnType<typeof createSpace>>,
        TError,
        {data: BodyType<CreateGroundDto>},
        TContext
      > => {

      const mutationOptions = getCreateSpaceMutationOptions(options);

      return useMutation(mutationOptions, queryClient);
    }

/**
 * Ground detail을 포함한 Space를 조회합니다.
 * @summary 공간 상세 조회
 */
export const getSpaceById = (
    spaceId: string,
 options?: SecondParameter<typeof customInstance>,signal?: AbortSignal
) => {
      
      
      return customInstance<GetSpaceById200AllOf>(
      {url: `/api/v1/spaces/${spaceId}`, method: 'GET', signal
    },
      options);
    }

export const getGetSpaceByIdQueryKey = (spaceId?: string,) => {
    return [
    `/api/v1/spaces/${spaceId}`
    ] as const;
    }

export const getGetSpaceByIdInfiniteQueryKey = (spaceId?: string,) => {
    return [
    'infinite', `/api/v1/spaces/${spaceId}`
    ] as const;
    }

export const getGetSpaceByIdQueryOptions = <TData = Awaited<ReturnType<typeof getSpaceById>>, TError = ErrorType<void>>(spaceId: string, options?: { query?:Partial<UseQueryOptions<Awaited<ReturnType<typeof getSpaceById>>, TError, TData>>, request?: SecondParameter<typeof customInstance>}
) => {

const {query: queryOptions, request: requestOptions} = options ?? {};

  const queryKey =  queryOptions?.queryKey ?? getGetSpaceByIdQueryKey(spaceId);

  

    const queryFn: QueryFunction<Awaited<ReturnType<typeof getSpaceById>>> = ({ signal }) => getSpaceById(spaceId, requestOptions, signal);

      

      

   return  { queryKey, queryFn, enabled: !!(spaceId), ...queryOptions} as UseQueryOptions<Awaited<ReturnType<typeof getSpaceById>>, TError, TData> & { queryKey: DataTag<QueryKey, TData, TError> }
}

export type GetSpaceByIdQueryResult = NonNullable<Awaited<ReturnType<typeof getSpaceById>>>

export type GetSpaceByIdQueryError = ErrorType<void>

export function useGetSpaceById<TData = Awaited<ReturnType<typeof getSpaceById>>, TError = ErrorType<void>>(
 spaceId: string, options: { query:Partial<UseQueryOptions<Awaited<ReturnType<typeof getSpaceById>>, TError, TData>> & Pick<
        DefinedInitialDataOptions<
          Awaited<ReturnType<typeof getSpaceById>>,
          TError,
          Awaited<ReturnType<typeof getSpaceById>>
        > , 'initialData'
      >, request?: SecondParameter<typeof customInstance>}
 , queryClient?: QueryClient
  ):  DefinedUseQueryResult<TData, TError> & { queryKey: DataTag<QueryKey, TData, TError> }

export function useGetSpaceById<TData = Awaited<ReturnType<typeof getSpaceById>>, TError = ErrorType<void>>(
 spaceId: string, options?: { query?:Partial<UseQueryOptions<Awaited<ReturnType<typeof getSpaceById>>, TError, TData>> & Pick<
        UndefinedInitialDataOptions<
          Awaited<ReturnType<typeof getSpaceById>>,
          TError,
          Awaited<ReturnType<typeof getSpaceById>>
        > , 'initialData'
      >, request?: SecondParameter<typeof customInstance>}
 , queryClient?: QueryClient
  ):  UseQueryResult<TData, TError> & { queryKey: DataTag<QueryKey, TData, TError> }

export function useGetSpaceById<TData = Awaited<ReturnType<typeof getSpaceById>>, TError = ErrorType<void>>(
 spaceId: string, options?: { query?:Partial<UseQueryOptions<Awaited<ReturnType<typeof getSpaceById>>, TError, TData>>, request?: SecondParameter<typeof customInstance>}
 , queryClient?: QueryClient
  ):  UseQueryResult<TData, TError> & { queryKey: DataTag<QueryKey, TData, TError> }

/**
 * @summary 공간 상세 조회
 */

export function useGetSpaceById<TData = Awaited<ReturnType<typeof getSpaceById>>, TError = ErrorType<void>>(
 spaceId: string, options?: { query?:Partial<UseQueryOptions<Awaited<ReturnType<typeof getSpaceById>>, TError, TData>>, request?: SecondParameter<typeof customInstance>}
 , queryClient?: QueryClient 
 ):  UseQueryResult<TData, TError> & { queryKey: DataTag<QueryKey, TData, TError> } {

  const queryOptions = getGetSpaceByIdQueryOptions(spaceId,options)

  const query = useQuery(queryOptions, queryClient) as  UseQueryResult<TData, TError> & { queryKey: DataTag<QueryKey, TData, TError> };

  query.queryKey = queryOptions.queryKey ;

  return query;
}

/**
 * @summary 공간 상세 조회
 */
export const prefetchGetSpaceByIdQuery = async <TData = Awaited<ReturnType<typeof getSpaceById>>, TError = ErrorType<void>>(
 queryClient: QueryClient, spaceId: string, options?: { query?:Partial<UseQueryOptions<Awaited<ReturnType<typeof getSpaceById>>, TError, TData>>, request?: SecondParameter<typeof customInstance>}

  ): Promise<QueryClient> => {

  const queryOptions = getGetSpaceByIdQueryOptions(spaceId,options)

  await queryClient.prefetchQuery(queryOptions);

  return queryClient;
}

export const getGetSpaceByIdSuspenseQueryOptions = <TData = Awaited<ReturnType<typeof getSpaceById>>, TError = ErrorType<void>>(spaceId: string, options?: { query?:Partial<UseSuspenseQueryOptions<Awaited<ReturnType<typeof getSpaceById>>, TError, TData>>, request?: SecondParameter<typeof customInstance>}
) => {

const {query: queryOptions, request: requestOptions} = options ?? {};

  const queryKey =  queryOptions?.queryKey ?? getGetSpaceByIdQueryKey(spaceId);

  

    const queryFn: QueryFunction<Awaited<ReturnType<typeof getSpaceById>>> = ({ signal }) => getSpaceById(spaceId, requestOptions, signal);

      

      

   return  { queryKey, queryFn, ...queryOptions} as UseSuspenseQueryOptions<Awaited<ReturnType<typeof getSpaceById>>, TError, TData> & { queryKey: DataTag<QueryKey, TData, TError> }
}

export type GetSpaceByIdSuspenseQueryResult = NonNullable<Awaited<ReturnType<typeof getSpaceById>>>

export type GetSpaceByIdSuspenseQueryError = ErrorType<void>

export function useGetSpaceByIdSuspense<TData = Awaited<ReturnType<typeof getSpaceById>>, TError = ErrorType<void>>(
 spaceId: string, options: { query:Partial<UseSuspenseQueryOptions<Awaited<ReturnType<typeof getSpaceById>>, TError, TData>>, request?: SecondParameter<typeof customInstance>}
 , queryClient?: QueryClient
  ):  UseSuspenseQueryResult<TData, TError> & { queryKey: DataTag<QueryKey, TData, TError> }

export function useGetSpaceByIdSuspense<TData = Awaited<ReturnType<typeof getSpaceById>>, TError = ErrorType<void>>(
 spaceId: string, options?: { query?:Partial<UseSuspenseQueryOptions<Awaited<ReturnType<typeof getSpaceById>>, TError, TData>>, request?: SecondParameter<typeof customInstance>}
 , queryClient?: QueryClient
  ):  UseSuspenseQueryResult<TData, TError> & { queryKey: DataTag<QueryKey, TData, TError> }

export function useGetSpaceByIdSuspense<TData = Awaited<ReturnType<typeof getSpaceById>>, TError = ErrorType<void>>(
 spaceId: string, options?: { query?:Partial<UseSuspenseQueryOptions<Awaited<ReturnType<typeof getSpaceById>>, TError, TData>>, request?: SecondParameter<typeof customInstance>}
 , queryClient?: QueryClient
  ):  UseSuspenseQueryResult<TData, TError> & { queryKey: DataTag<QueryKey, TData, TError> }

/**
 * @summary 공간 상세 조회
 */

export function useGetSpaceByIdSuspense<TData = Awaited<ReturnType<typeof getSpaceById>>, TError = ErrorType<void>>(
 spaceId: string, options?: { query?:Partial<UseSuspenseQueryOptions<Awaited<ReturnType<typeof getSpaceById>>, TError, TData>>, request?: SecondParameter<typeof customInstance>}
 , queryClient?: QueryClient 
 ):  UseSuspenseQueryResult<TData, TError> & { queryKey: DataTag<QueryKey, TData, TError> } {

  const queryOptions = getGetSpaceByIdSuspenseQueryOptions(spaceId,options)

  const query = useSuspenseQuery(queryOptions, queryClient) as  UseSuspenseQueryResult<TData, TError> & { queryKey: DataTag<QueryKey, TData, TError> };

  query.queryKey = queryOptions.queryKey ;

  return query;
}

export const getGetSpaceByIdSuspenseInfiniteQueryOptions = <TData = InfiniteData<Awaited<ReturnType<typeof getSpaceById>>>, TError = ErrorType<void>>(spaceId: string, options?: { query?:Partial<UseSuspenseInfiniteQueryOptions<Awaited<ReturnType<typeof getSpaceById>>, TError, TData>>, request?: SecondParameter<typeof customInstance>}
) => {

const {query: queryOptions, request: requestOptions} = options ?? {};

  const queryKey =  queryOptions?.queryKey ?? getGetSpaceByIdInfiniteQueryKey(spaceId);

  

    const queryFn: QueryFunction<Awaited<ReturnType<typeof getSpaceById>>> = ({ signal }) => getSpaceById(spaceId, requestOptions, signal);

      

      

   return  { queryKey, queryFn, ...queryOptions} as UseSuspenseInfiniteQueryOptions<Awaited<ReturnType<typeof getSpaceById>>, TError, TData> & { queryKey: DataTag<QueryKey, TData, TError> }
}

export type GetSpaceByIdSuspenseInfiniteQueryResult = NonNullable<Awaited<ReturnType<typeof getSpaceById>>>

export type GetSpaceByIdSuspenseInfiniteQueryError = ErrorType<void>

export function useGetSpaceByIdSuspenseInfinite<TData = InfiniteData<Awaited<ReturnType<typeof getSpaceById>>>, TError = ErrorType<void>>(
 spaceId: string, options: { query:Partial<UseSuspenseInfiniteQueryOptions<Awaited<ReturnType<typeof getSpaceById>>, TError, TData>>, request?: SecondParameter<typeof customInstance>}
 , queryClient?: QueryClient
  ):  UseSuspenseInfiniteQueryResult<TData, TError> & { queryKey: DataTag<QueryKey, TData, TError> }

export function useGetSpaceByIdSuspenseInfinite<TData = InfiniteData<Awaited<ReturnType<typeof getSpaceById>>>, TError = ErrorType<void>>(
 spaceId: string, options?: { query?:Partial<UseSuspenseInfiniteQueryOptions<Awaited<ReturnType<typeof getSpaceById>>, TError, TData>>, request?: SecondParameter<typeof customInstance>}
 , queryClient?: QueryClient
  ):  UseSuspenseInfiniteQueryResult<TData, TError> & { queryKey: DataTag<QueryKey, TData, TError> }

export function useGetSpaceByIdSuspenseInfinite<TData = InfiniteData<Awaited<ReturnType<typeof getSpaceById>>>, TError = ErrorType<void>>(
 spaceId: string, options?: { query?:Partial<UseSuspenseInfiniteQueryOptions<Awaited<ReturnType<typeof getSpaceById>>, TError, TData>>, request?: SecondParameter<typeof customInstance>}
 , queryClient?: QueryClient
  ):  UseSuspenseInfiniteQueryResult<TData, TError> & { queryKey: DataTag<QueryKey, TData, TError> }

/**
 * @summary 공간 상세 조회
 */

export function useGetSpaceByIdSuspenseInfinite<TData = InfiniteData<Awaited<ReturnType<typeof getSpaceById>>>, TError = ErrorType<void>>(
 spaceId: string, options?: { query?:Partial<UseSuspenseInfiniteQueryOptions<Awaited<ReturnType<typeof getSpaceById>>, TError, TData>>, request?: SecondParameter<typeof customInstance>}
 , queryClient?: QueryClient 
 ):  UseSuspenseInfiniteQueryResult<TData, TError> & { queryKey: DataTag<QueryKey, TData, TError> } {

  const queryOptions = getGetSpaceByIdSuspenseInfiniteQueryOptions(spaceId,options)

  const query = useSuspenseInfiniteQuery(queryOptions, queryClient) as  UseSuspenseInfiniteQueryResult<TData, TError> & { queryKey: DataTag<QueryKey, TData, TError> };

  query.queryKey = queryOptions.queryKey ;

  return query;
}

/**
 * @summary 공간 상세 조회
 */
export const prefetchGetSpaceByIdInfiniteQuery = async <TData = Awaited<ReturnType<typeof getSpaceById>>, TError = ErrorType<void>>(
 queryClient: QueryClient, spaceId: string, options?: { query?:Partial<UseSuspenseInfiniteQueryOptions<Awaited<ReturnType<typeof getSpaceById>>, TError, TData>>, request?: SecondParameter<typeof customInstance>}

  ): Promise<QueryClient> => {

  const queryOptions = getGetSpaceByIdSuspenseInfiniteQueryOptions(spaceId,options)

  await queryClient.prefetchInfiniteQuery(queryOptions);

  return queryClient;
}

/**
 * Space root와 종속 Ground detail을 소프트 삭제합니다.
 * @summary 공간 삭제
 */
export const deleteSpace = (
    spaceId: string,
 options?: SecondParameter<typeof customInstance>,) => {
      
      
      return customInstance<unknown>(
      {url: `/api/v1/spaces/${spaceId}`, method: 'DELETE'
    },
      options);
    }

export const getDeleteSpaceMutationOptions = <TError = ErrorType<void>,
    TContext = unknown>(options?: { mutation?:UseMutationOptions<Awaited<ReturnType<typeof deleteSpace>>, TError,{spaceId: string}, TContext>, request?: SecondParameter<typeof customInstance>}
): UseMutationOptions<Awaited<ReturnType<typeof deleteSpace>>, TError,{spaceId: string}, TContext> => {

const mutationKey = ['deleteSpace'];
const {mutation: mutationOptions, request: requestOptions} = options ?
      options.mutation && 'mutationKey' in options.mutation && options.mutation.mutationKey ?
      options
      : {...options, mutation: {...options.mutation, mutationKey}}
      : {mutation: { mutationKey, }, request: undefined};

      


      const mutationFn: MutationFunction<Awaited<ReturnType<typeof deleteSpace>>, {spaceId: string}> = (props) => {
          const {spaceId} = props ?? {};

          return  deleteSpace(spaceId,requestOptions)
        }

        


  return  { mutationFn, ...mutationOptions }}

export type DeleteSpaceMutationResult = NonNullable<Awaited<ReturnType<typeof deleteSpace>>>

export type DeleteSpaceMutationError = ErrorType<void>

/**
 * @summary 공간 삭제
 */
export const useDeleteSpace = <TError = ErrorType<void>,
    TContext = unknown>(options?: { mutation?:UseMutationOptions<Awaited<ReturnType<typeof deleteSpace>>, TError,{spaceId: string}, TContext>, request?: SecondParameter<typeof customInstance>}
 , queryClient?: QueryClient): UseMutationResult<
        Awaited<ReturnType<typeof deleteSpace>>,
        TError,
        {spaceId: string},
        TContext
      > => {

      const mutationOptions = getDeleteSpaceMutationOptions(options);

      return useMutation(mutationOptions, queryClient);
    }

/**
 * Space에 종속된 1:1 Ground detail을 조회합니다.
 * @summary 공간의 시설 detail 조회
 */
export const getSpaceGround = (
    spaceId: string,
 options?: SecondParameter<typeof customInstance>,signal?: AbortSignal
) => {
      
      
      return customInstance<GetSpaceGround200AllOf>(
      {url: `/api/v1/spaces/${spaceId}/ground`, method: 'GET', signal
    },
      options);
    }

export const getGetSpaceGroundQueryKey = (spaceId?: string,) => {
    return [
    `/api/v1/spaces/${spaceId}/ground`
    ] as const;
    }

export const getGetSpaceGroundInfiniteQueryKey = (spaceId?: string,) => {
    return [
    'infinite', `/api/v1/spaces/${spaceId}/ground`
    ] as const;
    }

export const getGetSpaceGroundQueryOptions = <TData = Awaited<ReturnType<typeof getSpaceGround>>, TError = ErrorType<void>>(spaceId: string, options?: { query?:Partial<UseQueryOptions<Awaited<ReturnType<typeof getSpaceGround>>, TError, TData>>, request?: SecondParameter<typeof customInstance>}
) => {

const {query: queryOptions, request: requestOptions} = options ?? {};

  const queryKey =  queryOptions?.queryKey ?? getGetSpaceGroundQueryKey(spaceId);

  

    const queryFn: QueryFunction<Awaited<ReturnType<typeof getSpaceGround>>> = ({ signal }) => getSpaceGround(spaceId, requestOptions, signal);

      

      

   return  { queryKey, queryFn, enabled: !!(spaceId), ...queryOptions} as UseQueryOptions<Awaited<ReturnType<typeof getSpaceGround>>, TError, TData> & { queryKey: DataTag<QueryKey, TData, TError> }
}

export type GetSpaceGroundQueryResult = NonNullable<Awaited<ReturnType<typeof getSpaceGround>>>

export type GetSpaceGroundQueryError = ErrorType<void>

export function useGetSpaceGround<TData = Awaited<ReturnType<typeof getSpaceGround>>, TError = ErrorType<void>>(
 spaceId: string, options: { query:Partial<UseQueryOptions<Awaited<ReturnType<typeof getSpaceGround>>, TError, TData>> & Pick<
        DefinedInitialDataOptions<
          Awaited<ReturnType<typeof getSpaceGround>>,
          TError,
          Awaited<ReturnType<typeof getSpaceGround>>
        > , 'initialData'
      >, request?: SecondParameter<typeof customInstance>}
 , queryClient?: QueryClient
  ):  DefinedUseQueryResult<TData, TError> & { queryKey: DataTag<QueryKey, TData, TError> }

export function useGetSpaceGround<TData = Awaited<ReturnType<typeof getSpaceGround>>, TError = ErrorType<void>>(
 spaceId: string, options?: { query?:Partial<UseQueryOptions<Awaited<ReturnType<typeof getSpaceGround>>, TError, TData>> & Pick<
        UndefinedInitialDataOptions<
          Awaited<ReturnType<typeof getSpaceGround>>,
          TError,
          Awaited<ReturnType<typeof getSpaceGround>>
        > , 'initialData'
      >, request?: SecondParameter<typeof customInstance>}
 , queryClient?: QueryClient
  ):  UseQueryResult<TData, TError> & { queryKey: DataTag<QueryKey, TData, TError> }

export function useGetSpaceGround<TData = Awaited<ReturnType<typeof getSpaceGround>>, TError = ErrorType<void>>(
 spaceId: string, options?: { query?:Partial<UseQueryOptions<Awaited<ReturnType<typeof getSpaceGround>>, TError, TData>>, request?: SecondParameter<typeof customInstance>}
 , queryClient?: QueryClient
  ):  UseQueryResult<TData, TError> & { queryKey: DataTag<QueryKey, TData, TError> }

/**
 * @summary 공간의 시설 detail 조회
 */

export function useGetSpaceGround<TData = Awaited<ReturnType<typeof getSpaceGround>>, TError = ErrorType<void>>(
 spaceId: string, options?: { query?:Partial<UseQueryOptions<Awaited<ReturnType<typeof getSpaceGround>>, TError, TData>>, request?: SecondParameter<typeof customInstance>}
 , queryClient?: QueryClient 
 ):  UseQueryResult<TData, TError> & { queryKey: DataTag<QueryKey, TData, TError> } {

  const queryOptions = getGetSpaceGroundQueryOptions(spaceId,options)

  const query = useQuery(queryOptions, queryClient) as  UseQueryResult<TData, TError> & { queryKey: DataTag<QueryKey, TData, TError> };

  query.queryKey = queryOptions.queryKey ;

  return query;
}

/**
 * @summary 공간의 시설 detail 조회
 */
export const prefetchGetSpaceGroundQuery = async <TData = Awaited<ReturnType<typeof getSpaceGround>>, TError = ErrorType<void>>(
 queryClient: QueryClient, spaceId: string, options?: { query?:Partial<UseQueryOptions<Awaited<ReturnType<typeof getSpaceGround>>, TError, TData>>, request?: SecondParameter<typeof customInstance>}

  ): Promise<QueryClient> => {

  const queryOptions = getGetSpaceGroundQueryOptions(spaceId,options)

  await queryClient.prefetchQuery(queryOptions);

  return queryClient;
}

export const getGetSpaceGroundSuspenseQueryOptions = <TData = Awaited<ReturnType<typeof getSpaceGround>>, TError = ErrorType<void>>(spaceId: string, options?: { query?:Partial<UseSuspenseQueryOptions<Awaited<ReturnType<typeof getSpaceGround>>, TError, TData>>, request?: SecondParameter<typeof customInstance>}
) => {

const {query: queryOptions, request: requestOptions} = options ?? {};

  const queryKey =  queryOptions?.queryKey ?? getGetSpaceGroundQueryKey(spaceId);

  

    const queryFn: QueryFunction<Awaited<ReturnType<typeof getSpaceGround>>> = ({ signal }) => getSpaceGround(spaceId, requestOptions, signal);

      

      

   return  { queryKey, queryFn, ...queryOptions} as UseSuspenseQueryOptions<Awaited<ReturnType<typeof getSpaceGround>>, TError, TData> & { queryKey: DataTag<QueryKey, TData, TError> }
}

export type GetSpaceGroundSuspenseQueryResult = NonNullable<Awaited<ReturnType<typeof getSpaceGround>>>

export type GetSpaceGroundSuspenseQueryError = ErrorType<void>

export function useGetSpaceGroundSuspense<TData = Awaited<ReturnType<typeof getSpaceGround>>, TError = ErrorType<void>>(
 spaceId: string, options: { query:Partial<UseSuspenseQueryOptions<Awaited<ReturnType<typeof getSpaceGround>>, TError, TData>>, request?: SecondParameter<typeof customInstance>}
 , queryClient?: QueryClient
  ):  UseSuspenseQueryResult<TData, TError> & { queryKey: DataTag<QueryKey, TData, TError> }

export function useGetSpaceGroundSuspense<TData = Awaited<ReturnType<typeof getSpaceGround>>, TError = ErrorType<void>>(
 spaceId: string, options?: { query?:Partial<UseSuspenseQueryOptions<Awaited<ReturnType<typeof getSpaceGround>>, TError, TData>>, request?: SecondParameter<typeof customInstance>}
 , queryClient?: QueryClient
  ):  UseSuspenseQueryResult<TData, TError> & { queryKey: DataTag<QueryKey, TData, TError> }

export function useGetSpaceGroundSuspense<TData = Awaited<ReturnType<typeof getSpaceGround>>, TError = ErrorType<void>>(
 spaceId: string, options?: { query?:Partial<UseSuspenseQueryOptions<Awaited<ReturnType<typeof getSpaceGround>>, TError, TData>>, request?: SecondParameter<typeof customInstance>}
 , queryClient?: QueryClient
  ):  UseSuspenseQueryResult<TData, TError> & { queryKey: DataTag<QueryKey, TData, TError> }

/**
 * @summary 공간의 시설 detail 조회
 */

export function useGetSpaceGroundSuspense<TData = Awaited<ReturnType<typeof getSpaceGround>>, TError = ErrorType<void>>(
 spaceId: string, options?: { query?:Partial<UseSuspenseQueryOptions<Awaited<ReturnType<typeof getSpaceGround>>, TError, TData>>, request?: SecondParameter<typeof customInstance>}
 , queryClient?: QueryClient 
 ):  UseSuspenseQueryResult<TData, TError> & { queryKey: DataTag<QueryKey, TData, TError> } {

  const queryOptions = getGetSpaceGroundSuspenseQueryOptions(spaceId,options)

  const query = useSuspenseQuery(queryOptions, queryClient) as  UseSuspenseQueryResult<TData, TError> & { queryKey: DataTag<QueryKey, TData, TError> };

  query.queryKey = queryOptions.queryKey ;

  return query;
}

export const getGetSpaceGroundSuspenseInfiniteQueryOptions = <TData = InfiniteData<Awaited<ReturnType<typeof getSpaceGround>>>, TError = ErrorType<void>>(spaceId: string, options?: { query?:Partial<UseSuspenseInfiniteQueryOptions<Awaited<ReturnType<typeof getSpaceGround>>, TError, TData>>, request?: SecondParameter<typeof customInstance>}
) => {

const {query: queryOptions, request: requestOptions} = options ?? {};

  const queryKey =  queryOptions?.queryKey ?? getGetSpaceGroundInfiniteQueryKey(spaceId);

  

    const queryFn: QueryFunction<Awaited<ReturnType<typeof getSpaceGround>>> = ({ signal }) => getSpaceGround(spaceId, requestOptions, signal);

      

      

   return  { queryKey, queryFn, ...queryOptions} as UseSuspenseInfiniteQueryOptions<Awaited<ReturnType<typeof getSpaceGround>>, TError, TData> & { queryKey: DataTag<QueryKey, TData, TError> }
}

export type GetSpaceGroundSuspenseInfiniteQueryResult = NonNullable<Awaited<ReturnType<typeof getSpaceGround>>>

export type GetSpaceGroundSuspenseInfiniteQueryError = ErrorType<void>

export function useGetSpaceGroundSuspenseInfinite<TData = InfiniteData<Awaited<ReturnType<typeof getSpaceGround>>>, TError = ErrorType<void>>(
 spaceId: string, options: { query:Partial<UseSuspenseInfiniteQueryOptions<Awaited<ReturnType<typeof getSpaceGround>>, TError, TData>>, request?: SecondParameter<typeof customInstance>}
 , queryClient?: QueryClient
  ):  UseSuspenseInfiniteQueryResult<TData, TError> & { queryKey: DataTag<QueryKey, TData, TError> }

export function useGetSpaceGroundSuspenseInfinite<TData = InfiniteData<Awaited<ReturnType<typeof getSpaceGround>>>, TError = ErrorType<void>>(
 spaceId: string, options?: { query?:Partial<UseSuspenseInfiniteQueryOptions<Awaited<ReturnType<typeof getSpaceGround>>, TError, TData>>, request?: SecondParameter<typeof customInstance>}
 , queryClient?: QueryClient
  ):  UseSuspenseInfiniteQueryResult<TData, TError> & { queryKey: DataTag<QueryKey, TData, TError> }

export function useGetSpaceGroundSuspenseInfinite<TData = InfiniteData<Awaited<ReturnType<typeof getSpaceGround>>>, TError = ErrorType<void>>(
 spaceId: string, options?: { query?:Partial<UseSuspenseInfiniteQueryOptions<Awaited<ReturnType<typeof getSpaceGround>>, TError, TData>>, request?: SecondParameter<typeof customInstance>}
 , queryClient?: QueryClient
  ):  UseSuspenseInfiniteQueryResult<TData, TError> & { queryKey: DataTag<QueryKey, TData, TError> }

/**
 * @summary 공간의 시설 detail 조회
 */

export function useGetSpaceGroundSuspenseInfinite<TData = InfiniteData<Awaited<ReturnType<typeof getSpaceGround>>>, TError = ErrorType<void>>(
 spaceId: string, options?: { query?:Partial<UseSuspenseInfiniteQueryOptions<Awaited<ReturnType<typeof getSpaceGround>>, TError, TData>>, request?: SecondParameter<typeof customInstance>}
 , queryClient?: QueryClient 
 ):  UseSuspenseInfiniteQueryResult<TData, TError> & { queryKey: DataTag<QueryKey, TData, TError> } {

  const queryOptions = getGetSpaceGroundSuspenseInfiniteQueryOptions(spaceId,options)

  const query = useSuspenseInfiniteQuery(queryOptions, queryClient) as  UseSuspenseInfiniteQueryResult<TData, TError> & { queryKey: DataTag<QueryKey, TData, TError> };

  query.queryKey = queryOptions.queryKey ;

  return query;
}

/**
 * @summary 공간의 시설 detail 조회
 */
export const prefetchGetSpaceGroundInfiniteQuery = async <TData = Awaited<ReturnType<typeof getSpaceGround>>, TError = ErrorType<void>>(
 queryClient: QueryClient, spaceId: string, options?: { query?:Partial<UseSuspenseInfiniteQueryOptions<Awaited<ReturnType<typeof getSpaceGround>>, TError, TData>>, request?: SecondParameter<typeof customInstance>}

  ): Promise<QueryClient> => {

  const queryOptions = getGetSpaceGroundSuspenseInfiniteQueryOptions(spaceId,options)

  await queryClient.prefetchInfiniteQuery(queryOptions);

  return queryClient;
}

/**
 * Space에 종속된 1:1 Ground detail을 수정합니다.
 * @summary 공간의 시설 detail 수정
 */
export const updateSpaceGround = (
    spaceId: string,
    updateGroundDto: BodyType<UpdateGroundDto>,
 options?: SecondParameter<typeof customInstance>,) => {
      
      
      return customInstance<UpdateSpaceGround200AllOf>(
      {url: `/api/v1/spaces/${spaceId}/ground`, method: 'PATCH',
      headers: {'Content-Type': 'application/json', },
      data: updateGroundDto
    },
      options);
    }

export const getUpdateSpaceGroundMutationOptions = <TError = ErrorType<void>,
    TContext = unknown>(options?: { mutation?:UseMutationOptions<Awaited<ReturnType<typeof updateSpaceGround>>, TError,{spaceId: string;data: BodyType<UpdateGroundDto>}, TContext>, request?: SecondParameter<typeof customInstance>}
): UseMutationOptions<Awaited<ReturnType<typeof updateSpaceGround>>, TError,{spaceId: string;data: BodyType<UpdateGroundDto>}, TContext> => {

const mutationKey = ['updateSpaceGround'];
const {mutation: mutationOptions, request: requestOptions} = options ?
      options.mutation && 'mutationKey' in options.mutation && options.mutation.mutationKey ?
      options
      : {...options, mutation: {...options.mutation, mutationKey}}
      : {mutation: { mutationKey, }, request: undefined};

      


      const mutationFn: MutationFunction<Awaited<ReturnType<typeof updateSpaceGround>>, {spaceId: string;data: BodyType<UpdateGroundDto>}> = (props) => {
          const {spaceId,data} = props ?? {};

          return  updateSpaceGround(spaceId,data,requestOptions)
        }

        


  return  { mutationFn, ...mutationOptions }}

export type UpdateSpaceGroundMutationResult = NonNullable<Awaited<ReturnType<typeof updateSpaceGround>>>

export type UpdateSpaceGroundMutationBody = BodyType<UpdateGroundDto>

export type UpdateSpaceGroundMutationError = ErrorType<void>

/**
 * @summary 공간의 시설 detail 수정
 */
export const useUpdateSpaceGround = <TError = ErrorType<void>,
    TContext = unknown>(options?: { mutation?:UseMutationOptions<Awaited<ReturnType<typeof updateSpaceGround>>, TError,{spaceId: string;data: BodyType<UpdateGroundDto>}, TContext>, request?: SecondParameter<typeof customInstance>}
 , queryClient?: QueryClient): UseMutationResult<
        Awaited<ReturnType<typeof updateSpaceGround>>,
        TError,
        {spaceId: string;data: BodyType<UpdateGroundDto>},
        TContext
      > => {

      const mutationOptions = getUpdateSpaceGroundMutationOptions(options);

      return useMutation(mutationOptions, queryClient);
    }
