// generated with @7nohe/openapi-react-query-codegen@0.5.3 
import { useQuery, useMutation, UseQueryResult, UseQueryOptions, UseMutationOptions, UseMutationResult } from "@tanstack/react-query";
import { UpdateTenantDto } from "../requests/models/UpdateTenantDto";
import { UpdateProfileDto } from "../requests/models/UpdateProfileDto";
import { ProfileDto } from "../requests/models/ProfileDto";
import { CreateUserSignUpDto } from "../requests/models/CreateUserSignUpDto";
import { CreateTenantDto } from "../requests/models/CreateTenantDto";
import { ProfilesService } from "../requests/services/ProfilesService";
import { DefaultService } from "../requests/services/DefaultService";
import { AuthService } from "../requests/services/AuthService";
export type ProfilesServiceFindAllDefaultResponse = Awaited<ReturnType<typeof ProfilesService.findAll>>;
export type ProfilesServiceFindAllQueryResult<TData = ProfilesServiceFindAllDefaultResponse, TError = unknown> = UseQueryResult<TData, TError>;
export const useProfilesServiceFindAllKey = "ProfilesServiceFindAll";
export const useProfilesServiceFindAll = <TData = ProfilesServiceFindAllDefaultResponse, TError = unknown, TQueryKey extends Array<unknown> = unknown[]>(queryKey?: TQueryKey, options?: Omit<UseQueryOptions<TData, TError>, "queryKey" | "queryFn" | "initialData">) => useQuery<TData, TError>({ queryKey: [useProfilesServiceFindAllKey, ...(queryKey ?? [])], queryFn: () => ProfilesService.findAll() as TData, ...options });
export type ProfilesServiceFindOneDefaultResponse = Awaited<ReturnType<typeof ProfilesService.findOne>>;
export type ProfilesServiceFindOneQueryResult<TData = ProfilesServiceFindOneDefaultResponse, TError = unknown> = UseQueryResult<TData, TError>;
export const useProfilesServiceFindOneKey = "ProfilesServiceFindOne";
export const useProfilesServiceFindOne = <TData = ProfilesServiceFindOneDefaultResponse, TError = unknown, TQueryKey extends Array<unknown> = unknown[]>({ id }: {
    id: string;
}, queryKey?: TQueryKey, options?: Omit<UseQueryOptions<TData, TError>, "queryKey" | "queryFn" | "initialData">) => useQuery<TData, TError>({ queryKey: [useProfilesServiceFindOneKey, ...(queryKey ?? [{ id }])], queryFn: () => ProfilesService.findOne(id) as TData, ...options });
export type ProfilesServiceUpdateMutationResult = Awaited<ReturnType<typeof ProfilesService.update>>;
export const useProfilesServiceUpdate = <TData = ProfilesServiceUpdateMutationResult, TError = unknown, TContext = unknown>(options?: Omit<UseMutationOptions<TData, TError, {
    id: string;
    requestBody: UpdateProfileDto;
}, TContext>, "mutationFn">) => useMutation<TData, TError, {
    id: string;
    requestBody: UpdateProfileDto;
}, TContext>({ mutationFn: ({ id, requestBody }) => ProfilesService.update(id, requestBody) as unknown as Promise<TData>, ...options });
export type ProfilesServiceRemoveMutationResult = Awaited<ReturnType<typeof ProfilesService.remove>>;
export const useProfilesServiceRemove = <TData = ProfilesServiceRemoveMutationResult, TError = unknown, TContext = unknown>(options?: Omit<UseMutationOptions<TData, TError, {
    id: string;
}, TContext>, "mutationFn">) => useMutation<TData, TError, {
    id: string;
}, TContext>({ mutationFn: ({ id }) => ProfilesService.remove(id) as unknown as Promise<TData>, ...options });
export type DefaultServiceCreateMutationResult = Awaited<ReturnType<typeof DefaultService.create>>;
export const useDefaultServiceCreate = <TData = DefaultServiceCreateMutationResult, TError = unknown, TContext = unknown>(options?: Omit<UseMutationOptions<TData, TError, {
    requestBody: CreateTenantDto;
}, TContext>, "mutationFn">) => useMutation<TData, TError, {
    requestBody: CreateTenantDto;
}, TContext>({ mutationFn: ({ requestBody }) => DefaultService.create(requestBody) as unknown as Promise<TData>, ...options });
export type DefaultServiceFindAllDefaultResponse = Awaited<ReturnType<typeof DefaultService.findAll>>;
export type DefaultServiceFindAllQueryResult<TData = DefaultServiceFindAllDefaultResponse, TError = unknown> = UseQueryResult<TData, TError>;
export const useDefaultServiceFindAllKey = "DefaultServiceFindAll";
export const useDefaultServiceFindAll = <TData = DefaultServiceFindAllDefaultResponse, TError = unknown, TQueryKey extends Array<unknown> = unknown[]>(queryKey?: TQueryKey, options?: Omit<UseQueryOptions<TData, TError>, "queryKey" | "queryFn" | "initialData">) => useQuery<TData, TError>({ queryKey: [useDefaultServiceFindAllKey, ...(queryKey ?? [])], queryFn: () => DefaultService.findAll() as TData, ...options });
export type DefaultServiceFindOneDefaultResponse = Awaited<ReturnType<typeof DefaultService.findOne>>;
export type DefaultServiceFindOneQueryResult<TData = DefaultServiceFindOneDefaultResponse, TError = unknown> = UseQueryResult<TData, TError>;
export const useDefaultServiceFindOneKey = "DefaultServiceFindOne";
export const useDefaultServiceFindOne = <TData = DefaultServiceFindOneDefaultResponse, TError = unknown, TQueryKey extends Array<unknown> = unknown[]>({ id }: {
    id: string;
}, queryKey?: TQueryKey, options?: Omit<UseQueryOptions<TData, TError>, "queryKey" | "queryFn" | "initialData">) => useQuery<TData, TError>({ queryKey: [useDefaultServiceFindOneKey, ...(queryKey ?? [{ id }])], queryFn: () => DefaultService.findOne(id) as TData, ...options });
export type DefaultServiceUpdateMutationResult = Awaited<ReturnType<typeof DefaultService.update>>;
export const useDefaultServiceUpdate = <TData = DefaultServiceUpdateMutationResult, TError = unknown, TContext = unknown>(options?: Omit<UseMutationOptions<TData, TError, {
    id: string;
    requestBody: UpdateTenantDto;
}, TContext>, "mutationFn">) => useMutation<TData, TError, {
    id: string;
    requestBody: UpdateTenantDto;
}, TContext>({ mutationFn: ({ id, requestBody }) => DefaultService.update(id, requestBody) as unknown as Promise<TData>, ...options });
export type DefaultServiceRemoveMutationResult = Awaited<ReturnType<typeof DefaultService.remove>>;
export const useDefaultServiceRemove = <TData = DefaultServiceRemoveMutationResult, TError = unknown, TContext = unknown>(options?: Omit<UseMutationOptions<TData, TError, {
    id: string;
}, TContext>, "mutationFn">) => useMutation<TData, TError, {
    id: string;
}, TContext>({ mutationFn: ({ id }) => DefaultService.remove(id) as unknown as Promise<TData>, ...options });
export type AuthServiceLoginMutationResult = Awaited<ReturnType<typeof AuthService.login>>;
export const useAuthServiceLogin = <TData = AuthServiceLoginMutationResult, TError = unknown, TContext = unknown>(options?: Omit<UseMutationOptions<TData, TError, void, TContext>, "mutationFn">) => useMutation<TData, TError, void, TContext>({ mutationFn: () => AuthService.login() as unknown as Promise<TData>, ...options });
export type AuthServiceGetProfileDefaultResponse = Awaited<ReturnType<typeof AuthService.getProfile>>;
export type AuthServiceGetProfileQueryResult<TData = AuthServiceGetProfileDefaultResponse, TError = unknown> = UseQueryResult<TData, TError>;
export const useAuthServiceGetProfileKey = "AuthServiceGetProfile";
export const useAuthServiceGetProfile = <TData = AuthServiceGetProfileDefaultResponse, TError = unknown, TQueryKey extends Array<unknown> = unknown[]>(queryKey?: TQueryKey, options?: Omit<UseQueryOptions<TData, TError>, "queryKey" | "queryFn" | "initialData">) => useQuery<TData, TError>({ queryKey: [useAuthServiceGetProfileKey, ...(queryKey ?? [])], queryFn: () => AuthService.getProfile() as TData, ...options });
export type AuthServiceSignUpUserMutationResult = Awaited<ReturnType<typeof AuthService.signUpUser>>;
export const useAuthServiceSignUpUser = <TData = AuthServiceSignUpUserMutationResult, TError = unknown, TContext = unknown>(options?: Omit<UseMutationOptions<TData, TError, {
    requestBody: CreateUserSignUpDto;
}, TContext>, "mutationFn">) => useMutation<TData, TError, {
    requestBody: CreateUserSignUpDto;
}, TContext>({ mutationFn: ({ requestBody }) => AuthService.signUpUser(requestBody) as unknown as Promise<TData>, ...options });
