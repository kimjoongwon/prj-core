// Context
export { SpaceContext } from "./context/space-context";

// I18n
export { I18nModule, TranslationService } from "./i18n";

// Services
// 필요할 때 생성합니다. 가이드: .claude/agents/be-service-builder.md

export {
	type GetAuditLogsResult,
	AuthAuditLogService,
} from "./auth-audit-log.service";
export { AuthCacheService } from "./auth-cache.service";
export { EmailService } from "./email.service";
export { AbilitiesService } from "./abilities.service";
export { ActionsService } from "./actions.service";
export { CategoriesService } from "./categories.service";
export { AwsService } from "./aws.service";
export { ExercisesService } from "./exercises.service";
export { GrantsService } from "./grants.service";
export { GroupsService } from "./groups.service";
export { GroundsService } from "./grounds.service";
export { createPrismaClient } from "./prisma.factory";
export { PrismaService } from "./prisma.service";
export { RedisService } from "./redis.service";
export { RolesService } from "./roles.service";
export { SpacesService } from "./spaces.service";
export {
	type SubjectFieldInfo,
	type SubjectInfo,
	SubjectsService,
} from "./subjects.service";
export { TemplatesService } from "./templates.service";
export { TimelinesService } from "./timelines.service";
export { TokenService } from "./token.service";
export {
	TokenStorageService,
	type SessionInfo,
	type SessionMetadata,
} from "./token-storage.service";
export { TranslationsService } from "./translations.service";
export { UsersService } from "./users.service";
export { MaskingService } from "./masking.service";
export { MASKING_PRESETS, type MaskingPreset } from "@cocrepo/constant";
export { OidcClientsService } from "./oidc-clients.service";
export { SecurityPolicyService } from "./security-policy.service";
export {
	OidcSessionsService,
	type OidcRedisSession,
} from "./oidc-sessions.service";
export {
	type DashboardStats,
	type LoginTrendItem,
	IdpDashboardService,
} from "./idp-dashboard.service";
export {
	type IdpAccountInfo,
	IdpAccountService,
} from "./idp-account.service";
