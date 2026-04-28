import { TenantAccessRequestFacade } from "@cocrepo/facade";
import {
	RolesRepository,
	SpacesRepository,
	TenantAccessRequestsRepository,
	TenantsRepository,
	UsersRepository,
} from "@cocrepo/repository";
import { AuthContext, TenantAccessRequestService } from "@cocrepo/service";
import { Module } from "@nestjs/common";
import { TenantAccessRequestsController } from "./tenant-access-requests.controller";

@Module({
	controllers: [TenantAccessRequestsController],
	providers: [
		TenantAccessRequestFacade,
		TenantAccessRequestService,
		TenantAccessRequestsRepository,
		TenantsRepository,
		UsersRepository,
		SpacesRepository,
		RolesRepository,
		AuthContext,
	],
	exports: [TenantAccessRequestFacade],
})
export class TenantAccessRequestsModule {}
