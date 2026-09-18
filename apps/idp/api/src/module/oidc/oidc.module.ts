import { OidcController } from "@cocrepo/controller";
import {
	OidcDirectPrismaProvider,
	OidcDirectUsersRepository,
	OidcRuntimeClientsRepository,
	UsersRepository,
} from "@cocrepo/repository";
import {
	AccountService,
	OidcConfigurationService,
	OidcProviderService,
	RedisOidcAdapterFactory,
} from "@cocrepo/service";
import { OidcUseCaseProviders } from "@cocrepo/usecase";
import { Module, type OnModuleInit } from "@nestjs/common";
import { CqrsModule } from "@nestjs/cqrs";

@Module({
	imports: [CqrsModule],
	controllers: [OidcController],
	providers: [
		// OIDC Core
		OidcProviderService,
		OidcConfigurationService,
		AccountService,
		...OidcUseCaseProviders,

		// Data Access (DirectPrismaProvider로 CLS 프록시 우회 - onModuleInit에서도 안전하게 동작)
		OidcDirectPrismaProvider,
		RedisOidcAdapterFactory,
		OidcRuntimeClientsRepository,
		OidcDirectUsersRepository,
		UsersRepository,
	],
	exports: [
		OidcProviderService,
		OidcDirectPrismaProvider,
		OidcDirectUsersRepository,
		OidcRuntimeClientsRepository,
	],
})
export class OidcModule implements OnModuleInit {
	constructor(
		private readonly oidcProviderService: OidcProviderService,
		private readonly directPrismaProvider: OidcDirectPrismaProvider,
	) {}

	async onModuleInit() {
		await this.directPrismaProvider.getClient();
		await this.oidcProviderService.initialize();
	}
}
