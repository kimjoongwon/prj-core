import {
	AccountService as ServiceAccountService,
	DirectPrismaProvider as ServiceDirectPrismaProvider,
	DirectUserRepository as ServiceDirectUserRepository,
	OidcClientRepository as ServiceOidcClientRepository,
	OidcConfigurationService as ServiceOidcConfigurationService,
	OidcProviderService as ServiceOidcProviderService,
	RedisOidcAdapterFactory as ServiceRedisOidcAdapterFactory,
} from "@cocrepo/service";
import {
	IDP_OIDC_PROVIDER_SERVICE,
	OidcUseCaseProviders,
} from "@cocrepo/usecase";
import { Module, type OnModuleInit } from "@nestjs/common";
import { CqrsModule } from "@nestjs/cqrs";
import { OidcController } from "./oidc.controller";

@Module({
	imports: [CqrsModule],
	controllers: [OidcController],
	providers: [
		// OIDC Core
		ServiceOidcProviderService,
		{
			provide: IDP_OIDC_PROVIDER_SERVICE,
			useExisting: ServiceOidcProviderService,
		},
		ServiceOidcConfigurationService,
		ServiceAccountService,
		...OidcUseCaseProviders,

		// Data Access (DirectPrismaProvider로 CLS 프록시 우회 - onModuleInit에서도 안전하게 동작)
		ServiceDirectPrismaProvider,
		ServiceRedisOidcAdapterFactory,
		ServiceOidcClientRepository,
		ServiceDirectUserRepository,
	],
	exports: [
		ServiceOidcProviderService,
		ServiceDirectPrismaProvider,
		ServiceDirectUserRepository,
		ServiceOidcClientRepository,
	],
})
export class OidcModule implements OnModuleInit {
	constructor(
		private readonly oidcProviderService: ServiceOidcProviderService,
		private readonly directPrismaProvider: ServiceDirectPrismaProvider,
	) {}

	async onModuleInit() {
		await this.directPrismaProvider.getClient();
		await this.oidcProviderService.initialize();
	}
}
