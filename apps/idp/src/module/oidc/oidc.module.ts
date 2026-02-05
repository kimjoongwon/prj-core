import { Module, type OnModuleInit } from "@nestjs/common";
import { AccountService } from "./account.service";
import { DirectUserRepository } from "./direct-user.repository";
import { RedisOidcAdapterFactory } from "./oidc.adapter";
import { OidcController } from "./oidc.controller";
import { OidcClientRepository } from "./oidc-client.repository";
import { OidcConfigurationService } from "./oidc-configuration.service";
import { OidcProviderService } from "./oidc-provider.service";

@Module({
	controllers: [OidcController],
	providers: [
		// OIDC Core
		OidcProviderService,
		OidcConfigurationService,
		AccountService,

		// Data Access (Global PrismaClient 직접 주입 - IDP는 tenant 컨텍스트 없이 동작)
		RedisOidcAdapterFactory,
		OidcClientRepository,
		DirectUserRepository,
	],
	exports: [OidcProviderService, DirectUserRepository],
})
export class OidcModule implements OnModuleInit {
	constructor(private readonly oidcProviderService: OidcProviderService) {}

	async onModuleInit() {
		await this.oidcProviderService.initialize();
	}
}
