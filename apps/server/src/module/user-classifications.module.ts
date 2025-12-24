import { UserClassificationsRepository } from "@cocrepo/repository";
import { UserClassificationsService } from "@cocrepo/service";
import { Module } from "@nestjs/common";
import { UserClassificationsController } from "@shared";

@Module({
	controllers: [UserClassificationsController],
	providers: [UserClassificationsService, UserClassificationsRepository],
})
export class UserClassificationsModule {}
