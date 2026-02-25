"use strict";
exports.id = 0;
exports.ids = null;
exports.modules = {

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
const space_context_1 = __webpack_require__(224);
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
    __metadata("design:paramtypes", [repository_1.RoutinesRepository, typeof (_a = typeof space_context_1.SpaceContext !== "undefined" && space_context_1.SpaceContext) === "function" ? _a : Object])
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
const space_context_1 = __webpack_require__(224);
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
    __metadata("design:paramtypes", [repository_1.UsersRepository, typeof (_a = typeof space_context_1.SpaceContext !== "undefined" && space_context_1.SpaceContext) === "function" ? _a : Object, auth_cache_service_1.AuthCacheService])
], UsersService);
//# sourceMappingURL=users.service.js.map

/***/ })

};
exports.runtime =
/******/ function(__webpack_require__) { // webpackRuntimeModules
/******/ /* webpack/runtime/getFullHash */
/******/ (() => {
/******/ 	__webpack_require__.h = () => ("fb635cfb204f3adb54ce")
/******/ })();
/******/ 
/******/ }
;