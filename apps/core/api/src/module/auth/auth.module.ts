import {
	AbilityAggregateRoot,
	AuthAuditLogAggregateRoot,
	EmailVerificationAggregateRoot,
	RoleAggregateRoot,
	SpaceAggregateRoot,
} from "@cocrepo/aggregate";
import { OidcClient } from "@cocrepo/client";
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
	InteractionLoginService,
	JwtStrategy,
	RedisService,
	SmtpEmailProvider,
	SpaceContext,
	TemplateService,
	TokenService,
	TokenStorageService,
	UserService,
} from "@cocrepo/service";
import {
	AuthUseCaseProviders,
	IDP_INTERACTION_LOGIN_SERVICE,
} from "@cocrepo/usecase";
import { Module } from "@nestjs/common";
import { CqrsModule } from "@nestjs/cqrs";
import { InteractionModule } from "../interaction/interaction.module";
import { OidcClientsModule } from "../oidc-client/oidc-clients.module";
import { AuthController } from "./auth.controller";

@Module({
	imports: [CqrsModule, OidcClientsModule, InteractionModule],
	providers: [
		...AuthUseCaseProviders,
		{
			provide: IDP_INTERACTION_LOGIN_SERVICE,
			useExisting: InteractionLoginService,
		},
		OidcClient,
		AbilityAggregateRoot,
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
		RoleAggregateRoot,
		RolesRepository,
		SpaceAggregateRoot,
		SpacesRepository,
		SpaceContext,
		AuthAuditLogAggregateRoot,
		AuthAuditLogsRepository,
		AuthCacheService,
		EmailVerificationAggregateRoot,
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
