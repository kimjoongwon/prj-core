import { RolesRepository } from "@cocrepo/repository";
import { RolesService } from "@cocrepo/service";
import { Module } from "@nestjs/common";
import { RolesController } from "@shared";

@Module({
	controllers: [RolesController],
	providers: [RolesService, RolesRepository],
})
export class RolesModule {}
