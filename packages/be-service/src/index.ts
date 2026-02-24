// Context
export { SpaceContext } from "./context/space-context";

// I18n
export { I18nModule, TranslationService } from "./i18n";

// Services
// 필요할 때 생성합니다. 가이드: .claude/agents/be-service-builder.md

export {
	type GetAuditLogsResult,
	AuthAuditLogService,
} from "./auth-audit-log/auth-audit-log.service";
export { AuthCacheService } from "./auth-cache/auth-cache.service";
export { EmailService } from "./email/email.service";
export { AbilitiesService } from "./abilities/abilities.service";
export { ActionsService } from "./actions/actions.service";
export { CategoriesService } from "./categories/categories.service";
export { AwsService } from "./aws/aws.service";
export { ExercisesService } from "./exercises/exercises.service";
export { GrantsService } from "./grants/grants.service";
export { GroupsService } from "./groups/groups.service";
export { GroundsService } from "./grounds/grounds.service";
export { createPrismaClient } from "./prisma/prisma.factory";
export { PrismaService } from "./prisma/prisma.service";
export { RedisService } from "./redis/redis.service";
export { RolesService } from "./roles/roles.service";
export { RoutinesService } from "./routines/routines.service";
export { SpacesService } from "./spaces/spaces.service";
export {
	type SubjectFieldInfo,
	type SubjectInfo,
	SubjectsService,
} from "./subjects/subjects.service";
export { TemplatesService } from "./templates/templates.service";
export { TimelinesService } from "./timelines/timelines.service";
export { TokenService } from "./token/token.service";
export {
	TokenStorageService,
	type SessionInfo,
	type SessionMetadata,
} from "./token-storage/token-storage.service";
export { TranslationsService } from "./translations/translations.service";
export { UsersService } from "./users/users.service";
export { MaskingService } from "./masking/masking.service";
export { MASKING_PRESETS, type MaskingPreset } from "@cocrepo/constant";
export { OidcClientsService } from "./oidc-clients/oidc-clients.service";
export { SecurityPolicyService } from "./security-policy/security-policy.service";
export {
	OidcSessionsService,
	type OidcRedisSession,
} from "./oidc-sessions/oidc-sessions.service";
export {
	type DashboardStats,
	type LoginTrendItem,
	IdpDashboardService,
} from "./idp-dashboard/idp-dashboard.service";
export {
	type IdpAccountInfo,
	IdpAccountService,
} from "./idp-account/idp-account.service";

// Input Types
export {
	type CreateAbilityInput,
	type UpdateAbilityInput,
} from "./abilities/input";
export {
	type CreateActionInput,
	type UpdateActionInput,
} from "./actions/input";
export { type CreateSpaceInput } from "./spaces/input";
export {
	type CreateUserInput,
	type UpdateUserInput,
	type CreateUserForSignUpInput,
} from "./users/input";
export {
	type CreateTranslationInput,
	type UpdateTranslationInput,
	type UpsertTranslationInput,
} from "./translations/input";
export {
	type CreateTimelineInput,
	type UpdateTimelineInput,
	type CreateSessionInput,
	type UpdateSessionInput,
	type CreateProgramInput,
	type UpdateProgramInput,
} from "./timelines/input";
export {
	type TemplateVariableInput,
	type CreateTemplateInput,
	type UpdateTemplateInput,
} from "./templates/input";
