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

/***/ })

};
exports.runtime =
/******/ function(__webpack_require__) { // webpackRuntimeModules
/******/ /* webpack/runtime/getFullHash */
/******/ (() => {
/******/ 	__webpack_require__.h = () => ("f482e25e8756a3b9092c")
/******/ })();
/******/ 
/******/ }
;