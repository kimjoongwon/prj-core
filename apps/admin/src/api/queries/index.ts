// generated with @7nohe/openapi-react-query-codegen@0.5.3 
import { useQuery, useMutation, UseQueryResult, UseQueryOptions, UseMutationOptions, UseMutationResult } from "@tanstack/react-query";
import { UpdateTenantDto } from "../requests/models/UpdateTenantDto";
import { TokenDto } from "../requests/models/TokenDto";
import { ProfileDto } from "../requests/models/ProfileDto";
import { LoginDto } from "../requests/models/LoginDto";
import { CreateUserSignUpDto } from "../requests/models/CreateUserSignUpDto";
import { CreateTenantDto } from "../requests/models/CreateTenantDto";
import { CreateRoleDto } from "../requests/models/CreateRoleDto";
import { TenantsService } from "../requests/services/TenantsService";
import { RolesService } from "../requests/services/RolesService";
import { AuthService } from "../requests/services/AuthService";
export type TenantsServiceCreateMutationResult = Awaited<ReturnType<typeof TenantsService.create>>;
export const useTenantsServiceCreate = <TData = TenantsServiceCreateMutationResult, TError = unknown, TContext = unknown>(options?: Omit<UseMutationOptions<TData, TError, {
    requestBody: CreateTenantDto;
}, TContext>, "mutationFn">) => useMutation<TData, TError, {
    requestBody: CreateTenantDto;
}, TContext>({ mutationFn: ({ requestBody }) => TenantsService.create(requestBody) as unknown as Promise<TData>, ...options });
export type TenantsServiceFindAllDefaultResponse = Awaited<ReturnType<typeof TenantsService.findAll>>;
export type TenantsServiceFindAllQueryResult<TData = TenantsServiceFindAllDefaultResponse, TError = unknown> = UseQueryResult<TData, TError>;
export const useTenantsServiceFindAllKey = "TenantsServiceFindAll";
export const useTenantsServiceFindAll = <TData = TenantsServiceFindAllDefaultResponse, TError = unknown, TQueryKey extends Array<unknown> = unknown[]>(queryKey?: TQueryKey, options?: Omit<UseQueryOptions<TData, TError>, "queryKey" | "queryFn" | "initialData">) => useQuery<TData, TError>({ queryKey: [useTenantsServiceFindAllKey, ...(queryKey ?? [])], queryFn: () => TenantsService.findAll() as TData, ...options });
export type TenantsServiceFindOneDefaultResponse = Awaited<ReturnType<typeof TenantsService.findOne>>;
export type TenantsServiceFindOneQueryResult<TData = TenantsServiceFindOneDefaultResponse, TError = unknown> = UseQueryResult<TData, TError>;
export const useTenantsServiceFindOneKey = "TenantsServiceFindOne";
export const useTenantsServiceFindOne = <TData = TenantsServiceFindOneDefaultResponse, TError = unknown, TQueryKey extends Array<unknown> = unknown[]>({ id }: {
    id: string;
}, queryKey?: TQueryKey, options?: Omit<UseQueryOptions<TData, TError>, "queryKey" | "queryFn" | "initialData">) => useQuery<TData, TError>({ queryKey: [useTenantsServiceFindOneKey, ...(queryKey ?? [{ id }])], queryFn: () => TenantsService.findOne(id) as TData, ...options });
export type TenantsServiceUpdateMutationResult = Awaited<ReturnType<typeof TenantsService.update>>;
export const useTenantsServiceUpdate = <TData = TenantsServiceUpdateMutationResult, TError = unknown, TContext = unknown>(options?: Omit<UseMutationOptions<TData, TError, {
    id: string;
    requestBody: UpdateTenantDto;
}, TContext>, "mutationFn">) => useMutation<TData, TError, {
    id: string;
    requestBody: UpdateTenantDto;
}, TContext>({ mutationFn: ({ id, requestBody }) => TenantsService.update(id, requestBody) as unknown as Promise<TData>, ...options });
export type TenantsServiceRemoveMutationResult = Awaited<ReturnType<typeof TenantsService.remove>>;
export const useTenantsServiceRemove = <TData = TenantsServiceRemoveMutationResult, TError = unknown, TContext = unknown>(options?: Omit<UseMutationOptions<TData, TError, {
    id: string;
}, TContext>, "mutationFn">) => useMutation<TData, TError, {
    id: string;
}, TContext>({ mutationFn: ({ id }) => TenantsService.remove(id) as unknown as Promise<TData>, ...options });
export type RolesServiceCreateMutationResult = Awaited<ReturnType<typeof RolesService.create>>;
export const useRolesServiceCreate = <TData = RolesServiceCreateMutationResult, TError = unknown, TContext = unknown>(options?: Omit<UseMutationOptions<TData, TError, {
    requestBody: CreateRoleDto;
}, TContext>, "mutationFn">) => useMutation<TData, TError, {
    requestBody: CreateRoleDto;
}, TContext>({ mutationFn: ({ requestBody }) => RolesService.create(requestBody) as unknown as Promise<TData>, ...options });
export type AuthServiceLoginMutationResult = Awaited<ReturnType<typeof AuthService.login>>;
export const useAuthServiceLogin = <TData = AuthServiceLoginMutationResult, TError = unknown, TContext = unknown>(options?: Omit<UseMutationOptions<TData, TError, {
    requestBody: LoginDto;
}, TContext>, "mutationFn">) => useMutation<TData, TError, {
    requestBody: LoginDto;
}, TContext>({ mutationFn: ({ requestBody }) => AuthService.login(requestBody) as unknown as Promise<TData>, ...options });
export type AuthServiceSignUpUserMutationResult = Awaited<ReturnType<typeof AuthService.signUpUser>>;
export const useAuthServiceSignUpUser = <TData = AuthServiceSignUpUserMutationResult, TError = unknown, TContext = unknown>(options?: Omit<UseMutationOptions<TData, TError, {
    requestBody: CreateUserSignUpDto;
}, TContext>, "mutationFn">) => useMutation<TData, TError, {
    requestBody: CreateUserSignUpDto;
}, TContext>({ mutationFn: ({ requestBody }) => AuthService.signUpUser(requestBody) as unknown as Promise<TData>, ...options });
