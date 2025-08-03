import { Module } from "@nestjs/common";
import {
	UserClassificationsController,
	UserClassificationsRepository,
	UserClassificationsService,
} from "@shared";

@Module({
	controllers: [UserClassificationsController],
	providers: [UserClassificationsService, UserClassificationsRepository],
})
export class UserClassificationsModule {}
