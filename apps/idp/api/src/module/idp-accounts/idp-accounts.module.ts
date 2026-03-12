import { AuthAuditLogsRepository } from "@cocrepo/repository";
import { IdpAccountApplicationService } from "@cocrepo/app";
import { Module } from "@nestjs/common";
import { IdpAccountsController } from "./idp-accounts.controller";

@Module({
	controllers: [IdpAccountsController],
	providers: [
		IdpAccountApplicationService,
		AuthAuditLogsRepository,
	],
})
export class IdpAccountsModule {}
