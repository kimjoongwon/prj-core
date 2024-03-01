// generated with @7nohe/openapi-react-query-codegen@0.5.3 
import { useQuery, useMutation, UseQueryResult, UseQueryOptions, UseMutationOptions, UseMutationResult } from "@tanstack/react-query";
import { DefaultService } from "../requests/services/DefaultService";
export type DefaultServiceLoginMutationResult = Awaited<ReturnType<typeof DefaultService.login>>;
export const useDefaultServiceLogin = <TData = DefaultServiceLoginMutationResult, TError = unknown, TContext = unknown>(options?: Omit<UseMutationOptions<TData, TError, void, TContext>, "mutationFn">) => useMutation<TData, TError, void, TContext>({ mutationFn: () => DefaultService.login() as unknown as Promise<TData>, ...options });
export type DefaultServiceGetProfileDefaultResponse = Awaited<ReturnType<typeof DefaultService.getProfile>>;
export type DefaultServiceGetProfileQueryResult<TData = DefaultServiceGetProfileDefaultResponse, TError = unknown> = UseQueryResult<TData, TError>;
export const useDefaultServiceGetProfileKey = "DefaultServiceGetProfile";
export const useDefaultServiceGetProfile = <TData = DefaultServiceGetProfileDefaultResponse, TError = unknown, TQueryKey extends Array<unknown> = unknown[]>(queryKey?: TQueryKey, options?: Omit<UseQueryOptions<TData, TError>, "queryKey" | "queryFn" | "initialData">) => useQuery<TData, TError>({ queryKey: [useDefaultServiceGetProfileKey, ...(queryKey ?? [])], queryFn: () => DefaultService.getProfile() as TData, ...options });
export type DefaultServiceFindAllDefaultResponse = Awaited<ReturnType<typeof DefaultService.findAll>>;
export type DefaultServiceFindAllQueryResult<TData = DefaultServiceFindAllDefaultResponse, TError = unknown> = UseQueryResult<TData, TError>;
export const useDefaultServiceFindAllKey = "DefaultServiceFindAll";
export const useDefaultServiceFindAll = <TData = DefaultServiceFindAllDefaultResponse, TError = unknown, TQueryKey extends Array<unknown> = unknown[]>(queryKey?: TQueryKey, options?: Omit<UseQueryOptions<TData, TError>, "queryKey" | "queryFn" | "initialData">) => useQuery<TData, TError>({ queryKey: [useDefaultServiceFindAllKey, ...(queryKey ?? [])], queryFn: () => DefaultService.findAll() as TData, ...options });
