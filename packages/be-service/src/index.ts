// Context (be-context에서 재export)
export { AuthContext, SpaceContext } from "@cocrepo/context";

// I18n
export { I18nModule, I18nTranslationService } from "./i18n";

// Strategy
export { JwtStrategy } from "./strategy";

// Services
// 필요할 때 생성합니다. 가이드: .claude/agents/be-service-builder.md

export { MASKING_PRESETS, type MaskingPreset } from "@cocrepo/constant";
export { AbilityService } from "./ability.service";
export { ActionService } from "./action.service";
export { AssetService } from "./asset.service";
export {
	AuthAuditLogService,
	type GetAuditLogsResult,
} from "./auth-audit-log.service";
export { AuthCacheService } from "./auth-cache.service";
export { CategoryService } from "./category.service";
export { EmailModule } from "./email.module";
export {
	EmailProvider,
	type EmailSendInput,
	EmailService,
	SmtpEmailProvider,
} from "./email.service/index";
export { FolderService } from "./folder.service";
export { GroupService } from "./group.service";
export {
	type IdpAccountInfo,
	IdpAccountService,
} from "./idp-account.service";
export {
	type DashboardStats,
	IdpDashboardService,
	type LoginTrendItem,
} from "./idp-dashboard.service";
// Inquiry Domain Services
export {
	type FillInquiryFormInput,
	type FillInquiryFormResult,
	type InquiryCreateUpdateFormBootstrap,
	InquiryService,
	type InquiryStats,
	type SentimentAnalysisResult,
} from "./inquiry.service";
export { MaskingService } from "./masking.service";
export {
	ObjectStorageService,
	type PutObjectInput,
	type PutObjectResult,
	S3CompatibleStorageService,
} from "./object-storage.service";
export { OidcClientService } from "./oidc-client.service/index";
export {
	type OidcRedisSession,
	OidcSessionService,
} from "./oidc-session.service";
export { PolicyAssignmentService } from "./policy-assignment.service";
export { PolicyService } from "./policy.service";
export { createPrismaClient } from "./prisma.factory";
export { PrismaService } from "./prisma.service";
export { RedisService } from "./redis.service";
export { RoleService } from "./role.service";
export { RoutineService } from "./routine.service";
export { SecurityPolicyService } from "./security-policy.service";
export { SpaceService } from "./space.service";
export {
	type SubjectFieldInfo,
	type SubjectInfo,
	SubjectService,
} from "./subject.service";
export { TaskService } from "./task.service";
export {
	TenantAccessRequestService,
	type TenantAccessRequestCreateFormBootstrap,
	type TenantAccessRequestFormOptionItem,
} from "./tenant-access-request.service";
export { TemplateService } from "./template.service/index";
export { TimelineService } from "./timeline.service";
export { TokenService } from "./token.service/index";
export {
	type OidcStatePayload,
	type SessionInfo,
	type SessionMetadata,
	TokenStorageService,
} from "./token-storage.service/index";
export { UserService } from "./user.service";
