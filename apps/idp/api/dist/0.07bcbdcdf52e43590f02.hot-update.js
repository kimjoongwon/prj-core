"use strict";
exports.id = 0;
exports.ids = null;
exports.modules = {

/***/ 223:
/***/ ((__unused_webpack_module, exports, __webpack_require__) => {


Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.IdpAccountService = exports.IdpDashboardService = exports.OidcSessionsService = exports.SecurityPolicyService = exports.OidcClientsService = exports.MASKING_PRESETS = exports.MaskingService = exports.UsersService = exports.TranslationsService = exports.TokenStorageService = exports.TokenService = exports.TimelinesService = exports.TemplatesService = exports.SubjectsService = exports.SpacesService = exports.RoutinesService = exports.RolesService = exports.RedisService = exports.PrismaService = exports.createPrismaClient = exports.GroundsService = exports.GroupsService = exports.GrantsService = exports.ExercisesService = exports.AwsService = exports.CategoriesService = exports.ActionsService = exports.AbilitiesService = exports.EmailService = exports.AuthCacheService = exports.AuthAuditLogService = exports.TranslationService = exports.I18nModule = exports.SpaceContext = exports.AuthContext = void 0;
var context_1 = __webpack_require__(224);
Object.defineProperty(exports, "AuthContext", ({ enumerable: true, get: function () { return context_1.AuthContext; } }));
Object.defineProperty(exports, "SpaceContext", ({ enumerable: true, get: function () { return context_1.SpaceContext; } }));
var i18n_1 = __webpack_require__(225);
Object.defineProperty(exports, "I18nModule", ({ enumerable: true, get: function () { return i18n_1.I18nModule; } }));
Object.defineProperty(exports, "TranslationService", ({ enumerable: true, get: function () { return i18n_1.TranslationService; } }));
var auth_audit_log_service_1 = __webpack_require__(230);
Object.defineProperty(exports, "AuthAuditLogService", ({ enumerable: true, get: function () { return auth_audit_log_service_1.AuthAuditLogService; } }));
var auth_cache_service_1 = __webpack_require__(231);
Object.defineProperty(exports, "AuthCacheService", ({ enumerable: true, get: function () { return auth_cache_service_1.AuthCacheService; } }));
var email_service_1 = __webpack_require__(235);
Object.defineProperty(exports, "EmailService", ({ enumerable: true, get: function () { return email_service_1.EmailService; } }));
var abilities_service_1 = __webpack_require__(237);
Object.defineProperty(exports, "AbilitiesService", ({ enumerable: true, get: function () { return abilities_service_1.AbilitiesService; } }));
var actions_service_1 = __webpack_require__(238);
Object.defineProperty(exports, "ActionsService", ({ enumerable: true, get: function () { return actions_service_1.ActionsService; } }));
var categories_service_1 = __webpack_require__(239);
Object.defineProperty(exports, "CategoriesService", ({ enumerable: true, get: function () { return categories_service_1.CategoriesService; } }));
var aws_service_1 = __webpack_require__(240);
Object.defineProperty(exports, "AwsService", ({ enumerable: true, get: function () { return aws_service_1.AwsService; } }));
var exercises_service_1 = __webpack_require__(242);
Object.defineProperty(exports, "ExercisesService", ({ enumerable: true, get: function () { return exercises_service_1.ExercisesService; } }));
var grants_service_1 = __webpack_require__(447);
Object.defineProperty(exports, "GrantsService", ({ enumerable: true, get: function () { return grants_service_1.GrantsService; } }));
var groups_service_1 = __webpack_require__(448);
Object.defineProperty(exports, "GroupsService", ({ enumerable: true, get: function () { return groups_service_1.GroupsService; } }));
var grounds_service_1 = __webpack_require__(449);
Object.defineProperty(exports, "GroundsService", ({ enumerable: true, get: function () { return grounds_service_1.GroundsService; } }));
var prisma_factory_1 = __webpack_require__(451);
Object.defineProperty(exports, "createPrismaClient", ({ enumerable: true, get: function () { return prisma_factory_1.createPrismaClient; } }));
var prisma_service_1 = __webpack_require__(229);
Object.defineProperty(exports, "PrismaService", ({ enumerable: true, get: function () { return prisma_service_1.PrismaService; } }));
var redis_service_1 = __webpack_require__(232);
Object.defineProperty(exports, "RedisService", ({ enumerable: true, get: function () { return redis_service_1.RedisService; } }));
var roles_service_1 = __webpack_require__(454);
Object.defineProperty(exports, "RolesService", ({ enumerable: true, get: function () { return roles_service_1.RolesService; } }));
var routines_service_1 = __webpack_require__(455);
Object.defineProperty(exports, "RoutinesService", ({ enumerable: true, get: function () { return routines_service_1.RoutinesService; } }));
var spaces_service_1 = __webpack_require__(450);
Object.defineProperty(exports, "SpacesService", ({ enumerable: true, get: function () { return spaces_service_1.SpacesService; } }));
var subjects_service_1 = __webpack_require__(456);
Object.defineProperty(exports, "SubjectsService", ({ enumerable: true, get: function () { return subjects_service_1.SubjectsService; } }));
var templates_service_1 = __webpack_require__(457);
Object.defineProperty(exports, "TemplatesService", ({ enumerable: true, get: function () { return templates_service_1.TemplatesService; } }));
var timelines_service_1 = __webpack_require__(458);
Object.defineProperty(exports, "TimelinesService", ({ enumerable: true, get: function () { return timelines_service_1.TimelinesService; } }));
var token_service_1 = __webpack_require__(459);
Object.defineProperty(exports, "TokenService", ({ enumerable: true, get: function () { return token_service_1.TokenService; } }));
var token_storage_service_1 = __webpack_require__(480);
Object.defineProperty(exports, "TokenStorageService", ({ enumerable: true, get: function () { return token_storage_service_1.TokenStorageService; } }));
var translations_service_1 = __webpack_require__(482);
Object.defineProperty(exports, "TranslationsService", ({ enumerable: true, get: function () { return translations_service_1.TranslationsService; } }));
var users_service_1 = __webpack_require__(483);
Object.defineProperty(exports, "UsersService", ({ enumerable: true, get: function () { return users_service_1.UsersService; } }));
var masking_service_1 = __webpack_require__(484);
Object.defineProperty(exports, "MaskingService", ({ enumerable: true, get: function () { return masking_service_1.MaskingService; } }));
var constant_1 = __webpack_require__(4);
Object.defineProperty(exports, "MASKING_PRESETS", ({ enumerable: true, get: function () { return constant_1.MASKING_PRESETS; } }));
var oidc_clients_service_1 = __webpack_require__(485);
Object.defineProperty(exports, "OidcClientsService", ({ enumerable: true, get: function () { return oidc_clients_service_1.OidcClientsService; } }));
var security_policy_service_1 = __webpack_require__(486);
Object.defineProperty(exports, "SecurityPolicyService", ({ enumerable: true, get: function () { return security_policy_service_1.SecurityPolicyService; } }));
var oidc_sessions_service_1 = __webpack_require__(487);
Object.defineProperty(exports, "OidcSessionsService", ({ enumerable: true, get: function () { return oidc_sessions_service_1.OidcSessionsService; } }));
var idp_dashboard_service_1 = __webpack_require__(488);
Object.defineProperty(exports, "IdpDashboardService", ({ enumerable: true, get: function () { return idp_dashboard_service_1.IdpDashboardService; } }));
var idp_account_service_1 = __webpack_require__(489);
Object.defineProperty(exports, "IdpAccountService", ({ enumerable: true, get: function () { return idp_account_service_1.IdpAccountService; } }));
//# sourceMappingURL=index.js.map

/***/ }),

/***/ 224:
/***/ ((__unused_webpack_module, exports, __webpack_require__) => {


Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.SpaceContext = exports.AuthContext = void 0;
var auth_context_1 = __webpack_require__(352);
Object.defineProperty(exports, "AuthContext", ({ enumerable: true, get: function () { return auth_context_1.AuthContext; } }));
var space_context_1 = __webpack_require__(587);
Object.defineProperty(exports, "SpaceContext", ({ enumerable: true, get: function () { return space_context_1.SpaceContext; } }));
//# sourceMappingURL=index.js.map

/***/ }),

/***/ 242:
/***/ (function(__unused_webpack_module, exports, __webpack_require__) {


var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
var ExercisesService_1;
var _a;
Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.ExercisesService = void 0;
const constant_1 = __webpack_require__(4);
const dto_1 = __webpack_require__(243);
const repository_1 = __webpack_require__(51);
const transactional_1 = __webpack_require__(173);
const common_1 = __webpack_require__(46);
const context_1 = __webpack_require__(224);
let ExercisesService = ExercisesService_1 = class ExercisesService {
    exercisesRepository;
    spaceContext;
    logger = new common_1.Logger(ExercisesService_1.name);
    constructor(exercisesRepository, spaceContext) {
        this.exercisesRepository = exercisesRepository;
        this.spaceContext = spaceContext;
    }
    async findExercises(params) {
        const { spaceId, spaceScope, skip, take, search } = params;
        this.logger.debug(`운동 종목 목록 조회: spaceScope=${spaceScope}`);
        const spaceIds = spaceScope === dto_1.SpaceScope.INCLUDE_ANCESTORS
            ? this.spaceContext.spaceIds
            : [spaceId];
        const [exercises, total] = await this.exercisesRepository.findManyExercises({
            spaceIds,
            skip,
            take,
            search,
        });
        return { exercises, total };
    }
    async findExerciseById(exerciseId, spaceId, spaceScope = dto_1.SpaceScope.INCLUDE_ANCESTORS) {
        this.logger.debug(`운동 종목 단건 조회: ${exerciseId.slice(-8)}`);
        const spaceIds = spaceScope === dto_1.SpaceScope.INCLUDE_ANCESTORS
            ? this.spaceContext.spaceIds
            : [spaceId];
        const exercise = await this.exercisesRepository.findExerciseById(exerciseId, spaceIds);
        if (!exercise) {
            throw new common_1.NotFoundException(constant_1.EXERCISE_ERRORS.EXERCISE_NOT_FOUND);
        }
        return exercise;
    }
    async findExerciseRoutines(exerciseId, spaceId) {
        this.logger.debug(`운동 종목 관련 루틴 조회: ${exerciseId.slice(-8)}`);
        await this.findExerciseById(exerciseId, spaceId);
        return this.exercisesRepository.findExerciseRoutines(exerciseId);
    }
    async createExercise(dto, spaceId, creatorId) {
        this.logger.debug(`운동 종목 등록: name=${dto.name}`);
        const task = await this.exercisesRepository.createTask({
            spaceId,
            creatorId,
        });
        return this.exercisesRepository.createExercise({
            ...dto,
            taskId: task.id,
        });
    }
    async updateExercise(exerciseId, dto, spaceId) {
        this.logger.debug(`운동 종목 수정: ${exerciseId.slice(-8)}`);
        const exercise = await this.findExerciseById(exerciseId, spaceId, dto_1.SpaceScope.INCLUDE_ANCESTORS);
        if (exercise.task?.spaceId !== spaceId) {
            throw new common_1.ForbiddenException(constant_1.EXERCISE_ERRORS.EXERCISE_NOT_OWNED);
        }
        return this.exercisesRepository.updateExercise(exerciseId, dto);
    }
    async deleteExercise(exerciseId, spaceId) {
        this.logger.debug(`운동 종목 삭제: ${exerciseId.slice(-8)}`);
        const exercise = await this.findExerciseById(exerciseId, spaceId, dto_1.SpaceScope.INCLUDE_ANCESTORS);
        if (exercise.task?.spaceId !== spaceId) {
            throw new common_1.ForbiddenException(constant_1.EXERCISE_ERRORS.EXERCISE_NOT_OWNED);
        }
        const activityCount = await this.exercisesRepository.countActivitiesUsingExercise(exerciseId);
        if (activityCount > 0) {
            throw new common_1.ConflictException(constant_1.EXERCISE_ERRORS.EXERCISE_IN_USE);
        }
        const deleted = await this.exercisesRepository.softDeleteExerciseById(exerciseId);
        await this.exercisesRepository.softDeleteTaskById(deleted.taskId);
    }
};
exports.ExercisesService = ExercisesService;
__decorate([
    (0, transactional_1.Transactional)(),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, String, String]),
    __metadata("design:returntype", Promise)
], ExercisesService.prototype, "createExercise", null);
__decorate([
    (0, transactional_1.Transactional)(),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, String]),
    __metadata("design:returntype", Promise)
], ExercisesService.prototype, "deleteExercise", null);
exports.ExercisesService = ExercisesService = ExercisesService_1 = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [repository_1.ExercisesRepository, typeof (_a = typeof context_1.SpaceContext !== "undefined" && context_1.SpaceContext) === "function" ? _a : Object])
], ExercisesService);
//# sourceMappingURL=exercises.service.js.map

/***/ }),

/***/ 352:
/***/ (function(__unused_webpack_module, exports, __webpack_require__) {


var __esDecorate = (this && this.__esDecorate) || function (ctor, descriptorIn, decorators, contextIn, initializers, extraInitializers) {
    function accept(f) { if (f !== void 0 && typeof f !== "function") throw new TypeError("Function expected"); return f; }
    var kind = contextIn.kind, key = kind === "getter" ? "get" : kind === "setter" ? "set" : "value";
    var target = !descriptorIn && ctor ? contextIn["static"] ? ctor : ctor.prototype : null;
    var descriptor = descriptorIn || (target ? Object.getOwnPropertyDescriptor(target, contextIn.name) : {});
    var _, done = false;
    for (var i = decorators.length - 1; i >= 0; i--) {
        var context = {};
        for (var p in contextIn) context[p] = p === "access" ? {} : contextIn[p];
        for (var p in contextIn.access) context.access[p] = contextIn.access[p];
        context.addInitializer = function (f) { if (done) throw new TypeError("Cannot add initializers after decoration has completed"); extraInitializers.push(accept(f || null)); };
        var result = (0, decorators[i])(kind === "accessor" ? { get: descriptor.get, set: descriptor.set } : descriptor[key], context);
        if (kind === "accessor") {
            if (result === void 0) continue;
            if (result === null || typeof result !== "object") throw new TypeError("Object expected");
            if (_ = accept(result.get)) descriptor.get = _;
            if (_ = accept(result.set)) descriptor.set = _;
            if (_ = accept(result.init)) initializers.unshift(_);
        }
        else if (_ = accept(result)) {
            if (kind === "field") initializers.unshift(_);
            else descriptor[key] = _;
        }
    }
    if (target) Object.defineProperty(target, contextIn.name, descriptor);
    done = true;
};
var __runInitializers = (this && this.__runInitializers) || function (thisArg, initializers, value) {
    var useValue = arguments.length > 2;
    for (var i = 0; i < initializers.length; i++) {
        value = useValue ? initializers[i].call(thisArg, value) : initializers[i].call(thisArg);
    }
    return useValue ? value : void 0;
};
Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.AuthContext = void 0;
const constant_1 = __webpack_require__(4);
const entity_1 = __webpack_require__(53);
const common_1 = __webpack_require__(46);
/**
 * 인증 컨텍스트
 *
 * CLS에 저장된 인증 정보를 Entity 인스턴스로 제공하여
 * Service에서 도메인 메서드를 사용할 수 있게 합니다.
 *
 * @example
 * constructor(private readonly authCtx: AuthContext) {}
 *
 * async someMethod() {
 *   if (this.authCtx.isSuperManager()) {
 *     return this.repository.findAll();
 *   }
 *   if (this.authCtx.user?.canAccessSpace(someSpaceId)) {
 *     // ...
 *   }
 * }
 */
let AuthContext = (() => {
    let _classDecorators = [(0, common_1.Injectable)()];
    let _classDescriptor;
    let _classExtraInitializers = [];
    let _classThis;
    var AuthContext = class {
        static { _classThis = this; }
        static {
            const _metadata = typeof Symbol === "function" && Symbol.metadata ? Object.create(null) : void 0;
            __esDecorate(null, _classDescriptor = { value: _classThis }, _classDecorators, { kind: "class", name: _classThis.name, metadata: _metadata }, null, _classExtraInitializers);
            AuthContext = _classThis = _classDescriptor.value;
            if (_metadata) Object.defineProperty(_classThis, Symbol.metadata, { enumerable: true, configurable: true, writable: true, value: _metadata });
            __runInitializers(_classThis, _classExtraInitializers);
        }
        cls;
        /** 변환된 User Entity 캐시 */
        _user = null;
        constructor(cls) {
            this.cls = cls;
        }
        // ═══════════════════════════════════════════════════════════
        // Raw Data (CLS 직접 접근)
        // ═══════════════════════════════════════════════════════════
        /** 원본 UserDto */
        get userDto() {
            return this.cls.get(constant_1.CONTEXT_KEYS.AUTH_USER);
        }
        /** 원본 TenantDto */
        get tenantDto() {
            return this.cls.get(constant_1.CONTEXT_KEYS.TENANT);
        }
        /** 현재 Space ID */
        get spaceId() {
            return this.cls.get(constant_1.CONTEXT_KEYS.SPACE_ID);
        }
        // ═══════════════════════════════════════════════════════════
        // Entity (변환 + 캐싱)
        // ═══════════════════════════════════════════════════════════
        /** User Entity (요청당 한 번만 변환) */
        get user() {
            if (this._user === null && this.userDto) {
                this._user = entity_1.User.fromDto(this.userDto);
            }
            return this._user;
        }
        // ═══════════════════════════════════════════════════════════
        // 편의 메서드 (User Entity에 위임)
        // ═══════════════════════════════════════════════════════════
        /** 슈퍼매니저 여부 */
        isSuperManager() {
            return this.user?.isSuperManager() ?? false;
        }
        /** 접근 가능한 Space IDs */
        get accessibleSpaceIds() {
            return this.user?.accessibleSpaceIds;
        }
        /** 특정 Space 접근 권한 */
        canAccessSpace(spaceId) {
            return this.user?.canAccessSpace(spaceId) ?? false;
        }
        // ═══════════════════════════════════════════════════════════
        // 인증 상태
        // ═══════════════════════════════════════════════════════════
        /** 인증됨 */
        get isAuthenticated() {
            return !!this.userDto;
        }
        /** 인증 필수 */
        assertAuthenticated() {
            if (!this.userDto) {
                throw new common_1.UnauthorizedException("인증이 필요합니다.");
            }
        }
    };
    return AuthContext = _classThis;
})();
exports.AuthContext = AuthContext;
//# sourceMappingURL=auth-context.js.map

/***/ }),

/***/ 455:
/***/ (function(__unused_webpack_module, exports, __webpack_require__) {


var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
var RoutinesService_1;
var _a;
Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.RoutinesService = void 0;
const constant_1 = __webpack_require__(4);
const dto_1 = __webpack_require__(243);
const repository_1 = __webpack_require__(51);
const common_1 = __webpack_require__(46);
const context_1 = __webpack_require__(224);
let RoutinesService = RoutinesService_1 = class RoutinesService {
    routinesRepository;
    spaceContext;
    logger = new common_1.Logger(RoutinesService_1.name);
    DEFAULT_ACTIVITY_REPETITIONS = 1;
    DEFAULT_ACTIVITY_REST_TIME = 0;
    constructor(routinesRepository, spaceContext) {
        this.routinesRepository = routinesRepository;
        this.spaceContext = spaceContext;
    }
    async findRoutines(params) {
        const { spaceScope = dto_1.SpaceScope.INCLUDE_ANCESTORS, skip, take, search, } = params;
        this.logger.debug(`루틴 목록 조회: spaceScope=${spaceScope}`);
        const spaceId = this.spaceContext.spaceId;
        const spaceIds = spaceScope === dto_1.SpaceScope.INCLUDE_ANCESTORS
            ? this.spaceContext.spaceIds
            : spaceId
                ? [spaceId]
                : [];
        const [routines, total] = await this.routinesRepository.findManyRoutines({
            spaceIds,
            skip,
            take,
            search,
        });
        return { routines, total };
    }
    async findRoutineById(routineId, spaceScope = dto_1.SpaceScope.INCLUDE_ANCESTORS) {
        this.logger.debug(`루틴 단건 조회: ${routineId.slice(-8)}`);
        const spaceId = this.spaceContext.spaceId;
        const spaceIds = spaceScope === dto_1.SpaceScope.INCLUDE_ANCESTORS
            ? this.spaceContext.spaceIds
            : spaceId
                ? [spaceId]
                : [];
        const routine = await this.routinesRepository.findRoutineById(routineId, spaceIds);
        if (!routine) {
            throw new common_1.NotFoundException(constant_1.ROUTINE_ERRORS.ROUTINE_NOT_FOUND);
        }
        return routine;
    }
    async createRoutine(dto, userId) {
        this.logger.debug(`루틴 등록: name=${dto.name}`);
        const spaceId = this.spaceContext.spaceId;
        if (!spaceId) {
            throw new Error("Space 컨텍스트가 설정되지 않았습니다");
        }
        this.validateRoutineActivityTasks(dto.activities);
        return this.routinesRepository.createRoutine({
            name: dto.name,
            label: dto.label,
            spaceId,
            creatorId: userId,
            activities: this.normalizeRoutineActivities(dto.activities),
        });
    }
    async updateRoutine(routineId, dto) {
        this.logger.debug(`루틴 수정: ${routineId.slice(-8)}`);
        const spaceId = this.spaceContext.spaceId;
        const routine = await this.findRoutineById(routineId, dto_1.SpaceScope.INCLUDE_ANCESTORS);
        this.validateRoutineActivityTasks(dto.activities);
        if (routine.spaceId !== spaceId) {
            throw new common_1.ForbiddenException(constant_1.ROUTINE_ERRORS.ROUTINE_NOT_OWNED);
        }
        return this.routinesRepository.updateRoutine(routineId, {
            name: dto.name,
            label: dto.label,
            activities: this.normalizeRoutineActivities(dto.activities),
        });
    }
    validateRoutineActivityTasks(activities) {
        if (!activities) {
            return;
        }
        const taskIds = new Set();
        for (const activity of activities) {
            if (taskIds.has(activity.taskId)) {
                throw new common_1.ConflictException(constant_1.ROUTINE_ERRORS.ROUTINE_ACTIVITY_TASK_DUPLICATED);
            }
            taskIds.add(activity.taskId);
        }
    }
    normalizeRoutineActivities(activities) {
        if (activities === undefined) {
            return undefined;
        }
        return activities.map((activity, index) => ({
            taskId: activity.taskId,
            order: activity.order ?? index + 1,
            repetitions: activity.repetitions ?? this.DEFAULT_ACTIVITY_REPETITIONS,
            restTime: activity.restTime ?? this.DEFAULT_ACTIVITY_REST_TIME,
            notes: activity.notes,
        }));
    }
    async removeRoutine(routineId) {
        this.logger.debug(`루틴 삭제: ${routineId.slice(-8)}`);
        const spaceId = this.spaceContext.spaceId;
        const routine = await this.findRoutineById(routineId, dto_1.SpaceScope.INCLUDE_ANCESTORS);
        if (routine.spaceId !== spaceId) {
            throw new common_1.ForbiddenException(constant_1.ROUTINE_ERRORS.ROUTINE_NOT_OWNED);
        }
        const programCount = await this.routinesRepository.countProgramsUsingRoutine(routineId);
        if (programCount > 0) {
            throw new common_1.ConflictException(constant_1.ROUTINE_ERRORS.ROUTINE_IN_USE);
        }
        await this.routinesRepository.softDeleteRoutine(routineId);
    }
};
exports.RoutinesService = RoutinesService;
exports.RoutinesService = RoutinesService = RoutinesService_1 = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [repository_1.RoutinesRepository, typeof (_a = typeof context_1.SpaceContext !== "undefined" && context_1.SpaceContext) === "function" ? _a : Object])
], RoutinesService);
//# sourceMappingURL=routines.service.js.map

/***/ }),

/***/ 483:
/***/ (function(__unused_webpack_module, exports, __webpack_require__) {


var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
var UsersService_1;
var _a;
Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.UsersService = void 0;
const context_1 = __webpack_require__(224);
const constant_1 = __webpack_require__(4);
const be_common_1 = __webpack_require__(43);
const repository_1 = __webpack_require__(51);
const vo_1 = __webpack_require__(460);
const common_1 = __webpack_require__(46);
const auth_cache_service_1 = __webpack_require__(231);
let UsersService = UsersService_1 = class UsersService {
    repository;
    spaceCtx;
    authCacheService;
    logger = new common_1.Logger(UsersService_1.name);
    constructor(repository, spaceCtx, authCacheService) {
        this.repository = repository;
        this.spaceCtx = spaceCtx;
        this.authCacheService = authCacheService;
    }
    getByIdWithTenants(id) {
        return this.repository.findByIdWithTenantsAndProfiles(id);
    }
    findUserForAuth(email) {
        return this.repository.findByEmailSelectCredentials(email);
    }
    async getUsersBySpace(query) {
        const spaceIds = this.spaceCtx.spaceIds;
        this.logger.debug(`접근 가능 Space 내 사용자 목록 조회: spaceIds=${spaceIds.length}개`);
        const baseWhere = {
            tenants: { some: { spaceId: { in: spaceIds }, removedAt: null } },
        };
        const where = query.toPrismaWhere(baseWhere);
        const orderBy = query.toPrismaOrderBy();
        const [{ users, totalCount }, stats] = await Promise.all([
            this.repository.findManyBySpaceIds({
                where,
                orderBy,
                skip: query.skip ?? 0,
                take: query.take ?? 10,
                spaceIds,
            }),
            this.repository.countStatsBySpaceIds(spaceIds),
        ]);
        return {
            users,
            totalCount,
            stats,
        };
    }
    async getUserDetailForSpace(userId, spaceId) {
        this.logger.debug(`Space 내 사용자 상세 조회: userId=${userId}, spaceId=${spaceId}`);
        const user = await this.repository.findByIdAndSpaceIdWithRelations(userId, spaceId);
        if (!user) {
            throw new common_1.NotFoundException(constant_1.USER_ERRORS.USER_NOT_FOUND);
        }
        return user;
    }
    async createUserForSpace(params) {
        this.logger.debug(`사용자 등록: email=${params.email}`);
        await this.validateUniqueness(params.email, params.phone, params.name);
        const plainPassword = vo_1.PlainPassword.create(params.password);
        const hashedPassword = await vo_1.HashedPassword.fromPlain(plainPassword);
        const user = await this.repository.createWithRelations({
            name: params.name,
            email: params.email,
            phone: params.phone,
            password: hashedPassword.value,
            tenants: {
                create: {
                    space: { connect: { id: params.spaceId } },
                    role: { connect: { id: params.roleId } },
                },
            },
            profiles: {
                create: {
                    name: params.name,
                    nickname: params.name,
                },
            },
            ...(params.categoryId && {
                classification: {
                    create: {
                        category: { connect: { id: params.categoryId } },
                    },
                },
            }),
            ...(params.groupIds &&
                params.groupIds.length > 0 && {
                associations: {
                    create: params.groupIds.map((groupId) => ({
                        group: { connect: { id: groupId } },
                    })),
                },
            }),
        });
        return user;
    }
    async updateUserForSpace(userId, spaceId, params) {
        this.logger.debug(`사용자 수정: userId=${userId}, spaceId=${spaceId}`);
        const existingUser = await this.repository.findByIdAndSpaceIdWithRelations(userId, spaceId);
        if (!existingUser) {
            throw new common_1.NotFoundException(constant_1.USER_ERRORS.USER_NOT_FOUND);
        }
        if (params.email && params.email !== existingUser.email) {
            const emailExists = await this.repository.existsByEmail(params.email);
            if (emailExists) {
                throw new common_1.BadRequestException(constant_1.USER_ERRORS.EMAIL_ALREADY_EXISTS);
            }
        }
        if (params.phone && params.phone !== existingUser.phone) {
            const phoneExists = await this.repository.existsByPhone(params.phone);
            if (phoneExists) {
                throw new common_1.BadRequestException(constant_1.USER_ERRORS.PHONE_ALREADY_EXISTS);
            }
        }
        if (params.name && params.name !== existingUser.name) {
            const nameExists = await this.repository.existsByName(params.name);
            if (nameExists) {
                throw new common_1.BadRequestException(constant_1.USER_ERRORS.NAME_ALREADY_EXISTS);
            }
        }
        const updatedUser = await this.repository.updateByIdWithRelations(userId, {
            name: params.name,
            email: params.email,
            phone: params.phone,
        }, {
            categoryId: params.categoryId,
            groupIds: params.groupIds,
        });
        await this.authCacheService.invalidate(userId);
        return updatedUser;
    }
    async deleteUserForSpace(userId, spaceId, currentUserId) {
        this.logger.debug(`사용자 삭제: userId=${userId}, spaceId=${spaceId}`);
        if (userId === currentUserId) {
            throw new common_1.BadRequestException(constant_1.USER_ERRORS.CANNOT_DELETE_SELF);
        }
        const existingUser = await this.repository.findByIdAndSpaceIdWithRelations(userId, spaceId);
        if (!existingUser) {
            throw new common_1.NotFoundException(constant_1.USER_ERRORS.USER_NOT_FOUND);
        }
        await this.repository.removeById(userId);
        await this.authCacheService.invalidate(userId);
    }
    async changePassword(userId, currentPassword, newPassword) {
        this.logger.debug(`비밀번호 변경: userId=${userId.slice(-8)}`);
        const user = await this.repository.findPasswordById(userId);
        if (!user) {
            throw new common_1.NotFoundException(constant_1.USER_ERRORS.USER_NOT_FOUND);
        }
        const currentHashed = vo_1.HashedPassword.fromHash(user.password);
        const currentPlain = vo_1.PlainPassword.create(currentPassword);
        const isCurrentValid = await currentHashed.compare(currentPlain);
        if (!isCurrentValid) {
            throw new common_1.BadRequestException("CURRENT_PASSWORD_INCORRECT");
        }
        const policyResult = (0, be_common_1.validatePasswordPolicy)(newPassword);
        if (!policyResult.isValid) {
            const failedRules = policyResult.rules
                .filter((r) => !r.passed)
                .map((r) => r.label)
                .join(", ");
            throw new common_1.BadRequestException(`PASSWORD_POLICY_VIOLATION: ${failedRules}`);
        }
        const newPlain = vo_1.PlainPassword.create(newPassword);
        const isSameAsCurrent = await currentHashed.compare(newPlain);
        if (isSameAsCurrent) {
            throw new common_1.BadRequestException("PASSWORD_REUSE");
        }
        const histories = await this.repository.getPasswordHistory(userId, 5);
        for (const history of histories) {
            const historyHashed = vo_1.HashedPassword.fromHash(history.passwordHash);
            const isReused = await historyHashed.compare(newPlain);
            if (isReused) {
                throw new common_1.BadRequestException("PASSWORD_REUSE");
            }
        }
        const newHashed = await vo_1.HashedPassword.fromPlain(newPlain);
        await this.repository.updatePassword(userId, newHashed.value);
        await this.repository.addPasswordHistory(userId, user.password);
        await this.repository.prunePasswordHistory(userId, 5);
        await this.authCacheService.invalidate(userId);
    }
    async unlockAccount(userId) {
        this.logger.debug(`계정 잠금 해제: userId=${userId.slice(-8)}`);
        const user = await this.repository.findById(userId);
        if (!user) {
            throw new common_1.NotFoundException(constant_1.USER_ERRORS.USER_NOT_FOUND);
        }
        await this.repository.unlockAccount(userId);
        await this.authCacheService.invalidate(userId);
    }
    async forceResetPassword(userId) {
        this.logger.debug(`비밀번호 강제 재설정: userId=${userId.slice(-8)}`);
        const securityInfo = await this.repository.findSecurityInfoById(userId);
        if (!securityInfo) {
            throw new common_1.NotFoundException(constant_1.USER_ERRORS.USER_NOT_FOUND);
        }
        const temporaryPassword = this.generateTemporaryPassword();
        const plainPassword = vo_1.PlainPassword.create(temporaryPassword);
        const hashedPassword = await vo_1.HashedPassword.fromPlain(plainPassword);
        await this.repository.updatePassword(userId, hashedPassword.value);
        await this.repository.unlockAccount(userId);
        await this.authCacheService.invalidate(userId);
        return { temporaryPassword, email: securityInfo.email };
    }
    async getSecurityInfo(userId) {
        this.logger.debug(`사용자 보안 정보 조회: userId=${userId.slice(-8)}`);
        const info = await this.repository.findSecurityInfoById(userId);
        if (!info) {
            throw new common_1.NotFoundException(constant_1.USER_ERRORS.USER_NOT_FOUND);
        }
        return info;
    }
    async validateUniqueness(email, phone, name) {
        const [emailExists, phoneExists, nameExists] = await Promise.all([
            this.repository.existsByEmail(email),
            this.repository.existsByPhone(phone),
            this.repository.existsByName(name),
        ]);
        if (emailExists) {
            throw new common_1.BadRequestException(constant_1.USER_ERRORS.EMAIL_ALREADY_EXISTS);
        }
        if (phoneExists) {
            throw new common_1.BadRequestException(constant_1.USER_ERRORS.PHONE_ALREADY_EXISTS);
        }
        if (nameExists) {
            throw new common_1.BadRequestException(constant_1.USER_ERRORS.NAME_ALREADY_EXISTS);
        }
    }
    generateTemporaryPassword() {
        const upper = "ABCDEFGHJKLMNPQRSTUVWXYZ";
        const lower = "abcdefghjkmnpqrstuvwxyz";
        const digits = "23456789";
        const special = "!@#$%&*";
        const all = upper + lower + digits + special;
        let password = "";
        password += upper[Math.floor(Math.random() * upper.length)];
        password += lower[Math.floor(Math.random() * lower.length)];
        password += digits[Math.floor(Math.random() * digits.length)];
        password += special[Math.floor(Math.random() * special.length)];
        for (let i = 0; i < 8; i++) {
            password += all[Math.floor(Math.random() * all.length)];
        }
        return password.split("").sort(() => Math.random() - 0.5).join("");
    }
    createUserForSignUp(params) {
        this.logger.debug(`회원가입 사용자 생성: email=${params.email}`);
        return this.repository.createWithRelations({
            name: params.name,
            email: params.email,
            phone: params.phone,
            password: params.password,
            tenants: {
                create: {
                    space: { connect: { id: params.spaceId } },
                    role: { connect: { id: params.roleId } },
                },
            },
            profiles: {
                create: {
                    name: params.name,
                    nickname: params.nickname || params.name,
                },
            },
        });
    }
};
exports.UsersService = UsersService;
exports.UsersService = UsersService = UsersService_1 = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [repository_1.UsersRepository, typeof (_a = typeof context_1.SpaceContext !== "undefined" && context_1.SpaceContext) === "function" ? _a : Object, auth_cache_service_1.AuthCacheService])
], UsersService);
//# sourceMappingURL=users.service.js.map

/***/ }),

/***/ 587:
/***/ (function(__unused_webpack_module, exports, __webpack_require__) {


var __esDecorate = (this && this.__esDecorate) || function (ctor, descriptorIn, decorators, contextIn, initializers, extraInitializers) {
    function accept(f) { if (f !== void 0 && typeof f !== "function") throw new TypeError("Function expected"); return f; }
    var kind = contextIn.kind, key = kind === "getter" ? "get" : kind === "setter" ? "set" : "value";
    var target = !descriptorIn && ctor ? contextIn["static"] ? ctor : ctor.prototype : null;
    var descriptor = descriptorIn || (target ? Object.getOwnPropertyDescriptor(target, contextIn.name) : {});
    var _, done = false;
    for (var i = decorators.length - 1; i >= 0; i--) {
        var context = {};
        for (var p in contextIn) context[p] = p === "access" ? {} : contextIn[p];
        for (var p in contextIn.access) context.access[p] = contextIn.access[p];
        context.addInitializer = function (f) { if (done) throw new TypeError("Cannot add initializers after decoration has completed"); extraInitializers.push(accept(f || null)); };
        var result = (0, decorators[i])(kind === "accessor" ? { get: descriptor.get, set: descriptor.set } : descriptor[key], context);
        if (kind === "accessor") {
            if (result === void 0) continue;
            if (result === null || typeof result !== "object") throw new TypeError("Object expected");
            if (_ = accept(result.get)) descriptor.get = _;
            if (_ = accept(result.set)) descriptor.set = _;
            if (_ = accept(result.init)) initializers.unshift(_);
        }
        else if (_ = accept(result)) {
            if (kind === "field") initializers.unshift(_);
            else descriptor[key] = _;
        }
    }
    if (target) Object.defineProperty(target, contextIn.name, descriptor);
    done = true;
};
var __runInitializers = (this && this.__runInitializers) || function (thisArg, initializers, value) {
    var useValue = arguments.length > 2;
    for (var i = 0; i < initializers.length; i++) {
        value = useValue ? initializers[i].call(thisArg, value) : initializers[i].call(thisArg);
    }
    return useValue ? value : void 0;
};
Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.SpaceContext = void 0;
const constant_1 = __webpack_require__(4);
const common_1 = __webpack_require__(46);
/**
 * Space 컨텍스트
 *
 * AuthContext와 연동하여 Space 관련 접근 권한을 제공합니다.
 *
 * @example
 * constructor(private readonly spaceCtx: SpaceContext) {}
 *
 * async getGrounds() {
 *   return this.repository.findMany({
 *     where: this.spaceCtx.spaceFilter,
 *   });
 * }
 */
let SpaceContext = (() => {
    let _classDecorators = [(0, common_1.Injectable)()];
    let _classDescriptor;
    let _classExtraInitializers = [];
    let _classThis;
    var SpaceContext = class {
        static { _classThis = this; }
        static {
            const _metadata = typeof Symbol === "function" && Symbol.metadata ? Object.create(null) : void 0;
            __esDecorate(null, _classDescriptor = { value: _classThis }, _classDecorators, { kind: "class", name: _classThis.name, metadata: _metadata }, null, _classExtraInitializers);
            SpaceContext = _classThis = _classDescriptor.value;
            if (_metadata) Object.defineProperty(_classThis, Symbol.metadata, { enumerable: true, configurable: true, writable: true, value: _metadata });
            __runInitializers(_classThis, _classExtraInitializers);
        }
        cls;
        authCtx;
        constructor(cls, authCtx) {
            this.cls = cls;
            this.authCtx = authCtx;
        }
        /** 현재 요청의 Space ID (X-Space-ID 헤더) */
        get spaceId() {
            return this.cls.get(constant_1.CONTEXT_KEYS.SPACE_ID);
        }
        /** 현재 TenantDto */
        get tenant() {
            return this.cls.get(constant_1.CONTEXT_KEYS.TENANT);
        }
        // ═══════════════════════════════════════════════════════════
        // 쿼리 필터용 Space IDs
        // AuthContext에서 가져옴 (중복 제거)
        // ═══════════════════════════════════════════════════════════
        /**
         * 쿼리 필터용 Space IDs
         * - 슈퍼매니저: undefined → 전체 조회
         * - 일반: tenants의 spaceIds
         */
        get spaceIds() {
            return this.authCtx.accessibleSpaceIds;
        }
        /**
         * Prisma Where 절용 Space 필터
         * undefined면 전체, * 필터 없음)
         * { spaceId: { in: [...] } } 형태
         */
        get spaceFilter() {
            const ids = this.spaceIds;
            return ids ? { spaceId: { in: ids } } : undefined;
        }
        /**
         * 특정 Space 접근 권한
         */
        canAccessSpace(spaceId) {
            return this.authCtx.canAccessSpace(spaceId);
        }
    };
    return SpaceContext = _classThis;
})();
exports.SpaceContext = SpaceContext;
//# sourceMappingURL=space-context.js.map

/***/ })

};
exports.runtime =
/******/ function(__webpack_require__) { // webpackRuntimeModules
/******/ /* webpack/runtime/getFullHash */
/******/ (() => {
/******/ 	__webpack_require__.h = () => ("ab4231614285de4b8a0b")
/******/ })();
/******/ 
/******/ }
;