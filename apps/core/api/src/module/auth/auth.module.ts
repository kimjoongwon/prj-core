import { JwtStrategy } from "@cocrepo/be-common";
import { SpaceContext } from "@cocrepo/context";
import {
	AbilityAggregate,
	AuthAuditLogAggregate,
	EmailVerificationAggregate,
	RoleAggregate,
	SpaceAggregate,
} from "@cocrepo/aggregate";
import { OidcClient } from "@cocrepo/client";
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
	UserPoliciesRepository,
	UsersRepository,
} from "@cocrepo/repository";
import {
	AuthCacheService,
	EmailProvider,
	EmailService,
	IDP_INTERACTION_LOGIN_SERVICE,
	InteractionLoginService,
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
		{
			provide: IDP_INTERACTION_LOGIN_SERVICE,
			useExisting: InteractionLoginService,
		},
		OidcClient,
		AbilityAggregate,
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
