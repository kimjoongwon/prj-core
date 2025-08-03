import { Module } from "@nestjs/common";
import {
	RoleClassificationsController,
	RoleClassificationsRepository,
	RoleClassificationsService,
} from "@shared";

@Module({
	controllers: [RoleClassificationsController],
	providers: [RoleClassificationsService, RoleClassificationsRepository],
})
export class RoleClassificationsModule {}
