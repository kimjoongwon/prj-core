import { Module, type OnModuleInit } from "@nestjs/common";
import { OidcProviderService } from "./oidc-provider.service";
import { OidcController } from "./oidc.controller";
import { AccountService } from "./account.service";
import { PrismaOidcAdapterFactory } from "./oidc.adapter";
import { OidcClientRepository } from "./oidc-client.repository";
import {
	UsersRepository,
	RolesRepository,
	AbilitiesRepository,
	GrantsRepository,
} from "@cocrepo/repository";
import { UsersService, RolesService, AbilitiesService } from "@cocrepo/service";

@Module({
	controllers: [OidcController],
	providers: [
		OidcProviderService,
		AccountService,
		PrismaOidcAdapterFactory,
		OidcClientRepository,
		// User & Roles
		UsersRepository,
		UsersService,
		RolesRepository,
		RolesService,
		// Abilities (CASL)
		AbilitiesRepository,
		GrantsRepository,
		AbilitiesService,
	],
	exports: [OidcProviderService],
})
export class OidcModule implements OnModuleInit {
	constructor(private readonly oidcProviderService: OidcProviderService) {}

	async onModuleInit() {
		await this.oidcProviderService.initialize();
	}
}
