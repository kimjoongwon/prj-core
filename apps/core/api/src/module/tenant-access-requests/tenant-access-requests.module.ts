import { TenantAccessRequestAggregate } from "@cocrepo/aggregate";
import { TenantAccessRequestsController } from "@cocrepo/controller";
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

@Module({
	imports: [CqrsModule],
	controllers: [TenantAccessRequestsController],
	providers: [
		TenantAccessRequestAggregate,
		TenantAccessRequestsRepository,
		TenantsRepository,
		UsersRepository,
		AuthContext,
		...TenantAccessRequestCommandHandlers,
		...TenantAccessRequestQueryHandlers,
	],
})
export class TenantAccessRequestsModule {}
