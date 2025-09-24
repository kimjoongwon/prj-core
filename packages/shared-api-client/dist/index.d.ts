import { UseMutationOptions, QueryClient, UseMutationResult, UseQueryOptions, DataTag, QueryKey, DefinedInitialDataOptions, DefinedUseQueryResult, UndefinedInitialDataOptions, UseQueryResult, UseSuspenseQueryOptions, UseSuspenseQueryResult, InfiniteData, UseSuspenseInfiniteQueryOptions, UseSuspenseInfiniteQueryResult } from '@tanstack/react-query';
import * as axios from 'axios';
import { AxiosRequestConfig, AxiosError } from 'axios';
import { CreateGroundDto, GetGroundsByQueryParams, GetGroundsByQuery200AllOf, UpdateGroundDto, GetRoleClassificationsByQueryParams, GetAppBuilder200AllOf, LoginPayloadDto, Login200AllOf, RefreshToken200AllOf, TokenDto, SignUpPayloadDto, SignUpUser201AllOf, VerifyToken200AllOf, Logout200AllOf, GetCategoriesByQueryParams, GetCategoriesByQuery200AllOf, CreateCategoryDto, CreateCategory200AllOf, GetCategoryById200AllOf, UpdateCategoryDto, UpdateCategoryById200AllOf, DeleteCategoryById200AllOf, Function, GroupDto, GetGroupsByQuery200AllOf, GetGroupById200AllOf, UpdateGroupById200AllOf, DeleteGroup200AllOf, RemoveGroups200AllOf, GetCurrentSpace200AllOf, CreateSpaceDto, CreateSpace200AllOf, GetSpacesByQueryParams, GetSpacesByQuery200AllOf, GetSpace200AllOf, UpdateSpaceDto, UpdateSpace200AllOf, DeleteSpace200AllOf, RemoveSpace200AllOf, CreateUserDto, CreateUser200AllOf, GetUsersByQueryParams, GetUsersByQuery200AllOf, GetUser200AllOf, UpdateUserDto, UpdateUser200AllOf, DeleteUser200AllOf, RemoveUsers200AllOf, RemoveUser200AllOf, CreateRoleDto, CreateRole200AllOf, GetRolesByQueryParams, GetRolesByQuery200AllOf, GetRole200AllOf, UpdateRoleDto, UpdateRole200AllOf, DeleteRole200AllOf, RemoveRole200AllOf, CreateSubject200AllOf, GetSubjectsByQuery200AllOf, GetSubject200AllOf, UpdateSubject200AllOf, DeleteSubject200AllOf, RemoveSubjects200AllOf, RemoveSubject200AllOf, CreateTimeline200AllOf, GetTimelinesByQuery200AllOf, GetTimeline200AllOf, UpdateTimeline200AllOf, DeleteTimeline200AllOf, RemoveTimelines200AllOf, RemoveTimeline200AllOf, CreateSession200AllOf, GetSessionsByQuery200AllOf, GetSession200AllOf, UpdateSession200AllOf, DeleteSession200AllOf, RemoveSessions200AllOf, RemoveSession200AllOf, CreateProgram200AllOf, GetProgramsByQuery200AllOf, GetProgramById200AllOf, UpdateProgramById200AllOf, DeleteProgramById200AllOf, RemoveProgramById200AllOf, CreateRoutine200AllOf, GetRoutinesByQuery200AllOf, GetRoutine200AllOf, UpdateRoutine200AllOf, DeleteRoutine200AllOf, RemoveRoutine200AllOf, GetExercisesByQueryParams, GetExercisesByQuery200AllOf, CreateExerciseDto, CreateExercise200AllOf, GetExercise200AllOf, UpdateExerciseDto, UpdateExercise200AllOf, DeleteExercise200AllOf, RemoveExercise200AllOf, GetFileById200AllOf, UpdateFileByIdBody, UpdateFileById200AllOf, CreateFileDto, CreateFile201AllOf, RemoveFileById200AllOf, GetMyTenants200AllOf, CreateTenantDto, CreateTenant200AllOf, GetTenantsByQueryParams, GetTenantsByQuery200AllOf, GetTenantById200AllOf, UpdateTenantDto, UpdateTenantById200AllOf, DeleteTenant200AllOf, RemoveTenantById200AllOf } from './types.js';
export { AbilityActions, AbilityDto, AbilityTypes, ActionDto, AppBuilderDto, Boolean, CategoryDto, CategoryTypes, CreateAbility200AllOf, CreateAbilityDto, CreateAction200AllOf, CreateActionDto, CreateGroupDto, CreateProgramDto, CreateRoutineDto, CreateSessionDto, CreateSessionDtoRecurringDayOfWeek, CreateSessionDtoRepeatCycleType, CreateSubjectDto, CreateTaskDto, CreateTimelineDto, DeleteAbility200AllOf, DeleteAction200AllOf, ExerciseDto, FileClassificationDto, FileDto, GetAbilitiesByQuery200AllOf, GetAbilitiesByQuery200AllOfMeta, GetAbilitiesByQueryParams, GetAbility200AllOf, GetAction200AllOf, GetActionsByQuery200AllOf, GetActionsByQuery200AllOfMeta, GetActionsByQueryParams, GetCategoriesByQuery200AllOfMeta, GetExercisesByQuery200AllOfMeta, GetGroupsByQuery200AllOfMeta, GetGroupsByQueryParams, GetMyTenant200AllOf, GetMyTenant200AllOfMeta, GetMyTenants200AllOfMeta, GetProgramsByQuery200AllOfMeta, GetProgramsByQueryParams, GetRolesByQuery200AllOfMeta, GetRoutinesByQuery200AllOfMeta, GetRoutinesByQueryParams, GetSessionsByQuery200AllOfMeta, GetSessionsByQueryParams, GetSpacesByQuery200AllOfMeta, GetSubjectsByQuery200AllOfMeta, GetSubjectsByQueryParams, GetTenantsByQuery200AllOfMeta, GetTimelinesByQuery200AllOfMeta, GetTimelinesByQueryParams, GetToken200AllOf, GetUsersByQuery200AllOfMeta, GroundDto, GroundDtoSpace, GroupTypes, Number, Order, PageMetaDto, ProgramDto, RecurringDayOfWeek, RemoveAbilities200AllOf, RemoveAbility200AllOf, RemoveAction200AllOf, RemoveActions200AllOf, RepeatCycleTypes, ResponseEntity, ResponseEntityData, ResponseEntityHttpStatus, ResponseEntityMeta, RoleDto, Roles, RouteDto, RoutineDto, SelectTenantDto, SessionDto, SessionDtoRecurringDayOfWeek, SessionDtoRepeatCycleType, SessionTypes, SortOrder, SpaceDto, SubjectDto, TenantDto, TimelineDto, UpdateAbility200AllOf, UpdateAbilityDto, UpdateAction200AllOf, UpdateActionDto, UpdateGroupDto, UpdateProgramDto, UpdateRoutineDto, UpdateSessionDto, UpdateSessionDtoRecurringDayOfWeek, UpdateSessionDtoRepeatCycleType, UpdateSubjectDto, UpdateTimelineDto, UserDto } from './types.js';

declare const AXIOS_INSTANCE: axios.AxiosInstance;
declare const customInstance: <T>(config: AxiosRequestConfig, options?: AxiosRequestConfig) => Promise<T>;
type ErrorType<Error> = AxiosError<Error>;
type BodyType<BodyData> = BodyData;

type SecondParameter<T extends (...args: never) => unknown> = Parameters<T>[1];
declare const createGround: (createGroundDto: BodyType<CreateGroundDto>, options?: SecondParameter<typeof customInstance>, signal?: AbortSignal) => Promise<void>;
declare const getCreateGroundMutationOptions: <TError = ErrorType<void>, TContext = unknown>(options?: {
    mutation?: UseMutationOptions<Awaited<ReturnType<typeof createGround>>, TError, {
        data: BodyType<CreateGroundDto>;
    }, TContext>;
    request?: SecondParameter<typeof customInstance>;
}) => UseMutationOptions<Awaited<ReturnType<typeof createGround>>, TError, {
    data: BodyType<CreateGroundDto>;
}, TContext>;
type CreateGroundMutationResult = NonNullable<Awaited<ReturnType<typeof createGround>>>;
type CreateGroundMutationBody = BodyType<CreateGroundDto>;
type CreateGroundMutationError = ErrorType<void>;
declare const useCreateGround: <TError = ErrorType<void>, TContext = unknown>(options?: {
    mutation?: UseMutationOptions<Awaited<ReturnType<typeof createGround>>, TError, {
        data: BodyType<CreateGroundDto>;
    }, TContext>;
    request?: SecondParameter<typeof customInstance>;
}, queryClient?: QueryClient) => UseMutationResult<Awaited<ReturnType<typeof createGround>>, TError, {
    data: BodyType<CreateGroundDto>;
}, TContext>;
declare const getGroundsByQuery: (params?: GetGroundsByQueryParams, options?: SecondParameter<typeof customInstance>, signal?: AbortSignal) => Promise<GetGroundsByQuery200AllOf>;
declare const getGetGroundsByQueryQueryKey: (params?: GetGroundsByQueryParams) => readonly ["/api/v1/grounds", ...GetGroundsByQueryParams[]];
declare const getGetGroundsByQueryQueryOptions: <TData = Awaited<ReturnType<typeof getGroundsByQuery>>, TError = ErrorType<void>>(params?: GetGroundsByQueryParams, options?: {
    query?: Partial<UseQueryOptions<Awaited<ReturnType<typeof getGroundsByQuery>>, TError, TData>>;
    request?: SecondParameter<typeof customInstance>;
}) => UseQueryOptions<Awaited<ReturnType<typeof getGroundsByQuery>>, TError, TData> & {
    queryKey: DataTag<QueryKey, TData, TError>;
};
type GetGroundsByQueryQueryResult = NonNullable<Awaited<ReturnType<typeof getGroundsByQuery>>>;
type GetGroundsByQueryQueryError = ErrorType<void>;
declare function useGetGroundsByQuery<TData = Awaited<ReturnType<typeof getGroundsByQuery>>, TError = ErrorType<void>>(params: undefined | GetGroundsByQueryParams, options: {
    query: Partial<UseQueryOptions<Awaited<ReturnType<typeof getGroundsByQuery>>, TError, TData>> & Pick<DefinedInitialDataOptions<Awaited<ReturnType<typeof getGroundsByQuery>>, TError, Awaited<ReturnType<typeof getGroundsByQuery>>>, "initialData">;
    request?: SecondParameter<typeof customInstance>;
}, queryClient?: QueryClient): DefinedUseQueryResult<TData, TError> & {
    queryKey: DataTag<QueryKey, TData, TError>;
};
declare function useGetGroundsByQuery<TData = Awaited<ReturnType<typeof getGroundsByQuery>>, TError = ErrorType<void>>(params?: GetGroundsByQueryParams, options?: {
    query?: Partial<UseQueryOptions<Awaited<ReturnType<typeof getGroundsByQuery>>, TError, TData>> & Pick<UndefinedInitialDataOptions<Awaited<ReturnType<typeof getGroundsByQuery>>, TError, Awaited<ReturnType<typeof getGroundsByQuery>>>, "initialData">;
    request?: SecondParameter<typeof customInstance>;
}, queryClient?: QueryClient): UseQueryResult<TData, TError> & {
    queryKey: DataTag<QueryKey, TData, TError>;
};
declare function useGetGroundsByQuery<TData = Awaited<ReturnType<typeof getGroundsByQuery>>, TError = ErrorType<void>>(params?: GetGroundsByQueryParams, options?: {
    query?: Partial<UseQueryOptions<Awaited<ReturnType<typeof getGroundsByQuery>>, TError, TData>>;
    request?: SecondParameter<typeof customInstance>;
}, queryClient?: QueryClient): UseQueryResult<TData, TError> & {
    queryKey: DataTag<QueryKey, TData, TError>;
};
declare const getGetGroundsByQuerySuspenseQueryOptions: <TData = Awaited<ReturnType<typeof getGroundsByQuery>>, TError = ErrorType<void>>(params?: GetGroundsByQueryParams, options?: {
    query?: Partial<UseSuspenseQueryOptions<Awaited<ReturnType<typeof getGroundsByQuery>>, TError, TData>>;
    request?: SecondParameter<typeof customInstance>;
}) => UseSuspenseQueryOptions<Awaited<ReturnType<typeof getGroundsByQuery>>, TError, TData> & {
    queryKey: DataTag<QueryKey, TData, TError>;
};
type GetGroundsByQuerySuspenseQueryResult = NonNullable<Awaited<ReturnType<typeof getGroundsByQuery>>>;
type GetGroundsByQuerySuspenseQueryError = ErrorType<void>;
declare function useGetGroundsByQuerySuspense<TData = Awaited<ReturnType<typeof getGroundsByQuery>>, TError = ErrorType<void>>(params: undefined | GetGroundsByQueryParams, options: {
    query: Partial<UseSuspenseQueryOptions<Awaited<ReturnType<typeof getGroundsByQuery>>, TError, TData>>;
    request?: SecondParameter<typeof customInstance>;
}, queryClient?: QueryClient): UseSuspenseQueryResult<TData, TError> & {
    queryKey: DataTag<QueryKey, TData, TError>;
};
declare function useGetGroundsByQuerySuspense<TData = Awaited<ReturnType<typeof getGroundsByQuery>>, TError = ErrorType<void>>(params?: GetGroundsByQueryParams, options?: {
    query?: Partial<UseSuspenseQueryOptions<Awaited<ReturnType<typeof getGroundsByQuery>>, TError, TData>>;
    request?: SecondParameter<typeof customInstance>;
}, queryClient?: QueryClient): UseSuspenseQueryResult<TData, TError> & {
    queryKey: DataTag<QueryKey, TData, TError>;
};
declare function useGetGroundsByQuerySuspense<TData = Awaited<ReturnType<typeof getGroundsByQuery>>, TError = ErrorType<void>>(params?: GetGroundsByQueryParams, options?: {
    query?: Partial<UseSuspenseQueryOptions<Awaited<ReturnType<typeof getGroundsByQuery>>, TError, TData>>;
    request?: SecondParameter<typeof customInstance>;
}, queryClient?: QueryClient): UseSuspenseQueryResult<TData, TError> & {
    queryKey: DataTag<QueryKey, TData, TError>;
};
declare const getGetGroundsByQuerySuspenseInfiniteQueryOptions: <TData = InfiniteData<Awaited<ReturnType<typeof getGroundsByQuery>>>, TError = ErrorType<void>>(params?: GetGroundsByQueryParams, options?: {
    query?: Partial<UseSuspenseInfiniteQueryOptions<Awaited<ReturnType<typeof getGroundsByQuery>>, TError, TData>>;
    request?: SecondParameter<typeof customInstance>;
}) => UseSuspenseInfiniteQueryOptions<Awaited<ReturnType<typeof getGroundsByQuery>>, TError, TData> & {
    queryKey: DataTag<QueryKey, TData, TError>;
};
type GetGroundsByQuerySuspenseInfiniteQueryResult = NonNullable<Awaited<ReturnType<typeof getGroundsByQuery>>>;
type GetGroundsByQuerySuspenseInfiniteQueryError = ErrorType<void>;
declare function useGetGroundsByQuerySuspenseInfinite<TData = InfiniteData<Awaited<ReturnType<typeof getGroundsByQuery>>>, TError = ErrorType<void>>(params: undefined | GetGroundsByQueryParams, options: {
    query: Partial<UseSuspenseInfiniteQueryOptions<Awaited<ReturnType<typeof getGroundsByQuery>>, TError, TData>>;
    request?: SecondParameter<typeof customInstance>;
}, queryClient?: QueryClient): UseSuspenseInfiniteQueryResult<TData, TError> & {
    queryKey: DataTag<QueryKey, TData, TError>;
};
declare function useGetGroundsByQuerySuspenseInfinite<TData = InfiniteData<Awaited<ReturnType<typeof getGroundsByQuery>>>, TError = ErrorType<void>>(params?: GetGroundsByQueryParams, options?: {
    query?: Partial<UseSuspenseInfiniteQueryOptions<Awaited<ReturnType<typeof getGroundsByQuery>>, TError, TData>>;
    request?: SecondParameter<typeof customInstance>;
}, queryClient?: QueryClient): UseSuspenseInfiniteQueryResult<TData, TError> & {
    queryKey: DataTag<QueryKey, TData, TError>;
};
declare function useGetGroundsByQuerySuspenseInfinite<TData = InfiniteData<Awaited<ReturnType<typeof getGroundsByQuery>>>, TError = ErrorType<void>>(params?: GetGroundsByQueryParams, options?: {
    query?: Partial<UseSuspenseInfiniteQueryOptions<Awaited<ReturnType<typeof getGroundsByQuery>>, TError, TData>>;
    request?: SecondParameter<typeof customInstance>;
}, queryClient?: QueryClient): UseSuspenseInfiniteQueryResult<TData, TError> & {
    queryKey: DataTag<QueryKey, TData, TError>;
};
declare const getGroundById: (groundId: string, options?: SecondParameter<typeof customInstance>, signal?: AbortSignal) => Promise<void>;
declare const getGetGroundByIdQueryKey: (groundId: string) => readonly [`/api/v1/grounds/${string}`];
declare const getGetGroundByIdQueryOptions: <TData = Awaited<ReturnType<typeof getGroundById>>, TError = ErrorType<void>>(groundId: string, options?: {
    query?: Partial<UseQueryOptions<Awaited<ReturnType<typeof getGroundById>>, TError, TData>>;
    request?: SecondParameter<typeof customInstance>;
}) => UseQueryOptions<Awaited<ReturnType<typeof getGroundById>>, TError, TData> & {
    queryKey: DataTag<QueryKey, TData, TError>;
};
type GetGroundByIdQueryResult = NonNullable<Awaited<ReturnType<typeof getGroundById>>>;
type GetGroundByIdQueryError = ErrorType<void>;
declare function useGetGroundById<TData = Awaited<ReturnType<typeof getGroundById>>, TError = ErrorType<void>>(groundId: string, options: {
    query: Partial<UseQueryOptions<Awaited<ReturnType<typeof getGroundById>>, TError, TData>> & Pick<DefinedInitialDataOptions<Awaited<ReturnType<typeof getGroundById>>, TError, Awaited<ReturnType<typeof getGroundById>>>, "initialData">;
    request?: SecondParameter<typeof customInstance>;
}, queryClient?: QueryClient): DefinedUseQueryResult<TData, TError> & {
    queryKey: DataTag<QueryKey, TData, TError>;
};
declare function useGetGroundById<TData = Awaited<ReturnType<typeof getGroundById>>, TError = ErrorType<void>>(groundId: string, options?: {
    query?: Partial<UseQueryOptions<Awaited<ReturnType<typeof getGroundById>>, TError, TData>> & Pick<UndefinedInitialDataOptions<Awaited<ReturnType<typeof getGroundById>>, TError, Awaited<ReturnType<typeof getGroundById>>>, "initialData">;
    request?: SecondParameter<typeof customInstance>;
}, queryClient?: QueryClient): UseQueryResult<TData, TError> & {
    queryKey: DataTag<QueryKey, TData, TError>;
};
declare function useGetGroundById<TData = Awaited<ReturnType<typeof getGroundById>>, TError = ErrorType<void>>(groundId: string, options?: {
    query?: Partial<UseQueryOptions<Awaited<ReturnType<typeof getGroundById>>, TError, TData>>;
    request?: SecondParameter<typeof customInstance>;
}, queryClient?: QueryClient): UseQueryResult<TData, TError> & {
    queryKey: DataTag<QueryKey, TData, TError>;
};
declare const getGetGroundByIdSuspenseQueryOptions: <TData = Awaited<ReturnType<typeof getGroundById>>, TError = ErrorType<void>>(groundId: string, options?: {
    query?: Partial<UseSuspenseQueryOptions<Awaited<ReturnType<typeof getGroundById>>, TError, TData>>;
    request?: SecondParameter<typeof customInstance>;
}) => UseSuspenseQueryOptions<Awaited<ReturnType<typeof getGroundById>>, TError, TData> & {
    queryKey: DataTag<QueryKey, TData, TError>;
};
type GetGroundByIdSuspenseQueryResult = NonNullable<Awaited<ReturnType<typeof getGroundById>>>;
type GetGroundByIdSuspenseQueryError = ErrorType<void>;
declare function useGetGroundByIdSuspense<TData = Awaited<ReturnType<typeof getGroundById>>, TError = ErrorType<void>>(groundId: string, options: {
    query: Partial<UseSuspenseQueryOptions<Awaited<ReturnType<typeof getGroundById>>, TError, TData>>;
    request?: SecondParameter<typeof customInstance>;
}, queryClient?: QueryClient): UseSuspenseQueryResult<TData, TError> & {
    queryKey: DataTag<QueryKey, TData, TError>;
};
declare function useGetGroundByIdSuspense<TData = Awaited<ReturnType<typeof getGroundById>>, TError = ErrorType<void>>(groundId: string, options?: {
    query?: Partial<UseSuspenseQueryOptions<Awaited<ReturnType<typeof getGroundById>>, TError, TData>>;
    request?: SecondParameter<typeof customInstance>;
}, queryClient?: QueryClient): UseSuspenseQueryResult<TData, TError> & {
    queryKey: DataTag<QueryKey, TData, TError>;
};
declare function useGetGroundByIdSuspense<TData = Awaited<ReturnType<typeof getGroundById>>, TError = ErrorType<void>>(groundId: string, options?: {
    query?: Partial<UseSuspenseQueryOptions<Awaited<ReturnType<typeof getGroundById>>, TError, TData>>;
    request?: SecondParameter<typeof customInstance>;
}, queryClient?: QueryClient): UseSuspenseQueryResult<TData, TError> & {
    queryKey: DataTag<QueryKey, TData, TError>;
};
declare const getGetGroundByIdSuspenseInfiniteQueryOptions: <TData = InfiniteData<Awaited<ReturnType<typeof getGroundById>>>, TError = ErrorType<void>>(groundId: string, options?: {
    query?: Partial<UseSuspenseInfiniteQueryOptions<Awaited<ReturnType<typeof getGroundById>>, TError, TData>>;
    request?: SecondParameter<typeof customInstance>;
}) => UseSuspenseInfiniteQueryOptions<Awaited<ReturnType<typeof getGroundById>>, TError, TData> & {
    queryKey: DataTag<QueryKey, TData, TError>;
};
type GetGroundByIdSuspenseInfiniteQueryResult = NonNullable<Awaited<ReturnType<typeof getGroundById>>>;
type GetGroundByIdSuspenseInfiniteQueryError = ErrorType<void>;
declare function useGetGroundByIdSuspenseInfinite<TData = InfiniteData<Awaited<ReturnType<typeof getGroundById>>>, TError = ErrorType<void>>(groundId: string, options: {
    query: Partial<UseSuspenseInfiniteQueryOptions<Awaited<ReturnType<typeof getGroundById>>, TError, TData>>;
    request?: SecondParameter<typeof customInstance>;
}, queryClient?: QueryClient): UseSuspenseInfiniteQueryResult<TData, TError> & {
    queryKey: DataTag<QueryKey, TData, TError>;
};
declare function useGetGroundByIdSuspenseInfinite<TData = InfiniteData<Awaited<ReturnType<typeof getGroundById>>>, TError = ErrorType<void>>(groundId: string, options?: {
    query?: Partial<UseSuspenseInfiniteQueryOptions<Awaited<ReturnType<typeof getGroundById>>, TError, TData>>;
    request?: SecondParameter<typeof customInstance>;
}, queryClient?: QueryClient): UseSuspenseInfiniteQueryResult<TData, TError> & {
    queryKey: DataTag<QueryKey, TData, TError>;
};
declare function useGetGroundByIdSuspenseInfinite<TData = InfiniteData<Awaited<ReturnType<typeof getGroundById>>>, TError = ErrorType<void>>(groundId: string, options?: {
    query?: Partial<UseSuspenseInfiniteQueryOptions<Awaited<ReturnType<typeof getGroundById>>, TError, TData>>;
    request?: SecondParameter<typeof customInstance>;
}, queryClient?: QueryClient): UseSuspenseInfiniteQueryResult<TData, TError> & {
    queryKey: DataTag<QueryKey, TData, TError>;
};
declare const updateGroundById: (groundId: string, updateGroundDto: BodyType<UpdateGroundDto>, options?: SecondParameter<typeof customInstance>) => Promise<void>;
declare const getUpdateGroundByIdMutationOptions: <TError = ErrorType<void>, TContext = unknown>(options?: {
    mutation?: UseMutationOptions<Awaited<ReturnType<typeof updateGroundById>>, TError, {
        groundId: string;
        data: BodyType<UpdateGroundDto>;
    }, TContext>;
    request?: SecondParameter<typeof customInstance>;
}) => UseMutationOptions<Awaited<ReturnType<typeof updateGroundById>>, TError, {
    groundId: string;
    data: BodyType<UpdateGroundDto>;
}, TContext>;
type UpdateGroundByIdMutationResult = NonNullable<Awaited<ReturnType<typeof updateGroundById>>>;
type UpdateGroundByIdMutationBody = BodyType<UpdateGroundDto>;
type UpdateGroundByIdMutationError = ErrorType<void>;
declare const useUpdateGroundById: <TError = ErrorType<void>, TContext = unknown>(options?: {
    mutation?: UseMutationOptions<Awaited<ReturnType<typeof updateGroundById>>, TError, {
        groundId: string;
        data: BodyType<UpdateGroundDto>;
    }, TContext>;
    request?: SecondParameter<typeof customInstance>;
}, queryClient?: QueryClient) => UseMutationResult<Awaited<ReturnType<typeof updateGroundById>>, TError, {
    groundId: string;
    data: BodyType<UpdateGroundDto>;
}, TContext>;
declare const deleteGroundById: (groundId: string, options?: SecondParameter<typeof customInstance>) => Promise<void>;
declare const getDeleteGroundByIdMutationOptions: <TError = ErrorType<void>, TContext = unknown>(options?: {
    mutation?: UseMutationOptions<Awaited<ReturnType<typeof deleteGroundById>>, TError, {
        groundId: string;
    }, TContext>;
    request?: SecondParameter<typeof customInstance>;
}) => UseMutationOptions<Awaited<ReturnType<typeof deleteGroundById>>, TError, {
    groundId: string;
}, TContext>;
type DeleteGroundByIdMutationResult = NonNullable<Awaited<ReturnType<typeof deleteGroundById>>>;
type DeleteGroundByIdMutationError = ErrorType<void>;
declare const useDeleteGroundById: <TError = ErrorType<void>, TContext = unknown>(options?: {
    mutation?: UseMutationOptions<Awaited<ReturnType<typeof deleteGroundById>>, TError, {
        groundId: string;
    }, TContext>;
    request?: SecondParameter<typeof customInstance>;
}, queryClient?: QueryClient) => UseMutationResult<Awaited<ReturnType<typeof deleteGroundById>>, TError, {
    groundId: string;
}, TContext>;
declare const removeGroundById: (groundId: string, options?: SecondParameter<typeof customInstance>) => Promise<void>;
declare const getRemoveGroundByIdMutationOptions: <TError = ErrorType<void>, TContext = unknown>(options?: {
    mutation?: UseMutationOptions<Awaited<ReturnType<typeof removeGroundById>>, TError, {
        groundId: string;
    }, TContext>;
    request?: SecondParameter<typeof customInstance>;
}) => UseMutationOptions<Awaited<ReturnType<typeof removeGroundById>>, TError, {
    groundId: string;
}, TContext>;
type RemoveGroundByIdMutationResult = NonNullable<Awaited<ReturnType<typeof removeGroundById>>>;
type RemoveGroundByIdMutationError = ErrorType<void>;
declare const useRemoveGroundById: <TError = ErrorType<void>, TContext = unknown>(options?: {
    mutation?: UseMutationOptions<Awaited<ReturnType<typeof removeGroundById>>, TError, {
        groundId: string;
    }, TContext>;
    request?: SecondParameter<typeof customInstance>;
}, queryClient?: QueryClient) => UseMutationResult<Awaited<ReturnType<typeof removeGroundById>>, TError, {
    groundId: string;
}, TContext>;
declare const createRoleClassification: (createRoleClassificationBody: BodyType<string>, options?: SecondParameter<typeof customInstance>, signal?: AbortSignal) => Promise<void>;
declare const getCreateRoleClassificationMutationOptions: <TError = ErrorType<void>, TContext = unknown>(options?: {
    mutation?: UseMutationOptions<Awaited<ReturnType<typeof createRoleClassification>>, TError, {
        data: BodyType<string>;
    }, TContext>;
    request?: SecondParameter<typeof customInstance>;
}) => UseMutationOptions<Awaited<ReturnType<typeof createRoleClassification>>, TError, {
    data: BodyType<string>;
}, TContext>;
type CreateRoleClassificationMutationResult = NonNullable<Awaited<ReturnType<typeof createRoleClassification>>>;
type CreateRoleClassificationMutationBody = BodyType<string>;
type CreateRoleClassificationMutationError = ErrorType<void>;
declare const useCreateRoleClassification: <TError = ErrorType<void>, TContext = unknown>(options?: {
    mutation?: UseMutationOptions<Awaited<ReturnType<typeof createRoleClassification>>, TError, {
        data: BodyType<string>;
    }, TContext>;
    request?: SecondParameter<typeof customInstance>;
}, queryClient?: QueryClient) => UseMutationResult<Awaited<ReturnType<typeof createRoleClassification>>, TError, {
    data: BodyType<string>;
}, TContext>;
declare const getRoleClassificationsByQuery: (params?: GetRoleClassificationsByQueryParams, options?: SecondParameter<typeof customInstance>, signal?: AbortSignal) => Promise<void>;
declare const getGetRoleClassificationsByQueryQueryKey: (params?: GetRoleClassificationsByQueryParams) => readonly ["/api/v1/roles/classifications", ...GetRoleClassificationsByQueryParams[]];
declare const getGetRoleClassificationsByQueryQueryOptions: <TData = Awaited<ReturnType<typeof getRoleClassificationsByQuery>>, TError = ErrorType<void>>(params?: GetRoleClassificationsByQueryParams, options?: {
    query?: Partial<UseQueryOptions<Awaited<ReturnType<typeof getRoleClassificationsByQuery>>, TError, TData>>;
    request?: SecondParameter<typeof customInstance>;
}) => UseQueryOptions<Awaited<ReturnType<typeof getRoleClassificationsByQuery>>, TError, TData> & {
    queryKey: DataTag<QueryKey, TData, TError>;
};
type GetRoleClassificationsByQueryQueryResult = NonNullable<Awaited<ReturnType<typeof getRoleClassificationsByQuery>>>;
type GetRoleClassificationsByQueryQueryError = ErrorType<void>;
declare function useGetRoleClassificationsByQuery<TData = Awaited<ReturnType<typeof getRoleClassificationsByQuery>>, TError = ErrorType<void>>(params: undefined | GetRoleClassificationsByQueryParams, options: {
    query: Partial<UseQueryOptions<Awaited<ReturnType<typeof getRoleClassificationsByQuery>>, TError, TData>> & Pick<DefinedInitialDataOptions<Awaited<ReturnType<typeof getRoleClassificationsByQuery>>, TError, Awaited<ReturnType<typeof getRoleClassificationsByQuery>>>, "initialData">;
    request?: SecondParameter<typeof customInstance>;
}, queryClient?: QueryClient): DefinedUseQueryResult<TData, TError> & {
    queryKey: DataTag<QueryKey, TData, TError>;
};
declare function useGetRoleClassificationsByQuery<TData = Awaited<ReturnType<typeof getRoleClassificationsByQuery>>, TError = ErrorType<void>>(params?: GetRoleClassificationsByQueryParams, options?: {
    query?: Partial<UseQueryOptions<Awaited<ReturnType<typeof getRoleClassificationsByQuery>>, TError, TData>> & Pick<UndefinedInitialDataOptions<Awaited<ReturnType<typeof getRoleClassificationsByQuery>>, TError, Awaited<ReturnType<typeof getRoleClassificationsByQuery>>>, "initialData">;
    request?: SecondParameter<typeof customInstance>;
}, queryClient?: QueryClient): UseQueryResult<TData, TError> & {
    queryKey: DataTag<QueryKey, TData, TError>;
};
declare function useGetRoleClassificationsByQuery<TData = Awaited<ReturnType<typeof getRoleClassificationsByQuery>>, TError = ErrorType<void>>(params?: GetRoleClassificationsByQueryParams, options?: {
    query?: Partial<UseQueryOptions<Awaited<ReturnType<typeof getRoleClassificationsByQuery>>, TError, TData>>;
    request?: SecondParameter<typeof customInstance>;
}, queryClient?: QueryClient): UseQueryResult<TData, TError> & {
    queryKey: DataTag<QueryKey, TData, TError>;
};
declare const getGetRoleClassificationsByQuerySuspenseQueryOptions: <TData = Awaited<ReturnType<typeof getRoleClassificationsByQuery>>, TError = ErrorType<void>>(params?: GetRoleClassificationsByQueryParams, options?: {
    query?: Partial<UseSuspenseQueryOptions<Awaited<ReturnType<typeof getRoleClassificationsByQuery>>, TError, TData>>;
    request?: SecondParameter<typeof customInstance>;
}) => UseSuspenseQueryOptions<Awaited<ReturnType<typeof getRoleClassificationsByQuery>>, TError, TData> & {
    queryKey: DataTag<QueryKey, TData, TError>;
};
type GetRoleClassificationsByQuerySuspenseQueryResult = NonNullable<Awaited<ReturnType<typeof getRoleClassificationsByQuery>>>;
type GetRoleClassificationsByQuerySuspenseQueryError = ErrorType<void>;
declare function useGetRoleClassificationsByQuerySuspense<TData = Awaited<ReturnType<typeof getRoleClassificationsByQuery>>, TError = ErrorType<void>>(params: undefined | GetRoleClassificationsByQueryParams, options: {
    query: Partial<UseSuspenseQueryOptions<Awaited<ReturnType<typeof getRoleClassificationsByQuery>>, TError, TData>>;
    request?: SecondParameter<typeof customInstance>;
}, queryClient?: QueryClient): UseSuspenseQueryResult<TData, TError> & {
    queryKey: DataTag<QueryKey, TData, TError>;
};
declare function useGetRoleClassificationsByQuerySuspense<TData = Awaited<ReturnType<typeof getRoleClassificationsByQuery>>, TError = ErrorType<void>>(params?: GetRoleClassificationsByQueryParams, options?: {
    query?: Partial<UseSuspenseQueryOptions<Awaited<ReturnType<typeof getRoleClassificationsByQuery>>, TError, TData>>;
    request?: SecondParameter<typeof customInstance>;
}, queryClient?: QueryClient): UseSuspenseQueryResult<TData, TError> & {
    queryKey: DataTag<QueryKey, TData, TError>;
};
declare function useGetRoleClassificationsByQuerySuspense<TData = Awaited<ReturnType<typeof getRoleClassificationsByQuery>>, TError = ErrorType<void>>(params?: GetRoleClassificationsByQueryParams, options?: {
    query?: Partial<UseSuspenseQueryOptions<Awaited<ReturnType<typeof getRoleClassificationsByQuery>>, TError, TData>>;
    request?: SecondParameter<typeof customInstance>;
}, queryClient?: QueryClient): UseSuspenseQueryResult<TData, TError> & {
    queryKey: DataTag<QueryKey, TData, TError>;
};
declare const getGetRoleClassificationsByQuerySuspenseInfiniteQueryOptions: <TData = InfiniteData<Awaited<ReturnType<typeof getRoleClassificationsByQuery>>>, TError = ErrorType<void>>(params?: GetRoleClassificationsByQueryParams, options?: {
    query?: Partial<UseSuspenseInfiniteQueryOptions<Awaited<ReturnType<typeof getRoleClassificationsByQuery>>, TError, TData>>;
    request?: SecondParameter<typeof customInstance>;
}) => UseSuspenseInfiniteQueryOptions<Awaited<ReturnType<typeof getRoleClassificationsByQuery>>, TError, TData> & {
    queryKey: DataTag<QueryKey, TData, TError>;
};
type GetRoleClassificationsByQuerySuspenseInfiniteQueryResult = NonNullable<Awaited<ReturnType<typeof getRoleClassificationsByQuery>>>;
type GetRoleClassificationsByQuerySuspenseInfiniteQueryError = ErrorType<void>;
declare function useGetRoleClassificationsByQuerySuspenseInfinite<TData = InfiniteData<Awaited<ReturnType<typeof getRoleClassificationsByQuery>>>, TError = ErrorType<void>>(params: undefined | GetRoleClassificationsByQueryParams, options: {
    query: Partial<UseSuspenseInfiniteQueryOptions<Awaited<ReturnType<typeof getRoleClassificationsByQuery>>, TError, TData>>;
    request?: SecondParameter<typeof customInstance>;
}, queryClient?: QueryClient): UseSuspenseInfiniteQueryResult<TData, TError> & {
    queryKey: DataTag<QueryKey, TData, TError>;
};
declare function useGetRoleClassificationsByQuerySuspenseInfinite<TData = InfiniteData<Awaited<ReturnType<typeof getRoleClassificationsByQuery>>>, TError = ErrorType<void>>(params?: GetRoleClassificationsByQueryParams, options?: {
    query?: Partial<UseSuspenseInfiniteQueryOptions<Awaited<ReturnType<typeof getRoleClassificationsByQuery>>, TError, TData>>;
    request?: SecondParameter<typeof customInstance>;
}, queryClient?: QueryClient): UseSuspenseInfiniteQueryResult<TData, TError> & {
    queryKey: DataTag<QueryKey, TData, TError>;
};
declare function useGetRoleClassificationsByQuerySuspenseInfinite<TData = InfiniteData<Awaited<ReturnType<typeof getRoleClassificationsByQuery>>>, TError = ErrorType<void>>(params?: GetRoleClassificationsByQueryParams, options?: {
    query?: Partial<UseSuspenseInfiniteQueryOptions<Awaited<ReturnType<typeof getRoleClassificationsByQuery>>, TError, TData>>;
    request?: SecondParameter<typeof customInstance>;
}, queryClient?: QueryClient): UseSuspenseInfiniteQueryResult<TData, TError> & {
    queryKey: DataTag<QueryKey, TData, TError>;
};
declare const getRoleClassificationById: (id: string, options?: SecondParameter<typeof customInstance>, signal?: AbortSignal) => Promise<void>;
declare const getGetRoleClassificationByIdQueryKey: (id: string) => readonly [`/api/v1/roles/classifications/${string}`];
declare const getGetRoleClassificationByIdQueryOptions: <TData = Awaited<ReturnType<typeof getRoleClassificationById>>, TError = ErrorType<void>>(id: string, options?: {
    query?: Partial<UseQueryOptions<Awaited<ReturnType<typeof getRoleClassificationById>>, TError, TData>>;
    request?: SecondParameter<typeof customInstance>;
}) => UseQueryOptions<Awaited<ReturnType<typeof getRoleClassificationById>>, TError, TData> & {
    queryKey: DataTag<QueryKey, TData, TError>;
};
type GetRoleClassificationByIdQueryResult = NonNullable<Awaited<ReturnType<typeof getRoleClassificationById>>>;
type GetRoleClassificationByIdQueryError = ErrorType<void>;
declare function useGetRoleClassificationById<TData = Awaited<ReturnType<typeof getRoleClassificationById>>, TError = ErrorType<void>>(id: string, options: {
    query: Partial<UseQueryOptions<Awaited<ReturnType<typeof getRoleClassificationById>>, TError, TData>> & Pick<DefinedInitialDataOptions<Awaited<ReturnType<typeof getRoleClassificationById>>, TError, Awaited<ReturnType<typeof getRoleClassificationById>>>, "initialData">;
    request?: SecondParameter<typeof customInstance>;
}, queryClient?: QueryClient): DefinedUseQueryResult<TData, TError> & {
    queryKey: DataTag<QueryKey, TData, TError>;
};
declare function useGetRoleClassificationById<TData = Awaited<ReturnType<typeof getRoleClassificationById>>, TError = ErrorType<void>>(id: string, options?: {
    query?: Partial<UseQueryOptions<Awaited<ReturnType<typeof getRoleClassificationById>>, TError, TData>> & Pick<UndefinedInitialDataOptions<Awaited<ReturnType<typeof getRoleClassificationById>>, TError, Awaited<ReturnType<typeof getRoleClassificationById>>>, "initialData">;
    request?: SecondParameter<typeof customInstance>;
}, queryClient?: QueryClient): UseQueryResult<TData, TError> & {
    queryKey: DataTag<QueryKey, TData, TError>;
};
declare function useGetRoleClassificationById<TData = Awaited<ReturnType<typeof getRoleClassificationById>>, TError = ErrorType<void>>(id: string, options?: {
    query?: Partial<UseQueryOptions<Awaited<ReturnType<typeof getRoleClassificationById>>, TError, TData>>;
    request?: SecondParameter<typeof customInstance>;
}, queryClient?: QueryClient): UseQueryResult<TData, TError> & {
    queryKey: DataTag<QueryKey, TData, TError>;
};
declare const getGetRoleClassificationByIdSuspenseQueryOptions: <TData = Awaited<ReturnType<typeof getRoleClassificationById>>, TError = ErrorType<void>>(id: string, options?: {
    query?: Partial<UseSuspenseQueryOptions<Awaited<ReturnType<typeof getRoleClassificationById>>, TError, TData>>;
    request?: SecondParameter<typeof customInstance>;
}) => UseSuspenseQueryOptions<Awaited<ReturnType<typeof getRoleClassificationById>>, TError, TData> & {
    queryKey: DataTag<QueryKey, TData, TError>;
};
type GetRoleClassificationByIdSuspenseQueryResult = NonNullable<Awaited<ReturnType<typeof getRoleClassificationById>>>;
type GetRoleClassificationByIdSuspenseQueryError = ErrorType<void>;
declare function useGetRoleClassificationByIdSuspense<TData = Awaited<ReturnType<typeof getRoleClassificationById>>, TError = ErrorType<void>>(id: string, options: {
    query: Partial<UseSuspenseQueryOptions<Awaited<ReturnType<typeof getRoleClassificationById>>, TError, TData>>;
    request?: SecondParameter<typeof customInstance>;
}, queryClient?: QueryClient): UseSuspenseQueryResult<TData, TError> & {
    queryKey: DataTag<QueryKey, TData, TError>;
};
declare function useGetRoleClassificationByIdSuspense<TData = Awaited<ReturnType<typeof getRoleClassificationById>>, TError = ErrorType<void>>(id: string, options?: {
    query?: Partial<UseSuspenseQueryOptions<Awaited<ReturnType<typeof getRoleClassificationById>>, TError, TData>>;
    request?: SecondParameter<typeof customInstance>;
}, queryClient?: QueryClient): UseSuspenseQueryResult<TData, TError> & {
    queryKey: DataTag<QueryKey, TData, TError>;
};
declare function useGetRoleClassificationByIdSuspense<TData = Awaited<ReturnType<typeof getRoleClassificationById>>, TError = ErrorType<void>>(id: string, options?: {
    query?: Partial<UseSuspenseQueryOptions<Awaited<ReturnType<typeof getRoleClassificationById>>, TError, TData>>;
    request?: SecondParameter<typeof customInstance>;
}, queryClient?: QueryClient): UseSuspenseQueryResult<TData, TError> & {
    queryKey: DataTag<QueryKey, TData, TError>;
};
declare const getGetRoleClassificationByIdSuspenseInfiniteQueryOptions: <TData = InfiniteData<Awaited<ReturnType<typeof getRoleClassificationById>>>, TError = ErrorType<void>>(id: string, options?: {
    query?: Partial<UseSuspenseInfiniteQueryOptions<Awaited<ReturnType<typeof getRoleClassificationById>>, TError, TData>>;
    request?: SecondParameter<typeof customInstance>;
}) => UseSuspenseInfiniteQueryOptions<Awaited<ReturnType<typeof getRoleClassificationById>>, TError, TData> & {
    queryKey: DataTag<QueryKey, TData, TError>;
};
type GetRoleClassificationByIdSuspenseInfiniteQueryResult = NonNullable<Awaited<ReturnType<typeof getRoleClassificationById>>>;
type GetRoleClassificationByIdSuspenseInfiniteQueryError = ErrorType<void>;
declare function useGetRoleClassificationByIdSuspenseInfinite<TData = InfiniteData<Awaited<ReturnType<typeof getRoleClassificationById>>>, TError = ErrorType<void>>(id: string, options: {
    query: Partial<UseSuspenseInfiniteQueryOptions<Awaited<ReturnType<typeof getRoleClassificationById>>, TError, TData>>;
    request?: SecondParameter<typeof customInstance>;
}, queryClient?: QueryClient): UseSuspenseInfiniteQueryResult<TData, TError> & {
    queryKey: DataTag<QueryKey, TData, TError>;
};
declare function useGetRoleClassificationByIdSuspenseInfinite<TData = InfiniteData<Awaited<ReturnType<typeof getRoleClassificationById>>>, TError = ErrorType<void>>(id: string, options?: {
    query?: Partial<UseSuspenseInfiniteQueryOptions<Awaited<ReturnType<typeof getRoleClassificationById>>, TError, TData>>;
    request?: SecondParameter<typeof customInstance>;
}, queryClient?: QueryClient): UseSuspenseInfiniteQueryResult<TData, TError> & {
    queryKey: DataTag<QueryKey, TData, TError>;
};
declare function useGetRoleClassificationByIdSuspenseInfinite<TData = InfiniteData<Awaited<ReturnType<typeof getRoleClassificationById>>>, TError = ErrorType<void>>(id: string, options?: {
    query?: Partial<UseSuspenseInfiniteQueryOptions<Awaited<ReturnType<typeof getRoleClassificationById>>, TError, TData>>;
    request?: SecondParameter<typeof customInstance>;
}, queryClient?: QueryClient): UseSuspenseInfiniteQueryResult<TData, TError> & {
    queryKey: DataTag<QueryKey, TData, TError>;
};
declare const updateRoleClassificationById: (id: BodyType<string>, updateRoleClassificationByIdBody: string, options?: SecondParameter<typeof customInstance>) => Promise<void>;
declare const getUpdateRoleClassificationByIdMutationOptions: <TError = ErrorType<void>, TContext = unknown>(options?: {
    mutation?: UseMutationOptions<Awaited<ReturnType<typeof updateRoleClassificationById>>, TError, {
        id: string;
        data: BodyType<string>;
    }, TContext>;
    request?: SecondParameter<typeof customInstance>;
}) => UseMutationOptions<Awaited<ReturnType<typeof updateRoleClassificationById>>, TError, {
    id: string;
    data: BodyType<string>;
}, TContext>;
type UpdateRoleClassificationByIdMutationResult = NonNullable<Awaited<ReturnType<typeof updateRoleClassificationById>>>;
type UpdateRoleClassificationByIdMutationBody = BodyType<string>;
type UpdateRoleClassificationByIdMutationError = ErrorType<void>;
declare const useUpdateRoleClassificationById: <TError = ErrorType<void>, TContext = unknown>(options?: {
    mutation?: UseMutationOptions<Awaited<ReturnType<typeof updateRoleClassificationById>>, TError, {
        id: string;
        data: BodyType<string>;
    }, TContext>;
    request?: SecondParameter<typeof customInstance>;
}, queryClient?: QueryClient) => UseMutationResult<Awaited<ReturnType<typeof updateRoleClassificationById>>, TError, {
    id: string;
    data: BodyType<string>;
}, TContext>;
declare const deleteRoleClassificationById: (id: string, options?: SecondParameter<typeof customInstance>) => Promise<void>;
declare const getDeleteRoleClassificationByIdMutationOptions: <TError = ErrorType<void>, TContext = unknown>(options?: {
    mutation?: UseMutationOptions<Awaited<ReturnType<typeof deleteRoleClassificationById>>, TError, {
        id: string;
    }, TContext>;
    request?: SecondParameter<typeof customInstance>;
}) => UseMutationOptions<Awaited<ReturnType<typeof deleteRoleClassificationById>>, TError, {
    id: string;
}, TContext>;
type DeleteRoleClassificationByIdMutationResult = NonNullable<Awaited<ReturnType<typeof deleteRoleClassificationById>>>;
type DeleteRoleClassificationByIdMutationError = ErrorType<void>;
declare const useDeleteRoleClassificationById: <TError = ErrorType<void>, TContext = unknown>(options?: {
    mutation?: UseMutationOptions<Awaited<ReturnType<typeof deleteRoleClassificationById>>, TError, {
        id: string;
    }, TContext>;
    request?: SecondParameter<typeof customInstance>;
}, queryClient?: QueryClient) => UseMutationResult<Awaited<ReturnType<typeof deleteRoleClassificationById>>, TError, {
    id: string;
}, TContext>;
declare const removeRoleClassificationById: (id: string, options?: SecondParameter<typeof customInstance>) => Promise<void>;
declare const getRemoveRoleClassificationByIdMutationOptions: <TError = ErrorType<void>, TContext = unknown>(options?: {
    mutation?: UseMutationOptions<Awaited<ReturnType<typeof removeRoleClassificationById>>, TError, {
        id: string;
    }, TContext>;
    request?: SecondParameter<typeof customInstance>;
}) => UseMutationOptions<Awaited<ReturnType<typeof removeRoleClassificationById>>, TError, {
    id: string;
}, TContext>;
type RemoveRoleClassificationByIdMutationResult = NonNullable<Awaited<ReturnType<typeof removeRoleClassificationById>>>;
type RemoveRoleClassificationByIdMutationError = ErrorType<void>;
declare const useRemoveRoleClassificationById: <TError = ErrorType<void>, TContext = unknown>(options?: {
    mutation?: UseMutationOptions<Awaited<ReturnType<typeof removeRoleClassificationById>>, TError, {
        id: string;
    }, TContext>;
    request?: SecondParameter<typeof customInstance>;
}, queryClient?: QueryClient) => UseMutationResult<Awaited<ReturnType<typeof removeRoleClassificationById>>, TError, {
    id: string;
}, TContext>;
declare const getAppBuilder: (options?: SecondParameter<typeof customInstance>, signal?: AbortSignal) => Promise<GetAppBuilder200AllOf>;
declare const getGetAppBuilderQueryKey: () => readonly ["/api/v1/appBuilder"];
declare const getGetAppBuilderQueryOptions: <TData = Awaited<ReturnType<typeof getAppBuilder>>, TError = ErrorType<void>>(options?: {
    query?: Partial<UseQueryOptions<Awaited<ReturnType<typeof getAppBuilder>>, TError, TData>>;
    request?: SecondParameter<typeof customInstance>;
}) => UseQueryOptions<Awaited<ReturnType<typeof getAppBuilder>>, TError, TData> & {
    queryKey: DataTag<QueryKey, TData, TError>;
};
type GetAppBuilderQueryResult = NonNullable<Awaited<ReturnType<typeof getAppBuilder>>>;
type GetAppBuilderQueryError = ErrorType<void>;
declare function useGetAppBuilder<TData = Awaited<ReturnType<typeof getAppBuilder>>, TError = ErrorType<void>>(options: {
    query: Partial<UseQueryOptions<Awaited<ReturnType<typeof getAppBuilder>>, TError, TData>> & Pick<DefinedInitialDataOptions<Awaited<ReturnType<typeof getAppBuilder>>, TError, Awaited<ReturnType<typeof getAppBuilder>>>, "initialData">;
    request?: SecondParameter<typeof customInstance>;
}, queryClient?: QueryClient): DefinedUseQueryResult<TData, TError> & {
    queryKey: DataTag<QueryKey, TData, TError>;
};
declare function useGetAppBuilder<TData = Awaited<ReturnType<typeof getAppBuilder>>, TError = ErrorType<void>>(options?: {
    query?: Partial<UseQueryOptions<Awaited<ReturnType<typeof getAppBuilder>>, TError, TData>> & Pick<UndefinedInitialDataOptions<Awaited<ReturnType<typeof getAppBuilder>>, TError, Awaited<ReturnType<typeof getAppBuilder>>>, "initialData">;
    request?: SecondParameter<typeof customInstance>;
}, queryClient?: QueryClient): UseQueryResult<TData, TError> & {
    queryKey: DataTag<QueryKey, TData, TError>;
};
declare function useGetAppBuilder<TData = Awaited<ReturnType<typeof getAppBuilder>>, TError = ErrorType<void>>(options?: {
    query?: Partial<UseQueryOptions<Awaited<ReturnType<typeof getAppBuilder>>, TError, TData>>;
    request?: SecondParameter<typeof customInstance>;
}, queryClient?: QueryClient): UseQueryResult<TData, TError> & {
    queryKey: DataTag<QueryKey, TData, TError>;
};
declare const getGetAppBuilderSuspenseQueryOptions: <TData = Awaited<ReturnType<typeof getAppBuilder>>, TError = ErrorType<void>>(options?: {
    query?: Partial<UseSuspenseQueryOptions<Awaited<ReturnType<typeof getAppBuilder>>, TError, TData>>;
    request?: SecondParameter<typeof customInstance>;
}) => UseSuspenseQueryOptions<Awaited<ReturnType<typeof getAppBuilder>>, TError, TData> & {
    queryKey: DataTag<QueryKey, TData, TError>;
};
type GetAppBuilderSuspenseQueryResult = NonNullable<Awaited<ReturnType<typeof getAppBuilder>>>;
type GetAppBuilderSuspenseQueryError = ErrorType<void>;
declare function useGetAppBuilderSuspense<TData = Awaited<ReturnType<typeof getAppBuilder>>, TError = ErrorType<void>>(options: {
    query: Partial<UseSuspenseQueryOptions<Awaited<ReturnType<typeof getAppBuilder>>, TError, TData>>;
    request?: SecondParameter<typeof customInstance>;
}, queryClient?: QueryClient): UseSuspenseQueryResult<TData, TError> & {
    queryKey: DataTag<QueryKey, TData, TError>;
};
declare function useGetAppBuilderSuspense<TData = Awaited<ReturnType<typeof getAppBuilder>>, TError = ErrorType<void>>(options?: {
    query?: Partial<UseSuspenseQueryOptions<Awaited<ReturnType<typeof getAppBuilder>>, TError, TData>>;
    request?: SecondParameter<typeof customInstance>;
}, queryClient?: QueryClient): UseSuspenseQueryResult<TData, TError> & {
    queryKey: DataTag<QueryKey, TData, TError>;
};
declare function useGetAppBuilderSuspense<TData = Awaited<ReturnType<typeof getAppBuilder>>, TError = ErrorType<void>>(options?: {
    query?: Partial<UseSuspenseQueryOptions<Awaited<ReturnType<typeof getAppBuilder>>, TError, TData>>;
    request?: SecondParameter<typeof customInstance>;
}, queryClient?: QueryClient): UseSuspenseQueryResult<TData, TError> & {
    queryKey: DataTag<QueryKey, TData, TError>;
};
declare const getGetAppBuilderSuspenseInfiniteQueryOptions: <TData = InfiniteData<Awaited<ReturnType<typeof getAppBuilder>>>, TError = ErrorType<void>>(options?: {
    query?: Partial<UseSuspenseInfiniteQueryOptions<Awaited<ReturnType<typeof getAppBuilder>>, TError, TData>>;
    request?: SecondParameter<typeof customInstance>;
}) => UseSuspenseInfiniteQueryOptions<Awaited<ReturnType<typeof getAppBuilder>>, TError, TData> & {
    queryKey: DataTag<QueryKey, TData, TError>;
};
type GetAppBuilderSuspenseInfiniteQueryResult = NonNullable<Awaited<ReturnType<typeof getAppBuilder>>>;
type GetAppBuilderSuspenseInfiniteQueryError = ErrorType<void>;
declare function useGetAppBuilderSuspenseInfinite<TData = InfiniteData<Awaited<ReturnType<typeof getAppBuilder>>>, TError = ErrorType<void>>(options: {
    query: Partial<UseSuspenseInfiniteQueryOptions<Awaited<ReturnType<typeof getAppBuilder>>, TError, TData>>;
    request?: SecondParameter<typeof customInstance>;
}, queryClient?: QueryClient): UseSuspenseInfiniteQueryResult<TData, TError> & {
    queryKey: DataTag<QueryKey, TData, TError>;
};
declare function useGetAppBuilderSuspenseInfinite<TData = InfiniteData<Awaited<ReturnType<typeof getAppBuilder>>>, TError = ErrorType<void>>(options?: {
    query?: Partial<UseSuspenseInfiniteQueryOptions<Awaited<ReturnType<typeof getAppBuilder>>, TError, TData>>;
    request?: SecondParameter<typeof customInstance>;
}, queryClient?: QueryClient): UseSuspenseInfiniteQueryResult<TData, TError> & {
    queryKey: DataTag<QueryKey, TData, TError>;
};
declare function useGetAppBuilderSuspenseInfinite<TData = InfiniteData<Awaited<ReturnType<typeof getAppBuilder>>>, TError = ErrorType<void>>(options?: {
    query?: Partial<UseSuspenseInfiniteQueryOptions<Awaited<ReturnType<typeof getAppBuilder>>, TError, TData>>;
    request?: SecondParameter<typeof customInstance>;
}, queryClient?: QueryClient): UseSuspenseInfiniteQueryResult<TData, TError> & {
    queryKey: DataTag<QueryKey, TData, TError>;
};
declare const login: (loginPayloadDto: BodyType<LoginPayloadDto>, options?: SecondParameter<typeof customInstance>, signal?: AbortSignal) => Promise<Login200AllOf>;
declare const getLoginMutationOptions: <TError = ErrorType<unknown>, TContext = unknown>(options?: {
    mutation?: UseMutationOptions<Awaited<ReturnType<typeof login>>, TError, {
        data: BodyType<LoginPayloadDto>;
    }, TContext>;
    request?: SecondParameter<typeof customInstance>;
}) => UseMutationOptions<Awaited<ReturnType<typeof login>>, TError, {
    data: BodyType<LoginPayloadDto>;
}, TContext>;
type LoginMutationResult = NonNullable<Awaited<ReturnType<typeof login>>>;
type LoginMutationBody = BodyType<LoginPayloadDto>;
type LoginMutationError = ErrorType<unknown>;
declare const useLogin: <TError = ErrorType<unknown>, TContext = unknown>(options?: {
    mutation?: UseMutationOptions<Awaited<ReturnType<typeof login>>, TError, {
        data: BodyType<LoginPayloadDto>;
    }, TContext>;
    request?: SecondParameter<typeof customInstance>;
}, queryClient?: QueryClient) => UseMutationResult<Awaited<ReturnType<typeof login>>, TError, {
    data: BodyType<LoginPayloadDto>;
}, TContext>;
declare const refreshToken: (options?: SecondParameter<typeof customInstance>, signal?: AbortSignal) => Promise<RefreshToken200AllOf>;
declare const getRefreshTokenMutationOptions: <TError = ErrorType<unknown>, TContext = unknown>(options?: {
    mutation?: UseMutationOptions<Awaited<ReturnType<typeof refreshToken>>, TError, void, TContext>;
    request?: SecondParameter<typeof customInstance>;
}) => UseMutationOptions<Awaited<ReturnType<typeof refreshToken>>, TError, void, TContext>;
type RefreshTokenMutationResult = NonNullable<Awaited<ReturnType<typeof refreshToken>>>;
type RefreshTokenMutationError = ErrorType<unknown>;
declare const useRefreshToken: <TError = ErrorType<unknown>, TContext = unknown>(options?: {
    mutation?: UseMutationOptions<Awaited<ReturnType<typeof refreshToken>>, TError, void, TContext>;
    request?: SecondParameter<typeof customInstance>;
}, queryClient?: QueryClient) => UseMutationResult<Awaited<ReturnType<typeof refreshToken>>, TError, void, TContext>;
declare const getNewToken: (options?: SecondParameter<typeof customInstance>, signal?: AbortSignal) => Promise<TokenDto>;
declare const getGetNewTokenQueryKey: () => readonly ["/api/v1/auth/new-token"];
declare const getGetNewTokenQueryOptions: <TData = Awaited<ReturnType<typeof getNewToken>>, TError = ErrorType<void>>(options?: {
    query?: Partial<UseQueryOptions<Awaited<ReturnType<typeof getNewToken>>, TError, TData>>;
    request?: SecondParameter<typeof customInstance>;
}) => UseQueryOptions<Awaited<ReturnType<typeof getNewToken>>, TError, TData> & {
    queryKey: DataTag<QueryKey, TData, TError>;
};
type GetNewTokenQueryResult = NonNullable<Awaited<ReturnType<typeof getNewToken>>>;
type GetNewTokenQueryError = ErrorType<void>;
declare function useGetNewToken<TData = Awaited<ReturnType<typeof getNewToken>>, TError = ErrorType<void>>(options: {
    query: Partial<UseQueryOptions<Awaited<ReturnType<typeof getNewToken>>, TError, TData>> & Pick<DefinedInitialDataOptions<Awaited<ReturnType<typeof getNewToken>>, TError, Awaited<ReturnType<typeof getNewToken>>>, "initialData">;
    request?: SecondParameter<typeof customInstance>;
}, queryClient?: QueryClient): DefinedUseQueryResult<TData, TError> & {
    queryKey: DataTag<QueryKey, TData, TError>;
};
declare function useGetNewToken<TData = Awaited<ReturnType<typeof getNewToken>>, TError = ErrorType<void>>(options?: {
    query?: Partial<UseQueryOptions<Awaited<ReturnType<typeof getNewToken>>, TError, TData>> & Pick<UndefinedInitialDataOptions<Awaited<ReturnType<typeof getNewToken>>, TError, Awaited<ReturnType<typeof getNewToken>>>, "initialData">;
    request?: SecondParameter<typeof customInstance>;
}, queryClient?: QueryClient): UseQueryResult<TData, TError> & {
    queryKey: DataTag<QueryKey, TData, TError>;
};
declare function useGetNewToken<TData = Awaited<ReturnType<typeof getNewToken>>, TError = ErrorType<void>>(options?: {
    query?: Partial<UseQueryOptions<Awaited<ReturnType<typeof getNewToken>>, TError, TData>>;
    request?: SecondParameter<typeof customInstance>;
}, queryClient?: QueryClient): UseQueryResult<TData, TError> & {
    queryKey: DataTag<QueryKey, TData, TError>;
};
declare const getGetNewTokenSuspenseQueryOptions: <TData = Awaited<ReturnType<typeof getNewToken>>, TError = ErrorType<void>>(options?: {
    query?: Partial<UseSuspenseQueryOptions<Awaited<ReturnType<typeof getNewToken>>, TError, TData>>;
    request?: SecondParameter<typeof customInstance>;
}) => UseSuspenseQueryOptions<Awaited<ReturnType<typeof getNewToken>>, TError, TData> & {
    queryKey: DataTag<QueryKey, TData, TError>;
};
type GetNewTokenSuspenseQueryResult = NonNullable<Awaited<ReturnType<typeof getNewToken>>>;
type GetNewTokenSuspenseQueryError = ErrorType<void>;
declare function useGetNewTokenSuspense<TData = Awaited<ReturnType<typeof getNewToken>>, TError = ErrorType<void>>(options: {
    query: Partial<UseSuspenseQueryOptions<Awaited<ReturnType<typeof getNewToken>>, TError, TData>>;
    request?: SecondParameter<typeof customInstance>;
}, queryClient?: QueryClient): UseSuspenseQueryResult<TData, TError> & {
    queryKey: DataTag<QueryKey, TData, TError>;
};
declare function useGetNewTokenSuspense<TData = Awaited<ReturnType<typeof getNewToken>>, TError = ErrorType<void>>(options?: {
    query?: Partial<UseSuspenseQueryOptions<Awaited<ReturnType<typeof getNewToken>>, TError, TData>>;
    request?: SecondParameter<typeof customInstance>;
}, queryClient?: QueryClient): UseSuspenseQueryResult<TData, TError> & {
    queryKey: DataTag<QueryKey, TData, TError>;
};
declare function useGetNewTokenSuspense<TData = Awaited<ReturnType<typeof getNewToken>>, TError = ErrorType<void>>(options?: {
    query?: Partial<UseSuspenseQueryOptions<Awaited<ReturnType<typeof getNewToken>>, TError, TData>>;
    request?: SecondParameter<typeof customInstance>;
}, queryClient?: QueryClient): UseSuspenseQueryResult<TData, TError> & {
    queryKey: DataTag<QueryKey, TData, TError>;
};
declare const getGetNewTokenSuspenseInfiniteQueryOptions: <TData = InfiniteData<Awaited<ReturnType<typeof getNewToken>>>, TError = ErrorType<void>>(options?: {
    query?: Partial<UseSuspenseInfiniteQueryOptions<Awaited<ReturnType<typeof getNewToken>>, TError, TData>>;
    request?: SecondParameter<typeof customInstance>;
}) => UseSuspenseInfiniteQueryOptions<Awaited<ReturnType<typeof getNewToken>>, TError, TData> & {
    queryKey: DataTag<QueryKey, TData, TError>;
};
type GetNewTokenSuspenseInfiniteQueryResult = NonNullable<Awaited<ReturnType<typeof getNewToken>>>;
type GetNewTokenSuspenseInfiniteQueryError = ErrorType<void>;
declare function useGetNewTokenSuspenseInfinite<TData = InfiniteData<Awaited<ReturnType<typeof getNewToken>>>, TError = ErrorType<void>>(options: {
    query: Partial<UseSuspenseInfiniteQueryOptions<Awaited<ReturnType<typeof getNewToken>>, TError, TData>>;
    request?: SecondParameter<typeof customInstance>;
}, queryClient?: QueryClient): UseSuspenseInfiniteQueryResult<TData, TError> & {
    queryKey: DataTag<QueryKey, TData, TError>;
};
declare function useGetNewTokenSuspenseInfinite<TData = InfiniteData<Awaited<ReturnType<typeof getNewToken>>>, TError = ErrorType<void>>(options?: {
    query?: Partial<UseSuspenseInfiniteQueryOptions<Awaited<ReturnType<typeof getNewToken>>, TError, TData>>;
    request?: SecondParameter<typeof customInstance>;
}, queryClient?: QueryClient): UseSuspenseInfiniteQueryResult<TData, TError> & {
    queryKey: DataTag<QueryKey, TData, TError>;
};
declare function useGetNewTokenSuspenseInfinite<TData = InfiniteData<Awaited<ReturnType<typeof getNewToken>>>, TError = ErrorType<void>>(options?: {
    query?: Partial<UseSuspenseInfiniteQueryOptions<Awaited<ReturnType<typeof getNewToken>>, TError, TData>>;
    request?: SecondParameter<typeof customInstance>;
}, queryClient?: QueryClient): UseSuspenseInfiniteQueryResult<TData, TError> & {
    queryKey: DataTag<QueryKey, TData, TError>;
};
declare const signUpUser: (signUpPayloadDto: BodyType<SignUpPayloadDto>, options?: SecondParameter<typeof customInstance>, signal?: AbortSignal) => Promise<SignUpUser201AllOf>;
declare const getSignUpUserMutationOptions: <TError = ErrorType<unknown>, TContext = unknown>(options?: {
    mutation?: UseMutationOptions<Awaited<ReturnType<typeof signUpUser>>, TError, {
        data: BodyType<SignUpPayloadDto>;
    }, TContext>;
    request?: SecondParameter<typeof customInstance>;
}) => UseMutationOptions<Awaited<ReturnType<typeof signUpUser>>, TError, {
    data: BodyType<SignUpPayloadDto>;
}, TContext>;
type SignUpUserMutationResult = NonNullable<Awaited<ReturnType<typeof signUpUser>>>;
type SignUpUserMutationBody = BodyType<SignUpPayloadDto>;
type SignUpUserMutationError = ErrorType<unknown>;
declare const useSignUpUser: <TError = ErrorType<unknown>, TContext = unknown>(options?: {
    mutation?: UseMutationOptions<Awaited<ReturnType<typeof signUpUser>>, TError, {
        data: BodyType<SignUpPayloadDto>;
    }, TContext>;
    request?: SecondParameter<typeof customInstance>;
}, queryClient?: QueryClient) => UseMutationResult<Awaited<ReturnType<typeof signUpUser>>, TError, {
    data: BodyType<SignUpPayloadDto>;
}, TContext>;
declare const verifyToken: (options?: SecondParameter<typeof customInstance>, signal?: AbortSignal) => Promise<VerifyToken200AllOf>;
declare const getVerifyTokenQueryKey: () => readonly ["/api/v1/auth/verify-token"];
declare const getVerifyTokenQueryOptions: <TData = Awaited<ReturnType<typeof verifyToken>>, TError = ErrorType<void>>(options?: {
    query?: Partial<UseQueryOptions<Awaited<ReturnType<typeof verifyToken>>, TError, TData>>;
    request?: SecondParameter<typeof customInstance>;
}) => UseQueryOptions<Awaited<ReturnType<typeof verifyToken>>, TError, TData> & {
    queryKey: DataTag<QueryKey, TData, TError>;
};
type VerifyTokenQueryResult = NonNullable<Awaited<ReturnType<typeof verifyToken>>>;
type VerifyTokenQueryError = ErrorType<void>;
declare function useVerifyToken<TData = Awaited<ReturnType<typeof verifyToken>>, TError = ErrorType<void>>(options: {
    query: Partial<UseQueryOptions<Awaited<ReturnType<typeof verifyToken>>, TError, TData>> & Pick<DefinedInitialDataOptions<Awaited<ReturnType<typeof verifyToken>>, TError, Awaited<ReturnType<typeof verifyToken>>>, "initialData">;
    request?: SecondParameter<typeof customInstance>;
}, queryClient?: QueryClient): DefinedUseQueryResult<TData, TError> & {
    queryKey: DataTag<QueryKey, TData, TError>;
};
declare function useVerifyToken<TData = Awaited<ReturnType<typeof verifyToken>>, TError = ErrorType<void>>(options?: {
    query?: Partial<UseQueryOptions<Awaited<ReturnType<typeof verifyToken>>, TError, TData>> & Pick<UndefinedInitialDataOptions<Awaited<ReturnType<typeof verifyToken>>, TError, Awaited<ReturnType<typeof verifyToken>>>, "initialData">;
    request?: SecondParameter<typeof customInstance>;
}, queryClient?: QueryClient): UseQueryResult<TData, TError> & {
    queryKey: DataTag<QueryKey, TData, TError>;
};
declare function useVerifyToken<TData = Awaited<ReturnType<typeof verifyToken>>, TError = ErrorType<void>>(options?: {
    query?: Partial<UseQueryOptions<Awaited<ReturnType<typeof verifyToken>>, TError, TData>>;
    request?: SecondParameter<typeof customInstance>;
}, queryClient?: QueryClient): UseQueryResult<TData, TError> & {
    queryKey: DataTag<QueryKey, TData, TError>;
};
declare const getVerifyTokenSuspenseQueryOptions: <TData = Awaited<ReturnType<typeof verifyToken>>, TError = ErrorType<void>>(options?: {
    query?: Partial<UseSuspenseQueryOptions<Awaited<ReturnType<typeof verifyToken>>, TError, TData>>;
    request?: SecondParameter<typeof customInstance>;
}) => UseSuspenseQueryOptions<Awaited<ReturnType<typeof verifyToken>>, TError, TData> & {
    queryKey: DataTag<QueryKey, TData, TError>;
};
type VerifyTokenSuspenseQueryResult = NonNullable<Awaited<ReturnType<typeof verifyToken>>>;
type VerifyTokenSuspenseQueryError = ErrorType<void>;
declare function useVerifyTokenSuspense<TData = Awaited<ReturnType<typeof verifyToken>>, TError = ErrorType<void>>(options: {
    query: Partial<UseSuspenseQueryOptions<Awaited<ReturnType<typeof verifyToken>>, TError, TData>>;
    request?: SecondParameter<typeof customInstance>;
}, queryClient?: QueryClient): UseSuspenseQueryResult<TData, TError> & {
    queryKey: DataTag<QueryKey, TData, TError>;
};
declare function useVerifyTokenSuspense<TData = Awaited<ReturnType<typeof verifyToken>>, TError = ErrorType<void>>(options?: {
    query?: Partial<UseSuspenseQueryOptions<Awaited<ReturnType<typeof verifyToken>>, TError, TData>>;
    request?: SecondParameter<typeof customInstance>;
}, queryClient?: QueryClient): UseSuspenseQueryResult<TData, TError> & {
    queryKey: DataTag<QueryKey, TData, TError>;
};
declare function useVerifyTokenSuspense<TData = Awaited<ReturnType<typeof verifyToken>>, TError = ErrorType<void>>(options?: {
    query?: Partial<UseSuspenseQueryOptions<Awaited<ReturnType<typeof verifyToken>>, TError, TData>>;
    request?: SecondParameter<typeof customInstance>;
}, queryClient?: QueryClient): UseSuspenseQueryResult<TData, TError> & {
    queryKey: DataTag<QueryKey, TData, TError>;
};
declare const getVerifyTokenSuspenseInfiniteQueryOptions: <TData = InfiniteData<Awaited<ReturnType<typeof verifyToken>>>, TError = ErrorType<void>>(options?: {
    query?: Partial<UseSuspenseInfiniteQueryOptions<Awaited<ReturnType<typeof verifyToken>>, TError, TData>>;
    request?: SecondParameter<typeof customInstance>;
}) => UseSuspenseInfiniteQueryOptions<Awaited<ReturnType<typeof verifyToken>>, TError, TData> & {
    queryKey: DataTag<QueryKey, TData, TError>;
};
type VerifyTokenSuspenseInfiniteQueryResult = NonNullable<Awaited<ReturnType<typeof verifyToken>>>;
type VerifyTokenSuspenseInfiniteQueryError = ErrorType<void>;
declare function useVerifyTokenSuspenseInfinite<TData = InfiniteData<Awaited<ReturnType<typeof verifyToken>>>, TError = ErrorType<void>>(options: {
    query: Partial<UseSuspenseInfiniteQueryOptions<Awaited<ReturnType<typeof verifyToken>>, TError, TData>>;
    request?: SecondParameter<typeof customInstance>;
}, queryClient?: QueryClient): UseSuspenseInfiniteQueryResult<TData, TError> & {
    queryKey: DataTag<QueryKey, TData, TError>;
};
declare function useVerifyTokenSuspenseInfinite<TData = InfiniteData<Awaited<ReturnType<typeof verifyToken>>>, TError = ErrorType<void>>(options?: {
    query?: Partial<UseSuspenseInfiniteQueryOptions<Awaited<ReturnType<typeof verifyToken>>, TError, TData>>;
    request?: SecondParameter<typeof customInstance>;
}, queryClient?: QueryClient): UseSuspenseInfiniteQueryResult<TData, TError> & {
    queryKey: DataTag<QueryKey, TData, TError>;
};
declare function useVerifyTokenSuspenseInfinite<TData = InfiniteData<Awaited<ReturnType<typeof verifyToken>>>, TError = ErrorType<void>>(options?: {
    query?: Partial<UseSuspenseInfiniteQueryOptions<Awaited<ReturnType<typeof verifyToken>>, TError, TData>>;
    request?: SecondParameter<typeof customInstance>;
}, queryClient?: QueryClient): UseSuspenseInfiniteQueryResult<TData, TError> & {
    queryKey: DataTag<QueryKey, TData, TError>;
};
declare const logout: (options?: SecondParameter<typeof customInstance>, signal?: AbortSignal) => Promise<Logout200AllOf>;
declare const getLogoutMutationOptions: <TError = ErrorType<void>, TContext = unknown>(options?: {
    mutation?: UseMutationOptions<Awaited<ReturnType<typeof logout>>, TError, void, TContext>;
    request?: SecondParameter<typeof customInstance>;
}) => UseMutationOptions<Awaited<ReturnType<typeof logout>>, TError, void, TContext>;
type LogoutMutationResult = NonNullable<Awaited<ReturnType<typeof logout>>>;
type LogoutMutationError = ErrorType<void>;
declare const useLogout: <TError = ErrorType<void>, TContext = unknown>(options?: {
    mutation?: UseMutationOptions<Awaited<ReturnType<typeof logout>>, TError, void, TContext>;
    request?: SecondParameter<typeof customInstance>;
}, queryClient?: QueryClient) => UseMutationResult<Awaited<ReturnType<typeof logout>>, TError, void, TContext>;
declare const getCategoriesByQuery: (params?: GetCategoriesByQueryParams, options?: SecondParameter<typeof customInstance>, signal?: AbortSignal) => Promise<GetCategoriesByQuery200AllOf>;
declare const getGetCategoriesByQueryQueryKey: (params?: GetCategoriesByQueryParams) => readonly ["/api/v1/categories", ...GetCategoriesByQueryParams[]];
declare const getGetCategoriesByQueryQueryOptions: <TData = Awaited<ReturnType<typeof getCategoriesByQuery>>, TError = ErrorType<void>>(params?: GetCategoriesByQueryParams, options?: {
    query?: Partial<UseQueryOptions<Awaited<ReturnType<typeof getCategoriesByQuery>>, TError, TData>>;
    request?: SecondParameter<typeof customInstance>;
}) => UseQueryOptions<Awaited<ReturnType<typeof getCategoriesByQuery>>, TError, TData> & {
    queryKey: DataTag<QueryKey, TData, TError>;
};
type GetCategoriesByQueryQueryResult = NonNullable<Awaited<ReturnType<typeof getCategoriesByQuery>>>;
type GetCategoriesByQueryQueryError = ErrorType<void>;
declare function useGetCategoriesByQuery<TData = Awaited<ReturnType<typeof getCategoriesByQuery>>, TError = ErrorType<void>>(params: undefined | GetCategoriesByQueryParams, options: {
    query: Partial<UseQueryOptions<Awaited<ReturnType<typeof getCategoriesByQuery>>, TError, TData>> & Pick<DefinedInitialDataOptions<Awaited<ReturnType<typeof getCategoriesByQuery>>, TError, Awaited<ReturnType<typeof getCategoriesByQuery>>>, "initialData">;
    request?: SecondParameter<typeof customInstance>;
}, queryClient?: QueryClient): DefinedUseQueryResult<TData, TError> & {
    queryKey: DataTag<QueryKey, TData, TError>;
};
declare function useGetCategoriesByQuery<TData = Awaited<ReturnType<typeof getCategoriesByQuery>>, TError = ErrorType<void>>(params?: GetCategoriesByQueryParams, options?: {
    query?: Partial<UseQueryOptions<Awaited<ReturnType<typeof getCategoriesByQuery>>, TError, TData>> & Pick<UndefinedInitialDataOptions<Awaited<ReturnType<typeof getCategoriesByQuery>>, TError, Awaited<ReturnType<typeof getCategoriesByQuery>>>, "initialData">;
    request?: SecondParameter<typeof customInstance>;
}, queryClient?: QueryClient): UseQueryResult<TData, TError> & {
    queryKey: DataTag<QueryKey, TData, TError>;
};
declare function useGetCategoriesByQuery<TData = Awaited<ReturnType<typeof getCategoriesByQuery>>, TError = ErrorType<void>>(params?: GetCategoriesByQueryParams, options?: {
    query?: Partial<UseQueryOptions<Awaited<ReturnType<typeof getCategoriesByQuery>>, TError, TData>>;
    request?: SecondParameter<typeof customInstance>;
}, queryClient?: QueryClient): UseQueryResult<TData, TError> & {
    queryKey: DataTag<QueryKey, TData, TError>;
};
declare const getGetCategoriesByQuerySuspenseQueryOptions: <TData = Awaited<ReturnType<typeof getCategoriesByQuery>>, TError = ErrorType<void>>(params?: GetCategoriesByQueryParams, options?: {
    query?: Partial<UseSuspenseQueryOptions<Awaited<ReturnType<typeof getCategoriesByQuery>>, TError, TData>>;
    request?: SecondParameter<typeof customInstance>;
}) => UseSuspenseQueryOptions<Awaited<ReturnType<typeof getCategoriesByQuery>>, TError, TData> & {
    queryKey: DataTag<QueryKey, TData, TError>;
};
type GetCategoriesByQuerySuspenseQueryResult = NonNullable<Awaited<ReturnType<typeof getCategoriesByQuery>>>;
type GetCategoriesByQuerySuspenseQueryError = ErrorType<void>;
declare function useGetCategoriesByQuerySuspense<TData = Awaited<ReturnType<typeof getCategoriesByQuery>>, TError = ErrorType<void>>(params: undefined | GetCategoriesByQueryParams, options: {
    query: Partial<UseSuspenseQueryOptions<Awaited<ReturnType<typeof getCategoriesByQuery>>, TError, TData>>;
    request?: SecondParameter<typeof customInstance>;
}, queryClient?: QueryClient): UseSuspenseQueryResult<TData, TError> & {
    queryKey: DataTag<QueryKey, TData, TError>;
};
declare function useGetCategoriesByQuerySuspense<TData = Awaited<ReturnType<typeof getCategoriesByQuery>>, TError = ErrorType<void>>(params?: GetCategoriesByQueryParams, options?: {
    query?: Partial<UseSuspenseQueryOptions<Awaited<ReturnType<typeof getCategoriesByQuery>>, TError, TData>>;
    request?: SecondParameter<typeof customInstance>;
}, queryClient?: QueryClient): UseSuspenseQueryResult<TData, TError> & {
    queryKey: DataTag<QueryKey, TData, TError>;
};
declare function useGetCategoriesByQuerySuspense<TData = Awaited<ReturnType<typeof getCategoriesByQuery>>, TError = ErrorType<void>>(params?: GetCategoriesByQueryParams, options?: {
    query?: Partial<UseSuspenseQueryOptions<Awaited<ReturnType<typeof getCategoriesByQuery>>, TError, TData>>;
    request?: SecondParameter<typeof customInstance>;
}, queryClient?: QueryClient): UseSuspenseQueryResult<TData, TError> & {
    queryKey: DataTag<QueryKey, TData, TError>;
};
declare const getGetCategoriesByQuerySuspenseInfiniteQueryOptions: <TData = InfiniteData<Awaited<ReturnType<typeof getCategoriesByQuery>>>, TError = ErrorType<void>>(params?: GetCategoriesByQueryParams, options?: {
    query?: Partial<UseSuspenseInfiniteQueryOptions<Awaited<ReturnType<typeof getCategoriesByQuery>>, TError, TData>>;
    request?: SecondParameter<typeof customInstance>;
}) => UseSuspenseInfiniteQueryOptions<Awaited<ReturnType<typeof getCategoriesByQuery>>, TError, TData> & {
    queryKey: DataTag<QueryKey, TData, TError>;
};
type GetCategoriesByQuerySuspenseInfiniteQueryResult = NonNullable<Awaited<ReturnType<typeof getCategoriesByQuery>>>;
type GetCategoriesByQuerySuspenseInfiniteQueryError = ErrorType<void>;
declare function useGetCategoriesByQuerySuspenseInfinite<TData = InfiniteData<Awaited<ReturnType<typeof getCategoriesByQuery>>>, TError = ErrorType<void>>(params: undefined | GetCategoriesByQueryParams, options: {
    query: Partial<UseSuspenseInfiniteQueryOptions<Awaited<ReturnType<typeof getCategoriesByQuery>>, TError, TData>>;
    request?: SecondParameter<typeof customInstance>;
}, queryClient?: QueryClient): UseSuspenseInfiniteQueryResult<TData, TError> & {
    queryKey: DataTag<QueryKey, TData, TError>;
};
declare function useGetCategoriesByQuerySuspenseInfinite<TData = InfiniteData<Awaited<ReturnType<typeof getCategoriesByQuery>>>, TError = ErrorType<void>>(params?: GetCategoriesByQueryParams, options?: {
    query?: Partial<UseSuspenseInfiniteQueryOptions<Awaited<ReturnType<typeof getCategoriesByQuery>>, TError, TData>>;
    request?: SecondParameter<typeof customInstance>;
}, queryClient?: QueryClient): UseSuspenseInfiniteQueryResult<TData, TError> & {
    queryKey: DataTag<QueryKey, TData, TError>;
};
declare function useGetCategoriesByQuerySuspenseInfinite<TData = InfiniteData<Awaited<ReturnType<typeof getCategoriesByQuery>>>, TError = ErrorType<void>>(params?: GetCategoriesByQueryParams, options?: {
    query?: Partial<UseSuspenseInfiniteQueryOptions<Awaited<ReturnType<typeof getCategoriesByQuery>>, TError, TData>>;
    request?: SecondParameter<typeof customInstance>;
}, queryClient?: QueryClient): UseSuspenseInfiniteQueryResult<TData, TError> & {
    queryKey: DataTag<QueryKey, TData, TError>;
};
declare const createCategory: (createCategoryDto: BodyType<CreateCategoryDto>, options?: SecondParameter<typeof customInstance>, signal?: AbortSignal) => Promise<CreateCategory200AllOf>;
declare const getCreateCategoryMutationOptions: <TError = ErrorType<void>, TContext = unknown>(options?: {
    mutation?: UseMutationOptions<Awaited<ReturnType<typeof createCategory>>, TError, {
        data: BodyType<CreateCategoryDto>;
    }, TContext>;
    request?: SecondParameter<typeof customInstance>;
}) => UseMutationOptions<Awaited<ReturnType<typeof createCategory>>, TError, {
    data: BodyType<CreateCategoryDto>;
}, TContext>;
type CreateCategoryMutationResult = NonNullable<Awaited<ReturnType<typeof createCategory>>>;
type CreateCategoryMutationBody = BodyType<CreateCategoryDto>;
type CreateCategoryMutationError = ErrorType<void>;
declare const useCreateCategory: <TError = ErrorType<void>, TContext = unknown>(options?: {
    mutation?: UseMutationOptions<Awaited<ReturnType<typeof createCategory>>, TError, {
        data: BodyType<CreateCategoryDto>;
    }, TContext>;
    request?: SecondParameter<typeof customInstance>;
}, queryClient?: QueryClient) => UseMutationResult<Awaited<ReturnType<typeof createCategory>>, TError, {
    data: BodyType<CreateCategoryDto>;
}, TContext>;
declare const getCategoryById: (categoryId: string, options?: SecondParameter<typeof customInstance>, signal?: AbortSignal) => Promise<GetCategoryById200AllOf>;
declare const getGetCategoryByIdQueryKey: (categoryId: string) => readonly [`/api/v1/categories/${string}`];
declare const getGetCategoryByIdQueryOptions: <TData = Awaited<ReturnType<typeof getCategoryById>>, TError = ErrorType<void>>(categoryId: string, options?: {
    query?: Partial<UseQueryOptions<Awaited<ReturnType<typeof getCategoryById>>, TError, TData>>;
    request?: SecondParameter<typeof customInstance>;
}) => UseQueryOptions<Awaited<ReturnType<typeof getCategoryById>>, TError, TData> & {
    queryKey: DataTag<QueryKey, TData, TError>;
};
type GetCategoryByIdQueryResult = NonNullable<Awaited<ReturnType<typeof getCategoryById>>>;
type GetCategoryByIdQueryError = ErrorType<void>;
declare function useGetCategoryById<TData = Awaited<ReturnType<typeof getCategoryById>>, TError = ErrorType<void>>(categoryId: string, options: {
    query: Partial<UseQueryOptions<Awaited<ReturnType<typeof getCategoryById>>, TError, TData>> & Pick<DefinedInitialDataOptions<Awaited<ReturnType<typeof getCategoryById>>, TError, Awaited<ReturnType<typeof getCategoryById>>>, "initialData">;
    request?: SecondParameter<typeof customInstance>;
}, queryClient?: QueryClient): DefinedUseQueryResult<TData, TError> & {
    queryKey: DataTag<QueryKey, TData, TError>;
};
declare function useGetCategoryById<TData = Awaited<ReturnType<typeof getCategoryById>>, TError = ErrorType<void>>(categoryId: string, options?: {
    query?: Partial<UseQueryOptions<Awaited<ReturnType<typeof getCategoryById>>, TError, TData>> & Pick<UndefinedInitialDataOptions<Awaited<ReturnType<typeof getCategoryById>>, TError, Awaited<ReturnType<typeof getCategoryById>>>, "initialData">;
    request?: SecondParameter<typeof customInstance>;
}, queryClient?: QueryClient): UseQueryResult<TData, TError> & {
    queryKey: DataTag<QueryKey, TData, TError>;
};
declare function useGetCategoryById<TData = Awaited<ReturnType<typeof getCategoryById>>, TError = ErrorType<void>>(categoryId: string, options?: {
    query?: Partial<UseQueryOptions<Awaited<ReturnType<typeof getCategoryById>>, TError, TData>>;
    request?: SecondParameter<typeof customInstance>;
}, queryClient?: QueryClient): UseQueryResult<TData, TError> & {
    queryKey: DataTag<QueryKey, TData, TError>;
};
declare const getGetCategoryByIdSuspenseQueryOptions: <TData = Awaited<ReturnType<typeof getCategoryById>>, TError = ErrorType<void>>(categoryId: string, options?: {
    query?: Partial<UseSuspenseQueryOptions<Awaited<ReturnType<typeof getCategoryById>>, TError, TData>>;
    request?: SecondParameter<typeof customInstance>;
}) => UseSuspenseQueryOptions<Awaited<ReturnType<typeof getCategoryById>>, TError, TData> & {
    queryKey: DataTag<QueryKey, TData, TError>;
};
type GetCategoryByIdSuspenseQueryResult = NonNullable<Awaited<ReturnType<typeof getCategoryById>>>;
type GetCategoryByIdSuspenseQueryError = ErrorType<void>;
declare function useGetCategoryByIdSuspense<TData = Awaited<ReturnType<typeof getCategoryById>>, TError = ErrorType<void>>(categoryId: string, options: {
    query: Partial<UseSuspenseQueryOptions<Awaited<ReturnType<typeof getCategoryById>>, TError, TData>>;
    request?: SecondParameter<typeof customInstance>;
}, queryClient?: QueryClient): UseSuspenseQueryResult<TData, TError> & {
    queryKey: DataTag<QueryKey, TData, TError>;
};
declare function useGetCategoryByIdSuspense<TData = Awaited<ReturnType<typeof getCategoryById>>, TError = ErrorType<void>>(categoryId: string, options?: {
    query?: Partial<UseSuspenseQueryOptions<Awaited<ReturnType<typeof getCategoryById>>, TError, TData>>;
    request?: SecondParameter<typeof customInstance>;
}, queryClient?: QueryClient): UseSuspenseQueryResult<TData, TError> & {
    queryKey: DataTag<QueryKey, TData, TError>;
};
declare function useGetCategoryByIdSuspense<TData = Awaited<ReturnType<typeof getCategoryById>>, TError = ErrorType<void>>(categoryId: string, options?: {
    query?: Partial<UseSuspenseQueryOptions<Awaited<ReturnType<typeof getCategoryById>>, TError, TData>>;
    request?: SecondParameter<typeof customInstance>;
}, queryClient?: QueryClient): UseSuspenseQueryResult<TData, TError> & {
    queryKey: DataTag<QueryKey, TData, TError>;
};
declare const getGetCategoryByIdSuspenseInfiniteQueryOptions: <TData = InfiniteData<Awaited<ReturnType<typeof getCategoryById>>>, TError = ErrorType<void>>(categoryId: string, options?: {
    query?: Partial<UseSuspenseInfiniteQueryOptions<Awaited<ReturnType<typeof getCategoryById>>, TError, TData>>;
    request?: SecondParameter<typeof customInstance>;
}) => UseSuspenseInfiniteQueryOptions<Awaited<ReturnType<typeof getCategoryById>>, TError, TData> & {
    queryKey: DataTag<QueryKey, TData, TError>;
};
type GetCategoryByIdSuspenseInfiniteQueryResult = NonNullable<Awaited<ReturnType<typeof getCategoryById>>>;
type GetCategoryByIdSuspenseInfiniteQueryError = ErrorType<void>;
declare function useGetCategoryByIdSuspenseInfinite<TData = InfiniteData<Awaited<ReturnType<typeof getCategoryById>>>, TError = ErrorType<void>>(categoryId: string, options: {
    query: Partial<UseSuspenseInfiniteQueryOptions<Awaited<ReturnType<typeof getCategoryById>>, TError, TData>>;
    request?: SecondParameter<typeof customInstance>;
}, queryClient?: QueryClient): UseSuspenseInfiniteQueryResult<TData, TError> & {
    queryKey: DataTag<QueryKey, TData, TError>;
};
declare function useGetCategoryByIdSuspenseInfinite<TData = InfiniteData<Awaited<ReturnType<typeof getCategoryById>>>, TError = ErrorType<void>>(categoryId: string, options?: {
    query?: Partial<UseSuspenseInfiniteQueryOptions<Awaited<ReturnType<typeof getCategoryById>>, TError, TData>>;
    request?: SecondParameter<typeof customInstance>;
}, queryClient?: QueryClient): UseSuspenseInfiniteQueryResult<TData, TError> & {
    queryKey: DataTag<QueryKey, TData, TError>;
};
declare function useGetCategoryByIdSuspenseInfinite<TData = InfiniteData<Awaited<ReturnType<typeof getCategoryById>>>, TError = ErrorType<void>>(categoryId: string, options?: {
    query?: Partial<UseSuspenseInfiniteQueryOptions<Awaited<ReturnType<typeof getCategoryById>>, TError, TData>>;
    request?: SecondParameter<typeof customInstance>;
}, queryClient?: QueryClient): UseSuspenseInfiniteQueryResult<TData, TError> & {
    queryKey: DataTag<QueryKey, TData, TError>;
};
declare const updateCategoryById: (categoryId: string, updateCategoryDto: BodyType<UpdateCategoryDto>, options?: SecondParameter<typeof customInstance>) => Promise<UpdateCategoryById200AllOf>;
declare const getUpdateCategoryByIdMutationOptions: <TError = ErrorType<void>, TContext = unknown>(options?: {
    mutation?: UseMutationOptions<Awaited<ReturnType<typeof updateCategoryById>>, TError, {
        categoryId: string;
        data: BodyType<UpdateCategoryDto>;
    }, TContext>;
    request?: SecondParameter<typeof customInstance>;
}) => UseMutationOptions<Awaited<ReturnType<typeof updateCategoryById>>, TError, {
    categoryId: string;
    data: BodyType<UpdateCategoryDto>;
}, TContext>;
type UpdateCategoryByIdMutationResult = NonNullable<Awaited<ReturnType<typeof updateCategoryById>>>;
type UpdateCategoryByIdMutationBody = BodyType<UpdateCategoryDto>;
type UpdateCategoryByIdMutationError = ErrorType<void>;
declare const useUpdateCategoryById: <TError = ErrorType<void>, TContext = unknown>(options?: {
    mutation?: UseMutationOptions<Awaited<ReturnType<typeof updateCategoryById>>, TError, {
        categoryId: string;
        data: BodyType<UpdateCategoryDto>;
    }, TContext>;
    request?: SecondParameter<typeof customInstance>;
}, queryClient?: QueryClient) => UseMutationResult<Awaited<ReturnType<typeof updateCategoryById>>, TError, {
    categoryId: string;
    data: BodyType<UpdateCategoryDto>;
}, TContext>;
declare const deleteCategoryById: (categoryId: string, options?: SecondParameter<typeof customInstance>) => Promise<DeleteCategoryById200AllOf>;
declare const getDeleteCategoryByIdMutationOptions: <TError = ErrorType<void>, TContext = unknown>(options?: {
    mutation?: UseMutationOptions<Awaited<ReturnType<typeof deleteCategoryById>>, TError, {
        categoryId: string;
    }, TContext>;
    request?: SecondParameter<typeof customInstance>;
}) => UseMutationOptions<Awaited<ReturnType<typeof deleteCategoryById>>, TError, {
    categoryId: string;
}, TContext>;
type DeleteCategoryByIdMutationResult = NonNullable<Awaited<ReturnType<typeof deleteCategoryById>>>;
type DeleteCategoryByIdMutationError = ErrorType<void>;
declare const useDeleteCategoryById: <TError = ErrorType<void>, TContext = unknown>(options?: {
    mutation?: UseMutationOptions<Awaited<ReturnType<typeof deleteCategoryById>>, TError, {
        categoryId: string;
    }, TContext>;
    request?: SecondParameter<typeof customInstance>;
}, queryClient?: QueryClient) => UseMutationResult<Awaited<ReturnType<typeof deleteCategoryById>>, TError, {
    categoryId: string;
}, TContext>;
declare const createGroup: (_function: BodyType<Function>, options?: SecondParameter<typeof customInstance>, signal?: AbortSignal) => Promise<GroupDto>;
declare const getCreateGroupMutationOptions: <TError = ErrorType<void>, TContext = unknown>(options?: {
    mutation?: UseMutationOptions<Awaited<ReturnType<typeof createGroup>>, TError, {
        data: BodyType<Function>;
    }, TContext>;
    request?: SecondParameter<typeof customInstance>;
}) => UseMutationOptions<Awaited<ReturnType<typeof createGroup>>, TError, {
    data: BodyType<Function>;
}, TContext>;
type CreateGroupMutationResult = NonNullable<Awaited<ReturnType<typeof createGroup>>>;
type CreateGroupMutationBody = BodyType<Function>;
type CreateGroupMutationError = ErrorType<void>;
declare const useCreateGroup: <TError = ErrorType<void>, TContext = unknown>(options?: {
    mutation?: UseMutationOptions<Awaited<ReturnType<typeof createGroup>>, TError, {
        data: BodyType<Function>;
    }, TContext>;
    request?: SecondParameter<typeof customInstance>;
}, queryClient?: QueryClient) => UseMutationResult<Awaited<ReturnType<typeof createGroup>>, TError, {
    data: BodyType<Function>;
}, TContext>;
declare const getGroupsByQuery: (options?: SecondParameter<typeof customInstance>, signal?: AbortSignal) => Promise<GetGroupsByQuery200AllOf>;
declare const getGetGroupsByQueryQueryKey: () => readonly ["/api/v1/groups"];
declare const getGetGroupsByQueryQueryOptions: <TData = Awaited<ReturnType<typeof getGroupsByQuery>>, TError = ErrorType<unknown>>(options?: {
    query?: Partial<UseQueryOptions<Awaited<ReturnType<typeof getGroupsByQuery>>, TError, TData>>;
    request?: SecondParameter<typeof customInstance>;
}) => UseQueryOptions<Awaited<ReturnType<typeof getGroupsByQuery>>, TError, TData> & {
    queryKey: DataTag<QueryKey, TData, TError>;
};
type GetGroupsByQueryQueryResult = NonNullable<Awaited<ReturnType<typeof getGroupsByQuery>>>;
type GetGroupsByQueryQueryError = ErrorType<unknown>;
declare function useGetGroupsByQuery<TData = Awaited<ReturnType<typeof getGroupsByQuery>>, TError = ErrorType<unknown>>(options: {
    query: Partial<UseQueryOptions<Awaited<ReturnType<typeof getGroupsByQuery>>, TError, TData>> & Pick<DefinedInitialDataOptions<Awaited<ReturnType<typeof getGroupsByQuery>>, TError, Awaited<ReturnType<typeof getGroupsByQuery>>>, "initialData">;
    request?: SecondParameter<typeof customInstance>;
}, queryClient?: QueryClient): DefinedUseQueryResult<TData, TError> & {
    queryKey: DataTag<QueryKey, TData, TError>;
};
declare function useGetGroupsByQuery<TData = Awaited<ReturnType<typeof getGroupsByQuery>>, TError = ErrorType<unknown>>(options?: {
    query?: Partial<UseQueryOptions<Awaited<ReturnType<typeof getGroupsByQuery>>, TError, TData>> & Pick<UndefinedInitialDataOptions<Awaited<ReturnType<typeof getGroupsByQuery>>, TError, Awaited<ReturnType<typeof getGroupsByQuery>>>, "initialData">;
    request?: SecondParameter<typeof customInstance>;
}, queryClient?: QueryClient): UseQueryResult<TData, TError> & {
    queryKey: DataTag<QueryKey, TData, TError>;
};
declare function useGetGroupsByQuery<TData = Awaited<ReturnType<typeof getGroupsByQuery>>, TError = ErrorType<unknown>>(options?: {
    query?: Partial<UseQueryOptions<Awaited<ReturnType<typeof getGroupsByQuery>>, TError, TData>>;
    request?: SecondParameter<typeof customInstance>;
}, queryClient?: QueryClient): UseQueryResult<TData, TError> & {
    queryKey: DataTag<QueryKey, TData, TError>;
};
declare const getGetGroupsByQuerySuspenseQueryOptions: <TData = Awaited<ReturnType<typeof getGroupsByQuery>>, TError = ErrorType<unknown>>(options?: {
    query?: Partial<UseSuspenseQueryOptions<Awaited<ReturnType<typeof getGroupsByQuery>>, TError, TData>>;
    request?: SecondParameter<typeof customInstance>;
}) => UseSuspenseQueryOptions<Awaited<ReturnType<typeof getGroupsByQuery>>, TError, TData> & {
    queryKey: DataTag<QueryKey, TData, TError>;
};
type GetGroupsByQuerySuspenseQueryResult = NonNullable<Awaited<ReturnType<typeof getGroupsByQuery>>>;
type GetGroupsByQuerySuspenseQueryError = ErrorType<unknown>;
declare function useGetGroupsByQuerySuspense<TData = Awaited<ReturnType<typeof getGroupsByQuery>>, TError = ErrorType<unknown>>(options: {
    query: Partial<UseSuspenseQueryOptions<Awaited<ReturnType<typeof getGroupsByQuery>>, TError, TData>>;
    request?: SecondParameter<typeof customInstance>;
}, queryClient?: QueryClient): UseSuspenseQueryResult<TData, TError> & {
    queryKey: DataTag<QueryKey, TData, TError>;
};
declare function useGetGroupsByQuerySuspense<TData = Awaited<ReturnType<typeof getGroupsByQuery>>, TError = ErrorType<unknown>>(options?: {
    query?: Partial<UseSuspenseQueryOptions<Awaited<ReturnType<typeof getGroupsByQuery>>, TError, TData>>;
    request?: SecondParameter<typeof customInstance>;
}, queryClient?: QueryClient): UseSuspenseQueryResult<TData, TError> & {
    queryKey: DataTag<QueryKey, TData, TError>;
};
declare function useGetGroupsByQuerySuspense<TData = Awaited<ReturnType<typeof getGroupsByQuery>>, TError = ErrorType<unknown>>(options?: {
    query?: Partial<UseSuspenseQueryOptions<Awaited<ReturnType<typeof getGroupsByQuery>>, TError, TData>>;
    request?: SecondParameter<typeof customInstance>;
}, queryClient?: QueryClient): UseSuspenseQueryResult<TData, TError> & {
    queryKey: DataTag<QueryKey, TData, TError>;
};
declare const getGetGroupsByQuerySuspenseInfiniteQueryOptions: <TData = InfiniteData<Awaited<ReturnType<typeof getGroupsByQuery>>>, TError = ErrorType<unknown>>(options?: {
    query?: Partial<UseSuspenseInfiniteQueryOptions<Awaited<ReturnType<typeof getGroupsByQuery>>, TError, TData>>;
    request?: SecondParameter<typeof customInstance>;
}) => UseSuspenseInfiniteQueryOptions<Awaited<ReturnType<typeof getGroupsByQuery>>, TError, TData> & {
    queryKey: DataTag<QueryKey, TData, TError>;
};
type GetGroupsByQuerySuspenseInfiniteQueryResult = NonNullable<Awaited<ReturnType<typeof getGroupsByQuery>>>;
type GetGroupsByQuerySuspenseInfiniteQueryError = ErrorType<unknown>;
declare function useGetGroupsByQuerySuspenseInfinite<TData = InfiniteData<Awaited<ReturnType<typeof getGroupsByQuery>>>, TError = ErrorType<unknown>>(options: {
    query: Partial<UseSuspenseInfiniteQueryOptions<Awaited<ReturnType<typeof getGroupsByQuery>>, TError, TData>>;
    request?: SecondParameter<typeof customInstance>;
}, queryClient?: QueryClient): UseSuspenseInfiniteQueryResult<TData, TError> & {
    queryKey: DataTag<QueryKey, TData, TError>;
};
declare function useGetGroupsByQuerySuspenseInfinite<TData = InfiniteData<Awaited<ReturnType<typeof getGroupsByQuery>>>, TError = ErrorType<unknown>>(options?: {
    query?: Partial<UseSuspenseInfiniteQueryOptions<Awaited<ReturnType<typeof getGroupsByQuery>>, TError, TData>>;
    request?: SecondParameter<typeof customInstance>;
}, queryClient?: QueryClient): UseSuspenseInfiniteQueryResult<TData, TError> & {
    queryKey: DataTag<QueryKey, TData, TError>;
};
declare function useGetGroupsByQuerySuspenseInfinite<TData = InfiniteData<Awaited<ReturnType<typeof getGroupsByQuery>>>, TError = ErrorType<unknown>>(options?: {
    query?: Partial<UseSuspenseInfiniteQueryOptions<Awaited<ReturnType<typeof getGroupsByQuery>>, TError, TData>>;
    request?: SecondParameter<typeof customInstance>;
}, queryClient?: QueryClient): UseSuspenseInfiniteQueryResult<TData, TError> & {
    queryKey: DataTag<QueryKey, TData, TError>;
};
declare const getGroupById: (groupId: string, options?: SecondParameter<typeof customInstance>, signal?: AbortSignal) => Promise<GetGroupById200AllOf>;
declare const getGetGroupByIdQueryKey: (groupId: string) => readonly [`/api/v1/groups/${string}`];
declare const getGetGroupByIdQueryOptions: <TData = Awaited<ReturnType<typeof getGroupById>>, TError = ErrorType<unknown>>(groupId: string, options?: {
    query?: Partial<UseQueryOptions<Awaited<ReturnType<typeof getGroupById>>, TError, TData>>;
    request?: SecondParameter<typeof customInstance>;
}) => UseQueryOptions<Awaited<ReturnType<typeof getGroupById>>, TError, TData> & {
    queryKey: DataTag<QueryKey, TData, TError>;
};
type GetGroupByIdQueryResult = NonNullable<Awaited<ReturnType<typeof getGroupById>>>;
type GetGroupByIdQueryError = ErrorType<unknown>;
declare function useGetGroupById<TData = Awaited<ReturnType<typeof getGroupById>>, TError = ErrorType<unknown>>(groupId: string, options: {
    query: Partial<UseQueryOptions<Awaited<ReturnType<typeof getGroupById>>, TError, TData>> & Pick<DefinedInitialDataOptions<Awaited<ReturnType<typeof getGroupById>>, TError, Awaited<ReturnType<typeof getGroupById>>>, "initialData">;
    request?: SecondParameter<typeof customInstance>;
}, queryClient?: QueryClient): DefinedUseQueryResult<TData, TError> & {
    queryKey: DataTag<QueryKey, TData, TError>;
};
declare function useGetGroupById<TData = Awaited<ReturnType<typeof getGroupById>>, TError = ErrorType<unknown>>(groupId: string, options?: {
    query?: Partial<UseQueryOptions<Awaited<ReturnType<typeof getGroupById>>, TError, TData>> & Pick<UndefinedInitialDataOptions<Awaited<ReturnType<typeof getGroupById>>, TError, Awaited<ReturnType<typeof getGroupById>>>, "initialData">;
    request?: SecondParameter<typeof customInstance>;
}, queryClient?: QueryClient): UseQueryResult<TData, TError> & {
    queryKey: DataTag<QueryKey, TData, TError>;
};
declare function useGetGroupById<TData = Awaited<ReturnType<typeof getGroupById>>, TError = ErrorType<unknown>>(groupId: string, options?: {
    query?: Partial<UseQueryOptions<Awaited<ReturnType<typeof getGroupById>>, TError, TData>>;
    request?: SecondParameter<typeof customInstance>;
}, queryClient?: QueryClient): UseQueryResult<TData, TError> & {
    queryKey: DataTag<QueryKey, TData, TError>;
};
declare const getGetGroupByIdSuspenseQueryOptions: <TData = Awaited<ReturnType<typeof getGroupById>>, TError = ErrorType<unknown>>(groupId: string, options?: {
    query?: Partial<UseSuspenseQueryOptions<Awaited<ReturnType<typeof getGroupById>>, TError, TData>>;
    request?: SecondParameter<typeof customInstance>;
}) => UseSuspenseQueryOptions<Awaited<ReturnType<typeof getGroupById>>, TError, TData> & {
    queryKey: DataTag<QueryKey, TData, TError>;
};
type GetGroupByIdSuspenseQueryResult = NonNullable<Awaited<ReturnType<typeof getGroupById>>>;
type GetGroupByIdSuspenseQueryError = ErrorType<unknown>;
declare function useGetGroupByIdSuspense<TData = Awaited<ReturnType<typeof getGroupById>>, TError = ErrorType<unknown>>(groupId: string, options: {
    query: Partial<UseSuspenseQueryOptions<Awaited<ReturnType<typeof getGroupById>>, TError, TData>>;
    request?: SecondParameter<typeof customInstance>;
}, queryClient?: QueryClient): UseSuspenseQueryResult<TData, TError> & {
    queryKey: DataTag<QueryKey, TData, TError>;
};
declare function useGetGroupByIdSuspense<TData = Awaited<ReturnType<typeof getGroupById>>, TError = ErrorType<unknown>>(groupId: string, options?: {
    query?: Partial<UseSuspenseQueryOptions<Awaited<ReturnType<typeof getGroupById>>, TError, TData>>;
    request?: SecondParameter<typeof customInstance>;
}, queryClient?: QueryClient): UseSuspenseQueryResult<TData, TError> & {
    queryKey: DataTag<QueryKey, TData, TError>;
};
declare function useGetGroupByIdSuspense<TData = Awaited<ReturnType<typeof getGroupById>>, TError = ErrorType<unknown>>(groupId: string, options?: {
    query?: Partial<UseSuspenseQueryOptions<Awaited<ReturnType<typeof getGroupById>>, TError, TData>>;
    request?: SecondParameter<typeof customInstance>;
}, queryClient?: QueryClient): UseSuspenseQueryResult<TData, TError> & {
    queryKey: DataTag<QueryKey, TData, TError>;
};
declare const getGetGroupByIdSuspenseInfiniteQueryOptions: <TData = InfiniteData<Awaited<ReturnType<typeof getGroupById>>>, TError = ErrorType<unknown>>(groupId: string, options?: {
    query?: Partial<UseSuspenseInfiniteQueryOptions<Awaited<ReturnType<typeof getGroupById>>, TError, TData>>;
    request?: SecondParameter<typeof customInstance>;
}) => UseSuspenseInfiniteQueryOptions<Awaited<ReturnType<typeof getGroupById>>, TError, TData> & {
    queryKey: DataTag<QueryKey, TData, TError>;
};
type GetGroupByIdSuspenseInfiniteQueryResult = NonNullable<Awaited<ReturnType<typeof getGroupById>>>;
type GetGroupByIdSuspenseInfiniteQueryError = ErrorType<unknown>;
declare function useGetGroupByIdSuspenseInfinite<TData = InfiniteData<Awaited<ReturnType<typeof getGroupById>>>, TError = ErrorType<unknown>>(groupId: string, options: {
    query: Partial<UseSuspenseInfiniteQueryOptions<Awaited<ReturnType<typeof getGroupById>>, TError, TData>>;
    request?: SecondParameter<typeof customInstance>;
}, queryClient?: QueryClient): UseSuspenseInfiniteQueryResult<TData, TError> & {
    queryKey: DataTag<QueryKey, TData, TError>;
};
declare function useGetGroupByIdSuspenseInfinite<TData = InfiniteData<Awaited<ReturnType<typeof getGroupById>>>, TError = ErrorType<unknown>>(groupId: string, options?: {
    query?: Partial<UseSuspenseInfiniteQueryOptions<Awaited<ReturnType<typeof getGroupById>>, TError, TData>>;
    request?: SecondParameter<typeof customInstance>;
}, queryClient?: QueryClient): UseSuspenseInfiniteQueryResult<TData, TError> & {
    queryKey: DataTag<QueryKey, TData, TError>;
};
declare function useGetGroupByIdSuspenseInfinite<TData = InfiniteData<Awaited<ReturnType<typeof getGroupById>>>, TError = ErrorType<unknown>>(groupId: string, options?: {
    query?: Partial<UseSuspenseInfiniteQueryOptions<Awaited<ReturnType<typeof getGroupById>>, TError, TData>>;
    request?: SecondParameter<typeof customInstance>;
}, queryClient?: QueryClient): UseSuspenseInfiniteQueryResult<TData, TError> & {
    queryKey: DataTag<QueryKey, TData, TError>;
};
declare const updateGroupById: (groupId: string, _function: BodyType<Function>, options?: SecondParameter<typeof customInstance>) => Promise<UpdateGroupById200AllOf>;
declare const getUpdateGroupByIdMutationOptions: <TError = ErrorType<unknown>, TContext = unknown>(options?: {
    mutation?: UseMutationOptions<Awaited<ReturnType<typeof updateGroupById>>, TError, {
        groupId: string;
        data: BodyType<Function>;
    }, TContext>;
    request?: SecondParameter<typeof customInstance>;
}) => UseMutationOptions<Awaited<ReturnType<typeof updateGroupById>>, TError, {
    groupId: string;
    data: BodyType<Function>;
}, TContext>;
type UpdateGroupByIdMutationResult = NonNullable<Awaited<ReturnType<typeof updateGroupById>>>;
type UpdateGroupByIdMutationBody = BodyType<Function>;
type UpdateGroupByIdMutationError = ErrorType<unknown>;
declare const useUpdateGroupById: <TError = ErrorType<unknown>, TContext = unknown>(options?: {
    mutation?: UseMutationOptions<Awaited<ReturnType<typeof updateGroupById>>, TError, {
        groupId: string;
        data: BodyType<Function>;
    }, TContext>;
    request?: SecondParameter<typeof customInstance>;
}, queryClient?: QueryClient) => UseMutationResult<Awaited<ReturnType<typeof updateGroupById>>, TError, {
    groupId: string;
    data: BodyType<Function>;
}, TContext>;
declare const deleteGroup: (groupId: string, options?: SecondParameter<typeof customInstance>) => Promise<DeleteGroup200AllOf>;
declare const getDeleteGroupMutationOptions: <TError = ErrorType<unknown>, TContext = unknown>(options?: {
    mutation?: UseMutationOptions<Awaited<ReturnType<typeof deleteGroup>>, TError, {
        groupId: string;
    }, TContext>;
    request?: SecondParameter<typeof customInstance>;
}) => UseMutationOptions<Awaited<ReturnType<typeof deleteGroup>>, TError, {
    groupId: string;
}, TContext>;
type DeleteGroupMutationResult = NonNullable<Awaited<ReturnType<typeof deleteGroup>>>;
type DeleteGroupMutationError = ErrorType<unknown>;
declare const useDeleteGroup: <TError = ErrorType<unknown>, TContext = unknown>(options?: {
    mutation?: UseMutationOptions<Awaited<ReturnType<typeof deleteGroup>>, TError, {
        groupId: string;
    }, TContext>;
    request?: SecondParameter<typeof customInstance>;
}, queryClient?: QueryClient) => UseMutationResult<Awaited<ReturnType<typeof deleteGroup>>, TError, {
    groupId: string;
}, TContext>;
declare const removeGroups: (groupIds: string[], options?: SecondParameter<typeof customInstance>) => Promise<RemoveGroups200AllOf>;
declare const getRemoveGroupsMutationOptions: <TError = ErrorType<unknown>, TContext = unknown>(options?: {
    mutation?: UseMutationOptions<Awaited<ReturnType<typeof removeGroups>>, TError, {
        groupIds: string[];
    }, TContext>;
    request?: SecondParameter<typeof customInstance>;
}) => UseMutationOptions<Awaited<ReturnType<typeof removeGroups>>, TError, {
    groupIds: string[];
}, TContext>;
type RemoveGroupsMutationResult = NonNullable<Awaited<ReturnType<typeof removeGroups>>>;
type RemoveGroupsMutationError = ErrorType<unknown>;
declare const useRemoveGroups: <TError = ErrorType<unknown>, TContext = unknown>(options?: {
    mutation?: UseMutationOptions<Awaited<ReturnType<typeof removeGroups>>, TError, {
        groupIds: string[];
    }, TContext>;
    request?: SecondParameter<typeof customInstance>;
}, queryClient?: QueryClient) => UseMutationResult<Awaited<ReturnType<typeof removeGroups>>, TError, {
    groupIds: string[];
}, TContext>;
declare const getCurrentSpace: (options?: SecondParameter<typeof customInstance>, signal?: AbortSignal) => Promise<GetCurrentSpace200AllOf>;
declare const getGetCurrentSpaceQueryKey: () => readonly ["/api/v1/spaces/current"];
declare const getGetCurrentSpaceQueryOptions: <TData = Awaited<ReturnType<typeof getCurrentSpace>>, TError = ErrorType<void>>(options?: {
    query?: Partial<UseQueryOptions<Awaited<ReturnType<typeof getCurrentSpace>>, TError, TData>>;
    request?: SecondParameter<typeof customInstance>;
}) => UseQueryOptions<Awaited<ReturnType<typeof getCurrentSpace>>, TError, TData> & {
    queryKey: DataTag<QueryKey, TData, TError>;
};
type GetCurrentSpaceQueryResult = NonNullable<Awaited<ReturnType<typeof getCurrentSpace>>>;
type GetCurrentSpaceQueryError = ErrorType<void>;
declare function useGetCurrentSpace<TData = Awaited<ReturnType<typeof getCurrentSpace>>, TError = ErrorType<void>>(options: {
    query: Partial<UseQueryOptions<Awaited<ReturnType<typeof getCurrentSpace>>, TError, TData>> & Pick<DefinedInitialDataOptions<Awaited<ReturnType<typeof getCurrentSpace>>, TError, Awaited<ReturnType<typeof getCurrentSpace>>>, "initialData">;
    request?: SecondParameter<typeof customInstance>;
}, queryClient?: QueryClient): DefinedUseQueryResult<TData, TError> & {
    queryKey: DataTag<QueryKey, TData, TError>;
};
declare function useGetCurrentSpace<TData = Awaited<ReturnType<typeof getCurrentSpace>>, TError = ErrorType<void>>(options?: {
    query?: Partial<UseQueryOptions<Awaited<ReturnType<typeof getCurrentSpace>>, TError, TData>> & Pick<UndefinedInitialDataOptions<Awaited<ReturnType<typeof getCurrentSpace>>, TError, Awaited<ReturnType<typeof getCurrentSpace>>>, "initialData">;
    request?: SecondParameter<typeof customInstance>;
}, queryClient?: QueryClient): UseQueryResult<TData, TError> & {
    queryKey: DataTag<QueryKey, TData, TError>;
};
declare function useGetCurrentSpace<TData = Awaited<ReturnType<typeof getCurrentSpace>>, TError = ErrorType<void>>(options?: {
    query?: Partial<UseQueryOptions<Awaited<ReturnType<typeof getCurrentSpace>>, TError, TData>>;
    request?: SecondParameter<typeof customInstance>;
}, queryClient?: QueryClient): UseQueryResult<TData, TError> & {
    queryKey: DataTag<QueryKey, TData, TError>;
};
declare const getGetCurrentSpaceSuspenseQueryOptions: <TData = Awaited<ReturnType<typeof getCurrentSpace>>, TError = ErrorType<void>>(options?: {
    query?: Partial<UseSuspenseQueryOptions<Awaited<ReturnType<typeof getCurrentSpace>>, TError, TData>>;
    request?: SecondParameter<typeof customInstance>;
}) => UseSuspenseQueryOptions<Awaited<ReturnType<typeof getCurrentSpace>>, TError, TData> & {
    queryKey: DataTag<QueryKey, TData, TError>;
};
type GetCurrentSpaceSuspenseQueryResult = NonNullable<Awaited<ReturnType<typeof getCurrentSpace>>>;
type GetCurrentSpaceSuspenseQueryError = ErrorType<void>;
declare function useGetCurrentSpaceSuspense<TData = Awaited<ReturnType<typeof getCurrentSpace>>, TError = ErrorType<void>>(options: {
    query: Partial<UseSuspenseQueryOptions<Awaited<ReturnType<typeof getCurrentSpace>>, TError, TData>>;
    request?: SecondParameter<typeof customInstance>;
}, queryClient?: QueryClient): UseSuspenseQueryResult<TData, TError> & {
    queryKey: DataTag<QueryKey, TData, TError>;
};
declare function useGetCurrentSpaceSuspense<TData = Awaited<ReturnType<typeof getCurrentSpace>>, TError = ErrorType<void>>(options?: {
    query?: Partial<UseSuspenseQueryOptions<Awaited<ReturnType<typeof getCurrentSpace>>, TError, TData>>;
    request?: SecondParameter<typeof customInstance>;
}, queryClient?: QueryClient): UseSuspenseQueryResult<TData, TError> & {
    queryKey: DataTag<QueryKey, TData, TError>;
};
declare function useGetCurrentSpaceSuspense<TData = Awaited<ReturnType<typeof getCurrentSpace>>, TError = ErrorType<void>>(options?: {
    query?: Partial<UseSuspenseQueryOptions<Awaited<ReturnType<typeof getCurrentSpace>>, TError, TData>>;
    request?: SecondParameter<typeof customInstance>;
}, queryClient?: QueryClient): UseSuspenseQueryResult<TData, TError> & {
    queryKey: DataTag<QueryKey, TData, TError>;
};
declare const getGetCurrentSpaceSuspenseInfiniteQueryOptions: <TData = InfiniteData<Awaited<ReturnType<typeof getCurrentSpace>>>, TError = ErrorType<void>>(options?: {
    query?: Partial<UseSuspenseInfiniteQueryOptions<Awaited<ReturnType<typeof getCurrentSpace>>, TError, TData>>;
    request?: SecondParameter<typeof customInstance>;
}) => UseSuspenseInfiniteQueryOptions<Awaited<ReturnType<typeof getCurrentSpace>>, TError, TData> & {
    queryKey: DataTag<QueryKey, TData, TError>;
};
type GetCurrentSpaceSuspenseInfiniteQueryResult = NonNullable<Awaited<ReturnType<typeof getCurrentSpace>>>;
type GetCurrentSpaceSuspenseInfiniteQueryError = ErrorType<void>;
declare function useGetCurrentSpaceSuspenseInfinite<TData = InfiniteData<Awaited<ReturnType<typeof getCurrentSpace>>>, TError = ErrorType<void>>(options: {
    query: Partial<UseSuspenseInfiniteQueryOptions<Awaited<ReturnType<typeof getCurrentSpace>>, TError, TData>>;
    request?: SecondParameter<typeof customInstance>;
}, queryClient?: QueryClient): UseSuspenseInfiniteQueryResult<TData, TError> & {
    queryKey: DataTag<QueryKey, TData, TError>;
};
declare function useGetCurrentSpaceSuspenseInfinite<TData = InfiniteData<Awaited<ReturnType<typeof getCurrentSpace>>>, TError = ErrorType<void>>(options?: {
    query?: Partial<UseSuspenseInfiniteQueryOptions<Awaited<ReturnType<typeof getCurrentSpace>>, TError, TData>>;
    request?: SecondParameter<typeof customInstance>;
}, queryClient?: QueryClient): UseSuspenseInfiniteQueryResult<TData, TError> & {
    queryKey: DataTag<QueryKey, TData, TError>;
};
declare function useGetCurrentSpaceSuspenseInfinite<TData = InfiniteData<Awaited<ReturnType<typeof getCurrentSpace>>>, TError = ErrorType<void>>(options?: {
    query?: Partial<UseSuspenseInfiniteQueryOptions<Awaited<ReturnType<typeof getCurrentSpace>>, TError, TData>>;
    request?: SecondParameter<typeof customInstance>;
}, queryClient?: QueryClient): UseSuspenseInfiniteQueryResult<TData, TError> & {
    queryKey: DataTag<QueryKey, TData, TError>;
};
declare const createSpace: (createSpaceDto: BodyType<CreateSpaceDto>, options?: SecondParameter<typeof customInstance>, signal?: AbortSignal) => Promise<CreateSpace200AllOf>;
declare const getCreateSpaceMutationOptions: <TError = ErrorType<void>, TContext = unknown>(options?: {
    mutation?: UseMutationOptions<Awaited<ReturnType<typeof createSpace>>, TError, {
        data: BodyType<CreateSpaceDto>;
    }, TContext>;
    request?: SecondParameter<typeof customInstance>;
}) => UseMutationOptions<Awaited<ReturnType<typeof createSpace>>, TError, {
    data: BodyType<CreateSpaceDto>;
}, TContext>;
type CreateSpaceMutationResult = NonNullable<Awaited<ReturnType<typeof createSpace>>>;
type CreateSpaceMutationBody = BodyType<CreateSpaceDto>;
type CreateSpaceMutationError = ErrorType<void>;
declare const useCreateSpace: <TError = ErrorType<void>, TContext = unknown>(options?: {
    mutation?: UseMutationOptions<Awaited<ReturnType<typeof createSpace>>, TError, {
        data: BodyType<CreateSpaceDto>;
    }, TContext>;
    request?: SecondParameter<typeof customInstance>;
}, queryClient?: QueryClient) => UseMutationResult<Awaited<ReturnType<typeof createSpace>>, TError, {
    data: BodyType<CreateSpaceDto>;
}, TContext>;
declare const getSpacesByQuery: (params?: GetSpacesByQueryParams, options?: SecondParameter<typeof customInstance>, signal?: AbortSignal) => Promise<GetSpacesByQuery200AllOf>;
declare const getGetSpacesByQueryQueryKey: (params?: GetSpacesByQueryParams) => readonly ["/api/v1/spaces", ...GetSpacesByQueryParams[]];
declare const getGetSpacesByQueryQueryOptions: <TData = Awaited<ReturnType<typeof getSpacesByQuery>>, TError = ErrorType<void>>(params?: GetSpacesByQueryParams, options?: {
    query?: Partial<UseQueryOptions<Awaited<ReturnType<typeof getSpacesByQuery>>, TError, TData>>;
    request?: SecondParameter<typeof customInstance>;
}) => UseQueryOptions<Awaited<ReturnType<typeof getSpacesByQuery>>, TError, TData> & {
    queryKey: DataTag<QueryKey, TData, TError>;
};
type GetSpacesByQueryQueryResult = NonNullable<Awaited<ReturnType<typeof getSpacesByQuery>>>;
type GetSpacesByQueryQueryError = ErrorType<void>;
declare function useGetSpacesByQuery<TData = Awaited<ReturnType<typeof getSpacesByQuery>>, TError = ErrorType<void>>(params: undefined | GetSpacesByQueryParams, options: {
    query: Partial<UseQueryOptions<Awaited<ReturnType<typeof getSpacesByQuery>>, TError, TData>> & Pick<DefinedInitialDataOptions<Awaited<ReturnType<typeof getSpacesByQuery>>, TError, Awaited<ReturnType<typeof getSpacesByQuery>>>, "initialData">;
    request?: SecondParameter<typeof customInstance>;
}, queryClient?: QueryClient): DefinedUseQueryResult<TData, TError> & {
    queryKey: DataTag<QueryKey, TData, TError>;
};
declare function useGetSpacesByQuery<TData = Awaited<ReturnType<typeof getSpacesByQuery>>, TError = ErrorType<void>>(params?: GetSpacesByQueryParams, options?: {
    query?: Partial<UseQueryOptions<Awaited<ReturnType<typeof getSpacesByQuery>>, TError, TData>> & Pick<UndefinedInitialDataOptions<Awaited<ReturnType<typeof getSpacesByQuery>>, TError, Awaited<ReturnType<typeof getSpacesByQuery>>>, "initialData">;
    request?: SecondParameter<typeof customInstance>;
}, queryClient?: QueryClient): UseQueryResult<TData, TError> & {
    queryKey: DataTag<QueryKey, TData, TError>;
};
declare function useGetSpacesByQuery<TData = Awaited<ReturnType<typeof getSpacesByQuery>>, TError = ErrorType<void>>(params?: GetSpacesByQueryParams, options?: {
    query?: Partial<UseQueryOptions<Awaited<ReturnType<typeof getSpacesByQuery>>, TError, TData>>;
    request?: SecondParameter<typeof customInstance>;
}, queryClient?: QueryClient): UseQueryResult<TData, TError> & {
    queryKey: DataTag<QueryKey, TData, TError>;
};
declare const getGetSpacesByQuerySuspenseQueryOptions: <TData = Awaited<ReturnType<typeof getSpacesByQuery>>, TError = ErrorType<void>>(params?: GetSpacesByQueryParams, options?: {
    query?: Partial<UseSuspenseQueryOptions<Awaited<ReturnType<typeof getSpacesByQuery>>, TError, TData>>;
    request?: SecondParameter<typeof customInstance>;
}) => UseSuspenseQueryOptions<Awaited<ReturnType<typeof getSpacesByQuery>>, TError, TData> & {
    queryKey: DataTag<QueryKey, TData, TError>;
};
type GetSpacesByQuerySuspenseQueryResult = NonNullable<Awaited<ReturnType<typeof getSpacesByQuery>>>;
type GetSpacesByQuerySuspenseQueryError = ErrorType<void>;
declare function useGetSpacesByQuerySuspense<TData = Awaited<ReturnType<typeof getSpacesByQuery>>, TError = ErrorType<void>>(params: undefined | GetSpacesByQueryParams, options: {
    query: Partial<UseSuspenseQueryOptions<Awaited<ReturnType<typeof getSpacesByQuery>>, TError, TData>>;
    request?: SecondParameter<typeof customInstance>;
}, queryClient?: QueryClient): UseSuspenseQueryResult<TData, TError> & {
    queryKey: DataTag<QueryKey, TData, TError>;
};
declare function useGetSpacesByQuerySuspense<TData = Awaited<ReturnType<typeof getSpacesByQuery>>, TError = ErrorType<void>>(params?: GetSpacesByQueryParams, options?: {
    query?: Partial<UseSuspenseQueryOptions<Awaited<ReturnType<typeof getSpacesByQuery>>, TError, TData>>;
    request?: SecondParameter<typeof customInstance>;
}, queryClient?: QueryClient): UseSuspenseQueryResult<TData, TError> & {
    queryKey: DataTag<QueryKey, TData, TError>;
};
declare function useGetSpacesByQuerySuspense<TData = Awaited<ReturnType<typeof getSpacesByQuery>>, TError = ErrorType<void>>(params?: GetSpacesByQueryParams, options?: {
    query?: Partial<UseSuspenseQueryOptions<Awaited<ReturnType<typeof getSpacesByQuery>>, TError, TData>>;
    request?: SecondParameter<typeof customInstance>;
}, queryClient?: QueryClient): UseSuspenseQueryResult<TData, TError> & {
    queryKey: DataTag<QueryKey, TData, TError>;
};
declare const getGetSpacesByQuerySuspenseInfiniteQueryOptions: <TData = InfiniteData<Awaited<ReturnType<typeof getSpacesByQuery>>>, TError = ErrorType<void>>(params?: GetSpacesByQueryParams, options?: {
    query?: Partial<UseSuspenseInfiniteQueryOptions<Awaited<ReturnType<typeof getSpacesByQuery>>, TError, TData>>;
    request?: SecondParameter<typeof customInstance>;
}) => UseSuspenseInfiniteQueryOptions<Awaited<ReturnType<typeof getSpacesByQuery>>, TError, TData> & {
    queryKey: DataTag<QueryKey, TData, TError>;
};
type GetSpacesByQuerySuspenseInfiniteQueryResult = NonNullable<Awaited<ReturnType<typeof getSpacesByQuery>>>;
type GetSpacesByQuerySuspenseInfiniteQueryError = ErrorType<void>;
declare function useGetSpacesByQuerySuspenseInfinite<TData = InfiniteData<Awaited<ReturnType<typeof getSpacesByQuery>>>, TError = ErrorType<void>>(params: undefined | GetSpacesByQueryParams, options: {
    query: Partial<UseSuspenseInfiniteQueryOptions<Awaited<ReturnType<typeof getSpacesByQuery>>, TError, TData>>;
    request?: SecondParameter<typeof customInstance>;
}, queryClient?: QueryClient): UseSuspenseInfiniteQueryResult<TData, TError> & {
    queryKey: DataTag<QueryKey, TData, TError>;
};
declare function useGetSpacesByQuerySuspenseInfinite<TData = InfiniteData<Awaited<ReturnType<typeof getSpacesByQuery>>>, TError = ErrorType<void>>(params?: GetSpacesByQueryParams, options?: {
    query?: Partial<UseSuspenseInfiniteQueryOptions<Awaited<ReturnType<typeof getSpacesByQuery>>, TError, TData>>;
    request?: SecondParameter<typeof customInstance>;
}, queryClient?: QueryClient): UseSuspenseInfiniteQueryResult<TData, TError> & {
    queryKey: DataTag<QueryKey, TData, TError>;
};
declare function useGetSpacesByQuerySuspenseInfinite<TData = InfiniteData<Awaited<ReturnType<typeof getSpacesByQuery>>>, TError = ErrorType<void>>(params?: GetSpacesByQueryParams, options?: {
    query?: Partial<UseSuspenseInfiniteQueryOptions<Awaited<ReturnType<typeof getSpacesByQuery>>, TError, TData>>;
    request?: SecondParameter<typeof customInstance>;
}, queryClient?: QueryClient): UseSuspenseInfiniteQueryResult<TData, TError> & {
    queryKey: DataTag<QueryKey, TData, TError>;
};
declare const getSpace: (spaceId: string, options?: SecondParameter<typeof customInstance>, signal?: AbortSignal) => Promise<GetSpace200AllOf>;
declare const getGetSpaceQueryKey: (spaceId: string) => readonly [`/api/v1/spaces/${string}`];
declare const getGetSpaceQueryOptions: <TData = Awaited<ReturnType<typeof getSpace>>, TError = ErrorType<void>>(spaceId: string, options?: {
    query?: Partial<UseQueryOptions<Awaited<ReturnType<typeof getSpace>>, TError, TData>>;
    request?: SecondParameter<typeof customInstance>;
}) => UseQueryOptions<Awaited<ReturnType<typeof getSpace>>, TError, TData> & {
    queryKey: DataTag<QueryKey, TData, TError>;
};
type GetSpaceQueryResult = NonNullable<Awaited<ReturnType<typeof getSpace>>>;
type GetSpaceQueryError = ErrorType<void>;
declare function useGetSpace<TData = Awaited<ReturnType<typeof getSpace>>, TError = ErrorType<void>>(spaceId: string, options: {
    query: Partial<UseQueryOptions<Awaited<ReturnType<typeof getSpace>>, TError, TData>> & Pick<DefinedInitialDataOptions<Awaited<ReturnType<typeof getSpace>>, TError, Awaited<ReturnType<typeof getSpace>>>, "initialData">;
    request?: SecondParameter<typeof customInstance>;
}, queryClient?: QueryClient): DefinedUseQueryResult<TData, TError> & {
    queryKey: DataTag<QueryKey, TData, TError>;
};
declare function useGetSpace<TData = Awaited<ReturnType<typeof getSpace>>, TError = ErrorType<void>>(spaceId: string, options?: {
    query?: Partial<UseQueryOptions<Awaited<ReturnType<typeof getSpace>>, TError, TData>> & Pick<UndefinedInitialDataOptions<Awaited<ReturnType<typeof getSpace>>, TError, Awaited<ReturnType<typeof getSpace>>>, "initialData">;
    request?: SecondParameter<typeof customInstance>;
}, queryClient?: QueryClient): UseQueryResult<TData, TError> & {
    queryKey: DataTag<QueryKey, TData, TError>;
};
declare function useGetSpace<TData = Awaited<ReturnType<typeof getSpace>>, TError = ErrorType<void>>(spaceId: string, options?: {
    query?: Partial<UseQueryOptions<Awaited<ReturnType<typeof getSpace>>, TError, TData>>;
    request?: SecondParameter<typeof customInstance>;
}, queryClient?: QueryClient): UseQueryResult<TData, TError> & {
    queryKey: DataTag<QueryKey, TData, TError>;
};
declare const getGetSpaceSuspenseQueryOptions: <TData = Awaited<ReturnType<typeof getSpace>>, TError = ErrorType<void>>(spaceId: string, options?: {
    query?: Partial<UseSuspenseQueryOptions<Awaited<ReturnType<typeof getSpace>>, TError, TData>>;
    request?: SecondParameter<typeof customInstance>;
}) => UseSuspenseQueryOptions<Awaited<ReturnType<typeof getSpace>>, TError, TData> & {
    queryKey: DataTag<QueryKey, TData, TError>;
};
type GetSpaceSuspenseQueryResult = NonNullable<Awaited<ReturnType<typeof getSpace>>>;
type GetSpaceSuspenseQueryError = ErrorType<void>;
declare function useGetSpaceSuspense<TData = Awaited<ReturnType<typeof getSpace>>, TError = ErrorType<void>>(spaceId: string, options: {
    query: Partial<UseSuspenseQueryOptions<Awaited<ReturnType<typeof getSpace>>, TError, TData>>;
    request?: SecondParameter<typeof customInstance>;
}, queryClient?: QueryClient): UseSuspenseQueryResult<TData, TError> & {
    queryKey: DataTag<QueryKey, TData, TError>;
};
declare function useGetSpaceSuspense<TData = Awaited<ReturnType<typeof getSpace>>, TError = ErrorType<void>>(spaceId: string, options?: {
    query?: Partial<UseSuspenseQueryOptions<Awaited<ReturnType<typeof getSpace>>, TError, TData>>;
    request?: SecondParameter<typeof customInstance>;
}, queryClient?: QueryClient): UseSuspenseQueryResult<TData, TError> & {
    queryKey: DataTag<QueryKey, TData, TError>;
};
declare function useGetSpaceSuspense<TData = Awaited<ReturnType<typeof getSpace>>, TError = ErrorType<void>>(spaceId: string, options?: {
    query?: Partial<UseSuspenseQueryOptions<Awaited<ReturnType<typeof getSpace>>, TError, TData>>;
    request?: SecondParameter<typeof customInstance>;
}, queryClient?: QueryClient): UseSuspenseQueryResult<TData, TError> & {
    queryKey: DataTag<QueryKey, TData, TError>;
};
declare const getGetSpaceSuspenseInfiniteQueryOptions: <TData = InfiniteData<Awaited<ReturnType<typeof getSpace>>>, TError = ErrorType<void>>(spaceId: string, options?: {
    query?: Partial<UseSuspenseInfiniteQueryOptions<Awaited<ReturnType<typeof getSpace>>, TError, TData>>;
    request?: SecondParameter<typeof customInstance>;
}) => UseSuspenseInfiniteQueryOptions<Awaited<ReturnType<typeof getSpace>>, TError, TData> & {
    queryKey: DataTag<QueryKey, TData, TError>;
};
type GetSpaceSuspenseInfiniteQueryResult = NonNullable<Awaited<ReturnType<typeof getSpace>>>;
type GetSpaceSuspenseInfiniteQueryError = ErrorType<void>;
declare function useGetSpaceSuspenseInfinite<TData = InfiniteData<Awaited<ReturnType<typeof getSpace>>>, TError = ErrorType<void>>(spaceId: string, options: {
    query: Partial<UseSuspenseInfiniteQueryOptions<Awaited<ReturnType<typeof getSpace>>, TError, TData>>;
    request?: SecondParameter<typeof customInstance>;
}, queryClient?: QueryClient): UseSuspenseInfiniteQueryResult<TData, TError> & {
    queryKey: DataTag<QueryKey, TData, TError>;
};
declare function useGetSpaceSuspenseInfinite<TData = InfiniteData<Awaited<ReturnType<typeof getSpace>>>, TError = ErrorType<void>>(spaceId: string, options?: {
    query?: Partial<UseSuspenseInfiniteQueryOptions<Awaited<ReturnType<typeof getSpace>>, TError, TData>>;
    request?: SecondParameter<typeof customInstance>;
}, queryClient?: QueryClient): UseSuspenseInfiniteQueryResult<TData, TError> & {
    queryKey: DataTag<QueryKey, TData, TError>;
};
declare function useGetSpaceSuspenseInfinite<TData = InfiniteData<Awaited<ReturnType<typeof getSpace>>>, TError = ErrorType<void>>(spaceId: string, options?: {
    query?: Partial<UseSuspenseInfiniteQueryOptions<Awaited<ReturnType<typeof getSpace>>, TError, TData>>;
    request?: SecondParameter<typeof customInstance>;
}, queryClient?: QueryClient): UseSuspenseInfiniteQueryResult<TData, TError> & {
    queryKey: DataTag<QueryKey, TData, TError>;
};
declare const updateSpace: (spaceId: string, updateSpaceDto: BodyType<UpdateSpaceDto>, options?: SecondParameter<typeof customInstance>) => Promise<UpdateSpace200AllOf>;
declare const getUpdateSpaceMutationOptions: <TError = ErrorType<void>, TContext = unknown>(options?: {
    mutation?: UseMutationOptions<Awaited<ReturnType<typeof updateSpace>>, TError, {
        spaceId: string;
        data: BodyType<UpdateSpaceDto>;
    }, TContext>;
    request?: SecondParameter<typeof customInstance>;
}) => UseMutationOptions<Awaited<ReturnType<typeof updateSpace>>, TError, {
    spaceId: string;
    data: BodyType<UpdateSpaceDto>;
}, TContext>;
type UpdateSpaceMutationResult = NonNullable<Awaited<ReturnType<typeof updateSpace>>>;
type UpdateSpaceMutationBody = BodyType<UpdateSpaceDto>;
type UpdateSpaceMutationError = ErrorType<void>;
declare const useUpdateSpace: <TError = ErrorType<void>, TContext = unknown>(options?: {
    mutation?: UseMutationOptions<Awaited<ReturnType<typeof updateSpace>>, TError, {
        spaceId: string;
        data: BodyType<UpdateSpaceDto>;
    }, TContext>;
    request?: SecondParameter<typeof customInstance>;
}, queryClient?: QueryClient) => UseMutationResult<Awaited<ReturnType<typeof updateSpace>>, TError, {
    spaceId: string;
    data: BodyType<UpdateSpaceDto>;
}, TContext>;
declare const deleteSpace: (spaceId: string, options?: SecondParameter<typeof customInstance>) => Promise<DeleteSpace200AllOf>;
declare const getDeleteSpaceMutationOptions: <TError = ErrorType<void>, TContext = unknown>(options?: {
    mutation?: UseMutationOptions<Awaited<ReturnType<typeof deleteSpace>>, TError, {
        spaceId: string;
    }, TContext>;
    request?: SecondParameter<typeof customInstance>;
}) => UseMutationOptions<Awaited<ReturnType<typeof deleteSpace>>, TError, {
    spaceId: string;
}, TContext>;
type DeleteSpaceMutationResult = NonNullable<Awaited<ReturnType<typeof deleteSpace>>>;
type DeleteSpaceMutationError = ErrorType<void>;
declare const useDeleteSpace: <TError = ErrorType<void>, TContext = unknown>(options?: {
    mutation?: UseMutationOptions<Awaited<ReturnType<typeof deleteSpace>>, TError, {
        spaceId: string;
    }, TContext>;
    request?: SecondParameter<typeof customInstance>;
}, queryClient?: QueryClient) => UseMutationResult<Awaited<ReturnType<typeof deleteSpace>>, TError, {
    spaceId: string;
}, TContext>;
declare const removeSpace: (spaceId: string, options?: SecondParameter<typeof customInstance>) => Promise<RemoveSpace200AllOf>;
declare const getRemoveSpaceMutationOptions: <TError = ErrorType<void>, TContext = unknown>(options?: {
    mutation?: UseMutationOptions<Awaited<ReturnType<typeof removeSpace>>, TError, {
        spaceId: string;
    }, TContext>;
    request?: SecondParameter<typeof customInstance>;
}) => UseMutationOptions<Awaited<ReturnType<typeof removeSpace>>, TError, {
    spaceId: string;
}, TContext>;
type RemoveSpaceMutationResult = NonNullable<Awaited<ReturnType<typeof removeSpace>>>;
type RemoveSpaceMutationError = ErrorType<void>;
declare const useRemoveSpace: <TError = ErrorType<void>, TContext = unknown>(options?: {
    mutation?: UseMutationOptions<Awaited<ReturnType<typeof removeSpace>>, TError, {
        spaceId: string;
    }, TContext>;
    request?: SecondParameter<typeof customInstance>;
}, queryClient?: QueryClient) => UseMutationResult<Awaited<ReturnType<typeof removeSpace>>, TError, {
    spaceId: string;
}, TContext>;
declare const createUser: (createUserDto: BodyType<CreateUserDto>, options?: SecondParameter<typeof customInstance>, signal?: AbortSignal) => Promise<CreateUser200AllOf>;
declare const getCreateUserMutationOptions: <TError = ErrorType<void>, TContext = unknown>(options?: {
    mutation?: UseMutationOptions<Awaited<ReturnType<typeof createUser>>, TError, {
        data: BodyType<CreateUserDto>;
    }, TContext>;
    request?: SecondParameter<typeof customInstance>;
}) => UseMutationOptions<Awaited<ReturnType<typeof createUser>>, TError, {
    data: BodyType<CreateUserDto>;
}, TContext>;
type CreateUserMutationResult = NonNullable<Awaited<ReturnType<typeof createUser>>>;
type CreateUserMutationBody = BodyType<CreateUserDto>;
type CreateUserMutationError = ErrorType<void>;
declare const useCreateUser: <TError = ErrorType<void>, TContext = unknown>(options?: {
    mutation?: UseMutationOptions<Awaited<ReturnType<typeof createUser>>, TError, {
        data: BodyType<CreateUserDto>;
    }, TContext>;
    request?: SecondParameter<typeof customInstance>;
}, queryClient?: QueryClient) => UseMutationResult<Awaited<ReturnType<typeof createUser>>, TError, {
    data: BodyType<CreateUserDto>;
}, TContext>;
declare const getUsersByQuery: (params?: GetUsersByQueryParams, options?: SecondParameter<typeof customInstance>, signal?: AbortSignal) => Promise<GetUsersByQuery200AllOf>;
declare const getGetUsersByQueryQueryKey: (params?: GetUsersByQueryParams) => readonly ["/api/v1/users", ...GetUsersByQueryParams[]];
declare const getGetUsersByQueryQueryOptions: <TData = Awaited<ReturnType<typeof getUsersByQuery>>, TError = ErrorType<void>>(params?: GetUsersByQueryParams, options?: {
    query?: Partial<UseQueryOptions<Awaited<ReturnType<typeof getUsersByQuery>>, TError, TData>>;
    request?: SecondParameter<typeof customInstance>;
}) => UseQueryOptions<Awaited<ReturnType<typeof getUsersByQuery>>, TError, TData> & {
    queryKey: DataTag<QueryKey, TData, TError>;
};
type GetUsersByQueryQueryResult = NonNullable<Awaited<ReturnType<typeof getUsersByQuery>>>;
type GetUsersByQueryQueryError = ErrorType<void>;
declare function useGetUsersByQuery<TData = Awaited<ReturnType<typeof getUsersByQuery>>, TError = ErrorType<void>>(params: undefined | GetUsersByQueryParams, options: {
    query: Partial<UseQueryOptions<Awaited<ReturnType<typeof getUsersByQuery>>, TError, TData>> & Pick<DefinedInitialDataOptions<Awaited<ReturnType<typeof getUsersByQuery>>, TError, Awaited<ReturnType<typeof getUsersByQuery>>>, "initialData">;
    request?: SecondParameter<typeof customInstance>;
}, queryClient?: QueryClient): DefinedUseQueryResult<TData, TError> & {
    queryKey: DataTag<QueryKey, TData, TError>;
};
declare function useGetUsersByQuery<TData = Awaited<ReturnType<typeof getUsersByQuery>>, TError = ErrorType<void>>(params?: GetUsersByQueryParams, options?: {
    query?: Partial<UseQueryOptions<Awaited<ReturnType<typeof getUsersByQuery>>, TError, TData>> & Pick<UndefinedInitialDataOptions<Awaited<ReturnType<typeof getUsersByQuery>>, TError, Awaited<ReturnType<typeof getUsersByQuery>>>, "initialData">;
    request?: SecondParameter<typeof customInstance>;
}, queryClient?: QueryClient): UseQueryResult<TData, TError> & {
    queryKey: DataTag<QueryKey, TData, TError>;
};
declare function useGetUsersByQuery<TData = Awaited<ReturnType<typeof getUsersByQuery>>, TError = ErrorType<void>>(params?: GetUsersByQueryParams, options?: {
    query?: Partial<UseQueryOptions<Awaited<ReturnType<typeof getUsersByQuery>>, TError, TData>>;
    request?: SecondParameter<typeof customInstance>;
}, queryClient?: QueryClient): UseQueryResult<TData, TError> & {
    queryKey: DataTag<QueryKey, TData, TError>;
};
declare const getGetUsersByQuerySuspenseQueryOptions: <TData = Awaited<ReturnType<typeof getUsersByQuery>>, TError = ErrorType<void>>(params?: GetUsersByQueryParams, options?: {
    query?: Partial<UseSuspenseQueryOptions<Awaited<ReturnType<typeof getUsersByQuery>>, TError, TData>>;
    request?: SecondParameter<typeof customInstance>;
}) => UseSuspenseQueryOptions<Awaited<ReturnType<typeof getUsersByQuery>>, TError, TData> & {
    queryKey: DataTag<QueryKey, TData, TError>;
};
type GetUsersByQuerySuspenseQueryResult = NonNullable<Awaited<ReturnType<typeof getUsersByQuery>>>;
type GetUsersByQuerySuspenseQueryError = ErrorType<void>;
declare function useGetUsersByQuerySuspense<TData = Awaited<ReturnType<typeof getUsersByQuery>>, TError = ErrorType<void>>(params: undefined | GetUsersByQueryParams, options: {
    query: Partial<UseSuspenseQueryOptions<Awaited<ReturnType<typeof getUsersByQuery>>, TError, TData>>;
    request?: SecondParameter<typeof customInstance>;
}, queryClient?: QueryClient): UseSuspenseQueryResult<TData, TError> & {
    queryKey: DataTag<QueryKey, TData, TError>;
};
declare function useGetUsersByQuerySuspense<TData = Awaited<ReturnType<typeof getUsersByQuery>>, TError = ErrorType<void>>(params?: GetUsersByQueryParams, options?: {
    query?: Partial<UseSuspenseQueryOptions<Awaited<ReturnType<typeof getUsersByQuery>>, TError, TData>>;
    request?: SecondParameter<typeof customInstance>;
}, queryClient?: QueryClient): UseSuspenseQueryResult<TData, TError> & {
    queryKey: DataTag<QueryKey, TData, TError>;
};
declare function useGetUsersByQuerySuspense<TData = Awaited<ReturnType<typeof getUsersByQuery>>, TError = ErrorType<void>>(params?: GetUsersByQueryParams, options?: {
    query?: Partial<UseSuspenseQueryOptions<Awaited<ReturnType<typeof getUsersByQuery>>, TError, TData>>;
    request?: SecondParameter<typeof customInstance>;
}, queryClient?: QueryClient): UseSuspenseQueryResult<TData, TError> & {
    queryKey: DataTag<QueryKey, TData, TError>;
};
declare const getGetUsersByQuerySuspenseInfiniteQueryOptions: <TData = InfiniteData<Awaited<ReturnType<typeof getUsersByQuery>>>, TError = ErrorType<void>>(params?: GetUsersByQueryParams, options?: {
    query?: Partial<UseSuspenseInfiniteQueryOptions<Awaited<ReturnType<typeof getUsersByQuery>>, TError, TData>>;
    request?: SecondParameter<typeof customInstance>;
}) => UseSuspenseInfiniteQueryOptions<Awaited<ReturnType<typeof getUsersByQuery>>, TError, TData> & {
    queryKey: DataTag<QueryKey, TData, TError>;
};
type GetUsersByQuerySuspenseInfiniteQueryResult = NonNullable<Awaited<ReturnType<typeof getUsersByQuery>>>;
type GetUsersByQuerySuspenseInfiniteQueryError = ErrorType<void>;
declare function useGetUsersByQuerySuspenseInfinite<TData = InfiniteData<Awaited<ReturnType<typeof getUsersByQuery>>>, TError = ErrorType<void>>(params: undefined | GetUsersByQueryParams, options: {
    query: Partial<UseSuspenseInfiniteQueryOptions<Awaited<ReturnType<typeof getUsersByQuery>>, TError, TData>>;
    request?: SecondParameter<typeof customInstance>;
}, queryClient?: QueryClient): UseSuspenseInfiniteQueryResult<TData, TError> & {
    queryKey: DataTag<QueryKey, TData, TError>;
};
declare function useGetUsersByQuerySuspenseInfinite<TData = InfiniteData<Awaited<ReturnType<typeof getUsersByQuery>>>, TError = ErrorType<void>>(params?: GetUsersByQueryParams, options?: {
    query?: Partial<UseSuspenseInfiniteQueryOptions<Awaited<ReturnType<typeof getUsersByQuery>>, TError, TData>>;
    request?: SecondParameter<typeof customInstance>;
}, queryClient?: QueryClient): UseSuspenseInfiniteQueryResult<TData, TError> & {
    queryKey: DataTag<QueryKey, TData, TError>;
};
declare function useGetUsersByQuerySuspenseInfinite<TData = InfiniteData<Awaited<ReturnType<typeof getUsersByQuery>>>, TError = ErrorType<void>>(params?: GetUsersByQueryParams, options?: {
    query?: Partial<UseSuspenseInfiniteQueryOptions<Awaited<ReturnType<typeof getUsersByQuery>>, TError, TData>>;
    request?: SecondParameter<typeof customInstance>;
}, queryClient?: QueryClient): UseSuspenseInfiniteQueryResult<TData, TError> & {
    queryKey: DataTag<QueryKey, TData, TError>;
};
declare const getUser: (userId: string, options?: SecondParameter<typeof customInstance>, signal?: AbortSignal) => Promise<GetUser200AllOf>;
declare const getGetUserQueryKey: (userId: string) => readonly [`/api/v1/users/${string}`];
declare const getGetUserQueryOptions: <TData = Awaited<ReturnType<typeof getUser>>, TError = ErrorType<void>>(userId: string, options?: {
    query?: Partial<UseQueryOptions<Awaited<ReturnType<typeof getUser>>, TError, TData>>;
    request?: SecondParameter<typeof customInstance>;
}) => UseQueryOptions<Awaited<ReturnType<typeof getUser>>, TError, TData> & {
    queryKey: DataTag<QueryKey, TData, TError>;
};
type GetUserQueryResult = NonNullable<Awaited<ReturnType<typeof getUser>>>;
type GetUserQueryError = ErrorType<void>;
declare function useGetUser<TData = Awaited<ReturnType<typeof getUser>>, TError = ErrorType<void>>(userId: string, options: {
    query: Partial<UseQueryOptions<Awaited<ReturnType<typeof getUser>>, TError, TData>> & Pick<DefinedInitialDataOptions<Awaited<ReturnType<typeof getUser>>, TError, Awaited<ReturnType<typeof getUser>>>, "initialData">;
    request?: SecondParameter<typeof customInstance>;
}, queryClient?: QueryClient): DefinedUseQueryResult<TData, TError> & {
    queryKey: DataTag<QueryKey, TData, TError>;
};
declare function useGetUser<TData = Awaited<ReturnType<typeof getUser>>, TError = ErrorType<void>>(userId: string, options?: {
    query?: Partial<UseQueryOptions<Awaited<ReturnType<typeof getUser>>, TError, TData>> & Pick<UndefinedInitialDataOptions<Awaited<ReturnType<typeof getUser>>, TError, Awaited<ReturnType<typeof getUser>>>, "initialData">;
    request?: SecondParameter<typeof customInstance>;
}, queryClient?: QueryClient): UseQueryResult<TData, TError> & {
    queryKey: DataTag<QueryKey, TData, TError>;
};
declare function useGetUser<TData = Awaited<ReturnType<typeof getUser>>, TError = ErrorType<void>>(userId: string, options?: {
    query?: Partial<UseQueryOptions<Awaited<ReturnType<typeof getUser>>, TError, TData>>;
    request?: SecondParameter<typeof customInstance>;
}, queryClient?: QueryClient): UseQueryResult<TData, TError> & {
    queryKey: DataTag<QueryKey, TData, TError>;
};
declare const getGetUserSuspenseQueryOptions: <TData = Awaited<ReturnType<typeof getUser>>, TError = ErrorType<void>>(userId: string, options?: {
    query?: Partial<UseSuspenseQueryOptions<Awaited<ReturnType<typeof getUser>>, TError, TData>>;
    request?: SecondParameter<typeof customInstance>;
}) => UseSuspenseQueryOptions<Awaited<ReturnType<typeof getUser>>, TError, TData> & {
    queryKey: DataTag<QueryKey, TData, TError>;
};
type GetUserSuspenseQueryResult = NonNullable<Awaited<ReturnType<typeof getUser>>>;
type GetUserSuspenseQueryError = ErrorType<void>;
declare function useGetUserSuspense<TData = Awaited<ReturnType<typeof getUser>>, TError = ErrorType<void>>(userId: string, options: {
    query: Partial<UseSuspenseQueryOptions<Awaited<ReturnType<typeof getUser>>, TError, TData>>;
    request?: SecondParameter<typeof customInstance>;
}, queryClient?: QueryClient): UseSuspenseQueryResult<TData, TError> & {
    queryKey: DataTag<QueryKey, TData, TError>;
};
declare function useGetUserSuspense<TData = Awaited<ReturnType<typeof getUser>>, TError = ErrorType<void>>(userId: string, options?: {
    query?: Partial<UseSuspenseQueryOptions<Awaited<ReturnType<typeof getUser>>, TError, TData>>;
    request?: SecondParameter<typeof customInstance>;
}, queryClient?: QueryClient): UseSuspenseQueryResult<TData, TError> & {
    queryKey: DataTag<QueryKey, TData, TError>;
};
declare function useGetUserSuspense<TData = Awaited<ReturnType<typeof getUser>>, TError = ErrorType<void>>(userId: string, options?: {
    query?: Partial<UseSuspenseQueryOptions<Awaited<ReturnType<typeof getUser>>, TError, TData>>;
    request?: SecondParameter<typeof customInstance>;
}, queryClient?: QueryClient): UseSuspenseQueryResult<TData, TError> & {
    queryKey: DataTag<QueryKey, TData, TError>;
};
declare const getGetUserSuspenseInfiniteQueryOptions: <TData = InfiniteData<Awaited<ReturnType<typeof getUser>>>, TError = ErrorType<void>>(userId: string, options?: {
    query?: Partial<UseSuspenseInfiniteQueryOptions<Awaited<ReturnType<typeof getUser>>, TError, TData>>;
    request?: SecondParameter<typeof customInstance>;
}) => UseSuspenseInfiniteQueryOptions<Awaited<ReturnType<typeof getUser>>, TError, TData> & {
    queryKey: DataTag<QueryKey, TData, TError>;
};
type GetUserSuspenseInfiniteQueryResult = NonNullable<Awaited<ReturnType<typeof getUser>>>;
type GetUserSuspenseInfiniteQueryError = ErrorType<void>;
declare function useGetUserSuspenseInfinite<TData = InfiniteData<Awaited<ReturnType<typeof getUser>>>, TError = ErrorType<void>>(userId: string, options: {
    query: Partial<UseSuspenseInfiniteQueryOptions<Awaited<ReturnType<typeof getUser>>, TError, TData>>;
    request?: SecondParameter<typeof customInstance>;
}, queryClient?: QueryClient): UseSuspenseInfiniteQueryResult<TData, TError> & {
    queryKey: DataTag<QueryKey, TData, TError>;
};
declare function useGetUserSuspenseInfinite<TData = InfiniteData<Awaited<ReturnType<typeof getUser>>>, TError = ErrorType<void>>(userId: string, options?: {
    query?: Partial<UseSuspenseInfiniteQueryOptions<Awaited<ReturnType<typeof getUser>>, TError, TData>>;
    request?: SecondParameter<typeof customInstance>;
}, queryClient?: QueryClient): UseSuspenseInfiniteQueryResult<TData, TError> & {
    queryKey: DataTag<QueryKey, TData, TError>;
};
declare function useGetUserSuspenseInfinite<TData = InfiniteData<Awaited<ReturnType<typeof getUser>>>, TError = ErrorType<void>>(userId: string, options?: {
    query?: Partial<UseSuspenseInfiniteQueryOptions<Awaited<ReturnType<typeof getUser>>, TError, TData>>;
    request?: SecondParameter<typeof customInstance>;
}, queryClient?: QueryClient): UseSuspenseInfiniteQueryResult<TData, TError> & {
    queryKey: DataTag<QueryKey, TData, TError>;
};
declare const updateUser: (userId: string, updateUserDto: BodyType<UpdateUserDto>, options?: SecondParameter<typeof customInstance>) => Promise<UpdateUser200AllOf>;
declare const getUpdateUserMutationOptions: <TError = ErrorType<void>, TContext = unknown>(options?: {
    mutation?: UseMutationOptions<Awaited<ReturnType<typeof updateUser>>, TError, {
        userId: string;
        data: BodyType<UpdateUserDto>;
    }, TContext>;
    request?: SecondParameter<typeof customInstance>;
}) => UseMutationOptions<Awaited<ReturnType<typeof updateUser>>, TError, {
    userId: string;
    data: BodyType<UpdateUserDto>;
}, TContext>;
type UpdateUserMutationResult = NonNullable<Awaited<ReturnType<typeof updateUser>>>;
type UpdateUserMutationBody = BodyType<UpdateUserDto>;
type UpdateUserMutationError = ErrorType<void>;
declare const useUpdateUser: <TError = ErrorType<void>, TContext = unknown>(options?: {
    mutation?: UseMutationOptions<Awaited<ReturnType<typeof updateUser>>, TError, {
        userId: string;
        data: BodyType<UpdateUserDto>;
    }, TContext>;
    request?: SecondParameter<typeof customInstance>;
}, queryClient?: QueryClient) => UseMutationResult<Awaited<ReturnType<typeof updateUser>>, TError, {
    userId: string;
    data: BodyType<UpdateUserDto>;
}, TContext>;
declare const deleteUser: (userId: string, options?: SecondParameter<typeof customInstance>) => Promise<DeleteUser200AllOf>;
declare const getDeleteUserMutationOptions: <TError = ErrorType<void>, TContext = unknown>(options?: {
    mutation?: UseMutationOptions<Awaited<ReturnType<typeof deleteUser>>, TError, {
        userId: string;
    }, TContext>;
    request?: SecondParameter<typeof customInstance>;
}) => UseMutationOptions<Awaited<ReturnType<typeof deleteUser>>, TError, {
    userId: string;
}, TContext>;
type DeleteUserMutationResult = NonNullable<Awaited<ReturnType<typeof deleteUser>>>;
type DeleteUserMutationError = ErrorType<void>;
declare const useDeleteUser: <TError = ErrorType<void>, TContext = unknown>(options?: {
    mutation?: UseMutationOptions<Awaited<ReturnType<typeof deleteUser>>, TError, {
        userId: string;
    }, TContext>;
    request?: SecondParameter<typeof customInstance>;
}, queryClient?: QueryClient) => UseMutationResult<Awaited<ReturnType<typeof deleteUser>>, TError, {
    userId: string;
}, TContext>;
declare const removeUsers: (removeUsersBody: BodyType<string[]>, options?: SecondParameter<typeof customInstance>) => Promise<RemoveUsers200AllOf>;
declare const getRemoveUsersMutationOptions: <TError = ErrorType<void>, TContext = unknown>(options?: {
    mutation?: UseMutationOptions<Awaited<ReturnType<typeof removeUsers>>, TError, {
        data: BodyType<string[]>;
    }, TContext>;
    request?: SecondParameter<typeof customInstance>;
}) => UseMutationOptions<Awaited<ReturnType<typeof removeUsers>>, TError, {
    data: BodyType<string[]>;
}, TContext>;
type RemoveUsersMutationResult = NonNullable<Awaited<ReturnType<typeof removeUsers>>>;
type RemoveUsersMutationBody = BodyType<string[]>;
type RemoveUsersMutationError = ErrorType<void>;
declare const useRemoveUsers: <TError = ErrorType<void>, TContext = unknown>(options?: {
    mutation?: UseMutationOptions<Awaited<ReturnType<typeof removeUsers>>, TError, {
        data: BodyType<string[]>;
    }, TContext>;
    request?: SecondParameter<typeof customInstance>;
}, queryClient?: QueryClient) => UseMutationResult<Awaited<ReturnType<typeof removeUsers>>, TError, {
    data: BodyType<string[]>;
}, TContext>;
declare const removeUser: (userId: string, options?: SecondParameter<typeof customInstance>) => Promise<RemoveUser200AllOf>;
declare const getRemoveUserMutationOptions: <TError = ErrorType<void>, TContext = unknown>(options?: {
    mutation?: UseMutationOptions<Awaited<ReturnType<typeof removeUser>>, TError, {
        userId: string;
    }, TContext>;
    request?: SecondParameter<typeof customInstance>;
}) => UseMutationOptions<Awaited<ReturnType<typeof removeUser>>, TError, {
    userId: string;
}, TContext>;
type RemoveUserMutationResult = NonNullable<Awaited<ReturnType<typeof removeUser>>>;
type RemoveUserMutationError = ErrorType<void>;
declare const useRemoveUser: <TError = ErrorType<void>, TContext = unknown>(options?: {
    mutation?: UseMutationOptions<Awaited<ReturnType<typeof removeUser>>, TError, {
        userId: string;
    }, TContext>;
    request?: SecondParameter<typeof customInstance>;
}, queryClient?: QueryClient) => UseMutationResult<Awaited<ReturnType<typeof removeUser>>, TError, {
    userId: string;
}, TContext>;
declare const createRole: (createRoleDto: BodyType<CreateRoleDto>, options?: SecondParameter<typeof customInstance>, signal?: AbortSignal) => Promise<CreateRole200AllOf>;
declare const getCreateRoleMutationOptions: <TError = ErrorType<void>, TContext = unknown>(options?: {
    mutation?: UseMutationOptions<Awaited<ReturnType<typeof createRole>>, TError, {
        data: BodyType<CreateRoleDto>;
    }, TContext>;
    request?: SecondParameter<typeof customInstance>;
}) => UseMutationOptions<Awaited<ReturnType<typeof createRole>>, TError, {
    data: BodyType<CreateRoleDto>;
}, TContext>;
type CreateRoleMutationResult = NonNullable<Awaited<ReturnType<typeof createRole>>>;
type CreateRoleMutationBody = BodyType<CreateRoleDto>;
type CreateRoleMutationError = ErrorType<void>;
declare const useCreateRole: <TError = ErrorType<void>, TContext = unknown>(options?: {
    mutation?: UseMutationOptions<Awaited<ReturnType<typeof createRole>>, TError, {
        data: BodyType<CreateRoleDto>;
    }, TContext>;
    request?: SecondParameter<typeof customInstance>;
}, queryClient?: QueryClient) => UseMutationResult<Awaited<ReturnType<typeof createRole>>, TError, {
    data: BodyType<CreateRoleDto>;
}, TContext>;
declare const getRolesByQuery: (params?: GetRolesByQueryParams, options?: SecondParameter<typeof customInstance>, signal?: AbortSignal) => Promise<GetRolesByQuery200AllOf>;
declare const getGetRolesByQueryQueryKey: (params?: GetRolesByQueryParams) => readonly ["/api/v1/roles", ...GetRolesByQueryParams[]];
declare const getGetRolesByQueryQueryOptions: <TData = Awaited<ReturnType<typeof getRolesByQuery>>, TError = ErrorType<void>>(params?: GetRolesByQueryParams, options?: {
    query?: Partial<UseQueryOptions<Awaited<ReturnType<typeof getRolesByQuery>>, TError, TData>>;
    request?: SecondParameter<typeof customInstance>;
}) => UseQueryOptions<Awaited<ReturnType<typeof getRolesByQuery>>, TError, TData> & {
    queryKey: DataTag<QueryKey, TData, TError>;
};
type GetRolesByQueryQueryResult = NonNullable<Awaited<ReturnType<typeof getRolesByQuery>>>;
type GetRolesByQueryQueryError = ErrorType<void>;
declare function useGetRolesByQuery<TData = Awaited<ReturnType<typeof getRolesByQuery>>, TError = ErrorType<void>>(params: undefined | GetRolesByQueryParams, options: {
    query: Partial<UseQueryOptions<Awaited<ReturnType<typeof getRolesByQuery>>, TError, TData>> & Pick<DefinedInitialDataOptions<Awaited<ReturnType<typeof getRolesByQuery>>, TError, Awaited<ReturnType<typeof getRolesByQuery>>>, "initialData">;
    request?: SecondParameter<typeof customInstance>;
}, queryClient?: QueryClient): DefinedUseQueryResult<TData, TError> & {
    queryKey: DataTag<QueryKey, TData, TError>;
};
declare function useGetRolesByQuery<TData = Awaited<ReturnType<typeof getRolesByQuery>>, TError = ErrorType<void>>(params?: GetRolesByQueryParams, options?: {
    query?: Partial<UseQueryOptions<Awaited<ReturnType<typeof getRolesByQuery>>, TError, TData>> & Pick<UndefinedInitialDataOptions<Awaited<ReturnType<typeof getRolesByQuery>>, TError, Awaited<ReturnType<typeof getRolesByQuery>>>, "initialData">;
    request?: SecondParameter<typeof customInstance>;
}, queryClient?: QueryClient): UseQueryResult<TData, TError> & {
    queryKey: DataTag<QueryKey, TData, TError>;
};
declare function useGetRolesByQuery<TData = Awaited<ReturnType<typeof getRolesByQuery>>, TError = ErrorType<void>>(params?: GetRolesByQueryParams, options?: {
    query?: Partial<UseQueryOptions<Awaited<ReturnType<typeof getRolesByQuery>>, TError, TData>>;
    request?: SecondParameter<typeof customInstance>;
}, queryClient?: QueryClient): UseQueryResult<TData, TError> & {
    queryKey: DataTag<QueryKey, TData, TError>;
};
declare const getGetRolesByQuerySuspenseQueryOptions: <TData = Awaited<ReturnType<typeof getRolesByQuery>>, TError = ErrorType<void>>(params?: GetRolesByQueryParams, options?: {
    query?: Partial<UseSuspenseQueryOptions<Awaited<ReturnType<typeof getRolesByQuery>>, TError, TData>>;
    request?: SecondParameter<typeof customInstance>;
}) => UseSuspenseQueryOptions<Awaited<ReturnType<typeof getRolesByQuery>>, TError, TData> & {
    queryKey: DataTag<QueryKey, TData, TError>;
};
type GetRolesByQuerySuspenseQueryResult = NonNullable<Awaited<ReturnType<typeof getRolesByQuery>>>;
type GetRolesByQuerySuspenseQueryError = ErrorType<void>;
declare function useGetRolesByQuerySuspense<TData = Awaited<ReturnType<typeof getRolesByQuery>>, TError = ErrorType<void>>(params: undefined | GetRolesByQueryParams, options: {
    query: Partial<UseSuspenseQueryOptions<Awaited<ReturnType<typeof getRolesByQuery>>, TError, TData>>;
    request?: SecondParameter<typeof customInstance>;
}, queryClient?: QueryClient): UseSuspenseQueryResult<TData, TError> & {
    queryKey: DataTag<QueryKey, TData, TError>;
};
declare function useGetRolesByQuerySuspense<TData = Awaited<ReturnType<typeof getRolesByQuery>>, TError = ErrorType<void>>(params?: GetRolesByQueryParams, options?: {
    query?: Partial<UseSuspenseQueryOptions<Awaited<ReturnType<typeof getRolesByQuery>>, TError, TData>>;
    request?: SecondParameter<typeof customInstance>;
}, queryClient?: QueryClient): UseSuspenseQueryResult<TData, TError> & {
    queryKey: DataTag<QueryKey, TData, TError>;
};
declare function useGetRolesByQuerySuspense<TData = Awaited<ReturnType<typeof getRolesByQuery>>, TError = ErrorType<void>>(params?: GetRolesByQueryParams, options?: {
    query?: Partial<UseSuspenseQueryOptions<Awaited<ReturnType<typeof getRolesByQuery>>, TError, TData>>;
    request?: SecondParameter<typeof customInstance>;
}, queryClient?: QueryClient): UseSuspenseQueryResult<TData, TError> & {
    queryKey: DataTag<QueryKey, TData, TError>;
};
declare const getGetRolesByQuerySuspenseInfiniteQueryOptions: <TData = InfiniteData<Awaited<ReturnType<typeof getRolesByQuery>>>, TError = ErrorType<void>>(params?: GetRolesByQueryParams, options?: {
    query?: Partial<UseSuspenseInfiniteQueryOptions<Awaited<ReturnType<typeof getRolesByQuery>>, TError, TData>>;
    request?: SecondParameter<typeof customInstance>;
}) => UseSuspenseInfiniteQueryOptions<Awaited<ReturnType<typeof getRolesByQuery>>, TError, TData> & {
    queryKey: DataTag<QueryKey, TData, TError>;
};
type GetRolesByQuerySuspenseInfiniteQueryResult = NonNullable<Awaited<ReturnType<typeof getRolesByQuery>>>;
type GetRolesByQuerySuspenseInfiniteQueryError = ErrorType<void>;
declare function useGetRolesByQuerySuspenseInfinite<TData = InfiniteData<Awaited<ReturnType<typeof getRolesByQuery>>>, TError = ErrorType<void>>(params: undefined | GetRolesByQueryParams, options: {
    query: Partial<UseSuspenseInfiniteQueryOptions<Awaited<ReturnType<typeof getRolesByQuery>>, TError, TData>>;
    request?: SecondParameter<typeof customInstance>;
}, queryClient?: QueryClient): UseSuspenseInfiniteQueryResult<TData, TError> & {
    queryKey: DataTag<QueryKey, TData, TError>;
};
declare function useGetRolesByQuerySuspenseInfinite<TData = InfiniteData<Awaited<ReturnType<typeof getRolesByQuery>>>, TError = ErrorType<void>>(params?: GetRolesByQueryParams, options?: {
    query?: Partial<UseSuspenseInfiniteQueryOptions<Awaited<ReturnType<typeof getRolesByQuery>>, TError, TData>>;
    request?: SecondParameter<typeof customInstance>;
}, queryClient?: QueryClient): UseSuspenseInfiniteQueryResult<TData, TError> & {
    queryKey: DataTag<QueryKey, TData, TError>;
};
declare function useGetRolesByQuerySuspenseInfinite<TData = InfiniteData<Awaited<ReturnType<typeof getRolesByQuery>>>, TError = ErrorType<void>>(params?: GetRolesByQueryParams, options?: {
    query?: Partial<UseSuspenseInfiniteQueryOptions<Awaited<ReturnType<typeof getRolesByQuery>>, TError, TData>>;
    request?: SecondParameter<typeof customInstance>;
}, queryClient?: QueryClient): UseSuspenseInfiniteQueryResult<TData, TError> & {
    queryKey: DataTag<QueryKey, TData, TError>;
};
declare const getRole: (roleId: string, options?: SecondParameter<typeof customInstance>, signal?: AbortSignal) => Promise<GetRole200AllOf>;
declare const getGetRoleQueryKey: (roleId: string) => readonly [`/api/v1/roles/${string}`];
declare const getGetRoleQueryOptions: <TData = Awaited<ReturnType<typeof getRole>>, TError = ErrorType<void>>(roleId: string, options?: {
    query?: Partial<UseQueryOptions<Awaited<ReturnType<typeof getRole>>, TError, TData>>;
    request?: SecondParameter<typeof customInstance>;
}) => UseQueryOptions<Awaited<ReturnType<typeof getRole>>, TError, TData> & {
    queryKey: DataTag<QueryKey, TData, TError>;
};
type GetRoleQueryResult = NonNullable<Awaited<ReturnType<typeof getRole>>>;
type GetRoleQueryError = ErrorType<void>;
declare function useGetRole<TData = Awaited<ReturnType<typeof getRole>>, TError = ErrorType<void>>(roleId: string, options: {
    query: Partial<UseQueryOptions<Awaited<ReturnType<typeof getRole>>, TError, TData>> & Pick<DefinedInitialDataOptions<Awaited<ReturnType<typeof getRole>>, TError, Awaited<ReturnType<typeof getRole>>>, "initialData">;
    request?: SecondParameter<typeof customInstance>;
}, queryClient?: QueryClient): DefinedUseQueryResult<TData, TError> & {
    queryKey: DataTag<QueryKey, TData, TError>;
};
declare function useGetRole<TData = Awaited<ReturnType<typeof getRole>>, TError = ErrorType<void>>(roleId: string, options?: {
    query?: Partial<UseQueryOptions<Awaited<ReturnType<typeof getRole>>, TError, TData>> & Pick<UndefinedInitialDataOptions<Awaited<ReturnType<typeof getRole>>, TError, Awaited<ReturnType<typeof getRole>>>, "initialData">;
    request?: SecondParameter<typeof customInstance>;
}, queryClient?: QueryClient): UseQueryResult<TData, TError> & {
    queryKey: DataTag<QueryKey, TData, TError>;
};
declare function useGetRole<TData = Awaited<ReturnType<typeof getRole>>, TError = ErrorType<void>>(roleId: string, options?: {
    query?: Partial<UseQueryOptions<Awaited<ReturnType<typeof getRole>>, TError, TData>>;
    request?: SecondParameter<typeof customInstance>;
}, queryClient?: QueryClient): UseQueryResult<TData, TError> & {
    queryKey: DataTag<QueryKey, TData, TError>;
};
declare const getGetRoleSuspenseQueryOptions: <TData = Awaited<ReturnType<typeof getRole>>, TError = ErrorType<void>>(roleId: string, options?: {
    query?: Partial<UseSuspenseQueryOptions<Awaited<ReturnType<typeof getRole>>, TError, TData>>;
    request?: SecondParameter<typeof customInstance>;
}) => UseSuspenseQueryOptions<Awaited<ReturnType<typeof getRole>>, TError, TData> & {
    queryKey: DataTag<QueryKey, TData, TError>;
};
type GetRoleSuspenseQueryResult = NonNullable<Awaited<ReturnType<typeof getRole>>>;
type GetRoleSuspenseQueryError = ErrorType<void>;
declare function useGetRoleSuspense<TData = Awaited<ReturnType<typeof getRole>>, TError = ErrorType<void>>(roleId: string, options: {
    query: Partial<UseSuspenseQueryOptions<Awaited<ReturnType<typeof getRole>>, TError, TData>>;
    request?: SecondParameter<typeof customInstance>;
}, queryClient?: QueryClient): UseSuspenseQueryResult<TData, TError> & {
    queryKey: DataTag<QueryKey, TData, TError>;
};
declare function useGetRoleSuspense<TData = Awaited<ReturnType<typeof getRole>>, TError = ErrorType<void>>(roleId: string, options?: {
    query?: Partial<UseSuspenseQueryOptions<Awaited<ReturnType<typeof getRole>>, TError, TData>>;
    request?: SecondParameter<typeof customInstance>;
}, queryClient?: QueryClient): UseSuspenseQueryResult<TData, TError> & {
    queryKey: DataTag<QueryKey, TData, TError>;
};
declare function useGetRoleSuspense<TData = Awaited<ReturnType<typeof getRole>>, TError = ErrorType<void>>(roleId: string, options?: {
    query?: Partial<UseSuspenseQueryOptions<Awaited<ReturnType<typeof getRole>>, TError, TData>>;
    request?: SecondParameter<typeof customInstance>;
}, queryClient?: QueryClient): UseSuspenseQueryResult<TData, TError> & {
    queryKey: DataTag<QueryKey, TData, TError>;
};
declare const getGetRoleSuspenseInfiniteQueryOptions: <TData = InfiniteData<Awaited<ReturnType<typeof getRole>>>, TError = ErrorType<void>>(roleId: string, options?: {
    query?: Partial<UseSuspenseInfiniteQueryOptions<Awaited<ReturnType<typeof getRole>>, TError, TData>>;
    request?: SecondParameter<typeof customInstance>;
}) => UseSuspenseInfiniteQueryOptions<Awaited<ReturnType<typeof getRole>>, TError, TData> & {
    queryKey: DataTag<QueryKey, TData, TError>;
};
type GetRoleSuspenseInfiniteQueryResult = NonNullable<Awaited<ReturnType<typeof getRole>>>;
type GetRoleSuspenseInfiniteQueryError = ErrorType<void>;
declare function useGetRoleSuspenseInfinite<TData = InfiniteData<Awaited<ReturnType<typeof getRole>>>, TError = ErrorType<void>>(roleId: string, options: {
    query: Partial<UseSuspenseInfiniteQueryOptions<Awaited<ReturnType<typeof getRole>>, TError, TData>>;
    request?: SecondParameter<typeof customInstance>;
}, queryClient?: QueryClient): UseSuspenseInfiniteQueryResult<TData, TError> & {
    queryKey: DataTag<QueryKey, TData, TError>;
};
declare function useGetRoleSuspenseInfinite<TData = InfiniteData<Awaited<ReturnType<typeof getRole>>>, TError = ErrorType<void>>(roleId: string, options?: {
    query?: Partial<UseSuspenseInfiniteQueryOptions<Awaited<ReturnType<typeof getRole>>, TError, TData>>;
    request?: SecondParameter<typeof customInstance>;
}, queryClient?: QueryClient): UseSuspenseInfiniteQueryResult<TData, TError> & {
    queryKey: DataTag<QueryKey, TData, TError>;
};
declare function useGetRoleSuspenseInfinite<TData = InfiniteData<Awaited<ReturnType<typeof getRole>>>, TError = ErrorType<void>>(roleId: string, options?: {
    query?: Partial<UseSuspenseInfiniteQueryOptions<Awaited<ReturnType<typeof getRole>>, TError, TData>>;
    request?: SecondParameter<typeof customInstance>;
}, queryClient?: QueryClient): UseSuspenseInfiniteQueryResult<TData, TError> & {
    queryKey: DataTag<QueryKey, TData, TError>;
};
declare const updateRole: (roleId: string, updateRoleDto: BodyType<UpdateRoleDto>, options?: SecondParameter<typeof customInstance>) => Promise<UpdateRole200AllOf>;
declare const getUpdateRoleMutationOptions: <TError = ErrorType<void>, TContext = unknown>(options?: {
    mutation?: UseMutationOptions<Awaited<ReturnType<typeof updateRole>>, TError, {
        roleId: string;
        data: BodyType<UpdateRoleDto>;
    }, TContext>;
    request?: SecondParameter<typeof customInstance>;
}) => UseMutationOptions<Awaited<ReturnType<typeof updateRole>>, TError, {
    roleId: string;
    data: BodyType<UpdateRoleDto>;
}, TContext>;
type UpdateRoleMutationResult = NonNullable<Awaited<ReturnType<typeof updateRole>>>;
type UpdateRoleMutationBody = BodyType<UpdateRoleDto>;
type UpdateRoleMutationError = ErrorType<void>;
declare const useUpdateRole: <TError = ErrorType<void>, TContext = unknown>(options?: {
    mutation?: UseMutationOptions<Awaited<ReturnType<typeof updateRole>>, TError, {
        roleId: string;
        data: BodyType<UpdateRoleDto>;
    }, TContext>;
    request?: SecondParameter<typeof customInstance>;
}, queryClient?: QueryClient) => UseMutationResult<Awaited<ReturnType<typeof updateRole>>, TError, {
    roleId: string;
    data: BodyType<UpdateRoleDto>;
}, TContext>;
declare const deleteRole: (roleId: string, options?: SecondParameter<typeof customInstance>) => Promise<DeleteRole200AllOf>;
declare const getDeleteRoleMutationOptions: <TError = ErrorType<void>, TContext = unknown>(options?: {
    mutation?: UseMutationOptions<Awaited<ReturnType<typeof deleteRole>>, TError, {
        roleId: string;
    }, TContext>;
    request?: SecondParameter<typeof customInstance>;
}) => UseMutationOptions<Awaited<ReturnType<typeof deleteRole>>, TError, {
    roleId: string;
}, TContext>;
type DeleteRoleMutationResult = NonNullable<Awaited<ReturnType<typeof deleteRole>>>;
type DeleteRoleMutationError = ErrorType<void>;
declare const useDeleteRole: <TError = ErrorType<void>, TContext = unknown>(options?: {
    mutation?: UseMutationOptions<Awaited<ReturnType<typeof deleteRole>>, TError, {
        roleId: string;
    }, TContext>;
    request?: SecondParameter<typeof customInstance>;
}, queryClient?: QueryClient) => UseMutationResult<Awaited<ReturnType<typeof deleteRole>>, TError, {
    roleId: string;
}, TContext>;
declare const removeRole: (roleId: string, options?: SecondParameter<typeof customInstance>) => Promise<RemoveRole200AllOf>;
declare const getRemoveRoleMutationOptions: <TError = ErrorType<void>, TContext = unknown>(options?: {
    mutation?: UseMutationOptions<Awaited<ReturnType<typeof removeRole>>, TError, {
        roleId: string;
    }, TContext>;
    request?: SecondParameter<typeof customInstance>;
}) => UseMutationOptions<Awaited<ReturnType<typeof removeRole>>, TError, {
    roleId: string;
}, TContext>;
type RemoveRoleMutationResult = NonNullable<Awaited<ReturnType<typeof removeRole>>>;
type RemoveRoleMutationError = ErrorType<void>;
declare const useRemoveRole: <TError = ErrorType<void>, TContext = unknown>(options?: {
    mutation?: UseMutationOptions<Awaited<ReturnType<typeof removeRole>>, TError, {
        roleId: string;
    }, TContext>;
    request?: SecondParameter<typeof customInstance>;
}, queryClient?: QueryClient) => UseMutationResult<Awaited<ReturnType<typeof removeRole>>, TError, {
    roleId: string;
}, TContext>;
declare const createSubject: (_function: BodyType<Function>, options?: SecondParameter<typeof customInstance>, signal?: AbortSignal) => Promise<CreateSubject200AllOf>;
declare const getCreateSubjectMutationOptions: <TError = ErrorType<void>, TContext = unknown>(options?: {
    mutation?: UseMutationOptions<Awaited<ReturnType<typeof createSubject>>, TError, {
        data: BodyType<Function>;
    }, TContext>;
    request?: SecondParameter<typeof customInstance>;
}) => UseMutationOptions<Awaited<ReturnType<typeof createSubject>>, TError, {
    data: BodyType<Function>;
}, TContext>;
type CreateSubjectMutationResult = NonNullable<Awaited<ReturnType<typeof createSubject>>>;
type CreateSubjectMutationBody = BodyType<Function>;
type CreateSubjectMutationError = ErrorType<void>;
declare const useCreateSubject: <TError = ErrorType<void>, TContext = unknown>(options?: {
    mutation?: UseMutationOptions<Awaited<ReturnType<typeof createSubject>>, TError, {
        data: BodyType<Function>;
    }, TContext>;
    request?: SecondParameter<typeof customInstance>;
}, queryClient?: QueryClient) => UseMutationResult<Awaited<ReturnType<typeof createSubject>>, TError, {
    data: BodyType<Function>;
}, TContext>;
declare const getSubjectsByQuery: (options?: SecondParameter<typeof customInstance>, signal?: AbortSignal) => Promise<GetSubjectsByQuery200AllOf>;
declare const getGetSubjectsByQueryQueryKey: () => readonly ["/api/v1/subjects"];
declare const getGetSubjectsByQueryQueryOptions: <TData = Awaited<ReturnType<typeof getSubjectsByQuery>>, TError = ErrorType<void>>(options?: {
    query?: Partial<UseQueryOptions<Awaited<ReturnType<typeof getSubjectsByQuery>>, TError, TData>>;
    request?: SecondParameter<typeof customInstance>;
}) => UseQueryOptions<Awaited<ReturnType<typeof getSubjectsByQuery>>, TError, TData> & {
    queryKey: DataTag<QueryKey, TData, TError>;
};
type GetSubjectsByQueryQueryResult = NonNullable<Awaited<ReturnType<typeof getSubjectsByQuery>>>;
type GetSubjectsByQueryQueryError = ErrorType<void>;
declare function useGetSubjectsByQuery<TData = Awaited<ReturnType<typeof getSubjectsByQuery>>, TError = ErrorType<void>>(options: {
    query: Partial<UseQueryOptions<Awaited<ReturnType<typeof getSubjectsByQuery>>, TError, TData>> & Pick<DefinedInitialDataOptions<Awaited<ReturnType<typeof getSubjectsByQuery>>, TError, Awaited<ReturnType<typeof getSubjectsByQuery>>>, "initialData">;
    request?: SecondParameter<typeof customInstance>;
}, queryClient?: QueryClient): DefinedUseQueryResult<TData, TError> & {
    queryKey: DataTag<QueryKey, TData, TError>;
};
declare function useGetSubjectsByQuery<TData = Awaited<ReturnType<typeof getSubjectsByQuery>>, TError = ErrorType<void>>(options?: {
    query?: Partial<UseQueryOptions<Awaited<ReturnType<typeof getSubjectsByQuery>>, TError, TData>> & Pick<UndefinedInitialDataOptions<Awaited<ReturnType<typeof getSubjectsByQuery>>, TError, Awaited<ReturnType<typeof getSubjectsByQuery>>>, "initialData">;
    request?: SecondParameter<typeof customInstance>;
}, queryClient?: QueryClient): UseQueryResult<TData, TError> & {
    queryKey: DataTag<QueryKey, TData, TError>;
};
declare function useGetSubjectsByQuery<TData = Awaited<ReturnType<typeof getSubjectsByQuery>>, TError = ErrorType<void>>(options?: {
    query?: Partial<UseQueryOptions<Awaited<ReturnType<typeof getSubjectsByQuery>>, TError, TData>>;
    request?: SecondParameter<typeof customInstance>;
}, queryClient?: QueryClient): UseQueryResult<TData, TError> & {
    queryKey: DataTag<QueryKey, TData, TError>;
};
declare const getGetSubjectsByQuerySuspenseQueryOptions: <TData = Awaited<ReturnType<typeof getSubjectsByQuery>>, TError = ErrorType<void>>(options?: {
    query?: Partial<UseSuspenseQueryOptions<Awaited<ReturnType<typeof getSubjectsByQuery>>, TError, TData>>;
    request?: SecondParameter<typeof customInstance>;
}) => UseSuspenseQueryOptions<Awaited<ReturnType<typeof getSubjectsByQuery>>, TError, TData> & {
    queryKey: DataTag<QueryKey, TData, TError>;
};
type GetSubjectsByQuerySuspenseQueryResult = NonNullable<Awaited<ReturnType<typeof getSubjectsByQuery>>>;
type GetSubjectsByQuerySuspenseQueryError = ErrorType<void>;
declare function useGetSubjectsByQuerySuspense<TData = Awaited<ReturnType<typeof getSubjectsByQuery>>, TError = ErrorType<void>>(options: {
    query: Partial<UseSuspenseQueryOptions<Awaited<ReturnType<typeof getSubjectsByQuery>>, TError, TData>>;
    request?: SecondParameter<typeof customInstance>;
}, queryClient?: QueryClient): UseSuspenseQueryResult<TData, TError> & {
    queryKey: DataTag<QueryKey, TData, TError>;
};
declare function useGetSubjectsByQuerySuspense<TData = Awaited<ReturnType<typeof getSubjectsByQuery>>, TError = ErrorType<void>>(options?: {
    query?: Partial<UseSuspenseQueryOptions<Awaited<ReturnType<typeof getSubjectsByQuery>>, TError, TData>>;
    request?: SecondParameter<typeof customInstance>;
}, queryClient?: QueryClient): UseSuspenseQueryResult<TData, TError> & {
    queryKey: DataTag<QueryKey, TData, TError>;
};
declare function useGetSubjectsByQuerySuspense<TData = Awaited<ReturnType<typeof getSubjectsByQuery>>, TError = ErrorType<void>>(options?: {
    query?: Partial<UseSuspenseQueryOptions<Awaited<ReturnType<typeof getSubjectsByQuery>>, TError, TData>>;
    request?: SecondParameter<typeof customInstance>;
}, queryClient?: QueryClient): UseSuspenseQueryResult<TData, TError> & {
    queryKey: DataTag<QueryKey, TData, TError>;
};
declare const getGetSubjectsByQuerySuspenseInfiniteQueryOptions: <TData = InfiniteData<Awaited<ReturnType<typeof getSubjectsByQuery>>>, TError = ErrorType<void>>(options?: {
    query?: Partial<UseSuspenseInfiniteQueryOptions<Awaited<ReturnType<typeof getSubjectsByQuery>>, TError, TData>>;
    request?: SecondParameter<typeof customInstance>;
}) => UseSuspenseInfiniteQueryOptions<Awaited<ReturnType<typeof getSubjectsByQuery>>, TError, TData> & {
    queryKey: DataTag<QueryKey, TData, TError>;
};
type GetSubjectsByQuerySuspenseInfiniteQueryResult = NonNullable<Awaited<ReturnType<typeof getSubjectsByQuery>>>;
type GetSubjectsByQuerySuspenseInfiniteQueryError = ErrorType<void>;
declare function useGetSubjectsByQuerySuspenseInfinite<TData = InfiniteData<Awaited<ReturnType<typeof getSubjectsByQuery>>>, TError = ErrorType<void>>(options: {
    query: Partial<UseSuspenseInfiniteQueryOptions<Awaited<ReturnType<typeof getSubjectsByQuery>>, TError, TData>>;
    request?: SecondParameter<typeof customInstance>;
}, queryClient?: QueryClient): UseSuspenseInfiniteQueryResult<TData, TError> & {
    queryKey: DataTag<QueryKey, TData, TError>;
};
declare function useGetSubjectsByQuerySuspenseInfinite<TData = InfiniteData<Awaited<ReturnType<typeof getSubjectsByQuery>>>, TError = ErrorType<void>>(options?: {
    query?: Partial<UseSuspenseInfiniteQueryOptions<Awaited<ReturnType<typeof getSubjectsByQuery>>, TError, TData>>;
    request?: SecondParameter<typeof customInstance>;
}, queryClient?: QueryClient): UseSuspenseInfiniteQueryResult<TData, TError> & {
    queryKey: DataTag<QueryKey, TData, TError>;
};
declare function useGetSubjectsByQuerySuspenseInfinite<TData = InfiniteData<Awaited<ReturnType<typeof getSubjectsByQuery>>>, TError = ErrorType<void>>(options?: {
    query?: Partial<UseSuspenseInfiniteQueryOptions<Awaited<ReturnType<typeof getSubjectsByQuery>>, TError, TData>>;
    request?: SecondParameter<typeof customInstance>;
}, queryClient?: QueryClient): UseSuspenseInfiniteQueryResult<TData, TError> & {
    queryKey: DataTag<QueryKey, TData, TError>;
};
declare const getSubject: (subjectId: string, options?: SecondParameter<typeof customInstance>, signal?: AbortSignal) => Promise<GetSubject200AllOf>;
declare const getGetSubjectQueryKey: (subjectId: string) => readonly [`/api/v1/subjects/${string}`];
declare const getGetSubjectQueryOptions: <TData = Awaited<ReturnType<typeof getSubject>>, TError = ErrorType<void>>(subjectId: string, options?: {
    query?: Partial<UseQueryOptions<Awaited<ReturnType<typeof getSubject>>, TError, TData>>;
    request?: SecondParameter<typeof customInstance>;
}) => UseQueryOptions<Awaited<ReturnType<typeof getSubject>>, TError, TData> & {
    queryKey: DataTag<QueryKey, TData, TError>;
};
type GetSubjectQueryResult = NonNullable<Awaited<ReturnType<typeof getSubject>>>;
type GetSubjectQueryError = ErrorType<void>;
declare function useGetSubject<TData = Awaited<ReturnType<typeof getSubject>>, TError = ErrorType<void>>(subjectId: string, options: {
    query: Partial<UseQueryOptions<Awaited<ReturnType<typeof getSubject>>, TError, TData>> & Pick<DefinedInitialDataOptions<Awaited<ReturnType<typeof getSubject>>, TError, Awaited<ReturnType<typeof getSubject>>>, "initialData">;
    request?: SecondParameter<typeof customInstance>;
}, queryClient?: QueryClient): DefinedUseQueryResult<TData, TError> & {
    queryKey: DataTag<QueryKey, TData, TError>;
};
declare function useGetSubject<TData = Awaited<ReturnType<typeof getSubject>>, TError = ErrorType<void>>(subjectId: string, options?: {
    query?: Partial<UseQueryOptions<Awaited<ReturnType<typeof getSubject>>, TError, TData>> & Pick<UndefinedInitialDataOptions<Awaited<ReturnType<typeof getSubject>>, TError, Awaited<ReturnType<typeof getSubject>>>, "initialData">;
    request?: SecondParameter<typeof customInstance>;
}, queryClient?: QueryClient): UseQueryResult<TData, TError> & {
    queryKey: DataTag<QueryKey, TData, TError>;
};
declare function useGetSubject<TData = Awaited<ReturnType<typeof getSubject>>, TError = ErrorType<void>>(subjectId: string, options?: {
    query?: Partial<UseQueryOptions<Awaited<ReturnType<typeof getSubject>>, TError, TData>>;
    request?: SecondParameter<typeof customInstance>;
}, queryClient?: QueryClient): UseQueryResult<TData, TError> & {
    queryKey: DataTag<QueryKey, TData, TError>;
};
declare const getGetSubjectSuspenseQueryOptions: <TData = Awaited<ReturnType<typeof getSubject>>, TError = ErrorType<void>>(subjectId: string, options?: {
    query?: Partial<UseSuspenseQueryOptions<Awaited<ReturnType<typeof getSubject>>, TError, TData>>;
    request?: SecondParameter<typeof customInstance>;
}) => UseSuspenseQueryOptions<Awaited<ReturnType<typeof getSubject>>, TError, TData> & {
    queryKey: DataTag<QueryKey, TData, TError>;
};
type GetSubjectSuspenseQueryResult = NonNullable<Awaited<ReturnType<typeof getSubject>>>;
type GetSubjectSuspenseQueryError = ErrorType<void>;
declare function useGetSubjectSuspense<TData = Awaited<ReturnType<typeof getSubject>>, TError = ErrorType<void>>(subjectId: string, options: {
    query: Partial<UseSuspenseQueryOptions<Awaited<ReturnType<typeof getSubject>>, TError, TData>>;
    request?: SecondParameter<typeof customInstance>;
}, queryClient?: QueryClient): UseSuspenseQueryResult<TData, TError> & {
    queryKey: DataTag<QueryKey, TData, TError>;
};
declare function useGetSubjectSuspense<TData = Awaited<ReturnType<typeof getSubject>>, TError = ErrorType<void>>(subjectId: string, options?: {
    query?: Partial<UseSuspenseQueryOptions<Awaited<ReturnType<typeof getSubject>>, TError, TData>>;
    request?: SecondParameter<typeof customInstance>;
}, queryClient?: QueryClient): UseSuspenseQueryResult<TData, TError> & {
    queryKey: DataTag<QueryKey, TData, TError>;
};
declare function useGetSubjectSuspense<TData = Awaited<ReturnType<typeof getSubject>>, TError = ErrorType<void>>(subjectId: string, options?: {
    query?: Partial<UseSuspenseQueryOptions<Awaited<ReturnType<typeof getSubject>>, TError, TData>>;
    request?: SecondParameter<typeof customInstance>;
}, queryClient?: QueryClient): UseSuspenseQueryResult<TData, TError> & {
    queryKey: DataTag<QueryKey, TData, TError>;
};
declare const getGetSubjectSuspenseInfiniteQueryOptions: <TData = InfiniteData<Awaited<ReturnType<typeof getSubject>>>, TError = ErrorType<void>>(subjectId: string, options?: {
    query?: Partial<UseSuspenseInfiniteQueryOptions<Awaited<ReturnType<typeof getSubject>>, TError, TData>>;
    request?: SecondParameter<typeof customInstance>;
}) => UseSuspenseInfiniteQueryOptions<Awaited<ReturnType<typeof getSubject>>, TError, TData> & {
    queryKey: DataTag<QueryKey, TData, TError>;
};
type GetSubjectSuspenseInfiniteQueryResult = NonNullable<Awaited<ReturnType<typeof getSubject>>>;
type GetSubjectSuspenseInfiniteQueryError = ErrorType<void>;
declare function useGetSubjectSuspenseInfinite<TData = InfiniteData<Awaited<ReturnType<typeof getSubject>>>, TError = ErrorType<void>>(subjectId: string, options: {
    query: Partial<UseSuspenseInfiniteQueryOptions<Awaited<ReturnType<typeof getSubject>>, TError, TData>>;
    request?: SecondParameter<typeof customInstance>;
}, queryClient?: QueryClient): UseSuspenseInfiniteQueryResult<TData, TError> & {
    queryKey: DataTag<QueryKey, TData, TError>;
};
declare function useGetSubjectSuspenseInfinite<TData = InfiniteData<Awaited<ReturnType<typeof getSubject>>>, TError = ErrorType<void>>(subjectId: string, options?: {
    query?: Partial<UseSuspenseInfiniteQueryOptions<Awaited<ReturnType<typeof getSubject>>, TError, TData>>;
    request?: SecondParameter<typeof customInstance>;
}, queryClient?: QueryClient): UseSuspenseInfiniteQueryResult<TData, TError> & {
    queryKey: DataTag<QueryKey, TData, TError>;
};
declare function useGetSubjectSuspenseInfinite<TData = InfiniteData<Awaited<ReturnType<typeof getSubject>>>, TError = ErrorType<void>>(subjectId: string, options?: {
    query?: Partial<UseSuspenseInfiniteQueryOptions<Awaited<ReturnType<typeof getSubject>>, TError, TData>>;
    request?: SecondParameter<typeof customInstance>;
}, queryClient?: QueryClient): UseSuspenseInfiniteQueryResult<TData, TError> & {
    queryKey: DataTag<QueryKey, TData, TError>;
};
declare const updateSubject: (subjectId: string, _function: BodyType<Function>, options?: SecondParameter<typeof customInstance>) => Promise<UpdateSubject200AllOf>;
declare const getUpdateSubjectMutationOptions: <TError = ErrorType<void>, TContext = unknown>(options?: {
    mutation?: UseMutationOptions<Awaited<ReturnType<typeof updateSubject>>, TError, {
        subjectId: string;
        data: BodyType<Function>;
    }, TContext>;
    request?: SecondParameter<typeof customInstance>;
}) => UseMutationOptions<Awaited<ReturnType<typeof updateSubject>>, TError, {
    subjectId: string;
    data: BodyType<Function>;
}, TContext>;
type UpdateSubjectMutationResult = NonNullable<Awaited<ReturnType<typeof updateSubject>>>;
type UpdateSubjectMutationBody = BodyType<Function>;
type UpdateSubjectMutationError = ErrorType<void>;
declare const useUpdateSubject: <TError = ErrorType<void>, TContext = unknown>(options?: {
    mutation?: UseMutationOptions<Awaited<ReturnType<typeof updateSubject>>, TError, {
        subjectId: string;
        data: BodyType<Function>;
    }, TContext>;
    request?: SecondParameter<typeof customInstance>;
}, queryClient?: QueryClient) => UseMutationResult<Awaited<ReturnType<typeof updateSubject>>, TError, {
    subjectId: string;
    data: BodyType<Function>;
}, TContext>;
declare const deleteSubject: (subjectId: string, options?: SecondParameter<typeof customInstance>) => Promise<DeleteSubject200AllOf>;
declare const getDeleteSubjectMutationOptions: <TError = ErrorType<void>, TContext = unknown>(options?: {
    mutation?: UseMutationOptions<Awaited<ReturnType<typeof deleteSubject>>, TError, {
        subjectId: string;
    }, TContext>;
    request?: SecondParameter<typeof customInstance>;
}) => UseMutationOptions<Awaited<ReturnType<typeof deleteSubject>>, TError, {
    subjectId: string;
}, TContext>;
type DeleteSubjectMutationResult = NonNullable<Awaited<ReturnType<typeof deleteSubject>>>;
type DeleteSubjectMutationError = ErrorType<void>;
declare const useDeleteSubject: <TError = ErrorType<void>, TContext = unknown>(options?: {
    mutation?: UseMutationOptions<Awaited<ReturnType<typeof deleteSubject>>, TError, {
        subjectId: string;
    }, TContext>;
    request?: SecondParameter<typeof customInstance>;
}, queryClient?: QueryClient) => UseMutationResult<Awaited<ReturnType<typeof deleteSubject>>, TError, {
    subjectId: string;
}, TContext>;
declare const removeSubjects: (removeSubjectsBody: BodyType<string[]>, options?: SecondParameter<typeof customInstance>) => Promise<RemoveSubjects200AllOf>;
declare const getRemoveSubjectsMutationOptions: <TError = ErrorType<void>, TContext = unknown>(options?: {
    mutation?: UseMutationOptions<Awaited<ReturnType<typeof removeSubjects>>, TError, {
        data: BodyType<string[]>;
    }, TContext>;
    request?: SecondParameter<typeof customInstance>;
}) => UseMutationOptions<Awaited<ReturnType<typeof removeSubjects>>, TError, {
    data: BodyType<string[]>;
}, TContext>;
type RemoveSubjectsMutationResult = NonNullable<Awaited<ReturnType<typeof removeSubjects>>>;
type RemoveSubjectsMutationBody = BodyType<string[]>;
type RemoveSubjectsMutationError = ErrorType<void>;
declare const useRemoveSubjects: <TError = ErrorType<void>, TContext = unknown>(options?: {
    mutation?: UseMutationOptions<Awaited<ReturnType<typeof removeSubjects>>, TError, {
        data: BodyType<string[]>;
    }, TContext>;
    request?: SecondParameter<typeof customInstance>;
}, queryClient?: QueryClient) => UseMutationResult<Awaited<ReturnType<typeof removeSubjects>>, TError, {
    data: BodyType<string[]>;
}, TContext>;
declare const removeSubject: (subjectId: string, options?: SecondParameter<typeof customInstance>) => Promise<RemoveSubject200AllOf>;
declare const getRemoveSubjectMutationOptions: <TError = ErrorType<void>, TContext = unknown>(options?: {
    mutation?: UseMutationOptions<Awaited<ReturnType<typeof removeSubject>>, TError, {
        subjectId: string;
    }, TContext>;
    request?: SecondParameter<typeof customInstance>;
}) => UseMutationOptions<Awaited<ReturnType<typeof removeSubject>>, TError, {
    subjectId: string;
}, TContext>;
type RemoveSubjectMutationResult = NonNullable<Awaited<ReturnType<typeof removeSubject>>>;
type RemoveSubjectMutationError = ErrorType<void>;
declare const useRemoveSubject: <TError = ErrorType<void>, TContext = unknown>(options?: {
    mutation?: UseMutationOptions<Awaited<ReturnType<typeof removeSubject>>, TError, {
        subjectId: string;
    }, TContext>;
    request?: SecondParameter<typeof customInstance>;
}, queryClient?: QueryClient) => UseMutationResult<Awaited<ReturnType<typeof removeSubject>>, TError, {
    subjectId: string;
}, TContext>;
declare const createTimeline: (_function: BodyType<Function>, options?: SecondParameter<typeof customInstance>, signal?: AbortSignal) => Promise<CreateTimeline200AllOf>;
declare const getCreateTimelineMutationOptions: <TError = ErrorType<void>, TContext = unknown>(options?: {
    mutation?: UseMutationOptions<Awaited<ReturnType<typeof createTimeline>>, TError, {
        data: BodyType<Function>;
    }, TContext>;
    request?: SecondParameter<typeof customInstance>;
}) => UseMutationOptions<Awaited<ReturnType<typeof createTimeline>>, TError, {
    data: BodyType<Function>;
}, TContext>;
type CreateTimelineMutationResult = NonNullable<Awaited<ReturnType<typeof createTimeline>>>;
type CreateTimelineMutationBody = BodyType<Function>;
type CreateTimelineMutationError = ErrorType<void>;
declare const useCreateTimeline: <TError = ErrorType<void>, TContext = unknown>(options?: {
    mutation?: UseMutationOptions<Awaited<ReturnType<typeof createTimeline>>, TError, {
        data: BodyType<Function>;
    }, TContext>;
    request?: SecondParameter<typeof customInstance>;
}, queryClient?: QueryClient) => UseMutationResult<Awaited<ReturnType<typeof createTimeline>>, TError, {
    data: BodyType<Function>;
}, TContext>;
declare const getTimelinesByQuery: (options?: SecondParameter<typeof customInstance>, signal?: AbortSignal) => Promise<GetTimelinesByQuery200AllOf>;
declare const getGetTimelinesByQueryQueryKey: () => readonly ["/api/v1/timelines"];
declare const getGetTimelinesByQueryQueryOptions: <TData = Awaited<ReturnType<typeof getTimelinesByQuery>>, TError = ErrorType<void>>(options?: {
    query?: Partial<UseQueryOptions<Awaited<ReturnType<typeof getTimelinesByQuery>>, TError, TData>>;
    request?: SecondParameter<typeof customInstance>;
}) => UseQueryOptions<Awaited<ReturnType<typeof getTimelinesByQuery>>, TError, TData> & {
    queryKey: DataTag<QueryKey, TData, TError>;
};
type GetTimelinesByQueryQueryResult = NonNullable<Awaited<ReturnType<typeof getTimelinesByQuery>>>;
type GetTimelinesByQueryQueryError = ErrorType<void>;
declare function useGetTimelinesByQuery<TData = Awaited<ReturnType<typeof getTimelinesByQuery>>, TError = ErrorType<void>>(options: {
    query: Partial<UseQueryOptions<Awaited<ReturnType<typeof getTimelinesByQuery>>, TError, TData>> & Pick<DefinedInitialDataOptions<Awaited<ReturnType<typeof getTimelinesByQuery>>, TError, Awaited<ReturnType<typeof getTimelinesByQuery>>>, "initialData">;
    request?: SecondParameter<typeof customInstance>;
}, queryClient?: QueryClient): DefinedUseQueryResult<TData, TError> & {
    queryKey: DataTag<QueryKey, TData, TError>;
};
declare function useGetTimelinesByQuery<TData = Awaited<ReturnType<typeof getTimelinesByQuery>>, TError = ErrorType<void>>(options?: {
    query?: Partial<UseQueryOptions<Awaited<ReturnType<typeof getTimelinesByQuery>>, TError, TData>> & Pick<UndefinedInitialDataOptions<Awaited<ReturnType<typeof getTimelinesByQuery>>, TError, Awaited<ReturnType<typeof getTimelinesByQuery>>>, "initialData">;
    request?: SecondParameter<typeof customInstance>;
}, queryClient?: QueryClient): UseQueryResult<TData, TError> & {
    queryKey: DataTag<QueryKey, TData, TError>;
};
declare function useGetTimelinesByQuery<TData = Awaited<ReturnType<typeof getTimelinesByQuery>>, TError = ErrorType<void>>(options?: {
    query?: Partial<UseQueryOptions<Awaited<ReturnType<typeof getTimelinesByQuery>>, TError, TData>>;
    request?: SecondParameter<typeof customInstance>;
}, queryClient?: QueryClient): UseQueryResult<TData, TError> & {
    queryKey: DataTag<QueryKey, TData, TError>;
};
declare const getGetTimelinesByQuerySuspenseQueryOptions: <TData = Awaited<ReturnType<typeof getTimelinesByQuery>>, TError = ErrorType<void>>(options?: {
    query?: Partial<UseSuspenseQueryOptions<Awaited<ReturnType<typeof getTimelinesByQuery>>, TError, TData>>;
    request?: SecondParameter<typeof customInstance>;
}) => UseSuspenseQueryOptions<Awaited<ReturnType<typeof getTimelinesByQuery>>, TError, TData> & {
    queryKey: DataTag<QueryKey, TData, TError>;
};
type GetTimelinesByQuerySuspenseQueryResult = NonNullable<Awaited<ReturnType<typeof getTimelinesByQuery>>>;
type GetTimelinesByQuerySuspenseQueryError = ErrorType<void>;
declare function useGetTimelinesByQuerySuspense<TData = Awaited<ReturnType<typeof getTimelinesByQuery>>, TError = ErrorType<void>>(options: {
    query: Partial<UseSuspenseQueryOptions<Awaited<ReturnType<typeof getTimelinesByQuery>>, TError, TData>>;
    request?: SecondParameter<typeof customInstance>;
}, queryClient?: QueryClient): UseSuspenseQueryResult<TData, TError> & {
    queryKey: DataTag<QueryKey, TData, TError>;
};
declare function useGetTimelinesByQuerySuspense<TData = Awaited<ReturnType<typeof getTimelinesByQuery>>, TError = ErrorType<void>>(options?: {
    query?: Partial<UseSuspenseQueryOptions<Awaited<ReturnType<typeof getTimelinesByQuery>>, TError, TData>>;
    request?: SecondParameter<typeof customInstance>;
}, queryClient?: QueryClient): UseSuspenseQueryResult<TData, TError> & {
    queryKey: DataTag<QueryKey, TData, TError>;
};
declare function useGetTimelinesByQuerySuspense<TData = Awaited<ReturnType<typeof getTimelinesByQuery>>, TError = ErrorType<void>>(options?: {
    query?: Partial<UseSuspenseQueryOptions<Awaited<ReturnType<typeof getTimelinesByQuery>>, TError, TData>>;
    request?: SecondParameter<typeof customInstance>;
}, queryClient?: QueryClient): UseSuspenseQueryResult<TData, TError> & {
    queryKey: DataTag<QueryKey, TData, TError>;
};
declare const getGetTimelinesByQuerySuspenseInfiniteQueryOptions: <TData = InfiniteData<Awaited<ReturnType<typeof getTimelinesByQuery>>>, TError = ErrorType<void>>(options?: {
    query?: Partial<UseSuspenseInfiniteQueryOptions<Awaited<ReturnType<typeof getTimelinesByQuery>>, TError, TData>>;
    request?: SecondParameter<typeof customInstance>;
}) => UseSuspenseInfiniteQueryOptions<Awaited<ReturnType<typeof getTimelinesByQuery>>, TError, TData> & {
    queryKey: DataTag<QueryKey, TData, TError>;
};
type GetTimelinesByQuerySuspenseInfiniteQueryResult = NonNullable<Awaited<ReturnType<typeof getTimelinesByQuery>>>;
type GetTimelinesByQuerySuspenseInfiniteQueryError = ErrorType<void>;
declare function useGetTimelinesByQuerySuspenseInfinite<TData = InfiniteData<Awaited<ReturnType<typeof getTimelinesByQuery>>>, TError = ErrorType<void>>(options: {
    query: Partial<UseSuspenseInfiniteQueryOptions<Awaited<ReturnType<typeof getTimelinesByQuery>>, TError, TData>>;
    request?: SecondParameter<typeof customInstance>;
}, queryClient?: QueryClient): UseSuspenseInfiniteQueryResult<TData, TError> & {
    queryKey: DataTag<QueryKey, TData, TError>;
};
declare function useGetTimelinesByQuerySuspenseInfinite<TData = InfiniteData<Awaited<ReturnType<typeof getTimelinesByQuery>>>, TError = ErrorType<void>>(options?: {
    query?: Partial<UseSuspenseInfiniteQueryOptions<Awaited<ReturnType<typeof getTimelinesByQuery>>, TError, TData>>;
    request?: SecondParameter<typeof customInstance>;
}, queryClient?: QueryClient): UseSuspenseInfiniteQueryResult<TData, TError> & {
    queryKey: DataTag<QueryKey, TData, TError>;
};
declare function useGetTimelinesByQuerySuspenseInfinite<TData = InfiniteData<Awaited<ReturnType<typeof getTimelinesByQuery>>>, TError = ErrorType<void>>(options?: {
    query?: Partial<UseSuspenseInfiniteQueryOptions<Awaited<ReturnType<typeof getTimelinesByQuery>>, TError, TData>>;
    request?: SecondParameter<typeof customInstance>;
}, queryClient?: QueryClient): UseSuspenseInfiniteQueryResult<TData, TError> & {
    queryKey: DataTag<QueryKey, TData, TError>;
};
declare const getTimeline: (timelineId: string, options?: SecondParameter<typeof customInstance>, signal?: AbortSignal) => Promise<GetTimeline200AllOf>;
declare const getGetTimelineQueryKey: (timelineId: string) => readonly [`/api/v1/timelines/${string}`];
declare const getGetTimelineQueryOptions: <TData = Awaited<ReturnType<typeof getTimeline>>, TError = ErrorType<void>>(timelineId: string, options?: {
    query?: Partial<UseQueryOptions<Awaited<ReturnType<typeof getTimeline>>, TError, TData>>;
    request?: SecondParameter<typeof customInstance>;
}) => UseQueryOptions<Awaited<ReturnType<typeof getTimeline>>, TError, TData> & {
    queryKey: DataTag<QueryKey, TData, TError>;
};
type GetTimelineQueryResult = NonNullable<Awaited<ReturnType<typeof getTimeline>>>;
type GetTimelineQueryError = ErrorType<void>;
declare function useGetTimeline<TData = Awaited<ReturnType<typeof getTimeline>>, TError = ErrorType<void>>(timelineId: string, options: {
    query: Partial<UseQueryOptions<Awaited<ReturnType<typeof getTimeline>>, TError, TData>> & Pick<DefinedInitialDataOptions<Awaited<ReturnType<typeof getTimeline>>, TError, Awaited<ReturnType<typeof getTimeline>>>, "initialData">;
    request?: SecondParameter<typeof customInstance>;
}, queryClient?: QueryClient): DefinedUseQueryResult<TData, TError> & {
    queryKey: DataTag<QueryKey, TData, TError>;
};
declare function useGetTimeline<TData = Awaited<ReturnType<typeof getTimeline>>, TError = ErrorType<void>>(timelineId: string, options?: {
    query?: Partial<UseQueryOptions<Awaited<ReturnType<typeof getTimeline>>, TError, TData>> & Pick<UndefinedInitialDataOptions<Awaited<ReturnType<typeof getTimeline>>, TError, Awaited<ReturnType<typeof getTimeline>>>, "initialData">;
    request?: SecondParameter<typeof customInstance>;
}, queryClient?: QueryClient): UseQueryResult<TData, TError> & {
    queryKey: DataTag<QueryKey, TData, TError>;
};
declare function useGetTimeline<TData = Awaited<ReturnType<typeof getTimeline>>, TError = ErrorType<void>>(timelineId: string, options?: {
    query?: Partial<UseQueryOptions<Awaited<ReturnType<typeof getTimeline>>, TError, TData>>;
    request?: SecondParameter<typeof customInstance>;
}, queryClient?: QueryClient): UseQueryResult<TData, TError> & {
    queryKey: DataTag<QueryKey, TData, TError>;
};
declare const getGetTimelineSuspenseQueryOptions: <TData = Awaited<ReturnType<typeof getTimeline>>, TError = ErrorType<void>>(timelineId: string, options?: {
    query?: Partial<UseSuspenseQueryOptions<Awaited<ReturnType<typeof getTimeline>>, TError, TData>>;
    request?: SecondParameter<typeof customInstance>;
}) => UseSuspenseQueryOptions<Awaited<ReturnType<typeof getTimeline>>, TError, TData> & {
    queryKey: DataTag<QueryKey, TData, TError>;
};
type GetTimelineSuspenseQueryResult = NonNullable<Awaited<ReturnType<typeof getTimeline>>>;
type GetTimelineSuspenseQueryError = ErrorType<void>;
declare function useGetTimelineSuspense<TData = Awaited<ReturnType<typeof getTimeline>>, TError = ErrorType<void>>(timelineId: string, options: {
    query: Partial<UseSuspenseQueryOptions<Awaited<ReturnType<typeof getTimeline>>, TError, TData>>;
    request?: SecondParameter<typeof customInstance>;
}, queryClient?: QueryClient): UseSuspenseQueryResult<TData, TError> & {
    queryKey: DataTag<QueryKey, TData, TError>;
};
declare function useGetTimelineSuspense<TData = Awaited<ReturnType<typeof getTimeline>>, TError = ErrorType<void>>(timelineId: string, options?: {
    query?: Partial<UseSuspenseQueryOptions<Awaited<ReturnType<typeof getTimeline>>, TError, TData>>;
    request?: SecondParameter<typeof customInstance>;
}, queryClient?: QueryClient): UseSuspenseQueryResult<TData, TError> & {
    queryKey: DataTag<QueryKey, TData, TError>;
};
declare function useGetTimelineSuspense<TData = Awaited<ReturnType<typeof getTimeline>>, TError = ErrorType<void>>(timelineId: string, options?: {
    query?: Partial<UseSuspenseQueryOptions<Awaited<ReturnType<typeof getTimeline>>, TError, TData>>;
    request?: SecondParameter<typeof customInstance>;
}, queryClient?: QueryClient): UseSuspenseQueryResult<TData, TError> & {
    queryKey: DataTag<QueryKey, TData, TError>;
};
declare const getGetTimelineSuspenseInfiniteQueryOptions: <TData = InfiniteData<Awaited<ReturnType<typeof getTimeline>>>, TError = ErrorType<void>>(timelineId: string, options?: {
    query?: Partial<UseSuspenseInfiniteQueryOptions<Awaited<ReturnType<typeof getTimeline>>, TError, TData>>;
    request?: SecondParameter<typeof customInstance>;
}) => UseSuspenseInfiniteQueryOptions<Awaited<ReturnType<typeof getTimeline>>, TError, TData> & {
    queryKey: DataTag<QueryKey, TData, TError>;
};
type GetTimelineSuspenseInfiniteQueryResult = NonNullable<Awaited<ReturnType<typeof getTimeline>>>;
type GetTimelineSuspenseInfiniteQueryError = ErrorType<void>;
declare function useGetTimelineSuspenseInfinite<TData = InfiniteData<Awaited<ReturnType<typeof getTimeline>>>, TError = ErrorType<void>>(timelineId: string, options: {
    query: Partial<UseSuspenseInfiniteQueryOptions<Awaited<ReturnType<typeof getTimeline>>, TError, TData>>;
    request?: SecondParameter<typeof customInstance>;
}, queryClient?: QueryClient): UseSuspenseInfiniteQueryResult<TData, TError> & {
    queryKey: DataTag<QueryKey, TData, TError>;
};
declare function useGetTimelineSuspenseInfinite<TData = InfiniteData<Awaited<ReturnType<typeof getTimeline>>>, TError = ErrorType<void>>(timelineId: string, options?: {
    query?: Partial<UseSuspenseInfiniteQueryOptions<Awaited<ReturnType<typeof getTimeline>>, TError, TData>>;
    request?: SecondParameter<typeof customInstance>;
}, queryClient?: QueryClient): UseSuspenseInfiniteQueryResult<TData, TError> & {
    queryKey: DataTag<QueryKey, TData, TError>;
};
declare function useGetTimelineSuspenseInfinite<TData = InfiniteData<Awaited<ReturnType<typeof getTimeline>>>, TError = ErrorType<void>>(timelineId: string, options?: {
    query?: Partial<UseSuspenseInfiniteQueryOptions<Awaited<ReturnType<typeof getTimeline>>, TError, TData>>;
    request?: SecondParameter<typeof customInstance>;
}, queryClient?: QueryClient): UseSuspenseInfiniteQueryResult<TData, TError> & {
    queryKey: DataTag<QueryKey, TData, TError>;
};
declare const updateTimeline: (timelineId: string, _function: BodyType<Function>, options?: SecondParameter<typeof customInstance>) => Promise<UpdateTimeline200AllOf>;
declare const getUpdateTimelineMutationOptions: <TError = ErrorType<void>, TContext = unknown>(options?: {
    mutation?: UseMutationOptions<Awaited<ReturnType<typeof updateTimeline>>, TError, {
        timelineId: string;
        data: BodyType<Function>;
    }, TContext>;
    request?: SecondParameter<typeof customInstance>;
}) => UseMutationOptions<Awaited<ReturnType<typeof updateTimeline>>, TError, {
    timelineId: string;
    data: BodyType<Function>;
}, TContext>;
type UpdateTimelineMutationResult = NonNullable<Awaited<ReturnType<typeof updateTimeline>>>;
type UpdateTimelineMutationBody = BodyType<Function>;
type UpdateTimelineMutationError = ErrorType<void>;
declare const useUpdateTimeline: <TError = ErrorType<void>, TContext = unknown>(options?: {
    mutation?: UseMutationOptions<Awaited<ReturnType<typeof updateTimeline>>, TError, {
        timelineId: string;
        data: BodyType<Function>;
    }, TContext>;
    request?: SecondParameter<typeof customInstance>;
}, queryClient?: QueryClient) => UseMutationResult<Awaited<ReturnType<typeof updateTimeline>>, TError, {
    timelineId: string;
    data: BodyType<Function>;
}, TContext>;
declare const deleteTimeline: (timelineId: string, options?: SecondParameter<typeof customInstance>) => Promise<DeleteTimeline200AllOf>;
declare const getDeleteTimelineMutationOptions: <TError = ErrorType<void>, TContext = unknown>(options?: {
    mutation?: UseMutationOptions<Awaited<ReturnType<typeof deleteTimeline>>, TError, {
        timelineId: string;
    }, TContext>;
    request?: SecondParameter<typeof customInstance>;
}) => UseMutationOptions<Awaited<ReturnType<typeof deleteTimeline>>, TError, {
    timelineId: string;
}, TContext>;
type DeleteTimelineMutationResult = NonNullable<Awaited<ReturnType<typeof deleteTimeline>>>;
type DeleteTimelineMutationError = ErrorType<void>;
declare const useDeleteTimeline: <TError = ErrorType<void>, TContext = unknown>(options?: {
    mutation?: UseMutationOptions<Awaited<ReturnType<typeof deleteTimeline>>, TError, {
        timelineId: string;
    }, TContext>;
    request?: SecondParameter<typeof customInstance>;
}, queryClient?: QueryClient) => UseMutationResult<Awaited<ReturnType<typeof deleteTimeline>>, TError, {
    timelineId: string;
}, TContext>;
declare const removeTimelines: (removeTimelinesBody: BodyType<string[]>, options?: SecondParameter<typeof customInstance>) => Promise<RemoveTimelines200AllOf>;
declare const getRemoveTimelinesMutationOptions: <TError = ErrorType<void>, TContext = unknown>(options?: {
    mutation?: UseMutationOptions<Awaited<ReturnType<typeof removeTimelines>>, TError, {
        data: BodyType<string[]>;
    }, TContext>;
    request?: SecondParameter<typeof customInstance>;
}) => UseMutationOptions<Awaited<ReturnType<typeof removeTimelines>>, TError, {
    data: BodyType<string[]>;
}, TContext>;
type RemoveTimelinesMutationResult = NonNullable<Awaited<ReturnType<typeof removeTimelines>>>;
type RemoveTimelinesMutationBody = BodyType<string[]>;
type RemoveTimelinesMutationError = ErrorType<void>;
declare const useRemoveTimelines: <TError = ErrorType<void>, TContext = unknown>(options?: {
    mutation?: UseMutationOptions<Awaited<ReturnType<typeof removeTimelines>>, TError, {
        data: BodyType<string[]>;
    }, TContext>;
    request?: SecondParameter<typeof customInstance>;
}, queryClient?: QueryClient) => UseMutationResult<Awaited<ReturnType<typeof removeTimelines>>, TError, {
    data: BodyType<string[]>;
}, TContext>;
declare const removeTimeline: (timelineId: string, options?: SecondParameter<typeof customInstance>) => Promise<RemoveTimeline200AllOf>;
declare const getRemoveTimelineMutationOptions: <TError = ErrorType<void>, TContext = unknown>(options?: {
    mutation?: UseMutationOptions<Awaited<ReturnType<typeof removeTimeline>>, TError, {
        timelineId: string;
    }, TContext>;
    request?: SecondParameter<typeof customInstance>;
}) => UseMutationOptions<Awaited<ReturnType<typeof removeTimeline>>, TError, {
    timelineId: string;
}, TContext>;
type RemoveTimelineMutationResult = NonNullable<Awaited<ReturnType<typeof removeTimeline>>>;
type RemoveTimelineMutationError = ErrorType<void>;
declare const useRemoveTimeline: <TError = ErrorType<void>, TContext = unknown>(options?: {
    mutation?: UseMutationOptions<Awaited<ReturnType<typeof removeTimeline>>, TError, {
        timelineId: string;
    }, TContext>;
    request?: SecondParameter<typeof customInstance>;
}, queryClient?: QueryClient) => UseMutationResult<Awaited<ReturnType<typeof removeTimeline>>, TError, {
    timelineId: string;
}, TContext>;
declare const createSession: (_function: BodyType<Function>, options?: SecondParameter<typeof customInstance>, signal?: AbortSignal) => Promise<CreateSession200AllOf>;
declare const getCreateSessionMutationOptions: <TError = ErrorType<void>, TContext = unknown>(options?: {
    mutation?: UseMutationOptions<Awaited<ReturnType<typeof createSession>>, TError, {
        data: BodyType<Function>;
    }, TContext>;
    request?: SecondParameter<typeof customInstance>;
}) => UseMutationOptions<Awaited<ReturnType<typeof createSession>>, TError, {
    data: BodyType<Function>;
}, TContext>;
type CreateSessionMutationResult = NonNullable<Awaited<ReturnType<typeof createSession>>>;
type CreateSessionMutationBody = BodyType<Function>;
type CreateSessionMutationError = ErrorType<void>;
declare const useCreateSession: <TError = ErrorType<void>, TContext = unknown>(options?: {
    mutation?: UseMutationOptions<Awaited<ReturnType<typeof createSession>>, TError, {
        data: BodyType<Function>;
    }, TContext>;
    request?: SecondParameter<typeof customInstance>;
}, queryClient?: QueryClient) => UseMutationResult<Awaited<ReturnType<typeof createSession>>, TError, {
    data: BodyType<Function>;
}, TContext>;
declare const getSessionsByQuery: (options?: SecondParameter<typeof customInstance>, signal?: AbortSignal) => Promise<GetSessionsByQuery200AllOf>;
declare const getGetSessionsByQueryQueryKey: () => readonly ["/api/v1/sessions"];
declare const getGetSessionsByQueryQueryOptions: <TData = Awaited<ReturnType<typeof getSessionsByQuery>>, TError = ErrorType<void>>(options?: {
    query?: Partial<UseQueryOptions<Awaited<ReturnType<typeof getSessionsByQuery>>, TError, TData>>;
    request?: SecondParameter<typeof customInstance>;
}) => UseQueryOptions<Awaited<ReturnType<typeof getSessionsByQuery>>, TError, TData> & {
    queryKey: DataTag<QueryKey, TData, TError>;
};
type GetSessionsByQueryQueryResult = NonNullable<Awaited<ReturnType<typeof getSessionsByQuery>>>;
type GetSessionsByQueryQueryError = ErrorType<void>;
declare function useGetSessionsByQuery<TData = Awaited<ReturnType<typeof getSessionsByQuery>>, TError = ErrorType<void>>(options: {
    query: Partial<UseQueryOptions<Awaited<ReturnType<typeof getSessionsByQuery>>, TError, TData>> & Pick<DefinedInitialDataOptions<Awaited<ReturnType<typeof getSessionsByQuery>>, TError, Awaited<ReturnType<typeof getSessionsByQuery>>>, "initialData">;
    request?: SecondParameter<typeof customInstance>;
}, queryClient?: QueryClient): DefinedUseQueryResult<TData, TError> & {
    queryKey: DataTag<QueryKey, TData, TError>;
};
declare function useGetSessionsByQuery<TData = Awaited<ReturnType<typeof getSessionsByQuery>>, TError = ErrorType<void>>(options?: {
    query?: Partial<UseQueryOptions<Awaited<ReturnType<typeof getSessionsByQuery>>, TError, TData>> & Pick<UndefinedInitialDataOptions<Awaited<ReturnType<typeof getSessionsByQuery>>, TError, Awaited<ReturnType<typeof getSessionsByQuery>>>, "initialData">;
    request?: SecondParameter<typeof customInstance>;
}, queryClient?: QueryClient): UseQueryResult<TData, TError> & {
    queryKey: DataTag<QueryKey, TData, TError>;
};
declare function useGetSessionsByQuery<TData = Awaited<ReturnType<typeof getSessionsByQuery>>, TError = ErrorType<void>>(options?: {
    query?: Partial<UseQueryOptions<Awaited<ReturnType<typeof getSessionsByQuery>>, TError, TData>>;
    request?: SecondParameter<typeof customInstance>;
}, queryClient?: QueryClient): UseQueryResult<TData, TError> & {
    queryKey: DataTag<QueryKey, TData, TError>;
};
declare const getGetSessionsByQuerySuspenseQueryOptions: <TData = Awaited<ReturnType<typeof getSessionsByQuery>>, TError = ErrorType<void>>(options?: {
    query?: Partial<UseSuspenseQueryOptions<Awaited<ReturnType<typeof getSessionsByQuery>>, TError, TData>>;
    request?: SecondParameter<typeof customInstance>;
}) => UseSuspenseQueryOptions<Awaited<ReturnType<typeof getSessionsByQuery>>, TError, TData> & {
    queryKey: DataTag<QueryKey, TData, TError>;
};
type GetSessionsByQuerySuspenseQueryResult = NonNullable<Awaited<ReturnType<typeof getSessionsByQuery>>>;
type GetSessionsByQuerySuspenseQueryError = ErrorType<void>;
declare function useGetSessionsByQuerySuspense<TData = Awaited<ReturnType<typeof getSessionsByQuery>>, TError = ErrorType<void>>(options: {
    query: Partial<UseSuspenseQueryOptions<Awaited<ReturnType<typeof getSessionsByQuery>>, TError, TData>>;
    request?: SecondParameter<typeof customInstance>;
}, queryClient?: QueryClient): UseSuspenseQueryResult<TData, TError> & {
    queryKey: DataTag<QueryKey, TData, TError>;
};
declare function useGetSessionsByQuerySuspense<TData = Awaited<ReturnType<typeof getSessionsByQuery>>, TError = ErrorType<void>>(options?: {
    query?: Partial<UseSuspenseQueryOptions<Awaited<ReturnType<typeof getSessionsByQuery>>, TError, TData>>;
    request?: SecondParameter<typeof customInstance>;
}, queryClient?: QueryClient): UseSuspenseQueryResult<TData, TError> & {
    queryKey: DataTag<QueryKey, TData, TError>;
};
declare function useGetSessionsByQuerySuspense<TData = Awaited<ReturnType<typeof getSessionsByQuery>>, TError = ErrorType<void>>(options?: {
    query?: Partial<UseSuspenseQueryOptions<Awaited<ReturnType<typeof getSessionsByQuery>>, TError, TData>>;
    request?: SecondParameter<typeof customInstance>;
}, queryClient?: QueryClient): UseSuspenseQueryResult<TData, TError> & {
    queryKey: DataTag<QueryKey, TData, TError>;
};
declare const getGetSessionsByQuerySuspenseInfiniteQueryOptions: <TData = InfiniteData<Awaited<ReturnType<typeof getSessionsByQuery>>>, TError = ErrorType<void>>(options?: {
    query?: Partial<UseSuspenseInfiniteQueryOptions<Awaited<ReturnType<typeof getSessionsByQuery>>, TError, TData>>;
    request?: SecondParameter<typeof customInstance>;
}) => UseSuspenseInfiniteQueryOptions<Awaited<ReturnType<typeof getSessionsByQuery>>, TError, TData> & {
    queryKey: DataTag<QueryKey, TData, TError>;
};
type GetSessionsByQuerySuspenseInfiniteQueryResult = NonNullable<Awaited<ReturnType<typeof getSessionsByQuery>>>;
type GetSessionsByQuerySuspenseInfiniteQueryError = ErrorType<void>;
declare function useGetSessionsByQuerySuspenseInfinite<TData = InfiniteData<Awaited<ReturnType<typeof getSessionsByQuery>>>, TError = ErrorType<void>>(options: {
    query: Partial<UseSuspenseInfiniteQueryOptions<Awaited<ReturnType<typeof getSessionsByQuery>>, TError, TData>>;
    request?: SecondParameter<typeof customInstance>;
}, queryClient?: QueryClient): UseSuspenseInfiniteQueryResult<TData, TError> & {
    queryKey: DataTag<QueryKey, TData, TError>;
};
declare function useGetSessionsByQuerySuspenseInfinite<TData = InfiniteData<Awaited<ReturnType<typeof getSessionsByQuery>>>, TError = ErrorType<void>>(options?: {
    query?: Partial<UseSuspenseInfiniteQueryOptions<Awaited<ReturnType<typeof getSessionsByQuery>>, TError, TData>>;
    request?: SecondParameter<typeof customInstance>;
}, queryClient?: QueryClient): UseSuspenseInfiniteQueryResult<TData, TError> & {
    queryKey: DataTag<QueryKey, TData, TError>;
};
declare function useGetSessionsByQuerySuspenseInfinite<TData = InfiniteData<Awaited<ReturnType<typeof getSessionsByQuery>>>, TError = ErrorType<void>>(options?: {
    query?: Partial<UseSuspenseInfiniteQueryOptions<Awaited<ReturnType<typeof getSessionsByQuery>>, TError, TData>>;
    request?: SecondParameter<typeof customInstance>;
}, queryClient?: QueryClient): UseSuspenseInfiniteQueryResult<TData, TError> & {
    queryKey: DataTag<QueryKey, TData, TError>;
};
declare const getSession: (sessionId: string, options?: SecondParameter<typeof customInstance>, signal?: AbortSignal) => Promise<GetSession200AllOf>;
declare const getGetSessionQueryKey: (sessionId: string) => readonly [`/api/v1/sessions/${string}`];
declare const getGetSessionQueryOptions: <TData = Awaited<ReturnType<typeof getSession>>, TError = ErrorType<void>>(sessionId: string, options?: {
    query?: Partial<UseQueryOptions<Awaited<ReturnType<typeof getSession>>, TError, TData>>;
    request?: SecondParameter<typeof customInstance>;
}) => UseQueryOptions<Awaited<ReturnType<typeof getSession>>, TError, TData> & {
    queryKey: DataTag<QueryKey, TData, TError>;
};
type GetSessionQueryResult = NonNullable<Awaited<ReturnType<typeof getSession>>>;
type GetSessionQueryError = ErrorType<void>;
declare function useGetSession<TData = Awaited<ReturnType<typeof getSession>>, TError = ErrorType<void>>(sessionId: string, options: {
    query: Partial<UseQueryOptions<Awaited<ReturnType<typeof getSession>>, TError, TData>> & Pick<DefinedInitialDataOptions<Awaited<ReturnType<typeof getSession>>, TError, Awaited<ReturnType<typeof getSession>>>, "initialData">;
    request?: SecondParameter<typeof customInstance>;
}, queryClient?: QueryClient): DefinedUseQueryResult<TData, TError> & {
    queryKey: DataTag<QueryKey, TData, TError>;
};
declare function useGetSession<TData = Awaited<ReturnType<typeof getSession>>, TError = ErrorType<void>>(sessionId: string, options?: {
    query?: Partial<UseQueryOptions<Awaited<ReturnType<typeof getSession>>, TError, TData>> & Pick<UndefinedInitialDataOptions<Awaited<ReturnType<typeof getSession>>, TError, Awaited<ReturnType<typeof getSession>>>, "initialData">;
    request?: SecondParameter<typeof customInstance>;
}, queryClient?: QueryClient): UseQueryResult<TData, TError> & {
    queryKey: DataTag<QueryKey, TData, TError>;
};
declare function useGetSession<TData = Awaited<ReturnType<typeof getSession>>, TError = ErrorType<void>>(sessionId: string, options?: {
    query?: Partial<UseQueryOptions<Awaited<ReturnType<typeof getSession>>, TError, TData>>;
    request?: SecondParameter<typeof customInstance>;
}, queryClient?: QueryClient): UseQueryResult<TData, TError> & {
    queryKey: DataTag<QueryKey, TData, TError>;
};
declare const getGetSessionSuspenseQueryOptions: <TData = Awaited<ReturnType<typeof getSession>>, TError = ErrorType<void>>(sessionId: string, options?: {
    query?: Partial<UseSuspenseQueryOptions<Awaited<ReturnType<typeof getSession>>, TError, TData>>;
    request?: SecondParameter<typeof customInstance>;
}) => UseSuspenseQueryOptions<Awaited<ReturnType<typeof getSession>>, TError, TData> & {
    queryKey: DataTag<QueryKey, TData, TError>;
};
type GetSessionSuspenseQueryResult = NonNullable<Awaited<ReturnType<typeof getSession>>>;
type GetSessionSuspenseQueryError = ErrorType<void>;
declare function useGetSessionSuspense<TData = Awaited<ReturnType<typeof getSession>>, TError = ErrorType<void>>(sessionId: string, options: {
    query: Partial<UseSuspenseQueryOptions<Awaited<ReturnType<typeof getSession>>, TError, TData>>;
    request?: SecondParameter<typeof customInstance>;
}, queryClient?: QueryClient): UseSuspenseQueryResult<TData, TError> & {
    queryKey: DataTag<QueryKey, TData, TError>;
};
declare function useGetSessionSuspense<TData = Awaited<ReturnType<typeof getSession>>, TError = ErrorType<void>>(sessionId: string, options?: {
    query?: Partial<UseSuspenseQueryOptions<Awaited<ReturnType<typeof getSession>>, TError, TData>>;
    request?: SecondParameter<typeof customInstance>;
}, queryClient?: QueryClient): UseSuspenseQueryResult<TData, TError> & {
    queryKey: DataTag<QueryKey, TData, TError>;
};
declare function useGetSessionSuspense<TData = Awaited<ReturnType<typeof getSession>>, TError = ErrorType<void>>(sessionId: string, options?: {
    query?: Partial<UseSuspenseQueryOptions<Awaited<ReturnType<typeof getSession>>, TError, TData>>;
    request?: SecondParameter<typeof customInstance>;
}, queryClient?: QueryClient): UseSuspenseQueryResult<TData, TError> & {
    queryKey: DataTag<QueryKey, TData, TError>;
};
declare const getGetSessionSuspenseInfiniteQueryOptions: <TData = InfiniteData<Awaited<ReturnType<typeof getSession>>>, TError = ErrorType<void>>(sessionId: string, options?: {
    query?: Partial<UseSuspenseInfiniteQueryOptions<Awaited<ReturnType<typeof getSession>>, TError, TData>>;
    request?: SecondParameter<typeof customInstance>;
}) => UseSuspenseInfiniteQueryOptions<Awaited<ReturnType<typeof getSession>>, TError, TData> & {
    queryKey: DataTag<QueryKey, TData, TError>;
};
type GetSessionSuspenseInfiniteQueryResult = NonNullable<Awaited<ReturnType<typeof getSession>>>;
type GetSessionSuspenseInfiniteQueryError = ErrorType<void>;
declare function useGetSessionSuspenseInfinite<TData = InfiniteData<Awaited<ReturnType<typeof getSession>>>, TError = ErrorType<void>>(sessionId: string, options: {
    query: Partial<UseSuspenseInfiniteQueryOptions<Awaited<ReturnType<typeof getSession>>, TError, TData>>;
    request?: SecondParameter<typeof customInstance>;
}, queryClient?: QueryClient): UseSuspenseInfiniteQueryResult<TData, TError> & {
    queryKey: DataTag<QueryKey, TData, TError>;
};
declare function useGetSessionSuspenseInfinite<TData = InfiniteData<Awaited<ReturnType<typeof getSession>>>, TError = ErrorType<void>>(sessionId: string, options?: {
    query?: Partial<UseSuspenseInfiniteQueryOptions<Awaited<ReturnType<typeof getSession>>, TError, TData>>;
    request?: SecondParameter<typeof customInstance>;
}, queryClient?: QueryClient): UseSuspenseInfiniteQueryResult<TData, TError> & {
    queryKey: DataTag<QueryKey, TData, TError>;
};
declare function useGetSessionSuspenseInfinite<TData = InfiniteData<Awaited<ReturnType<typeof getSession>>>, TError = ErrorType<void>>(sessionId: string, options?: {
    query?: Partial<UseSuspenseInfiniteQueryOptions<Awaited<ReturnType<typeof getSession>>, TError, TData>>;
    request?: SecondParameter<typeof customInstance>;
}, queryClient?: QueryClient): UseSuspenseInfiniteQueryResult<TData, TError> & {
    queryKey: DataTag<QueryKey, TData, TError>;
};
declare const updateSession: (sessionId: string, _function: BodyType<Function>, options?: SecondParameter<typeof customInstance>) => Promise<UpdateSession200AllOf>;
declare const getUpdateSessionMutationOptions: <TError = ErrorType<void>, TContext = unknown>(options?: {
    mutation?: UseMutationOptions<Awaited<ReturnType<typeof updateSession>>, TError, {
        sessionId: string;
        data: BodyType<Function>;
    }, TContext>;
    request?: SecondParameter<typeof customInstance>;
}) => UseMutationOptions<Awaited<ReturnType<typeof updateSession>>, TError, {
    sessionId: string;
    data: BodyType<Function>;
}, TContext>;
type UpdateSessionMutationResult = NonNullable<Awaited<ReturnType<typeof updateSession>>>;
type UpdateSessionMutationBody = BodyType<Function>;
type UpdateSessionMutationError = ErrorType<void>;
declare const useUpdateSession: <TError = ErrorType<void>, TContext = unknown>(options?: {
    mutation?: UseMutationOptions<Awaited<ReturnType<typeof updateSession>>, TError, {
        sessionId: string;
        data: BodyType<Function>;
    }, TContext>;
    request?: SecondParameter<typeof customInstance>;
}, queryClient?: QueryClient) => UseMutationResult<Awaited<ReturnType<typeof updateSession>>, TError, {
    sessionId: string;
    data: BodyType<Function>;
}, TContext>;
declare const deleteSession: (sessionId: string, options?: SecondParameter<typeof customInstance>) => Promise<DeleteSession200AllOf>;
declare const getDeleteSessionMutationOptions: <TError = ErrorType<void>, TContext = unknown>(options?: {
    mutation?: UseMutationOptions<Awaited<ReturnType<typeof deleteSession>>, TError, {
        sessionId: string;
    }, TContext>;
    request?: SecondParameter<typeof customInstance>;
}) => UseMutationOptions<Awaited<ReturnType<typeof deleteSession>>, TError, {
    sessionId: string;
}, TContext>;
type DeleteSessionMutationResult = NonNullable<Awaited<ReturnType<typeof deleteSession>>>;
type DeleteSessionMutationError = ErrorType<void>;
declare const useDeleteSession: <TError = ErrorType<void>, TContext = unknown>(options?: {
    mutation?: UseMutationOptions<Awaited<ReturnType<typeof deleteSession>>, TError, {
        sessionId: string;
    }, TContext>;
    request?: SecondParameter<typeof customInstance>;
}, queryClient?: QueryClient) => UseMutationResult<Awaited<ReturnType<typeof deleteSession>>, TError, {
    sessionId: string;
}, TContext>;
declare const removeSessions: (removeSessionsBody: BodyType<string[]>, options?: SecondParameter<typeof customInstance>) => Promise<RemoveSessions200AllOf>;
declare const getRemoveSessionsMutationOptions: <TError = ErrorType<void>, TContext = unknown>(options?: {
    mutation?: UseMutationOptions<Awaited<ReturnType<typeof removeSessions>>, TError, {
        data: BodyType<string[]>;
    }, TContext>;
    request?: SecondParameter<typeof customInstance>;
}) => UseMutationOptions<Awaited<ReturnType<typeof removeSessions>>, TError, {
    data: BodyType<string[]>;
}, TContext>;
type RemoveSessionsMutationResult = NonNullable<Awaited<ReturnType<typeof removeSessions>>>;
type RemoveSessionsMutationBody = BodyType<string[]>;
type RemoveSessionsMutationError = ErrorType<void>;
declare const useRemoveSessions: <TError = ErrorType<void>, TContext = unknown>(options?: {
    mutation?: UseMutationOptions<Awaited<ReturnType<typeof removeSessions>>, TError, {
        data: BodyType<string[]>;
    }, TContext>;
    request?: SecondParameter<typeof customInstance>;
}, queryClient?: QueryClient) => UseMutationResult<Awaited<ReturnType<typeof removeSessions>>, TError, {
    data: BodyType<string[]>;
}, TContext>;
declare const removeSession: (sessionId: string, options?: SecondParameter<typeof customInstance>) => Promise<RemoveSession200AllOf>;
declare const getRemoveSessionMutationOptions: <TError = ErrorType<void>, TContext = unknown>(options?: {
    mutation?: UseMutationOptions<Awaited<ReturnType<typeof removeSession>>, TError, {
        sessionId: string;
    }, TContext>;
    request?: SecondParameter<typeof customInstance>;
}) => UseMutationOptions<Awaited<ReturnType<typeof removeSession>>, TError, {
    sessionId: string;
}, TContext>;
type RemoveSessionMutationResult = NonNullable<Awaited<ReturnType<typeof removeSession>>>;
type RemoveSessionMutationError = ErrorType<void>;
declare const useRemoveSession: <TError = ErrorType<void>, TContext = unknown>(options?: {
    mutation?: UseMutationOptions<Awaited<ReturnType<typeof removeSession>>, TError, {
        sessionId: string;
    }, TContext>;
    request?: SecondParameter<typeof customInstance>;
}, queryClient?: QueryClient) => UseMutationResult<Awaited<ReturnType<typeof removeSession>>, TError, {
    sessionId: string;
}, TContext>;
declare const createProgram: (_function: BodyType<Function>, options?: SecondParameter<typeof customInstance>, signal?: AbortSignal) => Promise<CreateProgram200AllOf>;
declare const getCreateProgramMutationOptions: <TError = ErrorType<void>, TContext = unknown>(options?: {
    mutation?: UseMutationOptions<Awaited<ReturnType<typeof createProgram>>, TError, {
        data: BodyType<Function>;
    }, TContext>;
    request?: SecondParameter<typeof customInstance>;
}) => UseMutationOptions<Awaited<ReturnType<typeof createProgram>>, TError, {
    data: BodyType<Function>;
}, TContext>;
type CreateProgramMutationResult = NonNullable<Awaited<ReturnType<typeof createProgram>>>;
type CreateProgramMutationBody = BodyType<Function>;
type CreateProgramMutationError = ErrorType<void>;
declare const useCreateProgram: <TError = ErrorType<void>, TContext = unknown>(options?: {
    mutation?: UseMutationOptions<Awaited<ReturnType<typeof createProgram>>, TError, {
        data: BodyType<Function>;
    }, TContext>;
    request?: SecondParameter<typeof customInstance>;
}, queryClient?: QueryClient) => UseMutationResult<Awaited<ReturnType<typeof createProgram>>, TError, {
    data: BodyType<Function>;
}, TContext>;
declare const getProgramsByQuery: (options?: SecondParameter<typeof customInstance>, signal?: AbortSignal) => Promise<GetProgramsByQuery200AllOf>;
declare const getGetProgramsByQueryQueryKey: () => readonly ["/api/v1/programs"];
declare const getGetProgramsByQueryQueryOptions: <TData = Awaited<ReturnType<typeof getProgramsByQuery>>, TError = ErrorType<void>>(options?: {
    query?: Partial<UseQueryOptions<Awaited<ReturnType<typeof getProgramsByQuery>>, TError, TData>>;
    request?: SecondParameter<typeof customInstance>;
}) => UseQueryOptions<Awaited<ReturnType<typeof getProgramsByQuery>>, TError, TData> & {
    queryKey: DataTag<QueryKey, TData, TError>;
};
type GetProgramsByQueryQueryResult = NonNullable<Awaited<ReturnType<typeof getProgramsByQuery>>>;
type GetProgramsByQueryQueryError = ErrorType<void>;
declare function useGetProgramsByQuery<TData = Awaited<ReturnType<typeof getProgramsByQuery>>, TError = ErrorType<void>>(options: {
    query: Partial<UseQueryOptions<Awaited<ReturnType<typeof getProgramsByQuery>>, TError, TData>> & Pick<DefinedInitialDataOptions<Awaited<ReturnType<typeof getProgramsByQuery>>, TError, Awaited<ReturnType<typeof getProgramsByQuery>>>, "initialData">;
    request?: SecondParameter<typeof customInstance>;
}, queryClient?: QueryClient): DefinedUseQueryResult<TData, TError> & {
    queryKey: DataTag<QueryKey, TData, TError>;
};
declare function useGetProgramsByQuery<TData = Awaited<ReturnType<typeof getProgramsByQuery>>, TError = ErrorType<void>>(options?: {
    query?: Partial<UseQueryOptions<Awaited<ReturnType<typeof getProgramsByQuery>>, TError, TData>> & Pick<UndefinedInitialDataOptions<Awaited<ReturnType<typeof getProgramsByQuery>>, TError, Awaited<ReturnType<typeof getProgramsByQuery>>>, "initialData">;
    request?: SecondParameter<typeof customInstance>;
}, queryClient?: QueryClient): UseQueryResult<TData, TError> & {
    queryKey: DataTag<QueryKey, TData, TError>;
};
declare function useGetProgramsByQuery<TData = Awaited<ReturnType<typeof getProgramsByQuery>>, TError = ErrorType<void>>(options?: {
    query?: Partial<UseQueryOptions<Awaited<ReturnType<typeof getProgramsByQuery>>, TError, TData>>;
    request?: SecondParameter<typeof customInstance>;
}, queryClient?: QueryClient): UseQueryResult<TData, TError> & {
    queryKey: DataTag<QueryKey, TData, TError>;
};
declare const getGetProgramsByQuerySuspenseQueryOptions: <TData = Awaited<ReturnType<typeof getProgramsByQuery>>, TError = ErrorType<void>>(options?: {
    query?: Partial<UseSuspenseQueryOptions<Awaited<ReturnType<typeof getProgramsByQuery>>, TError, TData>>;
    request?: SecondParameter<typeof customInstance>;
}) => UseSuspenseQueryOptions<Awaited<ReturnType<typeof getProgramsByQuery>>, TError, TData> & {
    queryKey: DataTag<QueryKey, TData, TError>;
};
type GetProgramsByQuerySuspenseQueryResult = NonNullable<Awaited<ReturnType<typeof getProgramsByQuery>>>;
type GetProgramsByQuerySuspenseQueryError = ErrorType<void>;
declare function useGetProgramsByQuerySuspense<TData = Awaited<ReturnType<typeof getProgramsByQuery>>, TError = ErrorType<void>>(options: {
    query: Partial<UseSuspenseQueryOptions<Awaited<ReturnType<typeof getProgramsByQuery>>, TError, TData>>;
    request?: SecondParameter<typeof customInstance>;
}, queryClient?: QueryClient): UseSuspenseQueryResult<TData, TError> & {
    queryKey: DataTag<QueryKey, TData, TError>;
};
declare function useGetProgramsByQuerySuspense<TData = Awaited<ReturnType<typeof getProgramsByQuery>>, TError = ErrorType<void>>(options?: {
    query?: Partial<UseSuspenseQueryOptions<Awaited<ReturnType<typeof getProgramsByQuery>>, TError, TData>>;
    request?: SecondParameter<typeof customInstance>;
}, queryClient?: QueryClient): UseSuspenseQueryResult<TData, TError> & {
    queryKey: DataTag<QueryKey, TData, TError>;
};
declare function useGetProgramsByQuerySuspense<TData = Awaited<ReturnType<typeof getProgramsByQuery>>, TError = ErrorType<void>>(options?: {
    query?: Partial<UseSuspenseQueryOptions<Awaited<ReturnType<typeof getProgramsByQuery>>, TError, TData>>;
    request?: SecondParameter<typeof customInstance>;
}, queryClient?: QueryClient): UseSuspenseQueryResult<TData, TError> & {
    queryKey: DataTag<QueryKey, TData, TError>;
};
declare const getGetProgramsByQuerySuspenseInfiniteQueryOptions: <TData = InfiniteData<Awaited<ReturnType<typeof getProgramsByQuery>>>, TError = ErrorType<void>>(options?: {
    query?: Partial<UseSuspenseInfiniteQueryOptions<Awaited<ReturnType<typeof getProgramsByQuery>>, TError, TData>>;
    request?: SecondParameter<typeof customInstance>;
}) => UseSuspenseInfiniteQueryOptions<Awaited<ReturnType<typeof getProgramsByQuery>>, TError, TData> & {
    queryKey: DataTag<QueryKey, TData, TError>;
};
type GetProgramsByQuerySuspenseInfiniteQueryResult = NonNullable<Awaited<ReturnType<typeof getProgramsByQuery>>>;
type GetProgramsByQuerySuspenseInfiniteQueryError = ErrorType<void>;
declare function useGetProgramsByQuerySuspenseInfinite<TData = InfiniteData<Awaited<ReturnType<typeof getProgramsByQuery>>>, TError = ErrorType<void>>(options: {
    query: Partial<UseSuspenseInfiniteQueryOptions<Awaited<ReturnType<typeof getProgramsByQuery>>, TError, TData>>;
    request?: SecondParameter<typeof customInstance>;
}, queryClient?: QueryClient): UseSuspenseInfiniteQueryResult<TData, TError> & {
    queryKey: DataTag<QueryKey, TData, TError>;
};
declare function useGetProgramsByQuerySuspenseInfinite<TData = InfiniteData<Awaited<ReturnType<typeof getProgramsByQuery>>>, TError = ErrorType<void>>(options?: {
    query?: Partial<UseSuspenseInfiniteQueryOptions<Awaited<ReturnType<typeof getProgramsByQuery>>, TError, TData>>;
    request?: SecondParameter<typeof customInstance>;
}, queryClient?: QueryClient): UseSuspenseInfiniteQueryResult<TData, TError> & {
    queryKey: DataTag<QueryKey, TData, TError>;
};
declare function useGetProgramsByQuerySuspenseInfinite<TData = InfiniteData<Awaited<ReturnType<typeof getProgramsByQuery>>>, TError = ErrorType<void>>(options?: {
    query?: Partial<UseSuspenseInfiniteQueryOptions<Awaited<ReturnType<typeof getProgramsByQuery>>, TError, TData>>;
    request?: SecondParameter<typeof customInstance>;
}, queryClient?: QueryClient): UseSuspenseInfiniteQueryResult<TData, TError> & {
    queryKey: DataTag<QueryKey, TData, TError>;
};
declare const getProgramById: (programId: string, options?: SecondParameter<typeof customInstance>, signal?: AbortSignal) => Promise<GetProgramById200AllOf>;
declare const getGetProgramByIdQueryKey: (programId: string) => readonly [`/api/v1/programs/${string}`];
declare const getGetProgramByIdQueryOptions: <TData = Awaited<ReturnType<typeof getProgramById>>, TError = ErrorType<void>>(programId: string, options?: {
    query?: Partial<UseQueryOptions<Awaited<ReturnType<typeof getProgramById>>, TError, TData>>;
    request?: SecondParameter<typeof customInstance>;
}) => UseQueryOptions<Awaited<ReturnType<typeof getProgramById>>, TError, TData> & {
    queryKey: DataTag<QueryKey, TData, TError>;
};
type GetProgramByIdQueryResult = NonNullable<Awaited<ReturnType<typeof getProgramById>>>;
type GetProgramByIdQueryError = ErrorType<void>;
declare function useGetProgramById<TData = Awaited<ReturnType<typeof getProgramById>>, TError = ErrorType<void>>(programId: string, options: {
    query: Partial<UseQueryOptions<Awaited<ReturnType<typeof getProgramById>>, TError, TData>> & Pick<DefinedInitialDataOptions<Awaited<ReturnType<typeof getProgramById>>, TError, Awaited<ReturnType<typeof getProgramById>>>, "initialData">;
    request?: SecondParameter<typeof customInstance>;
}, queryClient?: QueryClient): DefinedUseQueryResult<TData, TError> & {
    queryKey: DataTag<QueryKey, TData, TError>;
};
declare function useGetProgramById<TData = Awaited<ReturnType<typeof getProgramById>>, TError = ErrorType<void>>(programId: string, options?: {
    query?: Partial<UseQueryOptions<Awaited<ReturnType<typeof getProgramById>>, TError, TData>> & Pick<UndefinedInitialDataOptions<Awaited<ReturnType<typeof getProgramById>>, TError, Awaited<ReturnType<typeof getProgramById>>>, "initialData">;
    request?: SecondParameter<typeof customInstance>;
}, queryClient?: QueryClient): UseQueryResult<TData, TError> & {
    queryKey: DataTag<QueryKey, TData, TError>;
};
declare function useGetProgramById<TData = Awaited<ReturnType<typeof getProgramById>>, TError = ErrorType<void>>(programId: string, options?: {
    query?: Partial<UseQueryOptions<Awaited<ReturnType<typeof getProgramById>>, TError, TData>>;
    request?: SecondParameter<typeof customInstance>;
}, queryClient?: QueryClient): UseQueryResult<TData, TError> & {
    queryKey: DataTag<QueryKey, TData, TError>;
};
declare const getGetProgramByIdSuspenseQueryOptions: <TData = Awaited<ReturnType<typeof getProgramById>>, TError = ErrorType<void>>(programId: string, options?: {
    query?: Partial<UseSuspenseQueryOptions<Awaited<ReturnType<typeof getProgramById>>, TError, TData>>;
    request?: SecondParameter<typeof customInstance>;
}) => UseSuspenseQueryOptions<Awaited<ReturnType<typeof getProgramById>>, TError, TData> & {
    queryKey: DataTag<QueryKey, TData, TError>;
};
type GetProgramByIdSuspenseQueryResult = NonNullable<Awaited<ReturnType<typeof getProgramById>>>;
type GetProgramByIdSuspenseQueryError = ErrorType<void>;
declare function useGetProgramByIdSuspense<TData = Awaited<ReturnType<typeof getProgramById>>, TError = ErrorType<void>>(programId: string, options: {
    query: Partial<UseSuspenseQueryOptions<Awaited<ReturnType<typeof getProgramById>>, TError, TData>>;
    request?: SecondParameter<typeof customInstance>;
}, queryClient?: QueryClient): UseSuspenseQueryResult<TData, TError> & {
    queryKey: DataTag<QueryKey, TData, TError>;
};
declare function useGetProgramByIdSuspense<TData = Awaited<ReturnType<typeof getProgramById>>, TError = ErrorType<void>>(programId: string, options?: {
    query?: Partial<UseSuspenseQueryOptions<Awaited<ReturnType<typeof getProgramById>>, TError, TData>>;
    request?: SecondParameter<typeof customInstance>;
}, queryClient?: QueryClient): UseSuspenseQueryResult<TData, TError> & {
    queryKey: DataTag<QueryKey, TData, TError>;
};
declare function useGetProgramByIdSuspense<TData = Awaited<ReturnType<typeof getProgramById>>, TError = ErrorType<void>>(programId: string, options?: {
    query?: Partial<UseSuspenseQueryOptions<Awaited<ReturnType<typeof getProgramById>>, TError, TData>>;
    request?: SecondParameter<typeof customInstance>;
}, queryClient?: QueryClient): UseSuspenseQueryResult<TData, TError> & {
    queryKey: DataTag<QueryKey, TData, TError>;
};
declare const getGetProgramByIdSuspenseInfiniteQueryOptions: <TData = InfiniteData<Awaited<ReturnType<typeof getProgramById>>>, TError = ErrorType<void>>(programId: string, options?: {
    query?: Partial<UseSuspenseInfiniteQueryOptions<Awaited<ReturnType<typeof getProgramById>>, TError, TData>>;
    request?: SecondParameter<typeof customInstance>;
}) => UseSuspenseInfiniteQueryOptions<Awaited<ReturnType<typeof getProgramById>>, TError, TData> & {
    queryKey: DataTag<QueryKey, TData, TError>;
};
type GetProgramByIdSuspenseInfiniteQueryResult = NonNullable<Awaited<ReturnType<typeof getProgramById>>>;
type GetProgramByIdSuspenseInfiniteQueryError = ErrorType<void>;
declare function useGetProgramByIdSuspenseInfinite<TData = InfiniteData<Awaited<ReturnType<typeof getProgramById>>>, TError = ErrorType<void>>(programId: string, options: {
    query: Partial<UseSuspenseInfiniteQueryOptions<Awaited<ReturnType<typeof getProgramById>>, TError, TData>>;
    request?: SecondParameter<typeof customInstance>;
}, queryClient?: QueryClient): UseSuspenseInfiniteQueryResult<TData, TError> & {
    queryKey: DataTag<QueryKey, TData, TError>;
};
declare function useGetProgramByIdSuspenseInfinite<TData = InfiniteData<Awaited<ReturnType<typeof getProgramById>>>, TError = ErrorType<void>>(programId: string, options?: {
    query?: Partial<UseSuspenseInfiniteQueryOptions<Awaited<ReturnType<typeof getProgramById>>, TError, TData>>;
    request?: SecondParameter<typeof customInstance>;
}, queryClient?: QueryClient): UseSuspenseInfiniteQueryResult<TData, TError> & {
    queryKey: DataTag<QueryKey, TData, TError>;
};
declare function useGetProgramByIdSuspenseInfinite<TData = InfiniteData<Awaited<ReturnType<typeof getProgramById>>>, TError = ErrorType<void>>(programId: string, options?: {
    query?: Partial<UseSuspenseInfiniteQueryOptions<Awaited<ReturnType<typeof getProgramById>>, TError, TData>>;
    request?: SecondParameter<typeof customInstance>;
}, queryClient?: QueryClient): UseSuspenseInfiniteQueryResult<TData, TError> & {
    queryKey: DataTag<QueryKey, TData, TError>;
};
declare const updateProgramById: (programId: string, _function: BodyType<Function>, options?: SecondParameter<typeof customInstance>) => Promise<UpdateProgramById200AllOf>;
declare const getUpdateProgramByIdMutationOptions: <TError = ErrorType<void>, TContext = unknown>(options?: {
    mutation?: UseMutationOptions<Awaited<ReturnType<typeof updateProgramById>>, TError, {
        programId: string;
        data: BodyType<Function>;
    }, TContext>;
    request?: SecondParameter<typeof customInstance>;
}) => UseMutationOptions<Awaited<ReturnType<typeof updateProgramById>>, TError, {
    programId: string;
    data: BodyType<Function>;
}, TContext>;
type UpdateProgramByIdMutationResult = NonNullable<Awaited<ReturnType<typeof updateProgramById>>>;
type UpdateProgramByIdMutationBody = BodyType<Function>;
type UpdateProgramByIdMutationError = ErrorType<void>;
declare const useUpdateProgramById: <TError = ErrorType<void>, TContext = unknown>(options?: {
    mutation?: UseMutationOptions<Awaited<ReturnType<typeof updateProgramById>>, TError, {
        programId: string;
        data: BodyType<Function>;
    }, TContext>;
    request?: SecondParameter<typeof customInstance>;
}, queryClient?: QueryClient) => UseMutationResult<Awaited<ReturnType<typeof updateProgramById>>, TError, {
    programId: string;
    data: BodyType<Function>;
}, TContext>;
declare const deleteProgramById: (programId: string, options?: SecondParameter<typeof customInstance>) => Promise<DeleteProgramById200AllOf>;
declare const getDeleteProgramByIdMutationOptions: <TError = ErrorType<void>, TContext = unknown>(options?: {
    mutation?: UseMutationOptions<Awaited<ReturnType<typeof deleteProgramById>>, TError, {
        programId: string;
    }, TContext>;
    request?: SecondParameter<typeof customInstance>;
}) => UseMutationOptions<Awaited<ReturnType<typeof deleteProgramById>>, TError, {
    programId: string;
}, TContext>;
type DeleteProgramByIdMutationResult = NonNullable<Awaited<ReturnType<typeof deleteProgramById>>>;
type DeleteProgramByIdMutationError = ErrorType<void>;
declare const useDeleteProgramById: <TError = ErrorType<void>, TContext = unknown>(options?: {
    mutation?: UseMutationOptions<Awaited<ReturnType<typeof deleteProgramById>>, TError, {
        programId: string;
    }, TContext>;
    request?: SecondParameter<typeof customInstance>;
}, queryClient?: QueryClient) => UseMutationResult<Awaited<ReturnType<typeof deleteProgramById>>, TError, {
    programId: string;
}, TContext>;
declare const removeProgramById: (programId: string, options?: SecondParameter<typeof customInstance>) => Promise<RemoveProgramById200AllOf>;
declare const getRemoveProgramByIdMutationOptions: <TError = ErrorType<void>, TContext = unknown>(options?: {
    mutation?: UseMutationOptions<Awaited<ReturnType<typeof removeProgramById>>, TError, {
        programId: string;
    }, TContext>;
    request?: SecondParameter<typeof customInstance>;
}) => UseMutationOptions<Awaited<ReturnType<typeof removeProgramById>>, TError, {
    programId: string;
}, TContext>;
type RemoveProgramByIdMutationResult = NonNullable<Awaited<ReturnType<typeof removeProgramById>>>;
type RemoveProgramByIdMutationError = ErrorType<void>;
declare const useRemoveProgramById: <TError = ErrorType<void>, TContext = unknown>(options?: {
    mutation?: UseMutationOptions<Awaited<ReturnType<typeof removeProgramById>>, TError, {
        programId: string;
    }, TContext>;
    request?: SecondParameter<typeof customInstance>;
}, queryClient?: QueryClient) => UseMutationResult<Awaited<ReturnType<typeof removeProgramById>>, TError, {
    programId: string;
}, TContext>;
declare const createRoutine: (_function: BodyType<Function>, options?: SecondParameter<typeof customInstance>, signal?: AbortSignal) => Promise<CreateRoutine200AllOf>;
declare const getCreateRoutineMutationOptions: <TError = ErrorType<void>, TContext = unknown>(options?: {
    mutation?: UseMutationOptions<Awaited<ReturnType<typeof createRoutine>>, TError, {
        data: BodyType<Function>;
    }, TContext>;
    request?: SecondParameter<typeof customInstance>;
}) => UseMutationOptions<Awaited<ReturnType<typeof createRoutine>>, TError, {
    data: BodyType<Function>;
}, TContext>;
type CreateRoutineMutationResult = NonNullable<Awaited<ReturnType<typeof createRoutine>>>;
type CreateRoutineMutationBody = BodyType<Function>;
type CreateRoutineMutationError = ErrorType<void>;
declare const useCreateRoutine: <TError = ErrorType<void>, TContext = unknown>(options?: {
    mutation?: UseMutationOptions<Awaited<ReturnType<typeof createRoutine>>, TError, {
        data: BodyType<Function>;
    }, TContext>;
    request?: SecondParameter<typeof customInstance>;
}, queryClient?: QueryClient) => UseMutationResult<Awaited<ReturnType<typeof createRoutine>>, TError, {
    data: BodyType<Function>;
}, TContext>;
declare const getRoutinesByQuery: (options?: SecondParameter<typeof customInstance>, signal?: AbortSignal) => Promise<GetRoutinesByQuery200AllOf>;
declare const getGetRoutinesByQueryQueryKey: () => readonly ["/api/v1/routines"];
declare const getGetRoutinesByQueryQueryOptions: <TData = Awaited<ReturnType<typeof getRoutinesByQuery>>, TError = ErrorType<void>>(options?: {
    query?: Partial<UseQueryOptions<Awaited<ReturnType<typeof getRoutinesByQuery>>, TError, TData>>;
    request?: SecondParameter<typeof customInstance>;
}) => UseQueryOptions<Awaited<ReturnType<typeof getRoutinesByQuery>>, TError, TData> & {
    queryKey: DataTag<QueryKey, TData, TError>;
};
type GetRoutinesByQueryQueryResult = NonNullable<Awaited<ReturnType<typeof getRoutinesByQuery>>>;
type GetRoutinesByQueryQueryError = ErrorType<void>;
declare function useGetRoutinesByQuery<TData = Awaited<ReturnType<typeof getRoutinesByQuery>>, TError = ErrorType<void>>(options: {
    query: Partial<UseQueryOptions<Awaited<ReturnType<typeof getRoutinesByQuery>>, TError, TData>> & Pick<DefinedInitialDataOptions<Awaited<ReturnType<typeof getRoutinesByQuery>>, TError, Awaited<ReturnType<typeof getRoutinesByQuery>>>, "initialData">;
    request?: SecondParameter<typeof customInstance>;
}, queryClient?: QueryClient): DefinedUseQueryResult<TData, TError> & {
    queryKey: DataTag<QueryKey, TData, TError>;
};
declare function useGetRoutinesByQuery<TData = Awaited<ReturnType<typeof getRoutinesByQuery>>, TError = ErrorType<void>>(options?: {
    query?: Partial<UseQueryOptions<Awaited<ReturnType<typeof getRoutinesByQuery>>, TError, TData>> & Pick<UndefinedInitialDataOptions<Awaited<ReturnType<typeof getRoutinesByQuery>>, TError, Awaited<ReturnType<typeof getRoutinesByQuery>>>, "initialData">;
    request?: SecondParameter<typeof customInstance>;
}, queryClient?: QueryClient): UseQueryResult<TData, TError> & {
    queryKey: DataTag<QueryKey, TData, TError>;
};
declare function useGetRoutinesByQuery<TData = Awaited<ReturnType<typeof getRoutinesByQuery>>, TError = ErrorType<void>>(options?: {
    query?: Partial<UseQueryOptions<Awaited<ReturnType<typeof getRoutinesByQuery>>, TError, TData>>;
    request?: SecondParameter<typeof customInstance>;
}, queryClient?: QueryClient): UseQueryResult<TData, TError> & {
    queryKey: DataTag<QueryKey, TData, TError>;
};
declare const getGetRoutinesByQuerySuspenseQueryOptions: <TData = Awaited<ReturnType<typeof getRoutinesByQuery>>, TError = ErrorType<void>>(options?: {
    query?: Partial<UseSuspenseQueryOptions<Awaited<ReturnType<typeof getRoutinesByQuery>>, TError, TData>>;
    request?: SecondParameter<typeof customInstance>;
}) => UseSuspenseQueryOptions<Awaited<ReturnType<typeof getRoutinesByQuery>>, TError, TData> & {
    queryKey: DataTag<QueryKey, TData, TError>;
};
type GetRoutinesByQuerySuspenseQueryResult = NonNullable<Awaited<ReturnType<typeof getRoutinesByQuery>>>;
type GetRoutinesByQuerySuspenseQueryError = ErrorType<void>;
declare function useGetRoutinesByQuerySuspense<TData = Awaited<ReturnType<typeof getRoutinesByQuery>>, TError = ErrorType<void>>(options: {
    query: Partial<UseSuspenseQueryOptions<Awaited<ReturnType<typeof getRoutinesByQuery>>, TError, TData>>;
    request?: SecondParameter<typeof customInstance>;
}, queryClient?: QueryClient): UseSuspenseQueryResult<TData, TError> & {
    queryKey: DataTag<QueryKey, TData, TError>;
};
declare function useGetRoutinesByQuerySuspense<TData = Awaited<ReturnType<typeof getRoutinesByQuery>>, TError = ErrorType<void>>(options?: {
    query?: Partial<UseSuspenseQueryOptions<Awaited<ReturnType<typeof getRoutinesByQuery>>, TError, TData>>;
    request?: SecondParameter<typeof customInstance>;
}, queryClient?: QueryClient): UseSuspenseQueryResult<TData, TError> & {
    queryKey: DataTag<QueryKey, TData, TError>;
};
declare function useGetRoutinesByQuerySuspense<TData = Awaited<ReturnType<typeof getRoutinesByQuery>>, TError = ErrorType<void>>(options?: {
    query?: Partial<UseSuspenseQueryOptions<Awaited<ReturnType<typeof getRoutinesByQuery>>, TError, TData>>;
    request?: SecondParameter<typeof customInstance>;
}, queryClient?: QueryClient): UseSuspenseQueryResult<TData, TError> & {
    queryKey: DataTag<QueryKey, TData, TError>;
};
declare const getGetRoutinesByQuerySuspenseInfiniteQueryOptions: <TData = InfiniteData<Awaited<ReturnType<typeof getRoutinesByQuery>>>, TError = ErrorType<void>>(options?: {
    query?: Partial<UseSuspenseInfiniteQueryOptions<Awaited<ReturnType<typeof getRoutinesByQuery>>, TError, TData>>;
    request?: SecondParameter<typeof customInstance>;
}) => UseSuspenseInfiniteQueryOptions<Awaited<ReturnType<typeof getRoutinesByQuery>>, TError, TData> & {
    queryKey: DataTag<QueryKey, TData, TError>;
};
type GetRoutinesByQuerySuspenseInfiniteQueryResult = NonNullable<Awaited<ReturnType<typeof getRoutinesByQuery>>>;
type GetRoutinesByQuerySuspenseInfiniteQueryError = ErrorType<void>;
declare function useGetRoutinesByQuerySuspenseInfinite<TData = InfiniteData<Awaited<ReturnType<typeof getRoutinesByQuery>>>, TError = ErrorType<void>>(options: {
    query: Partial<UseSuspenseInfiniteQueryOptions<Awaited<ReturnType<typeof getRoutinesByQuery>>, TError, TData>>;
    request?: SecondParameter<typeof customInstance>;
}, queryClient?: QueryClient): UseSuspenseInfiniteQueryResult<TData, TError> & {
    queryKey: DataTag<QueryKey, TData, TError>;
};
declare function useGetRoutinesByQuerySuspenseInfinite<TData = InfiniteData<Awaited<ReturnType<typeof getRoutinesByQuery>>>, TError = ErrorType<void>>(options?: {
    query?: Partial<UseSuspenseInfiniteQueryOptions<Awaited<ReturnType<typeof getRoutinesByQuery>>, TError, TData>>;
    request?: SecondParameter<typeof customInstance>;
}, queryClient?: QueryClient): UseSuspenseInfiniteQueryResult<TData, TError> & {
    queryKey: DataTag<QueryKey, TData, TError>;
};
declare function useGetRoutinesByQuerySuspenseInfinite<TData = InfiniteData<Awaited<ReturnType<typeof getRoutinesByQuery>>>, TError = ErrorType<void>>(options?: {
    query?: Partial<UseSuspenseInfiniteQueryOptions<Awaited<ReturnType<typeof getRoutinesByQuery>>, TError, TData>>;
    request?: SecondParameter<typeof customInstance>;
}, queryClient?: QueryClient): UseSuspenseInfiniteQueryResult<TData, TError> & {
    queryKey: DataTag<QueryKey, TData, TError>;
};
declare const getRoutine: (routineId: string, options?: SecondParameter<typeof customInstance>, signal?: AbortSignal) => Promise<GetRoutine200AllOf>;
declare const getGetRoutineQueryKey: (routineId: string) => readonly [`/api/v1/routines/${string}`];
declare const getGetRoutineQueryOptions: <TData = Awaited<ReturnType<typeof getRoutine>>, TError = ErrorType<void>>(routineId: string, options?: {
    query?: Partial<UseQueryOptions<Awaited<ReturnType<typeof getRoutine>>, TError, TData>>;
    request?: SecondParameter<typeof customInstance>;
}) => UseQueryOptions<Awaited<ReturnType<typeof getRoutine>>, TError, TData> & {
    queryKey: DataTag<QueryKey, TData, TError>;
};
type GetRoutineQueryResult = NonNullable<Awaited<ReturnType<typeof getRoutine>>>;
type GetRoutineQueryError = ErrorType<void>;
declare function useGetRoutine<TData = Awaited<ReturnType<typeof getRoutine>>, TError = ErrorType<void>>(routineId: string, options: {
    query: Partial<UseQueryOptions<Awaited<ReturnType<typeof getRoutine>>, TError, TData>> & Pick<DefinedInitialDataOptions<Awaited<ReturnType<typeof getRoutine>>, TError, Awaited<ReturnType<typeof getRoutine>>>, "initialData">;
    request?: SecondParameter<typeof customInstance>;
}, queryClient?: QueryClient): DefinedUseQueryResult<TData, TError> & {
    queryKey: DataTag<QueryKey, TData, TError>;
};
declare function useGetRoutine<TData = Awaited<ReturnType<typeof getRoutine>>, TError = ErrorType<void>>(routineId: string, options?: {
    query?: Partial<UseQueryOptions<Awaited<ReturnType<typeof getRoutine>>, TError, TData>> & Pick<UndefinedInitialDataOptions<Awaited<ReturnType<typeof getRoutine>>, TError, Awaited<ReturnType<typeof getRoutine>>>, "initialData">;
    request?: SecondParameter<typeof customInstance>;
}, queryClient?: QueryClient): UseQueryResult<TData, TError> & {
    queryKey: DataTag<QueryKey, TData, TError>;
};
declare function useGetRoutine<TData = Awaited<ReturnType<typeof getRoutine>>, TError = ErrorType<void>>(routineId: string, options?: {
    query?: Partial<UseQueryOptions<Awaited<ReturnType<typeof getRoutine>>, TError, TData>>;
    request?: SecondParameter<typeof customInstance>;
}, queryClient?: QueryClient): UseQueryResult<TData, TError> & {
    queryKey: DataTag<QueryKey, TData, TError>;
};
declare const getGetRoutineSuspenseQueryOptions: <TData = Awaited<ReturnType<typeof getRoutine>>, TError = ErrorType<void>>(routineId: string, options?: {
    query?: Partial<UseSuspenseQueryOptions<Awaited<ReturnType<typeof getRoutine>>, TError, TData>>;
    request?: SecondParameter<typeof customInstance>;
}) => UseSuspenseQueryOptions<Awaited<ReturnType<typeof getRoutine>>, TError, TData> & {
    queryKey: DataTag<QueryKey, TData, TError>;
};
type GetRoutineSuspenseQueryResult = NonNullable<Awaited<ReturnType<typeof getRoutine>>>;
type GetRoutineSuspenseQueryError = ErrorType<void>;
declare function useGetRoutineSuspense<TData = Awaited<ReturnType<typeof getRoutine>>, TError = ErrorType<void>>(routineId: string, options: {
    query: Partial<UseSuspenseQueryOptions<Awaited<ReturnType<typeof getRoutine>>, TError, TData>>;
    request?: SecondParameter<typeof customInstance>;
}, queryClient?: QueryClient): UseSuspenseQueryResult<TData, TError> & {
    queryKey: DataTag<QueryKey, TData, TError>;
};
declare function useGetRoutineSuspense<TData = Awaited<ReturnType<typeof getRoutine>>, TError = ErrorType<void>>(routineId: string, options?: {
    query?: Partial<UseSuspenseQueryOptions<Awaited<ReturnType<typeof getRoutine>>, TError, TData>>;
    request?: SecondParameter<typeof customInstance>;
}, queryClient?: QueryClient): UseSuspenseQueryResult<TData, TError> & {
    queryKey: DataTag<QueryKey, TData, TError>;
};
declare function useGetRoutineSuspense<TData = Awaited<ReturnType<typeof getRoutine>>, TError = ErrorType<void>>(routineId: string, options?: {
    query?: Partial<UseSuspenseQueryOptions<Awaited<ReturnType<typeof getRoutine>>, TError, TData>>;
    request?: SecondParameter<typeof customInstance>;
}, queryClient?: QueryClient): UseSuspenseQueryResult<TData, TError> & {
    queryKey: DataTag<QueryKey, TData, TError>;
};
declare const getGetRoutineSuspenseInfiniteQueryOptions: <TData = InfiniteData<Awaited<ReturnType<typeof getRoutine>>>, TError = ErrorType<void>>(routineId: string, options?: {
    query?: Partial<UseSuspenseInfiniteQueryOptions<Awaited<ReturnType<typeof getRoutine>>, TError, TData>>;
    request?: SecondParameter<typeof customInstance>;
}) => UseSuspenseInfiniteQueryOptions<Awaited<ReturnType<typeof getRoutine>>, TError, TData> & {
    queryKey: DataTag<QueryKey, TData, TError>;
};
type GetRoutineSuspenseInfiniteQueryResult = NonNullable<Awaited<ReturnType<typeof getRoutine>>>;
type GetRoutineSuspenseInfiniteQueryError = ErrorType<void>;
declare function useGetRoutineSuspenseInfinite<TData = InfiniteData<Awaited<ReturnType<typeof getRoutine>>>, TError = ErrorType<void>>(routineId: string, options: {
    query: Partial<UseSuspenseInfiniteQueryOptions<Awaited<ReturnType<typeof getRoutine>>, TError, TData>>;
    request?: SecondParameter<typeof customInstance>;
}, queryClient?: QueryClient): UseSuspenseInfiniteQueryResult<TData, TError> & {
    queryKey: DataTag<QueryKey, TData, TError>;
};
declare function useGetRoutineSuspenseInfinite<TData = InfiniteData<Awaited<ReturnType<typeof getRoutine>>>, TError = ErrorType<void>>(routineId: string, options?: {
    query?: Partial<UseSuspenseInfiniteQueryOptions<Awaited<ReturnType<typeof getRoutine>>, TError, TData>>;
    request?: SecondParameter<typeof customInstance>;
}, queryClient?: QueryClient): UseSuspenseInfiniteQueryResult<TData, TError> & {
    queryKey: DataTag<QueryKey, TData, TError>;
};
declare function useGetRoutineSuspenseInfinite<TData = InfiniteData<Awaited<ReturnType<typeof getRoutine>>>, TError = ErrorType<void>>(routineId: string, options?: {
    query?: Partial<UseSuspenseInfiniteQueryOptions<Awaited<ReturnType<typeof getRoutine>>, TError, TData>>;
    request?: SecondParameter<typeof customInstance>;
}, queryClient?: QueryClient): UseSuspenseInfiniteQueryResult<TData, TError> & {
    queryKey: DataTag<QueryKey, TData, TError>;
};
declare const updateRoutine: (routineId: string, _function: BodyType<Function>, options?: SecondParameter<typeof customInstance>) => Promise<UpdateRoutine200AllOf>;
declare const getUpdateRoutineMutationOptions: <TError = ErrorType<void>, TContext = unknown>(options?: {
    mutation?: UseMutationOptions<Awaited<ReturnType<typeof updateRoutine>>, TError, {
        routineId: string;
        data: BodyType<Function>;
    }, TContext>;
    request?: SecondParameter<typeof customInstance>;
}) => UseMutationOptions<Awaited<ReturnType<typeof updateRoutine>>, TError, {
    routineId: string;
    data: BodyType<Function>;
}, TContext>;
type UpdateRoutineMutationResult = NonNullable<Awaited<ReturnType<typeof updateRoutine>>>;
type UpdateRoutineMutationBody = BodyType<Function>;
type UpdateRoutineMutationError = ErrorType<void>;
declare const useUpdateRoutine: <TError = ErrorType<void>, TContext = unknown>(options?: {
    mutation?: UseMutationOptions<Awaited<ReturnType<typeof updateRoutine>>, TError, {
        routineId: string;
        data: BodyType<Function>;
    }, TContext>;
    request?: SecondParameter<typeof customInstance>;
}, queryClient?: QueryClient) => UseMutationResult<Awaited<ReturnType<typeof updateRoutine>>, TError, {
    routineId: string;
    data: BodyType<Function>;
}, TContext>;
declare const deleteRoutine: (routineId: string, options?: SecondParameter<typeof customInstance>) => Promise<DeleteRoutine200AllOf>;
declare const getDeleteRoutineMutationOptions: <TError = ErrorType<void>, TContext = unknown>(options?: {
    mutation?: UseMutationOptions<Awaited<ReturnType<typeof deleteRoutine>>, TError, {
        routineId: string;
    }, TContext>;
    request?: SecondParameter<typeof customInstance>;
}) => UseMutationOptions<Awaited<ReturnType<typeof deleteRoutine>>, TError, {
    routineId: string;
}, TContext>;
type DeleteRoutineMutationResult = NonNullable<Awaited<ReturnType<typeof deleteRoutine>>>;
type DeleteRoutineMutationError = ErrorType<void>;
declare const useDeleteRoutine: <TError = ErrorType<void>, TContext = unknown>(options?: {
    mutation?: UseMutationOptions<Awaited<ReturnType<typeof deleteRoutine>>, TError, {
        routineId: string;
    }, TContext>;
    request?: SecondParameter<typeof customInstance>;
}, queryClient?: QueryClient) => UseMutationResult<Awaited<ReturnType<typeof deleteRoutine>>, TError, {
    routineId: string;
}, TContext>;
declare const removeRoutine: (routineId: string, options?: SecondParameter<typeof customInstance>) => Promise<RemoveRoutine200AllOf>;
declare const getRemoveRoutineMutationOptions: <TError = ErrorType<void>, TContext = unknown>(options?: {
    mutation?: UseMutationOptions<Awaited<ReturnType<typeof removeRoutine>>, TError, {
        routineId: string;
    }, TContext>;
    request?: SecondParameter<typeof customInstance>;
}) => UseMutationOptions<Awaited<ReturnType<typeof removeRoutine>>, TError, {
    routineId: string;
}, TContext>;
type RemoveRoutineMutationResult = NonNullable<Awaited<ReturnType<typeof removeRoutine>>>;
type RemoveRoutineMutationError = ErrorType<void>;
declare const useRemoveRoutine: <TError = ErrorType<void>, TContext = unknown>(options?: {
    mutation?: UseMutationOptions<Awaited<ReturnType<typeof removeRoutine>>, TError, {
        routineId: string;
    }, TContext>;
    request?: SecondParameter<typeof customInstance>;
}, queryClient?: QueryClient) => UseMutationResult<Awaited<ReturnType<typeof removeRoutine>>, TError, {
    routineId: string;
}, TContext>;
declare const getExercisesByQuery: (params?: GetExercisesByQueryParams, options?: SecondParameter<typeof customInstance>, signal?: AbortSignal) => Promise<GetExercisesByQuery200AllOf>;
declare const getGetExercisesByQueryQueryKey: (params?: GetExercisesByQueryParams) => readonly ["/api/v1/exercises", ...GetExercisesByQueryParams[]];
declare const getGetExercisesByQueryQueryOptions: <TData = Awaited<ReturnType<typeof getExercisesByQuery>>, TError = ErrorType<void>>(params?: GetExercisesByQueryParams, options?: {
    query?: Partial<UseQueryOptions<Awaited<ReturnType<typeof getExercisesByQuery>>, TError, TData>>;
    request?: SecondParameter<typeof customInstance>;
}) => UseQueryOptions<Awaited<ReturnType<typeof getExercisesByQuery>>, TError, TData> & {
    queryKey: DataTag<QueryKey, TData, TError>;
};
type GetExercisesByQueryQueryResult = NonNullable<Awaited<ReturnType<typeof getExercisesByQuery>>>;
type GetExercisesByQueryQueryError = ErrorType<void>;
declare function useGetExercisesByQuery<TData = Awaited<ReturnType<typeof getExercisesByQuery>>, TError = ErrorType<void>>(params: undefined | GetExercisesByQueryParams, options: {
    query: Partial<UseQueryOptions<Awaited<ReturnType<typeof getExercisesByQuery>>, TError, TData>> & Pick<DefinedInitialDataOptions<Awaited<ReturnType<typeof getExercisesByQuery>>, TError, Awaited<ReturnType<typeof getExercisesByQuery>>>, "initialData">;
    request?: SecondParameter<typeof customInstance>;
}, queryClient?: QueryClient): DefinedUseQueryResult<TData, TError> & {
    queryKey: DataTag<QueryKey, TData, TError>;
};
declare function useGetExercisesByQuery<TData = Awaited<ReturnType<typeof getExercisesByQuery>>, TError = ErrorType<void>>(params?: GetExercisesByQueryParams, options?: {
    query?: Partial<UseQueryOptions<Awaited<ReturnType<typeof getExercisesByQuery>>, TError, TData>> & Pick<UndefinedInitialDataOptions<Awaited<ReturnType<typeof getExercisesByQuery>>, TError, Awaited<ReturnType<typeof getExercisesByQuery>>>, "initialData">;
    request?: SecondParameter<typeof customInstance>;
}, queryClient?: QueryClient): UseQueryResult<TData, TError> & {
    queryKey: DataTag<QueryKey, TData, TError>;
};
declare function useGetExercisesByQuery<TData = Awaited<ReturnType<typeof getExercisesByQuery>>, TError = ErrorType<void>>(params?: GetExercisesByQueryParams, options?: {
    query?: Partial<UseQueryOptions<Awaited<ReturnType<typeof getExercisesByQuery>>, TError, TData>>;
    request?: SecondParameter<typeof customInstance>;
}, queryClient?: QueryClient): UseQueryResult<TData, TError> & {
    queryKey: DataTag<QueryKey, TData, TError>;
};
declare const getGetExercisesByQuerySuspenseQueryOptions: <TData = Awaited<ReturnType<typeof getExercisesByQuery>>, TError = ErrorType<void>>(params?: GetExercisesByQueryParams, options?: {
    query?: Partial<UseSuspenseQueryOptions<Awaited<ReturnType<typeof getExercisesByQuery>>, TError, TData>>;
    request?: SecondParameter<typeof customInstance>;
}) => UseSuspenseQueryOptions<Awaited<ReturnType<typeof getExercisesByQuery>>, TError, TData> & {
    queryKey: DataTag<QueryKey, TData, TError>;
};
type GetExercisesByQuerySuspenseQueryResult = NonNullable<Awaited<ReturnType<typeof getExercisesByQuery>>>;
type GetExercisesByQuerySuspenseQueryError = ErrorType<void>;
declare function useGetExercisesByQuerySuspense<TData = Awaited<ReturnType<typeof getExercisesByQuery>>, TError = ErrorType<void>>(params: undefined | GetExercisesByQueryParams, options: {
    query: Partial<UseSuspenseQueryOptions<Awaited<ReturnType<typeof getExercisesByQuery>>, TError, TData>>;
    request?: SecondParameter<typeof customInstance>;
}, queryClient?: QueryClient): UseSuspenseQueryResult<TData, TError> & {
    queryKey: DataTag<QueryKey, TData, TError>;
};
declare function useGetExercisesByQuerySuspense<TData = Awaited<ReturnType<typeof getExercisesByQuery>>, TError = ErrorType<void>>(params?: GetExercisesByQueryParams, options?: {
    query?: Partial<UseSuspenseQueryOptions<Awaited<ReturnType<typeof getExercisesByQuery>>, TError, TData>>;
    request?: SecondParameter<typeof customInstance>;
}, queryClient?: QueryClient): UseSuspenseQueryResult<TData, TError> & {
    queryKey: DataTag<QueryKey, TData, TError>;
};
declare function useGetExercisesByQuerySuspense<TData = Awaited<ReturnType<typeof getExercisesByQuery>>, TError = ErrorType<void>>(params?: GetExercisesByQueryParams, options?: {
    query?: Partial<UseSuspenseQueryOptions<Awaited<ReturnType<typeof getExercisesByQuery>>, TError, TData>>;
    request?: SecondParameter<typeof customInstance>;
}, queryClient?: QueryClient): UseSuspenseQueryResult<TData, TError> & {
    queryKey: DataTag<QueryKey, TData, TError>;
};
declare const getGetExercisesByQuerySuspenseInfiniteQueryOptions: <TData = InfiniteData<Awaited<ReturnType<typeof getExercisesByQuery>>>, TError = ErrorType<void>>(params?: GetExercisesByQueryParams, options?: {
    query?: Partial<UseSuspenseInfiniteQueryOptions<Awaited<ReturnType<typeof getExercisesByQuery>>, TError, TData>>;
    request?: SecondParameter<typeof customInstance>;
}) => UseSuspenseInfiniteQueryOptions<Awaited<ReturnType<typeof getExercisesByQuery>>, TError, TData> & {
    queryKey: DataTag<QueryKey, TData, TError>;
};
type GetExercisesByQuerySuspenseInfiniteQueryResult = NonNullable<Awaited<ReturnType<typeof getExercisesByQuery>>>;
type GetExercisesByQuerySuspenseInfiniteQueryError = ErrorType<void>;
declare function useGetExercisesByQuerySuspenseInfinite<TData = InfiniteData<Awaited<ReturnType<typeof getExercisesByQuery>>>, TError = ErrorType<void>>(params: undefined | GetExercisesByQueryParams, options: {
    query: Partial<UseSuspenseInfiniteQueryOptions<Awaited<ReturnType<typeof getExercisesByQuery>>, TError, TData>>;
    request?: SecondParameter<typeof customInstance>;
}, queryClient?: QueryClient): UseSuspenseInfiniteQueryResult<TData, TError> & {
    queryKey: DataTag<QueryKey, TData, TError>;
};
declare function useGetExercisesByQuerySuspenseInfinite<TData = InfiniteData<Awaited<ReturnType<typeof getExercisesByQuery>>>, TError = ErrorType<void>>(params?: GetExercisesByQueryParams, options?: {
    query?: Partial<UseSuspenseInfiniteQueryOptions<Awaited<ReturnType<typeof getExercisesByQuery>>, TError, TData>>;
    request?: SecondParameter<typeof customInstance>;
}, queryClient?: QueryClient): UseSuspenseInfiniteQueryResult<TData, TError> & {
    queryKey: DataTag<QueryKey, TData, TError>;
};
declare function useGetExercisesByQuerySuspenseInfinite<TData = InfiniteData<Awaited<ReturnType<typeof getExercisesByQuery>>>, TError = ErrorType<void>>(params?: GetExercisesByQueryParams, options?: {
    query?: Partial<UseSuspenseInfiniteQueryOptions<Awaited<ReturnType<typeof getExercisesByQuery>>, TError, TData>>;
    request?: SecondParameter<typeof customInstance>;
}, queryClient?: QueryClient): UseSuspenseInfiniteQueryResult<TData, TError> & {
    queryKey: DataTag<QueryKey, TData, TError>;
};
declare const createExercise: (createExerciseDto: BodyType<CreateExerciseDto>, options?: SecondParameter<typeof customInstance>, signal?: AbortSignal) => Promise<CreateExercise200AllOf>;
declare const getCreateExerciseMutationOptions: <TError = ErrorType<void>, TContext = unknown>(options?: {
    mutation?: UseMutationOptions<Awaited<ReturnType<typeof createExercise>>, TError, {
        data: BodyType<CreateExerciseDto>;
    }, TContext>;
    request?: SecondParameter<typeof customInstance>;
}) => UseMutationOptions<Awaited<ReturnType<typeof createExercise>>, TError, {
    data: BodyType<CreateExerciseDto>;
}, TContext>;
type CreateExerciseMutationResult = NonNullable<Awaited<ReturnType<typeof createExercise>>>;
type CreateExerciseMutationBody = BodyType<CreateExerciseDto>;
type CreateExerciseMutationError = ErrorType<void>;
declare const useCreateExercise: <TError = ErrorType<void>, TContext = unknown>(options?: {
    mutation?: UseMutationOptions<Awaited<ReturnType<typeof createExercise>>, TError, {
        data: BodyType<CreateExerciseDto>;
    }, TContext>;
    request?: SecondParameter<typeof customInstance>;
}, queryClient?: QueryClient) => UseMutationResult<Awaited<ReturnType<typeof createExercise>>, TError, {
    data: BodyType<CreateExerciseDto>;
}, TContext>;
declare const getExercise: (exerciseId: string, options?: SecondParameter<typeof customInstance>, signal?: AbortSignal) => Promise<GetExercise200AllOf>;
declare const getGetExerciseQueryKey: (exerciseId: string) => readonly [`/api/v1/exercises/${string}`];
declare const getGetExerciseQueryOptions: <TData = Awaited<ReturnType<typeof getExercise>>, TError = ErrorType<void>>(exerciseId: string, options?: {
    query?: Partial<UseQueryOptions<Awaited<ReturnType<typeof getExercise>>, TError, TData>>;
    request?: SecondParameter<typeof customInstance>;
}) => UseQueryOptions<Awaited<ReturnType<typeof getExercise>>, TError, TData> & {
    queryKey: DataTag<QueryKey, TData, TError>;
};
type GetExerciseQueryResult = NonNullable<Awaited<ReturnType<typeof getExercise>>>;
type GetExerciseQueryError = ErrorType<void>;
declare function useGetExercise<TData = Awaited<ReturnType<typeof getExercise>>, TError = ErrorType<void>>(exerciseId: string, options: {
    query: Partial<UseQueryOptions<Awaited<ReturnType<typeof getExercise>>, TError, TData>> & Pick<DefinedInitialDataOptions<Awaited<ReturnType<typeof getExercise>>, TError, Awaited<ReturnType<typeof getExercise>>>, "initialData">;
    request?: SecondParameter<typeof customInstance>;
}, queryClient?: QueryClient): DefinedUseQueryResult<TData, TError> & {
    queryKey: DataTag<QueryKey, TData, TError>;
};
declare function useGetExercise<TData = Awaited<ReturnType<typeof getExercise>>, TError = ErrorType<void>>(exerciseId: string, options?: {
    query?: Partial<UseQueryOptions<Awaited<ReturnType<typeof getExercise>>, TError, TData>> & Pick<UndefinedInitialDataOptions<Awaited<ReturnType<typeof getExercise>>, TError, Awaited<ReturnType<typeof getExercise>>>, "initialData">;
    request?: SecondParameter<typeof customInstance>;
}, queryClient?: QueryClient): UseQueryResult<TData, TError> & {
    queryKey: DataTag<QueryKey, TData, TError>;
};
declare function useGetExercise<TData = Awaited<ReturnType<typeof getExercise>>, TError = ErrorType<void>>(exerciseId: string, options?: {
    query?: Partial<UseQueryOptions<Awaited<ReturnType<typeof getExercise>>, TError, TData>>;
    request?: SecondParameter<typeof customInstance>;
}, queryClient?: QueryClient): UseQueryResult<TData, TError> & {
    queryKey: DataTag<QueryKey, TData, TError>;
};
declare const getGetExerciseSuspenseQueryOptions: <TData = Awaited<ReturnType<typeof getExercise>>, TError = ErrorType<void>>(exerciseId: string, options?: {
    query?: Partial<UseSuspenseQueryOptions<Awaited<ReturnType<typeof getExercise>>, TError, TData>>;
    request?: SecondParameter<typeof customInstance>;
}) => UseSuspenseQueryOptions<Awaited<ReturnType<typeof getExercise>>, TError, TData> & {
    queryKey: DataTag<QueryKey, TData, TError>;
};
type GetExerciseSuspenseQueryResult = NonNullable<Awaited<ReturnType<typeof getExercise>>>;
type GetExerciseSuspenseQueryError = ErrorType<void>;
declare function useGetExerciseSuspense<TData = Awaited<ReturnType<typeof getExercise>>, TError = ErrorType<void>>(exerciseId: string, options: {
    query: Partial<UseSuspenseQueryOptions<Awaited<ReturnType<typeof getExercise>>, TError, TData>>;
    request?: SecondParameter<typeof customInstance>;
}, queryClient?: QueryClient): UseSuspenseQueryResult<TData, TError> & {
    queryKey: DataTag<QueryKey, TData, TError>;
};
declare function useGetExerciseSuspense<TData = Awaited<ReturnType<typeof getExercise>>, TError = ErrorType<void>>(exerciseId: string, options?: {
    query?: Partial<UseSuspenseQueryOptions<Awaited<ReturnType<typeof getExercise>>, TError, TData>>;
    request?: SecondParameter<typeof customInstance>;
}, queryClient?: QueryClient): UseSuspenseQueryResult<TData, TError> & {
    queryKey: DataTag<QueryKey, TData, TError>;
};
declare function useGetExerciseSuspense<TData = Awaited<ReturnType<typeof getExercise>>, TError = ErrorType<void>>(exerciseId: string, options?: {
    query?: Partial<UseSuspenseQueryOptions<Awaited<ReturnType<typeof getExercise>>, TError, TData>>;
    request?: SecondParameter<typeof customInstance>;
}, queryClient?: QueryClient): UseSuspenseQueryResult<TData, TError> & {
    queryKey: DataTag<QueryKey, TData, TError>;
};
declare const getGetExerciseSuspenseInfiniteQueryOptions: <TData = InfiniteData<Awaited<ReturnType<typeof getExercise>>>, TError = ErrorType<void>>(exerciseId: string, options?: {
    query?: Partial<UseSuspenseInfiniteQueryOptions<Awaited<ReturnType<typeof getExercise>>, TError, TData>>;
    request?: SecondParameter<typeof customInstance>;
}) => UseSuspenseInfiniteQueryOptions<Awaited<ReturnType<typeof getExercise>>, TError, TData> & {
    queryKey: DataTag<QueryKey, TData, TError>;
};
type GetExerciseSuspenseInfiniteQueryResult = NonNullable<Awaited<ReturnType<typeof getExercise>>>;
type GetExerciseSuspenseInfiniteQueryError = ErrorType<void>;
declare function useGetExerciseSuspenseInfinite<TData = InfiniteData<Awaited<ReturnType<typeof getExercise>>>, TError = ErrorType<void>>(exerciseId: string, options: {
    query: Partial<UseSuspenseInfiniteQueryOptions<Awaited<ReturnType<typeof getExercise>>, TError, TData>>;
    request?: SecondParameter<typeof customInstance>;
}, queryClient?: QueryClient): UseSuspenseInfiniteQueryResult<TData, TError> & {
    queryKey: DataTag<QueryKey, TData, TError>;
};
declare function useGetExerciseSuspenseInfinite<TData = InfiniteData<Awaited<ReturnType<typeof getExercise>>>, TError = ErrorType<void>>(exerciseId: string, options?: {
    query?: Partial<UseSuspenseInfiniteQueryOptions<Awaited<ReturnType<typeof getExercise>>, TError, TData>>;
    request?: SecondParameter<typeof customInstance>;
}, queryClient?: QueryClient): UseSuspenseInfiniteQueryResult<TData, TError> & {
    queryKey: DataTag<QueryKey, TData, TError>;
};
declare function useGetExerciseSuspenseInfinite<TData = InfiniteData<Awaited<ReturnType<typeof getExercise>>>, TError = ErrorType<void>>(exerciseId: string, options?: {
    query?: Partial<UseSuspenseInfiniteQueryOptions<Awaited<ReturnType<typeof getExercise>>, TError, TData>>;
    request?: SecondParameter<typeof customInstance>;
}, queryClient?: QueryClient): UseSuspenseInfiniteQueryResult<TData, TError> & {
    queryKey: DataTag<QueryKey, TData, TError>;
};
declare const updateExercise: (exerciseId: string, updateExerciseDto: BodyType<UpdateExerciseDto>, options?: SecondParameter<typeof customInstance>) => Promise<UpdateExercise200AllOf>;
declare const getUpdateExerciseMutationOptions: <TError = ErrorType<void>, TContext = unknown>(options?: {
    mutation?: UseMutationOptions<Awaited<ReturnType<typeof updateExercise>>, TError, {
        exerciseId: string;
        data: BodyType<UpdateExerciseDto>;
    }, TContext>;
    request?: SecondParameter<typeof customInstance>;
}) => UseMutationOptions<Awaited<ReturnType<typeof updateExercise>>, TError, {
    exerciseId: string;
    data: BodyType<UpdateExerciseDto>;
}, TContext>;
type UpdateExerciseMutationResult = NonNullable<Awaited<ReturnType<typeof updateExercise>>>;
type UpdateExerciseMutationBody = BodyType<UpdateExerciseDto>;
type UpdateExerciseMutationError = ErrorType<void>;
declare const useUpdateExercise: <TError = ErrorType<void>, TContext = unknown>(options?: {
    mutation?: UseMutationOptions<Awaited<ReturnType<typeof updateExercise>>, TError, {
        exerciseId: string;
        data: BodyType<UpdateExerciseDto>;
    }, TContext>;
    request?: SecondParameter<typeof customInstance>;
}, queryClient?: QueryClient) => UseMutationResult<Awaited<ReturnType<typeof updateExercise>>, TError, {
    exerciseId: string;
    data: BodyType<UpdateExerciseDto>;
}, TContext>;
declare const deleteExercise: (exerciseId: string, options?: SecondParameter<typeof customInstance>) => Promise<DeleteExercise200AllOf>;
declare const getDeleteExerciseMutationOptions: <TError = ErrorType<void>, TContext = unknown>(options?: {
    mutation?: UseMutationOptions<Awaited<ReturnType<typeof deleteExercise>>, TError, {
        exerciseId: string;
    }, TContext>;
    request?: SecondParameter<typeof customInstance>;
}) => UseMutationOptions<Awaited<ReturnType<typeof deleteExercise>>, TError, {
    exerciseId: string;
}, TContext>;
type DeleteExerciseMutationResult = NonNullable<Awaited<ReturnType<typeof deleteExercise>>>;
type DeleteExerciseMutationError = ErrorType<void>;
declare const useDeleteExercise: <TError = ErrorType<void>, TContext = unknown>(options?: {
    mutation?: UseMutationOptions<Awaited<ReturnType<typeof deleteExercise>>, TError, {
        exerciseId: string;
    }, TContext>;
    request?: SecondParameter<typeof customInstance>;
}, queryClient?: QueryClient) => UseMutationResult<Awaited<ReturnType<typeof deleteExercise>>, TError, {
    exerciseId: string;
}, TContext>;
declare const removeExercise: (exerciseId: string, options?: SecondParameter<typeof customInstance>) => Promise<RemoveExercise200AllOf>;
declare const getRemoveExerciseMutationOptions: <TError = ErrorType<void>, TContext = unknown>(options?: {
    mutation?: UseMutationOptions<Awaited<ReturnType<typeof removeExercise>>, TError, {
        exerciseId: string;
    }, TContext>;
    request?: SecondParameter<typeof customInstance>;
}) => UseMutationOptions<Awaited<ReturnType<typeof removeExercise>>, TError, {
    exerciseId: string;
}, TContext>;
type RemoveExerciseMutationResult = NonNullable<Awaited<ReturnType<typeof removeExercise>>>;
type RemoveExerciseMutationError = ErrorType<void>;
declare const useRemoveExercise: <TError = ErrorType<void>, TContext = unknown>(options?: {
    mutation?: UseMutationOptions<Awaited<ReturnType<typeof removeExercise>>, TError, {
        exerciseId: string;
    }, TContext>;
    request?: SecondParameter<typeof customInstance>;
}, queryClient?: QueryClient) => UseMutationResult<Awaited<ReturnType<typeof removeExercise>>, TError, {
    exerciseId: string;
}, TContext>;
declare const getFileById: (fileId: string, options?: SecondParameter<typeof customInstance>, signal?: AbortSignal) => Promise<GetFileById200AllOf>;
declare const getGetFileByIdQueryKey: (fileId: string) => readonly [`/api/v1/files/${string}`];
declare const getGetFileByIdQueryOptions: <TData = Awaited<ReturnType<typeof getFileById>>, TError = ErrorType<void>>(fileId: string, options?: {
    query?: Partial<UseQueryOptions<Awaited<ReturnType<typeof getFileById>>, TError, TData>>;
    request?: SecondParameter<typeof customInstance>;
}) => UseQueryOptions<Awaited<ReturnType<typeof getFileById>>, TError, TData> & {
    queryKey: DataTag<QueryKey, TData, TError>;
};
type GetFileByIdQueryResult = NonNullable<Awaited<ReturnType<typeof getFileById>>>;
type GetFileByIdQueryError = ErrorType<void>;
declare function useGetFileById<TData = Awaited<ReturnType<typeof getFileById>>, TError = ErrorType<void>>(fileId: string, options: {
    query: Partial<UseQueryOptions<Awaited<ReturnType<typeof getFileById>>, TError, TData>> & Pick<DefinedInitialDataOptions<Awaited<ReturnType<typeof getFileById>>, TError, Awaited<ReturnType<typeof getFileById>>>, "initialData">;
    request?: SecondParameter<typeof customInstance>;
}, queryClient?: QueryClient): DefinedUseQueryResult<TData, TError> & {
    queryKey: DataTag<QueryKey, TData, TError>;
};
declare function useGetFileById<TData = Awaited<ReturnType<typeof getFileById>>, TError = ErrorType<void>>(fileId: string, options?: {
    query?: Partial<UseQueryOptions<Awaited<ReturnType<typeof getFileById>>, TError, TData>> & Pick<UndefinedInitialDataOptions<Awaited<ReturnType<typeof getFileById>>, TError, Awaited<ReturnType<typeof getFileById>>>, "initialData">;
    request?: SecondParameter<typeof customInstance>;
}, queryClient?: QueryClient): UseQueryResult<TData, TError> & {
    queryKey: DataTag<QueryKey, TData, TError>;
};
declare function useGetFileById<TData = Awaited<ReturnType<typeof getFileById>>, TError = ErrorType<void>>(fileId: string, options?: {
    query?: Partial<UseQueryOptions<Awaited<ReturnType<typeof getFileById>>, TError, TData>>;
    request?: SecondParameter<typeof customInstance>;
}, queryClient?: QueryClient): UseQueryResult<TData, TError> & {
    queryKey: DataTag<QueryKey, TData, TError>;
};
declare const getGetFileByIdSuspenseQueryOptions: <TData = Awaited<ReturnType<typeof getFileById>>, TError = ErrorType<void>>(fileId: string, options?: {
    query?: Partial<UseSuspenseQueryOptions<Awaited<ReturnType<typeof getFileById>>, TError, TData>>;
    request?: SecondParameter<typeof customInstance>;
}) => UseSuspenseQueryOptions<Awaited<ReturnType<typeof getFileById>>, TError, TData> & {
    queryKey: DataTag<QueryKey, TData, TError>;
};
type GetFileByIdSuspenseQueryResult = NonNullable<Awaited<ReturnType<typeof getFileById>>>;
type GetFileByIdSuspenseQueryError = ErrorType<void>;
declare function useGetFileByIdSuspense<TData = Awaited<ReturnType<typeof getFileById>>, TError = ErrorType<void>>(fileId: string, options: {
    query: Partial<UseSuspenseQueryOptions<Awaited<ReturnType<typeof getFileById>>, TError, TData>>;
    request?: SecondParameter<typeof customInstance>;
}, queryClient?: QueryClient): UseSuspenseQueryResult<TData, TError> & {
    queryKey: DataTag<QueryKey, TData, TError>;
};
declare function useGetFileByIdSuspense<TData = Awaited<ReturnType<typeof getFileById>>, TError = ErrorType<void>>(fileId: string, options?: {
    query?: Partial<UseSuspenseQueryOptions<Awaited<ReturnType<typeof getFileById>>, TError, TData>>;
    request?: SecondParameter<typeof customInstance>;
}, queryClient?: QueryClient): UseSuspenseQueryResult<TData, TError> & {
    queryKey: DataTag<QueryKey, TData, TError>;
};
declare function useGetFileByIdSuspense<TData = Awaited<ReturnType<typeof getFileById>>, TError = ErrorType<void>>(fileId: string, options?: {
    query?: Partial<UseSuspenseQueryOptions<Awaited<ReturnType<typeof getFileById>>, TError, TData>>;
    request?: SecondParameter<typeof customInstance>;
}, queryClient?: QueryClient): UseSuspenseQueryResult<TData, TError> & {
    queryKey: DataTag<QueryKey, TData, TError>;
};
declare const getGetFileByIdSuspenseInfiniteQueryOptions: <TData = InfiniteData<Awaited<ReturnType<typeof getFileById>>>, TError = ErrorType<void>>(fileId: string, options?: {
    query?: Partial<UseSuspenseInfiniteQueryOptions<Awaited<ReturnType<typeof getFileById>>, TError, TData>>;
    request?: SecondParameter<typeof customInstance>;
}) => UseSuspenseInfiniteQueryOptions<Awaited<ReturnType<typeof getFileById>>, TError, TData> & {
    queryKey: DataTag<QueryKey, TData, TError>;
};
type GetFileByIdSuspenseInfiniteQueryResult = NonNullable<Awaited<ReturnType<typeof getFileById>>>;
type GetFileByIdSuspenseInfiniteQueryError = ErrorType<void>;
declare function useGetFileByIdSuspenseInfinite<TData = InfiniteData<Awaited<ReturnType<typeof getFileById>>>, TError = ErrorType<void>>(fileId: string, options: {
    query: Partial<UseSuspenseInfiniteQueryOptions<Awaited<ReturnType<typeof getFileById>>, TError, TData>>;
    request?: SecondParameter<typeof customInstance>;
}, queryClient?: QueryClient): UseSuspenseInfiniteQueryResult<TData, TError> & {
    queryKey: DataTag<QueryKey, TData, TError>;
};
declare function useGetFileByIdSuspenseInfinite<TData = InfiniteData<Awaited<ReturnType<typeof getFileById>>>, TError = ErrorType<void>>(fileId: string, options?: {
    query?: Partial<UseSuspenseInfiniteQueryOptions<Awaited<ReturnType<typeof getFileById>>, TError, TData>>;
    request?: SecondParameter<typeof customInstance>;
}, queryClient?: QueryClient): UseSuspenseInfiniteQueryResult<TData, TError> & {
    queryKey: DataTag<QueryKey, TData, TError>;
};
declare function useGetFileByIdSuspenseInfinite<TData = InfiniteData<Awaited<ReturnType<typeof getFileById>>>, TError = ErrorType<void>>(fileId: string, options?: {
    query?: Partial<UseSuspenseInfiniteQueryOptions<Awaited<ReturnType<typeof getFileById>>, TError, TData>>;
    request?: SecondParameter<typeof customInstance>;
}, queryClient?: QueryClient): UseSuspenseInfiniteQueryResult<TData, TError> & {
    queryKey: DataTag<QueryKey, TData, TError>;
};
declare const updateFileById: (fileId: string, updateFileByIdBody?: BodyType<UpdateFileByIdBody>, options?: SecondParameter<typeof customInstance>) => Promise<UpdateFileById200AllOf>;
declare const getUpdateFileByIdMutationOptions: <TError = ErrorType<void>, TContext = unknown>(options?: {
    mutation?: UseMutationOptions<Awaited<ReturnType<typeof updateFileById>>, TError, {
        fileId: string;
        data: BodyType<UpdateFileByIdBody>;
    }, TContext>;
    request?: SecondParameter<typeof customInstance>;
}) => UseMutationOptions<Awaited<ReturnType<typeof updateFileById>>, TError, {
    fileId: string;
    data: BodyType<UpdateFileByIdBody>;
}, TContext>;
type UpdateFileByIdMutationResult = NonNullable<Awaited<ReturnType<typeof updateFileById>>>;
type UpdateFileByIdMutationBody = BodyType<UpdateFileByIdBody>;
type UpdateFileByIdMutationError = ErrorType<void>;
declare const useUpdateFileById: <TError = ErrorType<void>, TContext = unknown>(options?: {
    mutation?: UseMutationOptions<Awaited<ReturnType<typeof updateFileById>>, TError, {
        fileId: string;
        data: BodyType<UpdateFileByIdBody>;
    }, TContext>;
    request?: SecondParameter<typeof customInstance>;
}, queryClient?: QueryClient) => UseMutationResult<Awaited<ReturnType<typeof updateFileById>>, TError, {
    fileId: string;
    data: BodyType<UpdateFileByIdBody>;
}, TContext>;
declare const createFile: (createFileDto: BodyType<CreateFileDto>, options?: SecondParameter<typeof customInstance>, signal?: AbortSignal) => Promise<CreateFile201AllOf>;
declare const getCreateFileMutationOptions: <TError = ErrorType<void>, TContext = unknown>(options?: {
    mutation?: UseMutationOptions<Awaited<ReturnType<typeof createFile>>, TError, {
        data: BodyType<CreateFileDto>;
    }, TContext>;
    request?: SecondParameter<typeof customInstance>;
}) => UseMutationOptions<Awaited<ReturnType<typeof createFile>>, TError, {
    data: BodyType<CreateFileDto>;
}, TContext>;
type CreateFileMutationResult = NonNullable<Awaited<ReturnType<typeof createFile>>>;
type CreateFileMutationBody = BodyType<CreateFileDto>;
type CreateFileMutationError = ErrorType<void>;
declare const useCreateFile: <TError = ErrorType<void>, TContext = unknown>(options?: {
    mutation?: UseMutationOptions<Awaited<ReturnType<typeof createFile>>, TError, {
        data: BodyType<CreateFileDto>;
    }, TContext>;
    request?: SecondParameter<typeof customInstance>;
}, queryClient?: QueryClient) => UseMutationResult<Awaited<ReturnType<typeof createFile>>, TError, {
    data: BodyType<CreateFileDto>;
}, TContext>;
declare const removeFileById: (fileId: string, options?: SecondParameter<typeof customInstance>) => Promise<RemoveFileById200AllOf>;
declare const getRemoveFileByIdMutationOptions: <TError = ErrorType<void>, TContext = unknown>(options?: {
    mutation?: UseMutationOptions<Awaited<ReturnType<typeof removeFileById>>, TError, {
        fileId: string;
    }, TContext>;
    request?: SecondParameter<typeof customInstance>;
}) => UseMutationOptions<Awaited<ReturnType<typeof removeFileById>>, TError, {
    fileId: string;
}, TContext>;
type RemoveFileByIdMutationResult = NonNullable<Awaited<ReturnType<typeof removeFileById>>>;
type RemoveFileByIdMutationError = ErrorType<void>;
declare const useRemoveFileById: <TError = ErrorType<void>, TContext = unknown>(options?: {
    mutation?: UseMutationOptions<Awaited<ReturnType<typeof removeFileById>>, TError, {
        fileId: string;
    }, TContext>;
    request?: SecondParameter<typeof customInstance>;
}, queryClient?: QueryClient) => UseMutationResult<Awaited<ReturnType<typeof removeFileById>>, TError, {
    fileId: string;
}, TContext>;
declare const getMyTenants: (options?: SecondParameter<typeof customInstance>, signal?: AbortSignal) => Promise<GetMyTenants200AllOf>;
declare const getGetMyTenantsQueryKey: () => readonly ["/api/v1/tenants/my"];
declare const getGetMyTenantsQueryOptions: <TData = Awaited<ReturnType<typeof getMyTenants>>, TError = ErrorType<void>>(options?: {
    query?: Partial<UseQueryOptions<Awaited<ReturnType<typeof getMyTenants>>, TError, TData>>;
    request?: SecondParameter<typeof customInstance>;
}) => UseQueryOptions<Awaited<ReturnType<typeof getMyTenants>>, TError, TData> & {
    queryKey: DataTag<QueryKey, TData, TError>;
};
type GetMyTenantsQueryResult = NonNullable<Awaited<ReturnType<typeof getMyTenants>>>;
type GetMyTenantsQueryError = ErrorType<void>;
declare function useGetMyTenants<TData = Awaited<ReturnType<typeof getMyTenants>>, TError = ErrorType<void>>(options: {
    query: Partial<UseQueryOptions<Awaited<ReturnType<typeof getMyTenants>>, TError, TData>> & Pick<DefinedInitialDataOptions<Awaited<ReturnType<typeof getMyTenants>>, TError, Awaited<ReturnType<typeof getMyTenants>>>, "initialData">;
    request?: SecondParameter<typeof customInstance>;
}, queryClient?: QueryClient): DefinedUseQueryResult<TData, TError> & {
    queryKey: DataTag<QueryKey, TData, TError>;
};
declare function useGetMyTenants<TData = Awaited<ReturnType<typeof getMyTenants>>, TError = ErrorType<void>>(options?: {
    query?: Partial<UseQueryOptions<Awaited<ReturnType<typeof getMyTenants>>, TError, TData>> & Pick<UndefinedInitialDataOptions<Awaited<ReturnType<typeof getMyTenants>>, TError, Awaited<ReturnType<typeof getMyTenants>>>, "initialData">;
    request?: SecondParameter<typeof customInstance>;
}, queryClient?: QueryClient): UseQueryResult<TData, TError> & {
    queryKey: DataTag<QueryKey, TData, TError>;
};
declare function useGetMyTenants<TData = Awaited<ReturnType<typeof getMyTenants>>, TError = ErrorType<void>>(options?: {
    query?: Partial<UseQueryOptions<Awaited<ReturnType<typeof getMyTenants>>, TError, TData>>;
    request?: SecondParameter<typeof customInstance>;
}, queryClient?: QueryClient): UseQueryResult<TData, TError> & {
    queryKey: DataTag<QueryKey, TData, TError>;
};
declare const getGetMyTenantsSuspenseQueryOptions: <TData = Awaited<ReturnType<typeof getMyTenants>>, TError = ErrorType<void>>(options?: {
    query?: Partial<UseSuspenseQueryOptions<Awaited<ReturnType<typeof getMyTenants>>, TError, TData>>;
    request?: SecondParameter<typeof customInstance>;
}) => UseSuspenseQueryOptions<Awaited<ReturnType<typeof getMyTenants>>, TError, TData> & {
    queryKey: DataTag<QueryKey, TData, TError>;
};
type GetMyTenantsSuspenseQueryResult = NonNullable<Awaited<ReturnType<typeof getMyTenants>>>;
type GetMyTenantsSuspenseQueryError = ErrorType<void>;
declare function useGetMyTenantsSuspense<TData = Awaited<ReturnType<typeof getMyTenants>>, TError = ErrorType<void>>(options: {
    query: Partial<UseSuspenseQueryOptions<Awaited<ReturnType<typeof getMyTenants>>, TError, TData>>;
    request?: SecondParameter<typeof customInstance>;
}, queryClient?: QueryClient): UseSuspenseQueryResult<TData, TError> & {
    queryKey: DataTag<QueryKey, TData, TError>;
};
declare function useGetMyTenantsSuspense<TData = Awaited<ReturnType<typeof getMyTenants>>, TError = ErrorType<void>>(options?: {
    query?: Partial<UseSuspenseQueryOptions<Awaited<ReturnType<typeof getMyTenants>>, TError, TData>>;
    request?: SecondParameter<typeof customInstance>;
}, queryClient?: QueryClient): UseSuspenseQueryResult<TData, TError> & {
    queryKey: DataTag<QueryKey, TData, TError>;
};
declare function useGetMyTenantsSuspense<TData = Awaited<ReturnType<typeof getMyTenants>>, TError = ErrorType<void>>(options?: {
    query?: Partial<UseSuspenseQueryOptions<Awaited<ReturnType<typeof getMyTenants>>, TError, TData>>;
    request?: SecondParameter<typeof customInstance>;
}, queryClient?: QueryClient): UseSuspenseQueryResult<TData, TError> & {
    queryKey: DataTag<QueryKey, TData, TError>;
};
declare const getGetMyTenantsSuspenseInfiniteQueryOptions: <TData = InfiniteData<Awaited<ReturnType<typeof getMyTenants>>>, TError = ErrorType<void>>(options?: {
    query?: Partial<UseSuspenseInfiniteQueryOptions<Awaited<ReturnType<typeof getMyTenants>>, TError, TData>>;
    request?: SecondParameter<typeof customInstance>;
}) => UseSuspenseInfiniteQueryOptions<Awaited<ReturnType<typeof getMyTenants>>, TError, TData> & {
    queryKey: DataTag<QueryKey, TData, TError>;
};
type GetMyTenantsSuspenseInfiniteQueryResult = NonNullable<Awaited<ReturnType<typeof getMyTenants>>>;
type GetMyTenantsSuspenseInfiniteQueryError = ErrorType<void>;
declare function useGetMyTenantsSuspenseInfinite<TData = InfiniteData<Awaited<ReturnType<typeof getMyTenants>>>, TError = ErrorType<void>>(options: {
    query: Partial<UseSuspenseInfiniteQueryOptions<Awaited<ReturnType<typeof getMyTenants>>, TError, TData>>;
    request?: SecondParameter<typeof customInstance>;
}, queryClient?: QueryClient): UseSuspenseInfiniteQueryResult<TData, TError> & {
    queryKey: DataTag<QueryKey, TData, TError>;
};
declare function useGetMyTenantsSuspenseInfinite<TData = InfiniteData<Awaited<ReturnType<typeof getMyTenants>>>, TError = ErrorType<void>>(options?: {
    query?: Partial<UseSuspenseInfiniteQueryOptions<Awaited<ReturnType<typeof getMyTenants>>, TError, TData>>;
    request?: SecondParameter<typeof customInstance>;
}, queryClient?: QueryClient): UseSuspenseInfiniteQueryResult<TData, TError> & {
    queryKey: DataTag<QueryKey, TData, TError>;
};
declare function useGetMyTenantsSuspenseInfinite<TData = InfiniteData<Awaited<ReturnType<typeof getMyTenants>>>, TError = ErrorType<void>>(options?: {
    query?: Partial<UseSuspenseInfiniteQueryOptions<Awaited<ReturnType<typeof getMyTenants>>, TError, TData>>;
    request?: SecondParameter<typeof customInstance>;
}, queryClient?: QueryClient): UseSuspenseInfiniteQueryResult<TData, TError> & {
    queryKey: DataTag<QueryKey, TData, TError>;
};
declare const createTenant: (createTenantDto: BodyType<CreateTenantDto>, options?: SecondParameter<typeof customInstance>, signal?: AbortSignal) => Promise<CreateTenant200AllOf>;
declare const getCreateTenantMutationOptions: <TError = ErrorType<void>, TContext = unknown>(options?: {
    mutation?: UseMutationOptions<Awaited<ReturnType<typeof createTenant>>, TError, {
        data: BodyType<CreateTenantDto>;
    }, TContext>;
    request?: SecondParameter<typeof customInstance>;
}) => UseMutationOptions<Awaited<ReturnType<typeof createTenant>>, TError, {
    data: BodyType<CreateTenantDto>;
}, TContext>;
type CreateTenantMutationResult = NonNullable<Awaited<ReturnType<typeof createTenant>>>;
type CreateTenantMutationBody = BodyType<CreateTenantDto>;
type CreateTenantMutationError = ErrorType<void>;
declare const useCreateTenant: <TError = ErrorType<void>, TContext = unknown>(options?: {
    mutation?: UseMutationOptions<Awaited<ReturnType<typeof createTenant>>, TError, {
        data: BodyType<CreateTenantDto>;
    }, TContext>;
    request?: SecondParameter<typeof customInstance>;
}, queryClient?: QueryClient) => UseMutationResult<Awaited<ReturnType<typeof createTenant>>, TError, {
    data: BodyType<CreateTenantDto>;
}, TContext>;
declare const getTenantsByQuery: (params?: GetTenantsByQueryParams, options?: SecondParameter<typeof customInstance>, signal?: AbortSignal) => Promise<GetTenantsByQuery200AllOf>;
declare const getGetTenantsByQueryQueryKey: (params?: GetTenantsByQueryParams) => readonly ["/api/v1/tenants", ...GetTenantsByQueryParams[]];
declare const getGetTenantsByQueryQueryOptions: <TData = Awaited<ReturnType<typeof getTenantsByQuery>>, TError = ErrorType<void>>(params?: GetTenantsByQueryParams, options?: {
    query?: Partial<UseQueryOptions<Awaited<ReturnType<typeof getTenantsByQuery>>, TError, TData>>;
    request?: SecondParameter<typeof customInstance>;
}) => UseQueryOptions<Awaited<ReturnType<typeof getTenantsByQuery>>, TError, TData> & {
    queryKey: DataTag<QueryKey, TData, TError>;
};
type GetTenantsByQueryQueryResult = NonNullable<Awaited<ReturnType<typeof getTenantsByQuery>>>;
type GetTenantsByQueryQueryError = ErrorType<void>;
declare function useGetTenantsByQuery<TData = Awaited<ReturnType<typeof getTenantsByQuery>>, TError = ErrorType<void>>(params: undefined | GetTenantsByQueryParams, options: {
    query: Partial<UseQueryOptions<Awaited<ReturnType<typeof getTenantsByQuery>>, TError, TData>> & Pick<DefinedInitialDataOptions<Awaited<ReturnType<typeof getTenantsByQuery>>, TError, Awaited<ReturnType<typeof getTenantsByQuery>>>, "initialData">;
    request?: SecondParameter<typeof customInstance>;
}, queryClient?: QueryClient): DefinedUseQueryResult<TData, TError> & {
    queryKey: DataTag<QueryKey, TData, TError>;
};
declare function useGetTenantsByQuery<TData = Awaited<ReturnType<typeof getTenantsByQuery>>, TError = ErrorType<void>>(params?: GetTenantsByQueryParams, options?: {
    query?: Partial<UseQueryOptions<Awaited<ReturnType<typeof getTenantsByQuery>>, TError, TData>> & Pick<UndefinedInitialDataOptions<Awaited<ReturnType<typeof getTenantsByQuery>>, TError, Awaited<ReturnType<typeof getTenantsByQuery>>>, "initialData">;
    request?: SecondParameter<typeof customInstance>;
}, queryClient?: QueryClient): UseQueryResult<TData, TError> & {
    queryKey: DataTag<QueryKey, TData, TError>;
};
declare function useGetTenantsByQuery<TData = Awaited<ReturnType<typeof getTenantsByQuery>>, TError = ErrorType<void>>(params?: GetTenantsByQueryParams, options?: {
    query?: Partial<UseQueryOptions<Awaited<ReturnType<typeof getTenantsByQuery>>, TError, TData>>;
    request?: SecondParameter<typeof customInstance>;
}, queryClient?: QueryClient): UseQueryResult<TData, TError> & {
    queryKey: DataTag<QueryKey, TData, TError>;
};
declare const getGetTenantsByQuerySuspenseQueryOptions: <TData = Awaited<ReturnType<typeof getTenantsByQuery>>, TError = ErrorType<void>>(params?: GetTenantsByQueryParams, options?: {
    query?: Partial<UseSuspenseQueryOptions<Awaited<ReturnType<typeof getTenantsByQuery>>, TError, TData>>;
    request?: SecondParameter<typeof customInstance>;
}) => UseSuspenseQueryOptions<Awaited<ReturnType<typeof getTenantsByQuery>>, TError, TData> & {
    queryKey: DataTag<QueryKey, TData, TError>;
};
type GetTenantsByQuerySuspenseQueryResult = NonNullable<Awaited<ReturnType<typeof getTenantsByQuery>>>;
type GetTenantsByQuerySuspenseQueryError = ErrorType<void>;
declare function useGetTenantsByQuerySuspense<TData = Awaited<ReturnType<typeof getTenantsByQuery>>, TError = ErrorType<void>>(params: undefined | GetTenantsByQueryParams, options: {
    query: Partial<UseSuspenseQueryOptions<Awaited<ReturnType<typeof getTenantsByQuery>>, TError, TData>>;
    request?: SecondParameter<typeof customInstance>;
}, queryClient?: QueryClient): UseSuspenseQueryResult<TData, TError> & {
    queryKey: DataTag<QueryKey, TData, TError>;
};
declare function useGetTenantsByQuerySuspense<TData = Awaited<ReturnType<typeof getTenantsByQuery>>, TError = ErrorType<void>>(params?: GetTenantsByQueryParams, options?: {
    query?: Partial<UseSuspenseQueryOptions<Awaited<ReturnType<typeof getTenantsByQuery>>, TError, TData>>;
    request?: SecondParameter<typeof customInstance>;
}, queryClient?: QueryClient): UseSuspenseQueryResult<TData, TError> & {
    queryKey: DataTag<QueryKey, TData, TError>;
};
declare function useGetTenantsByQuerySuspense<TData = Awaited<ReturnType<typeof getTenantsByQuery>>, TError = ErrorType<void>>(params?: GetTenantsByQueryParams, options?: {
    query?: Partial<UseSuspenseQueryOptions<Awaited<ReturnType<typeof getTenantsByQuery>>, TError, TData>>;
    request?: SecondParameter<typeof customInstance>;
}, queryClient?: QueryClient): UseSuspenseQueryResult<TData, TError> & {
    queryKey: DataTag<QueryKey, TData, TError>;
};
declare const getGetTenantsByQuerySuspenseInfiniteQueryOptions: <TData = InfiniteData<Awaited<ReturnType<typeof getTenantsByQuery>>>, TError = ErrorType<void>>(params?: GetTenantsByQueryParams, options?: {
    query?: Partial<UseSuspenseInfiniteQueryOptions<Awaited<ReturnType<typeof getTenantsByQuery>>, TError, TData>>;
    request?: SecondParameter<typeof customInstance>;
}) => UseSuspenseInfiniteQueryOptions<Awaited<ReturnType<typeof getTenantsByQuery>>, TError, TData> & {
    queryKey: DataTag<QueryKey, TData, TError>;
};
type GetTenantsByQuerySuspenseInfiniteQueryResult = NonNullable<Awaited<ReturnType<typeof getTenantsByQuery>>>;
type GetTenantsByQuerySuspenseInfiniteQueryError = ErrorType<void>;
declare function useGetTenantsByQuerySuspenseInfinite<TData = InfiniteData<Awaited<ReturnType<typeof getTenantsByQuery>>>, TError = ErrorType<void>>(params: undefined | GetTenantsByQueryParams, options: {
    query: Partial<UseSuspenseInfiniteQueryOptions<Awaited<ReturnType<typeof getTenantsByQuery>>, TError, TData>>;
    request?: SecondParameter<typeof customInstance>;
}, queryClient?: QueryClient): UseSuspenseInfiniteQueryResult<TData, TError> & {
    queryKey: DataTag<QueryKey, TData, TError>;
};
declare function useGetTenantsByQuerySuspenseInfinite<TData = InfiniteData<Awaited<ReturnType<typeof getTenantsByQuery>>>, TError = ErrorType<void>>(params?: GetTenantsByQueryParams, options?: {
    query?: Partial<UseSuspenseInfiniteQueryOptions<Awaited<ReturnType<typeof getTenantsByQuery>>, TError, TData>>;
    request?: SecondParameter<typeof customInstance>;
}, queryClient?: QueryClient): UseSuspenseInfiniteQueryResult<TData, TError> & {
    queryKey: DataTag<QueryKey, TData, TError>;
};
declare function useGetTenantsByQuerySuspenseInfinite<TData = InfiniteData<Awaited<ReturnType<typeof getTenantsByQuery>>>, TError = ErrorType<void>>(params?: GetTenantsByQueryParams, options?: {
    query?: Partial<UseSuspenseInfiniteQueryOptions<Awaited<ReturnType<typeof getTenantsByQuery>>, TError, TData>>;
    request?: SecondParameter<typeof customInstance>;
}, queryClient?: QueryClient): UseSuspenseInfiniteQueryResult<TData, TError> & {
    queryKey: DataTag<QueryKey, TData, TError>;
};
declare const getTenantById: (tenantId: string, options?: SecondParameter<typeof customInstance>, signal?: AbortSignal) => Promise<GetTenantById200AllOf>;
declare const getGetTenantByIdQueryKey: (tenantId: string) => readonly [`/api/v1/tenants/${string}`];
declare const getGetTenantByIdQueryOptions: <TData = Awaited<ReturnType<typeof getTenantById>>, TError = ErrorType<void>>(tenantId: string, options?: {
    query?: Partial<UseQueryOptions<Awaited<ReturnType<typeof getTenantById>>, TError, TData>>;
    request?: SecondParameter<typeof customInstance>;
}) => UseQueryOptions<Awaited<ReturnType<typeof getTenantById>>, TError, TData> & {
    queryKey: DataTag<QueryKey, TData, TError>;
};
type GetTenantByIdQueryResult = NonNullable<Awaited<ReturnType<typeof getTenantById>>>;
type GetTenantByIdQueryError = ErrorType<void>;
declare function useGetTenantById<TData = Awaited<ReturnType<typeof getTenantById>>, TError = ErrorType<void>>(tenantId: string, options: {
    query: Partial<UseQueryOptions<Awaited<ReturnType<typeof getTenantById>>, TError, TData>> & Pick<DefinedInitialDataOptions<Awaited<ReturnType<typeof getTenantById>>, TError, Awaited<ReturnType<typeof getTenantById>>>, "initialData">;
    request?: SecondParameter<typeof customInstance>;
}, queryClient?: QueryClient): DefinedUseQueryResult<TData, TError> & {
    queryKey: DataTag<QueryKey, TData, TError>;
};
declare function useGetTenantById<TData = Awaited<ReturnType<typeof getTenantById>>, TError = ErrorType<void>>(tenantId: string, options?: {
    query?: Partial<UseQueryOptions<Awaited<ReturnType<typeof getTenantById>>, TError, TData>> & Pick<UndefinedInitialDataOptions<Awaited<ReturnType<typeof getTenantById>>, TError, Awaited<ReturnType<typeof getTenantById>>>, "initialData">;
    request?: SecondParameter<typeof customInstance>;
}, queryClient?: QueryClient): UseQueryResult<TData, TError> & {
    queryKey: DataTag<QueryKey, TData, TError>;
};
declare function useGetTenantById<TData = Awaited<ReturnType<typeof getTenantById>>, TError = ErrorType<void>>(tenantId: string, options?: {
    query?: Partial<UseQueryOptions<Awaited<ReturnType<typeof getTenantById>>, TError, TData>>;
    request?: SecondParameter<typeof customInstance>;
}, queryClient?: QueryClient): UseQueryResult<TData, TError> & {
    queryKey: DataTag<QueryKey, TData, TError>;
};
declare const getGetTenantByIdSuspenseQueryOptions: <TData = Awaited<ReturnType<typeof getTenantById>>, TError = ErrorType<void>>(tenantId: string, options?: {
    query?: Partial<UseSuspenseQueryOptions<Awaited<ReturnType<typeof getTenantById>>, TError, TData>>;
    request?: SecondParameter<typeof customInstance>;
}) => UseSuspenseQueryOptions<Awaited<ReturnType<typeof getTenantById>>, TError, TData> & {
    queryKey: DataTag<QueryKey, TData, TError>;
};
type GetTenantByIdSuspenseQueryResult = NonNullable<Awaited<ReturnType<typeof getTenantById>>>;
type GetTenantByIdSuspenseQueryError = ErrorType<void>;
declare function useGetTenantByIdSuspense<TData = Awaited<ReturnType<typeof getTenantById>>, TError = ErrorType<void>>(tenantId: string, options: {
    query: Partial<UseSuspenseQueryOptions<Awaited<ReturnType<typeof getTenantById>>, TError, TData>>;
    request?: SecondParameter<typeof customInstance>;
}, queryClient?: QueryClient): UseSuspenseQueryResult<TData, TError> & {
    queryKey: DataTag<QueryKey, TData, TError>;
};
declare function useGetTenantByIdSuspense<TData = Awaited<ReturnType<typeof getTenantById>>, TError = ErrorType<void>>(tenantId: string, options?: {
    query?: Partial<UseSuspenseQueryOptions<Awaited<ReturnType<typeof getTenantById>>, TError, TData>>;
    request?: SecondParameter<typeof customInstance>;
}, queryClient?: QueryClient): UseSuspenseQueryResult<TData, TError> & {
    queryKey: DataTag<QueryKey, TData, TError>;
};
declare function useGetTenantByIdSuspense<TData = Awaited<ReturnType<typeof getTenantById>>, TError = ErrorType<void>>(tenantId: string, options?: {
    query?: Partial<UseSuspenseQueryOptions<Awaited<ReturnType<typeof getTenantById>>, TError, TData>>;
    request?: SecondParameter<typeof customInstance>;
}, queryClient?: QueryClient): UseSuspenseQueryResult<TData, TError> & {
    queryKey: DataTag<QueryKey, TData, TError>;
};
declare const getGetTenantByIdSuspenseInfiniteQueryOptions: <TData = InfiniteData<Awaited<ReturnType<typeof getTenantById>>>, TError = ErrorType<void>>(tenantId: string, options?: {
    query?: Partial<UseSuspenseInfiniteQueryOptions<Awaited<ReturnType<typeof getTenantById>>, TError, TData>>;
    request?: SecondParameter<typeof customInstance>;
}) => UseSuspenseInfiniteQueryOptions<Awaited<ReturnType<typeof getTenantById>>, TError, TData> & {
    queryKey: DataTag<QueryKey, TData, TError>;
};
type GetTenantByIdSuspenseInfiniteQueryResult = NonNullable<Awaited<ReturnType<typeof getTenantById>>>;
type GetTenantByIdSuspenseInfiniteQueryError = ErrorType<void>;
declare function useGetTenantByIdSuspenseInfinite<TData = InfiniteData<Awaited<ReturnType<typeof getTenantById>>>, TError = ErrorType<void>>(tenantId: string, options: {
    query: Partial<UseSuspenseInfiniteQueryOptions<Awaited<ReturnType<typeof getTenantById>>, TError, TData>>;
    request?: SecondParameter<typeof customInstance>;
}, queryClient?: QueryClient): UseSuspenseInfiniteQueryResult<TData, TError> & {
    queryKey: DataTag<QueryKey, TData, TError>;
};
declare function useGetTenantByIdSuspenseInfinite<TData = InfiniteData<Awaited<ReturnType<typeof getTenantById>>>, TError = ErrorType<void>>(tenantId: string, options?: {
    query?: Partial<UseSuspenseInfiniteQueryOptions<Awaited<ReturnType<typeof getTenantById>>, TError, TData>>;
    request?: SecondParameter<typeof customInstance>;
}, queryClient?: QueryClient): UseSuspenseInfiniteQueryResult<TData, TError> & {
    queryKey: DataTag<QueryKey, TData, TError>;
};
declare function useGetTenantByIdSuspenseInfinite<TData = InfiniteData<Awaited<ReturnType<typeof getTenantById>>>, TError = ErrorType<void>>(tenantId: string, options?: {
    query?: Partial<UseSuspenseInfiniteQueryOptions<Awaited<ReturnType<typeof getTenantById>>, TError, TData>>;
    request?: SecondParameter<typeof customInstance>;
}, queryClient?: QueryClient): UseSuspenseInfiniteQueryResult<TData, TError> & {
    queryKey: DataTag<QueryKey, TData, TError>;
};
declare const updateTenantById: (tenantId: string, updateTenantDto: BodyType<UpdateTenantDto>, options?: SecondParameter<typeof customInstance>) => Promise<UpdateTenantById200AllOf>;
declare const getUpdateTenantByIdMutationOptions: <TError = ErrorType<void>, TContext = unknown>(options?: {
    mutation?: UseMutationOptions<Awaited<ReturnType<typeof updateTenantById>>, TError, {
        tenantId: string;
        data: BodyType<UpdateTenantDto>;
    }, TContext>;
    request?: SecondParameter<typeof customInstance>;
}) => UseMutationOptions<Awaited<ReturnType<typeof updateTenantById>>, TError, {
    tenantId: string;
    data: BodyType<UpdateTenantDto>;
}, TContext>;
type UpdateTenantByIdMutationResult = NonNullable<Awaited<ReturnType<typeof updateTenantById>>>;
type UpdateTenantByIdMutationBody = BodyType<UpdateTenantDto>;
type UpdateTenantByIdMutationError = ErrorType<void>;
declare const useUpdateTenantById: <TError = ErrorType<void>, TContext = unknown>(options?: {
    mutation?: UseMutationOptions<Awaited<ReturnType<typeof updateTenantById>>, TError, {
        tenantId: string;
        data: BodyType<UpdateTenantDto>;
    }, TContext>;
    request?: SecondParameter<typeof customInstance>;
}, queryClient?: QueryClient) => UseMutationResult<Awaited<ReturnType<typeof updateTenantById>>, TError, {
    tenantId: string;
    data: BodyType<UpdateTenantDto>;
}, TContext>;
declare const deleteTenant: (tenantId: string, options?: SecondParameter<typeof customInstance>) => Promise<DeleteTenant200AllOf>;
declare const getDeleteTenantMutationOptions: <TError = ErrorType<void>, TContext = unknown>(options?: {
    mutation?: UseMutationOptions<Awaited<ReturnType<typeof deleteTenant>>, TError, {
        tenantId: string;
    }, TContext>;
    request?: SecondParameter<typeof customInstance>;
}) => UseMutationOptions<Awaited<ReturnType<typeof deleteTenant>>, TError, {
    tenantId: string;
}, TContext>;
type DeleteTenantMutationResult = NonNullable<Awaited<ReturnType<typeof deleteTenant>>>;
type DeleteTenantMutationError = ErrorType<void>;
declare const useDeleteTenant: <TError = ErrorType<void>, TContext = unknown>(options?: {
    mutation?: UseMutationOptions<Awaited<ReturnType<typeof deleteTenant>>, TError, {
        tenantId: string;
    }, TContext>;
    request?: SecondParameter<typeof customInstance>;
}, queryClient?: QueryClient) => UseMutationResult<Awaited<ReturnType<typeof deleteTenant>>, TError, {
    tenantId: string;
}, TContext>;
declare const removeTenantById: (tenantId: string, options?: SecondParameter<typeof customInstance>) => Promise<RemoveTenantById200AllOf>;
declare const getRemoveTenantByIdMutationOptions: <TError = ErrorType<void>, TContext = unknown>(options?: {
    mutation?: UseMutationOptions<Awaited<ReturnType<typeof removeTenantById>>, TError, {
        tenantId: string;
    }, TContext>;
    request?: SecondParameter<typeof customInstance>;
}) => UseMutationOptions<Awaited<ReturnType<typeof removeTenantById>>, TError, {
    tenantId: string;
}, TContext>;
type RemoveTenantByIdMutationResult = NonNullable<Awaited<ReturnType<typeof removeTenantById>>>;
type RemoveTenantByIdMutationError = ErrorType<void>;
declare const useRemoveTenantById: <TError = ErrorType<void>, TContext = unknown>(options?: {
    mutation?: UseMutationOptions<Awaited<ReturnType<typeof removeTenantById>>, TError, {
        tenantId: string;
    }, TContext>;
    request?: SecondParameter<typeof customInstance>;
}, queryClient?: QueryClient) => UseMutationResult<Awaited<ReturnType<typeof removeTenantById>>, TError, {
    tenantId: string;
}, TContext>;

type apis_CreateCategoryMutationBody = CreateCategoryMutationBody;
type apis_CreateCategoryMutationError = CreateCategoryMutationError;
type apis_CreateCategoryMutationResult = CreateCategoryMutationResult;
type apis_CreateExerciseMutationBody = CreateExerciseMutationBody;
type apis_CreateExerciseMutationError = CreateExerciseMutationError;
type apis_CreateExerciseMutationResult = CreateExerciseMutationResult;
type apis_CreateFileMutationBody = CreateFileMutationBody;
type apis_CreateFileMutationError = CreateFileMutationError;
type apis_CreateFileMutationResult = CreateFileMutationResult;
type apis_CreateGroundMutationBody = CreateGroundMutationBody;
type apis_CreateGroundMutationError = CreateGroundMutationError;
type apis_CreateGroundMutationResult = CreateGroundMutationResult;
type apis_CreateGroupMutationBody = CreateGroupMutationBody;
type apis_CreateGroupMutationError = CreateGroupMutationError;
type apis_CreateGroupMutationResult = CreateGroupMutationResult;
type apis_CreateProgramMutationBody = CreateProgramMutationBody;
type apis_CreateProgramMutationError = CreateProgramMutationError;
type apis_CreateProgramMutationResult = CreateProgramMutationResult;
type apis_CreateRoleClassificationMutationBody = CreateRoleClassificationMutationBody;
type apis_CreateRoleClassificationMutationError = CreateRoleClassificationMutationError;
type apis_CreateRoleClassificationMutationResult = CreateRoleClassificationMutationResult;
type apis_CreateRoleMutationBody = CreateRoleMutationBody;
type apis_CreateRoleMutationError = CreateRoleMutationError;
type apis_CreateRoleMutationResult = CreateRoleMutationResult;
type apis_CreateRoutineMutationBody = CreateRoutineMutationBody;
type apis_CreateRoutineMutationError = CreateRoutineMutationError;
type apis_CreateRoutineMutationResult = CreateRoutineMutationResult;
type apis_CreateSessionMutationBody = CreateSessionMutationBody;
type apis_CreateSessionMutationError = CreateSessionMutationError;
type apis_CreateSessionMutationResult = CreateSessionMutationResult;
type apis_CreateSpaceMutationBody = CreateSpaceMutationBody;
type apis_CreateSpaceMutationError = CreateSpaceMutationError;
type apis_CreateSpaceMutationResult = CreateSpaceMutationResult;
type apis_CreateSubjectMutationBody = CreateSubjectMutationBody;
type apis_CreateSubjectMutationError = CreateSubjectMutationError;
type apis_CreateSubjectMutationResult = CreateSubjectMutationResult;
type apis_CreateTenantMutationBody = CreateTenantMutationBody;
type apis_CreateTenantMutationError = CreateTenantMutationError;
type apis_CreateTenantMutationResult = CreateTenantMutationResult;
type apis_CreateTimelineMutationBody = CreateTimelineMutationBody;
type apis_CreateTimelineMutationError = CreateTimelineMutationError;
type apis_CreateTimelineMutationResult = CreateTimelineMutationResult;
type apis_CreateUserMutationBody = CreateUserMutationBody;
type apis_CreateUserMutationError = CreateUserMutationError;
type apis_CreateUserMutationResult = CreateUserMutationResult;
type apis_DeleteCategoryByIdMutationError = DeleteCategoryByIdMutationError;
type apis_DeleteCategoryByIdMutationResult = DeleteCategoryByIdMutationResult;
type apis_DeleteExerciseMutationError = DeleteExerciseMutationError;
type apis_DeleteExerciseMutationResult = DeleteExerciseMutationResult;
type apis_DeleteGroundByIdMutationError = DeleteGroundByIdMutationError;
type apis_DeleteGroundByIdMutationResult = DeleteGroundByIdMutationResult;
type apis_DeleteGroupMutationError = DeleteGroupMutationError;
type apis_DeleteGroupMutationResult = DeleteGroupMutationResult;
type apis_DeleteProgramByIdMutationError = DeleteProgramByIdMutationError;
type apis_DeleteProgramByIdMutationResult = DeleteProgramByIdMutationResult;
type apis_DeleteRoleClassificationByIdMutationError = DeleteRoleClassificationByIdMutationError;
type apis_DeleteRoleClassificationByIdMutationResult = DeleteRoleClassificationByIdMutationResult;
type apis_DeleteRoleMutationError = DeleteRoleMutationError;
type apis_DeleteRoleMutationResult = DeleteRoleMutationResult;
type apis_DeleteRoutineMutationError = DeleteRoutineMutationError;
type apis_DeleteRoutineMutationResult = DeleteRoutineMutationResult;
type apis_DeleteSessionMutationError = DeleteSessionMutationError;
type apis_DeleteSessionMutationResult = DeleteSessionMutationResult;
type apis_DeleteSpaceMutationError = DeleteSpaceMutationError;
type apis_DeleteSpaceMutationResult = DeleteSpaceMutationResult;
type apis_DeleteSubjectMutationError = DeleteSubjectMutationError;
type apis_DeleteSubjectMutationResult = DeleteSubjectMutationResult;
type apis_DeleteTenantMutationError = DeleteTenantMutationError;
type apis_DeleteTenantMutationResult = DeleteTenantMutationResult;
type apis_DeleteTimelineMutationError = DeleteTimelineMutationError;
type apis_DeleteTimelineMutationResult = DeleteTimelineMutationResult;
type apis_DeleteUserMutationError = DeleteUserMutationError;
type apis_DeleteUserMutationResult = DeleteUserMutationResult;
type apis_GetAppBuilderQueryError = GetAppBuilderQueryError;
type apis_GetAppBuilderQueryResult = GetAppBuilderQueryResult;
type apis_GetAppBuilderSuspenseInfiniteQueryError = GetAppBuilderSuspenseInfiniteQueryError;
type apis_GetAppBuilderSuspenseInfiniteQueryResult = GetAppBuilderSuspenseInfiniteQueryResult;
type apis_GetAppBuilderSuspenseQueryError = GetAppBuilderSuspenseQueryError;
type apis_GetAppBuilderSuspenseQueryResult = GetAppBuilderSuspenseQueryResult;
type apis_GetCategoriesByQueryQueryError = GetCategoriesByQueryQueryError;
type apis_GetCategoriesByQueryQueryResult = GetCategoriesByQueryQueryResult;
type apis_GetCategoriesByQuerySuspenseInfiniteQueryError = GetCategoriesByQuerySuspenseInfiniteQueryError;
type apis_GetCategoriesByQuerySuspenseInfiniteQueryResult = GetCategoriesByQuerySuspenseInfiniteQueryResult;
type apis_GetCategoriesByQuerySuspenseQueryError = GetCategoriesByQuerySuspenseQueryError;
type apis_GetCategoriesByQuerySuspenseQueryResult = GetCategoriesByQuerySuspenseQueryResult;
type apis_GetCategoryByIdQueryError = GetCategoryByIdQueryError;
type apis_GetCategoryByIdQueryResult = GetCategoryByIdQueryResult;
type apis_GetCategoryByIdSuspenseInfiniteQueryError = GetCategoryByIdSuspenseInfiniteQueryError;
type apis_GetCategoryByIdSuspenseInfiniteQueryResult = GetCategoryByIdSuspenseInfiniteQueryResult;
type apis_GetCategoryByIdSuspenseQueryError = GetCategoryByIdSuspenseQueryError;
type apis_GetCategoryByIdSuspenseQueryResult = GetCategoryByIdSuspenseQueryResult;
type apis_GetCurrentSpaceQueryError = GetCurrentSpaceQueryError;
type apis_GetCurrentSpaceQueryResult = GetCurrentSpaceQueryResult;
type apis_GetCurrentSpaceSuspenseInfiniteQueryError = GetCurrentSpaceSuspenseInfiniteQueryError;
type apis_GetCurrentSpaceSuspenseInfiniteQueryResult = GetCurrentSpaceSuspenseInfiniteQueryResult;
type apis_GetCurrentSpaceSuspenseQueryError = GetCurrentSpaceSuspenseQueryError;
type apis_GetCurrentSpaceSuspenseQueryResult = GetCurrentSpaceSuspenseQueryResult;
type apis_GetExerciseQueryError = GetExerciseQueryError;
type apis_GetExerciseQueryResult = GetExerciseQueryResult;
type apis_GetExerciseSuspenseInfiniteQueryError = GetExerciseSuspenseInfiniteQueryError;
type apis_GetExerciseSuspenseInfiniteQueryResult = GetExerciseSuspenseInfiniteQueryResult;
type apis_GetExerciseSuspenseQueryError = GetExerciseSuspenseQueryError;
type apis_GetExerciseSuspenseQueryResult = GetExerciseSuspenseQueryResult;
type apis_GetExercisesByQueryQueryError = GetExercisesByQueryQueryError;
type apis_GetExercisesByQueryQueryResult = GetExercisesByQueryQueryResult;
type apis_GetExercisesByQuerySuspenseInfiniteQueryError = GetExercisesByQuerySuspenseInfiniteQueryError;
type apis_GetExercisesByQuerySuspenseInfiniteQueryResult = GetExercisesByQuerySuspenseInfiniteQueryResult;
type apis_GetExercisesByQuerySuspenseQueryError = GetExercisesByQuerySuspenseQueryError;
type apis_GetExercisesByQuerySuspenseQueryResult = GetExercisesByQuerySuspenseQueryResult;
type apis_GetFileByIdQueryError = GetFileByIdQueryError;
type apis_GetFileByIdQueryResult = GetFileByIdQueryResult;
type apis_GetFileByIdSuspenseInfiniteQueryError = GetFileByIdSuspenseInfiniteQueryError;
type apis_GetFileByIdSuspenseInfiniteQueryResult = GetFileByIdSuspenseInfiniteQueryResult;
type apis_GetFileByIdSuspenseQueryError = GetFileByIdSuspenseQueryError;
type apis_GetFileByIdSuspenseQueryResult = GetFileByIdSuspenseQueryResult;
type apis_GetGroundByIdQueryError = GetGroundByIdQueryError;
type apis_GetGroundByIdQueryResult = GetGroundByIdQueryResult;
type apis_GetGroundByIdSuspenseInfiniteQueryError = GetGroundByIdSuspenseInfiniteQueryError;
type apis_GetGroundByIdSuspenseInfiniteQueryResult = GetGroundByIdSuspenseInfiniteQueryResult;
type apis_GetGroundByIdSuspenseQueryError = GetGroundByIdSuspenseQueryError;
type apis_GetGroundByIdSuspenseQueryResult = GetGroundByIdSuspenseQueryResult;
type apis_GetGroundsByQueryQueryError = GetGroundsByQueryQueryError;
type apis_GetGroundsByQueryQueryResult = GetGroundsByQueryQueryResult;
type apis_GetGroundsByQuerySuspenseInfiniteQueryError = GetGroundsByQuerySuspenseInfiniteQueryError;
type apis_GetGroundsByQuerySuspenseInfiniteQueryResult = GetGroundsByQuerySuspenseInfiniteQueryResult;
type apis_GetGroundsByQuerySuspenseQueryError = GetGroundsByQuerySuspenseQueryError;
type apis_GetGroundsByQuerySuspenseQueryResult = GetGroundsByQuerySuspenseQueryResult;
type apis_GetGroupByIdQueryError = GetGroupByIdQueryError;
type apis_GetGroupByIdQueryResult = GetGroupByIdQueryResult;
type apis_GetGroupByIdSuspenseInfiniteQueryError = GetGroupByIdSuspenseInfiniteQueryError;
type apis_GetGroupByIdSuspenseInfiniteQueryResult = GetGroupByIdSuspenseInfiniteQueryResult;
type apis_GetGroupByIdSuspenseQueryError = GetGroupByIdSuspenseQueryError;
type apis_GetGroupByIdSuspenseQueryResult = GetGroupByIdSuspenseQueryResult;
type apis_GetGroupsByQueryQueryError = GetGroupsByQueryQueryError;
type apis_GetGroupsByQueryQueryResult = GetGroupsByQueryQueryResult;
type apis_GetGroupsByQuerySuspenseInfiniteQueryError = GetGroupsByQuerySuspenseInfiniteQueryError;
type apis_GetGroupsByQuerySuspenseInfiniteQueryResult = GetGroupsByQuerySuspenseInfiniteQueryResult;
type apis_GetGroupsByQuerySuspenseQueryError = GetGroupsByQuerySuspenseQueryError;
type apis_GetGroupsByQuerySuspenseQueryResult = GetGroupsByQuerySuspenseQueryResult;
type apis_GetMyTenantsQueryError = GetMyTenantsQueryError;
type apis_GetMyTenantsQueryResult = GetMyTenantsQueryResult;
type apis_GetMyTenantsSuspenseInfiniteQueryError = GetMyTenantsSuspenseInfiniteQueryError;
type apis_GetMyTenantsSuspenseInfiniteQueryResult = GetMyTenantsSuspenseInfiniteQueryResult;
type apis_GetMyTenantsSuspenseQueryError = GetMyTenantsSuspenseQueryError;
type apis_GetMyTenantsSuspenseQueryResult = GetMyTenantsSuspenseQueryResult;
type apis_GetNewTokenQueryError = GetNewTokenQueryError;
type apis_GetNewTokenQueryResult = GetNewTokenQueryResult;
type apis_GetNewTokenSuspenseInfiniteQueryError = GetNewTokenSuspenseInfiniteQueryError;
type apis_GetNewTokenSuspenseInfiniteQueryResult = GetNewTokenSuspenseInfiniteQueryResult;
type apis_GetNewTokenSuspenseQueryError = GetNewTokenSuspenseQueryError;
type apis_GetNewTokenSuspenseQueryResult = GetNewTokenSuspenseQueryResult;
type apis_GetProgramByIdQueryError = GetProgramByIdQueryError;
type apis_GetProgramByIdQueryResult = GetProgramByIdQueryResult;
type apis_GetProgramByIdSuspenseInfiniteQueryError = GetProgramByIdSuspenseInfiniteQueryError;
type apis_GetProgramByIdSuspenseInfiniteQueryResult = GetProgramByIdSuspenseInfiniteQueryResult;
type apis_GetProgramByIdSuspenseQueryError = GetProgramByIdSuspenseQueryError;
type apis_GetProgramByIdSuspenseQueryResult = GetProgramByIdSuspenseQueryResult;
type apis_GetProgramsByQueryQueryError = GetProgramsByQueryQueryError;
type apis_GetProgramsByQueryQueryResult = GetProgramsByQueryQueryResult;
type apis_GetProgramsByQuerySuspenseInfiniteQueryError = GetProgramsByQuerySuspenseInfiniteQueryError;
type apis_GetProgramsByQuerySuspenseInfiniteQueryResult = GetProgramsByQuerySuspenseInfiniteQueryResult;
type apis_GetProgramsByQuerySuspenseQueryError = GetProgramsByQuerySuspenseQueryError;
type apis_GetProgramsByQuerySuspenseQueryResult = GetProgramsByQuerySuspenseQueryResult;
type apis_GetRoleClassificationByIdQueryError = GetRoleClassificationByIdQueryError;
type apis_GetRoleClassificationByIdQueryResult = GetRoleClassificationByIdQueryResult;
type apis_GetRoleClassificationByIdSuspenseInfiniteQueryError = GetRoleClassificationByIdSuspenseInfiniteQueryError;
type apis_GetRoleClassificationByIdSuspenseInfiniteQueryResult = GetRoleClassificationByIdSuspenseInfiniteQueryResult;
type apis_GetRoleClassificationByIdSuspenseQueryError = GetRoleClassificationByIdSuspenseQueryError;
type apis_GetRoleClassificationByIdSuspenseQueryResult = GetRoleClassificationByIdSuspenseQueryResult;
type apis_GetRoleClassificationsByQueryQueryError = GetRoleClassificationsByQueryQueryError;
type apis_GetRoleClassificationsByQueryQueryResult = GetRoleClassificationsByQueryQueryResult;
type apis_GetRoleClassificationsByQuerySuspenseInfiniteQueryError = GetRoleClassificationsByQuerySuspenseInfiniteQueryError;
type apis_GetRoleClassificationsByQuerySuspenseInfiniteQueryResult = GetRoleClassificationsByQuerySuspenseInfiniteQueryResult;
type apis_GetRoleClassificationsByQuerySuspenseQueryError = GetRoleClassificationsByQuerySuspenseQueryError;
type apis_GetRoleClassificationsByQuerySuspenseQueryResult = GetRoleClassificationsByQuerySuspenseQueryResult;
type apis_GetRoleQueryError = GetRoleQueryError;
type apis_GetRoleQueryResult = GetRoleQueryResult;
type apis_GetRoleSuspenseInfiniteQueryError = GetRoleSuspenseInfiniteQueryError;
type apis_GetRoleSuspenseInfiniteQueryResult = GetRoleSuspenseInfiniteQueryResult;
type apis_GetRoleSuspenseQueryError = GetRoleSuspenseQueryError;
type apis_GetRoleSuspenseQueryResult = GetRoleSuspenseQueryResult;
type apis_GetRolesByQueryQueryError = GetRolesByQueryQueryError;
type apis_GetRolesByQueryQueryResult = GetRolesByQueryQueryResult;
type apis_GetRolesByQuerySuspenseInfiniteQueryError = GetRolesByQuerySuspenseInfiniteQueryError;
type apis_GetRolesByQuerySuspenseInfiniteQueryResult = GetRolesByQuerySuspenseInfiniteQueryResult;
type apis_GetRolesByQuerySuspenseQueryError = GetRolesByQuerySuspenseQueryError;
type apis_GetRolesByQuerySuspenseQueryResult = GetRolesByQuerySuspenseQueryResult;
type apis_GetRoutineQueryError = GetRoutineQueryError;
type apis_GetRoutineQueryResult = GetRoutineQueryResult;
type apis_GetRoutineSuspenseInfiniteQueryError = GetRoutineSuspenseInfiniteQueryError;
type apis_GetRoutineSuspenseInfiniteQueryResult = GetRoutineSuspenseInfiniteQueryResult;
type apis_GetRoutineSuspenseQueryError = GetRoutineSuspenseQueryError;
type apis_GetRoutineSuspenseQueryResult = GetRoutineSuspenseQueryResult;
type apis_GetRoutinesByQueryQueryError = GetRoutinesByQueryQueryError;
type apis_GetRoutinesByQueryQueryResult = GetRoutinesByQueryQueryResult;
type apis_GetRoutinesByQuerySuspenseInfiniteQueryError = GetRoutinesByQuerySuspenseInfiniteQueryError;
type apis_GetRoutinesByQuerySuspenseInfiniteQueryResult = GetRoutinesByQuerySuspenseInfiniteQueryResult;
type apis_GetRoutinesByQuerySuspenseQueryError = GetRoutinesByQuerySuspenseQueryError;
type apis_GetRoutinesByQuerySuspenseQueryResult = GetRoutinesByQuerySuspenseQueryResult;
type apis_GetSessionQueryError = GetSessionQueryError;
type apis_GetSessionQueryResult = GetSessionQueryResult;
type apis_GetSessionSuspenseInfiniteQueryError = GetSessionSuspenseInfiniteQueryError;
type apis_GetSessionSuspenseInfiniteQueryResult = GetSessionSuspenseInfiniteQueryResult;
type apis_GetSessionSuspenseQueryError = GetSessionSuspenseQueryError;
type apis_GetSessionSuspenseQueryResult = GetSessionSuspenseQueryResult;
type apis_GetSessionsByQueryQueryError = GetSessionsByQueryQueryError;
type apis_GetSessionsByQueryQueryResult = GetSessionsByQueryQueryResult;
type apis_GetSessionsByQuerySuspenseInfiniteQueryError = GetSessionsByQuerySuspenseInfiniteQueryError;
type apis_GetSessionsByQuerySuspenseInfiniteQueryResult = GetSessionsByQuerySuspenseInfiniteQueryResult;
type apis_GetSessionsByQuerySuspenseQueryError = GetSessionsByQuerySuspenseQueryError;
type apis_GetSessionsByQuerySuspenseQueryResult = GetSessionsByQuerySuspenseQueryResult;
type apis_GetSpaceQueryError = GetSpaceQueryError;
type apis_GetSpaceQueryResult = GetSpaceQueryResult;
type apis_GetSpaceSuspenseInfiniteQueryError = GetSpaceSuspenseInfiniteQueryError;
type apis_GetSpaceSuspenseInfiniteQueryResult = GetSpaceSuspenseInfiniteQueryResult;
type apis_GetSpaceSuspenseQueryError = GetSpaceSuspenseQueryError;
type apis_GetSpaceSuspenseQueryResult = GetSpaceSuspenseQueryResult;
type apis_GetSpacesByQueryQueryError = GetSpacesByQueryQueryError;
type apis_GetSpacesByQueryQueryResult = GetSpacesByQueryQueryResult;
type apis_GetSpacesByQuerySuspenseInfiniteQueryError = GetSpacesByQuerySuspenseInfiniteQueryError;
type apis_GetSpacesByQuerySuspenseInfiniteQueryResult = GetSpacesByQuerySuspenseInfiniteQueryResult;
type apis_GetSpacesByQuerySuspenseQueryError = GetSpacesByQuerySuspenseQueryError;
type apis_GetSpacesByQuerySuspenseQueryResult = GetSpacesByQuerySuspenseQueryResult;
type apis_GetSubjectQueryError = GetSubjectQueryError;
type apis_GetSubjectQueryResult = GetSubjectQueryResult;
type apis_GetSubjectSuspenseInfiniteQueryError = GetSubjectSuspenseInfiniteQueryError;
type apis_GetSubjectSuspenseInfiniteQueryResult = GetSubjectSuspenseInfiniteQueryResult;
type apis_GetSubjectSuspenseQueryError = GetSubjectSuspenseQueryError;
type apis_GetSubjectSuspenseQueryResult = GetSubjectSuspenseQueryResult;
type apis_GetSubjectsByQueryQueryError = GetSubjectsByQueryQueryError;
type apis_GetSubjectsByQueryQueryResult = GetSubjectsByQueryQueryResult;
type apis_GetSubjectsByQuerySuspenseInfiniteQueryError = GetSubjectsByQuerySuspenseInfiniteQueryError;
type apis_GetSubjectsByQuerySuspenseInfiniteQueryResult = GetSubjectsByQuerySuspenseInfiniteQueryResult;
type apis_GetSubjectsByQuerySuspenseQueryError = GetSubjectsByQuerySuspenseQueryError;
type apis_GetSubjectsByQuerySuspenseQueryResult = GetSubjectsByQuerySuspenseQueryResult;
type apis_GetTenantByIdQueryError = GetTenantByIdQueryError;
type apis_GetTenantByIdQueryResult = GetTenantByIdQueryResult;
type apis_GetTenantByIdSuspenseInfiniteQueryError = GetTenantByIdSuspenseInfiniteQueryError;
type apis_GetTenantByIdSuspenseInfiniteQueryResult = GetTenantByIdSuspenseInfiniteQueryResult;
type apis_GetTenantByIdSuspenseQueryError = GetTenantByIdSuspenseQueryError;
type apis_GetTenantByIdSuspenseQueryResult = GetTenantByIdSuspenseQueryResult;
type apis_GetTenantsByQueryQueryError = GetTenantsByQueryQueryError;
type apis_GetTenantsByQueryQueryResult = GetTenantsByQueryQueryResult;
type apis_GetTenantsByQuerySuspenseInfiniteQueryError = GetTenantsByQuerySuspenseInfiniteQueryError;
type apis_GetTenantsByQuerySuspenseInfiniteQueryResult = GetTenantsByQuerySuspenseInfiniteQueryResult;
type apis_GetTenantsByQuerySuspenseQueryError = GetTenantsByQuerySuspenseQueryError;
type apis_GetTenantsByQuerySuspenseQueryResult = GetTenantsByQuerySuspenseQueryResult;
type apis_GetTimelineQueryError = GetTimelineQueryError;
type apis_GetTimelineQueryResult = GetTimelineQueryResult;
type apis_GetTimelineSuspenseInfiniteQueryError = GetTimelineSuspenseInfiniteQueryError;
type apis_GetTimelineSuspenseInfiniteQueryResult = GetTimelineSuspenseInfiniteQueryResult;
type apis_GetTimelineSuspenseQueryError = GetTimelineSuspenseQueryError;
type apis_GetTimelineSuspenseQueryResult = GetTimelineSuspenseQueryResult;
type apis_GetTimelinesByQueryQueryError = GetTimelinesByQueryQueryError;
type apis_GetTimelinesByQueryQueryResult = GetTimelinesByQueryQueryResult;
type apis_GetTimelinesByQuerySuspenseInfiniteQueryError = GetTimelinesByQuerySuspenseInfiniteQueryError;
type apis_GetTimelinesByQuerySuspenseInfiniteQueryResult = GetTimelinesByQuerySuspenseInfiniteQueryResult;
type apis_GetTimelinesByQuerySuspenseQueryError = GetTimelinesByQuerySuspenseQueryError;
type apis_GetTimelinesByQuerySuspenseQueryResult = GetTimelinesByQuerySuspenseQueryResult;
type apis_GetUserQueryError = GetUserQueryError;
type apis_GetUserQueryResult = GetUserQueryResult;
type apis_GetUserSuspenseInfiniteQueryError = GetUserSuspenseInfiniteQueryError;
type apis_GetUserSuspenseInfiniteQueryResult = GetUserSuspenseInfiniteQueryResult;
type apis_GetUserSuspenseQueryError = GetUserSuspenseQueryError;
type apis_GetUserSuspenseQueryResult = GetUserSuspenseQueryResult;
type apis_GetUsersByQueryQueryError = GetUsersByQueryQueryError;
type apis_GetUsersByQueryQueryResult = GetUsersByQueryQueryResult;
type apis_GetUsersByQuerySuspenseInfiniteQueryError = GetUsersByQuerySuspenseInfiniteQueryError;
type apis_GetUsersByQuerySuspenseInfiniteQueryResult = GetUsersByQuerySuspenseInfiniteQueryResult;
type apis_GetUsersByQuerySuspenseQueryError = GetUsersByQuerySuspenseQueryError;
type apis_GetUsersByQuerySuspenseQueryResult = GetUsersByQuerySuspenseQueryResult;
type apis_LoginMutationBody = LoginMutationBody;
type apis_LoginMutationError = LoginMutationError;
type apis_LoginMutationResult = LoginMutationResult;
type apis_LogoutMutationError = LogoutMutationError;
type apis_LogoutMutationResult = LogoutMutationResult;
type apis_RefreshTokenMutationError = RefreshTokenMutationError;
type apis_RefreshTokenMutationResult = RefreshTokenMutationResult;
type apis_RemoveExerciseMutationError = RemoveExerciseMutationError;
type apis_RemoveExerciseMutationResult = RemoveExerciseMutationResult;
type apis_RemoveFileByIdMutationError = RemoveFileByIdMutationError;
type apis_RemoveFileByIdMutationResult = RemoveFileByIdMutationResult;
type apis_RemoveGroundByIdMutationError = RemoveGroundByIdMutationError;
type apis_RemoveGroundByIdMutationResult = RemoveGroundByIdMutationResult;
type apis_RemoveGroupsMutationError = RemoveGroupsMutationError;
type apis_RemoveGroupsMutationResult = RemoveGroupsMutationResult;
type apis_RemoveProgramByIdMutationError = RemoveProgramByIdMutationError;
type apis_RemoveProgramByIdMutationResult = RemoveProgramByIdMutationResult;
type apis_RemoveRoleClassificationByIdMutationError = RemoveRoleClassificationByIdMutationError;
type apis_RemoveRoleClassificationByIdMutationResult = RemoveRoleClassificationByIdMutationResult;
type apis_RemoveRoleMutationError = RemoveRoleMutationError;
type apis_RemoveRoleMutationResult = RemoveRoleMutationResult;
type apis_RemoveRoutineMutationError = RemoveRoutineMutationError;
type apis_RemoveRoutineMutationResult = RemoveRoutineMutationResult;
type apis_RemoveSessionMutationError = RemoveSessionMutationError;
type apis_RemoveSessionMutationResult = RemoveSessionMutationResult;
type apis_RemoveSessionsMutationBody = RemoveSessionsMutationBody;
type apis_RemoveSessionsMutationError = RemoveSessionsMutationError;
type apis_RemoveSessionsMutationResult = RemoveSessionsMutationResult;
type apis_RemoveSpaceMutationError = RemoveSpaceMutationError;
type apis_RemoveSpaceMutationResult = RemoveSpaceMutationResult;
type apis_RemoveSubjectMutationError = RemoveSubjectMutationError;
type apis_RemoveSubjectMutationResult = RemoveSubjectMutationResult;
type apis_RemoveSubjectsMutationBody = RemoveSubjectsMutationBody;
type apis_RemoveSubjectsMutationError = RemoveSubjectsMutationError;
type apis_RemoveSubjectsMutationResult = RemoveSubjectsMutationResult;
type apis_RemoveTenantByIdMutationError = RemoveTenantByIdMutationError;
type apis_RemoveTenantByIdMutationResult = RemoveTenantByIdMutationResult;
type apis_RemoveTimelineMutationError = RemoveTimelineMutationError;
type apis_RemoveTimelineMutationResult = RemoveTimelineMutationResult;
type apis_RemoveTimelinesMutationBody = RemoveTimelinesMutationBody;
type apis_RemoveTimelinesMutationError = RemoveTimelinesMutationError;
type apis_RemoveTimelinesMutationResult = RemoveTimelinesMutationResult;
type apis_RemoveUserMutationError = RemoveUserMutationError;
type apis_RemoveUserMutationResult = RemoveUserMutationResult;
type apis_RemoveUsersMutationBody = RemoveUsersMutationBody;
type apis_RemoveUsersMutationError = RemoveUsersMutationError;
type apis_RemoveUsersMutationResult = RemoveUsersMutationResult;
type apis_SignUpUserMutationBody = SignUpUserMutationBody;
type apis_SignUpUserMutationError = SignUpUserMutationError;
type apis_SignUpUserMutationResult = SignUpUserMutationResult;
type apis_UpdateCategoryByIdMutationBody = UpdateCategoryByIdMutationBody;
type apis_UpdateCategoryByIdMutationError = UpdateCategoryByIdMutationError;
type apis_UpdateCategoryByIdMutationResult = UpdateCategoryByIdMutationResult;
type apis_UpdateExerciseMutationBody = UpdateExerciseMutationBody;
type apis_UpdateExerciseMutationError = UpdateExerciseMutationError;
type apis_UpdateExerciseMutationResult = UpdateExerciseMutationResult;
type apis_UpdateFileByIdMutationBody = UpdateFileByIdMutationBody;
type apis_UpdateFileByIdMutationError = UpdateFileByIdMutationError;
type apis_UpdateFileByIdMutationResult = UpdateFileByIdMutationResult;
type apis_UpdateGroundByIdMutationBody = UpdateGroundByIdMutationBody;
type apis_UpdateGroundByIdMutationError = UpdateGroundByIdMutationError;
type apis_UpdateGroundByIdMutationResult = UpdateGroundByIdMutationResult;
type apis_UpdateGroupByIdMutationBody = UpdateGroupByIdMutationBody;
type apis_UpdateGroupByIdMutationError = UpdateGroupByIdMutationError;
type apis_UpdateGroupByIdMutationResult = UpdateGroupByIdMutationResult;
type apis_UpdateProgramByIdMutationBody = UpdateProgramByIdMutationBody;
type apis_UpdateProgramByIdMutationError = UpdateProgramByIdMutationError;
type apis_UpdateProgramByIdMutationResult = UpdateProgramByIdMutationResult;
type apis_UpdateRoleClassificationByIdMutationBody = UpdateRoleClassificationByIdMutationBody;
type apis_UpdateRoleClassificationByIdMutationError = UpdateRoleClassificationByIdMutationError;
type apis_UpdateRoleClassificationByIdMutationResult = UpdateRoleClassificationByIdMutationResult;
type apis_UpdateRoleMutationBody = UpdateRoleMutationBody;
type apis_UpdateRoleMutationError = UpdateRoleMutationError;
type apis_UpdateRoleMutationResult = UpdateRoleMutationResult;
type apis_UpdateRoutineMutationBody = UpdateRoutineMutationBody;
type apis_UpdateRoutineMutationError = UpdateRoutineMutationError;
type apis_UpdateRoutineMutationResult = UpdateRoutineMutationResult;
type apis_UpdateSessionMutationBody = UpdateSessionMutationBody;
type apis_UpdateSessionMutationError = UpdateSessionMutationError;
type apis_UpdateSessionMutationResult = UpdateSessionMutationResult;
type apis_UpdateSpaceMutationBody = UpdateSpaceMutationBody;
type apis_UpdateSpaceMutationError = UpdateSpaceMutationError;
type apis_UpdateSpaceMutationResult = UpdateSpaceMutationResult;
type apis_UpdateSubjectMutationBody = UpdateSubjectMutationBody;
type apis_UpdateSubjectMutationError = UpdateSubjectMutationError;
type apis_UpdateSubjectMutationResult = UpdateSubjectMutationResult;
type apis_UpdateTenantByIdMutationBody = UpdateTenantByIdMutationBody;
type apis_UpdateTenantByIdMutationError = UpdateTenantByIdMutationError;
type apis_UpdateTenantByIdMutationResult = UpdateTenantByIdMutationResult;
type apis_UpdateTimelineMutationBody = UpdateTimelineMutationBody;
type apis_UpdateTimelineMutationError = UpdateTimelineMutationError;
type apis_UpdateTimelineMutationResult = UpdateTimelineMutationResult;
type apis_UpdateUserMutationBody = UpdateUserMutationBody;
type apis_UpdateUserMutationError = UpdateUserMutationError;
type apis_UpdateUserMutationResult = UpdateUserMutationResult;
type apis_VerifyTokenQueryError = VerifyTokenQueryError;
type apis_VerifyTokenQueryResult = VerifyTokenQueryResult;
type apis_VerifyTokenSuspenseInfiniteQueryError = VerifyTokenSuspenseInfiniteQueryError;
type apis_VerifyTokenSuspenseInfiniteQueryResult = VerifyTokenSuspenseInfiniteQueryResult;
type apis_VerifyTokenSuspenseQueryError = VerifyTokenSuspenseQueryError;
type apis_VerifyTokenSuspenseQueryResult = VerifyTokenSuspenseQueryResult;
declare const apis_createCategory: typeof createCategory;
declare const apis_createExercise: typeof createExercise;
declare const apis_createFile: typeof createFile;
declare const apis_createGround: typeof createGround;
declare const apis_createGroup: typeof createGroup;
declare const apis_createProgram: typeof createProgram;
declare const apis_createRole: typeof createRole;
declare const apis_createRoleClassification: typeof createRoleClassification;
declare const apis_createRoutine: typeof createRoutine;
declare const apis_createSession: typeof createSession;
declare const apis_createSpace: typeof createSpace;
declare const apis_createSubject: typeof createSubject;
declare const apis_createTenant: typeof createTenant;
declare const apis_createTimeline: typeof createTimeline;
declare const apis_createUser: typeof createUser;
declare const apis_deleteCategoryById: typeof deleteCategoryById;
declare const apis_deleteExercise: typeof deleteExercise;
declare const apis_deleteGroundById: typeof deleteGroundById;
declare const apis_deleteGroup: typeof deleteGroup;
declare const apis_deleteProgramById: typeof deleteProgramById;
declare const apis_deleteRole: typeof deleteRole;
declare const apis_deleteRoleClassificationById: typeof deleteRoleClassificationById;
declare const apis_deleteRoutine: typeof deleteRoutine;
declare const apis_deleteSession: typeof deleteSession;
declare const apis_deleteSpace: typeof deleteSpace;
declare const apis_deleteSubject: typeof deleteSubject;
declare const apis_deleteTenant: typeof deleteTenant;
declare const apis_deleteTimeline: typeof deleteTimeline;
declare const apis_deleteUser: typeof deleteUser;
declare const apis_getAppBuilder: typeof getAppBuilder;
declare const apis_getCategoriesByQuery: typeof getCategoriesByQuery;
declare const apis_getCategoryById: typeof getCategoryById;
declare const apis_getCreateCategoryMutationOptions: typeof getCreateCategoryMutationOptions;
declare const apis_getCreateExerciseMutationOptions: typeof getCreateExerciseMutationOptions;
declare const apis_getCreateFileMutationOptions: typeof getCreateFileMutationOptions;
declare const apis_getCreateGroundMutationOptions: typeof getCreateGroundMutationOptions;
declare const apis_getCreateGroupMutationOptions: typeof getCreateGroupMutationOptions;
declare const apis_getCreateProgramMutationOptions: typeof getCreateProgramMutationOptions;
declare const apis_getCreateRoleClassificationMutationOptions: typeof getCreateRoleClassificationMutationOptions;
declare const apis_getCreateRoleMutationOptions: typeof getCreateRoleMutationOptions;
declare const apis_getCreateRoutineMutationOptions: typeof getCreateRoutineMutationOptions;
declare const apis_getCreateSessionMutationOptions: typeof getCreateSessionMutationOptions;
declare const apis_getCreateSpaceMutationOptions: typeof getCreateSpaceMutationOptions;
declare const apis_getCreateSubjectMutationOptions: typeof getCreateSubjectMutationOptions;
declare const apis_getCreateTenantMutationOptions: typeof getCreateTenantMutationOptions;
declare const apis_getCreateTimelineMutationOptions: typeof getCreateTimelineMutationOptions;
declare const apis_getCreateUserMutationOptions: typeof getCreateUserMutationOptions;
declare const apis_getCurrentSpace: typeof getCurrentSpace;
declare const apis_getDeleteCategoryByIdMutationOptions: typeof getDeleteCategoryByIdMutationOptions;
declare const apis_getDeleteExerciseMutationOptions: typeof getDeleteExerciseMutationOptions;
declare const apis_getDeleteGroundByIdMutationOptions: typeof getDeleteGroundByIdMutationOptions;
declare const apis_getDeleteGroupMutationOptions: typeof getDeleteGroupMutationOptions;
declare const apis_getDeleteProgramByIdMutationOptions: typeof getDeleteProgramByIdMutationOptions;
declare const apis_getDeleteRoleClassificationByIdMutationOptions: typeof getDeleteRoleClassificationByIdMutationOptions;
declare const apis_getDeleteRoleMutationOptions: typeof getDeleteRoleMutationOptions;
declare const apis_getDeleteRoutineMutationOptions: typeof getDeleteRoutineMutationOptions;
declare const apis_getDeleteSessionMutationOptions: typeof getDeleteSessionMutationOptions;
declare const apis_getDeleteSpaceMutationOptions: typeof getDeleteSpaceMutationOptions;
declare const apis_getDeleteSubjectMutationOptions: typeof getDeleteSubjectMutationOptions;
declare const apis_getDeleteTenantMutationOptions: typeof getDeleteTenantMutationOptions;
declare const apis_getDeleteTimelineMutationOptions: typeof getDeleteTimelineMutationOptions;
declare const apis_getDeleteUserMutationOptions: typeof getDeleteUserMutationOptions;
declare const apis_getExercise: typeof getExercise;
declare const apis_getExercisesByQuery: typeof getExercisesByQuery;
declare const apis_getFileById: typeof getFileById;
declare const apis_getGetAppBuilderQueryKey: typeof getGetAppBuilderQueryKey;
declare const apis_getGetAppBuilderQueryOptions: typeof getGetAppBuilderQueryOptions;
declare const apis_getGetAppBuilderSuspenseInfiniteQueryOptions: typeof getGetAppBuilderSuspenseInfiniteQueryOptions;
declare const apis_getGetAppBuilderSuspenseQueryOptions: typeof getGetAppBuilderSuspenseQueryOptions;
declare const apis_getGetCategoriesByQueryQueryKey: typeof getGetCategoriesByQueryQueryKey;
declare const apis_getGetCategoriesByQueryQueryOptions: typeof getGetCategoriesByQueryQueryOptions;
declare const apis_getGetCategoriesByQuerySuspenseInfiniteQueryOptions: typeof getGetCategoriesByQuerySuspenseInfiniteQueryOptions;
declare const apis_getGetCategoriesByQuerySuspenseQueryOptions: typeof getGetCategoriesByQuerySuspenseQueryOptions;
declare const apis_getGetCategoryByIdQueryKey: typeof getGetCategoryByIdQueryKey;
declare const apis_getGetCategoryByIdQueryOptions: typeof getGetCategoryByIdQueryOptions;
declare const apis_getGetCategoryByIdSuspenseInfiniteQueryOptions: typeof getGetCategoryByIdSuspenseInfiniteQueryOptions;
declare const apis_getGetCategoryByIdSuspenseQueryOptions: typeof getGetCategoryByIdSuspenseQueryOptions;
declare const apis_getGetCurrentSpaceQueryKey: typeof getGetCurrentSpaceQueryKey;
declare const apis_getGetCurrentSpaceQueryOptions: typeof getGetCurrentSpaceQueryOptions;
declare const apis_getGetCurrentSpaceSuspenseInfiniteQueryOptions: typeof getGetCurrentSpaceSuspenseInfiniteQueryOptions;
declare const apis_getGetCurrentSpaceSuspenseQueryOptions: typeof getGetCurrentSpaceSuspenseQueryOptions;
declare const apis_getGetExerciseQueryKey: typeof getGetExerciseQueryKey;
declare const apis_getGetExerciseQueryOptions: typeof getGetExerciseQueryOptions;
declare const apis_getGetExerciseSuspenseInfiniteQueryOptions: typeof getGetExerciseSuspenseInfiniteQueryOptions;
declare const apis_getGetExerciseSuspenseQueryOptions: typeof getGetExerciseSuspenseQueryOptions;
declare const apis_getGetExercisesByQueryQueryKey: typeof getGetExercisesByQueryQueryKey;
declare const apis_getGetExercisesByQueryQueryOptions: typeof getGetExercisesByQueryQueryOptions;
declare const apis_getGetExercisesByQuerySuspenseInfiniteQueryOptions: typeof getGetExercisesByQuerySuspenseInfiniteQueryOptions;
declare const apis_getGetExercisesByQuerySuspenseQueryOptions: typeof getGetExercisesByQuerySuspenseQueryOptions;
declare const apis_getGetFileByIdQueryKey: typeof getGetFileByIdQueryKey;
declare const apis_getGetFileByIdQueryOptions: typeof getGetFileByIdQueryOptions;
declare const apis_getGetFileByIdSuspenseInfiniteQueryOptions: typeof getGetFileByIdSuspenseInfiniteQueryOptions;
declare const apis_getGetFileByIdSuspenseQueryOptions: typeof getGetFileByIdSuspenseQueryOptions;
declare const apis_getGetGroundByIdQueryKey: typeof getGetGroundByIdQueryKey;
declare const apis_getGetGroundByIdQueryOptions: typeof getGetGroundByIdQueryOptions;
declare const apis_getGetGroundByIdSuspenseInfiniteQueryOptions: typeof getGetGroundByIdSuspenseInfiniteQueryOptions;
declare const apis_getGetGroundByIdSuspenseQueryOptions: typeof getGetGroundByIdSuspenseQueryOptions;
declare const apis_getGetGroundsByQueryQueryKey: typeof getGetGroundsByQueryQueryKey;
declare const apis_getGetGroundsByQueryQueryOptions: typeof getGetGroundsByQueryQueryOptions;
declare const apis_getGetGroundsByQuerySuspenseInfiniteQueryOptions: typeof getGetGroundsByQuerySuspenseInfiniteQueryOptions;
declare const apis_getGetGroundsByQuerySuspenseQueryOptions: typeof getGetGroundsByQuerySuspenseQueryOptions;
declare const apis_getGetGroupByIdQueryKey: typeof getGetGroupByIdQueryKey;
declare const apis_getGetGroupByIdQueryOptions: typeof getGetGroupByIdQueryOptions;
declare const apis_getGetGroupByIdSuspenseInfiniteQueryOptions: typeof getGetGroupByIdSuspenseInfiniteQueryOptions;
declare const apis_getGetGroupByIdSuspenseQueryOptions: typeof getGetGroupByIdSuspenseQueryOptions;
declare const apis_getGetGroupsByQueryQueryKey: typeof getGetGroupsByQueryQueryKey;
declare const apis_getGetGroupsByQueryQueryOptions: typeof getGetGroupsByQueryQueryOptions;
declare const apis_getGetGroupsByQuerySuspenseInfiniteQueryOptions: typeof getGetGroupsByQuerySuspenseInfiniteQueryOptions;
declare const apis_getGetGroupsByQuerySuspenseQueryOptions: typeof getGetGroupsByQuerySuspenseQueryOptions;
declare const apis_getGetMyTenantsQueryKey: typeof getGetMyTenantsQueryKey;
declare const apis_getGetMyTenantsQueryOptions: typeof getGetMyTenantsQueryOptions;
declare const apis_getGetMyTenantsSuspenseInfiniteQueryOptions: typeof getGetMyTenantsSuspenseInfiniteQueryOptions;
declare const apis_getGetMyTenantsSuspenseQueryOptions: typeof getGetMyTenantsSuspenseQueryOptions;
declare const apis_getGetNewTokenQueryKey: typeof getGetNewTokenQueryKey;
declare const apis_getGetNewTokenQueryOptions: typeof getGetNewTokenQueryOptions;
declare const apis_getGetNewTokenSuspenseInfiniteQueryOptions: typeof getGetNewTokenSuspenseInfiniteQueryOptions;
declare const apis_getGetNewTokenSuspenseQueryOptions: typeof getGetNewTokenSuspenseQueryOptions;
declare const apis_getGetProgramByIdQueryKey: typeof getGetProgramByIdQueryKey;
declare const apis_getGetProgramByIdQueryOptions: typeof getGetProgramByIdQueryOptions;
declare const apis_getGetProgramByIdSuspenseInfiniteQueryOptions: typeof getGetProgramByIdSuspenseInfiniteQueryOptions;
declare const apis_getGetProgramByIdSuspenseQueryOptions: typeof getGetProgramByIdSuspenseQueryOptions;
declare const apis_getGetProgramsByQueryQueryKey: typeof getGetProgramsByQueryQueryKey;
declare const apis_getGetProgramsByQueryQueryOptions: typeof getGetProgramsByQueryQueryOptions;
declare const apis_getGetProgramsByQuerySuspenseInfiniteQueryOptions: typeof getGetProgramsByQuerySuspenseInfiniteQueryOptions;
declare const apis_getGetProgramsByQuerySuspenseQueryOptions: typeof getGetProgramsByQuerySuspenseQueryOptions;
declare const apis_getGetRoleClassificationByIdQueryKey: typeof getGetRoleClassificationByIdQueryKey;
declare const apis_getGetRoleClassificationByIdQueryOptions: typeof getGetRoleClassificationByIdQueryOptions;
declare const apis_getGetRoleClassificationByIdSuspenseInfiniteQueryOptions: typeof getGetRoleClassificationByIdSuspenseInfiniteQueryOptions;
declare const apis_getGetRoleClassificationByIdSuspenseQueryOptions: typeof getGetRoleClassificationByIdSuspenseQueryOptions;
declare const apis_getGetRoleClassificationsByQueryQueryKey: typeof getGetRoleClassificationsByQueryQueryKey;
declare const apis_getGetRoleClassificationsByQueryQueryOptions: typeof getGetRoleClassificationsByQueryQueryOptions;
declare const apis_getGetRoleClassificationsByQuerySuspenseInfiniteQueryOptions: typeof getGetRoleClassificationsByQuerySuspenseInfiniteQueryOptions;
declare const apis_getGetRoleClassificationsByQuerySuspenseQueryOptions: typeof getGetRoleClassificationsByQuerySuspenseQueryOptions;
declare const apis_getGetRoleQueryKey: typeof getGetRoleQueryKey;
declare const apis_getGetRoleQueryOptions: typeof getGetRoleQueryOptions;
declare const apis_getGetRoleSuspenseInfiniteQueryOptions: typeof getGetRoleSuspenseInfiniteQueryOptions;
declare const apis_getGetRoleSuspenseQueryOptions: typeof getGetRoleSuspenseQueryOptions;
declare const apis_getGetRolesByQueryQueryKey: typeof getGetRolesByQueryQueryKey;
declare const apis_getGetRolesByQueryQueryOptions: typeof getGetRolesByQueryQueryOptions;
declare const apis_getGetRolesByQuerySuspenseInfiniteQueryOptions: typeof getGetRolesByQuerySuspenseInfiniteQueryOptions;
declare const apis_getGetRolesByQuerySuspenseQueryOptions: typeof getGetRolesByQuerySuspenseQueryOptions;
declare const apis_getGetRoutineQueryKey: typeof getGetRoutineQueryKey;
declare const apis_getGetRoutineQueryOptions: typeof getGetRoutineQueryOptions;
declare const apis_getGetRoutineSuspenseInfiniteQueryOptions: typeof getGetRoutineSuspenseInfiniteQueryOptions;
declare const apis_getGetRoutineSuspenseQueryOptions: typeof getGetRoutineSuspenseQueryOptions;
declare const apis_getGetRoutinesByQueryQueryKey: typeof getGetRoutinesByQueryQueryKey;
declare const apis_getGetRoutinesByQueryQueryOptions: typeof getGetRoutinesByQueryQueryOptions;
declare const apis_getGetRoutinesByQuerySuspenseInfiniteQueryOptions: typeof getGetRoutinesByQuerySuspenseInfiniteQueryOptions;
declare const apis_getGetRoutinesByQuerySuspenseQueryOptions: typeof getGetRoutinesByQuerySuspenseQueryOptions;
declare const apis_getGetSessionQueryKey: typeof getGetSessionQueryKey;
declare const apis_getGetSessionQueryOptions: typeof getGetSessionQueryOptions;
declare const apis_getGetSessionSuspenseInfiniteQueryOptions: typeof getGetSessionSuspenseInfiniteQueryOptions;
declare const apis_getGetSessionSuspenseQueryOptions: typeof getGetSessionSuspenseQueryOptions;
declare const apis_getGetSessionsByQueryQueryKey: typeof getGetSessionsByQueryQueryKey;
declare const apis_getGetSessionsByQueryQueryOptions: typeof getGetSessionsByQueryQueryOptions;
declare const apis_getGetSessionsByQuerySuspenseInfiniteQueryOptions: typeof getGetSessionsByQuerySuspenseInfiniteQueryOptions;
declare const apis_getGetSessionsByQuerySuspenseQueryOptions: typeof getGetSessionsByQuerySuspenseQueryOptions;
declare const apis_getGetSpaceQueryKey: typeof getGetSpaceQueryKey;
declare const apis_getGetSpaceQueryOptions: typeof getGetSpaceQueryOptions;
declare const apis_getGetSpaceSuspenseInfiniteQueryOptions: typeof getGetSpaceSuspenseInfiniteQueryOptions;
declare const apis_getGetSpaceSuspenseQueryOptions: typeof getGetSpaceSuspenseQueryOptions;
declare const apis_getGetSpacesByQueryQueryKey: typeof getGetSpacesByQueryQueryKey;
declare const apis_getGetSpacesByQueryQueryOptions: typeof getGetSpacesByQueryQueryOptions;
declare const apis_getGetSpacesByQuerySuspenseInfiniteQueryOptions: typeof getGetSpacesByQuerySuspenseInfiniteQueryOptions;
declare const apis_getGetSpacesByQuerySuspenseQueryOptions: typeof getGetSpacesByQuerySuspenseQueryOptions;
declare const apis_getGetSubjectQueryKey: typeof getGetSubjectQueryKey;
declare const apis_getGetSubjectQueryOptions: typeof getGetSubjectQueryOptions;
declare const apis_getGetSubjectSuspenseInfiniteQueryOptions: typeof getGetSubjectSuspenseInfiniteQueryOptions;
declare const apis_getGetSubjectSuspenseQueryOptions: typeof getGetSubjectSuspenseQueryOptions;
declare const apis_getGetSubjectsByQueryQueryKey: typeof getGetSubjectsByQueryQueryKey;
declare const apis_getGetSubjectsByQueryQueryOptions: typeof getGetSubjectsByQueryQueryOptions;
declare const apis_getGetSubjectsByQuerySuspenseInfiniteQueryOptions: typeof getGetSubjectsByQuerySuspenseInfiniteQueryOptions;
declare const apis_getGetSubjectsByQuerySuspenseQueryOptions: typeof getGetSubjectsByQuerySuspenseQueryOptions;
declare const apis_getGetTenantByIdQueryKey: typeof getGetTenantByIdQueryKey;
declare const apis_getGetTenantByIdQueryOptions: typeof getGetTenantByIdQueryOptions;
declare const apis_getGetTenantByIdSuspenseInfiniteQueryOptions: typeof getGetTenantByIdSuspenseInfiniteQueryOptions;
declare const apis_getGetTenantByIdSuspenseQueryOptions: typeof getGetTenantByIdSuspenseQueryOptions;
declare const apis_getGetTenantsByQueryQueryKey: typeof getGetTenantsByQueryQueryKey;
declare const apis_getGetTenantsByQueryQueryOptions: typeof getGetTenantsByQueryQueryOptions;
declare const apis_getGetTenantsByQuerySuspenseInfiniteQueryOptions: typeof getGetTenantsByQuerySuspenseInfiniteQueryOptions;
declare const apis_getGetTenantsByQuerySuspenseQueryOptions: typeof getGetTenantsByQuerySuspenseQueryOptions;
declare const apis_getGetTimelineQueryKey: typeof getGetTimelineQueryKey;
declare const apis_getGetTimelineQueryOptions: typeof getGetTimelineQueryOptions;
declare const apis_getGetTimelineSuspenseInfiniteQueryOptions: typeof getGetTimelineSuspenseInfiniteQueryOptions;
declare const apis_getGetTimelineSuspenseQueryOptions: typeof getGetTimelineSuspenseQueryOptions;
declare const apis_getGetTimelinesByQueryQueryKey: typeof getGetTimelinesByQueryQueryKey;
declare const apis_getGetTimelinesByQueryQueryOptions: typeof getGetTimelinesByQueryQueryOptions;
declare const apis_getGetTimelinesByQuerySuspenseInfiniteQueryOptions: typeof getGetTimelinesByQuerySuspenseInfiniteQueryOptions;
declare const apis_getGetTimelinesByQuerySuspenseQueryOptions: typeof getGetTimelinesByQuerySuspenseQueryOptions;
declare const apis_getGetUserQueryKey: typeof getGetUserQueryKey;
declare const apis_getGetUserQueryOptions: typeof getGetUserQueryOptions;
declare const apis_getGetUserSuspenseInfiniteQueryOptions: typeof getGetUserSuspenseInfiniteQueryOptions;
declare const apis_getGetUserSuspenseQueryOptions: typeof getGetUserSuspenseQueryOptions;
declare const apis_getGetUsersByQueryQueryKey: typeof getGetUsersByQueryQueryKey;
declare const apis_getGetUsersByQueryQueryOptions: typeof getGetUsersByQueryQueryOptions;
declare const apis_getGetUsersByQuerySuspenseInfiniteQueryOptions: typeof getGetUsersByQuerySuspenseInfiniteQueryOptions;
declare const apis_getGetUsersByQuerySuspenseQueryOptions: typeof getGetUsersByQuerySuspenseQueryOptions;
declare const apis_getGroundById: typeof getGroundById;
declare const apis_getGroundsByQuery: typeof getGroundsByQuery;
declare const apis_getGroupById: typeof getGroupById;
declare const apis_getGroupsByQuery: typeof getGroupsByQuery;
declare const apis_getLoginMutationOptions: typeof getLoginMutationOptions;
declare const apis_getLogoutMutationOptions: typeof getLogoutMutationOptions;
declare const apis_getMyTenants: typeof getMyTenants;
declare const apis_getNewToken: typeof getNewToken;
declare const apis_getProgramById: typeof getProgramById;
declare const apis_getProgramsByQuery: typeof getProgramsByQuery;
declare const apis_getRefreshTokenMutationOptions: typeof getRefreshTokenMutationOptions;
declare const apis_getRemoveExerciseMutationOptions: typeof getRemoveExerciseMutationOptions;
declare const apis_getRemoveFileByIdMutationOptions: typeof getRemoveFileByIdMutationOptions;
declare const apis_getRemoveGroundByIdMutationOptions: typeof getRemoveGroundByIdMutationOptions;
declare const apis_getRemoveGroupsMutationOptions: typeof getRemoveGroupsMutationOptions;
declare const apis_getRemoveProgramByIdMutationOptions: typeof getRemoveProgramByIdMutationOptions;
declare const apis_getRemoveRoleClassificationByIdMutationOptions: typeof getRemoveRoleClassificationByIdMutationOptions;
declare const apis_getRemoveRoleMutationOptions: typeof getRemoveRoleMutationOptions;
declare const apis_getRemoveRoutineMutationOptions: typeof getRemoveRoutineMutationOptions;
declare const apis_getRemoveSessionMutationOptions: typeof getRemoveSessionMutationOptions;
declare const apis_getRemoveSessionsMutationOptions: typeof getRemoveSessionsMutationOptions;
declare const apis_getRemoveSpaceMutationOptions: typeof getRemoveSpaceMutationOptions;
declare const apis_getRemoveSubjectMutationOptions: typeof getRemoveSubjectMutationOptions;
declare const apis_getRemoveSubjectsMutationOptions: typeof getRemoveSubjectsMutationOptions;
declare const apis_getRemoveTenantByIdMutationOptions: typeof getRemoveTenantByIdMutationOptions;
declare const apis_getRemoveTimelineMutationOptions: typeof getRemoveTimelineMutationOptions;
declare const apis_getRemoveTimelinesMutationOptions: typeof getRemoveTimelinesMutationOptions;
declare const apis_getRemoveUserMutationOptions: typeof getRemoveUserMutationOptions;
declare const apis_getRemoveUsersMutationOptions: typeof getRemoveUsersMutationOptions;
declare const apis_getRole: typeof getRole;
declare const apis_getRoleClassificationById: typeof getRoleClassificationById;
declare const apis_getRoleClassificationsByQuery: typeof getRoleClassificationsByQuery;
declare const apis_getRolesByQuery: typeof getRolesByQuery;
declare const apis_getRoutine: typeof getRoutine;
declare const apis_getRoutinesByQuery: typeof getRoutinesByQuery;
declare const apis_getSession: typeof getSession;
declare const apis_getSessionsByQuery: typeof getSessionsByQuery;
declare const apis_getSignUpUserMutationOptions: typeof getSignUpUserMutationOptions;
declare const apis_getSpace: typeof getSpace;
declare const apis_getSpacesByQuery: typeof getSpacesByQuery;
declare const apis_getSubject: typeof getSubject;
declare const apis_getSubjectsByQuery: typeof getSubjectsByQuery;
declare const apis_getTenantById: typeof getTenantById;
declare const apis_getTenantsByQuery: typeof getTenantsByQuery;
declare const apis_getTimeline: typeof getTimeline;
declare const apis_getTimelinesByQuery: typeof getTimelinesByQuery;
declare const apis_getUpdateCategoryByIdMutationOptions: typeof getUpdateCategoryByIdMutationOptions;
declare const apis_getUpdateExerciseMutationOptions: typeof getUpdateExerciseMutationOptions;
declare const apis_getUpdateFileByIdMutationOptions: typeof getUpdateFileByIdMutationOptions;
declare const apis_getUpdateGroundByIdMutationOptions: typeof getUpdateGroundByIdMutationOptions;
declare const apis_getUpdateGroupByIdMutationOptions: typeof getUpdateGroupByIdMutationOptions;
declare const apis_getUpdateProgramByIdMutationOptions: typeof getUpdateProgramByIdMutationOptions;
declare const apis_getUpdateRoleClassificationByIdMutationOptions: typeof getUpdateRoleClassificationByIdMutationOptions;
declare const apis_getUpdateRoleMutationOptions: typeof getUpdateRoleMutationOptions;
declare const apis_getUpdateRoutineMutationOptions: typeof getUpdateRoutineMutationOptions;
declare const apis_getUpdateSessionMutationOptions: typeof getUpdateSessionMutationOptions;
declare const apis_getUpdateSpaceMutationOptions: typeof getUpdateSpaceMutationOptions;
declare const apis_getUpdateSubjectMutationOptions: typeof getUpdateSubjectMutationOptions;
declare const apis_getUpdateTenantByIdMutationOptions: typeof getUpdateTenantByIdMutationOptions;
declare const apis_getUpdateTimelineMutationOptions: typeof getUpdateTimelineMutationOptions;
declare const apis_getUpdateUserMutationOptions: typeof getUpdateUserMutationOptions;
declare const apis_getUser: typeof getUser;
declare const apis_getUsersByQuery: typeof getUsersByQuery;
declare const apis_getVerifyTokenQueryKey: typeof getVerifyTokenQueryKey;
declare const apis_getVerifyTokenQueryOptions: typeof getVerifyTokenQueryOptions;
declare const apis_getVerifyTokenSuspenseInfiniteQueryOptions: typeof getVerifyTokenSuspenseInfiniteQueryOptions;
declare const apis_getVerifyTokenSuspenseQueryOptions: typeof getVerifyTokenSuspenseQueryOptions;
declare const apis_login: typeof login;
declare const apis_logout: typeof logout;
declare const apis_refreshToken: typeof refreshToken;
declare const apis_removeExercise: typeof removeExercise;
declare const apis_removeFileById: typeof removeFileById;
declare const apis_removeGroundById: typeof removeGroundById;
declare const apis_removeGroups: typeof removeGroups;
declare const apis_removeProgramById: typeof removeProgramById;
declare const apis_removeRole: typeof removeRole;
declare const apis_removeRoleClassificationById: typeof removeRoleClassificationById;
declare const apis_removeRoutine: typeof removeRoutine;
declare const apis_removeSession: typeof removeSession;
declare const apis_removeSessions: typeof removeSessions;
declare const apis_removeSpace: typeof removeSpace;
declare const apis_removeSubject: typeof removeSubject;
declare const apis_removeSubjects: typeof removeSubjects;
declare const apis_removeTenantById: typeof removeTenantById;
declare const apis_removeTimeline: typeof removeTimeline;
declare const apis_removeTimelines: typeof removeTimelines;
declare const apis_removeUser: typeof removeUser;
declare const apis_removeUsers: typeof removeUsers;
declare const apis_signUpUser: typeof signUpUser;
declare const apis_updateCategoryById: typeof updateCategoryById;
declare const apis_updateExercise: typeof updateExercise;
declare const apis_updateFileById: typeof updateFileById;
declare const apis_updateGroundById: typeof updateGroundById;
declare const apis_updateGroupById: typeof updateGroupById;
declare const apis_updateProgramById: typeof updateProgramById;
declare const apis_updateRole: typeof updateRole;
declare const apis_updateRoleClassificationById: typeof updateRoleClassificationById;
declare const apis_updateRoutine: typeof updateRoutine;
declare const apis_updateSession: typeof updateSession;
declare const apis_updateSpace: typeof updateSpace;
declare const apis_updateSubject: typeof updateSubject;
declare const apis_updateTenantById: typeof updateTenantById;
declare const apis_updateTimeline: typeof updateTimeline;
declare const apis_updateUser: typeof updateUser;
declare const apis_useCreateCategory: typeof useCreateCategory;
declare const apis_useCreateExercise: typeof useCreateExercise;
declare const apis_useCreateFile: typeof useCreateFile;
declare const apis_useCreateGround: typeof useCreateGround;
declare const apis_useCreateGroup: typeof useCreateGroup;
declare const apis_useCreateProgram: typeof useCreateProgram;
declare const apis_useCreateRole: typeof useCreateRole;
declare const apis_useCreateRoleClassification: typeof useCreateRoleClassification;
declare const apis_useCreateRoutine: typeof useCreateRoutine;
declare const apis_useCreateSession: typeof useCreateSession;
declare const apis_useCreateSpace: typeof useCreateSpace;
declare const apis_useCreateSubject: typeof useCreateSubject;
declare const apis_useCreateTenant: typeof useCreateTenant;
declare const apis_useCreateTimeline: typeof useCreateTimeline;
declare const apis_useCreateUser: typeof useCreateUser;
declare const apis_useDeleteCategoryById: typeof useDeleteCategoryById;
declare const apis_useDeleteExercise: typeof useDeleteExercise;
declare const apis_useDeleteGroundById: typeof useDeleteGroundById;
declare const apis_useDeleteGroup: typeof useDeleteGroup;
declare const apis_useDeleteProgramById: typeof useDeleteProgramById;
declare const apis_useDeleteRole: typeof useDeleteRole;
declare const apis_useDeleteRoleClassificationById: typeof useDeleteRoleClassificationById;
declare const apis_useDeleteRoutine: typeof useDeleteRoutine;
declare const apis_useDeleteSession: typeof useDeleteSession;
declare const apis_useDeleteSpace: typeof useDeleteSpace;
declare const apis_useDeleteSubject: typeof useDeleteSubject;
declare const apis_useDeleteTenant: typeof useDeleteTenant;
declare const apis_useDeleteTimeline: typeof useDeleteTimeline;
declare const apis_useDeleteUser: typeof useDeleteUser;
declare const apis_useGetAppBuilder: typeof useGetAppBuilder;
declare const apis_useGetAppBuilderSuspense: typeof useGetAppBuilderSuspense;
declare const apis_useGetAppBuilderSuspenseInfinite: typeof useGetAppBuilderSuspenseInfinite;
declare const apis_useGetCategoriesByQuery: typeof useGetCategoriesByQuery;
declare const apis_useGetCategoriesByQuerySuspense: typeof useGetCategoriesByQuerySuspense;
declare const apis_useGetCategoriesByQuerySuspenseInfinite: typeof useGetCategoriesByQuerySuspenseInfinite;
declare const apis_useGetCategoryById: typeof useGetCategoryById;
declare const apis_useGetCategoryByIdSuspense: typeof useGetCategoryByIdSuspense;
declare const apis_useGetCategoryByIdSuspenseInfinite: typeof useGetCategoryByIdSuspenseInfinite;
declare const apis_useGetCurrentSpace: typeof useGetCurrentSpace;
declare const apis_useGetCurrentSpaceSuspense: typeof useGetCurrentSpaceSuspense;
declare const apis_useGetCurrentSpaceSuspenseInfinite: typeof useGetCurrentSpaceSuspenseInfinite;
declare const apis_useGetExercise: typeof useGetExercise;
declare const apis_useGetExerciseSuspense: typeof useGetExerciseSuspense;
declare const apis_useGetExerciseSuspenseInfinite: typeof useGetExerciseSuspenseInfinite;
declare const apis_useGetExercisesByQuery: typeof useGetExercisesByQuery;
declare const apis_useGetExercisesByQuerySuspense: typeof useGetExercisesByQuerySuspense;
declare const apis_useGetExercisesByQuerySuspenseInfinite: typeof useGetExercisesByQuerySuspenseInfinite;
declare const apis_useGetFileById: typeof useGetFileById;
declare const apis_useGetFileByIdSuspense: typeof useGetFileByIdSuspense;
declare const apis_useGetFileByIdSuspenseInfinite: typeof useGetFileByIdSuspenseInfinite;
declare const apis_useGetGroundById: typeof useGetGroundById;
declare const apis_useGetGroundByIdSuspense: typeof useGetGroundByIdSuspense;
declare const apis_useGetGroundByIdSuspenseInfinite: typeof useGetGroundByIdSuspenseInfinite;
declare const apis_useGetGroundsByQuery: typeof useGetGroundsByQuery;
declare const apis_useGetGroundsByQuerySuspense: typeof useGetGroundsByQuerySuspense;
declare const apis_useGetGroundsByQuerySuspenseInfinite: typeof useGetGroundsByQuerySuspenseInfinite;
declare const apis_useGetGroupById: typeof useGetGroupById;
declare const apis_useGetGroupByIdSuspense: typeof useGetGroupByIdSuspense;
declare const apis_useGetGroupByIdSuspenseInfinite: typeof useGetGroupByIdSuspenseInfinite;
declare const apis_useGetGroupsByQuery: typeof useGetGroupsByQuery;
declare const apis_useGetGroupsByQuerySuspense: typeof useGetGroupsByQuerySuspense;
declare const apis_useGetGroupsByQuerySuspenseInfinite: typeof useGetGroupsByQuerySuspenseInfinite;
declare const apis_useGetMyTenants: typeof useGetMyTenants;
declare const apis_useGetMyTenantsSuspense: typeof useGetMyTenantsSuspense;
declare const apis_useGetMyTenantsSuspenseInfinite: typeof useGetMyTenantsSuspenseInfinite;
declare const apis_useGetNewToken: typeof useGetNewToken;
declare const apis_useGetNewTokenSuspense: typeof useGetNewTokenSuspense;
declare const apis_useGetNewTokenSuspenseInfinite: typeof useGetNewTokenSuspenseInfinite;
declare const apis_useGetProgramById: typeof useGetProgramById;
declare const apis_useGetProgramByIdSuspense: typeof useGetProgramByIdSuspense;
declare const apis_useGetProgramByIdSuspenseInfinite: typeof useGetProgramByIdSuspenseInfinite;
declare const apis_useGetProgramsByQuery: typeof useGetProgramsByQuery;
declare const apis_useGetProgramsByQuerySuspense: typeof useGetProgramsByQuerySuspense;
declare const apis_useGetProgramsByQuerySuspenseInfinite: typeof useGetProgramsByQuerySuspenseInfinite;
declare const apis_useGetRole: typeof useGetRole;
declare const apis_useGetRoleClassificationById: typeof useGetRoleClassificationById;
declare const apis_useGetRoleClassificationByIdSuspense: typeof useGetRoleClassificationByIdSuspense;
declare const apis_useGetRoleClassificationByIdSuspenseInfinite: typeof useGetRoleClassificationByIdSuspenseInfinite;
declare const apis_useGetRoleClassificationsByQuery: typeof useGetRoleClassificationsByQuery;
declare const apis_useGetRoleClassificationsByQuerySuspense: typeof useGetRoleClassificationsByQuerySuspense;
declare const apis_useGetRoleClassificationsByQuerySuspenseInfinite: typeof useGetRoleClassificationsByQuerySuspenseInfinite;
declare const apis_useGetRoleSuspense: typeof useGetRoleSuspense;
declare const apis_useGetRoleSuspenseInfinite: typeof useGetRoleSuspenseInfinite;
declare const apis_useGetRolesByQuery: typeof useGetRolesByQuery;
declare const apis_useGetRolesByQuerySuspense: typeof useGetRolesByQuerySuspense;
declare const apis_useGetRolesByQuerySuspenseInfinite: typeof useGetRolesByQuerySuspenseInfinite;
declare const apis_useGetRoutine: typeof useGetRoutine;
declare const apis_useGetRoutineSuspense: typeof useGetRoutineSuspense;
declare const apis_useGetRoutineSuspenseInfinite: typeof useGetRoutineSuspenseInfinite;
declare const apis_useGetRoutinesByQuery: typeof useGetRoutinesByQuery;
declare const apis_useGetRoutinesByQuerySuspense: typeof useGetRoutinesByQuerySuspense;
declare const apis_useGetRoutinesByQuerySuspenseInfinite: typeof useGetRoutinesByQuerySuspenseInfinite;
declare const apis_useGetSession: typeof useGetSession;
declare const apis_useGetSessionSuspense: typeof useGetSessionSuspense;
declare const apis_useGetSessionSuspenseInfinite: typeof useGetSessionSuspenseInfinite;
declare const apis_useGetSessionsByQuery: typeof useGetSessionsByQuery;
declare const apis_useGetSessionsByQuerySuspense: typeof useGetSessionsByQuerySuspense;
declare const apis_useGetSessionsByQuerySuspenseInfinite: typeof useGetSessionsByQuerySuspenseInfinite;
declare const apis_useGetSpace: typeof useGetSpace;
declare const apis_useGetSpaceSuspense: typeof useGetSpaceSuspense;
declare const apis_useGetSpaceSuspenseInfinite: typeof useGetSpaceSuspenseInfinite;
declare const apis_useGetSpacesByQuery: typeof useGetSpacesByQuery;
declare const apis_useGetSpacesByQuerySuspense: typeof useGetSpacesByQuerySuspense;
declare const apis_useGetSpacesByQuerySuspenseInfinite: typeof useGetSpacesByQuerySuspenseInfinite;
declare const apis_useGetSubject: typeof useGetSubject;
declare const apis_useGetSubjectSuspense: typeof useGetSubjectSuspense;
declare const apis_useGetSubjectSuspenseInfinite: typeof useGetSubjectSuspenseInfinite;
declare const apis_useGetSubjectsByQuery: typeof useGetSubjectsByQuery;
declare const apis_useGetSubjectsByQuerySuspense: typeof useGetSubjectsByQuerySuspense;
declare const apis_useGetSubjectsByQuerySuspenseInfinite: typeof useGetSubjectsByQuerySuspenseInfinite;
declare const apis_useGetTenantById: typeof useGetTenantById;
declare const apis_useGetTenantByIdSuspense: typeof useGetTenantByIdSuspense;
declare const apis_useGetTenantByIdSuspenseInfinite: typeof useGetTenantByIdSuspenseInfinite;
declare const apis_useGetTenantsByQuery: typeof useGetTenantsByQuery;
declare const apis_useGetTenantsByQuerySuspense: typeof useGetTenantsByQuerySuspense;
declare const apis_useGetTenantsByQuerySuspenseInfinite: typeof useGetTenantsByQuerySuspenseInfinite;
declare const apis_useGetTimeline: typeof useGetTimeline;
declare const apis_useGetTimelineSuspense: typeof useGetTimelineSuspense;
declare const apis_useGetTimelineSuspenseInfinite: typeof useGetTimelineSuspenseInfinite;
declare const apis_useGetTimelinesByQuery: typeof useGetTimelinesByQuery;
declare const apis_useGetTimelinesByQuerySuspense: typeof useGetTimelinesByQuerySuspense;
declare const apis_useGetTimelinesByQuerySuspenseInfinite: typeof useGetTimelinesByQuerySuspenseInfinite;
declare const apis_useGetUser: typeof useGetUser;
declare const apis_useGetUserSuspense: typeof useGetUserSuspense;
declare const apis_useGetUserSuspenseInfinite: typeof useGetUserSuspenseInfinite;
declare const apis_useGetUsersByQuery: typeof useGetUsersByQuery;
declare const apis_useGetUsersByQuerySuspense: typeof useGetUsersByQuerySuspense;
declare const apis_useGetUsersByQuerySuspenseInfinite: typeof useGetUsersByQuerySuspenseInfinite;
declare const apis_useLogin: typeof useLogin;
declare const apis_useLogout: typeof useLogout;
declare const apis_useRefreshToken: typeof useRefreshToken;
declare const apis_useRemoveExercise: typeof useRemoveExercise;
declare const apis_useRemoveFileById: typeof useRemoveFileById;
declare const apis_useRemoveGroundById: typeof useRemoveGroundById;
declare const apis_useRemoveGroups: typeof useRemoveGroups;
declare const apis_useRemoveProgramById: typeof useRemoveProgramById;
declare const apis_useRemoveRole: typeof useRemoveRole;
declare const apis_useRemoveRoleClassificationById: typeof useRemoveRoleClassificationById;
declare const apis_useRemoveRoutine: typeof useRemoveRoutine;
declare const apis_useRemoveSession: typeof useRemoveSession;
declare const apis_useRemoveSessions: typeof useRemoveSessions;
declare const apis_useRemoveSpace: typeof useRemoveSpace;
declare const apis_useRemoveSubject: typeof useRemoveSubject;
declare const apis_useRemoveSubjects: typeof useRemoveSubjects;
declare const apis_useRemoveTenantById: typeof useRemoveTenantById;
declare const apis_useRemoveTimeline: typeof useRemoveTimeline;
declare const apis_useRemoveTimelines: typeof useRemoveTimelines;
declare const apis_useRemoveUser: typeof useRemoveUser;
declare const apis_useRemoveUsers: typeof useRemoveUsers;
declare const apis_useSignUpUser: typeof useSignUpUser;
declare const apis_useUpdateCategoryById: typeof useUpdateCategoryById;
declare const apis_useUpdateExercise: typeof useUpdateExercise;
declare const apis_useUpdateFileById: typeof useUpdateFileById;
declare const apis_useUpdateGroundById: typeof useUpdateGroundById;
declare const apis_useUpdateGroupById: typeof useUpdateGroupById;
declare const apis_useUpdateProgramById: typeof useUpdateProgramById;
declare const apis_useUpdateRole: typeof useUpdateRole;
declare const apis_useUpdateRoleClassificationById: typeof useUpdateRoleClassificationById;
declare const apis_useUpdateRoutine: typeof useUpdateRoutine;
declare const apis_useUpdateSession: typeof useUpdateSession;
declare const apis_useUpdateSpace: typeof useUpdateSpace;
declare const apis_useUpdateSubject: typeof useUpdateSubject;
declare const apis_useUpdateTenantById: typeof useUpdateTenantById;
declare const apis_useUpdateTimeline: typeof useUpdateTimeline;
declare const apis_useUpdateUser: typeof useUpdateUser;
declare const apis_useVerifyToken: typeof useVerifyToken;
declare const apis_useVerifyTokenSuspense: typeof useVerifyTokenSuspense;
declare const apis_useVerifyTokenSuspenseInfinite: typeof useVerifyTokenSuspenseInfinite;
declare const apis_verifyToken: typeof verifyToken;
declare namespace apis {
  export { type apis_CreateCategoryMutationBody as CreateCategoryMutationBody, type apis_CreateCategoryMutationError as CreateCategoryMutationError, type apis_CreateCategoryMutationResult as CreateCategoryMutationResult, type apis_CreateExerciseMutationBody as CreateExerciseMutationBody, type apis_CreateExerciseMutationError as CreateExerciseMutationError, type apis_CreateExerciseMutationResult as CreateExerciseMutationResult, type apis_CreateFileMutationBody as CreateFileMutationBody, type apis_CreateFileMutationError as CreateFileMutationError, type apis_CreateFileMutationResult as CreateFileMutationResult, type apis_CreateGroundMutationBody as CreateGroundMutationBody, type apis_CreateGroundMutationError as CreateGroundMutationError, type apis_CreateGroundMutationResult as CreateGroundMutationResult, type apis_CreateGroupMutationBody as CreateGroupMutationBody, type apis_CreateGroupMutationError as CreateGroupMutationError, type apis_CreateGroupMutationResult as CreateGroupMutationResult, type apis_CreateProgramMutationBody as CreateProgramMutationBody, type apis_CreateProgramMutationError as CreateProgramMutationError, type apis_CreateProgramMutationResult as CreateProgramMutationResult, type apis_CreateRoleClassificationMutationBody as CreateRoleClassificationMutationBody, type apis_CreateRoleClassificationMutationError as CreateRoleClassificationMutationError, type apis_CreateRoleClassificationMutationResult as CreateRoleClassificationMutationResult, type apis_CreateRoleMutationBody as CreateRoleMutationBody, type apis_CreateRoleMutationError as CreateRoleMutationError, type apis_CreateRoleMutationResult as CreateRoleMutationResult, type apis_CreateRoutineMutationBody as CreateRoutineMutationBody, type apis_CreateRoutineMutationError as CreateRoutineMutationError, type apis_CreateRoutineMutationResult as CreateRoutineMutationResult, type apis_CreateSessionMutationBody as CreateSessionMutationBody, type apis_CreateSessionMutationError as CreateSessionMutationError, type apis_CreateSessionMutationResult as CreateSessionMutationResult, type apis_CreateSpaceMutationBody as CreateSpaceMutationBody, type apis_CreateSpaceMutationError as CreateSpaceMutationError, type apis_CreateSpaceMutationResult as CreateSpaceMutationResult, type apis_CreateSubjectMutationBody as CreateSubjectMutationBody, type apis_CreateSubjectMutationError as CreateSubjectMutationError, type apis_CreateSubjectMutationResult as CreateSubjectMutationResult, type apis_CreateTenantMutationBody as CreateTenantMutationBody, type apis_CreateTenantMutationError as CreateTenantMutationError, type apis_CreateTenantMutationResult as CreateTenantMutationResult, type apis_CreateTimelineMutationBody as CreateTimelineMutationBody, type apis_CreateTimelineMutationError as CreateTimelineMutationError, type apis_CreateTimelineMutationResult as CreateTimelineMutationResult, type apis_CreateUserMutationBody as CreateUserMutationBody, type apis_CreateUserMutationError as CreateUserMutationError, type apis_CreateUserMutationResult as CreateUserMutationResult, type apis_DeleteCategoryByIdMutationError as DeleteCategoryByIdMutationError, type apis_DeleteCategoryByIdMutationResult as DeleteCategoryByIdMutationResult, type apis_DeleteExerciseMutationError as DeleteExerciseMutationError, type apis_DeleteExerciseMutationResult as DeleteExerciseMutationResult, type apis_DeleteGroundByIdMutationError as DeleteGroundByIdMutationError, type apis_DeleteGroundByIdMutationResult as DeleteGroundByIdMutationResult, type apis_DeleteGroupMutationError as DeleteGroupMutationError, type apis_DeleteGroupMutationResult as DeleteGroupMutationResult, type apis_DeleteProgramByIdMutationError as DeleteProgramByIdMutationError, type apis_DeleteProgramByIdMutationResult as DeleteProgramByIdMutationResult, type apis_DeleteRoleClassificationByIdMutationError as DeleteRoleClassificationByIdMutationError, type apis_DeleteRoleClassificationByIdMutationResult as DeleteRoleClassificationByIdMutationResult, type apis_DeleteRoleMutationError as DeleteRoleMutationError, type apis_DeleteRoleMutationResult as DeleteRoleMutationResult, type apis_DeleteRoutineMutationError as DeleteRoutineMutationError, type apis_DeleteRoutineMutationResult as DeleteRoutineMutationResult, type apis_DeleteSessionMutationError as DeleteSessionMutationError, type apis_DeleteSessionMutationResult as DeleteSessionMutationResult, type apis_DeleteSpaceMutationError as DeleteSpaceMutationError, type apis_DeleteSpaceMutationResult as DeleteSpaceMutationResult, type apis_DeleteSubjectMutationError as DeleteSubjectMutationError, type apis_DeleteSubjectMutationResult as DeleteSubjectMutationResult, type apis_DeleteTenantMutationError as DeleteTenantMutationError, type apis_DeleteTenantMutationResult as DeleteTenantMutationResult, type apis_DeleteTimelineMutationError as DeleteTimelineMutationError, type apis_DeleteTimelineMutationResult as DeleteTimelineMutationResult, type apis_DeleteUserMutationError as DeleteUserMutationError, type apis_DeleteUserMutationResult as DeleteUserMutationResult, type apis_GetAppBuilderQueryError as GetAppBuilderQueryError, type apis_GetAppBuilderQueryResult as GetAppBuilderQueryResult, type apis_GetAppBuilderSuspenseInfiniteQueryError as GetAppBuilderSuspenseInfiniteQueryError, type apis_GetAppBuilderSuspenseInfiniteQueryResult as GetAppBuilderSuspenseInfiniteQueryResult, type apis_GetAppBuilderSuspenseQueryError as GetAppBuilderSuspenseQueryError, type apis_GetAppBuilderSuspenseQueryResult as GetAppBuilderSuspenseQueryResult, type apis_GetCategoriesByQueryQueryError as GetCategoriesByQueryQueryError, type apis_GetCategoriesByQueryQueryResult as GetCategoriesByQueryQueryResult, type apis_GetCategoriesByQuerySuspenseInfiniteQueryError as GetCategoriesByQuerySuspenseInfiniteQueryError, type apis_GetCategoriesByQuerySuspenseInfiniteQueryResult as GetCategoriesByQuerySuspenseInfiniteQueryResult, type apis_GetCategoriesByQuerySuspenseQueryError as GetCategoriesByQuerySuspenseQueryError, type apis_GetCategoriesByQuerySuspenseQueryResult as GetCategoriesByQuerySuspenseQueryResult, type apis_GetCategoryByIdQueryError as GetCategoryByIdQueryError, type apis_GetCategoryByIdQueryResult as GetCategoryByIdQueryResult, type apis_GetCategoryByIdSuspenseInfiniteQueryError as GetCategoryByIdSuspenseInfiniteQueryError, type apis_GetCategoryByIdSuspenseInfiniteQueryResult as GetCategoryByIdSuspenseInfiniteQueryResult, type apis_GetCategoryByIdSuspenseQueryError as GetCategoryByIdSuspenseQueryError, type apis_GetCategoryByIdSuspenseQueryResult as GetCategoryByIdSuspenseQueryResult, type apis_GetCurrentSpaceQueryError as GetCurrentSpaceQueryError, type apis_GetCurrentSpaceQueryResult as GetCurrentSpaceQueryResult, type apis_GetCurrentSpaceSuspenseInfiniteQueryError as GetCurrentSpaceSuspenseInfiniteQueryError, type apis_GetCurrentSpaceSuspenseInfiniteQueryResult as GetCurrentSpaceSuspenseInfiniteQueryResult, type apis_GetCurrentSpaceSuspenseQueryError as GetCurrentSpaceSuspenseQueryError, type apis_GetCurrentSpaceSuspenseQueryResult as GetCurrentSpaceSuspenseQueryResult, type apis_GetExerciseQueryError as GetExerciseQueryError, type apis_GetExerciseQueryResult as GetExerciseQueryResult, type apis_GetExerciseSuspenseInfiniteQueryError as GetExerciseSuspenseInfiniteQueryError, type apis_GetExerciseSuspenseInfiniteQueryResult as GetExerciseSuspenseInfiniteQueryResult, type apis_GetExerciseSuspenseQueryError as GetExerciseSuspenseQueryError, type apis_GetExerciseSuspenseQueryResult as GetExerciseSuspenseQueryResult, type apis_GetExercisesByQueryQueryError as GetExercisesByQueryQueryError, type apis_GetExercisesByQueryQueryResult as GetExercisesByQueryQueryResult, type apis_GetExercisesByQuerySuspenseInfiniteQueryError as GetExercisesByQuerySuspenseInfiniteQueryError, type apis_GetExercisesByQuerySuspenseInfiniteQueryResult as GetExercisesByQuerySuspenseInfiniteQueryResult, type apis_GetExercisesByQuerySuspenseQueryError as GetExercisesByQuerySuspenseQueryError, type apis_GetExercisesByQuerySuspenseQueryResult as GetExercisesByQuerySuspenseQueryResult, type apis_GetFileByIdQueryError as GetFileByIdQueryError, type apis_GetFileByIdQueryResult as GetFileByIdQueryResult, type apis_GetFileByIdSuspenseInfiniteQueryError as GetFileByIdSuspenseInfiniteQueryError, type apis_GetFileByIdSuspenseInfiniteQueryResult as GetFileByIdSuspenseInfiniteQueryResult, type apis_GetFileByIdSuspenseQueryError as GetFileByIdSuspenseQueryError, type apis_GetFileByIdSuspenseQueryResult as GetFileByIdSuspenseQueryResult, type apis_GetGroundByIdQueryError as GetGroundByIdQueryError, type apis_GetGroundByIdQueryResult as GetGroundByIdQueryResult, type apis_GetGroundByIdSuspenseInfiniteQueryError as GetGroundByIdSuspenseInfiniteQueryError, type apis_GetGroundByIdSuspenseInfiniteQueryResult as GetGroundByIdSuspenseInfiniteQueryResult, type apis_GetGroundByIdSuspenseQueryError as GetGroundByIdSuspenseQueryError, type apis_GetGroundByIdSuspenseQueryResult as GetGroundByIdSuspenseQueryResult, type apis_GetGroundsByQueryQueryError as GetGroundsByQueryQueryError, type apis_GetGroundsByQueryQueryResult as GetGroundsByQueryQueryResult, type apis_GetGroundsByQuerySuspenseInfiniteQueryError as GetGroundsByQuerySuspenseInfiniteQueryError, type apis_GetGroundsByQuerySuspenseInfiniteQueryResult as GetGroundsByQuerySuspenseInfiniteQueryResult, type apis_GetGroundsByQuerySuspenseQueryError as GetGroundsByQuerySuspenseQueryError, type apis_GetGroundsByQuerySuspenseQueryResult as GetGroundsByQuerySuspenseQueryResult, type apis_GetGroupByIdQueryError as GetGroupByIdQueryError, type apis_GetGroupByIdQueryResult as GetGroupByIdQueryResult, type apis_GetGroupByIdSuspenseInfiniteQueryError as GetGroupByIdSuspenseInfiniteQueryError, type apis_GetGroupByIdSuspenseInfiniteQueryResult as GetGroupByIdSuspenseInfiniteQueryResult, type apis_GetGroupByIdSuspenseQueryError as GetGroupByIdSuspenseQueryError, type apis_GetGroupByIdSuspenseQueryResult as GetGroupByIdSuspenseQueryResult, type apis_GetGroupsByQueryQueryError as GetGroupsByQueryQueryError, type apis_GetGroupsByQueryQueryResult as GetGroupsByQueryQueryResult, type apis_GetGroupsByQuerySuspenseInfiniteQueryError as GetGroupsByQuerySuspenseInfiniteQueryError, type apis_GetGroupsByQuerySuspenseInfiniteQueryResult as GetGroupsByQuerySuspenseInfiniteQueryResult, type apis_GetGroupsByQuerySuspenseQueryError as GetGroupsByQuerySuspenseQueryError, type apis_GetGroupsByQuerySuspenseQueryResult as GetGroupsByQuerySuspenseQueryResult, type apis_GetMyTenantsQueryError as GetMyTenantsQueryError, type apis_GetMyTenantsQueryResult as GetMyTenantsQueryResult, type apis_GetMyTenantsSuspenseInfiniteQueryError as GetMyTenantsSuspenseInfiniteQueryError, type apis_GetMyTenantsSuspenseInfiniteQueryResult as GetMyTenantsSuspenseInfiniteQueryResult, type apis_GetMyTenantsSuspenseQueryError as GetMyTenantsSuspenseQueryError, type apis_GetMyTenantsSuspenseQueryResult as GetMyTenantsSuspenseQueryResult, type apis_GetNewTokenQueryError as GetNewTokenQueryError, type apis_GetNewTokenQueryResult as GetNewTokenQueryResult, type apis_GetNewTokenSuspenseInfiniteQueryError as GetNewTokenSuspenseInfiniteQueryError, type apis_GetNewTokenSuspenseInfiniteQueryResult as GetNewTokenSuspenseInfiniteQueryResult, type apis_GetNewTokenSuspenseQueryError as GetNewTokenSuspenseQueryError, type apis_GetNewTokenSuspenseQueryResult as GetNewTokenSuspenseQueryResult, type apis_GetProgramByIdQueryError as GetProgramByIdQueryError, type apis_GetProgramByIdQueryResult as GetProgramByIdQueryResult, type apis_GetProgramByIdSuspenseInfiniteQueryError as GetProgramByIdSuspenseInfiniteQueryError, type apis_GetProgramByIdSuspenseInfiniteQueryResult as GetProgramByIdSuspenseInfiniteQueryResult, type apis_GetProgramByIdSuspenseQueryError as GetProgramByIdSuspenseQueryError, type apis_GetProgramByIdSuspenseQueryResult as GetProgramByIdSuspenseQueryResult, type apis_GetProgramsByQueryQueryError as GetProgramsByQueryQueryError, type apis_GetProgramsByQueryQueryResult as GetProgramsByQueryQueryResult, type apis_GetProgramsByQuerySuspenseInfiniteQueryError as GetProgramsByQuerySuspenseInfiniteQueryError, type apis_GetProgramsByQuerySuspenseInfiniteQueryResult as GetProgramsByQuerySuspenseInfiniteQueryResult, type apis_GetProgramsByQuerySuspenseQueryError as GetProgramsByQuerySuspenseQueryError, type apis_GetProgramsByQuerySuspenseQueryResult as GetProgramsByQuerySuspenseQueryResult, type apis_GetRoleClassificationByIdQueryError as GetRoleClassificationByIdQueryError, type apis_GetRoleClassificationByIdQueryResult as GetRoleClassificationByIdQueryResult, type apis_GetRoleClassificationByIdSuspenseInfiniteQueryError as GetRoleClassificationByIdSuspenseInfiniteQueryError, type apis_GetRoleClassificationByIdSuspenseInfiniteQueryResult as GetRoleClassificationByIdSuspenseInfiniteQueryResult, type apis_GetRoleClassificationByIdSuspenseQueryError as GetRoleClassificationByIdSuspenseQueryError, type apis_GetRoleClassificationByIdSuspenseQueryResult as GetRoleClassificationByIdSuspenseQueryResult, type apis_GetRoleClassificationsByQueryQueryError as GetRoleClassificationsByQueryQueryError, type apis_GetRoleClassificationsByQueryQueryResult as GetRoleClassificationsByQueryQueryResult, type apis_GetRoleClassificationsByQuerySuspenseInfiniteQueryError as GetRoleClassificationsByQuerySuspenseInfiniteQueryError, type apis_GetRoleClassificationsByQuerySuspenseInfiniteQueryResult as GetRoleClassificationsByQuerySuspenseInfiniteQueryResult, type apis_GetRoleClassificationsByQuerySuspenseQueryError as GetRoleClassificationsByQuerySuspenseQueryError, type apis_GetRoleClassificationsByQuerySuspenseQueryResult as GetRoleClassificationsByQuerySuspenseQueryResult, type apis_GetRoleQueryError as GetRoleQueryError, type apis_GetRoleQueryResult as GetRoleQueryResult, type apis_GetRoleSuspenseInfiniteQueryError as GetRoleSuspenseInfiniteQueryError, type apis_GetRoleSuspenseInfiniteQueryResult as GetRoleSuspenseInfiniteQueryResult, type apis_GetRoleSuspenseQueryError as GetRoleSuspenseQueryError, type apis_GetRoleSuspenseQueryResult as GetRoleSuspenseQueryResult, type apis_GetRolesByQueryQueryError as GetRolesByQueryQueryError, type apis_GetRolesByQueryQueryResult as GetRolesByQueryQueryResult, type apis_GetRolesByQuerySuspenseInfiniteQueryError as GetRolesByQuerySuspenseInfiniteQueryError, type apis_GetRolesByQuerySuspenseInfiniteQueryResult as GetRolesByQuerySuspenseInfiniteQueryResult, type apis_GetRolesByQuerySuspenseQueryError as GetRolesByQuerySuspenseQueryError, type apis_GetRolesByQuerySuspenseQueryResult as GetRolesByQuerySuspenseQueryResult, type apis_GetRoutineQueryError as GetRoutineQueryError, type apis_GetRoutineQueryResult as GetRoutineQueryResult, type apis_GetRoutineSuspenseInfiniteQueryError as GetRoutineSuspenseInfiniteQueryError, type apis_GetRoutineSuspenseInfiniteQueryResult as GetRoutineSuspenseInfiniteQueryResult, type apis_GetRoutineSuspenseQueryError as GetRoutineSuspenseQueryError, type apis_GetRoutineSuspenseQueryResult as GetRoutineSuspenseQueryResult, type apis_GetRoutinesByQueryQueryError as GetRoutinesByQueryQueryError, type apis_GetRoutinesByQueryQueryResult as GetRoutinesByQueryQueryResult, type apis_GetRoutinesByQuerySuspenseInfiniteQueryError as GetRoutinesByQuerySuspenseInfiniteQueryError, type apis_GetRoutinesByQuerySuspenseInfiniteQueryResult as GetRoutinesByQuerySuspenseInfiniteQueryResult, type apis_GetRoutinesByQuerySuspenseQueryError as GetRoutinesByQuerySuspenseQueryError, type apis_GetRoutinesByQuerySuspenseQueryResult as GetRoutinesByQuerySuspenseQueryResult, type apis_GetSessionQueryError as GetSessionQueryError, type apis_GetSessionQueryResult as GetSessionQueryResult, type apis_GetSessionSuspenseInfiniteQueryError as GetSessionSuspenseInfiniteQueryError, type apis_GetSessionSuspenseInfiniteQueryResult as GetSessionSuspenseInfiniteQueryResult, type apis_GetSessionSuspenseQueryError as GetSessionSuspenseQueryError, type apis_GetSessionSuspenseQueryResult as GetSessionSuspenseQueryResult, type apis_GetSessionsByQueryQueryError as GetSessionsByQueryQueryError, type apis_GetSessionsByQueryQueryResult as GetSessionsByQueryQueryResult, type apis_GetSessionsByQuerySuspenseInfiniteQueryError as GetSessionsByQuerySuspenseInfiniteQueryError, type apis_GetSessionsByQuerySuspenseInfiniteQueryResult as GetSessionsByQuerySuspenseInfiniteQueryResult, type apis_GetSessionsByQuerySuspenseQueryError as GetSessionsByQuerySuspenseQueryError, type apis_GetSessionsByQuerySuspenseQueryResult as GetSessionsByQuerySuspenseQueryResult, type apis_GetSpaceQueryError as GetSpaceQueryError, type apis_GetSpaceQueryResult as GetSpaceQueryResult, type apis_GetSpaceSuspenseInfiniteQueryError as GetSpaceSuspenseInfiniteQueryError, type apis_GetSpaceSuspenseInfiniteQueryResult as GetSpaceSuspenseInfiniteQueryResult, type apis_GetSpaceSuspenseQueryError as GetSpaceSuspenseQueryError, type apis_GetSpaceSuspenseQueryResult as GetSpaceSuspenseQueryResult, type apis_GetSpacesByQueryQueryError as GetSpacesByQueryQueryError, type apis_GetSpacesByQueryQueryResult as GetSpacesByQueryQueryResult, type apis_GetSpacesByQuerySuspenseInfiniteQueryError as GetSpacesByQuerySuspenseInfiniteQueryError, type apis_GetSpacesByQuerySuspenseInfiniteQueryResult as GetSpacesByQuerySuspenseInfiniteQueryResult, type apis_GetSpacesByQuerySuspenseQueryError as GetSpacesByQuerySuspenseQueryError, type apis_GetSpacesByQuerySuspenseQueryResult as GetSpacesByQuerySuspenseQueryResult, type apis_GetSubjectQueryError as GetSubjectQueryError, type apis_GetSubjectQueryResult as GetSubjectQueryResult, type apis_GetSubjectSuspenseInfiniteQueryError as GetSubjectSuspenseInfiniteQueryError, type apis_GetSubjectSuspenseInfiniteQueryResult as GetSubjectSuspenseInfiniteQueryResult, type apis_GetSubjectSuspenseQueryError as GetSubjectSuspenseQueryError, type apis_GetSubjectSuspenseQueryResult as GetSubjectSuspenseQueryResult, type apis_GetSubjectsByQueryQueryError as GetSubjectsByQueryQueryError, type apis_GetSubjectsByQueryQueryResult as GetSubjectsByQueryQueryResult, type apis_GetSubjectsByQuerySuspenseInfiniteQueryError as GetSubjectsByQuerySuspenseInfiniteQueryError, type apis_GetSubjectsByQuerySuspenseInfiniteQueryResult as GetSubjectsByQuerySuspenseInfiniteQueryResult, type apis_GetSubjectsByQuerySuspenseQueryError as GetSubjectsByQuerySuspenseQueryError, type apis_GetSubjectsByQuerySuspenseQueryResult as GetSubjectsByQuerySuspenseQueryResult, type apis_GetTenantByIdQueryError as GetTenantByIdQueryError, type apis_GetTenantByIdQueryResult as GetTenantByIdQueryResult, type apis_GetTenantByIdSuspenseInfiniteQueryError as GetTenantByIdSuspenseInfiniteQueryError, type apis_GetTenantByIdSuspenseInfiniteQueryResult as GetTenantByIdSuspenseInfiniteQueryResult, type apis_GetTenantByIdSuspenseQueryError as GetTenantByIdSuspenseQueryError, type apis_GetTenantByIdSuspenseQueryResult as GetTenantByIdSuspenseQueryResult, type apis_GetTenantsByQueryQueryError as GetTenantsByQueryQueryError, type apis_GetTenantsByQueryQueryResult as GetTenantsByQueryQueryResult, type apis_GetTenantsByQuerySuspenseInfiniteQueryError as GetTenantsByQuerySuspenseInfiniteQueryError, type apis_GetTenantsByQuerySuspenseInfiniteQueryResult as GetTenantsByQuerySuspenseInfiniteQueryResult, type apis_GetTenantsByQuerySuspenseQueryError as GetTenantsByQuerySuspenseQueryError, type apis_GetTenantsByQuerySuspenseQueryResult as GetTenantsByQuerySuspenseQueryResult, type apis_GetTimelineQueryError as GetTimelineQueryError, type apis_GetTimelineQueryResult as GetTimelineQueryResult, type apis_GetTimelineSuspenseInfiniteQueryError as GetTimelineSuspenseInfiniteQueryError, type apis_GetTimelineSuspenseInfiniteQueryResult as GetTimelineSuspenseInfiniteQueryResult, type apis_GetTimelineSuspenseQueryError as GetTimelineSuspenseQueryError, type apis_GetTimelineSuspenseQueryResult as GetTimelineSuspenseQueryResult, type apis_GetTimelinesByQueryQueryError as GetTimelinesByQueryQueryError, type apis_GetTimelinesByQueryQueryResult as GetTimelinesByQueryQueryResult, type apis_GetTimelinesByQuerySuspenseInfiniteQueryError as GetTimelinesByQuerySuspenseInfiniteQueryError, type apis_GetTimelinesByQuerySuspenseInfiniteQueryResult as GetTimelinesByQuerySuspenseInfiniteQueryResult, type apis_GetTimelinesByQuerySuspenseQueryError as GetTimelinesByQuerySuspenseQueryError, type apis_GetTimelinesByQuerySuspenseQueryResult as GetTimelinesByQuerySuspenseQueryResult, type apis_GetUserQueryError as GetUserQueryError, type apis_GetUserQueryResult as GetUserQueryResult, type apis_GetUserSuspenseInfiniteQueryError as GetUserSuspenseInfiniteQueryError, type apis_GetUserSuspenseInfiniteQueryResult as GetUserSuspenseInfiniteQueryResult, type apis_GetUserSuspenseQueryError as GetUserSuspenseQueryError, type apis_GetUserSuspenseQueryResult as GetUserSuspenseQueryResult, type apis_GetUsersByQueryQueryError as GetUsersByQueryQueryError, type apis_GetUsersByQueryQueryResult as GetUsersByQueryQueryResult, type apis_GetUsersByQuerySuspenseInfiniteQueryError as GetUsersByQuerySuspenseInfiniteQueryError, type apis_GetUsersByQuerySuspenseInfiniteQueryResult as GetUsersByQuerySuspenseInfiniteQueryResult, type apis_GetUsersByQuerySuspenseQueryError as GetUsersByQuerySuspenseQueryError, type apis_GetUsersByQuerySuspenseQueryResult as GetUsersByQuerySuspenseQueryResult, type apis_LoginMutationBody as LoginMutationBody, type apis_LoginMutationError as LoginMutationError, type apis_LoginMutationResult as LoginMutationResult, type apis_LogoutMutationError as LogoutMutationError, type apis_LogoutMutationResult as LogoutMutationResult, type apis_RefreshTokenMutationError as RefreshTokenMutationError, type apis_RefreshTokenMutationResult as RefreshTokenMutationResult, type apis_RemoveExerciseMutationError as RemoveExerciseMutationError, type apis_RemoveExerciseMutationResult as RemoveExerciseMutationResult, type apis_RemoveFileByIdMutationError as RemoveFileByIdMutationError, type apis_RemoveFileByIdMutationResult as RemoveFileByIdMutationResult, type apis_RemoveGroundByIdMutationError as RemoveGroundByIdMutationError, type apis_RemoveGroundByIdMutationResult as RemoveGroundByIdMutationResult, type apis_RemoveGroupsMutationError as RemoveGroupsMutationError, type apis_RemoveGroupsMutationResult as RemoveGroupsMutationResult, type apis_RemoveProgramByIdMutationError as RemoveProgramByIdMutationError, type apis_RemoveProgramByIdMutationResult as RemoveProgramByIdMutationResult, type apis_RemoveRoleClassificationByIdMutationError as RemoveRoleClassificationByIdMutationError, type apis_RemoveRoleClassificationByIdMutationResult as RemoveRoleClassificationByIdMutationResult, type apis_RemoveRoleMutationError as RemoveRoleMutationError, type apis_RemoveRoleMutationResult as RemoveRoleMutationResult, type apis_RemoveRoutineMutationError as RemoveRoutineMutationError, type apis_RemoveRoutineMutationResult as RemoveRoutineMutationResult, type apis_RemoveSessionMutationError as RemoveSessionMutationError, type apis_RemoveSessionMutationResult as RemoveSessionMutationResult, type apis_RemoveSessionsMutationBody as RemoveSessionsMutationBody, type apis_RemoveSessionsMutationError as RemoveSessionsMutationError, type apis_RemoveSessionsMutationResult as RemoveSessionsMutationResult, type apis_RemoveSpaceMutationError as RemoveSpaceMutationError, type apis_RemoveSpaceMutationResult as RemoveSpaceMutationResult, type apis_RemoveSubjectMutationError as RemoveSubjectMutationError, type apis_RemoveSubjectMutationResult as RemoveSubjectMutationResult, type apis_RemoveSubjectsMutationBody as RemoveSubjectsMutationBody, type apis_RemoveSubjectsMutationError as RemoveSubjectsMutationError, type apis_RemoveSubjectsMutationResult as RemoveSubjectsMutationResult, type apis_RemoveTenantByIdMutationError as RemoveTenantByIdMutationError, type apis_RemoveTenantByIdMutationResult as RemoveTenantByIdMutationResult, type apis_RemoveTimelineMutationError as RemoveTimelineMutationError, type apis_RemoveTimelineMutationResult as RemoveTimelineMutationResult, type apis_RemoveTimelinesMutationBody as RemoveTimelinesMutationBody, type apis_RemoveTimelinesMutationError as RemoveTimelinesMutationError, type apis_RemoveTimelinesMutationResult as RemoveTimelinesMutationResult, type apis_RemoveUserMutationError as RemoveUserMutationError, type apis_RemoveUserMutationResult as RemoveUserMutationResult, type apis_RemoveUsersMutationBody as RemoveUsersMutationBody, type apis_RemoveUsersMutationError as RemoveUsersMutationError, type apis_RemoveUsersMutationResult as RemoveUsersMutationResult, type apis_SignUpUserMutationBody as SignUpUserMutationBody, type apis_SignUpUserMutationError as SignUpUserMutationError, type apis_SignUpUserMutationResult as SignUpUserMutationResult, type apis_UpdateCategoryByIdMutationBody as UpdateCategoryByIdMutationBody, type apis_UpdateCategoryByIdMutationError as UpdateCategoryByIdMutationError, type apis_UpdateCategoryByIdMutationResult as UpdateCategoryByIdMutationResult, type apis_UpdateExerciseMutationBody as UpdateExerciseMutationBody, type apis_UpdateExerciseMutationError as UpdateExerciseMutationError, type apis_UpdateExerciseMutationResult as UpdateExerciseMutationResult, type apis_UpdateFileByIdMutationBody as UpdateFileByIdMutationBody, type apis_UpdateFileByIdMutationError as UpdateFileByIdMutationError, type apis_UpdateFileByIdMutationResult as UpdateFileByIdMutationResult, type apis_UpdateGroundByIdMutationBody as UpdateGroundByIdMutationBody, type apis_UpdateGroundByIdMutationError as UpdateGroundByIdMutationError, type apis_UpdateGroundByIdMutationResult as UpdateGroundByIdMutationResult, type apis_UpdateGroupByIdMutationBody as UpdateGroupByIdMutationBody, type apis_UpdateGroupByIdMutationError as UpdateGroupByIdMutationError, type apis_UpdateGroupByIdMutationResult as UpdateGroupByIdMutationResult, type apis_UpdateProgramByIdMutationBody as UpdateProgramByIdMutationBody, type apis_UpdateProgramByIdMutationError as UpdateProgramByIdMutationError, type apis_UpdateProgramByIdMutationResult as UpdateProgramByIdMutationResult, type apis_UpdateRoleClassificationByIdMutationBody as UpdateRoleClassificationByIdMutationBody, type apis_UpdateRoleClassificationByIdMutationError as UpdateRoleClassificationByIdMutationError, type apis_UpdateRoleClassificationByIdMutationResult as UpdateRoleClassificationByIdMutationResult, type apis_UpdateRoleMutationBody as UpdateRoleMutationBody, type apis_UpdateRoleMutationError as UpdateRoleMutationError, type apis_UpdateRoleMutationResult as UpdateRoleMutationResult, type apis_UpdateRoutineMutationBody as UpdateRoutineMutationBody, type apis_UpdateRoutineMutationError as UpdateRoutineMutationError, type apis_UpdateRoutineMutationResult as UpdateRoutineMutationResult, type apis_UpdateSessionMutationBody as UpdateSessionMutationBody, type apis_UpdateSessionMutationError as UpdateSessionMutationError, type apis_UpdateSessionMutationResult as UpdateSessionMutationResult, type apis_UpdateSpaceMutationBody as UpdateSpaceMutationBody, type apis_UpdateSpaceMutationError as UpdateSpaceMutationError, type apis_UpdateSpaceMutationResult as UpdateSpaceMutationResult, type apis_UpdateSubjectMutationBody as UpdateSubjectMutationBody, type apis_UpdateSubjectMutationError as UpdateSubjectMutationError, type apis_UpdateSubjectMutationResult as UpdateSubjectMutationResult, type apis_UpdateTenantByIdMutationBody as UpdateTenantByIdMutationBody, type apis_UpdateTenantByIdMutationError as UpdateTenantByIdMutationError, type apis_UpdateTenantByIdMutationResult as UpdateTenantByIdMutationResult, type apis_UpdateTimelineMutationBody as UpdateTimelineMutationBody, type apis_UpdateTimelineMutationError as UpdateTimelineMutationError, type apis_UpdateTimelineMutationResult as UpdateTimelineMutationResult, type apis_UpdateUserMutationBody as UpdateUserMutationBody, type apis_UpdateUserMutationError as UpdateUserMutationError, type apis_UpdateUserMutationResult as UpdateUserMutationResult, type apis_VerifyTokenQueryError as VerifyTokenQueryError, type apis_VerifyTokenQueryResult as VerifyTokenQueryResult, type apis_VerifyTokenSuspenseInfiniteQueryError as VerifyTokenSuspenseInfiniteQueryError, type apis_VerifyTokenSuspenseInfiniteQueryResult as VerifyTokenSuspenseInfiniteQueryResult, type apis_VerifyTokenSuspenseQueryError as VerifyTokenSuspenseQueryError, type apis_VerifyTokenSuspenseQueryResult as VerifyTokenSuspenseQueryResult, apis_createCategory as createCategory, apis_createExercise as createExercise, apis_createFile as createFile, apis_createGround as createGround, apis_createGroup as createGroup, apis_createProgram as createProgram, apis_createRole as createRole, apis_createRoleClassification as createRoleClassification, apis_createRoutine as createRoutine, apis_createSession as createSession, apis_createSpace as createSpace, apis_createSubject as createSubject, apis_createTenant as createTenant, apis_createTimeline as createTimeline, apis_createUser as createUser, apis_deleteCategoryById as deleteCategoryById, apis_deleteExercise as deleteExercise, apis_deleteGroundById as deleteGroundById, apis_deleteGroup as deleteGroup, apis_deleteProgramById as deleteProgramById, apis_deleteRole as deleteRole, apis_deleteRoleClassificationById as deleteRoleClassificationById, apis_deleteRoutine as deleteRoutine, apis_deleteSession as deleteSession, apis_deleteSpace as deleteSpace, apis_deleteSubject as deleteSubject, apis_deleteTenant as deleteTenant, apis_deleteTimeline as deleteTimeline, apis_deleteUser as deleteUser, apis_getAppBuilder as getAppBuilder, apis_getCategoriesByQuery as getCategoriesByQuery, apis_getCategoryById as getCategoryById, apis_getCreateCategoryMutationOptions as getCreateCategoryMutationOptions, apis_getCreateExerciseMutationOptions as getCreateExerciseMutationOptions, apis_getCreateFileMutationOptions as getCreateFileMutationOptions, apis_getCreateGroundMutationOptions as getCreateGroundMutationOptions, apis_getCreateGroupMutationOptions as getCreateGroupMutationOptions, apis_getCreateProgramMutationOptions as getCreateProgramMutationOptions, apis_getCreateRoleClassificationMutationOptions as getCreateRoleClassificationMutationOptions, apis_getCreateRoleMutationOptions as getCreateRoleMutationOptions, apis_getCreateRoutineMutationOptions as getCreateRoutineMutationOptions, apis_getCreateSessionMutationOptions as getCreateSessionMutationOptions, apis_getCreateSpaceMutationOptions as getCreateSpaceMutationOptions, apis_getCreateSubjectMutationOptions as getCreateSubjectMutationOptions, apis_getCreateTenantMutationOptions as getCreateTenantMutationOptions, apis_getCreateTimelineMutationOptions as getCreateTimelineMutationOptions, apis_getCreateUserMutationOptions as getCreateUserMutationOptions, apis_getCurrentSpace as getCurrentSpace, apis_getDeleteCategoryByIdMutationOptions as getDeleteCategoryByIdMutationOptions, apis_getDeleteExerciseMutationOptions as getDeleteExerciseMutationOptions, apis_getDeleteGroundByIdMutationOptions as getDeleteGroundByIdMutationOptions, apis_getDeleteGroupMutationOptions as getDeleteGroupMutationOptions, apis_getDeleteProgramByIdMutationOptions as getDeleteProgramByIdMutationOptions, apis_getDeleteRoleClassificationByIdMutationOptions as getDeleteRoleClassificationByIdMutationOptions, apis_getDeleteRoleMutationOptions as getDeleteRoleMutationOptions, apis_getDeleteRoutineMutationOptions as getDeleteRoutineMutationOptions, apis_getDeleteSessionMutationOptions as getDeleteSessionMutationOptions, apis_getDeleteSpaceMutationOptions as getDeleteSpaceMutationOptions, apis_getDeleteSubjectMutationOptions as getDeleteSubjectMutationOptions, apis_getDeleteTenantMutationOptions as getDeleteTenantMutationOptions, apis_getDeleteTimelineMutationOptions as getDeleteTimelineMutationOptions, apis_getDeleteUserMutationOptions as getDeleteUserMutationOptions, apis_getExercise as getExercise, apis_getExercisesByQuery as getExercisesByQuery, apis_getFileById as getFileById, apis_getGetAppBuilderQueryKey as getGetAppBuilderQueryKey, apis_getGetAppBuilderQueryOptions as getGetAppBuilderQueryOptions, apis_getGetAppBuilderSuspenseInfiniteQueryOptions as getGetAppBuilderSuspenseInfiniteQueryOptions, apis_getGetAppBuilderSuspenseQueryOptions as getGetAppBuilderSuspenseQueryOptions, apis_getGetCategoriesByQueryQueryKey as getGetCategoriesByQueryQueryKey, apis_getGetCategoriesByQueryQueryOptions as getGetCategoriesByQueryQueryOptions, apis_getGetCategoriesByQuerySuspenseInfiniteQueryOptions as getGetCategoriesByQuerySuspenseInfiniteQueryOptions, apis_getGetCategoriesByQuerySuspenseQueryOptions as getGetCategoriesByQuerySuspenseQueryOptions, apis_getGetCategoryByIdQueryKey as getGetCategoryByIdQueryKey, apis_getGetCategoryByIdQueryOptions as getGetCategoryByIdQueryOptions, apis_getGetCategoryByIdSuspenseInfiniteQueryOptions as getGetCategoryByIdSuspenseInfiniteQueryOptions, apis_getGetCategoryByIdSuspenseQueryOptions as getGetCategoryByIdSuspenseQueryOptions, apis_getGetCurrentSpaceQueryKey as getGetCurrentSpaceQueryKey, apis_getGetCurrentSpaceQueryOptions as getGetCurrentSpaceQueryOptions, apis_getGetCurrentSpaceSuspenseInfiniteQueryOptions as getGetCurrentSpaceSuspenseInfiniteQueryOptions, apis_getGetCurrentSpaceSuspenseQueryOptions as getGetCurrentSpaceSuspenseQueryOptions, apis_getGetExerciseQueryKey as getGetExerciseQueryKey, apis_getGetExerciseQueryOptions as getGetExerciseQueryOptions, apis_getGetExerciseSuspenseInfiniteQueryOptions as getGetExerciseSuspenseInfiniteQueryOptions, apis_getGetExerciseSuspenseQueryOptions as getGetExerciseSuspenseQueryOptions, apis_getGetExercisesByQueryQueryKey as getGetExercisesByQueryQueryKey, apis_getGetExercisesByQueryQueryOptions as getGetExercisesByQueryQueryOptions, apis_getGetExercisesByQuerySuspenseInfiniteQueryOptions as getGetExercisesByQuerySuspenseInfiniteQueryOptions, apis_getGetExercisesByQuerySuspenseQueryOptions as getGetExercisesByQuerySuspenseQueryOptions, apis_getGetFileByIdQueryKey as getGetFileByIdQueryKey, apis_getGetFileByIdQueryOptions as getGetFileByIdQueryOptions, apis_getGetFileByIdSuspenseInfiniteQueryOptions as getGetFileByIdSuspenseInfiniteQueryOptions, apis_getGetFileByIdSuspenseQueryOptions as getGetFileByIdSuspenseQueryOptions, apis_getGetGroundByIdQueryKey as getGetGroundByIdQueryKey, apis_getGetGroundByIdQueryOptions as getGetGroundByIdQueryOptions, apis_getGetGroundByIdSuspenseInfiniteQueryOptions as getGetGroundByIdSuspenseInfiniteQueryOptions, apis_getGetGroundByIdSuspenseQueryOptions as getGetGroundByIdSuspenseQueryOptions, apis_getGetGroundsByQueryQueryKey as getGetGroundsByQueryQueryKey, apis_getGetGroundsByQueryQueryOptions as getGetGroundsByQueryQueryOptions, apis_getGetGroundsByQuerySuspenseInfiniteQueryOptions as getGetGroundsByQuerySuspenseInfiniteQueryOptions, apis_getGetGroundsByQuerySuspenseQueryOptions as getGetGroundsByQuerySuspenseQueryOptions, apis_getGetGroupByIdQueryKey as getGetGroupByIdQueryKey, apis_getGetGroupByIdQueryOptions as getGetGroupByIdQueryOptions, apis_getGetGroupByIdSuspenseInfiniteQueryOptions as getGetGroupByIdSuspenseInfiniteQueryOptions, apis_getGetGroupByIdSuspenseQueryOptions as getGetGroupByIdSuspenseQueryOptions, apis_getGetGroupsByQueryQueryKey as getGetGroupsByQueryQueryKey, apis_getGetGroupsByQueryQueryOptions as getGetGroupsByQueryQueryOptions, apis_getGetGroupsByQuerySuspenseInfiniteQueryOptions as getGetGroupsByQuerySuspenseInfiniteQueryOptions, apis_getGetGroupsByQuerySuspenseQueryOptions as getGetGroupsByQuerySuspenseQueryOptions, apis_getGetMyTenantsQueryKey as getGetMyTenantsQueryKey, apis_getGetMyTenantsQueryOptions as getGetMyTenantsQueryOptions, apis_getGetMyTenantsSuspenseInfiniteQueryOptions as getGetMyTenantsSuspenseInfiniteQueryOptions, apis_getGetMyTenantsSuspenseQueryOptions as getGetMyTenantsSuspenseQueryOptions, apis_getGetNewTokenQueryKey as getGetNewTokenQueryKey, apis_getGetNewTokenQueryOptions as getGetNewTokenQueryOptions, apis_getGetNewTokenSuspenseInfiniteQueryOptions as getGetNewTokenSuspenseInfiniteQueryOptions, apis_getGetNewTokenSuspenseQueryOptions as getGetNewTokenSuspenseQueryOptions, apis_getGetProgramByIdQueryKey as getGetProgramByIdQueryKey, apis_getGetProgramByIdQueryOptions as getGetProgramByIdQueryOptions, apis_getGetProgramByIdSuspenseInfiniteQueryOptions as getGetProgramByIdSuspenseInfiniteQueryOptions, apis_getGetProgramByIdSuspenseQueryOptions as getGetProgramByIdSuspenseQueryOptions, apis_getGetProgramsByQueryQueryKey as getGetProgramsByQueryQueryKey, apis_getGetProgramsByQueryQueryOptions as getGetProgramsByQueryQueryOptions, apis_getGetProgramsByQuerySuspenseInfiniteQueryOptions as getGetProgramsByQuerySuspenseInfiniteQueryOptions, apis_getGetProgramsByQuerySuspenseQueryOptions as getGetProgramsByQuerySuspenseQueryOptions, apis_getGetRoleClassificationByIdQueryKey as getGetRoleClassificationByIdQueryKey, apis_getGetRoleClassificationByIdQueryOptions as getGetRoleClassificationByIdQueryOptions, apis_getGetRoleClassificationByIdSuspenseInfiniteQueryOptions as getGetRoleClassificationByIdSuspenseInfiniteQueryOptions, apis_getGetRoleClassificationByIdSuspenseQueryOptions as getGetRoleClassificationByIdSuspenseQueryOptions, apis_getGetRoleClassificationsByQueryQueryKey as getGetRoleClassificationsByQueryQueryKey, apis_getGetRoleClassificationsByQueryQueryOptions as getGetRoleClassificationsByQueryQueryOptions, apis_getGetRoleClassificationsByQuerySuspenseInfiniteQueryOptions as getGetRoleClassificationsByQuerySuspenseInfiniteQueryOptions, apis_getGetRoleClassificationsByQuerySuspenseQueryOptions as getGetRoleClassificationsByQuerySuspenseQueryOptions, apis_getGetRoleQueryKey as getGetRoleQueryKey, apis_getGetRoleQueryOptions as getGetRoleQueryOptions, apis_getGetRoleSuspenseInfiniteQueryOptions as getGetRoleSuspenseInfiniteQueryOptions, apis_getGetRoleSuspenseQueryOptions as getGetRoleSuspenseQueryOptions, apis_getGetRolesByQueryQueryKey as getGetRolesByQueryQueryKey, apis_getGetRolesByQueryQueryOptions as getGetRolesByQueryQueryOptions, apis_getGetRolesByQuerySuspenseInfiniteQueryOptions as getGetRolesByQuerySuspenseInfiniteQueryOptions, apis_getGetRolesByQuerySuspenseQueryOptions as getGetRolesByQuerySuspenseQueryOptions, apis_getGetRoutineQueryKey as getGetRoutineQueryKey, apis_getGetRoutineQueryOptions as getGetRoutineQueryOptions, apis_getGetRoutineSuspenseInfiniteQueryOptions as getGetRoutineSuspenseInfiniteQueryOptions, apis_getGetRoutineSuspenseQueryOptions as getGetRoutineSuspenseQueryOptions, apis_getGetRoutinesByQueryQueryKey as getGetRoutinesByQueryQueryKey, apis_getGetRoutinesByQueryQueryOptions as getGetRoutinesByQueryQueryOptions, apis_getGetRoutinesByQuerySuspenseInfiniteQueryOptions as getGetRoutinesByQuerySuspenseInfiniteQueryOptions, apis_getGetRoutinesByQuerySuspenseQueryOptions as getGetRoutinesByQuerySuspenseQueryOptions, apis_getGetSessionQueryKey as getGetSessionQueryKey, apis_getGetSessionQueryOptions as getGetSessionQueryOptions, apis_getGetSessionSuspenseInfiniteQueryOptions as getGetSessionSuspenseInfiniteQueryOptions, apis_getGetSessionSuspenseQueryOptions as getGetSessionSuspenseQueryOptions, apis_getGetSessionsByQueryQueryKey as getGetSessionsByQueryQueryKey, apis_getGetSessionsByQueryQueryOptions as getGetSessionsByQueryQueryOptions, apis_getGetSessionsByQuerySuspenseInfiniteQueryOptions as getGetSessionsByQuerySuspenseInfiniteQueryOptions, apis_getGetSessionsByQuerySuspenseQueryOptions as getGetSessionsByQuerySuspenseQueryOptions, apis_getGetSpaceQueryKey as getGetSpaceQueryKey, apis_getGetSpaceQueryOptions as getGetSpaceQueryOptions, apis_getGetSpaceSuspenseInfiniteQueryOptions as getGetSpaceSuspenseInfiniteQueryOptions, apis_getGetSpaceSuspenseQueryOptions as getGetSpaceSuspenseQueryOptions, apis_getGetSpacesByQueryQueryKey as getGetSpacesByQueryQueryKey, apis_getGetSpacesByQueryQueryOptions as getGetSpacesByQueryQueryOptions, apis_getGetSpacesByQuerySuspenseInfiniteQueryOptions as getGetSpacesByQuerySuspenseInfiniteQueryOptions, apis_getGetSpacesByQuerySuspenseQueryOptions as getGetSpacesByQuerySuspenseQueryOptions, apis_getGetSubjectQueryKey as getGetSubjectQueryKey, apis_getGetSubjectQueryOptions as getGetSubjectQueryOptions, apis_getGetSubjectSuspenseInfiniteQueryOptions as getGetSubjectSuspenseInfiniteQueryOptions, apis_getGetSubjectSuspenseQueryOptions as getGetSubjectSuspenseQueryOptions, apis_getGetSubjectsByQueryQueryKey as getGetSubjectsByQueryQueryKey, apis_getGetSubjectsByQueryQueryOptions as getGetSubjectsByQueryQueryOptions, apis_getGetSubjectsByQuerySuspenseInfiniteQueryOptions as getGetSubjectsByQuerySuspenseInfiniteQueryOptions, apis_getGetSubjectsByQuerySuspenseQueryOptions as getGetSubjectsByQuerySuspenseQueryOptions, apis_getGetTenantByIdQueryKey as getGetTenantByIdQueryKey, apis_getGetTenantByIdQueryOptions as getGetTenantByIdQueryOptions, apis_getGetTenantByIdSuspenseInfiniteQueryOptions as getGetTenantByIdSuspenseInfiniteQueryOptions, apis_getGetTenantByIdSuspenseQueryOptions as getGetTenantByIdSuspenseQueryOptions, apis_getGetTenantsByQueryQueryKey as getGetTenantsByQueryQueryKey, apis_getGetTenantsByQueryQueryOptions as getGetTenantsByQueryQueryOptions, apis_getGetTenantsByQuerySuspenseInfiniteQueryOptions as getGetTenantsByQuerySuspenseInfiniteQueryOptions, apis_getGetTenantsByQuerySuspenseQueryOptions as getGetTenantsByQuerySuspenseQueryOptions, apis_getGetTimelineQueryKey as getGetTimelineQueryKey, apis_getGetTimelineQueryOptions as getGetTimelineQueryOptions, apis_getGetTimelineSuspenseInfiniteQueryOptions as getGetTimelineSuspenseInfiniteQueryOptions, apis_getGetTimelineSuspenseQueryOptions as getGetTimelineSuspenseQueryOptions, apis_getGetTimelinesByQueryQueryKey as getGetTimelinesByQueryQueryKey, apis_getGetTimelinesByQueryQueryOptions as getGetTimelinesByQueryQueryOptions, apis_getGetTimelinesByQuerySuspenseInfiniteQueryOptions as getGetTimelinesByQuerySuspenseInfiniteQueryOptions, apis_getGetTimelinesByQuerySuspenseQueryOptions as getGetTimelinesByQuerySuspenseQueryOptions, apis_getGetUserQueryKey as getGetUserQueryKey, apis_getGetUserQueryOptions as getGetUserQueryOptions, apis_getGetUserSuspenseInfiniteQueryOptions as getGetUserSuspenseInfiniteQueryOptions, apis_getGetUserSuspenseQueryOptions as getGetUserSuspenseQueryOptions, apis_getGetUsersByQueryQueryKey as getGetUsersByQueryQueryKey, apis_getGetUsersByQueryQueryOptions as getGetUsersByQueryQueryOptions, apis_getGetUsersByQuerySuspenseInfiniteQueryOptions as getGetUsersByQuerySuspenseInfiniteQueryOptions, apis_getGetUsersByQuerySuspenseQueryOptions as getGetUsersByQuerySuspenseQueryOptions, apis_getGroundById as getGroundById, apis_getGroundsByQuery as getGroundsByQuery, apis_getGroupById as getGroupById, apis_getGroupsByQuery as getGroupsByQuery, apis_getLoginMutationOptions as getLoginMutationOptions, apis_getLogoutMutationOptions as getLogoutMutationOptions, apis_getMyTenants as getMyTenants, apis_getNewToken as getNewToken, apis_getProgramById as getProgramById, apis_getProgramsByQuery as getProgramsByQuery, apis_getRefreshTokenMutationOptions as getRefreshTokenMutationOptions, apis_getRemoveExerciseMutationOptions as getRemoveExerciseMutationOptions, apis_getRemoveFileByIdMutationOptions as getRemoveFileByIdMutationOptions, apis_getRemoveGroundByIdMutationOptions as getRemoveGroundByIdMutationOptions, apis_getRemoveGroupsMutationOptions as getRemoveGroupsMutationOptions, apis_getRemoveProgramByIdMutationOptions as getRemoveProgramByIdMutationOptions, apis_getRemoveRoleClassificationByIdMutationOptions as getRemoveRoleClassificationByIdMutationOptions, apis_getRemoveRoleMutationOptions as getRemoveRoleMutationOptions, apis_getRemoveRoutineMutationOptions as getRemoveRoutineMutationOptions, apis_getRemoveSessionMutationOptions as getRemoveSessionMutationOptions, apis_getRemoveSessionsMutationOptions as getRemoveSessionsMutationOptions, apis_getRemoveSpaceMutationOptions as getRemoveSpaceMutationOptions, apis_getRemoveSubjectMutationOptions as getRemoveSubjectMutationOptions, apis_getRemoveSubjectsMutationOptions as getRemoveSubjectsMutationOptions, apis_getRemoveTenantByIdMutationOptions as getRemoveTenantByIdMutationOptions, apis_getRemoveTimelineMutationOptions as getRemoveTimelineMutationOptions, apis_getRemoveTimelinesMutationOptions as getRemoveTimelinesMutationOptions, apis_getRemoveUserMutationOptions as getRemoveUserMutationOptions, apis_getRemoveUsersMutationOptions as getRemoveUsersMutationOptions, apis_getRole as getRole, apis_getRoleClassificationById as getRoleClassificationById, apis_getRoleClassificationsByQuery as getRoleClassificationsByQuery, apis_getRolesByQuery as getRolesByQuery, apis_getRoutine as getRoutine, apis_getRoutinesByQuery as getRoutinesByQuery, apis_getSession as getSession, apis_getSessionsByQuery as getSessionsByQuery, apis_getSignUpUserMutationOptions as getSignUpUserMutationOptions, apis_getSpace as getSpace, apis_getSpacesByQuery as getSpacesByQuery, apis_getSubject as getSubject, apis_getSubjectsByQuery as getSubjectsByQuery, apis_getTenantById as getTenantById, apis_getTenantsByQuery as getTenantsByQuery, apis_getTimeline as getTimeline, apis_getTimelinesByQuery as getTimelinesByQuery, apis_getUpdateCategoryByIdMutationOptions as getUpdateCategoryByIdMutationOptions, apis_getUpdateExerciseMutationOptions as getUpdateExerciseMutationOptions, apis_getUpdateFileByIdMutationOptions as getUpdateFileByIdMutationOptions, apis_getUpdateGroundByIdMutationOptions as getUpdateGroundByIdMutationOptions, apis_getUpdateGroupByIdMutationOptions as getUpdateGroupByIdMutationOptions, apis_getUpdateProgramByIdMutationOptions as getUpdateProgramByIdMutationOptions, apis_getUpdateRoleClassificationByIdMutationOptions as getUpdateRoleClassificationByIdMutationOptions, apis_getUpdateRoleMutationOptions as getUpdateRoleMutationOptions, apis_getUpdateRoutineMutationOptions as getUpdateRoutineMutationOptions, apis_getUpdateSessionMutationOptions as getUpdateSessionMutationOptions, apis_getUpdateSpaceMutationOptions as getUpdateSpaceMutationOptions, apis_getUpdateSubjectMutationOptions as getUpdateSubjectMutationOptions, apis_getUpdateTenantByIdMutationOptions as getUpdateTenantByIdMutationOptions, apis_getUpdateTimelineMutationOptions as getUpdateTimelineMutationOptions, apis_getUpdateUserMutationOptions as getUpdateUserMutationOptions, apis_getUser as getUser, apis_getUsersByQuery as getUsersByQuery, apis_getVerifyTokenQueryKey as getVerifyTokenQueryKey, apis_getVerifyTokenQueryOptions as getVerifyTokenQueryOptions, apis_getVerifyTokenSuspenseInfiniteQueryOptions as getVerifyTokenSuspenseInfiniteQueryOptions, apis_getVerifyTokenSuspenseQueryOptions as getVerifyTokenSuspenseQueryOptions, apis_login as login, apis_logout as logout, apis_refreshToken as refreshToken, apis_removeExercise as removeExercise, apis_removeFileById as removeFileById, apis_removeGroundById as removeGroundById, apis_removeGroups as removeGroups, apis_removeProgramById as removeProgramById, apis_removeRole as removeRole, apis_removeRoleClassificationById as removeRoleClassificationById, apis_removeRoutine as removeRoutine, apis_removeSession as removeSession, apis_removeSessions as removeSessions, apis_removeSpace as removeSpace, apis_removeSubject as removeSubject, apis_removeSubjects as removeSubjects, apis_removeTenantById as removeTenantById, apis_removeTimeline as removeTimeline, apis_removeTimelines as removeTimelines, apis_removeUser as removeUser, apis_removeUsers as removeUsers, apis_signUpUser as signUpUser, apis_updateCategoryById as updateCategoryById, apis_updateExercise as updateExercise, apis_updateFileById as updateFileById, apis_updateGroundById as updateGroundById, apis_updateGroupById as updateGroupById, apis_updateProgramById as updateProgramById, apis_updateRole as updateRole, apis_updateRoleClassificationById as updateRoleClassificationById, apis_updateRoutine as updateRoutine, apis_updateSession as updateSession, apis_updateSpace as updateSpace, apis_updateSubject as updateSubject, apis_updateTenantById as updateTenantById, apis_updateTimeline as updateTimeline, apis_updateUser as updateUser, apis_useCreateCategory as useCreateCategory, apis_useCreateExercise as useCreateExercise, apis_useCreateFile as useCreateFile, apis_useCreateGround as useCreateGround, apis_useCreateGroup as useCreateGroup, apis_useCreateProgram as useCreateProgram, apis_useCreateRole as useCreateRole, apis_useCreateRoleClassification as useCreateRoleClassification, apis_useCreateRoutine as useCreateRoutine, apis_useCreateSession as useCreateSession, apis_useCreateSpace as useCreateSpace, apis_useCreateSubject as useCreateSubject, apis_useCreateTenant as useCreateTenant, apis_useCreateTimeline as useCreateTimeline, apis_useCreateUser as useCreateUser, apis_useDeleteCategoryById as useDeleteCategoryById, apis_useDeleteExercise as useDeleteExercise, apis_useDeleteGroundById as useDeleteGroundById, apis_useDeleteGroup as useDeleteGroup, apis_useDeleteProgramById as useDeleteProgramById, apis_useDeleteRole as useDeleteRole, apis_useDeleteRoleClassificationById as useDeleteRoleClassificationById, apis_useDeleteRoutine as useDeleteRoutine, apis_useDeleteSession as useDeleteSession, apis_useDeleteSpace as useDeleteSpace, apis_useDeleteSubject as useDeleteSubject, apis_useDeleteTenant as useDeleteTenant, apis_useDeleteTimeline as useDeleteTimeline, apis_useDeleteUser as useDeleteUser, apis_useGetAppBuilder as useGetAppBuilder, apis_useGetAppBuilderSuspense as useGetAppBuilderSuspense, apis_useGetAppBuilderSuspenseInfinite as useGetAppBuilderSuspenseInfinite, apis_useGetCategoriesByQuery as useGetCategoriesByQuery, apis_useGetCategoriesByQuerySuspense as useGetCategoriesByQuerySuspense, apis_useGetCategoriesByQuerySuspenseInfinite as useGetCategoriesByQuerySuspenseInfinite, apis_useGetCategoryById as useGetCategoryById, apis_useGetCategoryByIdSuspense as useGetCategoryByIdSuspense, apis_useGetCategoryByIdSuspenseInfinite as useGetCategoryByIdSuspenseInfinite, apis_useGetCurrentSpace as useGetCurrentSpace, apis_useGetCurrentSpaceSuspense as useGetCurrentSpaceSuspense, apis_useGetCurrentSpaceSuspenseInfinite as useGetCurrentSpaceSuspenseInfinite, apis_useGetExercise as useGetExercise, apis_useGetExerciseSuspense as useGetExerciseSuspense, apis_useGetExerciseSuspenseInfinite as useGetExerciseSuspenseInfinite, apis_useGetExercisesByQuery as useGetExercisesByQuery, apis_useGetExercisesByQuerySuspense as useGetExercisesByQuerySuspense, apis_useGetExercisesByQuerySuspenseInfinite as useGetExercisesByQuerySuspenseInfinite, apis_useGetFileById as useGetFileById, apis_useGetFileByIdSuspense as useGetFileByIdSuspense, apis_useGetFileByIdSuspenseInfinite as useGetFileByIdSuspenseInfinite, apis_useGetGroundById as useGetGroundById, apis_useGetGroundByIdSuspense as useGetGroundByIdSuspense, apis_useGetGroundByIdSuspenseInfinite as useGetGroundByIdSuspenseInfinite, apis_useGetGroundsByQuery as useGetGroundsByQuery, apis_useGetGroundsByQuerySuspense as useGetGroundsByQuerySuspense, apis_useGetGroundsByQuerySuspenseInfinite as useGetGroundsByQuerySuspenseInfinite, apis_useGetGroupById as useGetGroupById, apis_useGetGroupByIdSuspense as useGetGroupByIdSuspense, apis_useGetGroupByIdSuspenseInfinite as useGetGroupByIdSuspenseInfinite, apis_useGetGroupsByQuery as useGetGroupsByQuery, apis_useGetGroupsByQuerySuspense as useGetGroupsByQuerySuspense, apis_useGetGroupsByQuerySuspenseInfinite as useGetGroupsByQuerySuspenseInfinite, apis_useGetMyTenants as useGetMyTenants, apis_useGetMyTenantsSuspense as useGetMyTenantsSuspense, apis_useGetMyTenantsSuspenseInfinite as useGetMyTenantsSuspenseInfinite, apis_useGetNewToken as useGetNewToken, apis_useGetNewTokenSuspense as useGetNewTokenSuspense, apis_useGetNewTokenSuspenseInfinite as useGetNewTokenSuspenseInfinite, apis_useGetProgramById as useGetProgramById, apis_useGetProgramByIdSuspense as useGetProgramByIdSuspense, apis_useGetProgramByIdSuspenseInfinite as useGetProgramByIdSuspenseInfinite, apis_useGetProgramsByQuery as useGetProgramsByQuery, apis_useGetProgramsByQuerySuspense as useGetProgramsByQuerySuspense, apis_useGetProgramsByQuerySuspenseInfinite as useGetProgramsByQuerySuspenseInfinite, apis_useGetRole as useGetRole, apis_useGetRoleClassificationById as useGetRoleClassificationById, apis_useGetRoleClassificationByIdSuspense as useGetRoleClassificationByIdSuspense, apis_useGetRoleClassificationByIdSuspenseInfinite as useGetRoleClassificationByIdSuspenseInfinite, apis_useGetRoleClassificationsByQuery as useGetRoleClassificationsByQuery, apis_useGetRoleClassificationsByQuerySuspense as useGetRoleClassificationsByQuerySuspense, apis_useGetRoleClassificationsByQuerySuspenseInfinite as useGetRoleClassificationsByQuerySuspenseInfinite, apis_useGetRoleSuspense as useGetRoleSuspense, apis_useGetRoleSuspenseInfinite as useGetRoleSuspenseInfinite, apis_useGetRolesByQuery as useGetRolesByQuery, apis_useGetRolesByQuerySuspense as useGetRolesByQuerySuspense, apis_useGetRolesByQuerySuspenseInfinite as useGetRolesByQuerySuspenseInfinite, apis_useGetRoutine as useGetRoutine, apis_useGetRoutineSuspense as useGetRoutineSuspense, apis_useGetRoutineSuspenseInfinite as useGetRoutineSuspenseInfinite, apis_useGetRoutinesByQuery as useGetRoutinesByQuery, apis_useGetRoutinesByQuerySuspense as useGetRoutinesByQuerySuspense, apis_useGetRoutinesByQuerySuspenseInfinite as useGetRoutinesByQuerySuspenseInfinite, apis_useGetSession as useGetSession, apis_useGetSessionSuspense as useGetSessionSuspense, apis_useGetSessionSuspenseInfinite as useGetSessionSuspenseInfinite, apis_useGetSessionsByQuery as useGetSessionsByQuery, apis_useGetSessionsByQuerySuspense as useGetSessionsByQuerySuspense, apis_useGetSessionsByQuerySuspenseInfinite as useGetSessionsByQuerySuspenseInfinite, apis_useGetSpace as useGetSpace, apis_useGetSpaceSuspense as useGetSpaceSuspense, apis_useGetSpaceSuspenseInfinite as useGetSpaceSuspenseInfinite, apis_useGetSpacesByQuery as useGetSpacesByQuery, apis_useGetSpacesByQuerySuspense as useGetSpacesByQuerySuspense, apis_useGetSpacesByQuerySuspenseInfinite as useGetSpacesByQuerySuspenseInfinite, apis_useGetSubject as useGetSubject, apis_useGetSubjectSuspense as useGetSubjectSuspense, apis_useGetSubjectSuspenseInfinite as useGetSubjectSuspenseInfinite, apis_useGetSubjectsByQuery as useGetSubjectsByQuery, apis_useGetSubjectsByQuerySuspense as useGetSubjectsByQuerySuspense, apis_useGetSubjectsByQuerySuspenseInfinite as useGetSubjectsByQuerySuspenseInfinite, apis_useGetTenantById as useGetTenantById, apis_useGetTenantByIdSuspense as useGetTenantByIdSuspense, apis_useGetTenantByIdSuspenseInfinite as useGetTenantByIdSuspenseInfinite, apis_useGetTenantsByQuery as useGetTenantsByQuery, apis_useGetTenantsByQuerySuspense as useGetTenantsByQuerySuspense, apis_useGetTenantsByQuerySuspenseInfinite as useGetTenantsByQuerySuspenseInfinite, apis_useGetTimeline as useGetTimeline, apis_useGetTimelineSuspense as useGetTimelineSuspense, apis_useGetTimelineSuspenseInfinite as useGetTimelineSuspenseInfinite, apis_useGetTimelinesByQuery as useGetTimelinesByQuery, apis_useGetTimelinesByQuerySuspense as useGetTimelinesByQuerySuspense, apis_useGetTimelinesByQuerySuspenseInfinite as useGetTimelinesByQuerySuspenseInfinite, apis_useGetUser as useGetUser, apis_useGetUserSuspense as useGetUserSuspense, apis_useGetUserSuspenseInfinite as useGetUserSuspenseInfinite, apis_useGetUsersByQuery as useGetUsersByQuery, apis_useGetUsersByQuerySuspense as useGetUsersByQuerySuspense, apis_useGetUsersByQuerySuspenseInfinite as useGetUsersByQuerySuspenseInfinite, apis_useLogin as useLogin, apis_useLogout as useLogout, apis_useRefreshToken as useRefreshToken, apis_useRemoveExercise as useRemoveExercise, apis_useRemoveFileById as useRemoveFileById, apis_useRemoveGroundById as useRemoveGroundById, apis_useRemoveGroups as useRemoveGroups, apis_useRemoveProgramById as useRemoveProgramById, apis_useRemoveRole as useRemoveRole, apis_useRemoveRoleClassificationById as useRemoveRoleClassificationById, apis_useRemoveRoutine as useRemoveRoutine, apis_useRemoveSession as useRemoveSession, apis_useRemoveSessions as useRemoveSessions, apis_useRemoveSpace as useRemoveSpace, apis_useRemoveSubject as useRemoveSubject, apis_useRemoveSubjects as useRemoveSubjects, apis_useRemoveTenantById as useRemoveTenantById, apis_useRemoveTimeline as useRemoveTimeline, apis_useRemoveTimelines as useRemoveTimelines, apis_useRemoveUser as useRemoveUser, apis_useRemoveUsers as useRemoveUsers, apis_useSignUpUser as useSignUpUser, apis_useUpdateCategoryById as useUpdateCategoryById, apis_useUpdateExercise as useUpdateExercise, apis_useUpdateFileById as useUpdateFileById, apis_useUpdateGroundById as useUpdateGroundById, apis_useUpdateGroupById as useUpdateGroupById, apis_useUpdateProgramById as useUpdateProgramById, apis_useUpdateRole as useUpdateRole, apis_useUpdateRoleClassificationById as useUpdateRoleClassificationById, apis_useUpdateRoutine as useUpdateRoutine, apis_useUpdateSession as useUpdateSession, apis_useUpdateSpace as useUpdateSpace, apis_useUpdateSubject as useUpdateSubject, apis_useUpdateTenantById as useUpdateTenantById, apis_useUpdateTimeline as useUpdateTimeline, apis_useUpdateUser as useUpdateUser, apis_useVerifyToken as useVerifyToken, apis_useVerifyTokenSuspense as useVerifyTokenSuspense, apis_useVerifyTokenSuspenseInfinite as useVerifyTokenSuspenseInfinite, apis_verifyToken as verifyToken };
}

export { apis as APIManager, AXIOS_INSTANCE, CreateCategory200AllOf, CreateCategoryDto, type CreateCategoryMutationBody, type CreateCategoryMutationError, type CreateCategoryMutationResult, CreateExercise200AllOf, CreateExerciseDto, type CreateExerciseMutationBody, type CreateExerciseMutationError, type CreateExerciseMutationResult, CreateFile201AllOf, CreateFileDto, type CreateFileMutationBody, type CreateFileMutationError, type CreateFileMutationResult, CreateGroundDto, type CreateGroundMutationBody, type CreateGroundMutationError, type CreateGroundMutationResult, type CreateGroupMutationBody, type CreateGroupMutationError, type CreateGroupMutationResult, CreateProgram200AllOf, type CreateProgramMutationBody, type CreateProgramMutationError, type CreateProgramMutationResult, CreateRole200AllOf, type CreateRoleClassificationMutationBody, type CreateRoleClassificationMutationError, type CreateRoleClassificationMutationResult, CreateRoleDto, type CreateRoleMutationBody, type CreateRoleMutationError, type CreateRoleMutationResult, CreateRoutine200AllOf, type CreateRoutineMutationBody, type CreateRoutineMutationError, type CreateRoutineMutationResult, CreateSession200AllOf, type CreateSessionMutationBody, type CreateSessionMutationError, type CreateSessionMutationResult, CreateSpace200AllOf, CreateSpaceDto, type CreateSpaceMutationBody, type CreateSpaceMutationError, type CreateSpaceMutationResult, CreateSubject200AllOf, type CreateSubjectMutationBody, type CreateSubjectMutationError, type CreateSubjectMutationResult, CreateTenant200AllOf, CreateTenantDto, type CreateTenantMutationBody, type CreateTenantMutationError, type CreateTenantMutationResult, CreateTimeline200AllOf, type CreateTimelineMutationBody, type CreateTimelineMutationError, type CreateTimelineMutationResult, CreateUser200AllOf, CreateUserDto, type CreateUserMutationBody, type CreateUserMutationError, type CreateUserMutationResult, DeleteCategoryById200AllOf, type DeleteCategoryByIdMutationError, type DeleteCategoryByIdMutationResult, DeleteExercise200AllOf, type DeleteExerciseMutationError, type DeleteExerciseMutationResult, type DeleteGroundByIdMutationError, type DeleteGroundByIdMutationResult, DeleteGroup200AllOf, type DeleteGroupMutationError, type DeleteGroupMutationResult, DeleteProgramById200AllOf, type DeleteProgramByIdMutationError, type DeleteProgramByIdMutationResult, DeleteRole200AllOf, type DeleteRoleClassificationByIdMutationError, type DeleteRoleClassificationByIdMutationResult, type DeleteRoleMutationError, type DeleteRoleMutationResult, DeleteRoutine200AllOf, type DeleteRoutineMutationError, type DeleteRoutineMutationResult, DeleteSession200AllOf, type DeleteSessionMutationError, type DeleteSessionMutationResult, DeleteSpace200AllOf, type DeleteSpaceMutationError, type DeleteSpaceMutationResult, DeleteSubject200AllOf, type DeleteSubjectMutationError, type DeleteSubjectMutationResult, DeleteTenant200AllOf, type DeleteTenantMutationError, type DeleteTenantMutationResult, DeleteTimeline200AllOf, type DeleteTimelineMutationError, type DeleteTimelineMutationResult, DeleteUser200AllOf, type DeleteUserMutationError, type DeleteUserMutationResult, Function, GetAppBuilder200AllOf, type GetAppBuilderQueryError, type GetAppBuilderQueryResult, type GetAppBuilderSuspenseInfiniteQueryError, type GetAppBuilderSuspenseInfiniteQueryResult, type GetAppBuilderSuspenseQueryError, type GetAppBuilderSuspenseQueryResult, GetCategoriesByQuery200AllOf, GetCategoriesByQueryParams, type GetCategoriesByQueryQueryError, type GetCategoriesByQueryQueryResult, type GetCategoriesByQuerySuspenseInfiniteQueryError, type GetCategoriesByQuerySuspenseInfiniteQueryResult, type GetCategoriesByQuerySuspenseQueryError, type GetCategoriesByQuerySuspenseQueryResult, GetCategoryById200AllOf, type GetCategoryByIdQueryError, type GetCategoryByIdQueryResult, type GetCategoryByIdSuspenseInfiniteQueryError, type GetCategoryByIdSuspenseInfiniteQueryResult, type GetCategoryByIdSuspenseQueryError, type GetCategoryByIdSuspenseQueryResult, GetCurrentSpace200AllOf, type GetCurrentSpaceQueryError, type GetCurrentSpaceQueryResult, type GetCurrentSpaceSuspenseInfiniteQueryError, type GetCurrentSpaceSuspenseInfiniteQueryResult, type GetCurrentSpaceSuspenseQueryError, type GetCurrentSpaceSuspenseQueryResult, GetExercise200AllOf, type GetExerciseQueryError, type GetExerciseQueryResult, type GetExerciseSuspenseInfiniteQueryError, type GetExerciseSuspenseInfiniteQueryResult, type GetExerciseSuspenseQueryError, type GetExerciseSuspenseQueryResult, GetExercisesByQuery200AllOf, GetExercisesByQueryParams, type GetExercisesByQueryQueryError, type GetExercisesByQueryQueryResult, type GetExercisesByQuerySuspenseInfiniteQueryError, type GetExercisesByQuerySuspenseInfiniteQueryResult, type GetExercisesByQuerySuspenseQueryError, type GetExercisesByQuerySuspenseQueryResult, GetFileById200AllOf, type GetFileByIdQueryError, type GetFileByIdQueryResult, type GetFileByIdSuspenseInfiniteQueryError, type GetFileByIdSuspenseInfiniteQueryResult, type GetFileByIdSuspenseQueryError, type GetFileByIdSuspenseQueryResult, type GetGroundByIdQueryError, type GetGroundByIdQueryResult, type GetGroundByIdSuspenseInfiniteQueryError, type GetGroundByIdSuspenseInfiniteQueryResult, type GetGroundByIdSuspenseQueryError, type GetGroundByIdSuspenseQueryResult, GetGroundsByQuery200AllOf, GetGroundsByQueryParams, type GetGroundsByQueryQueryError, type GetGroundsByQueryQueryResult, type GetGroundsByQuerySuspenseInfiniteQueryError, type GetGroundsByQuerySuspenseInfiniteQueryResult, type GetGroundsByQuerySuspenseQueryError, type GetGroundsByQuerySuspenseQueryResult, GetGroupById200AllOf, type GetGroupByIdQueryError, type GetGroupByIdQueryResult, type GetGroupByIdSuspenseInfiniteQueryError, type GetGroupByIdSuspenseInfiniteQueryResult, type GetGroupByIdSuspenseQueryError, type GetGroupByIdSuspenseQueryResult, GetGroupsByQuery200AllOf, type GetGroupsByQueryQueryError, type GetGroupsByQueryQueryResult, type GetGroupsByQuerySuspenseInfiniteQueryError, type GetGroupsByQuerySuspenseInfiniteQueryResult, type GetGroupsByQuerySuspenseQueryError, type GetGroupsByQuerySuspenseQueryResult, GetMyTenants200AllOf, type GetMyTenantsQueryError, type GetMyTenantsQueryResult, type GetMyTenantsSuspenseInfiniteQueryError, type GetMyTenantsSuspenseInfiniteQueryResult, type GetMyTenantsSuspenseQueryError, type GetMyTenantsSuspenseQueryResult, type GetNewTokenQueryError, type GetNewTokenQueryResult, type GetNewTokenSuspenseInfiniteQueryError, type GetNewTokenSuspenseInfiniteQueryResult, type GetNewTokenSuspenseQueryError, type GetNewTokenSuspenseQueryResult, GetProgramById200AllOf, type GetProgramByIdQueryError, type GetProgramByIdQueryResult, type GetProgramByIdSuspenseInfiniteQueryError, type GetProgramByIdSuspenseInfiniteQueryResult, type GetProgramByIdSuspenseQueryError, type GetProgramByIdSuspenseQueryResult, GetProgramsByQuery200AllOf, type GetProgramsByQueryQueryError, type GetProgramsByQueryQueryResult, type GetProgramsByQuerySuspenseInfiniteQueryError, type GetProgramsByQuerySuspenseInfiniteQueryResult, type GetProgramsByQuerySuspenseQueryError, type GetProgramsByQuerySuspenseQueryResult, GetRole200AllOf, type GetRoleClassificationByIdQueryError, type GetRoleClassificationByIdQueryResult, type GetRoleClassificationByIdSuspenseInfiniteQueryError, type GetRoleClassificationByIdSuspenseInfiniteQueryResult, type GetRoleClassificationByIdSuspenseQueryError, type GetRoleClassificationByIdSuspenseQueryResult, GetRoleClassificationsByQueryParams, type GetRoleClassificationsByQueryQueryError, type GetRoleClassificationsByQueryQueryResult, type GetRoleClassificationsByQuerySuspenseInfiniteQueryError, type GetRoleClassificationsByQuerySuspenseInfiniteQueryResult, type GetRoleClassificationsByQuerySuspenseQueryError, type GetRoleClassificationsByQuerySuspenseQueryResult, type GetRoleQueryError, type GetRoleQueryResult, type GetRoleSuspenseInfiniteQueryError, type GetRoleSuspenseInfiniteQueryResult, type GetRoleSuspenseQueryError, type GetRoleSuspenseQueryResult, GetRolesByQuery200AllOf, GetRolesByQueryParams, type GetRolesByQueryQueryError, type GetRolesByQueryQueryResult, type GetRolesByQuerySuspenseInfiniteQueryError, type GetRolesByQuerySuspenseInfiniteQueryResult, type GetRolesByQuerySuspenseQueryError, type GetRolesByQuerySuspenseQueryResult, GetRoutine200AllOf, type GetRoutineQueryError, type GetRoutineQueryResult, type GetRoutineSuspenseInfiniteQueryError, type GetRoutineSuspenseInfiniteQueryResult, type GetRoutineSuspenseQueryError, type GetRoutineSuspenseQueryResult, GetRoutinesByQuery200AllOf, type GetRoutinesByQueryQueryError, type GetRoutinesByQueryQueryResult, type GetRoutinesByQuerySuspenseInfiniteQueryError, type GetRoutinesByQuerySuspenseInfiniteQueryResult, type GetRoutinesByQuerySuspenseQueryError, type GetRoutinesByQuerySuspenseQueryResult, GetSession200AllOf, type GetSessionQueryError, type GetSessionQueryResult, type GetSessionSuspenseInfiniteQueryError, type GetSessionSuspenseInfiniteQueryResult, type GetSessionSuspenseQueryError, type GetSessionSuspenseQueryResult, GetSessionsByQuery200AllOf, type GetSessionsByQueryQueryError, type GetSessionsByQueryQueryResult, type GetSessionsByQuerySuspenseInfiniteQueryError, type GetSessionsByQuerySuspenseInfiniteQueryResult, type GetSessionsByQuerySuspenseQueryError, type GetSessionsByQuerySuspenseQueryResult, GetSpace200AllOf, type GetSpaceQueryError, type GetSpaceQueryResult, type GetSpaceSuspenseInfiniteQueryError, type GetSpaceSuspenseInfiniteQueryResult, type GetSpaceSuspenseQueryError, type GetSpaceSuspenseQueryResult, GetSpacesByQuery200AllOf, GetSpacesByQueryParams, type GetSpacesByQueryQueryError, type GetSpacesByQueryQueryResult, type GetSpacesByQuerySuspenseInfiniteQueryError, type GetSpacesByQuerySuspenseInfiniteQueryResult, type GetSpacesByQuerySuspenseQueryError, type GetSpacesByQuerySuspenseQueryResult, GetSubject200AllOf, type GetSubjectQueryError, type GetSubjectQueryResult, type GetSubjectSuspenseInfiniteQueryError, type GetSubjectSuspenseInfiniteQueryResult, type GetSubjectSuspenseQueryError, type GetSubjectSuspenseQueryResult, GetSubjectsByQuery200AllOf, type GetSubjectsByQueryQueryError, type GetSubjectsByQueryQueryResult, type GetSubjectsByQuerySuspenseInfiniteQueryError, type GetSubjectsByQuerySuspenseInfiniteQueryResult, type GetSubjectsByQuerySuspenseQueryError, type GetSubjectsByQuerySuspenseQueryResult, GetTenantById200AllOf, type GetTenantByIdQueryError, type GetTenantByIdQueryResult, type GetTenantByIdSuspenseInfiniteQueryError, type GetTenantByIdSuspenseInfiniteQueryResult, type GetTenantByIdSuspenseQueryError, type GetTenantByIdSuspenseQueryResult, GetTenantsByQuery200AllOf, GetTenantsByQueryParams, type GetTenantsByQueryQueryError, type GetTenantsByQueryQueryResult, type GetTenantsByQuerySuspenseInfiniteQueryError, type GetTenantsByQuerySuspenseInfiniteQueryResult, type GetTenantsByQuerySuspenseQueryError, type GetTenantsByQuerySuspenseQueryResult, GetTimeline200AllOf, type GetTimelineQueryError, type GetTimelineQueryResult, type GetTimelineSuspenseInfiniteQueryError, type GetTimelineSuspenseInfiniteQueryResult, type GetTimelineSuspenseQueryError, type GetTimelineSuspenseQueryResult, GetTimelinesByQuery200AllOf, type GetTimelinesByQueryQueryError, type GetTimelinesByQueryQueryResult, type GetTimelinesByQuerySuspenseInfiniteQueryError, type GetTimelinesByQuerySuspenseInfiniteQueryResult, type GetTimelinesByQuerySuspenseQueryError, type GetTimelinesByQuerySuspenseQueryResult, GetUser200AllOf, type GetUserQueryError, type GetUserQueryResult, type GetUserSuspenseInfiniteQueryError, type GetUserSuspenseInfiniteQueryResult, type GetUserSuspenseQueryError, type GetUserSuspenseQueryResult, GetUsersByQuery200AllOf, GetUsersByQueryParams, type GetUsersByQueryQueryError, type GetUsersByQueryQueryResult, type GetUsersByQuerySuspenseInfiniteQueryError, type GetUsersByQuerySuspenseInfiniteQueryResult, type GetUsersByQuerySuspenseQueryError, type GetUsersByQuerySuspenseQueryResult, GroupDto, Login200AllOf, type LoginMutationBody, type LoginMutationError, type LoginMutationResult, LoginPayloadDto, Logout200AllOf, type LogoutMutationError, type LogoutMutationResult, RefreshToken200AllOf, type RefreshTokenMutationError, type RefreshTokenMutationResult, RemoveExercise200AllOf, type RemoveExerciseMutationError, type RemoveExerciseMutationResult, RemoveFileById200AllOf, type RemoveFileByIdMutationError, type RemoveFileByIdMutationResult, type RemoveGroundByIdMutationError, type RemoveGroundByIdMutationResult, RemoveGroups200AllOf, type RemoveGroupsMutationError, type RemoveGroupsMutationResult, RemoveProgramById200AllOf, type RemoveProgramByIdMutationError, type RemoveProgramByIdMutationResult, RemoveRole200AllOf, type RemoveRoleClassificationByIdMutationError, type RemoveRoleClassificationByIdMutationResult, type RemoveRoleMutationError, type RemoveRoleMutationResult, RemoveRoutine200AllOf, type RemoveRoutineMutationError, type RemoveRoutineMutationResult, RemoveSession200AllOf, type RemoveSessionMutationError, type RemoveSessionMutationResult, RemoveSessions200AllOf, type RemoveSessionsMutationBody, type RemoveSessionsMutationError, type RemoveSessionsMutationResult, RemoveSpace200AllOf, type RemoveSpaceMutationError, type RemoveSpaceMutationResult, RemoveSubject200AllOf, type RemoveSubjectMutationError, type RemoveSubjectMutationResult, RemoveSubjects200AllOf, type RemoveSubjectsMutationBody, type RemoveSubjectsMutationError, type RemoveSubjectsMutationResult, RemoveTenantById200AllOf, type RemoveTenantByIdMutationError, type RemoveTenantByIdMutationResult, RemoveTimeline200AllOf, type RemoveTimelineMutationError, type RemoveTimelineMutationResult, RemoveTimelines200AllOf, type RemoveTimelinesMutationBody, type RemoveTimelinesMutationError, type RemoveTimelinesMutationResult, RemoveUser200AllOf, type RemoveUserMutationError, type RemoveUserMutationResult, RemoveUsers200AllOf, type RemoveUsersMutationBody, type RemoveUsersMutationError, type RemoveUsersMutationResult, SignUpPayloadDto, SignUpUser201AllOf, type SignUpUserMutationBody, type SignUpUserMutationError, type SignUpUserMutationResult, TokenDto, UpdateCategoryById200AllOf, type UpdateCategoryByIdMutationBody, type UpdateCategoryByIdMutationError, type UpdateCategoryByIdMutationResult, UpdateCategoryDto, UpdateExercise200AllOf, UpdateExerciseDto, type UpdateExerciseMutationBody, type UpdateExerciseMutationError, type UpdateExerciseMutationResult, UpdateFileById200AllOf, UpdateFileByIdBody, type UpdateFileByIdMutationBody, type UpdateFileByIdMutationError, type UpdateFileByIdMutationResult, type UpdateGroundByIdMutationBody, type UpdateGroundByIdMutationError, type UpdateGroundByIdMutationResult, UpdateGroundDto, UpdateGroupById200AllOf, type UpdateGroupByIdMutationBody, type UpdateGroupByIdMutationError, type UpdateGroupByIdMutationResult, UpdateProgramById200AllOf, type UpdateProgramByIdMutationBody, type UpdateProgramByIdMutationError, type UpdateProgramByIdMutationResult, UpdateRole200AllOf, type UpdateRoleClassificationByIdMutationBody, type UpdateRoleClassificationByIdMutationError, type UpdateRoleClassificationByIdMutationResult, UpdateRoleDto, type UpdateRoleMutationBody, type UpdateRoleMutationError, type UpdateRoleMutationResult, UpdateRoutine200AllOf, type UpdateRoutineMutationBody, type UpdateRoutineMutationError, type UpdateRoutineMutationResult, UpdateSession200AllOf, type UpdateSessionMutationBody, type UpdateSessionMutationError, type UpdateSessionMutationResult, UpdateSpace200AllOf, UpdateSpaceDto, type UpdateSpaceMutationBody, type UpdateSpaceMutationError, type UpdateSpaceMutationResult, UpdateSubject200AllOf, type UpdateSubjectMutationBody, type UpdateSubjectMutationError, type UpdateSubjectMutationResult, UpdateTenantById200AllOf, type UpdateTenantByIdMutationBody, type UpdateTenantByIdMutationError, type UpdateTenantByIdMutationResult, UpdateTenantDto, UpdateTimeline200AllOf, type UpdateTimelineMutationBody, type UpdateTimelineMutationError, type UpdateTimelineMutationResult, UpdateUser200AllOf, UpdateUserDto, type UpdateUserMutationBody, type UpdateUserMutationError, type UpdateUserMutationResult, VerifyToken200AllOf, type VerifyTokenQueryError, type VerifyTokenQueryResult, type VerifyTokenSuspenseInfiniteQueryError, type VerifyTokenSuspenseInfiniteQueryResult, type VerifyTokenSuspenseQueryError, type VerifyTokenSuspenseQueryResult, createCategory, createExercise, createFile, createGround, createGroup, createProgram, createRole, createRoleClassification, createRoutine, createSession, createSpace, createSubject, createTenant, createTimeline, createUser, customInstance, deleteCategoryById, deleteExercise, deleteGroundById, deleteGroup, deleteProgramById, deleteRole, deleteRoleClassificationById, deleteRoutine, deleteSession, deleteSpace, deleteSubject, deleteTenant, deleteTimeline, deleteUser, getAppBuilder, getCategoriesByQuery, getCategoryById, getCreateCategoryMutationOptions, getCreateExerciseMutationOptions, getCreateFileMutationOptions, getCreateGroundMutationOptions, getCreateGroupMutationOptions, getCreateProgramMutationOptions, getCreateRoleClassificationMutationOptions, getCreateRoleMutationOptions, getCreateRoutineMutationOptions, getCreateSessionMutationOptions, getCreateSpaceMutationOptions, getCreateSubjectMutationOptions, getCreateTenantMutationOptions, getCreateTimelineMutationOptions, getCreateUserMutationOptions, getCurrentSpace, getDeleteCategoryByIdMutationOptions, getDeleteExerciseMutationOptions, getDeleteGroundByIdMutationOptions, getDeleteGroupMutationOptions, getDeleteProgramByIdMutationOptions, getDeleteRoleClassificationByIdMutationOptions, getDeleteRoleMutationOptions, getDeleteRoutineMutationOptions, getDeleteSessionMutationOptions, getDeleteSpaceMutationOptions, getDeleteSubjectMutationOptions, getDeleteTenantMutationOptions, getDeleteTimelineMutationOptions, getDeleteUserMutationOptions, getExercise, getExercisesByQuery, getFileById, getGetAppBuilderQueryKey, getGetAppBuilderQueryOptions, getGetAppBuilderSuspenseInfiniteQueryOptions, getGetAppBuilderSuspenseQueryOptions, getGetCategoriesByQueryQueryKey, getGetCategoriesByQueryQueryOptions, getGetCategoriesByQuerySuspenseInfiniteQueryOptions, getGetCategoriesByQuerySuspenseQueryOptions, getGetCategoryByIdQueryKey, getGetCategoryByIdQueryOptions, getGetCategoryByIdSuspenseInfiniteQueryOptions, getGetCategoryByIdSuspenseQueryOptions, getGetCurrentSpaceQueryKey, getGetCurrentSpaceQueryOptions, getGetCurrentSpaceSuspenseInfiniteQueryOptions, getGetCurrentSpaceSuspenseQueryOptions, getGetExerciseQueryKey, getGetExerciseQueryOptions, getGetExerciseSuspenseInfiniteQueryOptions, getGetExerciseSuspenseQueryOptions, getGetExercisesByQueryQueryKey, getGetExercisesByQueryQueryOptions, getGetExercisesByQuerySuspenseInfiniteQueryOptions, getGetExercisesByQuerySuspenseQueryOptions, getGetFileByIdQueryKey, getGetFileByIdQueryOptions, getGetFileByIdSuspenseInfiniteQueryOptions, getGetFileByIdSuspenseQueryOptions, getGetGroundByIdQueryKey, getGetGroundByIdQueryOptions, getGetGroundByIdSuspenseInfiniteQueryOptions, getGetGroundByIdSuspenseQueryOptions, getGetGroundsByQueryQueryKey, getGetGroundsByQueryQueryOptions, getGetGroundsByQuerySuspenseInfiniteQueryOptions, getGetGroundsByQuerySuspenseQueryOptions, getGetGroupByIdQueryKey, getGetGroupByIdQueryOptions, getGetGroupByIdSuspenseInfiniteQueryOptions, getGetGroupByIdSuspenseQueryOptions, getGetGroupsByQueryQueryKey, getGetGroupsByQueryQueryOptions, getGetGroupsByQuerySuspenseInfiniteQueryOptions, getGetGroupsByQuerySuspenseQueryOptions, getGetMyTenantsQueryKey, getGetMyTenantsQueryOptions, getGetMyTenantsSuspenseInfiniteQueryOptions, getGetMyTenantsSuspenseQueryOptions, getGetNewTokenQueryKey, getGetNewTokenQueryOptions, getGetNewTokenSuspenseInfiniteQueryOptions, getGetNewTokenSuspenseQueryOptions, getGetProgramByIdQueryKey, getGetProgramByIdQueryOptions, getGetProgramByIdSuspenseInfiniteQueryOptions, getGetProgramByIdSuspenseQueryOptions, getGetProgramsByQueryQueryKey, getGetProgramsByQueryQueryOptions, getGetProgramsByQuerySuspenseInfiniteQueryOptions, getGetProgramsByQuerySuspenseQueryOptions, getGetRoleClassificationByIdQueryKey, getGetRoleClassificationByIdQueryOptions, getGetRoleClassificationByIdSuspenseInfiniteQueryOptions, getGetRoleClassificationByIdSuspenseQueryOptions, getGetRoleClassificationsByQueryQueryKey, getGetRoleClassificationsByQueryQueryOptions, getGetRoleClassificationsByQuerySuspenseInfiniteQueryOptions, getGetRoleClassificationsByQuerySuspenseQueryOptions, getGetRoleQueryKey, getGetRoleQueryOptions, getGetRoleSuspenseInfiniteQueryOptions, getGetRoleSuspenseQueryOptions, getGetRolesByQueryQueryKey, getGetRolesByQueryQueryOptions, getGetRolesByQuerySuspenseInfiniteQueryOptions, getGetRolesByQuerySuspenseQueryOptions, getGetRoutineQueryKey, getGetRoutineQueryOptions, getGetRoutineSuspenseInfiniteQueryOptions, getGetRoutineSuspenseQueryOptions, getGetRoutinesByQueryQueryKey, getGetRoutinesByQueryQueryOptions, getGetRoutinesByQuerySuspenseInfiniteQueryOptions, getGetRoutinesByQuerySuspenseQueryOptions, getGetSessionQueryKey, getGetSessionQueryOptions, getGetSessionSuspenseInfiniteQueryOptions, getGetSessionSuspenseQueryOptions, getGetSessionsByQueryQueryKey, getGetSessionsByQueryQueryOptions, getGetSessionsByQuerySuspenseInfiniteQueryOptions, getGetSessionsByQuerySuspenseQueryOptions, getGetSpaceQueryKey, getGetSpaceQueryOptions, getGetSpaceSuspenseInfiniteQueryOptions, getGetSpaceSuspenseQueryOptions, getGetSpacesByQueryQueryKey, getGetSpacesByQueryQueryOptions, getGetSpacesByQuerySuspenseInfiniteQueryOptions, getGetSpacesByQuerySuspenseQueryOptions, getGetSubjectQueryKey, getGetSubjectQueryOptions, getGetSubjectSuspenseInfiniteQueryOptions, getGetSubjectSuspenseQueryOptions, getGetSubjectsByQueryQueryKey, getGetSubjectsByQueryQueryOptions, getGetSubjectsByQuerySuspenseInfiniteQueryOptions, getGetSubjectsByQuerySuspenseQueryOptions, getGetTenantByIdQueryKey, getGetTenantByIdQueryOptions, getGetTenantByIdSuspenseInfiniteQueryOptions, getGetTenantByIdSuspenseQueryOptions, getGetTenantsByQueryQueryKey, getGetTenantsByQueryQueryOptions, getGetTenantsByQuerySuspenseInfiniteQueryOptions, getGetTenantsByQuerySuspenseQueryOptions, getGetTimelineQueryKey, getGetTimelineQueryOptions, getGetTimelineSuspenseInfiniteQueryOptions, getGetTimelineSuspenseQueryOptions, getGetTimelinesByQueryQueryKey, getGetTimelinesByQueryQueryOptions, getGetTimelinesByQuerySuspenseInfiniteQueryOptions, getGetTimelinesByQuerySuspenseQueryOptions, getGetUserQueryKey, getGetUserQueryOptions, getGetUserSuspenseInfiniteQueryOptions, getGetUserSuspenseQueryOptions, getGetUsersByQueryQueryKey, getGetUsersByQueryQueryOptions, getGetUsersByQuerySuspenseInfiniteQueryOptions, getGetUsersByQuerySuspenseQueryOptions, getGroundById, getGroundsByQuery, getGroupById, getGroupsByQuery, getLoginMutationOptions, getLogoutMutationOptions, getMyTenants, getNewToken, getProgramById, getProgramsByQuery, getRefreshTokenMutationOptions, getRemoveExerciseMutationOptions, getRemoveFileByIdMutationOptions, getRemoveGroundByIdMutationOptions, getRemoveGroupsMutationOptions, getRemoveProgramByIdMutationOptions, getRemoveRoleClassificationByIdMutationOptions, getRemoveRoleMutationOptions, getRemoveRoutineMutationOptions, getRemoveSessionMutationOptions, getRemoveSessionsMutationOptions, getRemoveSpaceMutationOptions, getRemoveSubjectMutationOptions, getRemoveSubjectsMutationOptions, getRemoveTenantByIdMutationOptions, getRemoveTimelineMutationOptions, getRemoveTimelinesMutationOptions, getRemoveUserMutationOptions, getRemoveUsersMutationOptions, getRole, getRoleClassificationById, getRoleClassificationsByQuery, getRolesByQuery, getRoutine, getRoutinesByQuery, getSession, getSessionsByQuery, getSignUpUserMutationOptions, getSpace, getSpacesByQuery, getSubject, getSubjectsByQuery, getTenantById, getTenantsByQuery, getTimeline, getTimelinesByQuery, getUpdateCategoryByIdMutationOptions, getUpdateExerciseMutationOptions, getUpdateFileByIdMutationOptions, getUpdateGroundByIdMutationOptions, getUpdateGroupByIdMutationOptions, getUpdateProgramByIdMutationOptions, getUpdateRoleClassificationByIdMutationOptions, getUpdateRoleMutationOptions, getUpdateRoutineMutationOptions, getUpdateSessionMutationOptions, getUpdateSpaceMutationOptions, getUpdateSubjectMutationOptions, getUpdateTenantByIdMutationOptions, getUpdateTimelineMutationOptions, getUpdateUserMutationOptions, getUser, getUsersByQuery, getVerifyTokenQueryKey, getVerifyTokenQueryOptions, getVerifyTokenSuspenseInfiniteQueryOptions, getVerifyTokenSuspenseQueryOptions, login, logout, refreshToken, removeExercise, removeFileById, removeGroundById, removeGroups, removeProgramById, removeRole, removeRoleClassificationById, removeRoutine, removeSession, removeSessions, removeSpace, removeSubject, removeSubjects, removeTenantById, removeTimeline, removeTimelines, removeUser, removeUsers, signUpUser, updateCategoryById, updateExercise, updateFileById, updateGroundById, updateGroupById, updateProgramById, updateRole, updateRoleClassificationById, updateRoutine, updateSession, updateSpace, updateSubject, updateTenantById, updateTimeline, updateUser, useCreateCategory, useCreateExercise, useCreateFile, useCreateGround, useCreateGroup, useCreateProgram, useCreateRole, useCreateRoleClassification, useCreateRoutine, useCreateSession, useCreateSpace, useCreateSubject, useCreateTenant, useCreateTimeline, useCreateUser, useDeleteCategoryById, useDeleteExercise, useDeleteGroundById, useDeleteGroup, useDeleteProgramById, useDeleteRole, useDeleteRoleClassificationById, useDeleteRoutine, useDeleteSession, useDeleteSpace, useDeleteSubject, useDeleteTenant, useDeleteTimeline, useDeleteUser, useGetAppBuilder, useGetAppBuilderSuspense, useGetAppBuilderSuspenseInfinite, useGetCategoriesByQuery, useGetCategoriesByQuerySuspense, useGetCategoriesByQuerySuspenseInfinite, useGetCategoryById, useGetCategoryByIdSuspense, useGetCategoryByIdSuspenseInfinite, useGetCurrentSpace, useGetCurrentSpaceSuspense, useGetCurrentSpaceSuspenseInfinite, useGetExercise, useGetExerciseSuspense, useGetExerciseSuspenseInfinite, useGetExercisesByQuery, useGetExercisesByQuerySuspense, useGetExercisesByQuerySuspenseInfinite, useGetFileById, useGetFileByIdSuspense, useGetFileByIdSuspenseInfinite, useGetGroundById, useGetGroundByIdSuspense, useGetGroundByIdSuspenseInfinite, useGetGroundsByQuery, useGetGroundsByQuerySuspense, useGetGroundsByQuerySuspenseInfinite, useGetGroupById, useGetGroupByIdSuspense, useGetGroupByIdSuspenseInfinite, useGetGroupsByQuery, useGetGroupsByQuerySuspense, useGetGroupsByQuerySuspenseInfinite, useGetMyTenants, useGetMyTenantsSuspense, useGetMyTenantsSuspenseInfinite, useGetNewToken, useGetNewTokenSuspense, useGetNewTokenSuspenseInfinite, useGetProgramById, useGetProgramByIdSuspense, useGetProgramByIdSuspenseInfinite, useGetProgramsByQuery, useGetProgramsByQuerySuspense, useGetProgramsByQuerySuspenseInfinite, useGetRole, useGetRoleClassificationById, useGetRoleClassificationByIdSuspense, useGetRoleClassificationByIdSuspenseInfinite, useGetRoleClassificationsByQuery, useGetRoleClassificationsByQuerySuspense, useGetRoleClassificationsByQuerySuspenseInfinite, useGetRoleSuspense, useGetRoleSuspenseInfinite, useGetRolesByQuery, useGetRolesByQuerySuspense, useGetRolesByQuerySuspenseInfinite, useGetRoutine, useGetRoutineSuspense, useGetRoutineSuspenseInfinite, useGetRoutinesByQuery, useGetRoutinesByQuerySuspense, useGetRoutinesByQuerySuspenseInfinite, useGetSession, useGetSessionSuspense, useGetSessionSuspenseInfinite, useGetSessionsByQuery, useGetSessionsByQuerySuspense, useGetSessionsByQuerySuspenseInfinite, useGetSpace, useGetSpaceSuspense, useGetSpaceSuspenseInfinite, useGetSpacesByQuery, useGetSpacesByQuerySuspense, useGetSpacesByQuerySuspenseInfinite, useGetSubject, useGetSubjectSuspense, useGetSubjectSuspenseInfinite, useGetSubjectsByQuery, useGetSubjectsByQuerySuspense, useGetSubjectsByQuerySuspenseInfinite, useGetTenantById, useGetTenantByIdSuspense, useGetTenantByIdSuspenseInfinite, useGetTenantsByQuery, useGetTenantsByQuerySuspense, useGetTenantsByQuerySuspenseInfinite, useGetTimeline, useGetTimelineSuspense, useGetTimelineSuspenseInfinite, useGetTimelinesByQuery, useGetTimelinesByQuerySuspense, useGetTimelinesByQuerySuspenseInfinite, useGetUser, useGetUserSuspense, useGetUserSuspenseInfinite, useGetUsersByQuery, useGetUsersByQuerySuspense, useGetUsersByQuerySuspenseInfinite, useLogin, useLogout, useRefreshToken, useRemoveExercise, useRemoveFileById, useRemoveGroundById, useRemoveGroups, useRemoveProgramById, useRemoveRole, useRemoveRoleClassificationById, useRemoveRoutine, useRemoveSession, useRemoveSessions, useRemoveSpace, useRemoveSubject, useRemoveSubjects, useRemoveTenantById, useRemoveTimeline, useRemoveTimelines, useRemoveUser, useRemoveUsers, useSignUpUser, useUpdateCategoryById, useUpdateExercise, useUpdateFileById, useUpdateGroundById, useUpdateGroupById, useUpdateProgramById, useUpdateRole, useUpdateRoleClassificationById, useUpdateRoutine, useUpdateSession, useUpdateSpace, useUpdateSubject, useUpdateTenantById, useUpdateTimeline, useUpdateUser, useVerifyToken, useVerifyTokenSuspense, useVerifyTokenSuspenseInfinite, verifyToken };
