// I18n
export { I18nModule, I18nTranslationService } from "./i18n";
export * from "./idp";

// Support services
// Aggregate root service providers live in @cocrepo/aggregate.

export { AuthCacheService } from "./auth/auth-cache.service";
export type { OidcStatePayload } from "./auth/oidc-state-payload";
export type { SessionInfo } from "./auth/session-info";
export type { SessionMetadata } from "./auth/session-metadata";
export { TokenService } from "./auth/token.service";
export { TokenStorageService } from "./auth/token-storage.service";
export {
	EmailProvider,
	type EmailSendInput,
	EmailService,
	SmtpEmailProvider,
} from "./email";
export { EmailModule } from "./email/email.module";
export { MaskingService } from "./masking/masking.service";
export {
	ObjectStorageService,
	type PutObjectInput,
	type PutObjectResult,
	S3CompatibleStorageService,
} from "./object-storage";
export * from "./oidc";
export {
	applyRuntimeManagedOidcClientConfig,
	isRuntimeManagedOidcClientId,
	RUNTIME_MANAGED_OIDC_CLIENT_IDS,
} from "./oidc-runtime-client-config";
export { DatabaseConnectionException } from "./prisma/database-connection.exception";
export { createPrismaClient } from "./prisma/prisma.factory";
export { PrismaService } from "./prisma/prisma.service";
export { RedisService } from "./redis/redis.service";
export { type RenderedTemplateResult, TemplateService } from "./template";
export type { GetUsersResult } from "./user/get-users.result";
export { UserService } from "./user/user.service";
