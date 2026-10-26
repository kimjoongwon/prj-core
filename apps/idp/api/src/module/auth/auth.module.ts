import {
	AbilityAggregate,
	AuthAuditLogAggregate,
	EmailVerificationAggregate,
	OidcClientAggregate,
	RoleAggregate,
	SpaceAggregate,
} from "@cocrepo/aggregate";
import { JwtStrategy } from "@cocrepo/be-common";
import { OidcClient } from "@cocrepo/client";
import { SpaceContext } from "@cocrepo/context";
import { AuthController } from "@cocrepo/controller";
import {
	AuthAuditLogsRepository,
	EmailVerificationsRepository,
	OidcClientsRepository,
	RoleAssignmentsRepository,
	RolesRepository,
	SpacesRepository,
	TemplatesRepository,
	TenantsRepository,
	UsersRepository,
} from "@cocrepo/repository";
import {
	AuthCacheService,
	EmailProvider,
	EmailService,
	RedisService,
	SmtpEmailProvider,
	TemplateService,
	TokenService,
	TokenStorageService,
	UserService,
} from "@cocrepo/service";
import { AuthUseCaseProviders } from "@cocrepo/usecase";
import { Module } from "@nestjs/common";
import { CqrsModule } from "@nestjs/cqrs";
import { InteractionModule } from "../interaction/interaction.module";
import { OidcModule } from "../oidc/oidc.module";

@Module({
	imports: [CqrsModule, OidcModule, InteractionModule],
	providers: [
		...AuthUseCaseProviders,
		OidcClient,
		OidcClientAggregate,
		OidcClientsRepository,
		AbilityAggregate,
		RoleAssignmentsRepository,
		TokenService,
		TokenStorageService,
		RedisService,
		JwtStrategy,
		UserService,
		UsersRepository,
		TenantsRepository,
		RoleAggregate,
		RolesRepository,
		SpaceAggregate,
		SpacesRepository,
		SpaceContext,
		AuthAuditLogAggregate,
		AuthAuditLogsRepository,
		AuthCacheService,
		EmailVerificationAggregate,
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
	exports: [TokenStorageService, RedisService],
})
export class AuthModule {}
