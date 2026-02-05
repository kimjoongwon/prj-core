import { Module, type OnModuleInit } from "@nestjs/common";
import { OidcProviderService } from "./oidc-provider.service";
import { OidcController } from "./oidc.controller";
import { AccountService } from "./account.service";
import { PrismaOidcAdapterFactory } from "./oidc.adapter";
import { OidcClientRepository } from "./oidc-client.repository";
import { UsersRepository } from "@cocrepo/repository";
import { UsersService } from "@cocrepo/service";

@Module({
	controllers: [OidcController],
	providers: [
		OidcProviderService,
		AccountService,
		PrismaOidcAdapterFactory,
		OidcClientRepository,
		// User
		UsersRepository,
		UsersService,
	],
	exports: [OidcProviderService],
})
export class OidcModule implements OnModuleInit {
	constructor(private readonly oidcProviderService: OidcProviderService) {}

	async onModuleInit() {
		await this.oidcProviderService.initialize();
	}
}
