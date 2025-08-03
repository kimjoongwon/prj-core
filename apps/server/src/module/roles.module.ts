import { Module } from "@nestjs/common";
import { RolesController, RolesRepository, RolesService } from "@shared";

@Module({
	controllers: [RolesController],
	providers: [RolesService, RolesRepository],
})
export class RolesModule {}
