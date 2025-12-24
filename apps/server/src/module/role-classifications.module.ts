import { RoleClassificationsRepository } from "@cocrepo/repository";
import { RoleClassificationsService } from "@cocrepo/service";
import { Module } from "@nestjs/common";
import { RoleClassificationsController } from "@shared";

@Module({
	controllers: [RoleClassificationsController],
	providers: [RoleClassificationsService, RoleClassificationsRepository],
})
export class RoleClassificationsModule {}
