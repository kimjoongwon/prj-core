import { TenantAccessRequestAggregateRoot } from "@cocrepo/aggregate";
import {
	TenantAccessRequestsRepository,
	TenantsRepository,
	UsersRepository,
} from "@cocrepo/repository";
import { AuthContext } from "@cocrepo/service";
import {
	TenantAccessRequestCommandHandlers,
	TenantAccessRequestQueryHandlers,
} from "@cocrepo/usecase";
import { Module } from "@nestjs/common";
import { CqrsModule } from "@nestjs/cqrs";
import { TenantAccessRequestsController } from "./tenant-access-requests.controller";

@Module({
	imports: [CqrsModule],
	controllers: [TenantAccessRequestsController],
	providers: [
		TenantAccessRequestAggregateRoot,
		TenantAccessRequestsRepository,
		TenantsRepository,
		UsersRepository,
		AuthContext,
		...TenantAccessRequestCommandHandlers,
		...TenantAccessRequestQueryHandlers,
	],
})
export class TenantAccessRequestsModule {}
