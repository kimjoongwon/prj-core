import { AuthApplicationService } from "@cocrepo/app";
import { OidcFacade } from "@cocrepo/integration";
import {
	AbilitiesRepository,
	AuthAuditLogsRepository,
	EmailVerificationsRepository,
	PolicyAbilitiesRepository,
	RolePoliciesRepository,
	RolesRepository,
	SpacesRepository,
	TemplatesRepository,
	UserPoliciesRepository,
	UsersRepository,
} from "@cocrepo/repository";
import {
	AbilityService,
	AuthAuditLogService,
	AuthCacheService,
	EmailProvider,
	EmailService,
	EmailVerificationService,
	JwtStrategy,
	RedisService,
	RoleService,
	SmtpEmailProvider,
	SpaceContext,
	SpaceService,
	TemplateService,
	TokenService,
	TokenStorageService,
	UserService,
} from "@cocrepo/service";
import { Module } from "@nestjs/common";
import { OidcClientsModule } from "../oidc-client/oidc-clients.module";
import { AuthController } from "./auth.controller";

@Module({
	imports: [OidcClientsModule],
	providers: [
		AuthApplicationService,
		OidcFacade,
		AbilityService,
		AbilitiesRepository,
		PolicyAbilitiesRepository,
		RolePoliciesRepository,
		UserPoliciesRepository,
		TokenService,
		TokenStorageService,
		RedisService,
		JwtStrategy,
		UserService,
		UsersRepository,
		RoleService,
		RolesRepository,
		SpaceService,
		SpacesRepository,
		SpaceContext,
		AuthAuditLogService,
		AuthAuditLogsRepository,
		AuthCacheService,
		EmailVerificationService,
		EmailVerificationsRepository,
		SmtpEmailProvider,
		TemplateService,
		TemplatesRepository,
		{
			provide: EmailProvider,
			useExisting: SmtpEmailProvider,
		},
		EmailService,
	],
	controllers: [AuthController],
	exports: [AuthApplicationService, TokenStorageService, RedisService],
})
export class AuthModule {}
