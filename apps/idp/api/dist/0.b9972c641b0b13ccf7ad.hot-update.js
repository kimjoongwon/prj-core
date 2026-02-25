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

/***/ 225:
/***/ ((__unused_webpack_module, exports, __webpack_require__) => {


Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.TranslationService = exports.I18nModule = void 0;
var i18n_module_1 = __webpack_require__(226);
Object.defineProperty(exports, "I18nModule", ({ enumerable: true, get: function () { return i18n_module_1.I18nModule; } }));
var translation_service_1 = __webpack_require__(228);
Object.defineProperty(exports, "TranslationService", ({ enumerable: true, get: function () { return translation_service_1.TranslationService; } }));
//# sourceMappingURL=index.js.map

/***/ }),

/***/ 226:
/***/ (function(__unused_webpack_module, exports, __webpack_require__) {


var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.I18nModule = void 0;
const common_1 = __webpack_require__(46);
const nestjs_i18n_1 = __webpack_require__(227);
const node_path_1 = __webpack_require__(214);
const translation_service_1 = __webpack_require__(228);
const SERVICE_PKG_ROOT = (0, node_path_1.resolve)(process.cwd(), "../../packages/be-service");
let I18nModule = class I18nModule {
};
exports.I18nModule = I18nModule;
exports.I18nModule = I18nModule = __decorate([
    (0, common_1.Module)({
        imports: [
            nestjs_i18n_1.I18nModule.forRoot({
                fallbackLanguage: "ko_KR",
                loaderOptions: {
                    path: (0, node_path_1.join)(SERVICE_PKG_ROOT, "src/i18n/locales/"),
                    watch: process.env.NODE_ENV === "development",
                },
                resolvers: [
                    new nestjs_i18n_1.QueryResolver(["lang", "language"]),
                    new nestjs_i18n_1.AcceptLanguageResolver(),
                ],
                typesOutputPath: (0, node_path_1.join)(SERVICE_PKG_ROOT, "src/i18n/generated/i18n.generated.ts"),
            }),
        ],
        providers: [translation_service_1.TranslationService],
        exports: [nestjs_i18n_1.I18nModule, translation_service_1.TranslationService],
    })
], I18nModule);
//# sourceMappingURL=i18n.module.js.map

/***/ }),

/***/ 227:
/***/ ((module) => {

module.exports = require("nestjs-i18n");

/***/ }),

/***/ 228:
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
Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.TranslationService = void 0;
const common_1 = __webpack_require__(46);
const nestjs_i18n_1 = __webpack_require__(227);
const nestjs_cls_1 = __webpack_require__(47);
const constant_1 = __webpack_require__(4);
const prisma_service_1 = __webpack_require__(229);
let TranslationService = class TranslationService {
    i18n;
    cls;
    prisma;
    constructor(i18n, cls, prisma) {
        this.i18n = i18n;
        this.cls = cls;
        this.prisma = prisma;
    }
    async translate(key) {
        const language = this.cls.get(constant_1.CONTEXT_KEYS.LANGUAGE) ?? constant_1.DEFAULT_LANGUAGE;
        const dbTranslation = await this.prisma.translation.findUnique({
            where: { languageCode_key: { languageCode: language, key } },
        });
        if (dbTranslation?.text) {
            return dbTranslation.text;
        }
        const translation = this.i18n.translate(key, { lang: language });
        if (translation !== key) {
            return translation;
        }
        if (language !== constant_1.DEFAULT_LANGUAGE) {
            const fallback = this.i18n.translate(key, {
                lang: constant_1.DEFAULT_LANGUAGE,
            });
            return fallback !== key ? fallback : key;
        }
        return key;
    }
    async getTranslation(languageCode, key) {
        const dbTranslation = await this.prisma.translation.findUnique({
            where: { languageCode_key: { languageCode, key } },
        });
        if (dbTranslation?.text) {
            return dbTranslation.text;
        }
        const translation = this.i18n.translate(key, {
            lang: languageCode,
        });
        return translation !== key ? translation : null;
    }
};
exports.TranslationService = TranslationService;
exports.TranslationService = TranslationService = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [nestjs_i18n_1.I18nService,
        nestjs_cls_1.ClsService,
        prisma_service_1.PrismaService])
], TranslationService);
//# sourceMappingURL=translation.service.js.map

/***/ }),

/***/ 229:
/***/ (function(__unused_webpack_module, exports, __webpack_require__) {


var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.PrismaService = void 0;
const prisma_1 = __webpack_require__(212);
const common_1 = __webpack_require__(46);
let PrismaService = class PrismaService extends prisma_1.PrismaClient {
    async onModuleInit() {
        await this.$connect();
    }
    async onModuleDestroy() {
        await this.$disconnect();
    }
};
exports.PrismaService = PrismaService;
exports.PrismaService = PrismaService = __decorate([
    (0, common_1.Injectable)()
], PrismaService);
//# sourceMappingURL=prisma.service.js.map

/***/ }),

/***/ 230:
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
var AuthAuditLogService_1;
Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.AuthAuditLogService = void 0;
const repository_1 = __webpack_require__(51);
const common_1 = __webpack_require__(46);
let AuthAuditLogService = AuthAuditLogService_1 = class AuthAuditLogService {
    repository;
    logger = new common_1.Logger(AuthAuditLogService_1.name);
    constructor(repository) {
        this.repository = repository;
    }
    async getAuditLogs(query) {
        this.logger.debug("감사 로그 목록 조회");
        const where = query.toPrismaWhere();
        const orderBy = query.toPrismaOrderBy();
        return this.repository.findMany({
            where,
            orderBy,
            skip: query.skip ?? 0,
            take: query.take ?? 20,
        });
    }
    async getRecentLogsByUserId(userId, limit = 10) {
        this.logger.debug(`사용자별 최근 감사 로그 조회: userId=${userId.slice(-8)}, limit=${limit}`);
        return this.repository.findByUserId(userId, limit);
    }
    async getStats() {
        this.logger.debug("감사 로그 통계 조회");
        const today = new Date();
        today.setHours(0, 0, 0, 0);
        const [todaySuccessCount, todayFailureCount, todayLockedCount, totalCount] = await Promise.all([
            this.repository.count({ result: "SUCCESS", createdAt: { gte: today } }),
            this.repository.count({ result: "FAILURE", createdAt: { gte: today } }),
            this.repository.count({ result: "LOCKED", createdAt: { gte: today } }),
            this.repository.count({}),
        ]);
        return {
            todaySuccessCount,
            todayFailureCount,
            todayLockedCount,
            totalCount,
        };
    }
};
exports.AuthAuditLogService = AuthAuditLogService;
exports.AuthAuditLogService = AuthAuditLogService = AuthAuditLogService_1 = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [repository_1.AuthAuditLogsRepository])
], AuthAuditLogService);
//# sourceMappingURL=auth-audit-log.service.js.map

/***/ }),

/***/ 231:
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
var AuthCacheService_1;
Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.AuthCacheService = void 0;
const common_1 = __webpack_require__(46);
const redis_service_1 = __webpack_require__(232);
const AUTH_USER_CACHE_PREFIX = "auth:user:";
const AUTH_USER_CACHE_MAX_TTL = 300;
let AuthCacheService = AuthCacheService_1 = class AuthCacheService {
    redisService;
    logger = new common_1.Logger(AuthCacheService_1.name);
    constructor(redisService) {
        this.redisService = redisService;
    }
    async get(userId) {
        try {
            return await this.redisService.get(`${AUTH_USER_CACHE_PREFIX}${userId}`);
        }
        catch (error) {
            this.logger.warn(`인증 캐시 조회 실패: ${error instanceof Error ? error.message : String(error)}`);
            return null;
        }
    }
    async set(userId, data, jwtRemainingSeconds) {
        const ttl = Math.min(Math.max(jwtRemainingSeconds, 1), AUTH_USER_CACHE_MAX_TTL);
        try {
            await this.redisService.set(`${AUTH_USER_CACHE_PREFIX}${userId}`, data, ttl);
        }
        catch (error) {
            this.logger.warn(`인증 캐시 저장 실패: ${error instanceof Error ? error.message : String(error)}`);
        }
    }
    async invalidate(userId) {
        try {
            await this.redisService.del(`${AUTH_USER_CACHE_PREFIX}${userId}`);
            this.logger.debug(`인증 캐시 무효화: userId=${userId}`);
        }
        catch (error) {
            this.logger.warn(`인증 캐시 무효화 실패: ${error instanceof Error ? error.message : String(error)}`);
        }
    }
};
exports.AuthCacheService = AuthCacheService;
exports.AuthCacheService = AuthCacheService = AuthCacheService_1 = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [redis_service_1.RedisService])
], AuthCacheService);
//# sourceMappingURL=auth-cache.service.js.map

/***/ }),

/***/ 232:
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
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
var RedisService_1;
Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.RedisService = void 0;
const common_1 = __webpack_require__(46);
const config_1 = __webpack_require__(233);
const ioredis_1 = __importDefault(__webpack_require__(234));
let RedisService = RedisService_1 = class RedisService {
    configService;
    logger = new common_1.Logger(RedisService_1.name);
    client;
    constructor(configService) {
        this.configService = configService;
        const redisConfig = this.configService.get("redis");
        this.logger.log(`Redis 연결 시도: ${redisConfig?.host}:${redisConfig?.port}`);
        this.client = new ioredis_1.default({
            host: redisConfig?.host || "localhost",
            port: redisConfig?.port || 6379,
            password: redisConfig?.password || undefined,
            retryStrategy: (times) => {
                this.logger.warn(`Redis 재연결 시도 ${times}회차 - host: ${redisConfig?.host}`);
                if (times > 3) {
                    this.logger.error(`Redis 연결 재시도 횟수 초과 (3회) - host: ${redisConfig?.host}`);
                    return null;
                }
                const delay = Math.min(times * 200, 2000);
                this.logger.warn(`${delay}ms 후 재시도...`);
                return delay;
            },
        });
        this.client.on("error", (err) => {
            this.logger.error(`Redis 연결 오류: ${JSON.stringify({
                message: err.message,
                code: err.code,
                host: redisConfig?.host,
                port: redisConfig?.port,
            })}`);
        });
        this.client.on("connect", () => {
            this.logger.log(`Redis 연결 성공: ${redisConfig?.host}:${redisConfig?.port}`);
        });
        this.client.on("ready", () => {
            this.logger.log("Redis 클라이언트 준비 완료");
        });
        this.client.on("close", () => {
            this.logger.warn("Redis 연결 종료됨");
        });
        this.client.on("reconnecting", () => {
            this.logger.warn("Redis 재연결 중...");
        });
    }
    async onModuleInit() {
        try {
            const result = await this.client.ping();
            this.logger.log(`Redis PING 응답: ${result}`);
        }
        catch (error) {
            const err = error;
            this.logger.error(`Redis 연결 실패: ${JSON.stringify({
                message: err.message,
                code: err.code,
            })}`);
        }
    }
    async onModuleDestroy() {
        await this.client.quit();
        this.logger.log("Redis 연결 종료");
    }
    getClient() {
        return this.client;
    }
    async set(key, value, ttlSeconds) {
        if (ttlSeconds) {
            await this.client.setex(key, ttlSeconds, value);
        }
        else {
            await this.client.set(key, value);
        }
    }
    async get(key) {
        return this.client.get(key);
    }
    async del(key) {
        return this.client.del(key);
    }
    async exists(key) {
        const result = await this.client.exists(key);
        return result === 1;
    }
    async expire(key, ttlSeconds) {
        const result = await this.client.expire(key, ttlSeconds);
        return result === 1;
    }
    async keys(pattern) {
        return this.client.keys(pattern);
    }
    async delByPattern(pattern) {
        const keys = await this.keys(pattern);
        if (keys.length === 0)
            return 0;
        return this.client.del(...keys);
    }
};
exports.RedisService = RedisService;
exports.RedisService = RedisService = RedisService_1 = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [config_1.ConfigService])
], RedisService);
//# sourceMappingURL=redis.service.js.map

/***/ }),

/***/ 234:
/***/ ((module) => {

module.exports = require("ioredis");

/***/ }),

/***/ 235:
/***/ (function(__unused_webpack_module, exports, __webpack_require__) {


var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __importStar = (this && this.__importStar) || (function () {
    var ownKeys = function(o) {
        ownKeys = Object.getOwnPropertyNames || function (o) {
            var ar = [];
            for (var k in o) if (Object.prototype.hasOwnProperty.call(o, k)) ar[ar.length] = k;
            return ar;
        };
        return ownKeys(o);
    };
    return function (mod) {
        if (mod && mod.__esModule) return mod;
        var result = {};
        if (mod != null) for (var k = ownKeys(mod), i = 0; i < k.length; i++) if (k[i] !== "default") __createBinding(result, mod, k[i]);
        __setModuleDefault(result, mod);
        return result;
    };
})();
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
var EmailService_1;
Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.EmailService = void 0;
const common_1 = __webpack_require__(46);
const config_1 = __webpack_require__(233);
const nodemailer = __importStar(__webpack_require__(236));
let EmailService = EmailService_1 = class EmailService {
    configService;
    logger = new common_1.Logger(EmailService_1.name);
    transporter = null;
    smtpConfig;
    constructor(configService) {
        this.configService = configService;
        this.smtpConfig = this.configService.get("smtp") || {
            host: process.env.SMTP_HOST || "localhost",
            port: Number(process.env.SMTP_PORT) || 587,
            username: process.env.SMTP_USERNAME || "",
            password: process.env.SMTP_PASSWORD || "",
            sender: process.env.SMTP_SENDER || "noreply@example.com",
        };
    }
    getTransporter() {
        if (this.transporter)
            return this.transporter;
        if (!this.smtpConfig.host || this.smtpConfig.host === "localhost") {
            this.logger.warn("SMTP 설정이 없습니다. 이메일 발송 대신 로그를 출력합니다.");
            return null;
        }
        this.transporter = nodemailer.createTransport({
            host: this.smtpConfig.host,
            port: this.smtpConfig.port,
            secure: this.smtpConfig.port === 465,
            auth: {
                user: this.smtpConfig.username,
                pass: this.smtpConfig.password,
            },
        });
        return this.transporter;
    }
    async sendPasswordResetEmail(email, resetUrl) {
        const subject = "비밀번호 재설정 안내";
        const html = `
			<div style="max-width: 600px; margin: 0 auto; font-family: 'Pretendard', sans-serif; color: #333;">
				<h2 style="color: #0070f3;">비밀번호 재설정</h2>
				<p>비밀번호 재설정이 요청되었습니다.</p>
				<p>아래 버튼을 클릭하여 새 비밀번호를 설정하세요.</p>
				<div style="margin: 24px 0;">
					<a href="${resetUrl}"
						style="display: inline-block; padding: 12px 24px; background-color: #0070f3; color: white; text-decoration: none; border-radius: 8px; font-weight: 600;">
						비밀번호 재설정하기
					</a>
				</div>
				<p style="color: #666; font-size: 14px;">
					이 링크는 30분간 유효하며, 1회만 사용할 수 있습니다.
				</p>
				<p style="color: #999; font-size: 12px;">
					본인이 요청하지 않은 경우 이 이메일을 무시하세요. 비밀번호는 변경되지 않습니다.
				</p>
			</div>
		`;
        await this.sendMail(email, subject, html);
    }
    async sendTemporaryPasswordEmail(email, tempPassword) {
        const subject = "임시 비밀번호 발급 안내";
        const html = `
			<div style="max-width: 600px; margin: 0 auto; font-family: 'Pretendard', sans-serif; color: #333;">
				<h2 style="color: #0070f3;">임시 비밀번호 발급</h2>
				<p>관리자에 의해 비밀번호가 재설정되었습니다.</p>
				<div style="margin: 24px 0; padding: 16px; background-color: #f5f5f5; border-radius: 8px;">
					<p style="margin: 0; font-size: 14px; color: #666;">임시 비밀번호</p>
					<p style="margin: 8px 0 0; font-size: 20px; font-weight: 700; font-family: monospace; letter-spacing: 2px;">
						${tempPassword}
					</p>
				</div>
				<p style="color: #e53e3e; font-weight: 600;">
					로그인 후 즉시 비밀번호를 변경해주세요.
				</p>
				<p style="color: #999; font-size: 12px;">
					본인이 요청하지 않은 경우 관리자에게 문의하세요.
				</p>
			</div>
		`;
        await this.sendMail(email, subject, html);
    }
    async sendMail(to, subject, html) {
        const transporter = this.getTransporter();
        if (!transporter) {
            this.logger.log(`[개발 모드] 이메일 발송 (to: ${to}, subject: ${subject})`);
            this.logger.debug(`이메일 내용:\n${html}`);
            return;
        }
        try {
            await transporter.sendMail({
                from: this.smtpConfig.sender,
                to,
                subject,
                html,
            });
            this.logger.log(`이메일 발송 성공: ${to} (${subject})`);
        }
        catch (error) {
            this.logger.error(`이메일 발송 실패: ${to} (${subject}) - ${error}`);
            throw error;
        }
    }
};
exports.EmailService = EmailService;
exports.EmailService = EmailService = EmailService_1 = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [config_1.ConfigService])
], EmailService);
//# sourceMappingURL=email.service.js.map

/***/ }),

/***/ 236:
/***/ ((module) => {

module.exports = require("nodemailer");

/***/ }),

/***/ 237:
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
var AbilitiesService_1;
Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.AbilitiesService = void 0;
const constant_1 = __webpack_require__(4);
const repository_1 = __webpack_require__(51);
const common_1 = __webpack_require__(46);
const transactional_1 = __webpack_require__(173);
let AbilitiesService = AbilitiesService_1 = class AbilitiesService {
    abilitiesRepository;
    grantsRepository;
    logger = new common_1.Logger(AbilitiesService_1.name);
    constructor(abilitiesRepository, grantsRepository) {
        this.abilitiesRepository = abilitiesRepository;
        this.grantsRepository = grantsRepository;
    }
    async getAbilityById(id) {
        this.logger.debug(`ID로 Ability 조회: id=${id.slice(-8)}`);
        return this.abilitiesRepository.findById(id);
    }
    async getAllAbilities() {
        this.logger.debug('전체 Ability 목록 조회');
        return this.abilitiesRepository.findAll();
    }
    async getRoleAbilities(roleId) {
        this.logger.debug(`Role별 권한 조회: roleId=${roleId.slice(-8)}`);
        const grants = await this.grantsRepository.findActiveByRoleIds([roleId]);
        return grants
            .filter((grant) => grant.ability)
            .map((grant) => {
            const ability = grant.ability;
            ability.priority = grant.priority;
            return ability;
        });
    }
    async getUserAbilities(userId) {
        this.logger.debug(`User별 예외 권한 조회: userId=${userId.slice(-8)}`);
        const grants = await this.grantsRepository.findActiveByUserId(userId);
        return grants
            .filter((grant) => grant.ability)
            .map((grant) => {
            const ability = grant.ability;
            ability.priority = grant.priority;
            return ability;
        });
    }
    async getMergedAbilities(roleIds, userId) {
        this.logger.debug(`권한 병합 조회: roleIds=${roleIds.length}, userId=${userId?.slice(-8) ?? "없음"}`);
        const roleGrants = await this.grantsRepository.findActiveByRoleIds(roleIds);
        const roleAbilities = roleGrants
            .filter((grant) => grant.ability)
            .map((grant) => {
            const ability = grant.ability;
            ability.priority = grant.priority;
            return ability;
        });
        const userAbilities = userId
            ? await this.grantsRepository.findActiveByUserId(userId).then((grants) => grants
                .filter((grant) => grant.ability)
                .map((grant) => {
                const ability = grant.ability;
                ability.priority = grant.priority;
                return ability;
            }))
            : [];
        const merged = [...userAbilities, ...roleAbilities];
        merged.sort((a, b) => {
            const aPriority = a.priority ?? 0;
            const bPriority = b.priority ?? 0;
            if (bPriority !== aPriority) {
                return bPriority - aPriority;
            }
            return b.createdAt.getTime() - a.createdAt.getTime();
        });
        return merged;
    }
    async createAbility(data) {
        this.logger.debug(`권한 정의 생성: name=${data.name}, subjectId=${data.subjectId}, actionId=${data.actionId}`);
        this.validateAbilityData(data);
        return this.abilitiesRepository.create(data);
    }
    async updateAbility(id, data) {
        this.logger.debug(`권한 정의 수정: id=${id.slice(-8)}`);
        return this.abilitiesRepository.updateById(id, data);
    }
    async deleteAbility(id) {
        this.logger.debug(`권한 삭제: id=${id.slice(-8)}`);
        const ability = await this.abilitiesRepository.removeById(id);
        await this.grantsRepository.removeByAbilityId(id);
        this.logger.debug(`권한 및 연결된 Grant 삭제 완료: id=${id.slice(-8)}`);
        return ability;
    }
    validateAbilityData(data) {
        if (!data.actionId || !data.subjectId || !data.name) {
            throw new common_1.BadRequestException(constant_1.ABILITY_ERRORS.INVALID_DATA);
        }
    }
};
exports.AbilitiesService = AbilitiesService;
__decorate([
    (0, transactional_1.Transactional)(),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", Promise)
], AbilitiesService.prototype, "deleteAbility", null);
exports.AbilitiesService = AbilitiesService = AbilitiesService_1 = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [repository_1.AbilitiesRepository,
        repository_1.GrantsRepository])
], AbilitiesService);
//# sourceMappingURL=abilities.service.js.map

/***/ }),

/***/ 238:
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
var ActionsService_1;
Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.ActionsService = void 0;
const constant_1 = __webpack_require__(4);
const repository_1 = __webpack_require__(51);
const common_1 = __webpack_require__(46);
let ActionsService = ActionsService_1 = class ActionsService {
    repository;
    logger = new common_1.Logger(ActionsService_1.name);
    constructor(repository) {
        this.repository = repository;
    }
    async getAllActions() {
        this.logger.debug("모든 Action 조회");
        return this.repository.findAll();
    }
    async getActionsByGroup(group) {
        this.logger.debug(`그룹별 Action 조회: group=${group}`);
        return this.repository.findByGroup(group);
    }
    async getCrudActions() {
        return this.repository.findByGroup("crud");
    }
    async getVisibilityActions() {
        return this.repository.findByGroup("visibility");
    }
    async getActionById(id) {
        this.logger.debug(`ID로 Action 조회: id=${id.slice(-8)}`);
        const action = await this.repository.findById(id);
        if (!action) {
            throw new common_1.NotFoundException(constant_1.ACTION_ERRORS.NOT_FOUND);
        }
        return action;
    }
    async getActionByName(name) {
        this.logger.debug(`이름으로 Action 조회: name=${name}`);
        const action = await this.repository.findByName(name);
        if (!action) {
            throw new common_1.NotFoundException(constant_1.ACTION_ERRORS.NOT_FOUND);
        }
        return action;
    }
    async getActionsByNames(names) {
        this.logger.debug(`여러 이름으로 Action 조회: count=${names.length}`);
        return this.repository.findByNames(names);
    }
    async createAction(data) {
        this.logger.debug(`Action 생성: name=${data.name}`);
        return this.repository.create(data);
    }
    async updateAction(id, data) {
        this.logger.debug(`Action 수정: id=${id.slice(-8)}`);
        await this.getActionById(id);
        return this.repository.updateById(id, data);
    }
    async deleteAction(id) {
        this.logger.debug(`Action 삭제: id=${id.slice(-8)}`);
        await this.getActionById(id);
        return this.repository.removeById(id);
    }
    async upsertActions(actions) {
        this.logger.debug(`다중 Action upsert: count=${actions.length}`);
        return this.repository.upsertMany(actions);
    }
};
exports.ActionsService = ActionsService;
exports.ActionsService = ActionsService = ActionsService_1 = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [repository_1.ActionsRepository])
], ActionsService);
//# sourceMappingURL=actions.service.js.map

/***/ }),

/***/ 239:
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
var CategoriesService_1;
Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.CategoriesService = void 0;
const prisma_1 = __webpack_require__(212);
const repository_1 = __webpack_require__(51);
const common_1 = __webpack_require__(46);
let CategoriesService = CategoriesService_1 = class CategoriesService {
    repository;
    logger = new common_1.Logger(CategoriesService_1.name);
    constructor(repository) {
        this.repository = repository;
    }
    async getAll(query) {
        const where = query.toPrismaWhere();
        const orderBy = query.toPrismaOrderBy();
        return this.repository.findMany({
            where,
            orderBy,
            include: { parent: true, children: true },
        });
    }
    async getById(id) {
        const category = await this.repository.findById(id, {
            parent: true,
            children: true,
            roleClassifications: {
                include: { role: true },
            },
        });
        if (!category) {
            throw new common_1.NotFoundException("카테고리를 찾을 수 없습니다");
        }
        return category;
    }
    async create(dto, spaceId) {
        this.logger.debug(`카테고리 생성 시도: name=${dto.name}`);
        const existing = await this.repository.findByName(dto.name);
        if (existing) {
            throw new common_1.ConflictException(`이미 존재하는 카테고리 이름입니다: ${dto.name}`);
        }
        if (dto.parentId) {
            const parent = await this.repository.findById(dto.parentId);
            if (!parent) {
                throw new common_1.NotFoundException("상위 카테고리를 찾을 수 없습니다");
            }
        }
        return this.repository.create({
            name: dto.name,
            type: dto.type ?? prisma_1.CategoryTypes.Role,
            parentId: dto.parentId,
            spaceId,
            creatorId: dto.creatorId,
        });
    }
    async update(id, dto) {
        this.logger.debug(`카테고리 수정 시도: ${id.slice(-8)}`);
        const category = await this.repository.findById(id);
        if (!category) {
            throw new common_1.NotFoundException("카테고리를 찾을 수 없습니다");
        }
        if (dto.parentId !== undefined && dto.parentId !== category.parentId) {
            await this.validateNoCircularReference(id, dto.parentId);
        }
        return this.repository.updateById(id, {
            ...(dto.name !== undefined && { name: dto.name }),
            ...(dto.parentId !== undefined && { parentId: dto.parentId }),
        });
    }
    async delete(id) {
        this.logger.debug(`카테고리 삭제 시도: ${id.slice(-8)}`);
        const category = await this.repository.findById(id);
        if (!category) {
            throw new common_1.NotFoundException("카테고리를 찾을 수 없습니다");
        }
        const childCount = await this.repository.countChildrenById(id);
        if (childCount > 0) {
            throw new common_1.BadRequestException(`하위 카테고리가 ${childCount}개 있어 삭제할 수 없습니다. 하위 카테고리를 먼저 삭제해주세요.`);
        }
        return this.repository.deleteById(id);
    }
    async validateNoCircularReference(categoryId, newParentId) {
        if (!newParentId)
            return;
        if (categoryId === newParentId) {
            throw new common_1.BadRequestException("자기 자신을 상위 카테고리로 설정할 수 없습니다");
        }
        const parent = await this.repository.findById(newParentId);
        if (!parent) {
            throw new common_1.NotFoundException("상위 카테고리를 찾을 수 없습니다");
        }
        const descendantIds = await this.repository.findAllDescendantIds(categoryId);
        if (descendantIds.includes(newParentId)) {
            throw new common_1.BadRequestException("하위 카테고리를 상위 카테고리로 설정할 수 없습니다 (순환 참조)");
        }
    }
};
exports.CategoriesService = CategoriesService;
exports.CategoriesService = CategoriesService = CategoriesService_1 = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [repository_1.CategoriesRepository])
], CategoriesService);
//# sourceMappingURL=categories.service.js.map

/***/ }),

/***/ 240:
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
Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.AwsService = void 0;
const client_s3_1 = __webpack_require__(241);
const common_1 = __webpack_require__(46);
const config_1 = __webpack_require__(233);
let AwsService = class AwsService {
    configService;
    s3Client;
    aws;
    constructor(configService) {
        this.configService = configService;
        const aws = this.configService.get("aws");
        if (!aws) {
            throw new Error("AWS configuration is missing");
        }
        this.aws = aws;
        this.s3Client = new client_s3_1.S3Client({
            region: aws.region,
            credentials: {
                accessKeyId: aws.accessKeyId,
                secretAccessKey: aws.secretAccessKey,
            },
        });
    }
    async uploadToS3(fileName, file, ext) {
        const command = new client_s3_1.PutObjectCommand({
            Bucket: this.aws.s3BucketName,
            Key: fileName,
            Body: file.buffer,
            ContentType: `image/${ext}`,
        });
        await this.s3Client.send(command);
        return `https://s3.${process.env.AWS_REGION}.amazonaws.com/${this.aws.s3BucketName}/${fileName}`;
    }
};
exports.AwsService = AwsService;
exports.AwsService = AwsService = __decorate([
    (0, common_1.Global)(),
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [config_1.ConfigService])
], AwsService);
//# sourceMappingURL=aws.service.js.map

/***/ }),

/***/ 241:
/***/ ((module) => {

module.exports = require("@aws-sdk/client-s3");

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
    __metadata("design:paramtypes", [repository_1.ExercisesRepository,
        context_1.SpaceContext])
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

/***/ 447:
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
var GrantsService_1;
Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.GrantsService = void 0;
const constant_1 = __webpack_require__(4);
const dto_1 = __webpack_require__(243);
const enum_1 = __webpack_require__(179);
const repository_1 = __webpack_require__(51);
const common_1 = __webpack_require__(46);
const transactional_1 = __webpack_require__(173);
let GrantsService = GrantsService_1 = class GrantsService {
    grantsRepository;
    rolesRepository;
    usersRepository;
    abilitiesRepository;
    logger = new common_1.Logger(GrantsService_1.name);
    constructor(grantsRepository, rolesRepository, usersRepository, abilitiesRepository) {
        this.grantsRepository = grantsRepository;
        this.rolesRepository = rolesRepository;
        this.usersRepository = usersRepository;
        this.abilitiesRepository = abilitiesRepository;
    }
    async create(dto) {
        this.logger.debug(`Grant 생성: granteeType=${dto.granteeType}, granteeId=${dto.granteeId.slice(-8)}, abilityId=${dto.abilityId.slice(-8)}`);
        await this.validateGrantee(dto.granteeType, dto.granteeId);
        await this.validateAbility(dto.abilityId);
        const priority = dto.priority ?? this.getDefaultPriority(dto.granteeType);
        try {
            return await this.grantsRepository.create({
                granteeType: dto.granteeType,
                granteeId: dto.granteeId,
                abilityId: dto.abilityId,
                isActive: dto.isActive ?? true,
                priority,
            });
        }
        catch (error) {
            if (error instanceof Error &&
                error.message.includes("Unique constraint")) {
                throw new common_1.BadRequestException(constant_1.GRANT_ERRORS.DUPLICATE_GRANT);
            }
            throw error;
        }
    }
    async createMany(dtos) {
        this.logger.debug(`Grant 다중 생성: count=${dtos.length}`);
        for (const dto of dtos) {
            await this.validateGrantee(dto.granteeType, dto.granteeId);
            await this.validateAbility(dto.abilityId);
        }
        const createInputs = dtos.map((dto) => ({
            granteeType: dto.granteeType,
            granteeId: dto.granteeId,
            abilityId: dto.abilityId,
            isActive: dto.isActive ?? true,
            priority: dto.priority ?? this.getDefaultPriority(dto.granteeType),
        }));
        await this.grantsRepository.createMany(createInputs);
        const grants = [];
        for (const dto of dtos) {
            const granteeType = this.toRepositoryGranteeType(dto.granteeType);
            const grant = await this.grantsRepository.findByGranteeTypeAndIds(granteeType, [dto.granteeId], { includeAbility: true });
            grants.push(...grant);
        }
        return grants;
    }
    async update(id, dto) {
        this.logger.debug(`Grant 수정: id=${id.slice(-8)}`);
        try {
            return await this.grantsRepository.updateById(id, {
                isActive: dto.isActive,
                priority: dto.priority,
            });
        }
        catch (error) {
            if (error instanceof Error &&
                error.message.includes("Record to update not found")) {
                throw new common_1.NotFoundException(constant_1.GRANT_ERRORS.NOT_FOUND);
            }
            throw error;
        }
    }
    async delete(id) {
        this.logger.debug(`Grant 삭제: id=${id.slice(-8)}`);
        try {
            await this.grantsRepository.removeById(id);
        }
        catch (error) {
            if (error instanceof Error &&
                error.message.includes("Record to update not found")) {
                throw new common_1.NotFoundException(constant_1.GRANT_ERRORS.NOT_FOUND);
            }
            throw error;
        }
    }
    async findByRoleIds(roleIds) {
        this.logger.debug(`Role ID로 Grant 조회: roleIds.length=${roleIds.length}`);
        return this.grantsRepository.findActiveByRoleIds(roleIds);
    }
    async findByUserId(userId) {
        this.logger.debug(`User ID로 Grant 조회: userId=${userId.slice(-8)}`);
        return this.grantsRepository.findActiveByUserId(userId);
    }
    async findByAbilityId(abilityId) {
        this.logger.debug(`Ability ID로 Grant 조회: abilityId=${abilityId.slice(-8)}`);
        return this.grantsRepository.findByAbilityId(abilityId);
    }
    async batchAssignToRole(roleId, items) {
        const role = await this.rolesRepository.findById(roleId);
        if (!role) {
            throw new common_1.NotFoundException(constant_1.GRANT_ERRORS.ROLE_NOT_FOUND);
        }
        const existingGrants = await this.grantsRepository.findByGranteeTypeAndIds(enum_1.GranteeType.Role, [roleId], { includeAbility: true });
        const existingMap = new Map(existingGrants.map(g => [g.abilityId, g]));
        const newMap = new Map(items.map(item => [item.abilityId, item]));
        const toCreate = items.filter(item => !existingMap.has(item.abilityId));
        const toRemove = existingGrants.filter(g => !newMap.has(g.abilityId));
        const toUpdate = items.filter(item => {
            const existing = existingMap.get(item.abilityId);
            if (!existing)
                return false;
            return existing.isActive !== (item.isActive ?? true) ||
                existing.priority !== (item.priority ?? 0);
        });
        for (const item of toCreate) {
            await this.validateAbility(item.abilityId);
        }
        for (const grant of toRemove) {
            await this.grantsRepository.removeById(grant.id);
        }
        if (toCreate.length > 0) {
            const createInputs = toCreate.map(item => ({
                granteeType: dto_1.GranteeTypeEnum.Role,
                granteeId: roleId,
                abilityId: item.abilityId,
                isActive: item.isActive ?? true,
                priority: item.priority ?? 0,
            }));
            await this.grantsRepository.createMany(createInputs);
        }
        for (const item of toUpdate) {
            const existing = existingMap.get(item.abilityId);
            await this.grantsRepository.updateById(existing.id, {
                isActive: item.isActive ?? true,
                priority: item.priority ?? 0,
            });
        }
        return this.grantsRepository.findByGranteeTypeAndIds(enum_1.GranteeType.Role, [roleId], { includeAbility: true });
    }
    async validateGrantee(granteeType, granteeId) {
        if (granteeType === dto_1.GranteeTypeEnum.Role) {
            const role = await this.rolesRepository.findById(granteeId);
            if (!role) {
                throw new common_1.NotFoundException(constant_1.GRANT_ERRORS.ROLE_NOT_FOUND);
            }
        }
        else if (granteeType === dto_1.GranteeTypeEnum.User) {
            const user = await this.usersRepository.findById(granteeId);
            if (!user) {
                throw new common_1.NotFoundException(constant_1.GRANT_ERRORS.USER_NOT_FOUND);
            }
        }
    }
    async validateAbility(abilityId) {
        const ability = await this.abilitiesRepository.findById(abilityId);
        if (!ability) {
            throw new common_1.NotFoundException(constant_1.GRANT_ERRORS.ABILITY_NOT_FOUND);
        }
    }
    getDefaultPriority(granteeType) {
        return granteeType === dto_1.GranteeTypeEnum.Role ? 0 : 10;
    }
    toRepositoryGranteeType(granteeType) {
        return granteeType === dto_1.GranteeTypeEnum.Role
            ? enum_1.GranteeType.Role
            : enum_1.GranteeType.User;
    }
};
exports.GrantsService = GrantsService;
__decorate([
    (0, transactional_1.Transactional)(),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [dto_1.CreateGrantDto]),
    __metadata("design:returntype", Promise)
], GrantsService.prototype, "create", null);
__decorate([
    (0, transactional_1.Transactional)(),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Array]),
    __metadata("design:returntype", Promise)
], GrantsService.prototype, "createMany", null);
__decorate([
    (0, transactional_1.Transactional)(),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, Array]),
    __metadata("design:returntype", Promise)
], GrantsService.prototype, "batchAssignToRole", null);
exports.GrantsService = GrantsService = GrantsService_1 = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [repository_1.GrantsRepository,
        repository_1.RolesRepository,
        repository_1.UsersRepository,
        repository_1.AbilitiesRepository])
], GrantsService);
//# sourceMappingURL=grants.service.js.map

/***/ }),

/***/ 448:
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
var GroupsService_1;
Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.GroupsService = void 0;
const prisma_1 = __webpack_require__(212);
const repository_1 = __webpack_require__(51);
const common_1 = __webpack_require__(46);
let GroupsService = GroupsService_1 = class GroupsService {
    repository;
    logger = new common_1.Logger(GroupsService_1.name);
    constructor(repository) {
        this.repository = repository;
    }
    async getAll(query) {
        const where = query.toPrismaWhere();
        const orderBy = query.toPrismaOrderBy();
        return this.repository.findMany({ where, orderBy });
    }
    async getById(id) {
        const group = await this.repository.findById(id, {
            roleAssociations: {
                include: { role: true },
            },
        });
        if (!group) {
            throw new common_1.NotFoundException("그룹을 찾을 수 없습니다");
        }
        return group;
    }
    async create(dto, spaceId) {
        this.logger.debug(`그룹 생성 시도: name=${dto.name}`);
        const existing = await this.repository.findMany({
            where: {
                name: dto.name,
                type: dto.type ?? prisma_1.GroupTypes.Role,
                spaceId,
            },
        });
        if (existing.length > 0) {
            throw new common_1.ConflictException(`이미 존재하는 그룹 이름입니다: ${dto.name}`);
        }
        return this.repository.create({
            name: dto.name,
            label: dto.label,
            type: dto.type ?? prisma_1.GroupTypes.Role,
            spaceId,
            creatorId: dto.creatorId,
        });
    }
    async update(id, dto) {
        this.logger.debug(`그룹 수정 시도: ${id.slice(-8)}`);
        const group = await this.repository.findById(id);
        if (!group) {
            throw new common_1.NotFoundException("그룹을 찾을 수 없습니다");
        }
        return this.repository.updateById(id, {
            ...(dto.label !== undefined && { label: dto.label }),
            ...(dto.name !== undefined && { name: dto.name }),
        });
    }
    async delete(id) {
        this.logger.debug(`그룹 삭제 시도: ${id.slice(-8)}`);
        const group = await this.repository.findById(id);
        if (!group) {
            throw new common_1.NotFoundException("그룹을 찾을 수 없습니다");
        }
        return this.repository.deleteById(id);
    }
};
exports.GroupsService = GroupsService;
exports.GroupsService = GroupsService = GroupsService_1 = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [repository_1.GroupsRepository])
], GroupsService);
//# sourceMappingURL=groups.service.js.map

/***/ }),

/***/ 449:
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
var GroundsService_1;
Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.GroundsService = void 0;
const dto_1 = __webpack_require__(243);
const repository_1 = __webpack_require__(51);
const common_1 = __webpack_require__(46);
const transactional_1 = __webpack_require__(173);
const spaces_service_1 = __webpack_require__(450);
let GroundsService = GroundsService_1 = class GroundsService {
    repository;
    spacesService;
    logger = new common_1.Logger(GroundsService_1.name);
    constructor(repository, spacesService) {
        this.repository = repository;
        this.spacesService = spacesService;
    }
    getAll() {
        return this.repository.findAll();
    }
    async getById(id) {
        this.logger.debug(`시설 상세 조회: ${id.slice(-8)}`);
        const ground = await this.repository.findById(id);
        if (!ground) {
            throw new common_1.NotFoundException("시설을 찾을 수 없습니다.");
        }
        return ground;
    }
    getMyGrounds(spaceId) {
        if (!spaceId) {
            return this.repository.findAll();
        }
        return this.repository.findManyBySpaceId(spaceId);
    }
    async createGround(dto) {
        this.logger.debug(`시설 등록 시도: businessNo=${dto.businessNo}`);
        const existing = await this.repository.findByBusinessNo(dto.businessNo);
        if (existing) {
            throw new common_1.ConflictException(`이미 등록된 사업자등록번호입니다: ${dto.businessNo}`);
        }
        const space = await this.spacesService.create();
        this.logger.debug(`시설용 Space 생성 완료: ${space.id.slice(-8)}`);
        return this.repository.create({
            name: dto.name,
            label: dto.label ?? null,
            address: dto.address,
            phone: dto.phone,
            email: dto.email,
            businessNo: dto.businessNo,
            logoImageFileId: dto.logoImageFileId ?? null,
            imageFileId: dto.imageFileId ?? null,
            spaceId: space.id,
        });
    }
    async updateGround(id, dto) {
        this.logger.debug(`시설 수정 시도: ${id.slice(-8)}`);
        const ground = await this.repository.findById(id);
        if (!ground) {
            throw new common_1.NotFoundException("시설을 찾을 수 없습니다.");
        }
        return this.repository.updateById(id, {
            ...(dto.name !== undefined && { name: dto.name }),
            ...(dto.label !== undefined && { label: dto.label }),
            ...(dto.address !== undefined && { address: dto.address }),
            ...(dto.phone !== undefined && { phone: dto.phone }),
            ...(dto.email !== undefined && { email: dto.email }),
            ...(dto.logoImageFileId !== undefined && {
                logoImageFileId: dto.logoImageFileId,
            }),
            ...(dto.imageFileId !== undefined && {
                imageFileId: dto.imageFileId,
            }),
        });
    }
    async removeGround(id) {
        this.logger.debug(`시설 삭제 시도: ${id.slice(-8)}`);
        const ground = await this.repository.findById(id);
        if (!ground) {
            throw new common_1.NotFoundException("시설을 찾을 수 없습니다.");
        }
        await this.repository.removeById(id);
    }
};
exports.GroundsService = GroundsService;
__decorate([
    (0, transactional_1.Transactional)(),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [dto_1.CreateGroundDto]),
    __metadata("design:returntype", Promise)
], GroundsService.prototype, "createGround", null);
exports.GroundsService = GroundsService = GroundsService_1 = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [repository_1.GroundsRepository,
        spaces_service_1.SpacesService])
], GroundsService);
//# sourceMappingURL=grounds.service.js.map

/***/ }),

/***/ 450:
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
var SpacesService_1;
Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.SpacesService = void 0;
const repository_1 = __webpack_require__(51);
const common_1 = __webpack_require__(46);
let SpacesService = SpacesService_1 = class SpacesService {
    repository;
    logger = new common_1.Logger(SpacesService_1.name);
    constructor(repository) {
        this.repository = repository;
    }
    getById(id) {
        return this.repository.findById(id);
    }
    createPersonalSpace() {
        this.logger.debug("개인 Space 생성");
        return this.repository.create();
    }
    create(data) {
        return this.repository.create(data);
    }
    getAccessibleSpaceIds(spaceId) {
        return this.repository.findSpaceIdsByCategoryHierarchy(spaceId);
    }
    findByIdsWithGround(ids) {
        return this.repository.findByIdsWithGround(ids);
    }
    removeById(id) {
        return this.repository.removeById(id);
    }
};
exports.SpacesService = SpacesService;
exports.SpacesService = SpacesService = SpacesService_1 = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [repository_1.SpacesRepository])
], SpacesService);
//# sourceMappingURL=spaces.service.js.map

/***/ }),

/***/ 451:
/***/ (function(__unused_webpack_module, exports, __webpack_require__) {


var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.createPrismaClient = createPrismaClient;
const prisma_1 = __webpack_require__(212);
const common_1 = __webpack_require__(46);
const adapter_pg_1 = __webpack_require__(452);
const pg_1 = __importDefault(__webpack_require__(453));
function createPrismaClient(configService) {
    const logger = new common_1.Logger("PrismaFactory");
    try {
        logger.log("PrismaClient 생성 시작...");
        const databaseUrl = configService.get("DATABASE_URL");
        logger.debug(`DATABASE_URL: ${databaseUrl ? "설정됨" : "설정 안됨"}`);
        if (!databaseUrl) {
            const error = new Error("DATABASE_URL is not defined in environment variables");
            logger.error(error.message);
            throw error;
        }
        logger.log("PostgreSQL connection pool 생성 중...");
        const pool = new pg_1.default.Pool({
            connectionString: databaseUrl,
            max: 20,
            idleTimeoutMillis: 30000,
            connectionTimeoutMillis: 2000,
        });
        logger.log("Prisma PostgreSQL Adapter 생성 중...");
        const adapter = new adapter_pg_1.PrismaPg(pool);
        logger.log("PrismaClient 인스턴스 생성 중...");
        const prismaClient = new prisma_1.PrismaClient({
            adapter,
            log: configService.get("NODE_ENV") === "development"
                ? ["query", "error", "warn"]
                : ["error"],
        });
        logger.log("PrismaClient 생성 완료!");
        return prismaClient;
    }
    catch (error) {
        logger.error("PrismaClient 생성 중 에러 발생:", error);
        throw error;
    }
}
//# sourceMappingURL=prisma.factory.js.map

/***/ }),

/***/ 454:
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
var RolesService_1;
Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.RolesService = void 0;
const constant_1 = __webpack_require__(4);
const repository_1 = __webpack_require__(51);
const common_1 = __webpack_require__(46);
let RolesService = RolesService_1 = class RolesService {
    repository;
    logger = new common_1.Logger(RolesService_1.name);
    constructor(repository) {
        this.repository = repository;
    }
    getById(id) {
        return this.repository.findById(id);
    }
    getDefaultUserRole() {
        this.logger.debug("기본 사용자 역할(VIEW) 조회");
        return this.repository.findByName(constant_1.SYSTEM_ROLES.VIEW);
    }
    getAll() {
        return this.repository.findAll();
    }
    async create(dto) {
        this.logger.debug(`역할 생성 시도: name=${dto.name}`);
        const existing = await this.repository.findByName(dto.name);
        if (existing) {
            throw new common_1.ConflictException(`이미 존재하는 역할 이름입니다: ${dto.name}`);
        }
        return this.repository.create({
            name: dto.name,
            displayName: dto.displayName,
            description: dto.description,
            isSystem: false,
        });
    }
    async update(id, dto) {
        this.logger.debug(`역할 수정 시도: ${id.slice(-8)}`);
        const role = await this.repository.findById(id);
        if (!role) {
            throw new common_1.NotFoundException("역할을 찾을 수 없습니다");
        }
        if (role.isSystem) {
            throw new common_1.ForbiddenException("시스템 역할은 수정할 수 없습니다");
        }
        return this.repository.updateById(id, {
            displayName: dto.displayName,
            description: dto.description,
        });
    }
    async delete(id) {
        this.logger.debug(`역할 삭제 시도: ${id.slice(-8)}`);
        const role = await this.repository.findById(id);
        if (!role) {
            throw new common_1.NotFoundException("역할을 찾을 수 없습니다");
        }
        if (role.isSystem) {
            throw new common_1.ForbiddenException("시스템 역할은 삭제할 수 없습니다");
        }
        const tenantCount = await this.repository.countTenantsByRoleId(id);
        if (tenantCount > 0) {
            throw new common_1.BadRequestException(`이 역할에 ${tenantCount}명의 사용자가 연결되어 있습니다. 먼저 사용자의 역할을 변경해주세요.`);
        }
        return this.repository.deleteById(id);
    }
};
exports.RolesService = RolesService;
exports.RolesService = RolesService = RolesService_1 = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [repository_1.RolesRepository])
], RolesService);
//# sourceMappingURL=roles.service.js.map

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
    __metadata("design:paramtypes", [repository_1.RoutinesRepository,
        context_1.SpaceContext])
], RoutinesService);
//# sourceMappingURL=routines.service.js.map

/***/ }),

/***/ 456:
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
var SubjectsService_1;
Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.SubjectsService = void 0;
const prisma_1 = __webpack_require__(212);
const repository_1 = __webpack_require__(51);
const common_1 = __webpack_require__(46);
let SubjectsService = SubjectsService_1 = class SubjectsService {
    repository;
    logger = new common_1.Logger(SubjectsService_1.name);
    cachedFieldsByModel = null;
    constructor(repository) {
        this.repository = repository;
    }
    async getSubjects() {
        this.logger.debug("모든 Subject 조회");
        const subjects = await this.repository.findAll();
        await this.loadFieldsCache();
        return subjects.map((subject) => this.toSubjectInfo(subject));
    }
    async getSubjectsByGroup(group) {
        this.logger.debug(`그룹별 Subject 조회: ${group}`);
        const subjects = await this.repository.findByGroup(group);
        await this.loadFieldsCache();
        return subjects.map((subject) => this.toSubjectInfo(subject));
    }
    async getSubjectById(id) {
        this.logger.debug(`Subject ID로 조회: ${id}`);
        const subject = await this.repository.findById(id);
        if (!subject) {
            return null;
        }
        await this.loadFieldsCache();
        return this.toSubjectInfo(subject);
    }
    async getSubjectByName(name) {
        this.logger.debug(`Subject 조회: ${name}`);
        const subject = await this.repository.findByName(name);
        if (!subject) {
            return null;
        }
        await this.loadFieldsCache();
        return this.toSubjectInfo(subject);
    }
    async getSubjectNames() {
        const subjects = await this.repository.findAll();
        return subjects.map((s) => s.name);
    }
    async getSubjectFields(subjectName) {
        this.logger.debug(`Subject 필드 조회: ${subjectName}`);
        await this.loadFieldsCache();
        return this.getFieldsForSubject(subjectName);
    }
    async isValidSubject(subjectName) {
        const subject = await this.repository.findByName(subjectName);
        return !!subject;
    }
    async getSubjectNameById(id) {
        const subject = await this.repository.findById(id);
        return subject?.name ?? null;
    }
    async getSubjectIdByName(name) {
        const subject = await this.repository.findByName(name);
        return subject?.id ?? null;
    }
    toSubjectInfo(subject) {
        return {
            id: subject.id,
            name: subject.name,
            displayName: subject.displayName,
            icon: subject.icon,
            group: subject.group,
            order: subject.order,
            isSystem: subject.isSystem,
            fields: this.getFieldsForSubject(subject.name),
        };
    }
    async loadFieldsCache() {
        if (this.cachedFieldsByModel) {
            return;
        }
        this.cachedFieldsByModel = new Map();
        try {
            const parser = await (0, prisma_1.getDmmfParser)();
            const models = parser.parseModels();
            for (const model of models) {
                const fields = parser.parseFieldsByModel(model.name);
                this.cachedFieldsByModel.set(model.name, fields.map((field) => ({
                    name: field.name,
                    displayName: field.displayName,
                    type: "String",
                    isRequired: false,
                    isRelation: false,
                })));
            }
        }
        catch (error) {
            this.logger.warn("DMMF 파싱 실패, 필드 정보를 로드할 수 없습니다.", error);
        }
    }
    getFieldsForSubject(subjectName) {
        if (!this.cachedFieldsByModel) {
            return [];
        }
        if (subjectName.startsWith("entity:")) {
            const modelName = subjectName.substring(7);
            return this.cachedFieldsByModel.get(modelName) ?? [];
        }
        return this.cachedFieldsByModel.get(subjectName) ?? [];
    }
    clearCache() {
        this.cachedFieldsByModel = null;
        this.logger.debug("Subject 필드 캐시 초기화됨");
    }
};
exports.SubjectsService = SubjectsService;
exports.SubjectsService = SubjectsService = SubjectsService_1 = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [repository_1.SubjectsRepository])
], SubjectsService);
//# sourceMappingURL=subjects.service.js.map

/***/ }),

/***/ 457:
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
var TemplatesService_1;
Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.TemplatesService = void 0;
const prisma_1 = __webpack_require__(212);
const repository_1 = __webpack_require__(51);
const common_1 = __webpack_require__(46);
let TemplatesService = TemplatesService_1 = class TemplatesService {
    repository;
    logger = new common_1.Logger(TemplatesService_1.name);
    constructor(repository) {
        this.repository = repository;
    }
    async getTemplates(query) {
        const where = query.toPrismaWhere();
        const orderBy = query.toPrismaOrderBy();
        return this.repository.findMany({
            where,
            orderBy,
            skip: query.skip,
            take: query.take,
        });
    }
    async getTemplateById(id) {
        const template = await this.repository.findById(id);
        if (!template) {
            throw new common_1.NotFoundException("템플릿을 찾을 수 없습니다");
        }
        return template;
    }
    async create(dto) {
        this.logger.debug(`템플릿 생성 시도: code=${dto.code}`);
        const existing = await this.repository.findByCode(dto.code);
        if (existing) {
            throw new common_1.ConflictException(`이미 존재하는 템플릿 코드입니다: ${dto.code}`);
        }
        this.validateTypeConstraints(dto.type, dto.subject, dto.content);
        const templateData = {
            code: dto.code,
            name: dto.name,
            type: dto.type,
            subject: dto.subject ?? null,
            content: dto.content,
            description: dto.description ?? null,
        };
        if (dto.variables && dto.variables.length > 0) {
            return this.repository.createWithVariables(templateData, dto.variables.map((v) => ({
                name: v.name,
                description: v.description,
                defaultValue: v.defaultValue,
                isRequired: v.isRequired,
            })));
        }
        return this.repository.create(templateData);
    }
    async update(id, dto) {
        this.logger.debug(`템플릿 수정 시도: ${id.slice(-8)}`);
        const template = await this.repository.findByIdOrThrow(id);
        this.validateTypeConstraints(template.type, dto.subject !== undefined ? dto.subject : template.subject, dto.content !== undefined ? dto.content : template.content);
        const templateData = {};
        if (dto.name !== undefined)
            templateData.name = dto.name;
        if (dto.subject !== undefined)
            templateData.subject = dto.subject;
        if (dto.content !== undefined)
            templateData.content = dto.content;
        if (dto.description !== undefined)
            templateData.description = dto.description;
        if (dto.variables !== undefined) {
            return this.repository.updateWithVariables(id, templateData, (dto.variables ?? []).map((v) => ({
                name: v.name,
                description: v.description,
                defaultValue: v.defaultValue,
                isRequired: v.isRequired,
            })));
        }
        return this.repository.updateById(id, templateData);
    }
    async remove(id) {
        this.logger.debug(`템플릿 삭제 시도: ${id.slice(-8)}`);
        await this.repository.findByIdOrThrow(id);
        return this.repository.removeById(id);
    }
    async toggleStatus(id) {
        this.logger.debug(`템플릿 상태 토글: ${id.slice(-8)}`);
        const template = await this.repository.findByIdOrThrow(id);
        await this.repository.updateById(id, {
            isActive: !template.isActive,
        });
        return this.getTemplateById(id);
    }
    async preview(id, dto) {
        const template = await this.repository.findByIdOrThrow(id);
        const result = this.substituteVariables(template, dto.variables);
        return {
            type: template.type,
            subject: result.subject,
            content: result.content,
            unresolvedVariables: result.unresolvedVariables,
        };
    }
    async sendTest(id, dto) {
        this.logger.debug(`템플릿 테스트 발송: ${id.slice(-8)}`);
        const template = await this.repository.findByIdOrThrow(id);
        if (!template.isActive) {
            throw new common_1.BadRequestException("비활성 템플릿은 테스트 발송할 수 없습니다");
        }
        if (template.variables && template.variables.length > 0) {
            const missingVariables = template.variables
                .filter((v) => v.isRequired &&
                !dto.variables[v.name] &&
                !v.defaultValue)
                .map((v) => v.name);
            if (missingVariables.length > 0) {
                throw new common_1.BadRequestException(`필수 변수가 누락되었습니다: ${missingVariables.join(", ")}`);
            }
        }
        this.validateRecipient(template.type, dto.recipient);
        const substituted = this.substituteVariables(template, dto.variables);
        this.logger.warn(`[테스트 발송] type=${template.type}, recipient=${dto.recipient}, ` +
            `subject=${substituted.subject}, contentLength=${substituted.content.length}`);
        return {
            success: true,
            sentAt: new Date().toISOString(),
            errorMessage: null,
        };
    }
    validateTypeConstraints(type, subject, content) {
        if ((type === prisma_1.TemplateType.EMAIL || type === prisma_1.TemplateType.PUSH) &&
            !subject) {
            throw new common_1.BadRequestException(`${type} 유형 템플릿은 제목(subject)이 필수입니다`);
        }
        if (type === prisma_1.TemplateType.PUSH && subject && subject.length > 50) {
            throw new common_1.BadRequestException("PUSH 템플릿의 제목은 50자를 초과할 수 없습니다");
        }
        if (type === prisma_1.TemplateType.PUSH &&
            content &&
            content.length > 200) {
            throw new common_1.BadRequestException("PUSH 템플릿의 본문은 200자를 초과할 수 없습니다");
        }
    }
    validateRecipient(type, recipient) {
        if (!recipient || recipient.trim().length === 0) {
            throw new common_1.BadRequestException("수신자를 입력해주세요");
        }
        switch (type) {
            case prisma_1.TemplateType.EMAIL: {
                const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
                if (!emailRegex.test(recipient)) {
                    throw new common_1.BadRequestException("올바른 이메일 주소를 입력해주세요");
                }
                break;
            }
            case prisma_1.TemplateType.SMS: {
                const phoneRegex = /^(\+?\d{1,4}[-\s]?)?\d{8,15}$/;
                if (!phoneRegex.test(recipient.replace(/[-\s]/g, ""))) {
                    throw new common_1.BadRequestException("올바른 전화번호를 입력해주세요");
                }
                break;
            }
            case prisma_1.TemplateType.PUSH: {
                break;
            }
        }
    }
    substituteVariables(template, variables) {
        let subject = template.subject;
        let content = template.content;
        for (const [key, value] of Object.entries(variables)) {
            const placeholder = `{{${key}}}`;
            if (subject) {
                subject = subject.replaceAll(placeholder, value);
            }
            content = content.replaceAll(placeholder, value);
        }
        if (template.variables && template.variables.length > 0) {
            for (const variable of template.variables) {
                if (variable.defaultValue) {
                    const placeholder = `{{${variable.name}}}`;
                    if (subject) {
                        subject = subject.replaceAll(placeholder, variable.defaultValue);
                    }
                    content = content.replaceAll(placeholder, variable.defaultValue);
                }
            }
        }
        const unresolvedRegex = /\{\{(\w+)\}\}/g;
        const unresolvedSet = new Set();
        let match;
        if (subject) {
            match = unresolvedRegex.exec(subject);
            while (match !== null) {
                unresolvedSet.add(match[1]);
                match = unresolvedRegex.exec(subject);
            }
        }
        unresolvedRegex.lastIndex = 0;
        match = unresolvedRegex.exec(content);
        while (match !== null) {
            unresolvedSet.add(match[1]);
            match = unresolvedRegex.exec(content);
        }
        return {
            subject,
            content,
            unresolvedVariables: [...unresolvedSet],
        };
    }
};
exports.TemplatesService = TemplatesService;
exports.TemplatesService = TemplatesService = TemplatesService_1 = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [repository_1.TemplatesRepository])
], TemplatesService);
//# sourceMappingURL=templates.service.js.map

/***/ }),

/***/ 458:
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
var TimelinesService_1;
Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.TimelinesService = void 0;
const constant_1 = __webpack_require__(4);
const prisma_1 = __webpack_require__(212);
const repository_1 = __webpack_require__(51);
const common_1 = __webpack_require__(46);
let TimelinesService = TimelinesService_1 = class TimelinesService {
    repository;
    logger = new common_1.Logger(TimelinesService_1.name);
    constructor(repository) {
        this.repository = repository;
    }
    async findTimelines(params) {
        this.logger.debug(`타임라인 목록 조회: spaceId=${params.spaceId.slice(-8)}`);
        const [timelines, total] = await this.repository.findManyTimelines(params);
        return { timelines, total };
    }
    async findTimelineForSpace(timelineId, spaceId) {
        this.logger.debug(`타임라인 상세 조회: ${timelineId.slice(-8)}`);
        const timeline = await this.repository.findTimelineById(timelineId, spaceId);
        if (!timeline) {
            throw new common_1.NotFoundException(constant_1.TIMELINE_ERRORS.TIMELINE_NOT_FOUND);
        }
        return timeline;
    }
    async createTimeline(input, spaceId, creatorId) {
        this.logger.debug(`타임라인 생성: name=${input.name}`);
        const duplicateCount = await this.repository.countTimelinesWithName(input.name, spaceId);
        if (duplicateCount > 0) {
            throw new common_1.BadRequestException(constant_1.TIMELINE_ERRORS.TIMELINE_NAME_DUPLICATED);
        }
        return this.repository.createTimeline({
            name: input.name,
            description: input.description ?? null,
            spaceId,
            creatorId,
        });
    }
    async updateTimelineForSpace(timelineId, input, spaceId) {
        this.logger.debug(`타임라인 수정: ${timelineId.slice(-8)}`);
        const timeline = await this.findTimelineForSpace(timelineId, spaceId);
        if (input.name && input.name !== timeline.name) {
            const duplicateCount = await this.repository.countTimelinesWithName(input.name, spaceId, timelineId);
            if (duplicateCount > 0) {
                throw new common_1.BadRequestException(constant_1.TIMELINE_ERRORS.TIMELINE_NAME_DUPLICATED);
            }
        }
        const updateData = {};
        if (input.name !== undefined)
            updateData.name = input.name;
        if (input.description !== undefined)
            updateData.description = input.description;
        return this.repository.updateTimeline(timelineId, updateData);
    }
    async deleteTimelineFromSpace(timelineId, spaceId) {
        this.logger.debug(`타임라인 삭제: ${timelineId.slice(-8)}`);
        const timeline = await this.findTimelineForSpace(timelineId, spaceId);
        if (timeline._count.sessions > 0) {
            throw new common_1.BadRequestException(constant_1.TIMELINE_ERRORS.TIMELINE_HAS_SESSIONS);
        }
        await this.repository.softDeleteTimeline(timelineId);
    }
    async findSessionsInTimeline(timelineId, params) {
        this.logger.debug(`세션 목록 조회: timelineId=${timelineId.slice(-8)}`);
        const [sessions, total] = await this.repository.findManySessions(timelineId, params);
        return { sessions, total };
    }
    async findSessionInTimeline(timelineId, sessionId) {
        this.logger.debug(`세션 상세 조회: ${sessionId.slice(-8)}`);
        const session = await this.repository.findSessionById(timelineId, sessionId);
        if (!session) {
            throw new common_1.NotFoundException(constant_1.TIMELINE_ERRORS.SESSION_NOT_FOUND);
        }
        return session;
    }
    async createSessionInTimeline(timelineId, input) {
        this.logger.debug(`세션 생성: timelineId=${timelineId.slice(-8)}, type=${input.type}`);
        this.validateSessionTypeConstraints(input);
        return this.repository.createSession({
            name: input.name,
            type: input.type,
            timelineId,
            description: input.description ?? null,
            startDateTime: input.startDateTime ?? null,
            endDateTime: input.endDateTime ?? null,
            recurringDayOfWeek: input.recurringDayOfWeek ?? null,
            repeatCycleType: input.repeatCycleType ?? null,
        });
    }
    async updateSessionInTimeline(timelineId, sessionId, input) {
        this.logger.debug(`세션 수정: ${sessionId.slice(-8)}`);
        const existing = await this.findSessionInTimeline(timelineId, sessionId);
        const updateData = {};
        if (input.name !== undefined)
            updateData.name = input.name;
        if (input.description !== undefined)
            updateData.description = input.description;
        if (input.type !== undefined && input.type !== existing.type) {
            updateData.type = input.type;
            updateData.startDateTime = null;
            updateData.endDateTime = null;
            updateData.recurringDayOfWeek = null;
            updateData.repeatCycleType = null;
        }
        if (input.startDateTime !== undefined) {
            updateData.startDateTime = input.startDateTime;
        }
        if (input.endDateTime !== undefined)
            updateData.endDateTime = input.endDateTime;
        if (input.recurringDayOfWeek !== undefined) {
            updateData.recurringDayOfWeek =
                input.recurringDayOfWeek ?? null;
        }
        if (input.repeatCycleType !== undefined) {
            updateData.repeatCycleType =
                input.repeatCycleType ?? null;
        }
        const finalType = updateData.type ?? existing.type;
        const finalStartDateTime = updateData.startDateTime !== undefined
            ? updateData.startDateTime
            : existing.startDateTime;
        const finalEndDateTime = updateData.endDateTime !== undefined
            ? updateData.endDateTime
            : existing.endDateTime;
        const finalRecurringDayOfWeek = updateData.recurringDayOfWeek !== undefined
            ? updateData.recurringDayOfWeek
            : existing.recurringDayOfWeek;
        const finalRepeatCycleType = updateData.repeatCycleType !== undefined
            ? updateData.repeatCycleType
            : existing.repeatCycleType;
        this.validateSessionTypeConstraints({
            type: finalType,
            startDateTime: finalStartDateTime,
            endDateTime: finalEndDateTime,
            recurringDayOfWeek: finalRecurringDayOfWeek,
            repeatCycleType: finalRepeatCycleType,
        });
        return this.repository.updateSession(sessionId, updateData);
    }
    async deleteSessionFromTimeline(timelineId, sessionId) {
        this.logger.debug(`세션 삭제: ${sessionId.slice(-8)}`);
        const session = await this.findSessionInTimeline(timelineId, sessionId);
        if (session._count.programs > 0) {
            throw new common_1.BadRequestException(constant_1.TIMELINE_ERRORS.SESSION_HAS_PROGRAMS);
        }
        await this.repository.softDeleteSession(sessionId);
    }
    async findProgramsInSession(sessionId, params) {
        this.logger.debug(`프로그램 목록 조회: sessionId=${sessionId.slice(-8)}`);
        const [programs, total] = await this.repository.findManyPrograms(sessionId, params);
        return { programs, total };
    }
    async findProgramInSession(sessionId, programId) {
        this.logger.debug(`프로그램 상세 조회: ${programId.slice(-8)}`);
        const program = await this.repository.findProgramById(sessionId, programId);
        if (!program) {
            throw new common_1.NotFoundException(constant_1.TIMELINE_ERRORS.PROGRAM_NOT_FOUND);
        }
        return program;
    }
    async createProgramInSession(sessionId, input) {
        this.logger.debug(`프로그램 생성: sessionId=${sessionId.slice(-8)}`);
        const duplicateCount = await this.repository.countProgramsWithRoutine(sessionId, input.routineId);
        if (duplicateCount > 0) {
            throw new common_1.BadRequestException(constant_1.TIMELINE_ERRORS.PROGRAM_ROUTINE_DUPLICATED);
        }
        return this.repository.createProgram({
            name: input.name,
            routineId: input.routineId,
            sessionId,
            instructorId: input.instructorId,
            capacity: input.capacity,
            level: input.level ?? null,
        });
    }
    async updateProgramInSession(sessionId, programId, input) {
        this.logger.debug(`프로그램 수정: ${programId.slice(-8)}`);
        await this.findProgramInSession(sessionId, programId);
        if (input.routineId) {
            const duplicateCount = await this.repository.countProgramsWithRoutine(sessionId, input.routineId, programId);
            if (duplicateCount > 0) {
                throw new common_1.BadRequestException(constant_1.TIMELINE_ERRORS.PROGRAM_ROUTINE_DUPLICATED);
            }
        }
        const updateData = {};
        if (input.name !== undefined)
            updateData.name = input.name;
        if (input.routineId !== undefined)
            updateData.routineId = input.routineId;
        if (input.instructorId !== undefined)
            updateData.instructorId = input.instructorId;
        if (input.capacity !== undefined)
            updateData.capacity = input.capacity;
        if (input.level !== undefined)
            updateData.level = input.level;
        return this.repository.updateProgram(programId, updateData);
    }
    async deleteProgramFromSession(sessionId, programId) {
        this.logger.debug(`프로그램 삭제: ${programId.slice(-8)}`);
        await this.findProgramInSession(sessionId, programId);
        await this.repository.softDeleteProgram(programId);
    }
    validateSessionTypeConstraints(input) {
        const { type, startDateTime, endDateTime, recurringDayOfWeek, repeatCycleType } = input;
        if (!type)
            return;
        if (type === prisma_1.SessionTypes.ONE_TIME) {
            if (!startDateTime) {
                throw new common_1.BadRequestException("일회성(ONE_TIME) 세션은 시작 일시(startDateTime)가 필수입니다");
            }
        }
        else if (type === prisma_1.SessionTypes.ONE_TIME_RANGE) {
            if (!startDateTime) {
                throw new common_1.BadRequestException("기간형(ONE_TIME_RANGE) 세션은 시작 일시(startDateTime)가 필수입니다");
            }
            if (!endDateTime) {
                throw new common_1.BadRequestException("기간형(ONE_TIME_RANGE) 세션은 종료 일시(endDateTime)가 필수입니다");
            }
        }
        else if (type === prisma_1.SessionTypes.RECURRING) {
            if (!recurringDayOfWeek) {
                throw new common_1.BadRequestException("반복(RECURRING) 세션은 반복 요일(recurringDayOfWeek)이 필수입니다");
            }
            if (!repeatCycleType) {
                throw new common_1.BadRequestException("반복(RECURRING) 세션은 반복 주기(repeatCycleType)가 필수입니다");
            }
        }
        if (startDateTime && endDateTime) {
            if (endDateTime <= startDateTime) {
                throw new common_1.BadRequestException(constant_1.TIMELINE_ERRORS.SESSION_DATE_INVALID);
            }
        }
    }
};
exports.TimelinesService = TimelinesService;
exports.TimelinesService = TimelinesService = TimelinesService_1 = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [repository_1.TimelinesRepository])
], TimelinesService);
//# sourceMappingURL=timelines.service.js.map

/***/ }),

/***/ 459:
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
var TokenService_1;
Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.TokenService = void 0;
const constant_1 = __webpack_require__(4);
const vo_1 = __webpack_require__(460);
const common_1 = __webpack_require__(46);
const config_1 = __webpack_require__(233);
const nestjs_cls_1 = __webpack_require__(47);
const token_storage_service_1 = __webpack_require__(480);
let TokenService = TokenService_1 = class TokenService {
    configService;
    tokenStorageService;
    cls;
    logger = new common_1.Logger(TokenService_1.name);
    constructor(configService, tokenStorageService, cls) {
        this.configService = configService;
        this.tokenStorageService = tokenStorageService;
        this.cls = cls;
    }
    getTokenFromRequest(req, key) {
        const token = req.cookies[key || constant_1.Token.ACCESS];
        if (!token)
            throw new common_1.BadRequestException(`${key}`);
        return req.cookies[key || constant_1.Token.ACCESS];
    }
    setTokenToHTTPOnlyCookie(res, key, value) {
        const authConfig = this.configService.get("auth");
        if (!authConfig) {
            throw new Error("Auth configuration is not defined.");
        }
        const expiresIn = key === constant_1.Token.ACCESS ? authConfig.expires : authConfig.refresh;
        const cookie = vo_1.Cookie.forToken(expiresIn);
        return res.cookie(key, value, cookie.toExpressOptions());
    }
    setAccessTokenCookie(res, accessToken) {
        return this.setTokenToHTTPOnlyCookie(res, constant_1.Token.ACCESS, accessToken);
    }
    setRefreshTokenCookie(res, refreshToken) {
        return this.setTokenToHTTPOnlyCookie(res, constant_1.Token.REFRESH, refreshToken);
    }
    clearTokenCookies(res) {
        const authConfig = this.configService.get("auth");
        if (!authConfig) {
            throw new Error("Auth configuration is not defined.");
        }
        const accessCookie = vo_1.Cookie.forToken(authConfig.expires);
        const refreshCookie = vo_1.Cookie.forToken(authConfig.refresh);
        res.clearCookie(constant_1.Token.ACCESS, accessCookie.toExpressOptions());
        res.clearCookie(constant_1.Token.REFRESH, refreshCookie.toExpressOptions());
    }
    async isTokenBlacklisted(accessToken) {
        return this.tokenStorageService.isBlacklisted(accessToken);
    }
};
exports.TokenService = TokenService;
exports.TokenService = TokenService = TokenService_1 = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [config_1.ConfigService,
        token_storage_service_1.TokenStorageService,
        nestjs_cls_1.ClsService])
], TokenService);
//# sourceMappingURL=token.service.js.map

/***/ }),

/***/ 480:
/***/ (function(__unused_webpack_module, exports, __webpack_require__) {


var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __importStar = (this && this.__importStar) || (function () {
    var ownKeys = function(o) {
        ownKeys = Object.getOwnPropertyNames || function (o) {
            var ar = [];
            for (var k in o) if (Object.prototype.hasOwnProperty.call(o, k)) ar[ar.length] = k;
            return ar;
        };
        return ownKeys(o);
    };
    return function (mod) {
        if (mod && mod.__esModule) return mod;
        var result = {};
        if (mod != null) for (var k = ownKeys(mod), i = 0; i < k.length; i++) if (k[i] !== "default") __createBinding(result, mod, k[i]);
        __setModuleDefault(result, mod);
        return result;
    };
})();
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
var TokenStorageService_1;
Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.TokenStorageService = void 0;
const crypto = __importStar(__webpack_require__(481));
const common_1 = __webpack_require__(46);
const config_1 = __webpack_require__(233);
const redis_service_1 = __webpack_require__(232);
const REDIS_KEYS = {
    REFRESH_TOKEN: "refresh:",
    BLACKLIST: "blacklist:",
    OIDC_STATE: "oidc:state:",
    SESSION: "session:",
};
function parseExpiresInToSeconds(expiresIn) {
    if (typeof expiresIn === "number")
        return expiresIn;
    const match = expiresIn.match(/^(\d+)([smhd])$/);
    if (!match)
        return 3600;
    const value = Number.parseInt(match[1], 10);
    const unit = match[2];
    const unitToSeconds = {
        s: 1,
        m: 60,
        h: 60 * 60,
        d: 24 * 60 * 60,
    };
    return value * unitToSeconds[unit];
}
let TokenStorageService = TokenStorageService_1 = class TokenStorageService {
    redisService;
    configService;
    logger = new common_1.Logger(TokenStorageService_1.name);
    constructor(redisService, configService) {
        this.redisService = redisService;
        this.configService = configService;
    }
    generateSessionId() {
        return crypto.randomBytes(16).toString("hex");
    }
    async saveSession(userId, sessionId, refreshToken, metadata) {
        const authConfig = this.configService.get("auth");
        const ttl = parseExpiresInToSeconds(authConfig?.refresh || "7d");
        const key = `${REDIS_KEYS.SESSION}${userId}:${sessionId}`;
        const now = new Date().toISOString();
        const sessionData = {
            refreshToken,
            userAgent: metadata.userAgent,
            ipAddress: metadata.ipAddress,
            createdAt: now,
            lastActivityAt: now,
        };
        await this.redisService.set(key, JSON.stringify(sessionData), ttl);
        this.logger.debug(`세션 저장: userId=${userId}, sessionId=${sessionId}, ttl=${ttl}s`);
    }
    async getSessionRefreshToken(userId, sessionId) {
        const key = `${REDIS_KEYS.SESSION}${userId}:${sessionId}`;
        const data = await this.redisService.get(key);
        if (!data)
            return null;
        try {
            const session = JSON.parse(data);
            return session.refreshToken;
        }
        catch {
            return null;
        }
    }
    async updateSession(userId, sessionId, refreshToken) {
        const key = `${REDIS_KEYS.SESSION}${userId}:${sessionId}`;
        const data = await this.redisService.get(key);
        if (!data)
            return;
        try {
            const session = JSON.parse(data);
            session.refreshToken = refreshToken;
            session.lastActivityAt = new Date().toISOString();
            const authConfig = this.configService.get("auth");
            const ttl = parseExpiresInToSeconds(authConfig?.refresh || "7d");
            await this.redisService.set(key, JSON.stringify(session), ttl);
        }
        catch {
            this.logger.warn(`세션 업데이트 실패: sessionId=${sessionId}`);
        }
    }
    async getUserSessions(userId, currentSessionId) {
        const pattern = `${REDIS_KEYS.SESSION}${userId}:*`;
        const keys = await this.redisService.keys(pattern);
        const sessions = [];
        const prefix = `${REDIS_KEYS.SESSION}${userId}:`;
        for (const key of keys) {
            const data = await this.redisService.get(key);
            if (!data)
                continue;
            try {
                const session = JSON.parse(data);
                const sessionId = key.slice(prefix.length);
                sessions.push({
                    sessionId,
                    userAgent: session.userAgent,
                    ipAddress: session.ipAddress,
                    createdAt: session.createdAt,
                    lastActivityAt: session.lastActivityAt,
                    isCurrent: sessionId === currentSessionId,
                });
            }
            catch {
                continue;
            }
        }
        sessions.sort((a, b) => new Date(b.lastActivityAt).getTime() -
            new Date(a.lastActivityAt).getTime());
        return sessions;
    }
    async deleteSession(userId, sessionId) {
        const key = `${REDIS_KEYS.SESSION}${userId}:${sessionId}`;
        await this.redisService.del(key);
        this.logger.debug(`세션 삭제: userId=${userId}, sessionId=${sessionId}`);
    }
    async deleteOtherSessions(userId, currentSessionId) {
        const pattern = `${REDIS_KEYS.SESSION}${userId}:*`;
        const keys = await this.redisService.keys(pattern);
        const currentKey = `${REDIS_KEYS.SESSION}${userId}:${currentSessionId}`;
        const keysToDelete = keys.filter((k) => k !== currentKey);
        if (keysToDelete.length === 0)
            return 0;
        for (const key of keysToDelete) {
            await this.redisService.del(key);
        }
        this.logger.debug(`다른 세션 ${keysToDelete.length}개 삭제: userId=${userId}`);
        return keysToDelete.length;
    }
    async deleteAllSessions(userId) {
        const pattern = `${REDIS_KEYS.SESSION}${userId}:*`;
        await this.redisService.delByPattern(pattern);
        this.logger.debug(`모든 세션 삭제: userId=${userId}`);
    }
    async getSessionForRevocation(userId, sessionId) {
        const key = `${REDIS_KEYS.SESSION}${userId}:${sessionId}`;
        const data = await this.redisService.get(key);
        if (!data)
            return null;
        try {
            return JSON.parse(data);
        }
        catch {
            return null;
        }
    }
    async saveRefreshToken(userId, refreshToken) {
        const authConfig = this.configService.get("auth");
        const ttl = parseExpiresInToSeconds(authConfig?.refresh || "7d");
        const key = `${REDIS_KEYS.REFRESH_TOKEN}${userId}`;
        const tokenData = JSON.stringify({
            token: refreshToken,
            createdAt: new Date().toISOString(),
        });
        await this.redisService.set(key, tokenData, ttl);
        this.logger.debug(`Refresh token 저장: userId=${userId}, ttl=${ttl}s`);
    }
    async getRefreshToken(userId) {
        const key = `${REDIS_KEYS.REFRESH_TOKEN}${userId}`;
        const data = await this.redisService.get(key);
        if (!data)
            return null;
        try {
            const parsed = JSON.parse(data);
            return parsed.token;
        }
        catch {
            return null;
        }
    }
    async validateRefreshToken(userId, refreshToken) {
        const storedToken = await this.getRefreshToken(userId);
        return storedToken === refreshToken;
    }
    async deleteRefreshToken(userId) {
        const key = `${REDIS_KEYS.REFRESH_TOKEN}${userId}`;
        await this.redisService.del(key);
        await this.deleteAllSessions(userId);
        this.logger.debug(`Refresh token + 세션 삭제: userId=${userId}`);
    }
    async addToBlacklist(accessToken, ttlSeconds) {
        const tokenHash = this.hashToken(accessToken);
        const key = `${REDIS_KEYS.BLACKLIST}${tokenHash}`;
        const authConfig = this.configService.get("auth");
        const ttl = ttlSeconds || parseExpiresInToSeconds(authConfig?.expires || "1h");
        await this.redisService.set(key, "1", ttl);
        this.logger.debug(`Token 블랙리스트 추가: ttl=${ttl}s`);
    }
    async isBlacklisted(accessToken) {
        const tokenHash = this.hashToken(accessToken);
        const key = `${REDIS_KEYS.BLACKLIST}${tokenHash}`;
        return this.redisService.exists(key);
    }
    async invalidateAllUserTokens(userId) {
        await this.deleteRefreshToken(userId);
        this.logger.log(`사용자 ${userId}의 모든 토큰 무효화됨`);
    }
    async saveOidcState(state, codeVerifier, ttlSeconds = 600, returnTo) {
        const key = `${REDIS_KEYS.OIDC_STATE}${state}`;
        const value = JSON.stringify({ codeVerifier, returnTo });
        await this.redisService.set(key, value, ttlSeconds);
        this.logger.debug(`OIDC state + PKCE 저장: ttl=${ttlSeconds}s`);
    }
    async validateAndConsumeOidcState(state) {
        const key = `${REDIS_KEYS.OIDC_STATE}${state}`;
        const raw = await this.redisService.get(key);
        if (!raw)
            return null;
        await this.redisService.del(key);
        try {
            return JSON.parse(raw);
        }
        catch {
            return { codeVerifier: raw };
        }
    }
    hashToken(token) {
        return crypto.createHash("sha256").update(token).digest("hex").slice(0, 32);
    }
};
exports.TokenStorageService = TokenStorageService;
exports.TokenStorageService = TokenStorageService = TokenStorageService_1 = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [redis_service_1.RedisService,
        config_1.ConfigService])
], TokenStorageService);
//# sourceMappingURL=token-storage.service.js.map

/***/ }),

/***/ 482:
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
var TranslationsService_1;
Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.TranslationsService = void 0;
const constant_1 = __webpack_require__(4);
const dto_1 = __webpack_require__(243);
const repository_1 = __webpack_require__(51);
const common_1 = __webpack_require__(46);
const transactional_1 = __webpack_require__(173);
const redis_service_1 = __webpack_require__(232);
let TranslationsService = TranslationsService_1 = class TranslationsService {
    translationsRepository;
    redisService;
    logger = new common_1.Logger(TranslationsService_1.name);
    constructor(translationsRepository, redisService) {
        this.translationsRepository = translationsRepository;
        this.redisService = redisService;
    }
    async getTranslations(query) {
        this.logger.debug(`번역 목록 조회: languageCode=${query.languageCode}, category=${query.category}, page=${query.page}`);
        const { data, total } = await this.translationsRepository.findMany({
            languageCode: query.languageCode,
            category: query.category,
            isTranslated: query.isTranslated,
            key: query.key,
            page: query.page ?? 1,
            limit: query.limit ?? 20,
        });
        const page = query.page ?? 1;
        const limit = query.limit ?? 20;
        const totalPages = Math.ceil(total / limit);
        return {
            data,
            total,
            page,
            limit,
            totalPages,
        };
    }
    async getTranslationById(id) {
        this.logger.debug(`ID로 번역 조회: id=${id.slice(-8)}`);
        const translation = await this.translationsRepository.findById(id);
        if (!translation) {
            throw new common_1.NotFoundException(constant_1.TRANSLATION_ERRORS.NOT_FOUND);
        }
        return translation;
    }
    async getTranslationByKey(languageCode, key) {
        this.logger.debug(`키로 번역 조회: ${languageCode} - ${key}`);
        return this.translationsRepository.findByKey(languageCode, key);
    }
    async createTranslation(data) {
        this.logger.debug(`번역 생성: ${data.languageCode} - ${data.key}`);
        const existing = await this.translationsRepository.findByKey(data.languageCode, data.key);
        if (existing) {
            throw new common_1.BadRequestException(constant_1.TRANSLATION_ERRORS.DUPLICATE_KEY);
        }
        const translation = await this.translationsRepository.create(data);
        await this.invalidateCache(data.languageCode);
        this.logger.log(`번역 생성 완료: ${data.languageCode} - ${data.key} (id=${translation.id.slice(-8)})`);
        return translation;
    }
    async updateTranslation(id, data) {
        this.logger.debug(`번역 수정: id=${id.slice(-8)}`);
        const existing = await this.translationsRepository.findById(id);
        if (!existing) {
            throw new common_1.NotFoundException(constant_1.TRANSLATION_ERRORS.NOT_FOUND);
        }
        const translation = await this.translationsRepository.updateById(id, data);
        await this.invalidateCache(existing.languageCode);
        this.logger.log(`번역 수정 완료: ${existing.languageCode} - ${existing.key} (id=${id.slice(-8)})`);
        return translation;
    }
    async deleteTranslation(id) {
        this.logger.debug(`번역 삭제: id=${id.slice(-8)}`);
        const existing = await this.translationsRepository.findById(id);
        if (!existing) {
            throw new common_1.NotFoundException(constant_1.TRANSLATION_ERRORS.NOT_FOUND);
        }
        const translation = await this.translationsRepository.deleteById(id);
        await this.invalidateCache(existing.languageCode);
        this.logger.log(`번역 삭제 완료: ${existing.languageCode} - ${existing.key} (id=${id.slice(-8)})`);
        return translation;
    }
    async upsertTranslation(data) {
        this.logger.debug(`번역 Upsert: ${data.languageCode} - ${data.key}`);
        const translation = await this.translationsRepository.upsert({
            languageCode: data.languageCode,
            key: data.key,
            text: data.text,
            category: data.category,
            isTranslated: data.isTranslated,
        });
        await this.invalidateCache(data.languageCode);
        this.logger.log(`번역 Upsert 완료: ${data.languageCode} - ${data.key} (id=${translation.id.slice(-8)})`);
        return translation;
    }
    async invalidateCache(languageCode) {
        if (languageCode) {
            this.logger.debug(`캐시 무효화: ${languageCode}`);
            const pattern = `i18n:${languageCode}:*`;
            await this.redisService.delByPattern(pattern);
        }
        else {
            this.logger.debug("전체 캐시 무효화");
            await this.redisService.delByPattern("i18n:*");
        }
    }
};
exports.TranslationsService = TranslationsService;
__decorate([
    (0, transactional_1.Transactional)(),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [dto_1.CreateTranslationDto]),
    __metadata("design:returntype", Promise)
], TranslationsService.prototype, "createTranslation", null);
__decorate([
    (0, transactional_1.Transactional)(),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, dto_1.UpdateTranslationDto]),
    __metadata("design:returntype", Promise)
], TranslationsService.prototype, "updateTranslation", null);
__decorate([
    (0, transactional_1.Transactional)(),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", Promise)
], TranslationsService.prototype, "deleteTranslation", null);
__decorate([
    (0, transactional_1.Transactional)(),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [dto_1.CreateTranslationDto]),
    __metadata("design:returntype", Promise)
], TranslationsService.prototype, "upsertTranslation", null);
exports.TranslationsService = TranslationsService = TranslationsService_1 = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [repository_1.TranslationsRepository,
        redis_service_1.RedisService])
], TranslationsService);
//# sourceMappingURL=translations.service.js.map

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
    __metadata("design:paramtypes", [repository_1.UsersRepository,
        context_1.SpaceContext,
        auth_cache_service_1.AuthCacheService])
], UsersService);
//# sourceMappingURL=users.service.js.map

/***/ }),

/***/ 484:
/***/ (function(__unused_webpack_module, exports, __webpack_require__) {


var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var MaskingService_1;
Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.MaskingService = void 0;
const constant_1 = __webpack_require__(4);
const common_1 = __webpack_require__(46);
let MaskingService = MaskingService_1 = class MaskingService {
    logger = new common_1.Logger(MaskingService_1.name);
    applyMasking(value, config) {
        if (value == null || value === "") {
            return "";
        }
        if (!config || config.type !== "masking") {
            return value;
        }
        const maskingConfig = config;
        if (maskingConfig.preset) {
            return this.applyPreset(value, maskingConfig.preset);
        }
        if (maskingConfig.pattern && maskingConfig.replacement) {
            return this.applyCustomPattern(value, maskingConfig.pattern, maskingConfig.replacement);
        }
        this.logger.warn("마스킹 설정이 불완전합니다. preset 또는 pattern/replacement가 필요합니다.");
        return value;
    }
    applyPreset(value, preset) {
        switch (preset) {
            case constant_1.MASKING_PRESETS.EMAIL:
                return this.maskEmail(value);
            case constant_1.MASKING_PRESETS.PHONE:
                return this.maskPhone(value);
            case constant_1.MASKING_PRESETS.NAME:
                return this.maskName(value);
            case constant_1.MASKING_PRESETS.SSN:
                return this.maskSsn(value);
            case constant_1.MASKING_PRESETS.CARD:
                return this.maskCard(value);
            case constant_1.MASKING_PRESETS.ACCOUNT:
                return this.maskAccount(value);
            default:
                this.logger.warn(`알 수 없는 마스킹 프리셋: ${preset}`);
                return value;
        }
    }
    applyCustomPattern(value, pattern, replacement) {
        try {
            const regex = new RegExp(pattern);
            return value.replace(regex, replacement);
        }
        catch (error) {
            this.logger.error(`정규식 패턴 오류: ${pattern}`, error);
            return value;
        }
    }
    maskFields(data, fieldsToMask) {
        if (!data || typeof data !== "object") {
            return data;
        }
        const result = { ...data };
        fieldsToMask.forEach((config, fieldName) => {
            if (fieldName in result) {
                const originalValue = result[fieldName];
                if (typeof originalValue === "string") {
                    result[fieldName] = this.applyMasking(originalValue, config);
                }
            }
        });
        return result;
    }
    maskFieldsArray(dataArray, fieldsToMask) {
        if (!Array.isArray(dataArray)) {
            return dataArray;
        }
        return dataArray.map((item) => this.maskFields(item, fieldsToMask));
    }
    maskEmail(email) {
        const atIndex = email.indexOf("@");
        if (atIndex === -1) {
            return email.length > 3 ? `${email.slice(0, 3)}***` : email;
        }
        const localPart = email.slice(0, atIndex);
        const domainPart = email.slice(atIndex);
        const visibleLength = Math.min(3, localPart.length);
        const maskedLocal = `${localPart.slice(0, visibleLength)}***`;
        return `${maskedLocal}${domainPart}`;
    }
    maskPhone(phone) {
        const hyphenMatch = phone.match(/^(\d{2,3})-(\d{3,4})-(\d{4})$/);
        if (hyphenMatch) {
            return `${hyphenMatch[1]}-****-${hyphenMatch[3]}`;
        }
        const numberMatch = phone.match(/^(\d{2,3})(\d{3,4})(\d{4})$/);
        if (numberMatch) {
            return `${numberMatch[1]}****${numberMatch[3]}`;
        }
        if (phone.length >= 7) {
            const start = phone.slice(0, 3);
            const end = phone.slice(-4);
            return `${start}****${end}`;
        }
        return phone;
    }
    maskName(name) {
        if (name.length <= 1) {
            return name;
        }
        if (name.length === 2) {
            return `${name[0]}*`;
        }
        const first = name[0];
        const last = name[name.length - 1];
        const middleMask = "*".repeat(name.length - 2);
        return `${first}${middleMask}${last}`;
    }
    maskSsn(ssn) {
        const hyphenMatch = ssn.match(/^(\d{6})-?(\d{7})$/);
        if (hyphenMatch) {
            return `${hyphenMatch[1]}-*******`;
        }
        if (/^\d{13}$/.test(ssn)) {
            return `${ssn.slice(0, 6)}-*******`;
        }
        if (ssn.length > 6) {
            return `${ssn.slice(0, 6)}-*******`;
        }
        return ssn;
    }
    maskCard(card) {
        const hyphenMatch = card.match(/^(\d{4})-(\d{4})-(\d{4})-(\d{4})$/);
        if (hyphenMatch) {
            return `${hyphenMatch[1]}-****-****-${hyphenMatch[4]}`;
        }
        const numberMatch = card.match(/^(\d{4})(\d{4})(\d{4})(\d{4})$/);
        if (numberMatch) {
            return `${numberMatch[1]}********${numberMatch[4]}`;
        }
        if (card.length >= 12) {
            const start = card.slice(0, 4);
            const end = card.slice(-4);
            return `${start}-****-****-${end}`;
        }
        return card;
    }
    maskAccount(account) {
        const parts = account.split("-");
        if (parts.length >= 2) {
            const first = parts[0];
            const maskedParts = parts.slice(1).map((part) => "*".repeat(part.length));
            return `${first}-${maskedParts.join("-")}`;
        }
        if (account.length > 3) {
            return `${account.slice(0, 3)}${"*".repeat(account.length - 3)}`;
        }
        return account;
    }
};
exports.MaskingService = MaskingService;
exports.MaskingService = MaskingService = MaskingService_1 = __decorate([
    (0, common_1.Injectable)()
], MaskingService);
//# sourceMappingURL=masking.service.js.map

/***/ }),

/***/ 485:
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
var OidcClientsService_1;
Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.OidcClientsService = void 0;
const repository_1 = __webpack_require__(51);
const common_1 = __webpack_require__(46);
let OidcClientsService = OidcClientsService_1 = class OidcClientsService {
    repository;
    logger = new common_1.Logger(OidcClientsService_1.name);
    constructor(repository) {
        this.repository = repository;
    }
    async getMany(query) {
        this.logger.debug("OIDC 클라이언트 목록 조회");
        const where = query.toPrismaWhere({ removedAt: null });
        const orderBy = query.toPrismaOrderBy();
        return this.repository.findMany({
            where,
            orderBy,
            skip: query.skip ?? 0,
            take: query.take ?? 20,
        });
    }
    async getById(id) {
        this.logger.debug(`OIDC 클라이언트 상세 조회: ${id.slice(-8)}`);
        const client = await this.repository.findById(id);
        if (!client) {
            throw new common_1.NotFoundException("OIDC 클라이언트를 찾을 수 없습니다");
        }
        return client;
    }
    async create(params) {
        this.logger.debug(`OIDC 클라이언트 생성: ${params.clientId}`);
        const existing = await this.repository.findByClientId(params.clientId);
        if (existing) {
            throw new common_1.ConflictException("이미 존재하는 Client ID입니다");
        }
        return this.repository.create({
            clientId: params.clientId,
            clientSecret: params.clientSecret ?? null,
            clientName: params.clientName,
            redirectUris: params.redirectUris,
            grantTypes: params.grantTypes,
            responseTypes: params.responseTypes,
            tokenEndpointAuthMethod: params.tokenEndpointAuthMethod,
            scope: params.scope,
            isActive: true,
            logoUri: params.logoUri ?? null,
            policyUri: params.policyUri ?? null,
            tosUri: params.tosUri ?? null,
        });
    }
    async update(id, params) {
        this.logger.debug(`OIDC 클라이언트 수정: ${id.slice(-8)}`);
        const existing = await this.repository.findById(id);
        if (!existing) {
            throw new common_1.NotFoundException("OIDC 클라이언트를 찾을 수 없습니다");
        }
        return this.repository.updateById(id, params);
    }
    async remove(id) {
        this.logger.debug(`OIDC 클라이언트 삭제: ${id.slice(-8)}`);
        const existing = await this.repository.findById(id);
        if (!existing) {
            throw new common_1.NotFoundException("OIDC 클라이언트를 찾을 수 없습니다");
        }
        await this.repository.removeById(id);
    }
    async toggleActive(id) {
        this.logger.debug(`OIDC 클라이언트 활성 토글: ${id.slice(-8)}`);
        const existing = await this.repository.findById(id);
        if (!existing) {
            throw new common_1.NotFoundException("OIDC 클라이언트를 찾을 수 없습니다");
        }
        return this.repository.updateById(id, {
            isActive: !existing.isActive,
        });
    }
};
exports.OidcClientsService = OidcClientsService;
exports.OidcClientsService = OidcClientsService = OidcClientsService_1 = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [repository_1.OidcClientsRepository])
], OidcClientsService);
//# sourceMappingURL=oidc-clients.service.js.map

/***/ }),

/***/ 486:
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
var SecurityPolicyService_1;
Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.SecurityPolicyService = void 0;
const repository_1 = __webpack_require__(51);
const common_1 = __webpack_require__(46);
const redis_service_1 = __webpack_require__(232);
const CACHE_KEY = "security-policy:default";
const CACHE_TTL_SEC = 300;
let SecurityPolicyService = SecurityPolicyService_1 = class SecurityPolicyService {
    repository;
    redisService;
    logger = new common_1.Logger(SecurityPolicyService_1.name);
    constructor(repository, redisService) {
        this.repository = repository;
        this.redisService = redisService;
    }
    async getDefault() {
        this.logger.debug("기본 보안 정책 조회");
        const cached = await this.redisService.get(CACHE_KEY);
        if (cached) {
            this.logger.debug("캐시에서 보안 정책 반환");
            return JSON.parse(cached);
        }
        const policy = await this.repository.findByKey("default");
        if (!policy) {
            throw new common_1.NotFoundException("기본 보안 정책을 찾을 수 없습니다");
        }
        await this.redisService.set(CACHE_KEY, JSON.stringify(policy), CACHE_TTL_SEC);
        return policy;
    }
    async update(dto) {
        this.logger.debug("보안 정책 수정");
        const existing = await this.repository.findByKey("default");
        if (!existing) {
            throw new common_1.NotFoundException("기본 보안 정책을 찾을 수 없습니다");
        }
        const updated = await this.repository.updateByKey("default", dto);
        await this.redisService.del(CACHE_KEY);
        return updated;
    }
};
exports.SecurityPolicyService = SecurityPolicyService;
exports.SecurityPolicyService = SecurityPolicyService = SecurityPolicyService_1 = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [repository_1.SecurityPoliciesRepository,
        redis_service_1.RedisService])
], SecurityPolicyService);
//# sourceMappingURL=security-policy.service.js.map

/***/ }),

/***/ 487:
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
var OidcSessionsService_1;
Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.OidcSessionsService = void 0;
const common_1 = __webpack_require__(46);
const redis_service_1 = __webpack_require__(232);
const KEY_PREFIX = "oidc";
const INDEX_SEGMENTS = [":uid:", ":userCode:", ":grant:"];
const MODEL_TYPES = [
    "Session",
    "AccessToken",
    "RefreshToken",
    "AuthorizationCode",
    "Grant",
    "ClientCredentials",
    "DeviceCode",
    "Interaction",
];
let OidcSessionsService = OidcSessionsService_1 = class OidcSessionsService {
    redisService;
    logger = new common_1.Logger(OidcSessionsService_1.name);
    constructor(redisService) {
        this.redisService = redisService;
    }
    async collectAllSessions(targetTypes) {
        const allSessions = [];
        for (const modelType of targetTypes) {
            const pattern = `${KEY_PREFIX}:${modelType}:*`;
            const keys = await this.redisService.keys(pattern);
            const dataKeys = keys.filter((k) => !INDEX_SEGMENTS.some((seg) => k.includes(seg)));
            if (dataKeys.length === 0)
                continue;
            const client = this.redisService.getClient();
            const values = await client.mget(...dataKeys);
            for (let i = 0; i < dataKeys.length; i++) {
                const value = values[i];
                if (!value)
                    continue;
                const payload = JSON.parse(value);
                const id = dataKeys[i].replace(`${KEY_PREFIX}:${modelType}:`, "");
                allSessions.push({
                    key: id,
                    modelType,
                    grantId: payload.grantId ?? null,
                    uid: payload.uid ?? null,
                    accountId: payload.accountId ?? null,
                    expiresAt: payload.exp
                        ? new Date(payload.exp * 1000)
                        : null,
                    createdAt: payload.iat
                        ? new Date(payload.iat * 1000)
                        : new Date(),
                });
            }
        }
        return allSessions;
    }
    async getMany(query) {
        this.logger.debug("OIDC 세션/토큰 목록 조회 (Redis)");
        const targetTypes = query.modelType
            ? [query.modelType]
            : MODEL_TYPES;
        let allSessions = await this.collectAllSessions(targetTypes);
        if (query.accountId) {
            const search = query.accountId.toLowerCase();
            allSessions = allSessions.filter((s) => s.accountId?.toLowerCase().includes(search));
        }
        allSessions.sort((a, b) => b.createdAt.getTime() - a.createdAt.getTime());
        const skip = query.skip ?? 0;
        const take = query.take ?? 20;
        const paginated = allSessions.slice(skip, skip + take);
        return {
            data: paginated,
            totalCount: allSessions.length,
        };
    }
    async getStats() {
        this.logger.debug("OIDC 세션/토큰 통계 조회");
        const byModelType = {};
        let totalCount = 0;
        for (const modelType of MODEL_TYPES) {
            const pattern = `${KEY_PREFIX}:${modelType}:*`;
            const keys = await this.redisService.keys(pattern);
            const dataKeys = keys.filter((k) => !INDEX_SEGMENTS.some((seg) => k.includes(seg)));
            byModelType[modelType] = dataKeys.length;
            totalCount += dataKeys.length;
        }
        return { totalCount, byModelType };
    }
    async revokeAll() {
        this.logger.debug("모든 OIDC 세션/토큰 일괄 폐기");
        let totalDeleted = 0;
        for (const modelType of MODEL_TYPES) {
            const pattern = `${KEY_PREFIX}:${modelType}:*`;
            const deleted = await this.redisService.delByPattern(pattern);
            totalDeleted += deleted;
        }
        return totalDeleted;
    }
    async revokeByKey(keyId) {
        this.logger.debug(`세션/토큰 단건 폐기: ${keyId.slice(0, 8)}...`);
        const client = this.redisService.getClient();
        let found = false;
        for (const modelType of MODEL_TYPES) {
            const redisKey = `${KEY_PREFIX}:${modelType}:${keyId}`;
            const data = await this.redisService.get(redisKey);
            if (data) {
                found = true;
                const payload = JSON.parse(data);
                const pipeline = client.pipeline();
                pipeline.del(redisKey);
                if (payload.uid) {
                    pipeline.del(`${KEY_PREFIX}:${modelType}:uid:${payload.uid}`);
                }
                if (payload.userCode) {
                    pipeline.del(`${KEY_PREFIX}:${modelType}:userCode:${payload.userCode}`);
                }
                if (payload.grantId) {
                    pipeline.srem(`${KEY_PREFIX}:${modelType}:grant:${payload.grantId}`, keyId);
                }
                await pipeline.exec();
                break;
            }
        }
        if (!found) {
            throw new common_1.NotFoundException("세션/토큰을 찾을 수 없습니다");
        }
    }
    async revokeByGrantId(grantId) {
        this.logger.debug(`Grant 일괄 폐기: ${grantId.slice(0, 8)}...`);
        const client = this.redisService.getClient();
        let totalDeleted = 0;
        for (const modelType of MODEL_TYPES) {
            const grantKey = `${KEY_PREFIX}:${modelType}:grant:${grantId}`;
            const members = await client.smembers(grantKey);
            if (members.length === 0)
                continue;
            const pipeline = client.pipeline();
            for (const id of members) {
                const mainKey = `${KEY_PREFIX}:${modelType}:${id}`;
                const data = await this.redisService.get(mainKey);
                pipeline.del(mainKey);
                if (data) {
                    const payload = JSON.parse(data);
                    if (payload.uid) {
                        pipeline.del(`${KEY_PREFIX}:${modelType}:uid:${payload.uid}`);
                    }
                    if (payload.userCode) {
                        pipeline.del(`${KEY_PREFIX}:${modelType}:userCode:${payload.userCode}`);
                    }
                }
            }
            pipeline.del(grantKey);
            await pipeline.exec();
            totalDeleted += members.length;
        }
        if (totalDeleted === 0) {
            throw new common_1.NotFoundException("해당 Grant에 연결된 세션/토큰이 없습니다");
        }
        return totalDeleted;
    }
};
exports.OidcSessionsService = OidcSessionsService;
exports.OidcSessionsService = OidcSessionsService = OidcSessionsService_1 = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [redis_service_1.RedisService])
], OidcSessionsService);
//# sourceMappingURL=oidc-sessions.service.js.map

/***/ }),

/***/ 488:
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
var IdpDashboardService_1;
Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.IdpDashboardService = void 0;
const common_1 = __webpack_require__(46);
const redis_service_1 = __webpack_require__(232);
const OIDC_KEY_PREFIX = "oidc";
const OIDC_MODEL_TYPES = [
    "Session",
    "AccessToken",
    "RefreshToken",
    "AuthorizationCode",
    "Grant",
    "ClientCredentials",
    "DeviceCode",
    "Interaction",
];
const INDEX_SEGMENTS = [":uid:", ":userCode:", ":grant:"];
const transactional_1 = __webpack_require__(173);
let IdpDashboardService = IdpDashboardService_1 = class IdpDashboardService {
    txHost;
    redisService;
    logger = new common_1.Logger(IdpDashboardService_1.name);
    constructor(txHost, redisService) {
        this.txHost = txHost;
        this.redisService = redisService;
    }
    async getStats() {
        this.logger.debug("대시보드 통계 조회");
        const today = new Date();
        today.setHours(0, 0, 0, 0);
        const [todaySuccessCount, todayFailureCount, todayLockedCount, lockedAccountCount, activeClientCount,] = await Promise.all([
            this.txHost.tx.authAuditLog.count({
                where: { result: "SUCCESS", createdAt: { gte: today } },
            }),
            this.txHost.tx.authAuditLog.count({
                where: { result: "FAILURE", createdAt: { gte: today } },
            }),
            this.txHost.tx.authAuditLog.count({
                where: { result: "LOCKED", createdAt: { gte: today } },
            }),
            this.txHost.tx.user.count({
                where: { isPermanentlyLocked: true, removedAt: null },
            }),
            this.txHost.tx.oidcClient.count({
                where: { isActive: true, removedAt: null },
            }),
        ]);
        let activeSessionCount = 0;
        for (const modelType of ["Session", "AccessToken"]) {
            const pattern = `${OIDC_KEY_PREFIX}:${modelType}:*`;
            const keys = await this.redisService.keys(pattern);
            const dataKeys = keys.filter((k) => !INDEX_SEGMENTS.some((seg) => k.includes(seg)));
            activeSessionCount += dataKeys.length;
        }
        return {
            activeSessionCount,
            todaySuccessCount,
            todayFailureCount,
            todayLockedCount,
            lockedAccountCount,
            activeClientCount,
        };
    }
    async getLoginTrend(days = 7) {
        this.logger.debug(`로그인 추이 조회: 최근 ${days}일`);
        const result = [];
        const now = new Date();
        for (let i = days - 1; i >= 0; i--) {
            const dayStart = new Date(now);
            dayStart.setDate(now.getDate() - i);
            dayStart.setHours(0, 0, 0, 0);
            const dayEnd = new Date(dayStart);
            dayEnd.setDate(dayStart.getDate() + 1);
            const [successCount, failureCount] = await Promise.all([
                this.txHost.tx.authAuditLog.count({
                    where: {
                        result: "SUCCESS",
                        createdAt: { gte: dayStart, lt: dayEnd },
                    },
                }),
                this.txHost.tx.authAuditLog.count({
                    where: {
                        result: { in: ["FAILURE", "LOCKED"] },
                        createdAt: { gte: dayStart, lt: dayEnd },
                    },
                }),
            ]);
            result.push({
                date: dayStart.toISOString().split("T")[0],
                successCount,
                failureCount,
            });
        }
        return result;
    }
};
exports.IdpDashboardService = IdpDashboardService;
exports.IdpDashboardService = IdpDashboardService = IdpDashboardService_1 = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [transactional_1.TransactionHost,
        redis_service_1.RedisService])
], IdpDashboardService);
//# sourceMappingURL=idp-dashboard.service.js.map

/***/ }),

/***/ 489:
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
var IdpAccountService_1;
Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.IdpAccountService = void 0;
const repository_1 = __webpack_require__(51);
const common_1 = __webpack_require__(46);
const transactional_1 = __webpack_require__(173);
const ACCOUNT_SELECT = {
    id: true,
    name: true,
    email: true,
    isActive: true,
    failedLoginAttempts: true,
    isPermanentlyLocked: true,
    lockedUntil: true,
    mustChangePassword: true,
    lastLoginAt: true,
    lastLoginIp: true,
    createdAt: true,
};
let IdpAccountService = IdpAccountService_1 = class IdpAccountService {
    txHost;
    auditLogsRepository;
    logger = new common_1.Logger(IdpAccountService_1.name);
    constructor(txHost, auditLogsRepository) {
        this.txHost = txHost;
        this.auditLogsRepository = auditLogsRepository;
    }
    async getMany(query) {
        this.logger.debug("IDP 계정 목록 조회");
        const where = query.toPrismaWhere({ removedAt: null });
        const orderBy = query.toPrismaOrderBy();
        const skip = query.skip ?? 0;
        const take = query.take ?? 20;
        const [users, totalCount] = await Promise.all([
            this.txHost.tx.user.findMany({
                where,
                orderBy,
                skip,
                take,
                select: ACCOUNT_SELECT,
            }),
            this.txHost.tx.user.count({ where }),
        ]);
        return { data: users, totalCount };
    }
    async getById(userId) {
        this.logger.debug(`IDP 계정 상세 조회: ${userId.slice(-8)}`);
        const user = await this.txHost.tx.user.findUnique({
            where: { id: userId, removedAt: null },
            select: ACCOUNT_SELECT,
        });
        if (!user) {
            throw new common_1.NotFoundException("계정을 찾을 수 없습니다");
        }
        return user;
    }
    async getRecentAuditLogs(userId, limit = 5) {
        return this.auditLogsRepository.findByUserId(userId, limit);
    }
    async toggleActive(userId) {
        this.logger.debug(`계정 활성/비활성 토글: ${userId.slice(-8)}`);
        const user = await this.txHost.tx.user.findUnique({
            where: { id: userId, removedAt: null },
        });
        if (!user) {
            throw new common_1.NotFoundException("계정을 찾을 수 없습니다");
        }
        const updated = await this.txHost.tx.user.update({
            where: { id: userId },
            data: { isActive: !user.isActive },
            select: ACCOUNT_SELECT,
        });
        return updated;
    }
    async resetFailedAttempts(userId) {
        this.logger.debug(`실패 횟수 초기화: ${userId.slice(-8)}`);
        const user = await this.txHost.tx.user.findUnique({
            where: { id: userId, removedAt: null },
        });
        if (!user) {
            throw new common_1.NotFoundException("계정을 찾을 수 없습니다");
        }
        await this.txHost.tx.user.update({
            where: { id: userId },
            data: {
                failedLoginAttempts: 0,
                lockedUntil: null,
                isPermanentlyLocked: false,
            },
        });
    }
};
exports.IdpAccountService = IdpAccountService;
exports.IdpAccountService = IdpAccountService = IdpAccountService_1 = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [transactional_1.TransactionHost,
        repository_1.AuthAuditLogsRepository])
], IdpAccountService);
//# sourceMappingURL=idp-account.service.js.map

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
/******/ 	__webpack_require__.h = () => ("df841bcfc18a2769889a")
/******/ })();
/******/ 
/******/ }
;