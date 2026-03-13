import { AuthAuditLogsRepository } from "@cocrepo/repository";
import { IdpAccountFacade } from "@cocrepo/facade";
import { Module } from "@nestjs/common";
import { IdpAccountsController } from "./idp-accounts.controller";

@Module({
	controllers: [IdpAccountsController],
	providers: [
		IdpAccountFacade,
		AuthAuditLogsRepository,
	],
})
export class IdpAccountsModule {}
