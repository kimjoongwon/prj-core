import { RolesRepository } from "@cocrepo/repository";
import { RolesApplicationService } from "@cocrepo/app";
import { RolesService } from "@cocrepo/service";
import { Module } from "@nestjs/common";
import { RolesController } from "./roles.controller";

@Module({
	controllers: [RolesController],
	providers: [
		RolesApplicationService,
		RolesService,
		RolesRepository,
	],
	exports: [RolesApplicationService],
})
export class RolesModule {}
