// generated with @7nohe/openapi-react-query-codegen@0.5.3 
import { useQuery, useMutation, UseQueryResult, UseQueryOptions, UseMutationOptions, UseMutationResult } from "@tanstack/react-query";
import { UpdateUserDto } from "../requests/models/UpdateUserDto";
import { UpdateAuthzDto } from "../requests/models/UpdateAuthzDto";
import { TokenDto } from "../requests/models/TokenDto";
import { ProfileDto } from "../requests/models/ProfileDto";
import { MenuDto } from "../requests/models/MenuDto";
import { LoginPayloadDto } from "../requests/models/LoginPayloadDto";
import { CreateUserSignUpDto } from "../requests/models/CreateUserSignUpDto";
import { CreateUserDto } from "../requests/models/CreateUserDto";
import { CreateAuthzDto } from "../requests/models/CreateAuthzDto";
import { UserAbilitiesService } from "../requests/services/UserAbilitiesService";
import { AuthzService } from "../requests/services/AuthzService";
import { AuthService } from "../requests/services/AuthService";
import { AdminService } from "../requests/services/AdminService";
export type UserAbilitiesServiceCreateMutationResult = Awaited<ReturnType<typeof UserAbilitiesService.create>>;
export const useUserAbilitiesServiceCreate = <TData = UserAbilitiesServiceCreateMutationResult, TError = unknown, TContext = unknown>(options?: Omit<UseMutationOptions<TData, TError, {
    requestBody: CreateUserDto;
}, TContext>, "mutationFn">) => useMutation<TData, TError, {
    requestBody: CreateUserDto;
}, TContext>({ mutationFn: ({ requestBody }) => UserAbilitiesService.create(requestBody) as unknown as Promise<TData>, ...options });
export type UserAbilitiesServiceFindAllDefaultResponse = Awaited<ReturnType<typeof UserAbilitiesService.findAll>>;
export type UserAbilitiesServiceFindAllQueryResult<TData = UserAbilitiesServiceFindAllDefaultResponse, TError = unknown> = UseQueryResult<TData, TError>;
export const useUserAbilitiesServiceFindAllKey = "UserAbilitiesServiceFindAll";
export const useUserAbilitiesServiceFindAll = <TData = UserAbilitiesServiceFindAllDefaultResponse, TError = unknown, TQueryKey extends Array<unknown> = unknown[]>(queryKey?: TQueryKey, options?: Omit<UseQueryOptions<TData, TError>, "queryKey" | "queryFn" | "initialData">) => useQuery<TData, TError>({ queryKey: [useUserAbilitiesServiceFindAllKey, ...(queryKey ?? [])], queryFn: () => UserAbilitiesService.findAll() as TData, ...options });
export type UserAbilitiesServiceFindOneDefaultResponse = Awaited<ReturnType<typeof UserAbilitiesService.findOne>>;
export type UserAbilitiesServiceFindOneQueryResult<TData = UserAbilitiesServiceFindOneDefaultResponse, TError = unknown> = UseQueryResult<TData, TError>;
export const useUserAbilitiesServiceFindOneKey = "UserAbilitiesServiceFindOne";
export const useUserAbilitiesServiceFindOne = <TData = UserAbilitiesServiceFindOneDefaultResponse, TError = unknown, TQueryKey extends Array<unknown> = unknown[]>({ id }: {
    id: string;
}, queryKey?: TQueryKey, options?: Omit<UseQueryOptions<TData, TError>, "queryKey" | "queryFn" | "initialData">) => useQuery<TData, TError>({ queryKey: [useUserAbilitiesServiceFindOneKey, ...(queryKey ?? [{ id }])], queryFn: () => UserAbilitiesService.findOne(id) as TData, ...options });
export type UserAbilitiesServiceUpdateMutationResult = Awaited<ReturnType<typeof UserAbilitiesService.update>>;
export const useUserAbilitiesServiceUpdate = <TData = UserAbilitiesServiceUpdateMutationResult, TError = unknown, TContext = unknown>(options?: Omit<UseMutationOptions<TData, TError, {
    id: string;
    requestBody: UpdateUserDto;
}, TContext>, "mutationFn">) => useMutation<TData, TError, {
    id: string;
    requestBody: UpdateUserDto;
}, TContext>({ mutationFn: ({ id, requestBody }) => UserAbilitiesService.update(id, requestBody) as unknown as Promise<TData>, ...options });
export type UserAbilitiesServiceRemoveMutationResult = Awaited<ReturnType<typeof UserAbilitiesService.remove>>;
export const useUserAbilitiesServiceRemove = <TData = UserAbilitiesServiceRemoveMutationResult, TError = unknown, TContext = unknown>(options?: Omit<UseMutationOptions<TData, TError, {
    id: string;
}, TContext>, "mutationFn">) => useMutation<TData, TError, {
    id: string;
}, TContext>({ mutationFn: ({ id }) => UserAbilitiesService.remove(id) as unknown as Promise<TData>, ...options });
export type AuthzServiceCreateMutationResult = Awaited<ReturnType<typeof AuthzService.create>>;
export const useAuthzServiceCreate = <TData = AuthzServiceCreateMutationResult, TError = unknown, TContext = unknown>(options?: Omit<UseMutationOptions<TData, TError, {
    requestBody: CreateAuthzDto;
}, TContext>, "mutationFn">) => useMutation<TData, TError, {
    requestBody: CreateAuthzDto;
}, TContext>({ mutationFn: ({ requestBody }) => AuthzService.create(requestBody) as unknown as Promise<TData>, ...options });
export type AuthzServiceFindAllDefaultResponse = Awaited<ReturnType<typeof AuthzService.findAll>>;
export type AuthzServiceFindAllQueryResult<TData = AuthzServiceFindAllDefaultResponse, TError = unknown> = UseQueryResult<TData, TError>;
export const useAuthzServiceFindAllKey = "AuthzServiceFindAll";
export const useAuthzServiceFindAll = <TData = AuthzServiceFindAllDefaultResponse, TError = unknown, TQueryKey extends Array<unknown> = unknown[]>(queryKey?: TQueryKey, options?: Omit<UseQueryOptions<TData, TError>, "queryKey" | "queryFn" | "initialData">) => useQuery<TData, TError>({ queryKey: [useAuthzServiceFindAllKey, ...(queryKey ?? [])], queryFn: () => AuthzService.findAll() as TData, ...options });
export type AuthzServiceFindOneDefaultResponse = Awaited<ReturnType<typeof AuthzService.findOne>>;
export type AuthzServiceFindOneQueryResult<TData = AuthzServiceFindOneDefaultResponse, TError = unknown> = UseQueryResult<TData, TError>;
export const useAuthzServiceFindOneKey = "AuthzServiceFindOne";
export const useAuthzServiceFindOne = <TData = AuthzServiceFindOneDefaultResponse, TError = unknown, TQueryKey extends Array<unknown> = unknown[]>({ id }: {
    id: string;
}, queryKey?: TQueryKey, options?: Omit<UseQueryOptions<TData, TError>, "queryKey" | "queryFn" | "initialData">) => useQuery<TData, TError>({ queryKey: [useAuthzServiceFindOneKey, ...(queryKey ?? [{ id }])], queryFn: () => AuthzService.findOne(id) as TData, ...options });
export type AuthzServiceUpdateMutationResult = Awaited<ReturnType<typeof AuthzService.update>>;
export const useAuthzServiceUpdate = <TData = AuthzServiceUpdateMutationResult, TError = unknown, TContext = unknown>(options?: Omit<UseMutationOptions<TData, TError, {
    id: string;
    requestBody: UpdateAuthzDto;
}, TContext>, "mutationFn">) => useMutation<TData, TError, {
    id: string;
    requestBody: UpdateAuthzDto;
}, TContext>({ mutationFn: ({ id, requestBody }) => AuthzService.update(id, requestBody) as unknown as Promise<TData>, ...options });
export type AuthzServiceRemoveMutationResult = Awaited<ReturnType<typeof AuthzService.remove>>;
export const useAuthzServiceRemove = <TData = AuthzServiceRemoveMutationResult, TError = unknown, TContext = unknown>(options?: Omit<UseMutationOptions<TData, TError, {
    id: string;
}, TContext>, "mutationFn">) => useMutation<TData, TError, {
    id: string;
}, TContext>({ mutationFn: ({ id }) => AuthzService.remove(id) as unknown as Promise<TData>, ...options });
export type AuthServiceLoginMutationResult = Awaited<ReturnType<typeof AuthService.login>>;
export const useAuthServiceLogin = <TData = AuthServiceLoginMutationResult, TError = unknown, TContext = unknown>(options?: Omit<UseMutationOptions<TData, TError, {
    requestBody: LoginPayloadDto;
}, TContext>, "mutationFn">) => useMutation<TData, TError, {
    requestBody: LoginPayloadDto;
}, TContext>({ mutationFn: ({ requestBody }) => AuthService.login(requestBody) as unknown as Promise<TData>, ...options });
export type AuthServiceSignUpUserMutationResult = Awaited<ReturnType<typeof AuthService.signUpUser>>;
export const useAuthServiceSignUpUser = <TData = AuthServiceSignUpUserMutationResult, TError = unknown, TContext = unknown>(options?: Omit<UseMutationOptions<TData, TError, {
    requestBody: CreateUserSignUpDto;
}, TContext>, "mutationFn">) => useMutation<TData, TError, {
    requestBody: CreateUserSignUpDto;
}, TContext>({ mutationFn: ({ requestBody }) => AuthService.signUpUser(requestBody) as unknown as Promise<TData>, ...options });
export type AdminServiceGetMemusDefaultResponse = Awaited<ReturnType<typeof AdminService.getMemus>>;
export type AdminServiceGetMemusQueryResult<TData = AdminServiceGetMemusDefaultResponse, TError = unknown> = UseQueryResult<TData, TError>;
export const useAdminServiceGetMemusKey = "AdminServiceGetMemus";
export const useAdminServiceGetMemus = <TData = AdminServiceGetMemusDefaultResponse, TError = unknown, TQueryKey extends Array<unknown> = unknown[]>(queryKey?: TQueryKey, options?: Omit<UseQueryOptions<TData, TError>, "queryKey" | "queryFn" | "initialData">) => useQuery<TData, TError>({ queryKey: [useAdminServiceGetMemusKey, ...(queryKey ?? [])], queryFn: () => AdminService.getMemus() as TData, ...options });
