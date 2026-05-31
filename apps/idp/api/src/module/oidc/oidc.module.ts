import {
	IDP_OIDC_PROVIDER_SERVICE,
	OidcUseCaseProviders,
} from "@cocrepo/usecase";
import { Module, type OnModuleInit } from "@nestjs/common";
import { CqrsModule } from "@nestjs/cqrs";
import { AccountService } from "./account.service";
import { DirectPrismaProvider } from "./direct-prisma.provider";
import { DirectUserRepository } from "./direct-user.repository";
import { RedisOidcAdapterFactory } from "./oidc.adapter";
import { OidcController } from "./oidc.controller";
import { OidcClientRepository } from "./oidc-client.repository";
import { OidcConfigurationService } from "./oidc-configuration.service";
import { OidcProviderService } from "./oidc-provider.service";

@Module({
	imports: [CqrsModule],
	controllers: [OidcController],
	providers: [
		// OIDC Core
		OidcProviderService,
		{
			provide: IDP_OIDC_PROVIDER_SERVICE,
			useExisting: OidcProviderService,
		},
		OidcConfigurationService,
		AccountService,
		...OidcUseCaseProviders,

		// Data Access (DirectPrismaProvider로 CLS 프록시 우회 - onModuleInit에서도 안전하게 동작)
		DirectPrismaProvider,
		RedisOidcAdapterFactory,
		OidcClientRepository,
		DirectUserRepository,
	],
	exports: [
		OidcProviderService,
		DirectPrismaProvider,
		DirectUserRepository,
		OidcClientRepository,
	],
})
export class OidcModule implements OnModuleInit {
	constructor(
		private readonly oidcProviderService: OidcProviderService,
		private readonly directPrismaProvider: DirectPrismaProvider,
	) {}

	async onModuleInit() {
		await this.directPrismaProvider.getClient();
		await this.oidcProviderService.initialize();
	}
}
