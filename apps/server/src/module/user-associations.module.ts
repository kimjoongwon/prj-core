import { Module } from "@nestjs/common";
import {
	UserAssociationsController,
	UserAssociationsRepository,
	UserAssociationsService,
} from "@shared";

@Module({
	providers: [UserAssociationsService, UserAssociationsRepository],
	controllers: [UserAssociationsController],
})
export class UserAssociationsModule {}
