import { Module } from "@nestjs/common";
import {
	RoleAssociationsController,
	RoleAssociationsRepository,
	RoleAssociationsService,
} from "@shared";

@Module({
	providers: [RoleAssociationsService, RoleAssociationsRepository],
	controllers: [RoleAssociationsController],
})
export class RoleAssociationsModule {}
