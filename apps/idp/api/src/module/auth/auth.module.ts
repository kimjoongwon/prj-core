import { AuthApplicationService } from "@cocrepo/app";
import { OidcFacade } from "@cocrepo/integration";
import {
	AuthAuditLogsRepository,
	RolesRepository,
	SpacesRepository,
	TemplatesRepository,
	UsersRepository,
} from "@cocrepo/repository";
import {
	AuthAuditLogService,
	AuthCacheService,
	EmailProvider,
	EmailService,
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
import { AuthController } from "./auth.controller";

@Module({
	providers: [
		AuthApplicationService,
		OidcFacade,
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
