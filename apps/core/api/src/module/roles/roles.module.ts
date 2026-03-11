import { RolesApplicationService } from "@cocrepo/app";
import { RolesRepository } from "@cocrepo/repository";
import { RolesService } from "@cocrepo/service";
import { Module } from "@nestjs/common";
import { RolesController } from "./roles.controller";

@Module({
	controllers: [RolesController],
	providers: [
		RolesApplicationService,
		// Services
		RolesService,
		// Repositories
		RolesRepository,
	],
	exports: [RolesApplicationService],
})
export class RolesModule {}
