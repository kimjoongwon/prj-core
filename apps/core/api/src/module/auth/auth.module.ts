import {
	AbilityAggregate,
	AuthAuditLogAggregate,
	EmailVerificationAggregate,
	RoleAggregate,
	SpaceAggregate,
} from "@cocrepo/aggregate";
import { JwtStrategy } from "@cocrepo/be-common";
import { OidcClient } from "@cocrepo/client";
import { SpaceContext } from "@cocrepo/context";
import { AuthController } from "@cocrepo/controller";
import {
	AbilitiesRepository,
	AuthAuditLogsRepository,
	EmailVerificationsRepository,
	PolicyAbilitiesRepository,
	RolePoliciesRepository,
	RolesRepository,
	SpacesRepository,
	TemplatesRepository,
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
import { OidcClientsModule } from "../oidc-client/oidc-clients.module";

@Module({
	imports: [CqrsModule, OidcClientsModule, InteractionModule],
	providers: [
		...AuthUseCaseProviders,
		OidcClient,
		AbilityAggregate,
		AbilitiesRepository,
		PolicyAbilitiesRepository,
		RolePoliciesRepository,
		TokenService,
		TokenStorageService,
		RedisService,
		JwtStrategy,
		UserService,
		UsersRepository,
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
