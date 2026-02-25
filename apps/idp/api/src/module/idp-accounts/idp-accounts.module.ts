import { AuthAuditLogsRepository } from "@cocrepo/repository";
import { IdpAccountService } from "@cocrepo/service";
import { Module } from "@nestjs/common";
import { IdpAccountsController } from "./idp-accounts.controller";

@Module({
	controllers: [IdpAccountsController],
	providers: [IdpAccountService, AuthAuditLogsRepository],
})
export class IdpAccountsModule {}
