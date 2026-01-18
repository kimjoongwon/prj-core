import { RolesRepository } from "@cocrepo/repository";
import { RolesService } from "@cocrepo/service";
import { Module } from "@nestjs/common";
import { RolesController } from "./roles.controller";

@Module({
	controllers: [RolesController],
	providers: [
		// Services
		RolesService,
		// Repositories
		RolesRepository,
	],
	exports: [RolesService],
})
export class RolesModule {}
