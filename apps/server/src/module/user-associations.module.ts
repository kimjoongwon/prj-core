import { UserAssociationsRepository } from "@cocrepo/repository";
import { UserAssociationsService } from "@cocrepo/service";
import { Module } from "@nestjs/common";
import { UserAssociationsController } from "@shared";

@Module({
	providers: [UserAssociationsService, UserAssociationsRepository],
	controllers: [UserAssociationsController],
})
export class UserAssociationsModule {}
