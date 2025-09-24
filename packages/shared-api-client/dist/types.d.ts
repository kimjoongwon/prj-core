type AbilityActions = (typeof AbilityActions)[keyof typeof AbilityActions];
declare const AbilityActions: {
    readonly CREATE: "CREATE";
    readonly READ: "READ";
    readonly UPDATE: "UPDATE";
    readonly DELETE: "DELETE";
    readonly ACCESS: "ACCESS";
};

type AbilityTypes = (typeof AbilityTypes)[keyof typeof AbilityTypes];
declare const AbilityTypes: {
    readonly CAN: "CAN";
    readonly CAN_NOT: "CAN_NOT";
};

type Roles = (typeof Roles)[keyof typeof Roles];
declare const Roles: {
    readonly USER: "USER";
    readonly SUPER_ADMIN: "SUPER_ADMIN";
    readonly ADMIN: "ADMIN";
};

interface RoleDto {
    id: string;
    seq: number;
    createdAt: string;
    updatedAt: string;
    removedAt: string | null;
    name: Roles;
}

type GroundDtoSpace = SpaceDto | null;

interface GroundDto {
    id: string;
    seq: number;
    createdAt: string;
    updatedAt: string;
    removedAt: string | null;
    name: string;
    label?: string | null;
    address: string;
    phone: string;
    email: string;
    businessNo: string;
    logoImageFileId?: string | null;
    imageFileId?: string | null;
    spaceId: string;
    space?: GroundDtoSpace;
}

interface SpaceDto {
    id: string;
    seq: number;
    createdAt: string;
    updatedAt: string;
    removedAt: string | null;
    ground?: GroundDto;
}

interface UserDto {
    id: string;
    seq: number;
    createdAt: string;
    updatedAt: string;
    removedAt: string | null;
    spaceId: string;
    email: string;
    name: string;
    phone: string;
    password: string;
}

interface TenantDto {
    id: string;
    seq: number;
    createdAt: string;
    updatedAt: string;
    removedAt: string | null;
    main: boolean;
    roleId: string;
    userId: string;
    spaceId: string;
    user?: UserDto;
    space?: SpaceDto;
    role?: RoleDto;
}

interface AbilityDto {
    id: string;
    seq: number;
    createdAt: string;
    updatedAt: string;
    removedAt: string | null;
    tenantId: string;
    actionId: string;
    conditions?: string | null;
    subjectId: string;
    type: AbilityTypes;
    roleId: string;
    description?: string | null;
    tenant?: TenantDto;
}

interface ActionDto {
    id: string;
    seq: number;
    createdAt: string;
    updatedAt: string;
    removedAt: string | null;
    tenantId: string;
    name: AbilityActions;
    conditions?: string;
    tenant?: TenantDto;
}

interface RouteDto {
    name: string;
    relativePath: string;
    fullPath: string;
    icon: string | null;
    children: RouteDto[] | null;
}

interface AppBuilderDto {
    routes: RouteDto[];
}

interface Boolean {
    [key: string]: unknown;
}

type CategoryTypes = (typeof CategoryTypes)[keyof typeof CategoryTypes];
declare const CategoryTypes: {
    readonly Role: "Role";
    readonly Space: "Space";
    readonly File: "File";
    readonly User: "User";
};

interface CategoryDto {
    id: string;
    seq: number;
    createdAt: string;
    updatedAt: string;
    removedAt: string | null;
    tenantId: string;
    name: string;
    type: CategoryTypes;
    parentId: string | null;
    parent?: CategoryDto;
    children?: CategoryDto;
}

type CreateAbility200AllOf = {
    httpStatus?: number;
    message?: string;
    data?: AbilityDto;
};

interface CreateAbilityDto {
    tenantId: string;
    actionId: string;
    conditions?: string | null;
    subjectId: string;
    type: AbilityTypes;
    roleId: string;
    description?: string | null;
}

type CreateAction200AllOf = {
    httpStatus?: number;
    message?: string;
    data?: ActionDto;
};

interface CreateActionDto {
    tenantId: string;
    name: AbilityActions;
    conditions?: string;
}

type CreateCategory200AllOf = {
    httpStatus?: number;
    message?: string;
    data?: CategoryDto;
};

interface CreateCategoryDto {
    tenantId: string;
    name: string;
    type: CategoryTypes;
    parentId: string | null;
}

interface CreateTaskDto {
    tenantId: string;
}

interface ExerciseDto {
    id: string;
    seq: number;
    createdAt: string;
    updatedAt: string;
    removedAt: string | null;
    name: string;
    description: string;
    imageFileId?: string;
    videoFileId?: string;
    taskId: string;
    duration: number;
    count: number;
    task?: CreateTaskDto;
}

type CreateExercise200AllOf = {
    httpStatus?: number;
    message?: string;
    data?: ExerciseDto;
};

interface CreateExerciseDto {
    name: string;
    description: string;
    imageFileId?: string;
    videoFileId?: string;
    duration: number;
    count: number;
    tenantId: string;
}

interface FileClassificationDto {
    id: string;
    seq: number;
    createdAt: string;
    updatedAt: string;
    removedAt: string | null;
    fileId: string;
    categoryId: string;
    category?: CategoryDto;
    file?: FileDto;
}

interface FileDto {
    id: string;
    seq: number;
    createdAt: string;
    updatedAt: string;
    removedAt: string | null;
    parentId: string;
    tenantId: string;
    name: string;
    size: number;
    mimeType: string;
    url: string;
    tenant?: TenantDto;
    classification?: FileClassificationDto;
}

type CreateFile201AllOf = {
    httpStatus?: number;
    message?: string;
    data?: FileDto;
};

interface CreateFileDto {
    parentId: string;
    tenantId: string;
    name: string;
    size: number;
    mimeType: string;
    url: string;
}

interface CreateGroundDto {
    name: string;
    label?: string | null;
    address: string;
    phone: string;
    email: string;
    businessNo: string;
    logoImageFileId?: string | null;
    imageFileId?: string | null;
    spaceId: string;
}

type GroupTypes = (typeof GroupTypes)[keyof typeof GroupTypes];
declare const GroupTypes: {
    readonly Role: "Role";
    readonly Space: "Space";
    readonly File: "File";
    readonly User: "User";
};

interface CreateGroupDto {
    name: string;
    label?: string | null;
    type: GroupTypes;
    tenantId: string;
}

interface ProgramDto {
    id: string;
    seq: number;
    createdAt: string;
    updatedAt: string;
    removedAt: string | null;
    instructorId: string;
    capacity: number;
    routineId: string;
    sessionId: string;
    tenancyId: string;
}

type CreateProgram200AllOf = {
    httpStatus?: number;
    message?: string;
    data?: ProgramDto;
};

interface CreateProgramDto {
    instructorId: string;
    capacity: number;
    routineId: string;
    sessionId: string;
    tenancyId: string;
}

type CreateRole200AllOf = {
    httpStatus?: number;
    message?: string;
    data?: RoleDto;
};

interface CreateRoleDto {
    name: Roles;
    serviceId: string;
    categoryId: string;
}

interface RoutineDto {
    id: string;
    seq: number;
    createdAt: string;
    updatedAt: string;
    removedAt: string | null;
    label: string;
    name: string;
}

type CreateRoutine200AllOf = {
    httpStatus?: number;
    message?: string;
    data?: RoutineDto;
};

interface CreateRoutineDto {
    label: string;
    name: string;
}

type RecurringDayOfWeek = (typeof RecurringDayOfWeek)[keyof typeof RecurringDayOfWeek];
declare const RecurringDayOfWeek: {
    readonly MONDAY: "MONDAY";
    readonly TUESDAY: "TUESDAY";
    readonly WEDNESDAY: "WEDNESDAY";
    readonly THURSDAY: "THURSDAY";
    readonly FRIDAY: "FRIDAY";
    readonly SATURDAY: "SATURDAY";
    readonly SUNDAY: "SUNDAY";
};

type SessionDtoRecurringDayOfWeek = RecurringDayOfWeek | null;

type RepeatCycleTypes = (typeof RepeatCycleTypes)[keyof typeof RepeatCycleTypes];
declare const RepeatCycleTypes: {
    readonly WEEKLY: "WEEKLY";
    readonly MONTHLY: "MONTHLY";
};

type SessionDtoRepeatCycleType = RepeatCycleTypes | null;

type SessionTypes = (typeof SessionTypes)[keyof typeof SessionTypes];
declare const SessionTypes: {
    readonly ONE_TIME: "ONE_TIME";
    readonly ONE_TIME_RANGE: "ONE_TIME_RANGE";
    readonly RECURRING: "RECURRING";
};

interface SessionDto {
    id: string;
    seq: number;
    createdAt: string;
    updatedAt: string;
    removedAt: string | null;
    name: string;
    label: string;
    type: SessionTypes;
    startDateTime?: string;
    endDateTime?: string;
    timelineId: string;
    repeatCycleType?: SessionDtoRepeatCycleType;
    recurringDayOfWeek?: SessionDtoRecurringDayOfWeek;
    recurringMonth?: number | null;
}

type CreateSession200AllOf = {
    httpStatus?: number;
    message?: string;
    data?: SessionDto;
};

type CreateSessionDtoRecurringDayOfWeek = RecurringDayOfWeek | null;

type CreateSessionDtoRepeatCycleType = RepeatCycleTypes | null;

interface CreateSessionDto {
    name: string;
    label: string;
    startDateTime?: string;
    endDateTime?: string;
    timelineId?: string | null;
    repeatCycleType?: CreateSessionDtoRepeatCycleType;
    recurringDayOfWeek?: CreateSessionDtoRecurringDayOfWeek;
    recurringMonth?: number | null;
    type: SessionTypes;
}

type CreateSpace200AllOf = {
    httpStatus?: number;
    message?: string;
    data?: SpaceDto;
};

interface CreateSpaceDto {
    [key: string]: unknown;
}

interface SubjectDto {
    id: string;
    seq: number;
    createdAt: string;
    updatedAt: string;
    removedAt: string | null;
    tenantId: string;
    name: string;
}

type CreateSubject200AllOf = {
    httpStatus?: number;
    message?: string;
    data?: SubjectDto;
};

interface CreateSubjectDto {
    tenantId: string;
    name: string;
}

type CreateTenant200AllOf = {
    httpStatus?: number;
    message?: string;
    data?: TenantDto;
};

interface CreateTenantDto {
    main: boolean;
    roleId: string;
    userId: string;
    spaceId: string;
}

interface TimelineDto {
    id: string;
    seq: number;
    createdAt: string;
    updatedAt: string;
    removedAt: string | null;
    tenantId: string;
    tenant: TenantDto;
}

type CreateTimeline200AllOf = {
    httpStatus?: number;
    message?: string;
    data?: TimelineDto;
};

interface CreateTimelineDto {
    tenantId: string;
}

type CreateUser200AllOf = {
    httpStatus?: number;
    message?: string;
    data?: UserDto;
};

interface CreateUserDto {
    spaceId: string;
    email: string;
    name: string;
    phone: string;
    password: string;
}

type DeleteAbility200AllOf = {
    httpStatus?: number;
    message?: string;
    data?: AbilityDto;
};

type DeleteAction200AllOf = {
    httpStatus?: number;
    message?: string;
    data?: ActionDto;
};

type DeleteCategoryById200AllOf = {
    httpStatus?: number;
    message?: string;
    data?: CategoryDto;
};

type DeleteExercise200AllOf = {
    httpStatus?: number;
    message?: string;
    data?: ExerciseDto;
};

interface Number {
    [key: string]: unknown;
}

type DeleteGroup200AllOf = {
    httpStatus?: number;
    message?: string;
    data?: Number;
};

type DeleteProgramById200AllOf = {
    httpStatus?: number;
    message?: string;
    data?: ProgramDto;
};

type DeleteRole200AllOf = {
    httpStatus?: number;
    message?: string;
    data?: RoleDto;
};

type DeleteRoutine200AllOf = {
    httpStatus?: number;
    message?: string;
    data?: RoutineDto;
};

type DeleteSession200AllOf = {
    httpStatus?: number;
    message?: string;
    data?: SessionDto;
};

type DeleteSpace200AllOf = {
    httpStatus?: number;
    message?: string;
    data?: SpaceDto;
};

type DeleteSubject200AllOf = {
    httpStatus?: number;
    message?: string;
    data?: SubjectDto;
};

type DeleteTenant200AllOf = {
    httpStatus?: number;
    message?: string;
    data?: TenantDto;
};

type DeleteTimeline200AllOf = {
    httpStatus?: number;
    message?: string;
    data?: TimelineDto;
};

type DeleteUser200AllOf = {
    httpStatus?: number;
    message?: string;
    data?: UserDto;
};

interface Function {
    [key: string]: unknown;
}

type GetAbilitiesByQuery200AllOfMeta = {
    skip?: number;
    take?: number;
    itemCount?: number;
    pageCount?: number;
    hasNextPage?: boolean;
    hasPreviousPage?: boolean;
};

type GetAbilitiesByQuery200AllOf = {
    httpStatus?: number;
    message?: string;
    data?: AbilityDto[];
    meta?: GetAbilitiesByQuery200AllOfMeta;
};

type GetAbilitiesByQueryParams = {
    skip?: number;
    take?: number;
};

type GetAbility200AllOf = {
    httpStatus?: number;
    message?: string;
    data?: AbilityDto;
};

type GetAction200AllOf = {
    httpStatus?: number;
    message?: string;
    data?: ActionDto;
};

type GetActionsByQuery200AllOfMeta = {
    skip?: number;
    take?: number;
    itemCount?: number;
    pageCount?: number;
    hasNextPage?: boolean;
    hasPreviousPage?: boolean;
};

type GetActionsByQuery200AllOf = {
    httpStatus?: number;
    message?: string;
    data?: ActionDto[];
    meta?: GetActionsByQuery200AllOfMeta;
};

type GetActionsByQueryParams = {
    skip?: number;
    take?: number;
};

type GetAppBuilder200AllOf = {
    httpStatus?: number;
    message?: string;
    data?: AppBuilderDto;
};

type GetCategoriesByQuery200AllOfMeta = {
    skip?: number;
    take?: number;
    itemCount?: number;
    pageCount?: number;
    hasNextPage?: boolean;
    hasPreviousPage?: boolean;
};

type GetCategoriesByQuery200AllOf = {
    httpStatus?: number;
    message?: string;
    data?: CategoryDto[];
    meta?: GetCategoriesByQuery200AllOfMeta;
};

type SortOrder = (typeof SortOrder)[keyof typeof SortOrder];
declare const SortOrder: {
    readonly asc: "asc";
    readonly desc: "desc";
};

type GetCategoriesByQueryParams = {
    skip?: number;
    take?: number;
    name?: string;
    type?: CategoryTypes;
    parentId?: string;
    tenantId?: string;
    serviceId?: string;
    nameSortOrder?: SortOrder;
};

type GetCategoryById200AllOf = {
    httpStatus?: number;
    message?: string;
    data?: CategoryDto;
};

type GetCurrentSpace200AllOf = {
    httpStatus?: number;
    message?: string;
    data?: SpaceDto;
};

type GetExercise200AllOf = {
    httpStatus?: number;
    message?: string;
    data?: ExerciseDto;
};

type GetExercisesByQuery200AllOfMeta = {
    skip?: number;
    take?: number;
    itemCount?: number;
    pageCount?: number;
    hasNextPage?: boolean;
    hasPreviousPage?: boolean;
};

type GetExercisesByQuery200AllOf = {
    httpStatus?: number;
    message?: string;
    data?: ExerciseDto[];
    meta?: GetExercisesByQuery200AllOfMeta;
};

type GetExercisesByQueryParams = {
    skip?: number;
    take?: number;
};

type GetFileById200AllOf = {
    httpStatus?: number;
    message?: string;
    data?: FileDto;
};

type GetGroundsByQuery200AllOf = {
    httpStatus?: number;
    message?: string;
    data?: GroundDto;
};

type GetGroundsByQueryParams = {
    skip?: number;
    take?: number;
};

interface GroupDto {
    id: string;
    seq: number;
    createdAt: string;
    updatedAt: string;
    removedAt: string | null;
    name: string;
    label?: string | null;
    type: GroupTypes;
    tenantId: string;
    tenant?: TenantDto;
}

type GetGroupById200AllOf = {
    httpStatus?: number;
    message?: string;
    data?: GroupDto;
};

type GetGroupsByQuery200AllOfMeta = {
    skip?: number;
    take?: number;
    itemCount?: number;
    pageCount?: number;
    hasNextPage?: boolean;
    hasPreviousPage?: boolean;
};

type GetGroupsByQuery200AllOf = {
    httpStatus?: number;
    message?: string;
    data?: GroupDto[];
    meta?: GetGroupsByQuery200AllOfMeta;
};

type Order = (typeof Order)[keyof typeof Order];
declare const Order: {
    readonly asc: "asc";
    readonly desc: "desc";
};

type GetGroupsByQueryParams = {
    skip?: number;
    take?: number;
    name?: string;
    serviceId?: string;
    orderByCreatedAt?: Order;
};

type GetMyTenant200AllOfMeta = {
    skip?: number;
    take?: number;
    itemCount?: number;
    pageCount?: number;
    hasNextPage?: boolean;
    hasPreviousPage?: boolean;
};

type GetMyTenant200AllOf = {
    httpStatus?: number;
    message?: string;
    data?: TenantDto[];
    meta?: GetMyTenant200AllOfMeta;
};

type GetMyTenants200AllOfMeta = {
    skip?: number;
    take?: number;
    itemCount?: number;
    pageCount?: number;
    hasNextPage?: boolean;
    hasPreviousPage?: boolean;
};

type GetMyTenants200AllOf = {
    httpStatus?: number;
    message?: string;
    data?: TenantDto[];
    meta?: GetMyTenants200AllOfMeta;
};

type GetProgramById200AllOf = {
    httpStatus?: number;
    message?: string;
    data?: ProgramDto;
};

type GetProgramsByQuery200AllOfMeta = {
    skip?: number;
    take?: number;
    itemCount?: number;
    pageCount?: number;
    hasNextPage?: boolean;
    hasPreviousPage?: boolean;
};

type GetProgramsByQuery200AllOf = {
    httpStatus?: number;
    message?: string;
    data?: ProgramDto[];
    meta?: GetProgramsByQuery200AllOfMeta;
};

type GetProgramsByQueryParams = {
    skip?: number;
    take?: number;
};

type GetRole200AllOf = {
    httpStatus?: number;
    message?: string;
    data?: RoleDto;
};

type GetRoleClassificationsByQueryParams = {
    skip?: number;
    take?: number;
};

type GetRolesByQuery200AllOfMeta = {
    skip?: number;
    take?: number;
    itemCount?: number;
    pageCount?: number;
    hasNextPage?: boolean;
    hasPreviousPage?: boolean;
};

type GetRolesByQuery200AllOf = {
    httpStatus?: number;
    message?: string;
    data?: RoleDto[];
    meta?: GetRolesByQuery200AllOfMeta;
};

type GetRolesByQueryParams = {
    skip?: number;
    take?: number;
    nameSortOrder?: SortOrder;
    createdAtSortOrder?: SortOrder;
};

type GetRoutine200AllOf = {
    httpStatus?: number;
    message?: string;
    data?: RoutineDto;
};

type GetRoutinesByQuery200AllOfMeta = {
    skip?: number;
    take?: number;
    itemCount?: number;
    pageCount?: number;
    hasNextPage?: boolean;
    hasPreviousPage?: boolean;
};

type GetRoutinesByQuery200AllOf = {
    httpStatus?: number;
    message?: string;
    data?: RoutineDto[];
    meta?: GetRoutinesByQuery200AllOfMeta;
};

type GetRoutinesByQueryParams = {
    skip?: number;
    take?: number;
};

type GetSession200AllOf = {
    httpStatus?: number;
    message?: string;
    data?: SessionDto;
};

type GetSessionsByQuery200AllOfMeta = {
    skip?: number;
    take?: number;
    itemCount?: number;
    pageCount?: number;
    hasNextPage?: boolean;
    hasPreviousPage?: boolean;
};

type GetSessionsByQuery200AllOf = {
    httpStatus?: number;
    message?: string;
    data?: SessionDto[];
    meta?: GetSessionsByQuery200AllOfMeta;
};

type GetSessionsByQueryParams = {
    skip?: number;
    take?: number;
    timelineId?: string | null;
    startDateTimeSortOrder?: Order;
};

type GetSpace200AllOf = {
    httpStatus?: number;
    message?: string;
    data?: SpaceDto;
};

type GetSpacesByQuery200AllOfMeta = {
    skip?: number;
    take?: number;
    itemCount?: number;
    pageCount?: number;
    hasNextPage?: boolean;
    hasPreviousPage?: boolean;
};

type GetSpacesByQuery200AllOf = {
    httpStatus?: number;
    message?: string;
    data?: SpaceDto[];
    meta?: GetSpacesByQuery200AllOfMeta;
};

type GetSpacesByQueryParams = {
    skip?: number;
    take?: number;
};

type GetSubject200AllOf = {
    httpStatus?: number;
    message?: string;
    data?: SubjectDto;
};

type GetSubjectsByQuery200AllOfMeta = {
    skip?: number;
    take?: number;
    itemCount?: number;
    pageCount?: number;
    hasNextPage?: boolean;
    hasPreviousPage?: boolean;
};

type GetSubjectsByQuery200AllOf = {
    httpStatus?: number;
    message?: string;
    data?: SubjectDto[];
    meta?: GetSubjectsByQuery200AllOfMeta;
};

type GetSubjectsByQueryParams = {
    skip?: number;
    take?: number;
};

type GetTenantById200AllOf = {
    httpStatus?: number;
    message?: string;
    data?: TenantDto;
};

type GetTenantsByQuery200AllOfMeta = {
    skip?: number;
    take?: number;
    itemCount?: number;
    pageCount?: number;
    hasNextPage?: boolean;
    hasPreviousPage?: boolean;
};

type GetTenantsByQuery200AllOf = {
    httpStatus?: number;
    message?: string;
    data?: TenantDto[];
    meta?: GetTenantsByQuery200AllOfMeta;
};

type GetTenantsByQueryParams = {
    skip?: number;
    take?: number;
    createdAtSortOrder?: SortOrder;
};

type GetTimeline200AllOf = {
    httpStatus?: number;
    message?: string;
    data?: TimelineDto;
};

type GetTimelinesByQuery200AllOfMeta = {
    skip?: number;
    take?: number;
    itemCount?: number;
    pageCount?: number;
    hasNextPage?: boolean;
    hasPreviousPage?: boolean;
};

type GetTimelinesByQuery200AllOf = {
    httpStatus?: number;
    message?: string;
    data?: TimelineDto[];
    meta?: GetTimelinesByQuery200AllOfMeta;
};

type GetTimelinesByQueryParams = {
    skip?: number;
    take?: number;
};

interface TokenDto {
    accessToken: string;
    refreshToken: string;
    user: UserDto;
    mainTenantId: string;
}

type GetToken200AllOf = {
    httpStatus?: number;
    message?: string;
    data?: TokenDto;
};

type GetUser200AllOf = {
    httpStatus?: number;
    message?: string;
    data?: UserDto;
};

type GetUsersByQuery200AllOfMeta = {
    skip?: number;
    take?: number;
    itemCount?: number;
    pageCount?: number;
    hasNextPage?: boolean;
    hasPreviousPage?: boolean;
};

type GetUsersByQuery200AllOf = {
    httpStatus?: number;
    message?: string;
    data?: UserDto[];
    meta?: GetUsersByQuery200AllOfMeta;
};

type GetUsersByQueryParams = {
    skip?: number;
    take?: number;
    createdAtSortOrder?: SortOrder;
};

type Login200AllOf = {
    httpStatus?: number;
    message?: string;
    data?: TokenDto;
};

interface LoginPayloadDto {
    email: string;
    password: string;
}

type Logout200AllOf = {
    httpStatus?: number;
    message?: string;
    data?: Boolean;
};

interface PageMetaDto {
    skip: number;
    take: number;
    totalCount: number;
    pageCount: number;
    hasPreviousPage: boolean;
    hasNextPage: boolean;
}

type RefreshToken200AllOf = {
    httpStatus?: number;
    message?: string;
    data?: TokenDto;
};

type RemoveAbilities200AllOf = {
    httpStatus?: number;
    message?: string;
    data?: AbilityDto;
};

type RemoveAbility200AllOf = {
    httpStatus?: number;
    message?: string;
    data?: AbilityDto;
};

type RemoveAction200AllOf = {
    httpStatus?: number;
    message?: string;
    data?: ActionDto;
};

type RemoveActions200AllOf = {
    httpStatus?: number;
    message?: string;
    data?: ActionDto;
};

type RemoveExercise200AllOf = {
    httpStatus?: number;
    message?: string;
    data?: ExerciseDto;
};

type RemoveFileById200AllOf = {
    httpStatus?: number;
    message?: string;
    data?: FileDto;
};

type RemoveGroups200AllOf = {
    httpStatus?: number;
    message?: string;
    data?: Number;
};

type RemoveProgramById200AllOf = {
    httpStatus?: number;
    message?: string;
    data?: ProgramDto;
};

type RemoveRole200AllOf = {
    httpStatus?: number;
    message?: string;
    data?: RoleDto;
};

type RemoveRoutine200AllOf = {
    httpStatus?: number;
    message?: string;
    data?: RoutineDto;
};

type RemoveSession200AllOf = {
    httpStatus?: number;
    message?: string;
    data?: SessionDto;
};

type RemoveSessions200AllOf = {
    httpStatus?: number;
    message?: string;
    data?: SessionDto;
};

type RemoveSpace200AllOf = {
    httpStatus?: number;
    message?: string;
    data?: SpaceDto;
};

type RemoveSubject200AllOf = {
    httpStatus?: number;
    message?: string;
    data?: SubjectDto;
};

type RemoveSubjects200AllOf = {
    httpStatus?: number;
    message?: string;
    data?: SubjectDto;
};

type RemoveTenantById200AllOf = {
    httpStatus?: number;
    message?: string;
    data?: TenantDto;
};

type RemoveTimeline200AllOf = {
    httpStatus?: number;
    message?: string;
    data?: TimelineDto;
};

type RemoveTimelines200AllOf = {
    httpStatus?: number;
    message?: string;
    data?: TimelineDto;
};

type RemoveUser200AllOf = {
    httpStatus?: number;
    message?: string;
    data?: UserDto;
};

type RemoveUsers200AllOf = {
    httpStatus?: number;
    message?: string;
    data?: UserDto;
};

type ResponseEntityData = {
    [key: string]: unknown;
};

type ResponseEntityHttpStatus = (typeof ResponseEntityHttpStatus)[keyof typeof ResponseEntityHttpStatus];
declare const ResponseEntityHttpStatus: {
    readonly NUMBER_100: 100;
    readonly NUMBER_101: 101;
    readonly NUMBER_102: 102;
    readonly NUMBER_103: 103;
    readonly NUMBER_200: 200;
    readonly NUMBER_201: 201;
    readonly NUMBER_202: 202;
    readonly NUMBER_203: 203;
    readonly NUMBER_204: 204;
    readonly NUMBER_205: 205;
    readonly NUMBER_206: 206;
    readonly NUMBER_207: 207;
    readonly NUMBER_208: 208;
    readonly NUMBER_210: 210;
    readonly NUMBER_300: 300;
    readonly NUMBER_301: 301;
    readonly NUMBER_302: 302;
    readonly NUMBER_303: 303;
    readonly NUMBER_304: 304;
    readonly NUMBER_307: 307;
    readonly NUMBER_308: 308;
    readonly NUMBER_400: 400;
    readonly NUMBER_401: 401;
    readonly NUMBER_402: 402;
    readonly NUMBER_403: 403;
    readonly NUMBER_404: 404;
    readonly NUMBER_405: 405;
    readonly NUMBER_406: 406;
    readonly NUMBER_407: 407;
    readonly NUMBER_408: 408;
    readonly NUMBER_409: 409;
    readonly NUMBER_410: 410;
    readonly NUMBER_411: 411;
    readonly NUMBER_412: 412;
    readonly NUMBER_413: 413;
    readonly NUMBER_414: 414;
    readonly NUMBER_415: 415;
    readonly NUMBER_416: 416;
    readonly NUMBER_417: 417;
    readonly NUMBER_418: 418;
    readonly NUMBER_421: 421;
    readonly NUMBER_422: 422;
    readonly NUMBER_423: 423;
    readonly NUMBER_424: 424;
    readonly NUMBER_428: 428;
    readonly NUMBER_429: 429;
    readonly NUMBER_456: 456;
    readonly NUMBER_500: 500;
    readonly NUMBER_501: 501;
    readonly NUMBER_502: 502;
    readonly NUMBER_503: 503;
    readonly NUMBER_504: 504;
    readonly NUMBER_505: 505;
    readonly NUMBER_507: 507;
    readonly NUMBER_508: 508;
};

type ResponseEntityMeta = PageMetaDto | null;

interface ResponseEntity {
    httpStatus: ResponseEntityHttpStatus;
    message: string;
    data?: ResponseEntityData;
    meta?: ResponseEntityMeta;
}

interface SelectTenantDto {
    selectedTenantId: string;
}

interface SignUpPayloadDto {
    nickname: string;
    spaceId: string;
    email: string;
    name: string;
    phone: string;
    password: string;
}

type SignUpUser201AllOf = {
    httpStatus?: number;
    message?: string;
    data?: TokenDto;
};

type UpdateAbility200AllOf = {
    httpStatus?: number;
    message?: string;
    data?: AbilityDto;
};

interface UpdateAbilityDto {
    tenantId?: string;
    actionId?: string;
    conditions?: string | null;
    subjectId?: string;
    type?: AbilityTypes;
    roleId?: string;
    description?: string | null;
}

type UpdateAction200AllOf = {
    httpStatus?: number;
    message?: string;
    data?: ActionDto;
};

interface UpdateActionDto {
    tenantId?: string;
    name?: AbilityActions;
    conditions?: string;
}

type UpdateCategoryById200AllOf = {
    httpStatus?: number;
    message?: string;
    data?: CategoryDto;
};

interface UpdateCategoryDto {
    tenantId?: string;
    name?: string;
    type?: CategoryTypes;
    parentId?: string | null;
}

type UpdateExercise200AllOf = {
    httpStatus?: number;
    message?: string;
    data?: ExerciseDto;
};

interface UpdateExerciseDto {
    name?: string;
    description?: string;
    imageFileId?: string;
    videoFileId?: string;
    duration?: number;
    count?: number;
    tenantId?: string;
}

type UpdateFileById200AllOf = {
    httpStatus?: number;
    message?: string;
    data?: FileDto;
};

type UpdateFileByIdBody = {
    files?: Blob;
};

interface UpdateGroundDto {
    name?: string;
    label?: string | null;
    address?: string;
    phone?: string;
    email?: string;
    businessNo?: string;
    logoImageFileId?: string | null;
    imageFileId?: string | null;
    spaceId?: string;
}

type UpdateGroupById200AllOf = {
    httpStatus?: number;
    message?: string;
    data?: GroupDto;
};

interface UpdateGroupDto {
    name?: string;
    label?: string | null;
    type?: GroupTypes;
    tenantId?: string;
}

type UpdateProgramById200AllOf = {
    httpStatus?: number;
    message?: string;
    data?: ProgramDto;
};

interface UpdateProgramDto {
    instructorId?: string;
    capacity?: number;
    routineId?: string;
    sessionId?: string;
    tenancyId?: string;
}

type UpdateRole200AllOf = {
    httpStatus?: number;
    message?: string;
    data?: RoleDto;
};

interface UpdateRoleDto {
    name?: Roles;
    serviceId?: string;
    categoryId?: string;
}

type UpdateRoutine200AllOf = {
    httpStatus?: number;
    message?: string;
    data?: RoutineDto;
};

interface UpdateRoutineDto {
    label?: string;
    name?: string;
}

type UpdateSession200AllOf = {
    httpStatus?: number;
    message?: string;
    data?: SessionDto;
};

type UpdateSessionDtoRecurringDayOfWeek = RecurringDayOfWeek | null;

type UpdateSessionDtoRepeatCycleType = RepeatCycleTypes | null;

interface UpdateSessionDto {
    id?: string;
    seq?: number;
    createdAt?: string;
    updatedAt?: string;
    removedAt?: string | null;
    name?: string;
    label?: string;
    type?: SessionTypes;
    startDateTime?: string;
    endDateTime?: string;
    timelineId?: string | null;
    repeatCycleType?: UpdateSessionDtoRepeatCycleType;
    recurringDayOfWeek?: UpdateSessionDtoRecurringDayOfWeek;
    recurringMonth?: number | null;
}

type UpdateSpace200AllOf = {
    httpStatus?: number;
    message?: string;
    data?: SpaceDto;
};

interface UpdateSpaceDto {
    [key: string]: unknown;
}

type UpdateSubject200AllOf = {
    httpStatus?: number;
    message?: string;
    data?: SubjectDto;
};

interface UpdateSubjectDto {
    tenantId?: string;
    name?: string;
}

type UpdateTenantById200AllOf = {
    httpStatus?: number;
    message?: string;
    data?: TenantDto;
};

interface UpdateTenantDto {
    main?: boolean;
    roleId?: string;
    userId?: string;
    spaceId?: string;
}

type UpdateTimeline200AllOf = {
    httpStatus?: number;
    message?: string;
    data?: TimelineDto;
};

interface UpdateTimelineDto {
    tenantId?: string;
}

type UpdateUser200AllOf = {
    httpStatus?: number;
    message?: string;
    data?: UserDto;
};

interface UpdateUserDto {
    spaceId?: string;
    email?: string;
    name?: string;
    phone?: string;
    password?: string;
}

type VerifyToken200AllOf = {
    httpStatus?: number;
    message?: string;
    data?: Boolean;
};

export { AbilityActions, type AbilityDto, AbilityTypes, type ActionDto, type AppBuilderDto, type Boolean, type CategoryDto, CategoryTypes, type CreateAbility200AllOf, type CreateAbilityDto, type CreateAction200AllOf, type CreateActionDto, type CreateCategory200AllOf, type CreateCategoryDto, type CreateExercise200AllOf, type CreateExerciseDto, type CreateFile201AllOf, type CreateFileDto, type CreateGroundDto, type CreateGroupDto, type CreateProgram200AllOf, type CreateProgramDto, type CreateRole200AllOf, type CreateRoleDto, type CreateRoutine200AllOf, type CreateRoutineDto, type CreateSession200AllOf, type CreateSessionDto, type CreateSessionDtoRecurringDayOfWeek, type CreateSessionDtoRepeatCycleType, type CreateSpace200AllOf, type CreateSpaceDto, type CreateSubject200AllOf, type CreateSubjectDto, type CreateTaskDto, type CreateTenant200AllOf, type CreateTenantDto, type CreateTimeline200AllOf, type CreateTimelineDto, type CreateUser200AllOf, type CreateUserDto, type DeleteAbility200AllOf, type DeleteAction200AllOf, type DeleteCategoryById200AllOf, type DeleteExercise200AllOf, type DeleteGroup200AllOf, type DeleteProgramById200AllOf, type DeleteRole200AllOf, type DeleteRoutine200AllOf, type DeleteSession200AllOf, type DeleteSpace200AllOf, type DeleteSubject200AllOf, type DeleteTenant200AllOf, type DeleteTimeline200AllOf, type DeleteUser200AllOf, type ExerciseDto, type FileClassificationDto, type FileDto, type Function, type GetAbilitiesByQuery200AllOf, type GetAbilitiesByQuery200AllOfMeta, type GetAbilitiesByQueryParams, type GetAbility200AllOf, type GetAction200AllOf, type GetActionsByQuery200AllOf, type GetActionsByQuery200AllOfMeta, type GetActionsByQueryParams, type GetAppBuilder200AllOf, type GetCategoriesByQuery200AllOf, type GetCategoriesByQuery200AllOfMeta, type GetCategoriesByQueryParams, type GetCategoryById200AllOf, type GetCurrentSpace200AllOf, type GetExercise200AllOf, type GetExercisesByQuery200AllOf, type GetExercisesByQuery200AllOfMeta, type GetExercisesByQueryParams, type GetFileById200AllOf, type GetGroundsByQuery200AllOf, type GetGroundsByQueryParams, type GetGroupById200AllOf, type GetGroupsByQuery200AllOf, type GetGroupsByQuery200AllOfMeta, type GetGroupsByQueryParams, type GetMyTenant200AllOf, type GetMyTenant200AllOfMeta, type GetMyTenants200AllOf, type GetMyTenants200AllOfMeta, type GetProgramById200AllOf, type GetProgramsByQuery200AllOf, type GetProgramsByQuery200AllOfMeta, type GetProgramsByQueryParams, type GetRole200AllOf, type GetRoleClassificationsByQueryParams, type GetRolesByQuery200AllOf, type GetRolesByQuery200AllOfMeta, type GetRolesByQueryParams, type GetRoutine200AllOf, type GetRoutinesByQuery200AllOf, type GetRoutinesByQuery200AllOfMeta, type GetRoutinesByQueryParams, type GetSession200AllOf, type GetSessionsByQuery200AllOf, type GetSessionsByQuery200AllOfMeta, type GetSessionsByQueryParams, type GetSpace200AllOf, type GetSpacesByQuery200AllOf, type GetSpacesByQuery200AllOfMeta, type GetSpacesByQueryParams, type GetSubject200AllOf, type GetSubjectsByQuery200AllOf, type GetSubjectsByQuery200AllOfMeta, type GetSubjectsByQueryParams, type GetTenantById200AllOf, type GetTenantsByQuery200AllOf, type GetTenantsByQuery200AllOfMeta, type GetTenantsByQueryParams, type GetTimeline200AllOf, type GetTimelinesByQuery200AllOf, type GetTimelinesByQuery200AllOfMeta, type GetTimelinesByQueryParams, type GetToken200AllOf, type GetUser200AllOf, type GetUsersByQuery200AllOf, type GetUsersByQuery200AllOfMeta, type GetUsersByQueryParams, type GroundDto, type GroundDtoSpace, type GroupDto, GroupTypes, type Login200AllOf, type LoginPayloadDto, type Logout200AllOf, type Number, Order, type PageMetaDto, type ProgramDto, RecurringDayOfWeek, type RefreshToken200AllOf, type RemoveAbilities200AllOf, type RemoveAbility200AllOf, type RemoveAction200AllOf, type RemoveActions200AllOf, type RemoveExercise200AllOf, type RemoveFileById200AllOf, type RemoveGroups200AllOf, type RemoveProgramById200AllOf, type RemoveRole200AllOf, type RemoveRoutine200AllOf, type RemoveSession200AllOf, type RemoveSessions200AllOf, type RemoveSpace200AllOf, type RemoveSubject200AllOf, type RemoveSubjects200AllOf, type RemoveTenantById200AllOf, type RemoveTimeline200AllOf, type RemoveTimelines200AllOf, type RemoveUser200AllOf, type RemoveUsers200AllOf, RepeatCycleTypes, type ResponseEntity, type ResponseEntityData, ResponseEntityHttpStatus, type ResponseEntityMeta, type RoleDto, Roles, type RouteDto, type RoutineDto, type SelectTenantDto, type SessionDto, type SessionDtoRecurringDayOfWeek, type SessionDtoRepeatCycleType, SessionTypes, type SignUpPayloadDto, type SignUpUser201AllOf, SortOrder, type SpaceDto, type SubjectDto, type TenantDto, type TimelineDto, type TokenDto, type UpdateAbility200AllOf, type UpdateAbilityDto, type UpdateAction200AllOf, type UpdateActionDto, type UpdateCategoryById200AllOf, type UpdateCategoryDto, type UpdateExercise200AllOf, type UpdateExerciseDto, type UpdateFileById200AllOf, type UpdateFileByIdBody, type UpdateGroundDto, type UpdateGroupById200AllOf, type UpdateGroupDto, type UpdateProgramById200AllOf, type UpdateProgramDto, type UpdateRole200AllOf, type UpdateRoleDto, type UpdateRoutine200AllOf, type UpdateRoutineDto, type UpdateSession200AllOf, type UpdateSessionDto, type UpdateSessionDtoRecurringDayOfWeek, type UpdateSessionDtoRepeatCycleType, type UpdateSpace200AllOf, type UpdateSpaceDto, type UpdateSubject200AllOf, type UpdateSubjectDto, type UpdateTenantById200AllOf, type UpdateTenantDto, type UpdateTimeline200AllOf, type UpdateTimelineDto, type UpdateUser200AllOf, type UpdateUserDto, type UserDto, type VerifyToken200AllOf };
