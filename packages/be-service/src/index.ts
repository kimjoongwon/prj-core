// Context (be-context에서 재export)
export { AuthContext, SpaceContext } from "@cocrepo/context";

// I18n
export { I18nModule, I18nTranslationService } from "./i18n";

// Strategy
export { JwtStrategy } from "./strategy";

// Services
// 필요할 때 생성합니다. 가이드: .claude/agents/be-service-builder.md

export {
	type GetAuditLogsResult,
	AuthAuditLogService,
} from "./auth-audit-log.service";
export { AuthCacheService } from "./auth-cache.service";
export { EmailService } from "./email.service";
export { AbilityService } from "./ability.service";
export { ActionService } from "./action.service";
export { AssetService } from "./asset.service";
export { CategoryService } from "./category.service";
export { FolderService } from "./folder.service";
export { GrantService } from "./grant.service";
export { GroupService } from "./group.service";
export { createPrismaClient } from "./prisma.factory";
export { PrismaService } from "./prisma.service";
export { RedisService } from "./redis.service";
export { RoleService } from "./role.service";
export { RoutineService } from "./routine.service";
export { SpaceService } from "./space.service";
export {
	type SubjectFieldInfo,
	type SubjectInfo,
	SubjectService,
} from "./subject.service";
export { TaskService } from "./task.service";
export { TemplateService } from "./template.service";
export { TimelineService } from "./timeline.service";
export { TokenService } from "./token.service/index";
export {
	TokenStorageService,
	type SessionInfo,
	type SessionMetadata,
	type OidcStatePayload,
} from "./token-storage.service/index";
export { UserService } from "./user.service";
export { MaskingService } from "./masking.service";
export { MASKING_PRESETS, type MaskingPreset } from "@cocrepo/constant";
export { OidcClientService } from "./oidc-client.service";
export { SecurityPolicyService } from "./security-policy.service";
export {
	OidcSessionService,
	type OidcRedisSession,
} from "./oidc-session.service";
export {
	type DashboardStats,
	type LoginTrendItem,
	IdpDashboardService,
} from "./idp-dashboard.service";
export {
	type IdpAccountInfo,
	IdpAccountService,
} from "./idp-account.service";
export {
	ObjectStorageService,
	S3CompatibleStorageService,
	type PutObjectInput,
	type PutObjectResult,
} from "./object-storage.service";

// Inquiry Domain Services
export {
	InquiryService,
	type FillInquiryFormInput,
	type FillInquiryFormResult,
	type InquiryStats,
	type InquiryCreateUpdateFormBootstrap,
	type SentimentAnalysisResult,
} from "./inquiry.service";
