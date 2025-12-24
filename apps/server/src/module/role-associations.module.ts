import { RoleAssociationsRepository } from "@cocrepo/repository";
import { RoleAssociationsService } from "@cocrepo/service";
import { Module } from "@nestjs/common";
import { RoleAssociationsController } from "@shared";

@Module({
	providers: [RoleAssociationsService, RoleAssociationsRepository],
	controllers: [RoleAssociationsController],
})
export class RoleAssociationsModule {}
