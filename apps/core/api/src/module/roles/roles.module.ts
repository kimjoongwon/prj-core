import { RolesRepository } from "@cocrepo/repository";
import { RoleFacade } from "@cocrepo/facade";
import { RoleService } from "@cocrepo/service";
import { Module } from "@nestjs/common";
import { RolesController } from "./roles.controller";

@Module({
	controllers: [RolesController],
	providers: [
		RoleFacade,
		RoleService,
		RolesRepository,
	],
	exports: [RoleFacade],
})
export class RolesModule {}
