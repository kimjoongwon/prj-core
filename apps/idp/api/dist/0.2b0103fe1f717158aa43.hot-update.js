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
var auth_cache_service_1 = __webpack_require__(Object(function webpackMissingModule() { var e = new Error("Cannot find module './auth-cache.service'"); e.code = 'MODULE_NOT_FOUND'; throw e; }()));
Object.defineProperty(exports, "AuthCacheService", ({ enumerable: true, get: function () { return auth_cache_service_1.AuthCacheService; } }));
var email_service_1 = __webpack_require__(Object(function webpackMissingModule() { var e = new Error("Cannot find module './email.service'"); e.code = 'MODULE_NOT_FOUND'; throw e; }()));
Object.defineProperty(exports, "EmailService", ({ enumerable: true, get: function () { return email_service_1.EmailService; } }));
var abilities_service_1 = __webpack_require__(237);
Object.defineProperty(exports, "AbilitiesService", ({ enumerable: true, get: function () { return abilities_service_1.AbilitiesService; } }));
var actions_service_1 = __webpack_require__(Object(function webpackMissingModule() { var e = new Error("Cannot find module './actions.service'"); e.code = 'MODULE_NOT_FOUND'; throw e; }()));
Object.defineProperty(exports, "ActionsService", ({ enumerable: true, get: function () { return actions_service_1.ActionsService; } }));
var categories_service_1 = __webpack_require__(Object(function webpackMissingModule() { var e = new Error("Cannot find module './categories.service'"); e.code = 'MODULE_NOT_FOUND'; throw e; }()));
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
var routines_service_1 = __webpack_require__(Object(function webpackMissingModule() { var e = new Error("Cannot find module './routines.service'"); e.code = 'MODULE_NOT_FOUND'; throw e; }()));
Object.defineProperty(exports, "RoutinesService", ({ enumerable: true, get: function () { return routines_service_1.RoutinesService; } }));
var spaces_service_1 = __webpack_require__(450);
Object.defineProperty(exports, "SpacesService", ({ enumerable: true, get: function () { return spaces_service_1.SpacesService; } }));
var subjects_service_1 = __webpack_require__(Object(function webpackMissingModule() { var e = new Error("Cannot find module './subjects.service'"); e.code = 'MODULE_NOT_FOUND'; throw e; }()));
Object.defineProperty(exports, "SubjectsService", ({ enumerable: true, get: function () { return subjects_service_1.SubjectsService; } }));
var templates_service_1 = __webpack_require__(457);
Object.defineProperty(exports, "TemplatesService", ({ enumerable: true, get: function () { return templates_service_1.TemplatesService; } }));
var timelines_service_1 = __webpack_require__(458);
Object.defineProperty(exports, "TimelinesService", ({ enumerable: true, get: function () { return timelines_service_1.TimelinesService; } }));
var token_service_1 = __webpack_require__(459);
Object.defineProperty(exports, "TokenService", ({ enumerable: true, get: function () { return token_service_1.TokenService; } }));
var token_storage_service_1 = __webpack_require__(480);
Object.defineProperty(exports, "TokenStorageService", ({ enumerable: true, get: function () { return token_storage_service_1.TokenStorageService; } }));
var translations_service_1 = __webpack_require__(Object(function webpackMissingModule() { var e = new Error("Cannot find module './translations.service'"); e.code = 'MODULE_NOT_FOUND'; throw e; }()));
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
var idp_dashboard_service_1 = __webpack_require__(Object(function webpackMissingModule() { var e = new Error("Cannot find module './idp-dashboard.service'"); e.code = 'MODULE_NOT_FOUND'; throw e; }()));
Object.defineProperty(exports, "IdpDashboardService", ({ enumerable: true, get: function () { return idp_dashboard_service_1.IdpDashboardService; } }));
var idp_account_service_1 = __webpack_require__(489);
Object.defineProperty(exports, "IdpAccountService", ({ enumerable: true, get: function () { return idp_account_service_1.IdpAccountService; } }));
//# sourceMappingURL=index.js.map

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
Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.UsersService = void 0;
const context_1 = __webpack_require__(224);
const constant_1 = __webpack_require__(4);
const be_common_1 = __webpack_require__(43);
const repository_1 = __webpack_require__(51);
const vo_1 = __webpack_require__(460);
const common_1 = __webpack_require__(46);
const auth_cache_service_1 = __webpack_require__(Object(function webpackMissingModule() { var e = new Error("Cannot find module './auth-cache.service'"); e.code = 'MODULE_NOT_FOUND'; throw e; }()));
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
    __metadata("design:paramtypes", [repository_1.UsersRepository,
        context_1.SpaceContext,
        auth_cache_service_1.AuthCacheService])
], UsersService);
//# sourceMappingURL=users.service.js.map

/***/ })

};
exports.runtime =
/******/ function(__webpack_require__) { // webpackRuntimeModules
/******/ /* webpack/runtime/getFullHash */
/******/ (() => {
/******/ 	__webpack_require__.h = () => ("e0a70eb84580e1feeb13")
/******/ })();
/******/ 
/******/ }
;